import { RESOURCES } from "$lib/const/resource/resource.const";
import z from "zod";

export const resource_key_schema = z.object({
  resource_id: z.uuid(),
  resource_kind: z.enum(RESOURCES.KIND.IDS),
});

export type ResourceKey = z.infer<typeof resource_key_schema>;
