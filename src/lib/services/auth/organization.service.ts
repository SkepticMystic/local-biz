import { getRequestEvent } from "$app/server";
import { auth, is_ba_error_code } from "$lib/auth";
import { type InsertOrganization } from "$lib/server/db/models/auth.model";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { Strings } from "$lib/utils/strings.util";
import { captureException } from "@sentry/sveltekit";
import { APIError } from "better-auth/api";

const create = async (input: Omit<InsertOrganization, "slug">) => {
  try {
    const data = await auth.api.createOrganization({
      headers: getRequestEvent().request.headers,
      body: {
        name: input.name,
        logo: input.logo ?? undefined,
        slug: Strings.slugify(input.name),
        keepCurrentActiveOrganization: false,
      },
    });

    if (!data) {
      return result.err({
        path: undefined,
        message: "Failed to create organization",
      } satisfies App.Error);
    } else {
      return result.suc(data);
    }
  } catch (error) {
    if (error instanceof APIError) {
      Log.info(error.body, "create_organization_remote.error better-auth");

      if (
        is_ba_error_code(
          error, //
          "ORGANIZATION_ALREADY_EXISTS",
          "ORGANIZATION_SLUG_ALREADY_TAKEN",
        )
      ) {
        return result.err({
          path: ["name"] as const,
          message: "This name is already taken",
        } satisfies App.Error);
      } else {
        return result.err({
          path: undefined,
          message: error.message,
        } satisfies App.Error);
      }
    } else {
      Log.error(error, "create_organization_remote.error unknown");

      captureException(error);

      return result.err({
        path: undefined,
        message: "Internal server error",
      } satisfies App.Error);
    }
  }
};

export const OrganizationService = {
  create,
};
