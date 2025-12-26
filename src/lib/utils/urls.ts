import { captureException } from "@sentry/sveltekit";

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
  try {
    const url = new URL(base + path);

    if (search) {
      add_search(url, search);
    }

    return url;
  } catch (error) {
    console.error("Url.build.error", { base, path, search }, error);

    captureException(error);

    throw error;
  }
};

const safe = (url: string | URL) => {
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

const strip_protocol = (href: string) => {
  if (href.startsWith("https://")) {
    return href.slice(8);
  } else if (href.startsWith("http://")) {
    return href.slice(7);
  } else if (href.startsWith("mailto:")) {
    return href.slice(7);
  } else if (href.startsWith("tel:")) {
    return href.slice(4);
  } else {
    return href;
  }
};

const format = (href: string) => {
  const url = safe(href);
  if (!url) return href;

  return url.host.replace("www.", "");
};

export const Url = {
  safe,
  build,
  format,
  add_search,

  strip_protocol,
  strip_origin: (url: URL) => url.pathname + url.search + url.hash,
};
