import type { ResourceKind } from "$lib/const/resource/resource.const";
import { db } from "$lib/server/db/drizzle.db";
import { Log } from "$lib/utils/logger.util";

// WARN: Does not check user_id!
const get_by_kind_and_id = async (input: {
  resource_id: string;
  resource_kind: ResourceKind;
}) => {
  switch (input.resource_kind) {
    case "business": {
      return db.query[input.resource_kind].findFirst({
        columns: { id: true, user_id: true, slug: true },
        where: (res, { eq }) => eq(res.id, input.resource_id),
      });
    }

    case "seller_profile": {
      return db.query[input.resource_kind].findFirst({
        columns: { id: true, user_id: true, slug: true },
        where: (res, { eq }) => eq(res.id, input.resource_id),
      });
    }

    default: {
      Log.error(`Unsupported image resource kind: ${input.resource_kind}`);

      return undefined;
    }
  }
};

export const ResourceService = {
  get_by_kind_and_id,
};
