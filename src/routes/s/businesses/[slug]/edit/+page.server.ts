import { get_seller_session } from "$lib/auth/server";
import { E } from "$lib/const/error/error.const";
import { db } from "$lib/server/db/drizzle.db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [seller, business] = await Promise.all([
    get_seller_session(),

    db.query.business.findFirst({
      where: (business, { eq }) => eq(business.slug, params.slug),
    }),
  ]);

  if (!business || business.org_id !== seller.session.org_id) {
    error(404, E.NOT_FOUND);
  }

  return {
    business,
  };
}) satisfies PageServerLoad;
