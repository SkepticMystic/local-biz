import { get_session } from "$lib/auth/server";
import { E } from "$lib/const/error/error.const";
import { Repo } from "$lib/repos/index.repo";
import { db } from "$lib/server/db/drizzle.db";
import { result } from "$lib/utils/result.util";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [{ session }, business] = await Promise.all([
    get_session(),

    Repo.query(
      db.query.business.findFirst({
        where: (business, { eq }) => eq(business.slug, params.slug),

        with: {
          images: {
            columns: {
              id: true,
              url: true,
              thumbhash: true,
              approved_at: true,
            },
          },
        },
      }),
    ).then((r) => result.unwrap_or(r, undefined)),
  ]);

  if (!business || business.user_id !== session.userId) {
    error(404, E.NOT_FOUND);
  }

  return {
    business,
  };
}) satisfies PageServerLoad;
