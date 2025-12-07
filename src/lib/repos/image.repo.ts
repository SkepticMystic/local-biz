import { E } from "$lib/const/error/error.const";
import { db } from "$lib/server/db/drizzle.db";
import { ImageTable, type Image } from "$lib/server/db/models/image.model";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { and, count, DrizzleQueryError, eq } from "drizzle-orm";

const build_image_where_clause = (
  input: Partial<Pick<Image, "id" | "resource_id" | "resource_kind">> & {
    user_id: string;
  },
) =>
  and(
    eq(ImageTable.user_id, input.user_id),

    input.id //
      ? eq(ImageTable.id, input.id)
      : undefined,
    input.resource_id
      ? eq(ImageTable.resource_id, input.resource_id)
      : undefined,
    input.resource_kind
      ? eq(ImageTable.resource_kind, input.resource_kind)
      : undefined,
  );

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

const count_images = async (
  input: Pick<Image, "resource_id" | "resource_kind" | "user_id">,
) => {
  try {
    const [existing_images] = await db
      .select({ count: count(ImageTable.id) })
      .from(ImageTable)
      .where(build_image_where_clause(input))
      .groupBy(ImageTable.resource_id);

    return result.suc(existing_images?.count ?? 0);
  } catch (error) {
    Log.error(error, "ImageRepo.count_images.error unknown");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

const delete_many = async (
  input: Partial<Pick<Image, "id" | "resource_id" | "resource_kind">> & {
    user_id: string;
  },
) => {
  try {
    const where = build_image_where_clause(input);

    const images = await db //
      .delete(ImageTable)
      .where(where)
      .returning();

    return result.suc(images);
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(error, "ImageRepo.delete.error DrizzleQueryError");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "ImageRepo.delete.error unknown");
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
  count: count_images,
  delete_many,

  set_admin_approved,
};
