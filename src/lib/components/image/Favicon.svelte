<script lang="ts">
  import { IMAGES } from "$lib/const/image/image.const";
  import type { Branded } from "$lib/interfaces/zod/zod.types";
  import { cn } from "$lib/utils/shadcn.util";
  import { Url } from "$lib/utils/urls";

  let {
    href,
    alt = "",
    class: klass = "",
    size = IMAGES.SIZES.ICON.height,
  }: {
    alt?: string;
    size?: number;
    class?: string;
    href: Branded<"Url">;
  } = $props();

  const url = Url.safe(href);

  const src = Url.build("https://www.google.com", "/s2/favicons", {
    sz: size * 2,
    domain: url?.hostname,
  }).toString();
</script>

<img
  {alt}
  {src}
  class={cn("rounded-md", klass)}
  style="width: {size}px; height={size}px;"
/>
