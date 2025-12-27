<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Input from "../ui/input/input.svelte";

  let { value, ...rest }: ComponentProps<typeof Input> = $props();
</script>

<Input
  inputmode="url"
  addon="www."
  align="inline-start"
  value={value
    .toString()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "")}
  {...rest}
/>
