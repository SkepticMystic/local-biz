import { E } from "$lib/const/error/error.const";
import { db } from "$lib/server/db/drizzle.db";
import {
  BusinessTable,
  type Business,
} from "$lib/server/db/models/business.model";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { captureException } from "@sentry/sveltekit";
import { and, DrizzleQueryError, eq } from "drizzle-orm";
import { Strings } from "$lib/utils/strings.util";

const create = async (
  input: Omit<typeof BusinessTable.$inferInsert, "slug">,
): Promise<App.Result<Business>> => {
  try {
    const [business] = await db
      .insert(BusinessTable)
      .values({ ...input, slug: Strings.slugify(input.name) })
      .returning();

    if (!business) {
      Log.error({ input }, "BusinessService.create.error not found");

      return result.err({ message: "Failed to create business" });
    } else {
      return result.suc(business);
    }
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "create_business_remote.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "create_business_remote.error unknown");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  }
};

const update = async (
  input: Partial<typeof BusinessTable.$inferInsert> & {
    id: string;
    user_id: string;
  },
): Promise<App.Result<Business>> => {
  console.log("update_business_remote.input", input);

  try {
    const [business] = await db
      .update(BusinessTable)
      .set(input)
      .where(
        and(
          eq(BusinessTable.id, input.id),
          eq(BusinessTable.user_id, input.user_id), //
        ),
      )
      .returning();

    if (!business) {
      Log.error({ input }, "BusinessService.update.error not found");

      return result.err(E.NOT_FOUND);
    } else {
      return result.suc(business);
    }
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      Log.error(
        { message: error.message },
        "update_business_remote.error DrizzleQueryError",
      );

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    } else {
      Log.error(error, "update_business_remote.error unknown");

      captureException(error);

      return result.err(E.INTERNAL_SERVER_ERROR);
    }
  }
};

export const BusinessService = {
  create,
  update,
};
