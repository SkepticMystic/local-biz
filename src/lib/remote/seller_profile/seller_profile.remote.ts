import { command, form, query } from "$app/server";
import { get_session } from "$lib/auth/server";
import { SellerProfileRepo } from "$lib/repos/seller_profile.repo";
import { SellerProfileSchema } from "$lib/server/db/models/seller_profile.model";
import { SellerProfileService } from "$lib/services/seller_profile/seller_profile.service";
import { error } from "@sveltejs/kit";
import z from "zod";

export const get_all_public_seller_profiles_remote = query(async () => {
  const res = await SellerProfileRepo.get_all_public();

  if (!res.ok) {
    error(res.error.status ?? 500, res.error.message);
  }

  return res.data;
});

export const get_seller_profile_by_slug_remote = query.batch(
  z.string(),
  async (slugs) => {
    const res = await SellerProfileRepo.get_many_by_slugs(slugs);

    if (!res.ok) {
      error(res.error.status ?? 500, res.error.message);
    }

    const map = new Map(
      res.data.map((seller_profile) => [seller_profile.slug, seller_profile]),
    );

    return (slug) => map.get(slug);
  },
);

export const create_seller_profile_remote = form(
  SellerProfileSchema.insert,
  async (input) => {
    console.log("create_seller_profile_remote.input", input);
    const { user } = await get_session();

    const res = await SellerProfileService.create({
      ...input,
      user_id: user.id,
    });

    console.log("create_seller_profile_remote.res", res);

    return res;
  },
);

export const update_seller_profile_remote = form(
  SellerProfileSchema.update,
  async (input) => {
    console.log("update_seller_profile_remote.input", input);

    const { user } = await get_session();

    const res = await SellerProfileService.update({
      ...input,
      user_id: user.id,
    });

    console.log("update_seller_profile_remote.res", res);

    return res;
  },
);

export const upsert_seller_profile_remote = form(
  SellerProfileSchema.insert.extend({ id: z.uuid().optional() }),
  async (input) => {
    console.log("upsert_seller_profile_remote.input", input);

    const { user } = await get_session();

    const res = input.id
      ? await SellerProfileService.update({
          ...input,
          id: input.id,
          user_id: user.id,
        })
      : await SellerProfileService.create({ ...input, user_id: user.id });

    console.log("upsert_seller_profile_remote.res", res);

    return res;
  },
);

export const admin_set_seller_profile_approved_remote = command(
  z.object({
    id: z.uuid(),
    admin_approved: z.boolean(),
  }),
  async (input) => {
    await get_session({ admin: true });

    return await SellerProfileService.set_admin_approved(input);
  },
);
