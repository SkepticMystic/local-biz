import { passkeyClient } from "@better-auth/passkey/client";
import {
  adminClient,
  genericOAuthClient,
  lastLoginMethodClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";
import { toast } from "svelte-sonner";
import { AccessControl } from "./auth/permissions";

export const BetterAuthClient = createAuthClient({
  plugins: [
    passkeyClient(),
    genericOAuthClient(),
    lastLoginMethodClient(),
    adminClient({
      ac: AccessControl.ac,
      roles: AccessControl.roles,
    }),
  ],

  fetchOptions: {
    onError: (ctx) => {
      // SOURCE: https://www.better-auth.com/docs/concepts/rate-limit#handling-rate-limit-errors
      if (ctx.response.status === 429) {
        const retry_after = ctx.response.headers.get("Retry-After");

        if (retry_after) {
          toast.warning("Rate limit exceeded.", {
            description: `Please try again after ${retry_after} seconds.`,
          });
        }
      }
    },
  },
});
