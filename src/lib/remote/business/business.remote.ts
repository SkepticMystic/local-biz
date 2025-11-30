import { command, form, query } from "$app/server";
import { get_session } from "$lib/auth/server";
import { db } from "$lib/server/db/drizzle.db";
import {
  BusinessSchema,
  BusinessTable,
} from "$lib/server/db/models/business.model";
import { BusinessService } from "$lib/services/business/business.service";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { eq } from "drizzle-orm";
import z from "zod";

export const get_all_public_businesses_remote = query(async () => {
  const businesses = await db.query.business.findMany({
    where: (business, { eq }) => eq(business.admin_approved, true),

    columns: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      formatted_address: true,
      createdAt: true,
    },
  });

  return businesses;
});

export const create_business_remote = form(
  BusinessSchema.insert, //
  async (input) => {
    console.log("create_business_remote.input", input);
    const { session } = await get_session();

    const res = await BusinessService.create({
      name: input.name,
      logo: input.logo,
      user_id: session.userId,
      google_place_id: input.google_place_id,
      formatted_address: input.formatted_address,
    });

    return res;
  },
);

export const update_business_remote = form(
  BusinessSchema.update, //
  async (input) => {
    console.log("update_business_remote.input", input);

    const { session } = await get_session();

    const res = await BusinessService.update({
      ...input,
      user_id: session.userId,
    });

    return res;
  },
);

export const admin_set_business_approved_remote = command(
  z.object({
    id: z.uuid(),
    admin_approved: z.boolean(),
  }),
  async (input) => {
    await get_session({ admin: true });

    try {
      const [business] = await db
        .update(BusinessTable)
        .set({ admin_approved: input.admin_approved })
        .where(eq(BusinessTable.id, input.id))
        .returning();

      return business //
        ? result.suc(business)
        : result.err({ message: "Business not found" });
    } catch (error) {
      Log.error(error, "admin_set_business_approved_remote.error unknown");

      captureException(error);

      return result.err({ message: "Internal server error" });
    }
  },
);
