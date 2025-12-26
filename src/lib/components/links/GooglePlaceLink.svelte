<script lang="ts">
  import { Url } from "$lib/utils/urls";
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

  const href = $derived(
    Url.build(
      "https://www.google.com",
      "/maps/search/", // NOTE: Trailing slash is necessary!
      {
        api: "1",
        query: formatted_address,
        query_place_id: google_place_id,
      },
    ).toString(),
  );
</script>

<Anchor
  {href}
  target="_blank"
  rel="noopener noreferrer"
  {...rest}
>
  <!-- href="https://www.google.com/maps/place/?q=place_id:{google_place_id}" -->
  {formatted_address.replace(/, \d+$/, "")}
</Anchor>
