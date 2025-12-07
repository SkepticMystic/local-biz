import { command, query } from "$app/server";
import { get_session, safe_get_session } from "$lib/auth/server";
import { BusinessLikeRepo } from "$lib/repos/business_like.repo";
import { Repo } from "$lib/repos/index.repo";
import { db } from "$lib/server/db/drizzle.db";
import {
  BusinessLikeSchema,
  BusinessLikeTable,
} from "$lib/server/db/models/business_like.model";
import { result } from "$lib/utils/result.util";
import { error } from "@sveltejs/kit";
import { count } from "drizzle-orm";
import z from "zod";

export const get_my_business_like_by_business_remote = query.batch(
  z.uuid(),
  async (business_ids) => {
    const session = await safe_get_session();
    if (!session) {
      return () => undefined;
    }

    const res = await Repo.query(() =>
      db.query.business_like.findMany({
        where: (row, { and, eq, inArray }) =>
          and(
            eq(row.user_id, session.user.id), //
            inArray(row.business_id, business_ids),
          ),
      }),
    );

    if (!res.ok) {
      return () => undefined;
    }

    const map = new Map(res.data.map((row) => [row.business_id, row]));

    return (business_id) => map.get(business_id);
  },
);

export const count_all_business_likes_remote = query(async () => {
  const res = await Repo.query(() =>
    db
      .select({ count: count(BusinessLikeTable.id) })
      .from(BusinessLikeTable)
      .execute(),
  );

  return res.ok ? (res.data.at(0)?.count ?? 0) : 0;
});

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
    const session = await safe_get_session();
    if (!session) {
      return result.err({
        status: 401,
        level: "warning",
        message: "You must have an account to like a business",
      } satisfies App.Error);
    }

    return await BusinessLikeRepo.create({
      user_id: session.user.id,
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
