import { E } from "$lib/const/error/error.const";
import { BusinessRepo } from "$lib/repos/business.repo";
import {
  BusinessTable,
  type Business,
} from "$lib/server/db/models/business.model";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { Strings } from "$lib/utils/strings.util";
import { captureException } from "@sentry/sveltekit";

const create = async (
  input: Omit<typeof BusinessTable.$inferInsert, "slug">,
): Promise<App.Result<Business>> => {
  try {
    const res = await BusinessRepo.create({
      ...input,
      slug: Strings.slugify(input.name),
    });

    return res;
  } catch (error) {
    Log.error(error, "BusinessService.create.error unknown");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

const update = async (
  input: Partial<typeof BusinessTable.$inferInsert> & {
    id: string;
    user_id: string;
  },
): Promise<App.Result<Business>> => {
  try {
    const res = await BusinessRepo.update({
      ...input,
      admin_approved: false,
    });

    return res;
  } catch (error) {
    Log.error(error, "BusinessService.update.error unknown");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

const set_admin_approved = async (input: {
  id: string;
  admin_approved: boolean;
}): Promise<App.Result<void>> => {
  try {
    const res = await BusinessRepo.set_admin_approved(input);

    if (!res.ok) {
      return res;
    }

    // TODO: Send email notification to user about approval status
    // const business = await BusinessRepo.get_by_id(input.id);
    // if (business.ok && business.data) {
    //   await EmailService.sendBusinessApprovalNotification({
    //     user_id: business.data.user_id,
    //     business_name: business.data.name,
    //     approved: input.admin_approved,
    //   });
    // }

    return res;
  } catch (error) {
    Log.error(error, "BusinessService.set_admin_approved.error unknown");

    captureException(error);

    return result.err(E.INTERNAL_SERVER_ERROR);
  }
};

export const BusinessService = {
  create,
  update,
  set_admin_approved,
};
