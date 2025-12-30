import { db } from "$lib/server/db/drizzle.db";
import { BusinessTable } from "$lib/server/db/models/business.model";
import { and, count, eq, isNotNull } from "drizzle-orm";
import { Repo } from "./index.repo";

const create = async (input: typeof BusinessTable.$inferInsert) =>
  Repo.insert_one(
    db //
      .insert(BusinessTable)
      .values(input)
      .returning(),
  );

const update_one = async (
  where: { id: string; user_id?: string },
  update: Partial<typeof BusinessTable.$inferInsert>,
) =>
  Repo.update_one(
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

const get_all_public = () =>
  Repo.query(
    db.query.business.findMany({
      where: (business, { isNotNull }) => isNotNull(business.approved_at),
      orderBy: (_, { sql }) => [sql.raw("RANDOM()")],

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
      .where(isNotNull(BusinessTable.approved_at)),
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

export const BusinessRepo = {
  create,
  update_one,
  get_all_public,
  count_all_public,
  get_all_by_user,
  delete_by_id,
};
