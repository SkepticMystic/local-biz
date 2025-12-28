import type { MaybePromise } from "$lib/interfaces";
import { BetterAuth, type BetterAuthResult } from "$lib/utils/better-auth.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { isHttpError, isRedirect } from "@sveltejs/kit";
import { toast } from "svelte-sonner";

type ClientRequestOptions<I, D> = {
  optimistic: boolean; // TODO: Implement
  prompt: ((input: I) => string) | string | null;
  confirm: ((input: I) => string) | string | null;
  suc_msg: ((input: I, data: D) => string) | string | null;
  validate_session: boolean;
  on_success?: (data: D) => MaybePromise<unknown>;
};
const DEFAULT_OPTIONS: ClientRequestOptions<unknown, unknown> = {
  prompt: null,
  confirm: null,
  suc_msg: null,
  optimistic: false,
  validate_session: true,
  on_success: undefined,
};

const wrap = <I, D>(
  cb: (
    input: I,
    options?: Partial<ClientRequestOptions<I, D>>,
  ) => Promise<App.Result<D>>,
  client_options?: Partial<ClientRequestOptions<I, D>>,
): typeof cb => {
  return async (input, callsite_options) => {
    toast.dismiss();

    const resolved: ClientRequestOptions<I, D> = {
      ...DEFAULT_OPTIONS,
      ...client_options,
      ...callsite_options,
    };

    // if (
    //   resolved.validate_session && //
    //   !session.get().data?.session
    // ) {
    //   toast.warning(
    //     "You must be signed in to do this. Please login or signup to continue.",
    //     {
    //       action: {
    //         label: "Sign in",
    //         onClick: () => goto(resolve("/auth/signin")),
    //       },
    //     },
    //   );

    //   // Don't return a message or level, as we've already shown a toast
    //   return result.err();
    // }

    if (resolved.confirm) {
      if (
        !confirm(
          typeof resolved.confirm === "function" //
            ? resolved.confirm(input)
            : resolved.confirm,
        )
      ) {
        return result.err();
      }
    }

    if (resolved.prompt) {
      const target =
        typeof resolved.prompt === "function"
          ? resolved.prompt(input)
          : resolved.prompt;

      if (prompt(`Type "${target}" to confirm`) !== target) {
        return result.err();
      }
    }

    try {
      const res = await cb(input, resolved);

      if (res.ok) {
        if (resolved.suc_msg) {
          toast.success(
            typeof resolved.suc_msg === "function"
              ? resolved.suc_msg(input, res.data)
              : resolved.suc_msg,
          );
        }

        if (resolved.on_success) {
          await resolved.on_success(res.data);
        }
      } else {
        toast.warning(res.error.message);
      }

      return res;
    } catch (error) {
      console.log("Client.wrap.error", error);

      captureException(error);

      if (isRedirect(error)) {
        console.log("Client.wrap.error.isRedirect", error.location);

        return result.err();
      } else if (isHttpError(error)) {
        console.log("Client.wrap.error.isHttpError", error.body);

        toast[error.body.level ?? "error"](error.body.message);

        return result.err(error.body);
      } else {
        console.log("Client.wrap.error.unknown", error);

        toast.error("Internal server error");
        return result.err();
      }
    }
  };
};

const better_auth = <I, D>(
  cb: (input: I) => Promise<BetterAuthResult<D>>,
  options?: Partial<ClientRequestOptions<I, D>>,
) => wrap((input) => BetterAuth.to_result(cb(input)), options);

export const Client = { wrap, better_auth };
