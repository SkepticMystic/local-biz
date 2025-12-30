import { marked } from "marked";
import strip from "remove-markdown";
import type { IHTML } from "../html/html.util";

export const Markdown = {
  strip,
  to_html: (md: string) =>
    marked.parse(md, {
      gfm: true,
      async: false,

      // NOTE: If true, add <br> on a single line break
      // (copies GitHub behavior on comments, but not on rendered markdown files).
      // Requires gfm be true.
      breaks: true,
    }) as IHTML.Prerendered,
};
