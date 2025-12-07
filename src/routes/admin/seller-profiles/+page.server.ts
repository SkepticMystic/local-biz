import { get_session } from "$lib/auth/server";
import { Repo } from "$lib/repos/index.repo";
import { db } from "$lib/server/db/drizzle.db";
import { result } from "$lib/utils/result.util";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const [_admin, seller_profiles] = await Promise.all([
    get_session({ admin: true }),

    Repo.query(() =>
      db.query.seller_profile.findMany({
        orderBy: (seller_profiles, { desc }) => [
          desc(seller_profiles.createdAt),
        ],
      }),
    ).then((r) => result.unwrap_or(r, [])),
  ]);

  return { seller_profiles };
}) satisfies PageServerLoad;
