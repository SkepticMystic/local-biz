import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { ACCESS_CONTROL } from "../../../const/auth/access_control.const";
import { AUTH } from "../../../const/auth/auth.const";
import { Schema } from "./index.schema";

export const user_role_enum = pgEnum("user_role", ACCESS_CONTROL.ROLES.IDS);

// Define User table schema
export const UserTable = pgTable("user", {
  ...Schema.id(),

  // NOTE: BetterAuth defaults name to ''
  name: varchar({ length: 255 }).notNull().default(""),
  email: varchar({ length: 255 }).notNull().unique(),
  emailVerified: boolean().default(false).notNull(),
  image: varchar({ length: 2048 }),

  // Admin fields
  role: user_role_enum().default("user").notNull(),
  banned: boolean().default(false).notNull(),
  banReason: text(),
  banExpires: timestamp({ mode: "date" }),

  ...Schema.timestamps,
});

// Export type for use in application
export type User = typeof UserTable.$inferSelect;
export type NewUser = typeof UserTable.$inferInsert;

export const user_relations = relations(UserTable, ({ many }) => ({
  accounts: many(AccountTable),
  sessions: many(SessionTable),
  passkeys: many(PasskeyTable),
}));

export const SessionTable = pgTable(
  "session",
  {
    ...Schema.id(),

    userId: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),

    token: varchar({ length: 255 }).notNull().unique(),

    ipAddress: varchar({ length: 45 }), // Supports IPv6
    userAgent: varchar({ length: 2048 }),

    // Admin
    impersonatedBy: uuid().references(() => UserTable.id, {
      onDelete: "set null",
    }),

    expiresAt: timestamp({ mode: "date" }).notNull(),
    ...Schema.timestamps,
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export type Session = typeof SessionTable.$inferSelect;
export type NewSession = typeof SessionTable.$inferInsert;

export const session_relations = relations(SessionTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [SessionTable.userId],
    references: [UserTable.id],
  }),
}));

// Create an enum for provider IDs
export const provider_id_enum = pgEnum("provider_id", AUTH.PROVIDERS.IDS);

export const AccountTable = pgTable(
  "account",
  {
    ...Schema.id(),

    userId: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),

    accountId: varchar().notNull(),
    providerId: provider_id_enum().notNull(),

    password: varchar({ length: 255 }),

    scope: text(),
    idToken: varchar({ length: 2048 }),
    accessToken: varchar({ length: 2048 }),
    refreshToken: varchar({ length: 2048 }),
    accessTokenExpiresAt: timestamp({ mode: "date" }),
    refreshTokenExpiresAt: timestamp({
      mode: "date",
    }),

    ...Schema.timestamps,
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export type Account = typeof AccountTable.$inferSelect;
export type NewAccount = typeof AccountTable.$inferInsert;

export const account_relations = relations(AccountTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [AccountTable.userId],
    references: [UserTable.id],
  }),
}));

export const PasskeyTable = pgTable(
  "passkey",
  {
    ...Schema.id(),

    name: varchar({ length: 255 }),
    userId: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),

    publicKey: varchar({ length: 2048 }).notNull(),
    credentialID: varchar({ length: 512 }).notNull(),
    counter: integer().notNull(),
    deviceType: varchar({ length: 255 }),
    backedUp: boolean().notNull(),
    transports: jsonb().notNull().$type<string[]>(), // Using jsonb for array of strings
    aaguid: varchar({ length: 255 }).notNull(),

    ...Schema.timestamps,
  },
  (table) => [index("passkey_user_id_idx").on(table.userId)],
);

export type Passkey = typeof PasskeyTable.$inferSelect;
export type InsertPasskey = typeof PasskeyTable.$inferInsert;

export const passkey_relations = relations(PasskeyTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [PasskeyTable.userId],
    references: [UserTable.id],
  }),
}));

export const VerificationTable = pgTable("verification", {
  ...Schema.id(),

  identifier: varchar({ length: 255 }).notNull().unique(),
  value: varchar({ length: 2048 }).notNull(),

  expiresAt: timestamp({ mode: "date" }).notNull(),
  ...Schema.timestamps,
});

export type Verification = typeof VerificationTable.$inferSelect;
export type NewVerification = typeof VerificationTable.$inferInsert;
