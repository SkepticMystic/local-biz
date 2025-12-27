<script lang="ts">
  import { cn } from "$lib/utils/shadcn.util.js";
  import type { WithoutChildren } from "bits-ui";
  import type { ButtonProps } from "../button/button-root.svelte";
  import ButtonRoot from "../button/button-root.svelte";
  import Icon from "../icon/Icon.svelte";
  import { getEmblaContext } from "./context.js";

  let {
    ref = $bindable(null),
    class: className,
    variant = "outline",
    size = "icon",
    ...restProps
  }: WithoutChildren<ButtonProps> = $props();

  const emblaCtx = getEmblaContext("<Carousel.Previous/>");
</script>

<ButtonRoot
  {size}
  {variant}
  data-slot="carousel-previous"
  aria-disabled={!emblaCtx.canScrollPrev}
  class={cn(
    "absolute size-8 rounded-full",
    emblaCtx.orientation === "horizontal"
      ? "-start-12 top-1/2 -translate-y-1/2"
      : "start-1/2 -top-12 -translate-x-1/2 rotate-90",
    className,
  )}
  onclick={emblaCtx.scrollPrev}
  onkeydown={emblaCtx.handleKeyDown}
  {...restProps}
  bind:ref
>
  <Icon
    icon="lucide/arrow-left"
    class="size-4"
  />
  <span class="sr-only">Previous slide</span>
</ButtonRoot>
