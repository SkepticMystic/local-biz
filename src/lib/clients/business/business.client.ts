import { admin_set_business_approved_remote } from "$lib/remote/business/business.remote";
import {
  create_business_like_remote,
  delete_business_like_remote,
} from "../../remote/business_like/business_like.remote";
import { Client } from "../index.client";

export const BusinessClient = {
  like: Client.wrap(
    (input: Parameters<typeof create_business_like_remote>[0]) =>
      create_business_like_remote(input),
    { suc_msg: "Liked!" },
  ),

  unlike: Client.wrap(
    (input: Parameters<typeof delete_business_like_remote>[0]) =>
      delete_business_like_remote(input),
    { suc_msg: "Like removed" },
  ),

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
