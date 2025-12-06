// SOURCE: https://stackoverflow.com/questions/1053902/how-to-convert-a-title-to-a-url-slug-in-jquery
const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");

const ensure_starts_with = (s: string, prefix: string) =>
  s.startsWith(prefix) ? s : prefix + s;

export const Strings = {
  slugify,
  ensure_starts_with,
};
