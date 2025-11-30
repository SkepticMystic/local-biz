import { resolve } from "$app/paths";
import { getRequestEvent } from "$app/server";
import { auth } from "$lib/auth";
import { BetterAuthClient } from "$lib/auth-client";
import type { IAccessControl } from "$lib/const/auth/access_control.const";
import { Log } from "$lib/utils/logger.util";
import { error, redirect } from "@sveltejs/kit";

type Options = {
  /** Must be an admin */
  admin?: boolean;

  email_verified?: boolean;

  permissions?: Parameters<typeof BetterAuthClient.admin.checkRolePermission>[0]["permissions"];
};

/** Redirect to signin if not logged in. */
export const get_session = async (options?: Options) => {
  const event = getRequestEvent();

  const resolved = {
    admin: false,
    email_verified: true,
    permissions: undefined,
    ...(options ?? {}),
  };

  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  if (!session) {
    redirect(302, resolve("/auth/signin"));
  } else if (resolved.email_verified && !session.user.emailVerified) {
    redirect(302, resolve("/auth/verify-email"));
  } else if (resolved.admin && session.user.role !== "admin") {
    error(403, "Forbidden");
  } else if (options?.permissions) {
    const role_check = BetterAuthClient.admin.checkRolePermission({
      permissions: options.permissions,
      role: (session.user.role as IAccessControl.RoleId | undefined) || "user",
    });

    if (!role_check) {
      error(403, "Forbidden");
    }
  }

  return session;
};

export const safe_get_session = async (options?: Options) => {
  try {
    return await get_session(options);
  } catch (e) {
    Log.info(e, "safe_get_session error");

    return null;
  }
};

export const get_seller_session = async (options?: Options) => {
  const session = await get_session(options);

  if (
    !session.session.member_id ||
    !session.session.member_role ||
    !session.session.activeOrganizationId
  ) {
    error(401, "Unauthorized");
  }

  return {
    user: session.user,
    session: {
      ...session.session,
      member_id: session.session.member_id!,
      member_role: session.session.member_role!,
      org_id: session.session.activeOrganizationId!,
      activeOrganizationId: session.session.activeOrganizationId!,
    },
  };
};
