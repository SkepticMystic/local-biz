import { Strings } from "../../utils/strings.util";
import z from "zod";

export const friendly_url_schema = z
  .string()
  .transform((s) => Strings.ensure_starts_with(s, "https://"))
  .transform((s) => z.url().safeParse(s))
  .refine((s) => s.success, "Invalid URL")
  .transform((s) => s.data!)
  .brand("Url");
