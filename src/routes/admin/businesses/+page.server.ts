import { get_session } from "$lib/auth/server";
import { Repo } from "$lib/repos/index.repo";
import { db } from "$lib/server/db/drizzle.db";
import { result } from "$lib/utils/result.util";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const [_admin, businesses] = await Promise.all([
    get_session({ admin: true }),

    Repo.query(() =>
      db.query.business.findMany({
        orderBy: (business, { desc }) => [desc(business.createdAt)],

        columns: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          category: true,
          tags: true,
          createdAt: true,
          admin_approved: true,
          formatted_address: true,
        },

        with: {
          user: {
            columns: {
              email: true,
            },
          },
        },
      }),
    ).then((r) => result.unwrap_or(r, [])),
  ]);

  return { businesses };
}) satisfies PageServerLoad;
