import { db } from "$lib/server/db/drizzle.db";
import { BusinessTable } from "$lib/server/db/models/business.model";
import { and, count, eq } from "drizzle-orm";
import { Repo } from "./index.repo";

const create = async (input: typeof BusinessTable.$inferInsert) => {
  return Repo.insert_one(db.insert(BusinessTable).values(input).returning());
};

const update = async (
  input: Partial<typeof BusinessTable.$inferInsert> & {
    id: string;
    user_id: string;
  },
) => {
  console.log("BusinessRepo.update.input", input);

  return Repo.update_one(
    db
      .update(BusinessTable)
      .set(input)
      .where(
        and(
          eq(BusinessTable.id, input.id),
          eq(BusinessTable.user_id, input.user_id), //
        ),
      )
      .returning(),
  );
};

const get_all_public = () =>
  Repo.query(
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

const delete_by_id = async (input: { id: string; user_id: string }) => {
  return Repo.delete_one(
    db
      .delete(BusinessTable)
      .where(
        and(
          eq(BusinessTable.id, input.id), //
          eq(BusinessTable.user_id, input.user_id),
        ),
      )
      .execute(),
  );
};

const set_admin_approved = async (input: {
  id: string;
  admin_approved: boolean;
}): Promise<App.Result<void>> => {
  return Repo.update_void(
    db
      .update(BusinessTable)
      .set({ admin_approved: input.admin_approved })
      .where(eq(BusinessTable.id, input.id))
      .execute(),
  );
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
