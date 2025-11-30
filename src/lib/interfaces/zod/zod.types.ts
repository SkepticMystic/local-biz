import type { z } from "zod/mini";

export type Branded<B extends string, T = string> = T & z.$brand<B>;
