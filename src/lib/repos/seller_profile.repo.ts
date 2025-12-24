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

const update = async (
  input: Partial<typeof SellerProfileTable.$inferInsert> & {
    id: string;
    user_id: string;
  },
): Promise<App.Result<SellerProfile>> => {
  console.log("SellerProfileRepo.update.input", input);

  return Repo.update_one(
    db
      .update(SellerProfileTable)
      .set(input)
      .where(
        and(
          eq(SellerProfileTable.id, input.id),
          eq(SellerProfileTable.user_id, input.user_id),
        ),
      )
      .returning(),
  );
};

const get_all_public = () =>
  Repo.query(
    db.query.seller_profile.findMany({
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

const set_admin_approved = async (input: {
  id: string;
  admin_approved: boolean;
}): Promise<App.Result<void>> => {
  return Repo.update_void(
    db
      .update(SellerProfileTable)
      .set({ admin_approved: input.admin_approved })
      .where(eq(SellerProfileTable.id, input.id))
      .execute(),
  );
};

export const SellerProfileRepo = {
  create,
  update,
  get_all_public,
  get_many_by_slugs,
  set_admin_approved,
};
