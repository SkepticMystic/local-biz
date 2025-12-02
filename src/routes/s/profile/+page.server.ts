import { get_session } from "$lib/auth/server";
import { db } from "$lib/server/db/drizzle.db";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const { user } = await get_session();

  const seller_profile = await db.query.seller_profile.findFirst({
    where: (seller_profile, { eq }) => eq(seller_profile.user_id, user.id),

    with: {
      images: {
        columns: { id: true, url: true, thumbhash: true },
      },
    },
  });

  return { seller_profile };
}) satisfies PageServerLoad;
