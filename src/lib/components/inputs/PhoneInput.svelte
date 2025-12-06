<script lang="ts">
  import { usePhonePicker } from "@kevwpl/svelte-o-phone";
  import type { RemoteFormField } from "@sveltejs/kit";
  import type { ComponentProps } from "svelte";
  import Input from "../ui/input/input.svelte";

  let {
    field,
    ...rest
  }: Omit<ComponentProps<typeof Input>, "type" | "value" | "files"> & {
    field: RemoteFormField<string>;
  } = $props();

  let { value, ...field_props } = $derived(field.as("tel"));

  const picker = usePhonePicker({
    sorting: "numeric",

    initialValue: value,
    initialCountry: "ZA",

    onchange: (data) => {
      value = data.value;
    },
  });
</script>

<Input
  {...field_props}
  inputmode="tel"
  autocomplete="tel"
  icon="lucide/phone"
  align="inline-start"
  value={picker.input}
  placeholder="011 234 5678"
  aria-label="Phone number input"
  oninput={picker.handleInput}
  bind:ref={picker.ref}
  {...rest}
/>
