<script
  lang="ts"
  generics="T extends Item"
>
  import type { Item } from "$lib/utils/items.util";
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";
  import Empty, { type EmptyProps } from "../empty/empty.svelte";
  import CarouselContent from "./carousel-content.svelte";
  import CarouselItem from "./carousel-item.svelte";
  import Carousel from "./carousel.svelte";

  let {
    item,
    items,
    empty,
    class: klass,
  }: {
    items: T[];
    class?: ClassValue;
    empty?: EmptyProps;
    item: Snippet<[T, number]>;
  } = $props();
</script>

{#if items.length}
  <Carousel class={klass}>
    {#snippet content()}
      <CarouselContent class="">
        {#each items as _, i (_.id)}
          <CarouselItem class="basis-auto">
            {@render item(items[i]!, i)}
          </CarouselItem>
        {/each}
      </CarouselContent>
    {/snippet}
  </Carousel>
{:else}
  <Empty {...empty} />
{/if}
