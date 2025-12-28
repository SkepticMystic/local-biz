import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "$env/static/private";
import { E } from "$lib/const/error/error.const";
import type { Image } from "$lib/server/db/models/image.model";
import * as Sentry from "@sentry/sveltekit";
import { captureException } from "@sentry/sveltekit";
import {
  v2 as cloudinary,
  type UploadApiErrorResponse,
  type UploadApiResponse,
} from "cloudinary";
import type { IMAGE_HOSTING } from "../../const/image/image_hosting.const";
import type { Result } from "../../interfaces/result.type";
import { Log } from "../../utils/logger.util";
import { result } from "../../utils/result.util";

cloudinary.config({
  api_secret: CLOUDINARY_API_SECRET,
  api_key: CLOUDINARY_API_KEY,
  cloud_name: CLOUDINARY_CLOUD_NAME,
});

const provider = "cloudinary" as (typeof IMAGE_HOSTING.PROVIDER.IDS)[number];

export const ImageHostingService = {
  provider,

  upload: async (file: File) => {
    try {
      const start_ms = performance.now();

      const array_buffer = await file.arrayBuffer();
      const buffer = Buffer.from(array_buffer);

      const res: Result<UploadApiResponse, UploadApiErrorResponse> =
        await new Promise((resolve) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "image",
                discard_original_filename: true,
                upload_preset: CLOUDINARY_UPLOAD_PRESET,
                // NOTE: We don't apply any transforms at upload time
                // Rather keep the original, then transform in Picture.svelte
              },
              (error, data) =>
                error ? resolve(result.err(error)) : resolve(result.suc(data)),
            )
            .end(buffer);
        });

      Sentry.metrics.distribution(
        "ImageHostingService.upload",
        performance.now() - start_ms,
        {
          unit: "millisecond",
          attributes: {
            provider,
            file_size: file.size,
            file_type: file.type,
          },
        },
      );

      Log.info(res, "Upload result:");
      if (!res.ok) {
        Log.error(res.error, "ImageHostingService.upload.error");

        captureException(res.error);

        return result.err({ message: "Failed to upload image" });
      } else {
        return result.suc({
          response: res.data,

          size: res.data.bytes,
          width: res.data.width,
          height: res.data.height,

          url: res.data.secure_url,
          external_id: res.data.public_id,
        } satisfies Partial<Image>);
      }
    } catch (error) {
      Log.error(error, "ImageHostingService.upload.error");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  },

  delete: async (external_id: string): Promise<App.Result<null>> => {
    try {
      const start_ms = performance.now();

      await cloudinary.uploader
        .destroy(external_id, { resource_type: "image" })
        .then((result) => {
          Log.debug(result, "ImageHostingService.delete.result");

          if (result?.result !== "ok" && result?.result !== "not found") {
            return Promise.reject(result);
          }
        });

      Sentry.metrics.distribution(
        "ImageHostingService.delete",
        performance.now() - start_ms,
        {
          unit: "millsecond",
          attributes: { provider },
        },
      );

      return result.suc(null);
    } catch (error) {
      Log.error(error, "ImageHostingService.delete.error");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  },
};
