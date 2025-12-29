import { BUSINESS } from "$lib/const/business/business.const";
import type { Business } from "$lib/server/db/models/business.model";
import type { PageLoad } from "./$types";

export const load = (async ({ url }) => {
  const search_category = url.searchParams.get("category");

  const search = {
    category: BUSINESS.CATEGORY.IDS.includes(
      search_category as Business["category"],
    )
      ? search_category
      : undefined,
  };

  return {
    search,
  };
}) satisfies PageLoad;
