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

    with: {
      images: {
        columns: { url: true, thumbhash: true },

        where: (image, { eq }) => eq(image.admin_approved, true),
      },
    },
  });

  if (!business) {
    error(404, E.NOT_FOUND);
  }

  const prerendered = {
    description: business.description
      ? Markdown.to_html(business.description)
      : null,
  };

  const streamed = {
    seller_profile: db.query.seller_profile.findFirst({
      where: (seller_profile, { and, eq }) =>
        and(
          eq(seller_profile.admin_approved, true),
          eq(seller_profile.user_id, business.user_id), //
        ),

      columns: {
        name: true,
        slug: true,
        logo: true,
        description: true,
      },
    }),
  };

  return {
    business,
    streamed,
    prerendered,

    seo: SEOUtil.transform({
      title: business.name,
      description: business.description,

      openGraph: {
        images: [
          business.logo ? { url: business.logo } : null,
          business.images.at(0) ? { url: business.images.at(0)!.url } : null,
        ].flatMap((i) => (i ? [i] : [])),

        article: {
          modifiedTime: business.updatedAt.toISOString(),
          publishedTime: business.createdAt.toISOString(),
        },
      },
    }),
  };
}) satisfies PageServerLoad;
