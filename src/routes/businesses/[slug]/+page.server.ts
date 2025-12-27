import { E } from "$lib/const/error/error.const";
import { Repo } from "$lib/repos/index.repo";
import { db } from "$lib/server/db/drizzle.db";
import { Markdown } from "$lib/utils/markdown/markdown.util";
import { result } from "$lib/utils/result.util";
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
    seller_profile: Repo.query(
      db.query.seller_profile.findFirst({
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
    ).then((r) => result.unwrap_or(r, undefined)),
  };

  const image = business.images.at(0);

  return {
    business,
    streamed,
    prerendered,

    seo: SEOUtil.transform({
      title: business.name,
      keywords: business.tags,
      description: business.description,

      openGraph: {
        images: [
          business.logo ? { url: business.logo } : null,
          image ? { url: image.url } : null,
        ].flatMap((i) => (i ? [i] : [])),

        article: {
          tags: business.tags,
          modifiedTime: business.updatedAt.toISOString(),
          publishedTime: business.createdAt.toISOString(),
        },
      },
    }),
  };
}) satisfies PageServerLoad;
