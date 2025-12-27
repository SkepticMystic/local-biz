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

  const emblaCtx = getEmblaContext("<Carousel.Next/>");
</script>

<ButtonRoot
  {variant}
  {size}
  data-slot="carousel-next"
  aria-disabled={!emblaCtx.canScrollNext}
  class={cn(
    "absolute size-8 rounded-full",
    emblaCtx.orientation === "horizontal"
      ? "-end-12 top-1/2 -translate-y-1/2"
      : "start-1/2 -bottom-12 -translate-x-1/2 rotate-90",
    className,
  )}
  onclick={emblaCtx.scrollNext}
  onkeydown={emblaCtx.handleKeyDown}
  bind:ref
  {...restProps}
>
  <Icon
    icon="lucide/arrow-right"
    class="size-4"
  />
  <span class="sr-only">Next slide</span>
</ButtonRoot>
