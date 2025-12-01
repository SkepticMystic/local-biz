import { relations } from "drizzle-orm";
import { index, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { UserTable } from "./auth.model";
import { BusinessTable } from "./business.model";
import { Schema } from "./index.schema";

export const BusinessLikeTable = pgTable(
  "business_like",
  {
    ...Schema.id(),

    user_id: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),

    business_id: uuid()
      .notNull()
      .references(() => BusinessTable.id, { onDelete: "cascade" }),

    ...Schema.timestamps,
  },
  (table) => [
    // Index for looking up likes by user
    index("idx_business_like_user_id").on(table.user_id),
    // Index for looking up likes by business
    index("idx_business_like_business_id").on(table.business_id),
    // Ensure a user can only like a business once
    unique("unique_user_business_like").on(table.user_id, table.business_id),
  ],
);

export const business_like_relations = relations(
  BusinessLikeTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [BusinessLikeTable.user_id],
      references: [UserTable.id],
    }),
    business: one(BusinessTable, {
      fields: [BusinessLikeTable.business_id],
      references: [BusinessTable.id],
    }),
  }),
);

export type BusinessLike = typeof BusinessLikeTable.$inferSelect;
export type NewBusinessLike = typeof BusinessLikeTable.$inferInsert;

// Zod schema for validation
export const BusinessLikeSchema = {
  insert: createInsertSchema(BusinessLikeTable, { business_id: z.uuid() }) //
    .pick({ business_id: true }),
};

export type BusinessLikeSchema = {
  insert: z.input<typeof BusinessLikeSchema.insert>;
};
