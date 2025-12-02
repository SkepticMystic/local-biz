import { get_session } from "$lib/auth/server";
import { db } from "$lib/server/db/drizzle.db";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const [_admin, seller_profiles] = await Promise.all([
    get_session({ admin: true }),
    db.query.seller_profile.findMany({
      orderBy: (seller_profiles, { desc }) => [desc(seller_profiles.createdAt)],
    }),
  ]);

  return { seller_profiles };
}) satisfies PageServerLoad;
