<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte";
  import type { RemoteFormField } from "@sveltejs/kit";
  import { parsePhoneNumberFromString as parse_phone_number } from "libphonenumber-js/min";
  import type { ComponentProps } from "svelte";

  let {
    field,
    ...rest
  }: Omit<ComponentProps<typeof Input>, "type" | "value" | "files"> & {
    field: RemoteFormField<string>;
  } = $props();

  let { value: _value, ...field_props } = $derived(field.as("tel"));
</script>

<Input
  {...field_props}
  inputmode="tel"
  autocomplete="tel"
  placeholder="011 234 5678"
  value={parse_phone_number(field.value() ?? "", "ZA")?.formatNational() ??
    field.value()}
  oninput={(e) => field.set(e.currentTarget.value)}
  {...rest}
/>
