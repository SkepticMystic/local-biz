import { command, form } from "$app/server";
import { get_session } from "$lib/auth/server";
import { IMAGE_HOSTING } from "$lib/const/image/image_hosting.const";
import { ImageSchema } from "$lib/server/db/models/image.model";
import { ImageService } from "$lib/services/image/image.service";
import z from "zod";

export const upload_images_remote = form(
  ImageSchema.insert.extend({
    files: z
      .array(z.instanceof(File))
      .min(1, "No files to upload")
      .max(IMAGE_HOSTING.LIMITS.MAX_COUNT.PER_RESOURCE),
  }),
  async (input) => {
    const { user } = await get_session();

    return await Promise.all(
      input.files.map((file) =>
        ImageService.upload(file, {
          user_id: user.id,
          resource_id: input.resource_id,
          resource_kind: input.resource_kind,
        }),
      ),
    );
  },
);

export const delete_image_remote = command(
  z.uuid(),
  async (image_id: string) => {
    const { user } = await get_session();

    return await ImageService.delete_many({ id: image_id, user_id: user.id });
  },
);

export const toggle_image_approved_at_remote = command(
  z.uuid(),
  async (image_id) => {
    await get_session({ admin: true });

    return await ImageService.toggle_approved_at(image_id);
  },
);
