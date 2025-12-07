import { safe_get_session } from "$lib/auth/server";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const session = await safe_get_session();

  return { session };
}) satisfies PageServerLoad;
