import strip from "remove-markdown";
import type { IHTML } from "../html/html.util";
import { carta } from "./carta.util";

export const Markdown = {
  strip,
  to_html: (md: string) => carta.renderSSR(md) as IHTML.Prerendered,
};
