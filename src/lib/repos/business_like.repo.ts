import { E } from "$lib/const/error/error.const";
import { db } from "$lib/server/db/drizzle.db";
import {
  BusinessLikeTable,
  type BusinessLike,
} from "$lib/server/db/models/business_like.model";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { and, count, DrizzleQueryError, eq, inArray } from "drizzle-orm";

const create = async (
  input: typeof BusinessLikeTable.$inferInsert,
): Promise<App.Result<BusinessLike>> => {
  try {
    const [business_like] = await db
      .insert(BusinessLikeTable)
      .values(input)
      .returning();

    if (!business_like) {
      Log.error({ input }, "BusinessLikeRepo.create.error not found");

      return result.err({ message: "Failed to create business like" });
    } else {
      return result.suc(business_like);
    }
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "BusinessLikeRepo.create.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "BusinessLikeRepo.create.error unknown");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  }
};

const delete_by_user_and_business = async (input: {
  user_id: string;
  business_id: string;
}): Promise<App.Result<void>> => {
  try {
    const res = await db
      .delete(BusinessLikeTable)
      .where(
        and(
          eq(BusinessLikeTable.user_id, input.user_id),
          eq(BusinessLikeTable.business_id, input.business_id),
        ),
      )
      .execute();

    if (res.rowCount === 0) {
      Log.error(
        { input },
        "BusinessLikeRepo.delete_by_user_and_business.error not found",
      );

      return result.err({ message: "Business like not found" });
    }

    return result.suc();
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "BusinessLikeRepo.delete_by_user_and_business.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(
        error,
        "BusinessLikeRepo.delete_by_user_and_business.error unknown",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  }
};

const get_many_counts_by_business_ids = async (
  business_ids: string[],
): Promise<App.Result<Map<string, number>>> => {
  try {
    const map = new Map();

    if (business_ids.length === 0) {
      return result.suc(map);
    }

    const results = await db
      .select({
        count: count(),
        business_id: BusinessLikeTable.business_id,
      })
      .from(BusinessLikeTable)
      .where(inArray(BusinessLikeTable.business_id, business_ids))
      .groupBy(BusinessLikeTable.business_id);

    for (const row of results) {
      map.set(row.business_id, row.count);
    }

    return result.suc(map);
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "BusinessLikeRepo.get_many_counts_by_business_ids.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(
        error,
        "BusinessLikeRepo.get_many_counts_by_business_ids.error unknown",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  }
};

export const BusinessLikeRepo = {
  create,
  delete_by_user_and_business,
  get_many_counts_by_business_ids,
};
