import { E } from "$lib/const/error/error.const";
import type { ResourceKind } from "$lib/const/resource/resource.const";
import { Repo } from "$lib/repos/index.repo";
import { db } from "$lib/server/db/drizzle.db";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";

// WARN: Does not check user_id!
const get_by_kind_and_id = async (input: {
  resource_id: string;
  resource_kind: ResourceKind;
}) => {
  switch (input.resource_kind) {
    case "business": {
      const res = await Repo.query(
        db.query.business.findFirst({
          columns: { id: true, user_id: true, slug: true },
          where: (res, { eq }) => eq(res.id, input.resource_id),
        }),
      );

      if (!res.ok) {
        return res;
      } else {
        return res.data ? result.suc(res.data) : result.err(E.NOT_FOUND);
      }
    }

    case "seller_profile": {
      const res = await Repo.query(
        db.query.seller_profile.findFirst({
          columns: { id: true, user_id: true, slug: true },
          where: (res, { eq }) => eq(res.id, input.resource_id),
        }),
      );

      if (!res.ok) {
        return res;
      } else {
        return res.data ? result.suc(res.data) : result.err(E.NOT_FOUND);
      }
    }

    default: {
      Log.error(`Unsupported image resource kind: ${input.resource_kind}`);

      return result.err({
        status: 500,
        message: "Unsupported image resource kind",
      });
    }
  }
};

export const ResourceService = {
  get_by_kind_and_id,
};
