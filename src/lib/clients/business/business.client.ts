import { admin_set_business_approved_remote } from "$lib/remote/business/business.remote";
import { session } from "$lib/stores/session.store";
import {
  count_business_likes_remote,
  create_business_like_remote,
  delete_business_like_remote,
  get_my_business_like_by_business_remote,
} from "../../remote/business_like/business_like.remote";
import { Client } from "../index.client";

export const BusinessClient = {
  like: Client.wrap(
    (input: Parameters<typeof create_business_like_remote>[0]) =>
      create_business_like_remote(input) //
        .updates(
          count_business_likes_remote(input.business_id) //
            .withOverride((cur) => cur + 1),

          get_my_business_like_by_business_remote(input.business_id) //
            .withOverride(() =>
              session.value?.data?.user.id
                ? {
                    id: crypto.randomUUID(),
                    business_id: input.business_id,
                    user_id: session.value.data.user.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  }
                : undefined,
            ),
        ),
  ),

  unlike: Client.wrap(
    (input: Parameters<typeof delete_business_like_remote>[0]) =>
      delete_business_like_remote(input).updates(
        count_business_likes_remote(input.business_id) //
          .withOverride((cur) => Math.max(0, cur - 1)),

        get_my_business_like_by_business_remote(input.business_id) //
          .withOverride(() => undefined),
      ),
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
