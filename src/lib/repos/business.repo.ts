import { db } from "$lib/server/db/drizzle.db";
import { BusinessTable } from "$lib/server/db/models/business.model";
import { and, count, eq } from "drizzle-orm";
import { Repo } from "./index.repo";

const create = async (input: typeof BusinessTable.$inferInsert) =>
  Repo.insert_one(
    db //
      .insert(BusinessTable)
      .values(input)
      .returning(),
  );

const update = async (
  where: { id: string; user_id?: string },
  update: Partial<typeof BusinessTable.$inferInsert>,
) => {
  console.log("BusinessRepo.update", where, update);

  return await Repo.update_one(
    db
      .update(BusinessTable)
      .set(update)
      .where(
        and(
          eq(BusinessTable.id, where.id),
          where.user_id ? eq(BusinessTable.user_id, where.user_id) : undefined,
        ),
      )
      .returning(),
  );
};

const get_all_public = () =>
  Repo.query(
    db.query.business.findMany({
      where: (business, { eq }) => eq(business.admin_approved, true),
      orderBy: (business, { desc }) => [desc(business.createdAt)],

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
  Repo.query(
    db
      .select({ count: count(BusinessTable.id) })
      .from(BusinessTable)
      .where(eq(BusinessTable.admin_approved, true)),
  );

const get_all_by_user = (user_id: string) =>
  Repo.query(
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

const delete_by_id = (id: string) =>
  Repo.delete_one(
    db
      .delete(BusinessTable) //
      .where(eq(BusinessTable.id, id))
      .execute(),
  );

const set_admin_approved = async (input: {
  id: string;
  admin_approved: boolean;
}): Promise<App.Result<void>> =>
  Repo.update_void(
    db
      .update(BusinessTable)
      .set({ admin_approved: input.admin_approved })
      .where(eq(BusinessTable.id, input.id))
      .execute(),
  );

export const BusinessRepo = {
  create,
  update,
  get_all_public,
  count_all_public,
  get_all_by_user,
  delete_by_id,
  set_admin_approved,
};
