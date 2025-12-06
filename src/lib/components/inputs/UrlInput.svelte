<script lang="ts">
  import type { RemoteFormField } from "@sveltejs/kit";
  import type { ComponentProps } from "svelte";
  import Input from "../ui/input/input.svelte";

  let {
    field,
    ...rest
  }: {
    field: RemoteFormField<string>;
  } & Omit<ComponentProps<typeof Input>, "type" | "value" | "files"> = $props();

  let { value, ...field_props } = $derived(field.as("text"));
</script>

<Input
  {...field_props}
  inputmode="url"
  addon="https://"
  align="inline-start"
  value={typeof value === "string" && value.startsWith("https://")
    ? value.slice(8)
    : value}
  {...rest}
/>
