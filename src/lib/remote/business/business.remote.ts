import { command, form, query } from "$app/server";
import { get_session, safe_get_session } from "$lib/auth/server";
import { BusinessRepo } from "$lib/repos/business.repo";
import { Repo } from "$lib/repos/index.repo";
import { db } from "$lib/server/db/drizzle.db";
import { BusinessSchema } from "$lib/server/db/models/business.model";
import { AIModerationService } from "$lib/services/ai/moderation/moderation.ai.service";
import { BusinessService } from "$lib/services/business/business.service";
import { result } from "$lib/utils/result.util";
import { invalid } from "@sveltejs/kit";
import { waitUntil } from "@vercel/functions";
import z from "zod";
import { BUSINESS } from "../../const/business/business.const";
import { query_schema, where_schema } from "../../schema/query/query.schema";

export const get_all_public_businesses_remote = query(async () => {
  const res = await BusinessRepo.get_all_public();

  return result.unwrap_or(res, []);
});

export const count_all_public_businesses_remote = query(
  async (): Promise<number> => {
    const res = await BusinessRepo.count_all_public();

    return res.ok ? (res.data.at(0)?.count ?? 0) : 0;
  },
);

export const get_all_my_businesses_remote = query(async () => {
  const session = await safe_get_session();
  if (!session) {
    return [];
  }

  const res = await BusinessRepo.get_all_by_user(session.user.id);

  return result.unwrap_or(res, []);
});

export const upsert_business_remote = form(
  BusinessSchema.insert.extend({
    id: z.uuid().optional(),
  }),
  async (input) => {
    console.log("upsert_business_remote.input", input);

    const { session } = await get_session();

    waitUntil(
      AIModerationService.moderate([
        { type: "text", text: input.name },
        { type: "text", text: input.description },
        { type: "text", text: input.tags.join(", ") },
        { type: "image_url", image_url: { url: input.logo } },
      ]),
    );

    const res = input.id
      ? await BusinessService.update(
          { id: input.id, user_id: session.userId },
          input,
        )
      : await BusinessService.create({ ...input, user_id: session.userId });

    console.log("upsert_business_remote.res", res);

    if (!res.ok && res.error.path) {
      invalid(res.error);
    } else {
      return res;
    }
  },
);

export const admin_update_business_remote = form(
  BusinessSchema.update.extend({
    id: z.uuid(),
  }),
  async (input) => {
    await get_session({ admin: true });

    return await BusinessService.update({ id: input.id }, input);
  },
);

export const delete_business_remote = command(
  z.uuid(), //
  async (business_id) => {
    const { session } = await get_session();

    return await BusinessService.delete_by_id({
      id: business_id,
      user_id: session.userId,
    });
  },
);

export const admin_toggle_business_approved_at_remote = command(
  z.uuid(),
  async (business_id) => {
    await get_session({ admin: true });

    return await BusinessService.toggle_approved_at(business_id);
  },
);

export const admin_transfer_business_ownership_remote = command(
  z.object({
    business_id: z.uuid(),
    target_user_email: z.email(),
  }),
  async (input) => {
    await get_session({ admin: true });

    return await BusinessService.admin_transfer_ownership(input);
  },
);

export const admin_delete_business_remote = command(
  z.uuid(),
  async (business_id) => {
    await get_session({ admin: true });

    return await BusinessService.admin_delete(business_id);
  },
);

const business_query_schema = query_schema(
  z.object({
    name: z.object(where_schema.ilike()).optional(),
    id: z.object(where_schema.nin(z.uuid())).optional(),
    category: z
      .object(where_schema.in(z.enum(BUSINESS.CATEGORY.IDS)))
      .optional(),
  }),
);

export const search_public_businesses_remote = query(
  business_query_schema,
  async (input) => {
    const businesses = await Repo.query(
      db.query.business.findMany({
        limit: input.limit,
        offset: input.offset,

        orderBy: input.orderBy
          ? (_, { sql }) => [sql.raw("RANDOM()")]
          : undefined,

        where: (business, { and, ilike, inArray, notInArray, isNotNull }) =>
          and(
            isNotNull(business.approved_at),

            input.where.id?.nin //
              ? notInArray(business.id, input.where.id.nin)
              : undefined,
            input.where.name?.ilike //
              ? ilike(business.name, "%" + input.where.name.ilike + "%")
              : undefined,

            input.where.category?.in //
              ? inArray(business.category, input.where.category.in)
              : undefined,
          ),

        with: {
          images: {
            limit: 1,
            columns: { url: true, thumbhash: true },
            where: (image, { isNotNull }) => isNotNull(image.approved_at),
          },
        },
      }),
    ).then((r) => result.unwrap_or(r, []));

    return businesses;
  },
);
