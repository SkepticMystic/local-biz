<script lang="ts">
  import { PUBLIC_GOOGLE_MAPS_API_KEY } from "$env/static/public";
  import { cn } from "$lib/utils/shadcn.util";
  import { Url } from "$lib/utils/urls";
  import { mode } from "mode-watcher";
  import type { HTMLIframeAttributes } from "svelte/elements";

  let {
    google_place_id,
    formatted_address,
    ...rest_props
  }: HTMLIframeAttributes & {
    google_place_id: string;
    formatted_address?: string;
  } = $props();

  let src = $derived(
    Url.build("https://www.google.com", "/maps/embed/v1/place", {
      zoom: 14,
      key: PUBLIC_GOOGLE_MAPS_API_KEY,
      q: `place_id:${google_place_id}`,
    }).toString(),
  );
</script>

<!-- 
  Janky dark mode workaround for Google Maps
  SOURCE: https://stackoverflow.com/questions/42457368/google-maps-night-mode-embed-iframe -->
<iframe
  {src}
  height="350"
  allowfullscreen
  title={formatted_address}
  referrerpolicy="no-referrer-when-downgrade"
  class={cn("w-full border-0", rest_props.class)}
  style={mode.current === "dark"
    ? "filter: invert(90%) hue-rotate(180deg);"
    : ""}
  {...rest_props}
>
</iframe>
