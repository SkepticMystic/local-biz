import { E } from "$lib/const/error/error.const";
import { db } from "$lib/server/db/drizzle.db";
import { ImageTable } from "$lib/server/db/models/image.model";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { DrizzleQueryError, eq } from "drizzle-orm";

const create = async (input: typeof ImageTable.$inferInsert) => {
  try {
    const [image] = await db.insert(ImageTable).values(input).returning();

    return result.suc(image);
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(error, "ImageRepo.create.error DrizzleQueryError");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "ImageRepo.create.error unknown");

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
      .update(ImageTable)
      .set({ admin_approved: input.admin_approved })
      .where(eq(ImageTable.id, input.id))
      .execute();

    if (res.rowCount === 0) {
      Log.error({ input }, "ImageRepo.set_admin_approved.error not found");

      return result.err(E.NOT_FOUND);
    } else {
      return result.suc();
    }
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "ImageRepo.set_admin_approved.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "ImageRepo.set_admin_approved.error unknown");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  }
};

export const ImageRepo = {
  create,

  set_admin_approved,
};
