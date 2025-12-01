import { get_session } from "$lib/auth/server";
import { db } from "$lib/server/db/drizzle.db";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const [_admin, images] = await Promise.all([
    get_session({ admin: true }),

    db.query.image.findMany({
      orderBy: (image, { desc }) => [desc(image.createdAt)],

      columns: {
        id: true,
        user_id: true,
        resource_id: true,
        resource_kind: true,

        url: true,
        thumbhash: true,

        createdAt: true,
        admin_approved: true,
      },
    }),
  ]);

  return { images };
}) satisfies PageServerLoad;
