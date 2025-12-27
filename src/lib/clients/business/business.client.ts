import {
  admin_delete_business_remote,
  admin_set_business_approved_remote,
  admin_transfer_business_ownership_remote,
  delete_business_remote,
  get_all_my_businesses_remote,
} from "$lib/remote/business/business.remote";
import { session } from "$lib/stores/session.store";
import { Items } from "$lib/utils/items.util";
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

  delete: Client.wrap(
    (input: Parameters<typeof delete_business_remote>[0]) =>
      delete_business_remote(input).updates(
        get_all_my_businesses_remote() //
          .withOverride((cur) => Items.remove(cur, input)),

        // NOTE: We could update these remotes as well, but these buyer-facing metrics aren't as relevant to the seller when they're deleting a business

        // get_my_business_like_by_business_remote(input) //
        //   .withOverride(() => undefined),

        // count_business_likes_remote(input) //
        //   .withOverride((cur) => Math.max(0, cur - 1)),
      ),
    {
      confirm: "Are you sure you want to delete this business?",
      suc_msg: "Business deleted",
    },
  ),

  set_admin_approved: Client.wrap(
    (input: Parameters<typeof admin_set_business_approved_remote>[0]) =>
      admin_set_business_approved_remote(input),
  ),

  admin_transfer_ownership: Client.wrap(
    (input: Parameters<typeof admin_transfer_business_ownership_remote>[0]) =>
      admin_transfer_business_ownership_remote(input),
    {
      confirm: (input) =>
        `Are you sure you want to transfer ownership of this business to ${input.target_user_email}?`,
      suc_msg: (input) => `Business transferred to ${input.target_user_email}`,
    },
  ),

  admin_delete: Client.wrap(
    (input: Parameters<typeof admin_delete_business_remote>[0]) =>
      admin_delete_business_remote(input),
    { confirm: "Are you sure you want to delete this business?" },
  ),
};
