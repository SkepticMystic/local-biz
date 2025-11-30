import { E } from "$lib/const/error/error.const";
import { db } from "$lib/server/db/drizzle.db";
import { Markdown } from "$lib/utils/markdown/markdown.util";
import { SEOUtil } from "$lib/utils/seo/seo.util";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const business = await db.query.business.findFirst({
    where: (business, { eq, and }) =>
      and(
        eq(business.slug, params.slug), //
        eq(business.admin_approved, true),
      ),
  });

  if (!business) {
    error(404, E.NOT_FOUND);
  }

  const prerendered = {
    description: business.description ? Markdown.to_html(business.description) : null,
  };

  return {
    business,
    prerendered,

    seo: SEOUtil.transform({
      title: business.name,
      description: business.description,

      openGraph: {
        images: [{ url: business.logo }],
      },
    }),
  };
}) satisfies PageServerLoad;
