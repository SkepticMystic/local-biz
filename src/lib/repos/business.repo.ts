import { E } from "$lib/const/error/error.const";
import { db } from "$lib/server/db/drizzle.db";
import { BusinessTable } from "$lib/server/db/models/business.model";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { and, DrizzleQueryError, eq } from "drizzle-orm";

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
      Log.error(
        { message: error.message },
        "BusinessRepo.create.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
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

const get_all_public = async () => {
  try {
    const businesses = await db.query.business.findMany({
      where: (business, { eq }) => eq(business.admin_approved, true),

      columns: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        createdAt: true,
        formatted_address: true,
      },
    });

    return result.suc(businesses);
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "BusinessRepo.get_all_public.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "BusinessRepo.get_all_public.error unknown");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  }
};

const get_all_by_user = async (user_id: string) => {
  try {
    const businesses = await db.query.business.findMany({
      where: (business, { eq }) => eq(business.user_id, user_id),

      columns: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        createdAt: true,
        formatted_address: true,
      },
    });

    return result.suc(businesses);
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "BusinessRepo.get_all_by_user.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "BusinessRepo.get_all_by_user.error unknown");

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
  get_all_by_user,
  set_admin_approved,
};
