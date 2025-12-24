<script lang="ts">
  import { ImageClient } from "$lib/clients/image/image.client";
  import { Image as ImageBase } from "@unpic/svelte/base";
  import type { ClassValue, HTMLAttributeAnchorTarget } from "svelte/elements";
  import { transform } from "unpic/providers/cloudinary";
  import type { Image } from "../../server/db/models/image.model";
  import { cn } from "../../utils/shadcn.util";

  let {
    src,
    alt,
    href,
    image,
    width,
    height,
    target,
    loading,
    fallback,
    class: klass,
    fetchpriority,
    prioritize = false,
  }: {
    src?: string;
    alt?: string;
    class?: ClassValue;
    loading?: "lazy" | "eager";
    fetchpriority?: "high" | "low";
    width?: number;
    height?: number;
    href?: string;
    fallback?: string;
    prioritize?: boolean;
    target?: HTMLAttributeAnchorTarget;
    image?: Pick<Image, "url" | "thumbhash">;
  } = $props();

  // NOTE: ...rest props are readonly,
  // so we destructure them above and pass them down to Picture
  if (prioritize) {
    loading ??= "eager";
    fetchpriority ??= "high";
  }

  const style = $derived(
    [
      width ? `width: ${width}px` : "", //
      height ? `height: ${height}px` : "",
    ]
      .filter(Boolean)
      .join("; ")
      .trim(),
  );

  const thumbhash_url = $derived(ImageClient.decode_thumbhash(image));

  // const p: BaseImageProps<CloudinaryOperations, CloudinaryOptions> = {
  //   operations: {},
  // };
</script>

{#snippet img()}
  {#if image || src}
    <!-- {style} -->
    <ImageBase
      {alt}
      {width}
      {height}
      {loading}
      {fetchpriority}
      src={image?.url ?? src}
      transformer={transform}
      background={thumbhash_url}
      class={cn("h-full w-full rounded-md", klass)}
      operations={{
        f: "auto",
        q: "auto",
        g: "auto",

        // "auto" seems fancy, but expensive
        // "fill" seems like a cheaper alternative
        c: "auto",
      }}
    />
  {:else}
    <div
      {style}
      class={cn("flex items-center justify-center rounded-md bg-muted", klass)}
    >
      {fallback ?? alt?.at(0) ?? ""}
    </div>
  {/if}
{/snippet}

{#if href}
  <a
    {href}
    {target}
  >
    {@render img()}
  </a>
{:else}
  {@render img()}
{/if}
