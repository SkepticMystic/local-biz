const add_search = (
  url: URL,
  search: URLSearchParams | Record<string, unknown>,
) => {
  const resolved =
    search instanceof URLSearchParams ? Object.fromEntries(search) : search;

  for (const key in resolved) {
    if (resolved[key] === undefined) continue;

    url.searchParams.set(key, String(resolved[key]));
  }

  return url;
};

const build = (
  base: string,
  path: string,
  search?: URLSearchParams | Record<string, unknown>,
) => {
  const url = new URL(base + path);

  if (search) {
    add_search(url, search);
  }

  return url;
};

const safe = (url: string | URL) => {
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

export const Url = {
  safe,
  build,
  add_search,
  strip_origin: (url: URL) => url.pathname + url.search + url.hash,
};
