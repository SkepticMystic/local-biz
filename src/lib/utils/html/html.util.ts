import type { Branded } from "$lib/interfaces/zod/zod.types";
import DOMPurify from "isomorphic-dompurify";

export const HTMLUtil = {
  sanitize: (dirty: string) => DOMPurify.sanitize(dirty) as IHTML.Sanitized,
};

export declare namespace IHTML {
  export type Sanitized = Branded<"SanitizedHTML">;
  export type Prerendered = Branded<"PrerenderedHTML">;
}
