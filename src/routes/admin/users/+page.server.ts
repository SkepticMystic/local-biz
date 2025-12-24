import { get_session } from "$lib/auth/server";
import { Repo } from "$lib/repos/index.repo";
import { db } from "$lib/server/db/drizzle.db";
import { result } from "$lib/utils/result.util";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const [_admin, users] = await Promise.all([
    get_session({ admin: true }),

    Repo.query(
      db.query.user.findMany({
        orderBy: (users, { desc }) => [desc(users.createdAt)],
      }),
    ).then((r) => result.unwrap_or(r, [])),
  ]);

  return { users };
}) satisfies PageServerLoad;
