import { CAPTCHA_SECRET_KEY } from "$env/static/private";
import { E } from "$lib/const/error/error.const";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";

type TurnstileResponse = {
  "error-codes": string[];
  success: boolean;
  action: string;
  cdata: string;
};

const verify = async (
  token: string,
): Promise<App.Result<TurnstileResponse>> => {
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          response: token,
          secret: CAPTCHA_SECRET_KEY,
        }),
      },
    );

    const data = (await response.json()) as TurnstileResponse;

    if (data.success) {
      return result.suc(data);
    } else {
      Log.warn(data, "Failed to verify captcha token");
      return result.err(E.FORBIDDEN);
    }
  } catch (error) {
    Log.error(error, "Failed to verify captcha token");

    captureException(error);

    return result.err(E.FORBIDDEN);
  }
};

export const CaptchaService = {
  verify,
};
