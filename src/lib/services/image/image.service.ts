import { E } from "$lib/const/error/error.const";
import { IMAGE_HOSTING } from "$lib/const/image/image_hosting.const";
import { ImageRepo } from "$lib/repos/image.repo";
import { Repo } from "$lib/repos/index.repo";
import { db } from "$lib/server/db/drizzle.db";
import { type Image } from "$lib/server/db/models/image.model";
import { Format } from "$lib/utils/format.util";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { waitUntil } from "@vercel/functions";
import { transformUrl } from "unpic";
import { AIModerationService } from "../ai/moderation/moderation.ai.service";
import { ResourceService } from "../resource/resource.service";
import { ImageHostingService } from "./image_hosting.service";
import { ThumbhashService } from "./thumbhash.image.service";

const check_count_limit = async (
  input: Pick<Image, "resource_id" | "resource_kind" | "user_id">,
) => {
  const count = await ImageRepo.count(input);

  if (!count.ok) {
    return count;
  } else if (count.data >= IMAGE_HOSTING.LIMITS.MAX_COUNT.PER_RESOURCE) {
    return result.err({
      status: 429,
      message: `Image limit reached for this ${input.resource_kind} (${IMAGE_HOSTING.LIMITS.MAX_COUNT.PER_RESOURCE}). Please delete existing images before uploading more`,
    });
  }

  return count;
};

const toggle_approved_at = async (id: string): Promise<App.Result<Image>> => {
  try {
    const image = await Repo.query(
      db.query.image.findFirst({
        where: (image, { eq }) => eq(image.id, id),
        columns: { approved_at: true },
      }),
    );

    if (!image.ok) {
      return image;
    } else if (!image.data) {
      return result.err(E.NOT_FOUND);
    }

    const res = await ImageRepo.update_one(
      { id },
      { approved_at: image.data.approved_at ? null : new Date() },
    );

    return res;
  } catch (error) {
    Log.error(error, "BusinessService.toggle_approved_at.error unknown");

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

    if (!resource.ok || resource.data.user_id !== input.user_id) {
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

    const moderation_url = transformUrl({
      quality: "50",
      format: "auto",
      url: upload.data.url,
      provider: ImageHostingService.provider,
      width: Math.min(upload.data.width, 250),
      height: Math.min(upload.data.height, 250),
    });
    if (!moderation_url) {
      Log.error("ImageService.upload moderation_url is null");
    } else {
      waitUntil(AIModerationService.image(moderation_url));
    }

    const res = await ImageRepo.create({
      ...input,
      ...upload.data,
      provider: ImageHostingService.provider,
      thumbhash: thumbhash.ok ? thumbhash.data : null,
    });

    return res;
  },

  delete_many: async (
    input: Partial<
      Pick<Image, "id" | "resource_id" | "resource_kind" | "user_id">
    >,
  ): Promise<App.Result<null>> => {
    try {
      const images = await ImageRepo.delete_many(input);

      if (!images.ok) {
        return images;
      } else if (images.data.length === 0) {
        return result.suc(null);
      }

      await Promise.all(
        images.data.map((image) =>
          ImageHostingService.delete(image.external_id),
        ),
      );

      return result.suc(null);
    } catch (error) {
      Log.error(error, "ImageService.delete.error");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  },

  toggle_approved_at,
};
