ALTER TABLE "business" ADD COLUMN "approved_at" timestamp;--> statement-breakpoint
ALTER TABLE "image" ADD COLUMN "approved_at" timestamp;--> statement-breakpoint
ALTER TABLE "seller_profile" ADD COLUMN "approved_at" timestamp;--> statement-breakpoint
ALTER TABLE "business" DROP COLUMN "admin_approved";--> statement-breakpoint
ALTER TABLE "image" DROP COLUMN "admin_approved";--> statement-breakpoint
ALTER TABLE "seller_profile" DROP COLUMN "admin_approved";