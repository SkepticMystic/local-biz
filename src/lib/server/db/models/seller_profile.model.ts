import { friendly_url_schema } from "$lib/schema/url/url.schema";
import { relations } from "drizzle-orm";
import { boolean, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { UserTable } from "./auth.model";
import { ImageTable } from "./image.model";
import { Schema } from "./index.schema";

export const SellerProfileTable = pgTable("seller_profile", {
  ...Schema.id(),

  user_id: uuid()
    .notNull()
    .unique()
    .references(() => UserTable.id, { onDelete: "cascade" }),

  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  logo: varchar({ length: 2047 }).default("").notNull(),
  description: text().default("").notNull(),

  admin_approved: boolean().default(false).notNull(),

  ...Schema.timestamps,
});

export const seller_profile_relations = relations(
  SellerProfileTable,
  ({ one, many }) => ({
    user: one(UserTable, {
      fields: [SellerProfileTable.user_id],
      references: [UserTable.id],
    }),

    images: many(ImageTable),
  }),
);

export type SellerProfile = typeof SellerProfileTable.$inferSelect;

const pick = {
  name: true,
  logo: true,
  description: true,
} satisfies Partial<Record<keyof SellerProfile, true>>;

const refinements = {
  name: z.string().trim().min(1, "Please enter a name for your seller_profile"),
  logo: z.union([z.literal(""), friendly_url_schema]),

  description: z
    .string()
    .trim()
    .max(5000, "Description must be at most 5000 characters"),
};

export const SellerProfileSchema = {
  insert: createInsertSchema(SellerProfileTable, refinements).pick(pick),
  update: createUpdateSchema(SellerProfileTable, refinements)
    .pick(pick)
    .extend({ id: z.uuid() }),
};

export type SellerProfileSchema = {
  insert: z.input<typeof SellerProfileSchema.insert>;
  update: z.input<typeof SellerProfileSchema.update>;
};
