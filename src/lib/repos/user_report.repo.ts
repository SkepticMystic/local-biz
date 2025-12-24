import { db } from "$lib/server/db/drizzle.db";
import { UserReportTable } from "$lib/server/db/models/user_report.model";
import { Repo } from "./index.repo";

const create = async (input: typeof UserReportTable.$inferInsert) => {
  return Repo.insert_one(db.insert(UserReportTable).values(input).returning());
};

export const UserReportRepo = {
  create,
};
