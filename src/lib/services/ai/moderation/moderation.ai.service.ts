import { E } from "$lib/const/error/error.const";
import { OpenAI } from "$lib/sdks/ai/openai/openai.ai.sdk.ts";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { metrics } from "@sentry/sveltekit";
import type { ModerationMultiModalInput } from "openai/resources/moderations.mjs";

const moderate = async (input: ModerationMultiModalInput[]) => {
  const res = await OpenAI.moderation(input);
  if (!res.ok) {
    return res;
  }

  const flagged = res.data.results.filter((r) => r.flagged);
  if (flagged.length) {
    Log.error(input, "Moderation flagged");

    metrics.count("ai.moderation.flagged", flagged.length, {
      attributes: { input, flagged },
    });
  }

  return res;
};

const moderate_one = async (input: ModerationMultiModalInput) => {
  const res = await moderate([input]);
  if (!res.ok) {
    return res;
  }

  const moderation = res.data.results.at(0);
  if (!moderation) {
    Log.error("Empty moderation response");
    return result.err(E.INTERNAL_SERVER_ERROR);
  }

  return result.suc(moderation);
};

const text = (input: string) => moderate_one({ type: "text", text: input });

const image = (url: string) =>
  moderate_one({ type: "image_url", image_url: { url } });

export const AIModerationService = {
  moderate,
  moderate_one,
  text,
  image,
};
