<script lang="ts">
  import type { WithElementRef } from "$lib/utils/shadcn.util";
  import type { Snippet } from "svelte";
  import CarouselNext from "./carousel-next.svelte";
  import CarouselPrevious from "./carousel-previous.svelte";
  import CarouselRoot from "./carousel-root.svelte";
  import type { CarouselProps } from "./context";

  let {
    content,
    ...rest_props
  }: WithElementRef<CarouselProps> & {
    /** Expects the Carousel.Content wrapper */
    content: Snippet;
  } = $props();
</script>

<CarouselRoot {...rest_props}>
  {@render content()}

  <div class="hidden lg:block">
    <CarouselPrevious />
    <CarouselNext />
  </div>
</CarouselRoot>
