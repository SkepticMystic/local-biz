import { get_session } from "$lib/auth/server";
import type { PageServerLoad } from "./$types";

// TODO: Better UX here. Just redirecting to signin without any other info isn't great
export const load = (async () => {
  await get_session();

  return {};
}) satisfies PageServerLoad;
