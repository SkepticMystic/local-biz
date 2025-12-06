<script lang="ts">
  import { Popover as PopoverPrimitive } from "bits-ui";
  import type { Snippet } from "svelte";
  import {
    buttonVariants,
    type ButtonSize,
    type ButtonVariant,
  } from "../button";
  import PopoverContent from "./popover-content.svelte";
  import PopoverTrigger from "./popover-trigger.svelte";

  let {
    size,
    variant,

    trigger,
    content,
  }: {
    size?: ButtonSize;
    variant?: ButtonVariant;

    trigger: Snippet;
    content: Snippet;
  } = $props();
</script>

<PopoverPrimitive.Root>
  <PopoverTrigger class={buttonVariants({ size, variant })}>
    {@render trigger()}
  </PopoverTrigger>

  <PopoverContent>
    {@render content()}
  </PopoverContent>
</PopoverPrimitive.Root>
