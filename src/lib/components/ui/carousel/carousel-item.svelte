<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils/shadcn.util.js";
  import type { HTMLAttributes } from "svelte/elements";
  import { getEmblaContext } from "./context.js";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

  const emblaCtx = getEmblaContext("<Carousel.Item/>");
</script>

<div
  bind:this={ref}
  role="group"
  data-slot="carousel-item"
  aria-roledescription="slide"
  class={cn(
    "min-w-0 shrink-0 grow-0 basis-full",
    emblaCtx.orientation === "horizontal" ? "ps-4" : "pt-4",
    className,
  )}
  data-embla-slide=""
  {...restProps}
>
  {@render children?.()}
</div>
