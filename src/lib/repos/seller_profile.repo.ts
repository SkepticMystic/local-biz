import { E } from "$lib/const/error/error.const";
import { db } from "$lib/server/db/drizzle.db";
import {
  SellerProfileTable,
  type SellerProfile,
} from "$lib/server/db/models/seller_profile.model";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { and, DrizzleQueryError, eq } from "drizzle-orm";

const create = async (
  input: typeof SellerProfileTable.$inferInsert,
): Promise<App.Result<SellerProfile>> => {
  try {
    const [seller_profile] = await db
      .insert(SellerProfileTable)
      .values(input)
      .returning();

    if (!seller_profile) {
      Log.error({ input }, "SellerProfileRepo.create.error not found");

      return result.err({ message: "Failed to create seller profile" });
    } else {
      return result.suc(seller_profile);
    }
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "SellerProfileRepo.create.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "SellerProfileRepo.create.error unknown");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  }
};

const update = async (
  input: Partial<typeof SellerProfileTable.$inferInsert> & {
    id: string;
    user_id: string;
  },
): Promise<App.Result<SellerProfile>> => {
  console.log("SellerProfileRepo.update.input", input);

  try {
    const [seller_profile] = await db
      .update(SellerProfileTable)
      .set(input)
      .where(
        and(
          eq(SellerProfileTable.id, input.id),
          eq(SellerProfileTable.user_id, input.user_id),
        ),
      )
      .returning();

    if (!seller_profile) {
      Log.error({ input }, "SellerProfileRepo.update.error not found");

      return result.err(E.NOT_FOUND);
    } else {
      return result.suc(seller_profile);
    }
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "SellerProfileRepo.update.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "SellerProfileRepo.update.error unknown");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  }
};

const get_all_public = async () => {
  try {
    const seller_profiles = await db.query.seller_profile.findMany({
      where: (seller_profile, { eq }) =>
        eq(seller_profile.admin_approved, true),

      columns: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        description: true,
        createdAt: true,
      },
    });

    return result.suc(seller_profiles);
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "SellerProfileRepo.get_all_public.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "SellerProfileRepo.get_all_public.error unknown");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  }
};

const get_many_by_slugs = async (
  slugs: string[],
): Promise<App.Result<SellerProfile[]>> => {
  try {
    const seller_profiles = await db.query.seller_profile.findMany({
      where: (seller_profile, { inArray }) =>
        inArray(seller_profile.slug, slugs),
    });

    return result.suc(seller_profiles);
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "SellerProfileRepo.get_many_by_slugs.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "SellerProfileRepo.get_many_by_slugs.error unknown");

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
      .update(SellerProfileTable)
      .set({ admin_approved: input.admin_approved })
      .where(eq(SellerProfileTable.id, input.id))
      .execute();

    if (res.rowCount === 0) {
      Log.error(
        { input },
        "SellerProfileRepo.set_admin_approved.error not found",
      );

      return result.err({ message: "Seller profile not found" });
    } else {
      return result.suc();
    }
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "SellerProfileRepo.set_admin_approved.error DrizzleQueryError",
      );

      captureException(error);

      return result.err({ message: "Internal server error" });
    } else {
      Log.error(error, "SellerProfileRepo.set_admin_approved.error unknown");

      captureException(error);

      return result.err({ message: "Internal server error" });
    }
  }
};

export const SellerProfileRepo = {
  create,
  update,
  get_all_public,
  get_many_by_slugs,
  set_admin_approved,
};
