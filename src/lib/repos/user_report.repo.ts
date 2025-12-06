import { E } from "$lib/const/error/error.const";
import { db } from "$lib/server/db/drizzle.db";
import { UserReportTable } from "$lib/server/db/models/user_report.model";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { DrizzleQueryError } from "drizzle-orm";

const create = async (input: typeof UserReportTable.$inferInsert) => {
  try {
    const [user_report] = await db
      .insert(UserReportTable)
      .values(input)
      .returning();

    return result.suc(user_report);
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(error, "UserReportRepo.create.error DrizzleQueryError");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "UserReportRepo.create.error unknown");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  }
};

export const UserReportRepo = {
  create,
};
