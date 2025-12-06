CREATE TYPE "public"."user_report_reason" AS ENUM('duplicate', 'spam', 'inappropriate', 'other');--> statement-breakpoint
CREATE TYPE "public"."user_report_resource_kind" AS ENUM('business', 'seller_profile');--> statement-breakpoint
CREATE TABLE "user_report" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ip_address" varchar(255),
	"user_agent" varchar(255),
	"user_id" uuid,
	"resource_id" uuid NOT NULL,
	"resource_kind" "user_report_resource_kind" NOT NULL,
	"reason" "user_report_reason" NOT NULL,
	"details" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_report" ADD CONSTRAINT "user_report_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_user_report_user_id" ON "user_report" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_report_resource_id" ON "user_report" USING btree ("resource_id");