import { E } from "$lib/const/error/error.const";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { DrizzleQueryError } from "drizzle-orm";

const query = async <D>(cb: () => Promise<D>): Promise<App.Result<D>> => {
  try {
    return result.suc(await cb());
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "Repo.query.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "Repo.query.error unknown");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  }
};

export const Repo = {
  query,
};
