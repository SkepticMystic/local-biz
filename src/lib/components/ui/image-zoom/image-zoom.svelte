<script lang="ts">
  import Picture from "$lib/components/image/Picture.svelte";
  import { Button } from "$lib/components/ui/button";
  import { IMAGES } from "$lib/const/image/image.const";
  import { cn } from "$lib/utils/shadcn.util";
  import { type Snippet } from "svelte";
  import { writable } from "svelte/store";
  import { fade } from "svelte/transition";
  import Icon from "../icon/Icon.svelte";
  import { setImageZoomContext, type ZoomImageData } from "./ctx";

  let {
    class: className,
    children,
  }: {
    class?: string;
    children?: Snippet;
  } = $props();

  const registeredImagesStore = writable<ZoomImageData[]>([]);
  const currentImageIndexStore = writable<number | null>(null);
  const openStore = writable(false);

  let registeredImages = $state<ZoomImageData[]>([]);
  let currentImageIndex = $state<number | null>(null);
  let isOpen = $state(false);

  $effect(() => {
    registeredImages = $registeredImagesStore;
    currentImageIndex = $currentImageIndexStore;
    isOpen = $openStore;
  });

  const currentImageData = $derived(
    currentImageIndex !== null ? registeredImages[currentImageIndex] : null,
  );
  const hasMultipleImages = $derived(registeredImages.length > 1);
  const hasPrevious = $derived(
    currentImageIndex !== null && currentImageIndex > 0,
  );
  const hasNext = $derived(
    currentImageIndex !== null &&
      currentImageIndex < registeredImages.length - 1,
  );

  function registerImage(imageData: Omit<ZoomImageData, "index">) {
    const index = $registeredImagesStore.length;
    $registeredImagesStore = [
      ...$registeredImagesStore,
      { ...imageData, index },
    ];
    return index;
  }

  function openImage(index: number) {
    $currentImageIndexStore = index;
    $openStore = true;
  }

  function nextImage() {
    if (currentImageIndex !== null && hasNext) {
      $currentImageIndexStore = currentImageIndex + 1;
    }
  }

  function prevImage() {
    if (currentImageIndex !== null && hasPrevious) {
      $currentImageIndexStore = currentImageIndex - 1;
    }
  }

  function closeZoom() {
    $openStore = false;
    $currentImageIndexStore = null;
  }

  setImageZoomContext({
    registeredImages: registeredImagesStore,
    currentImageIndex: currentImageIndexStore,
    open: openStore,
    registerImage,
    openImage,
    nextImage,
    prevImage,
  });

  function handleKeydown(event: KeyboardEvent) {
    if (!isOpen) return;
    if (event.key === "Escape") closeZoom();
    if (event.key === "ArrowLeft") prevImage();
    if (event.key === "ArrowRight") nextImage();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen && currentImageData}
  <div
    class={cn(
      "fixed inset-0 z-10000 flex items-center justify-center bg-black/90",
      className,
    )}
    transition:fade={{ duration: 150 }}
    aria-modal="true"
    role="dialog"
    tabindex="-1"
  >
    <div
      class="absolute inset-0"
      onclick={closeZoom}
      aria-label="Close"
      role="button"
    ></div>

    <div
      class="pointer-events-none relative flex max-h-[90vh] max-w-[90vw] items-center justify-center"
    >
      <Picture
        alt={currentImageData.alt}
        class="pointer-events-auto block  max-h-full max-w-full object-contain"
        image={{
          url: currentImageData.src,
          thumbhash: currentImageData.thumbhash,
        }}
        {...IMAGES.SIZES.FULL}
      />
    </div>

    {#if hasMultipleImages}
      <Button
        variant="ghost"
        size="icon"
        class="pointer-events-auto absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer text-white hover:bg-primary hover:text-gray-300 disabled:pointer-events-none disabled:opacity-30"
        onclick={prevImage}
        disabled={!hasPrevious}
        aria-label="Previous image"
      >
        <Icon
          icon="lucide/chevron-left"
          class="h-8 w-8"
        />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        class="pointer-events-auto absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-white hover:bg-primary hover:text-gray-300 disabled:pointer-events-none disabled:opacity-30"
        onclick={nextImage}
        disabled={!hasNext}
        aria-label="Next image"
      >
        <Icon
          icon="lucide/chevron-right"
          class="h-8 w-8"
        />
      </Button>
    {/if}

    <Button
      variant="ghost"
      size="icon"
      class="pointer-events-auto absolute top-4 right-4 cursor-pointer text-white hover:bg-primary hover:text-gray-300"
      onclick={closeZoom}
      aria-label="Close zoomed image"
    >
      <Icon
        icon="lucide/x"
        class="h-6 w-6"
      />
    </Button>
  </div>
{/if}

{@render children?.()}
