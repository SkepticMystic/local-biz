import { get_session } from "$lib/auth/server";
import { E } from "$lib/const/error/error.const";
import { db } from "$lib/server/db/drizzle.db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [_admin, seller_profile] = await Promise.all([
    get_session({ admin: true }),

    db.query.seller_profile.findFirst({
      where: (seller_profile, { eq }) => eq(seller_profile.slug, params.slug),

      with: {
        images: {
          columns: { id: true, url: true, thumbhash: true },
        },
      },
    }),
  ]);

  if (!seller_profile) {
    error(404, E.NOT_FOUND);
  }

  return {
    seller_profile,
  };
}) satisfies PageServerLoad;
