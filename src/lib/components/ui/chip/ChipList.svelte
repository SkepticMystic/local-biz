<script lang="ts">
  import type { ComponentProps } from "svelte";
  import ChipGroup from "./chip-group.svelte";
  import Chip from "./chip.svelte";

  let {
    chips,
    size,
    variant,
  }: {
    chips: string[];
    size?: ComponentProps<typeof Chip>["size"];
    variant?: ComponentProps<typeof Chip>["variant"];
  } = $props();
</script>

<ChipGroup>
  {#each chips as chip}
    <Chip
      {size}
      {variant}
    >
      {chip}
    </Chip>
  {/each}
</ChipGroup>
