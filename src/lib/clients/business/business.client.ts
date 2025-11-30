import { admin_set_business_approved_remote } from "$lib/remote/business/business.remote";
import { Client } from "../index.client";

export const BusinessClient = {
  set_admin_approved: Client.wrap(
    (input: Parameters<typeof admin_set_business_approved_remote>[0]) =>
      admin_set_business_approved_remote(input),
    {
      confirm: (input) =>
        `Are you sure you want to ${input.admin_approved ? "approve" : "deny"} this business?`,
      suc_msg: (input) =>
        `Business ${input.admin_approved ? "approved" : "denied"}`,
    },
  ),
};
