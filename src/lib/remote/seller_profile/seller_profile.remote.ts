import { command, form, query } from "$app/server";
import { get_session } from "$lib/auth/server";
import { SellerProfileRepo } from "$lib/repos/seller_profile.repo";
import { SellerProfileSchema } from "$lib/server/db/models/seller_profile.model";
import { AIModerationService } from "$lib/services/ai/moderation/moderation.ai.service";
import { SellerProfileService } from "$lib/services/seller_profile/seller_profile.service";
import { error } from "@sveltejs/kit";
import { waitUntil } from "@vercel/functions";
import z from "zod";

export const get_all_public_seller_profiles_remote = query(async () => {
  const res = await SellerProfileRepo.get_all_public();

  if (!res.ok) {
    error(res.error.status ?? 500, res.error.message);
  }

  return res.data;
});

export const upsert_seller_profile_remote = form(
  SellerProfileSchema.insert.extend({ id: z.uuid().optional() }),
  async (input) => {
    const { user } = await get_session();

    waitUntil(
      AIModerationService.moderate([
        { type: "text", text: input.name },
        { type: "text", text: input.description },
        { type: "image_url", image_url: { url: input.logo } },
      ]),
    );

    const res = input.id
      ? await SellerProfileService.update_one(
          { id: input.id, user_id: user.id },
          input,
        )
      : await SellerProfileService.create({ ...input, user_id: user.id });

    console.log("upsert_seller_profile_remote.res", res);

    return res;
  },
);

export const admin_toggle_seller_profile_approved_at_remote = command(
  z.uuid(),
  async (seller_profile_id) => {
    await get_session({ admin: true });

    return await SellerProfileService.toggle_approved_at(seller_profile_id);
  },
);
