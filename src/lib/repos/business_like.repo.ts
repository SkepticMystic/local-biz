import { db } from "$lib/server/db/drizzle.db";
import { BusinessLikeTable } from "$lib/server/db/models/business_like.model";
import { result } from "$lib/utils/result.util";
import { and, count, eq, inArray } from "drizzle-orm";
import { Repo } from "./index.repo";

const create = async (
  input: typeof BusinessLikeTable.$inferInsert,
): Promise<App.Result<null>> => {
  const res = await Repo.insert_one(
    db.insert(BusinessLikeTable).values(input).returning(),
  );

  if (res.ok || res.error.code === "DUPLICATE") {
    return result.suc(null);
  } else {
    return res;
  }
};

const delete_by_user_and_business = async (input: {
  user_id: string;
  business_id: string;
}): Promise<App.Result<void>> => {
  return Repo.delete_one(
    db
      .delete(BusinessLikeTable)
      .where(
        and(
          eq(BusinessLikeTable.user_id, input.user_id),
          eq(BusinessLikeTable.business_id, input.business_id),
        ),
      )
      .execute(),
  );
};

const get_many_counts_by_business_ids = async (
  business_ids: string[],
): Promise<App.Result<Map<string, number>>> => {
  const map = new Map();

  if (business_ids.length === 0) {
    return result.suc(map);
  }

  const results = await Repo.query(
    db
      .select({
        count: count(),
        business_id: BusinessLikeTable.business_id,
      })
      .from(BusinessLikeTable)
      .where(inArray(BusinessLikeTable.business_id, business_ids))
      .groupBy(BusinessLikeTable.business_id),
  );

  if (!results.ok) {
    return results;
  }

  for (const row of results.data) {
    map.set(row.business_id, row.count);
  }

  return result.suc(map);
};

export const BusinessLikeRepo = {
  create,
  delete_by_user_and_business,
  get_many_counts_by_business_ids,
};
