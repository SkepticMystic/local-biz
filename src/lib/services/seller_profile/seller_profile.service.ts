import { E } from "$lib/const/error/error.const";
import {
  SellerProfileTable,
  type SellerProfile,
} from "$lib/server/db/models/seller_profile.model";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { Strings } from "$lib/utils/strings.util";
import { SellerProfileRepo } from "$lib/repos/seller_profile.repo";

const create = async (
  input: Omit<typeof SellerProfileTable.$inferInsert, "slug">,
): Promise<App.Result<SellerProfile>> => {
  try {
    const res = await SellerProfileRepo.create({
      ...input,
      slug: Strings.slugify(input.name),
    });

    return res;
  } catch (error) {
    Log.error(error, "SellerProfileService.create.error unknown");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

const update = async (
  input: Partial<typeof SellerProfileTable.$inferInsert> & {
    id: string;
    user_id: string;
  },
): Promise<App.Result<SellerProfile>> => {
  console.log("SellerProfileService.update.input", input);

  try {
    const res = await SellerProfileRepo.update(input);

    return res;
  } catch (error) {
    Log.error(error, "SellerProfileService.update.error unknown");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

const set_admin_approved = async (input: {
  id: string;
  admin_approved: boolean;
}): Promise<App.Result<void>> => {
  try {
    const res = await SellerProfileRepo.set_admin_approved(input);

    if (!res.ok) {
      return res;
    }

    // TODO: Send email notification to user about approval status
    // const seller_profile = await SellerProfileRepo.get_by_id(input.id);
    // if (seller_profile.ok && seller_profile.data) {
    //   await EmailService.sendSellerProfileApprovalNotification({
    //     user_id: seller_profile.data.user_id,
    //     profile_name: seller_profile.data.name,
    //     approved: input.admin_approved,
    //   });
    // }

    return res;
  } catch (error) {
    Log.error(error, "SellerProfileService.set_admin_approved.error unknown");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

export const SellerProfileService = {
  create,
  update,
  set_admin_approved,
};
