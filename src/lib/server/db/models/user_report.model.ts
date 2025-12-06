import {
  index,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import type z from "zod";
import { RESOURCES } from "../../../const/resource/resource.const";
import { USER_REPORT } from "../../../const/user_report/user_report.const";
import { UserTable } from "./auth.model";
import { Schema } from "./index.schema";

export const user_report_reason_enum = pgEnum(
  "user_report_reason",
  USER_REPORT.REASON.IDS,
);

// NOTE: Use the same names as given to the drizzle.schema setup
export const user_report_resource_kind_enum = pgEnum(
  "user_report_resource_kind",
  RESOURCES.KIND.IDS,
);

export const UserReportTable = pgTable(
  "user_report",
  {
    ...Schema.id(),

    ip_address: varchar({ length: 255 }),
    user_agent: varchar({ length: 255 }),
    user_id: uuid().references(() => UserTable.id, { onDelete: "set null" }),

    // NOT unique! Many user_reports for one resource
    resource_id: uuid().notNull(),
    resource_kind: user_report_resource_kind_enum().notNull(),

    reason: user_report_reason_enum().notNull(),
    details: text().notNull(),

    ...Schema.timestamps,
  },
  (table) => [
    index("idx_user_report_user_id").on(table["user_id"]),
    // NOTE: I could make a compound index on (resource_id, resource_kind) but
    // the id is gonna be a unique uuid
    index("idx_user_report_resource_id").on(table["resource_id"]),
  ],
);

export type UserReport = typeof UserReportTable.$inferSelect;

const pick = {
  resource_id: true,
  resource_kind: true,

  reason: true,
  details: true,
} satisfies Partial<Record<keyof UserReport, true>>;

export namespace UserReportSchema {
  export const insert = createInsertSchema(UserReportTable, {
    details: (s) => s.max(5000, "Details cannot be more than 5000 characters"),
  }).pick(pick);

  export type Insert = z.infer<typeof insert>;
}
