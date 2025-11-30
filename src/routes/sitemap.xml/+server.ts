import { APP } from "$lib/const/app.const";
import type { RequestHandler } from "@sveltejs/kit";
import * as sitemap from "super-sitemap";
import { db } from "$lib/server/db/drizzle.db";

export const prerender = true;

export const GET: RequestHandler = async () => {
  const [businesses] = await Promise.all([
    db.query.business.findMany({
      columns: { slug: true, updatedAt: true },
    }),
  ]);

  return await sitemap.response({
    origin: APP.URL,

    excludeRoutePatterns: ["^/admin"],

    paramValues: {
      "/businesses/[slug]": businesses.map((business) => ({
        values: [business.slug],
        lastmod: business.updatedAt?.toISOString().split("T")[0],
      })),
    } satisfies Partial<Record<RouteId, sitemap.ParamValues[string]>>,
  });
};
