import { marked } from "marked";
import strip from "remove-markdown";
import type { IHTML } from "../html/html.util";

export const Markdown = {
  strip,
  to_html: (md: string) =>
    marked.parse(md, { async: false }) as IHTML.Prerendered,
};
