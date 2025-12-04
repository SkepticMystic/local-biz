<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Anchor from "../ui/anchor/Anchor.svelte";

  let {
    google_place_id,
    formatted_address,
    ...rest
  }: {
    google_place_id: string;
    formatted_address: string;
  } & Omit<ComponentProps<typeof Anchor>, "href" | "target" | "rel"> = $props();
</script>

<Anchor
  target="_blank"
  rel="noopener noreferrer"
  href="https://www.google.com/maps/search/?api=1&query={formatted_address}&query_place_id={google_place_id}"
  {...rest}
>
  <!-- href="https://www.google.com/maps/place/?q=place_id:{google_place_id}" -->
  {formatted_address}
</Anchor>
