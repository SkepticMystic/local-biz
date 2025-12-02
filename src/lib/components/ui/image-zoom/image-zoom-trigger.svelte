<script lang="ts">
  import Picture from "$lib/components/image/Picture.svelte";
  import { cn } from "$lib/utils/shadcn.util";
  import { onMount, type ComponentProps } from "svelte";
  import { getImageZoomContext } from "./ctx";

  let { class: klass, ...picture }: ComponentProps<typeof Picture> = $props();

  const { registerImage, openImage } = getImageZoomContext();

  let index: number;
  let src = picture.image?.url ?? picture.src;

  onMount(() => {
    if (!src) {
      console.warn("ImageZoom.Trigger requires a 'src' prop.");
      return;
    }

    index = registerImage({
      src,
      alt: picture.alt ?? "",
      thumbhash: picture.image?.thumbhash ?? null,
    });
  });

  function handleOpenZoom() {
    if (index !== undefined) {
      openImage(index);
    }
  }
</script>

<Picture
  class={cn(
    "cursor-zoom-in transition-transform duration-200 hover:scale-[1.01] hover:brightness-90",
    klass,
  )}
  onclick={handleOpenZoom}
  {...picture}
/>
