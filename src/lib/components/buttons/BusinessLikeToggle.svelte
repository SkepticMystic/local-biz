<script lang="ts">
  import { BusinessClient } from "$lib/clients/business/business.client.js";
  import Toggle from "$lib/components/ui/toggle/toggle.svelte";
  import {
    count_business_likes_remote,
    get_my_business_like_by_business_remote,
  } from "$lib/remote/business_like/business_like.remote.js";
  import { Format } from "$lib/utils/format.util.js";
  import type { ClassValue } from "svelte/elements";

  let {
    business_id,
    class: klass,
  }: {
    business_id: string;
    class?: ClassValue;
  } = $props();

  const my_business_like = $derived(
    get_my_business_like_by_business_remote(business_id),
  );
  const business_like_count = $derived(
    count_business_likes_remote(business_id),
  );
</script>

<Toggle
  class={klass}
  variant="outline"
  icon="lucide/heart"
  pressed={Boolean(my_business_like.current)}
  title={my_business_like.current ? "Unlike" : "Like"}
  loading={business_like_count.loading || my_business_like.loading}
  onPressedChange={(pressing) =>
    pressing
      ? BusinessClient.like({ business_id })
      : BusinessClient.unlike({ business_id })}
>
  {Format.number(business_like_count.current ?? 0)}
</Toggle>
