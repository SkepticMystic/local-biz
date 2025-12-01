import { E } from "$lib/const/error/error.const";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import sharp from "sharp";
import { rgbaToThumbHash } from "thumbhash";

export const ThumbhashService = {
  generate: async (file: File): Promise<App.Result<string>> => {
    try {
      console.time("Thumbhash.generate");

      const buffer = await file.arrayBuffer();

      const image = sharp(buffer).resize(100, 100, { fit: "inside" });

      const { data, info } = await image
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const binary_thumbhash = rgbaToThumbHash(info.width, info.height, data);
      console.timeLog("Thumbhash.generate", "binary_thumbhash");

      const base64 = Buffer.from(binary_thumbhash).toString("base64");

      console.timeEnd("Thumbhash.generate");
      return result.suc(base64);
    } catch (error) {
      Log.error(error, "Thumbhash.generate.error");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  },
};
