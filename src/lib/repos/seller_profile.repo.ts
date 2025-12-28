import { db } from "$lib/server/db/drizzle.db";
import {
  SellerProfileTable,
  type SellerProfile,
} from "$lib/server/db/models/seller_profile.model";
import { and, eq } from "drizzle-orm";
import { Repo } from "./index.repo";

const create = async (
  input: typeof SellerProfileTable.$inferInsert,
): Promise<App.Result<SellerProfile>> => {
  return Repo.insert_one(
    db.insert(SellerProfileTable).values(input).returning(),
  );
};

const update_one = async (
  where: { id: string; user_id?: string },
  update: Partial<typeof SellerProfileTable.$inferInsert>,
): Promise<App.Result<SellerProfile>> => {
  console.log("SellerProfileRepo.update.input", where, update);

  return Repo.update_one(
    db
      .update(SellerProfileTable)
      .set(update)
      .where(
        and(
          eq(SellerProfileTable.id, where.id),
          where.user_id
            ? eq(SellerProfileTable.user_id, where.user_id)
            : undefined,
        ),
      )
      .returning(),
  );
};

const get_all_public = () =>
  Repo.query(
    db.query.seller_profile.findMany({
      where: (seller_profile, { isNotNull }) =>
        isNotNull(seller_profile.approved_at),

      columns: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        description: true,
        createdAt: true,
      },
    }),
  );

const get_many_by_slugs = async (
  slugs: string[],
): Promise<App.Result<SellerProfile[]>> =>
  Repo.query(
    db.query.seller_profile.findMany({
      where: (seller_profile, { inArray }) =>
        inArray(seller_profile.slug, slugs),
    }),
  );

export const SellerProfileRepo = {
  create,
  update_one,
  get_all_public,
  get_many_by_slugs,
};
