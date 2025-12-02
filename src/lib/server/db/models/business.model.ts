import type { Branded } from "$lib/interfaces/zod/zod.types";
import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { BUSINESS } from "../../../const/business/business.const";
import { UserTable } from "./auth.model";
import { BusinessLikeTable } from "./business_like.model";
import { ImageTable } from "./image.model";
import { Schema } from "./index.schema";

export const business_category_enum = pgEnum(
  "business_category",
  BUSINESS.CATEGORY.IDS,
);

// Define Business table schema
export const BusinessTable = pgTable(
  "business",
  {
    ...Schema.id(),

    user_id: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),

    name: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull().unique(),
    logo: varchar({ length: 2047 }).default("").notNull(),
    description: text().default("").notNull(),

    urls: jsonb()
      .default([])
      .notNull()
      .$type<{ data: Branded<"Url">; label: string }[]>(),
    phones: jsonb()
      .default([])
      .notNull()
      .$type<{ data: Branded<"Phone">; label: string }[]>(),
    emails: jsonb()
      .default([])
      .notNull()
      .$type<{ data: Branded<"Email">; label: string }[]>(),

    google_place_id: varchar({ length: 255 }).default("").notNull(),
    formatted_address: varchar({ length: 511 }).default("").notNull(),
    coord_lat: doublePrecision().default(0).notNull(),
    coord_lng: doublePrecision().default(0).notNull(),

    tags: jsonb().default([]).notNull().$type<string[]>(),
    category: business_category_enum().default("other").notNull(),

    admin_approved: boolean().default(false).notNull(),

    ...Schema.timestamps,
  },
  (table) => [index("idx_business_user_id").on(table["user_id"])],
);

export const business_relations = relations(BusinessTable, ({ one, many }) => ({
  user: one(UserTable, {
    fields: [BusinessTable.user_id],
    references: [UserTable.id],
  }),

  images: many(ImageTable),
  likes: many(BusinessLikeTable),
}));

export type Business = typeof BusinessTable.$inferSelect;

const pick = {
  name: true,
  logo: true,
  description: true,

  category: true,
  tags: true,

  urls: true,
  phones: true,
  emails: true,

  coord_lat: true,
  coord_lng: true,
  google_place_id: true,
  formatted_address: true,
} satisfies Partial<Record<keyof Business, true>>;

const refinements = {
  logo: z.union([z.literal(""), z.url()]),
  name: z.string().trim().min(1, "Please enter a name for your business"),

  description: z
    .string()
    .trim()
    .max(5000, "Description must be at most 5000 characters"),

  coord_lat: z.coerce.number<string | number>(),
  coord_lng: z.coerce.number<string | number>(),
  formatted_address: z.string().trim(),

  category: z.enum(BUSINESS.CATEGORY.IDS),

  tags: z
    .array(
      z
        .string()
        .trim()
        .toLowerCase()
        .min(
          BUSINESS.TAGS.LIMITS.MIN_LENGTH,
          `Tags must be at least ${BUSINESS.TAGS.LIMITS.MIN_LENGTH} characters`,
        )
        .max(
          BUSINESS.TAGS.LIMITS.MAX_LENGTH,
          `Tags must be at most ${BUSINESS.TAGS.LIMITS.MAX_LENGTH} characters`,
        ),
    )
    .max(
      BUSINESS.TAGS.LIMITS.MAX_PER_RESOURCE,
      `You can add up to ${BUSINESS.TAGS.LIMITS.MAX_PER_RESOURCE} tags`,
    )
    .default([])
    .transform((tags) =>
      // Remove duplicates and empty strings
      [...new Set(tags.filter((t) => t.length > 0))],
    ),

  urls: z
    .array(
      z.object({
        label: z.string().trim().default(""),
        data: z.union([z.literal(""), z.url()]),
      }),
    )
    .max(3)
    .transform(
      (arr) =>
        arr.filter((v) => v.data) as {
          label: string;
          data: Branded<"Url">;
        }[],
    ),
  emails: z
    .array(
      z.object({
        label: z.string().trim().default(""),
        data: z.union([z.literal(""), z.email()]),
      }),
    )
    .max(3)
    .transform(
      (arr) =>
        arr.filter((v) => v.data) as {
          label: string;
          data: Branded<"Email">;
        }[],
    ),
  phones: z
    .array(
      z.object({
        label: z.string().trim().default(""),
        data: z.union([z.literal(""), z.string().trim()]),
      }),
    )
    .max(3)
    .transform(
      (arr) =>
        arr.filter((v) => v.data) as {
          label: string;
          data: Branded<"Phone">;
        }[],
    ),
};

export const BusinessSchema = {
  insert: createInsertSchema(BusinessTable, refinements).pick(pick),
  update: createUpdateSchema(BusinessTable, refinements)
    .pick(pick)
    .extend({ id: z.uuid() }),
};

export type BusinessSchema = {
  insert: z.input<typeof BusinessSchema.insert>;
  update: z.input<typeof BusinessSchema.update>;
};
