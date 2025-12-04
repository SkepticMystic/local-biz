import { E } from "$lib/const/error/error.const";
import { db } from "$lib/server/db/drizzle.db";
import { BusinessTable } from "$lib/server/db/models/business.model";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { and, count, DrizzleQueryError, eq } from "drizzle-orm";
import { Repo } from "./index.repo";

const create = async (input: typeof BusinessTable.$inferInsert) => {
  try {
    const [business] = await db.insert(BusinessTable).values(input).returning();

    if (!business) {
      Log.error({ input }, "BusinessRepo.create.error not found");

      return result.err({ message: "Failed to create business" });
    } else {
      return result.suc(business);
    }
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      if (
        error.cause?.message.includes(
          "duplicate key value violates unique constraint",
        )
      ) {
        return result.err({
          path: ["name"] as const,
          message: "Business name already exists",
        });
      } else {
        Log.error(error, "BusinessRepo.create.error DrizzleQueryError");

        captureException(error);

        return result.err(E.INTERNAL_SERVER_ERROR);
      }
    } else {
      Log.error(error, "BusinessRepo.create.error unknown");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  }
};

const update = async (
  input: Partial<typeof BusinessTable.$inferInsert> & {
    id: string;
    user_id: string;
  },
) => {
  console.log("BusinessRepo.update.input", input);

  try {
    const [business] = await db
      .update(BusinessTable)
      .set(input)
      .where(
        and(
          eq(BusinessTable.id, input.id),
          eq(BusinessTable.user_id, input.user_id), //
        ),
      )
      .returning();

    if (!business) {
      Log.error({ input }, "BusinessRepo.update.error not found");

      return result.err(E.NOT_FOUND);
    } else {
      return result.suc(business);
    }
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "BusinessRepo.update.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "BusinessRepo.update.error unknown");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  }
};

const get_all_public = () =>
  Repo.query(() =>
    db.query.business.findMany({
      where: (business, { eq }) => eq(business.admin_approved, true),

      columns: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        category: true,
        tags: true,
        createdAt: true,
        google_place_id: true,
        formatted_address: true,
      },
    }),
  );

const count_all_public = () =>
  Repo.query(() =>
    db
      .select({ count: count(BusinessTable.id) })
      .from(BusinessTable)
      .where(eq(BusinessTable.admin_approved, true)),
  );

const get_all_by_user = (user_id: string) =>
  Repo.query(() =>
    db.query.business.findMany({
      where: (business, { eq }) => eq(business.user_id, user_id),

      columns: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        category: true,
        tags: true,
        createdAt: true,
        google_place_id: true,
        formatted_address: true,
      },
    }),
  );

const delete_by_id = async (input: { id: string; user_id: string }) => {
  try {
    const res = await db
      .delete(BusinessTable)
      .where(
        and(
          eq(BusinessTable.id, input.id), //
          eq(BusinessTable.user_id, input.user_id),
        ),
      )
      .execute();

    if (res.rowCount === 0) {
      Log.error({ input }, "BusinessRepo.delete_by_id.error not found");

      return result.err(E.NOT_FOUND);
    } else {
      return result.suc();
    }
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "BusinessRepo.delete_by_id.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "BusinessRepo.delete_by_id.error unknown");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  }
};

const set_admin_approved = async (input: {
  id: string;
  admin_approved: boolean;
}): Promise<App.Result<void>> => {
  try {
    const res = await db
      .update(BusinessTable)
      .set({ admin_approved: input.admin_approved })
      .where(eq(BusinessTable.id, input.id))
      .execute();

    if (res.rowCount === 0) {
      Log.error({ input }, "BusinessRepo.set_admin_approved.error not found");

      return result.err(E.NOT_FOUND);
    } else {
      return result.suc();
    }
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "BusinessRepo.set_admin_approved.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "BusinessRepo.set_admin_approved.error unknown");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  }
};

export const BusinessRepo = {
  create,
  update,
  get_all_public,
  count_all_public,
  get_all_by_user,
  delete_by_id,
  set_admin_approved,
};
