<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Input from "../ui/input/input.svelte";

  let { value, ...rest }: ComponentProps<typeof Input> = $props();
</script>

<Input
  inputmode="url"
  addon="https://"
  align="inline-start"
  value={typeof value === "string" && value.startsWith("https://")
    ? value.slice(8)
    : value}
  {...rest}
/>
