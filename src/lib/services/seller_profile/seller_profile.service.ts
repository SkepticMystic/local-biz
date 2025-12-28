import { E } from "$lib/const/error/error.const";
import { Repo } from "$lib/repos/index.repo";
import { SellerProfileRepo } from "$lib/repos/seller_profile.repo";
import { db } from "$lib/server/db/drizzle.db";
import {
  SellerProfileTable,
  type SellerProfile,
} from "$lib/server/db/models/seller_profile.model";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { Strings } from "$lib/utils/strings.util";
import { captureException } from "@sentry/sveltekit";

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

const update_one = async (
  where: { id: string; user_id: string },
  update: Partial<typeof SellerProfileTable.$inferInsert>,
): Promise<App.Result<SellerProfile>> => {
  console.log("SellerProfileService.update_one", where, update);

  try {
    const res = await SellerProfileRepo.update_one(where, update);

    return res;
  } catch (error) {
    Log.error(error, "SellerProfileService.update_one.error unknown");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

const toggle_approved_at = async (
  id: string,
): Promise<App.Result<SellerProfile>> => {
  try {
    const seller_profile = await Repo.query(
      db.query.seller_profile.findFirst({
        where: (seller_profile, { eq }) => eq(seller_profile.id, id),
      }),
    );

    if (!seller_profile.ok) {
      return seller_profile;
    } else if (!seller_profile.data) {
      return result.err(E.NOT_FOUND);
    }

    const res = await SellerProfileRepo.update_one(
      { id },
      { approved_at: seller_profile.data.approved_at ? null : new Date() },
    );

    // TODO: Send email notification to user about approval status
    // if (res.ok) {
    //   await EmailService.sendSellerProfileApprovalNotification({
    //     user_id: seller_profile.data.user_id,
    //     profile_name: seller_profile.data.name,
    //     approved: res.data.approved_at !== null,
    //   });
    // }

    return res;
  } catch (error) {
    Log.error(error, "SellerProfileService.toggle_approved_at.error unknown");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

export const SellerProfileService = {
  create,
  update_one,
  toggle_approved_at,
};
