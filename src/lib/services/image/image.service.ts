import { E } from "$lib/const/error/error.const";
import { IMAGE_HOSTING } from "$lib/const/image/image_hosting.const";
import { ImageRepo } from "$lib/repos/image.repo";
import { db } from "$lib/server/db/drizzle.db";
import { ImageTable, type Image } from "$lib/server/db/models/image.model";
import { Format } from "$lib/utils/format.util";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { and, count, eq } from "drizzle-orm";
import { ImageHostingService } from "./image_hosting.service";
import { ThumbhashService } from "./thumbhash.image.service";
import { ResourceService } from "../resource/resource.service";

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

const check_count_limit = async (
  input: Pick<Image, "resource_id" | "resource_kind" | "user_id">,
) => {
  try {
    const [existing_images] = await db
      .select({ count: count(ImageTable.id) })
      .from(ImageTable)
      .where(build_image_where_clause(input))
      .groupBy(ImageTable.resource_id);

    if (
      // NOTE: If there are no images, existing_images will be undefined
      existing_images &&
      existing_images.count >= IMAGE_HOSTING.LIMITS.MAX_COUNT.PER_RESOURCE
    ) {
      return result.err({
        status: 429,
        message: `Image limit reached for this ${input.resource_kind} (${IMAGE_HOSTING.LIMITS.MAX_COUNT.PER_RESOURCE}). Please delete existing images before uploading more`,
      });
    }

    return result.suc(existing_images?.count ?? 0);
  } catch (error) {
    Log.error(error, "ImageService.check_count_limit.error");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

const set_admin_approved = async (input: {
  id: string;
  admin_approved: boolean;
}): Promise<App.Result<void>> => {
  try {
    const res = await ImageRepo.set_admin_approved(input);

    return res;
  } catch (error) {
    Log.error(error, "BusinessService.set_admin_approved.error unknown");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

export const ImageService = {
  upload: async (
    file: File,
    input: Pick<Image, "resource_id" | "resource_kind" | "user_id">,
  ): Promise<App.Result<Image>> => {
    if (file.size > IMAGE_HOSTING.LIMITS.MAX_FILE_SIZE_BYTES) {
      return result.err({
        status: 413,
        message: `Image exceeds size limit of ${Format.number(
          IMAGE_HOSTING.LIMITS.MAX_FILE_SIZE_BYTES / (1024 * 1024),
          {
            style: "unit",
            unit: "megabyte",
            unitDisplay: "long",
            maximumFractionDigits: 1,
          },
        )}`,
      });
    }

    const [count_limit, resource] = await Promise.all([
      check_count_limit(input),
      ResourceService.get_by_kind_and_id(input),
    ]);

    if (!resource || resource.user_id !== input.user_id) {
      return result.err({ message: "Resource not found" });
    } else if (!count_limit.ok) {
      return count_limit;
    }

    const [upload, thumbhash] = await Promise.all([
      ImageHostingService.upload(file),
      // NOTE: Calling this second in line seems to help with the timeout issue
      ThumbhashService.generate(file),
    ]);
    if (!upload.ok) return upload;

    const res = await ImageRepo.create({
      ...input,
      url: upload.data.image.url,
      response: upload.data.response,
      provider: ImageHostingService.provider,
      external_id: upload.data.image.external_id,
      thumbhash: thumbhash.ok ? thumbhash.data : null,
    });

    return res;
  },

  delete: async (
    input: Partial<Pick<Image, "id" | "resource_id" | "resource_kind">> & {
      user_id: string;
    },
  ): Promise<App.Result<null>> => {
    const where = build_image_where_clause(input);

    const images = await db.query.image.findMany({
      where,
      columns: { external_id: true },
    });

    if (images.length === 0) {
      return result.err(E.NOT_FOUND);
    }

    await Promise.all([
      db.delete(ImageTable).where(where),

      ...images.map((image) => ImageHostingService.delete(image.external_id)),
    ]);

    return result.suc(null);
  },

  set_admin_approved,
};
