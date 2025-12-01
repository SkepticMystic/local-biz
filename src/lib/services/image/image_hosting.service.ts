import { CLOUDINARY_API_SECRET } from "$env/static/private";
import {
  PUBLIC_CLOUDINARY_API_KEY,
  PUBLIC_CLOUDINARY_CLOUD_NAME,
  PUBLIC_CLOUDINARY_UPLOAD_PRESET,
} from "$env/static/public";
import type { IMAGE_HOSTING } from "$lib/const/image/image_hosting.const";
import type { Result } from "$lib/interfaces/result.type";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import {
  v2 as cloudinary,
  type UploadApiErrorResponse,
  type UploadApiResponse,
} from "cloudinary";

cloudinary.config({
  api_secret: CLOUDINARY_API_SECRET,
  api_key: PUBLIC_CLOUDINARY_API_KEY,
  cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
});

export const ImageHostingService = {
  provider: "cloudinary" as (typeof IMAGE_HOSTING.PROVIDER.IDS)[number],

  upload: async (file: File) => {
    // TODO: Do I have to do this? Can I just send the file straight?
    const array_buffer = await file.arrayBuffer();
    const buffer = Buffer.from(array_buffer);

    const res: Result<UploadApiResponse, UploadApiErrorResponse> =
      await new Promise((resolve) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              discard_original_filename: true,
              upload_preset: PUBLIC_CLOUDINARY_UPLOAD_PRESET,
              // NOTE: We don't apply any transforms at upload time
              // Rather keep the original, then transform in Picture.svelte
            },
            (error, data) =>
              error ? resolve(result.err(error)) : resolve(result.suc(data)),
          )
          .end(buffer);
      });

    console.log("Upload result:", res);
    if (!res.ok) {
      Log.error(res.error, "ImageHostingService.upload.error");

      captureException(res.error);

      return result.err({ message: "Failed to upload image" });
    } else {
      return result.suc({
        response: res.data,
        image: {
          url: res.data.secure_url,
          external_id: res.data.public_id,
        },
      });
    }
  },

  delete: async (external_id: string) => {
    await cloudinary.uploader
      .destroy(external_id, { resource_type: "image" })
      .then((result) => {
        if (result?.result !== "ok" && result?.result !== "not found") {
          return Promise.reject(result);
        }
      });

    return result.suc(null);
  },
};
