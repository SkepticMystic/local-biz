import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { HTMLUtil, type IHTML } from "../../../utils/html/html.util";
import { UserTable } from "./auth.model";
import { BusinessLikeTable } from "./business_like.model";
import { Schema } from "./index.schema";

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
    description: text().default("").notNull().$type<IHTML.Sanitized>(),

    google_place_id: varchar({ length: 255 }).default("").notNull(),
    formatted_address: varchar({ length: 511 }).default("").notNull(),

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
  likes: many(BusinessLikeTable),
}));

export type Business = typeof BusinessTable.$inferSelect;

const pick = {
  name: true,
  logo: true,
  description: true,
  google_place_id: true,
  formatted_address: true,
} satisfies Partial<Record<keyof Business, true>>;

const refinements = {
  name: z.string().trim().min(1, "Please enter a name for your business"),
  logo: z.string().trim(),

  description: z
    .string()
    .trim()
    .max(5000, "Description must be at most 5000 characters")
    .transform(HTMLUtil.sanitize),

  formatted_address: z.string().trim(),
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
