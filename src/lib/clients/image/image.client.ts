import {
  admin_set_image_approved_remote,
  delete_image_remote,
} from "$lib/remote/image/image.remote";
import type { Image } from "$lib/server/db/models/image.model";
import { thumbHashToDataURL } from "thumbhash";
import { Client } from "../index.client";

export const ImageClient = {
  delete: Client.wrap((image_id: string) => delete_image_remote(image_id), {
    confirm:
      "Are you sure you want to delete this image? This action cannot be undone.",
    suc_msg: "Image deleted",
  }),

  // SOURCE: https://github.com/evanw/thumbhash/blob/main/examples/browser/index.html
  decode_thumbhash: (image?: Pick<Image, "thumbhash">) =>
    image?.thumbhash
      ? thumbHashToDataURL(
          new Uint8Array(
            atob(image.thumbhash)
              .split("")
              .map((x) => x.charCodeAt(0)),
          ),
        )
      : undefined,

  set_admin_approved: Client.wrap(
    (input: Parameters<typeof admin_set_image_approved_remote>[0]) =>
      admin_set_image_approved_remote(input),
    {
      suc_msg: (input) =>
        `Image ${input.admin_approved ? "approved" : "denied"}`,
    },
  ),
};
