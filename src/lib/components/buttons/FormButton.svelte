<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Button from "../ui/button/button.svelte";

  let {
    form,
    children,
    ...rest
  }: {
    form: { pending: number };
  } & Omit<ComponentProps<typeof Button>, "form" | "target" | "href"> =
    $props();
</script>

<Button
  type="submit"
  icon="lucide/send"
  loading={form.pending > 0}
  {...rest}
>
  {#if children}
    {@render children()}
  {:else}
    Submit
  {/if}
</Button>
