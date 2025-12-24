import { getRequestEvent } from "$app/server";
import {
  BETTER_AUTH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "$env/static/private";
import { passkey } from "@better-auth/passkey";
import type { APIError } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import {
  admin,
  captcha,
  haveIBeenPwned,
  lastLoginMethod,
} from "better-auth/plugins";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { AccessControl } from "./auth/permissions";
import { APP } from "./const/app.const";
import { AUTH, type IAuth } from "./const/auth/auth.const";
import { EMAIL } from "./const/email.const";
import { db } from "./server/db/drizzle.db";
import {
  AccountTable,
  PasskeyTable,
  SessionTable,
  UserTable,
  VerificationTable,
} from "./server/db/models/auth.model";
import { redis } from "./server/db/redis.db";
import { EmailService } from "./services/email.service";
import { ImageService } from "./services/image/image.service";
import { Log } from "./utils/logger.util";

// SECTION: betterAuth init
export const auth = betterAuth({
  appName: APP.NAME,

  secret: BETTER_AUTH_SECRET,

  logger: {
    level: "debug",
    log: (level, message, ...args) => {
      Log[level]({ args }, message);
    },
  },

  telemetry: { enabled: false },

  experimental: { joins: true },

  advanced: {
    database: {
      // NOTE: Let drizzle generate IDs, as BetterAuth's nanoid causes issues
      // We want UUIDs everywhere, so that the image table can reference resource_id in a generic way
      generateId: false,
    },
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    debugLogs: false,

    schema: {
      user: UserTable,
      account: AccountTable,
      session: SessionTable,
      verification: VerificationTable,
      passkey: PasskeyTable,
    },
  }),

  session: {
    storeSessionInDatabase: false,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },

  rateLimit: {
    // NOTE: defaults to true in production, false in development
    // enabled: true,
    // NOTE: defaults to secondary if one is configured
    // So no need for us to check for redis
    // storage: redis ? "secondary-storage" : "memory",
  },

  user: {
    deleteUser: {
      enabled: true,

      sendDeleteAccountVerification: async ({ user, url }) => {
        await EmailService.send(
          EMAIL.TEMPLATES["delete-account-verification"]({ url, user }),
        );
      },

      // NOTE: Delete their images _before_ deleting user
      // Otherwise it'll cascade to ImageTable, meaning we can't find the external_ids to delete on cloudinary
      beforeDelete: async (user) => {
        await ImageService.delete_many({ user_id: user.id });
      },
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      updateUserInfoOnLink: true,
      // SOURCE: https://www.better-auth.com/docs/concepts/users-accounts#forced-linking
      // NOTE: Links profile even if email isn't verified on provider side
      trustedProviders: AUTH.PROVIDERS.IDS.filter(
        (id) => AUTH.PROVIDERS.MAP[id].force_email_verified,
      ),
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,

    sendResetPassword: async ({ user, url }) => {
      await EmailService.send(EMAIL.TEMPLATES["password-reset"]({ url, user }));
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      await EmailService.send(
        EMAIL.TEMPLATES["email-verification"]({ url, user }),
      );
    },
  },

  socialProviders: {
    google:
      GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
        ? {
            // Always prompt the user to select an account
            prompt: "select_account",
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
          }
        : undefined,
  },

  plugins: [
    admin({
      ac: AccessControl.ac,
      roles: AccessControl.roles,
    }),

    captcha({
      provider: "cloudflare-turnstile",
      secretKey: process.env.CAPTCHA_SECRET_KEY!,
    }),

    passkey({
      rpName: APP.NAME,
      rpID: new URL(APP.URL).hostname,
    }),

    haveIBeenPwned({
      customPasswordCompromisedMessage:
        "That password has been compromised in a data breach. Please choose a different one.",
    }),

    lastLoginMethod({
      customResolveMethod: (ctx) => {
        // NOTE: The plugin uses different terminology to the rest of the lib...
        if (ctx.path === "/sign-in/email" || ctx.path === "/sign-up/email") {
          return "credential" satisfies IAuth.ProviderId;
        } else {
          // Return null to use default logic
          return null;
        }
      },
    }),

    // NOTE: Must be last, as it needs the request event
    // SOURCE: https://www.better-auth.com/docs/integrations/svelte-kit#server-action-cookies
    sveltekitCookies(getRequestEvent),
  ],

  // SOURCE: https://www.better-auth.com/docs/concepts/database#secondary-storage
  secondaryStorage: redis
    ? {
        get: async (key) => {
          return redis!.get(key);
        },

        set: async (key, value, ttl) => {
          if (ttl) await redis!.set(key, value, { ex: ttl });
          // or for ioredis:
          // if (ttl) await redis!.set(key, value, "EX", ttl);
          else await redis!.set(key, value);
        },

        delete: async (key) => {
          await redis!.del(key);
        },
      }
    : undefined,
});
// !SECTION

type ErrorCode = keyof typeof auth.$ERROR_CODES;

export const is_ba_error_code = (error: APIError, ...codes: ErrorCode[]) =>
  codes.includes(error.body?.code as ErrorCode);
