import { command, form, query } from "$app/server";
import { get_session, safe_get_session } from "$lib/auth/server";
import { BusinessRepo } from "$lib/repos/business.repo";
import { BusinessSchema } from "$lib/server/db/models/business.model";
import { BusinessService } from "$lib/services/business/business.service";
import { error } from "@sveltejs/kit";
import z from "zod";

export const get_all_public_businesses_remote = query(async () => {
  const res = await BusinessRepo.get_all_public();

  if (!res.ok) {
    error(res.error.status, res.error.message);
  }

  return res.data;
});

export const get_all_my_businesses_remote = query(async () => {
  const session = await safe_get_session();
  if (!session) {
    return [];
  }

  const res = await BusinessRepo.get_all_by_user(session.user.id);
  if (!res.ok) {
    error(res.error.status, res.error.message);
  }

  return res.data;
});

export const create_business_remote = form(
  BusinessSchema.insert, //
  async (input) => {
    console.log("create_business_remote.input", input);
    const { session } = await get_session();

    const res = await BusinessService.create({
      ...input,
      user_id: session.userId,
    });

    console.log("create_business_remote.res", res);

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

    console.log("update_business_remote.res", res);

    return res;
  },
);

export const delete_business_remote = command(
  z.uuid(), //
  async (business_id) => {
    const { session } = await get_session();

    return await BusinessRepo.delete_by_id({
      id: business_id,
      user_id: session.userId,
    });
  },
);

export const admin_set_business_approved_remote = command(
  z.object({
    id: z.uuid(),
    admin_approved: z.boolean(),
  }),
  async (input) => {
    await get_session({ admin: true });

    return await BusinessService.set_admin_approved(input);
  },
);
