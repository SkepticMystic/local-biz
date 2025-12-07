import { command, form } from "$app/server";
import { get_session } from "$lib/auth/server";
import { ImageSchema } from "$lib/server/db/models/image.model";
import { ImageService } from "$lib/services/image/image.service";
import z from "zod";

export const upload_image_remote = form(
  ImageSchema.insert.extend({ file: z.instanceof(File) }),
  async (input) => {
    const { user } = await get_session();

    return await ImageService.upload(input.file, {
      ...input,
      user_id: user.id,
    });
  },
);

export const delete_image_remote = command(
  z.uuid(),
  async (image_id: string) => {
    const { user } = await get_session();

    return await ImageService.delete_many({ id: image_id, user_id: user.id });
  },
);

export const admin_set_image_approved_remote = command(
  z.object({
    id: z.uuid(),
    admin_approved: z.boolean(),
  }),
  async (input) => {
    await get_session({ admin: true });

    return await ImageService.set_admin_approved(input);
  },
);
