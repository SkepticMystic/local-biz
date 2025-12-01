import { admin_set_seller_profile_approved_remote } from "$lib/remote/seller_profile/seller_profile.remote";
import { Client } from "../index.client";

export const SellerProfileClient = {
  set_admin_approved: Client.wrap(
    (input: Parameters<typeof admin_set_seller_profile_approved_remote>[0]) =>
      admin_set_seller_profile_approved_remote(input),
    {
      confirm: (input) =>
        `Are you sure you want to ${input.admin_approved ? "approve" : "deny"} this seller profile?`,
      suc_msg: (input) =>
        `Business ${input.admin_approved ? "approved" : "denied"}`,
    },
  ),
};
