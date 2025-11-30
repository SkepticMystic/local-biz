import { get_session } from "$lib/auth/server";
import { db } from "$lib/server/db/drizzle.db";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const [_admin, businesses] = await Promise.all([
    get_session({ admin: true }),

    db.query.business.findMany({
      orderBy: (business, { desc }) => [desc(business.createdAt)],

      columns: {
        id: true,
        name: true,
        logo: true,
        createdAt: true,
        admin_approved: true,
        formatted_address: true,
      },
    }),
  ]);

  return { businesses };
}) satisfies PageServerLoad;
