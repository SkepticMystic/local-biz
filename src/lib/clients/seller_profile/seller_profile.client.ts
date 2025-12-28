import { admin_toggle_seller_profile_approved_at_remote } from "$lib/remote/seller_profile/seller_profile.remote";
import { Client } from "../index.client";

export const SellerProfileClient = {
  toggle_approved_at: Client.wrap((seller_profile_id: string) =>
    admin_toggle_seller_profile_approved_at_remote(seller_profile_id),
  ),
};
