<script lang="ts">
  import { PUBLIC_GOOGLE_MAPS_API_KEY } from "$env/static/public";
  import { cn } from "$lib/utils/shadcn.util";
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
</script>

<!-- 
  Janky dark mode workaround for Google Maps
  SOURCE: https://stackoverflow.com/questions/42457368/google-maps-night-mode-embed-iframe -->
<iframe
  height="350"
  loading="lazy"
  allowfullscreen
  title={formatted_address}
  referrerpolicy="no-referrer-when-downgrade"
  class={cn("w-full border-0", rest_props.class)}
  src="https://www.google.com/maps/embed/v1/place?key={PUBLIC_GOOGLE_MAPS_API_KEY}
    &q=place_id:{encodeURIComponent(google_place_id)}&zoom=14"
  style={mode.current === "dark"
    ? "filter: invert(90%) hue-rotate(180deg);"
    : ""}
  {...rest_props}
>
</iframe>
