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
import { captureException } from "@sentry/sveltekit";
import { and, DrizzleQueryError, eq } from "drizzle-orm";
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
  input: Partial<typeof BusinessTable.$inferInsert> & {
    id: string;
    user_id: string;
  },
): Promise<App.Result<Business>> => {
  try {
    const res = await BusinessRepo.update(input);

    return res;
  } catch (error) {
    Log.error(error, "BusinessService.update.error unknown");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

const delete_by_id = async (input: { id: string; user_id: string }) => {
  try {
    const res = await BusinessRepo.delete_by_id(input);
    if (!res.ok) {
      return res;
    }

    await ImageService.delete_many({
      user_id: input.user_id,

      resource_id: input.id,
      resource_kind: "business",
    });

    return res;
  } catch (error) {
    Log.error(error, "BusinessService.delete_by_id.error unknown");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

const set_admin_approved = async (input: {
  id: string;
  admin_approved: boolean;
}): Promise<App.Result<void>> => {
  try {
    const res = await BusinessRepo.set_admin_approved(input);

    if (!res.ok) {
      return res;
    }

    // TODO: Send email notification to user about approval status
    // const business = await BusinessRepo.get_by_id(input.id);
    // if (business.ok && business.data) {
    //   await EmailService.sendBusinessApprovalNotification({
    //     user_id: business.data.user_id,
    //     business_name: business.data.name,
    //     approved: input.admin_approved,
    //   });
    // }

    return res;
  } catch (error) {
    Log.error(error, "BusinessService.set_admin_approved.error unknown");

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
    if (error instanceof DrizzleQueryError) {
      Log.error(
        error,
        "BusinessService.admin_transfer_ownership.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(
        error,
        "BusinessService.admin_transfer_ownership.error unknown",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  }
};

export const BusinessService = {
  create,
  update,
  delete_by_id,
  set_admin_approved,
  admin_transfer_ownership,
};
