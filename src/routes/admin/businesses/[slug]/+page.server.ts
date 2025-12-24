import { get_session } from "$lib/auth/server";
import { E } from "$lib/const/error/error.const";
import { Repo } from "$lib/repos/index.repo";
import { db } from "$lib/server/db/drizzle.db";
import { Markdown } from "$lib/utils/markdown/markdown.util";
import { result } from "$lib/utils/result.util";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [_admin, business] = await Promise.all([
    get_session({ admin: true }),

    db.query.business.findFirst({
      where: (business, { eq }) => eq(business.slug, params.slug),

      with: {
        images: {
          columns: { id: true, url: true, thumbhash: true },
        },
      },
    }),
  ]);

  if (!business) {
    error(404, E.NOT_FOUND);
  }

  const streamed = {
    seller_profile: Repo.query(
      db.query.seller_profile.findFirst({
        where: (seller_profile, { eq }) =>
          eq(seller_profile.user_id, business.user_id),
      }),
    ).then((r) => result.unwrap_or(r, undefined)),
  };

  const prerendered = {
    description: business.description
      ? Markdown.to_html(business.description)
      : null,
  };

  return {
    business,
    streamed,
    prerendered,
  };
}) satisfies PageServerLoad;
