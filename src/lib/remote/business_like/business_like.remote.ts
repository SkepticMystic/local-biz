import { command, query } from "$app/server";
import { get_session } from "$lib/auth/server";
import { BusinessLikeRepo } from "$lib/repos/business_like.repo";
import { db } from "$lib/server/db/drizzle.db";
import { BusinessLikeSchema } from "$lib/server/db/models/business_like.model";
import { error } from "@sveltejs/kit";
import z from "zod";

export const get_my_business_like_by_business_remote = query.batch(
  z.uuid(),
  async (business_ids) => {
    const { session } = await get_session();

    const results = await db.query.business_like.findMany({
      where: (row, { and, eq, inArray }) =>
        and(
          eq(row.user_id, session.userId), //
          inArray(row.business_id, business_ids),
        ),
    });

    const map = new Map(results.map((row) => [row.business_id, row]));

    return (business_id) => map.get(business_id);
  },
);

export const count_business_likes_remote = query.batch(
  z.uuid(), //
  async (business_ids) => {
    const counts =
      await BusinessLikeRepo.get_many_counts_by_business_ids(business_ids);

    if (!counts.ok) {
      error(counts.error.status ?? 500, counts.error.message);
    }

    return (business_id) => counts.data.get(business_id) ?? 0;
  },
);

export const create_business_like_remote = command(
  BusinessLikeSchema.insert,
  async (input) => {
    const { session } = await get_session();

    return await BusinessLikeRepo.create({
      user_id: session.userId,
      business_id: input.business_id,
    });
  },
);

export const delete_business_like_remote = command(
  z.object({ business_id: z.uuid() }), //
  async (input) => {
    const { session } = await get_session();

    return await BusinessLikeRepo.delete_by_user_and_business({
      user_id: session.userId,
      business_id: input.business_id,
    });
  },
);
