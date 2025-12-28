import { OPENAI_API_KEY } from "$env/static/private";
import { E } from "$lib/const/error/error.const";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import SDK from "openai";

const sdk = new SDK({ apiKey: OPENAI_API_KEY });

const moderation = async (
  input: SDK.Moderations.ModerationMultiModalInput[],
) => {
  try {
    const response = await sdk.moderations.create({
      input,
      model: "omni-moderation-latest",
    });

    Log.info(response, "OpenAI.moderation.response");

    return result.suc(response);
  } catch (error) {
    Log.error(error, "OpenAI.moderation.error");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

export const OpenAI = {
  moderation,
};
