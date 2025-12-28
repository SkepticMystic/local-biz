import { EMAIL } from "$lib/const/email.const";
import { E } from "$lib/const/error/error.const";
import { BusinessRepo } from "$lib/repos/business.repo";
import { BusinessLikeRepo } from "$lib/repos/business_like.repo";
import { Repo } from "$lib/repos/index.repo";
import { db } from "$lib/server/db/drizzle.db";
import type { User } from "$lib/server/db/models/auth.model";
import {
  BusinessTable,
  type Business,
} from "$lib/server/db/models/business.model";
import { ImageTable } from "$lib/server/db/models/image.model";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { Strings } from "$lib/utils/strings.util";
import * as Sentry from "@sentry/sveltekit";
import { captureException } from "@sentry/sveltekit";
import { waitUntil } from "@vercel/functions";
import { and, eq } from "drizzle-orm";
import { EmailService } from "../email.service";
import { ImageService } from "../image/image.service";

const create = async (
  input: Omit<typeof BusinessTable.$inferInsert, "slug">,
): Promise<App.Result<Business>> => {
  try {
    const res = await BusinessRepo.create({
      ...input,
      slug: Strings.slugify(input.name),
    });

    if (res.ok) {
      await Promise.all([
        BusinessLikeRepo.create({
          user_id: input.user_id,
          business_id: res.data.id,
        }),

        EmailService.send(
          EMAIL.TEMPLATES["admin-new-business-form"]({ business: res.data }),
        ),
      ]);
    } else if (res.error.code === "DUPLICATE") {
      return result.err({
        ...E.INVALID_INPUT,
        path: ["name"],
        message: "Business already exists",
      });
    }

    return res;
  } catch (error) {
    Log.error(error, "BusinessService.create.error unknown");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

const update = async (
  where: { id: string; user_id?: string },
  update: Partial<typeof BusinessTable.$inferInsert>,
): Promise<App.Result<Business>> => {
  try {
    const res = await BusinessRepo.update_one(where, update);

    return res;
  } catch (error) {
    Log.error(error, "BusinessService.update.error unknown");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

const delete_by_id = async (input: { id: string; user_id: string }) => {
  try {
    const business = await Repo.query(
      db.query.business.findFirst({
        columns: { user_id: true },
        where: (business, { eq }) => eq(business.id, input.id),
      }),
    );

    if (!business.ok) {
      return business;
    } else if (!business.data) {
      Sentry.metrics.count("db.not_found", 1, {
        attributes: { input, table: "business" },
      });
      return result.err(E.NOT_FOUND);
    } else if (business.data.user_id !== input.user_id) {
      Sentry.metrics.count("db.forbidden", 1, {
        attributes: { input, table: "business" },
      });
      return result.err(E.FORBIDDEN);
    }

    const res = await BusinessRepo.delete_by_id(input.id);
    if (!res.ok) {
      return res;
    }

    waitUntil(
      ImageService.delete_many({
        user_id: input.user_id,

        resource_id: input.id,
        resource_kind: "business",
      }),
    );

    return res;
  } catch (error) {
    Log.error(error, "BusinessService.delete_by_id.error unknown");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

const toggle_approved_at = async (
  id: string,
): Promise<App.Result<Business>> => {
  try {
    const business = await Repo.query(
      db.query.business.findFirst({
        where: (business, { eq }) => eq(business.id, id),
        columns: { approved_at: true },
      }),
    );

    if (!business.ok) {
      return business;
    } else if (!business.data) {
      return result.err(E.NOT_FOUND);
    }

    const res = await BusinessRepo.update_one(
      { id },
      { approved_at: business.data.approved_at ? null : new Date() },
    );

    // TODO: Send email notification to user about approval status
    // if (res.ok) {
    //   await EmailService.sendBusinessApprovalNotification({
    //     user_id: business.data.user_id,
    //     business_name: business.data.name,
    //     approved: res.data.approved_at !== null,
    //   });
    // }

    return res;
  } catch (error) {
    Log.error(error, "BusinessService.toggle_approved_at.error unknown");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

const admin_transfer_ownership = async (input: {
  business_id: string;
  target_user_email: string;
}): Promise<App.Result<{ target_user: User }>> => {
  try {
    const [business, target_user] = await Promise.all([
      Repo.query(
        db.query.business.findFirst({
          where: (business, { eq }) => eq(business.id, input.business_id),
        }),
      ),

      Repo.query(
        db.query.user.findFirst({
          where: (user, { eq }) => eq(user.email, input.target_user_email),
        }),
      ),
    ]);

    if (!business.ok) {
      return business;
    } else if (!target_user.ok) {
      return target_user;
    } else if (!business.data || !target_user.data) {
      Log.info(
        { business, target_user },
        "BusinessService.admin_transfer_ownership.error not_found",
      );

      return result.err(E.NOT_FOUND);
    }

    const [business_update, image_update] = await Promise.all([
      Repo.update(
        db
          .update(BusinessTable)
          .set({ user_id: target_user.data.id })
          .where(eq(BusinessTable.id, input.business_id))
          .returning(),
      ),

      Repo.update(
        db
          .update(ImageTable)
          .set({ user_id: target_user.data.id })
          .where(
            and(
              eq(ImageTable.resource_kind, "business"),
              eq(ImageTable.resource_id, input.business_id),
            ),
          )
          .returning(),
      ),
    ]);

    if (!business_update.ok) {
      return business_update;
    } else if (!image_update.ok) {
      return image_update;
    }

    return result.suc({
      target_user: target_user.data,
    });
  } catch (error) {
    Log.error(error, "BusinessService.admin_transfer_ownership.error unknown");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

const admin_delete = async (business_id: string) => {
  const res = await BusinessRepo.delete_by_id(business_id);
  if (!res.ok) {
    return res;
  }

  waitUntil(
    ImageService.delete_many({
      resource_id: business_id,
      resource_kind: "business",
    }),
  );

  return res;
};

export const BusinessService = {
  create,
  update,
  delete_by_id,
  toggle_approved_at,
  admin_transfer_ownership,
  admin_delete,
};
