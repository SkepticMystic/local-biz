<script lang="ts">
  import { BusinessClient } from "$lib/clients/business/business.client.js";
  import Toggle from "$lib/components/ui/toggle/toggle.svelte";
  import {
    count_business_likes_remote,
    get_my_business_like_by_business_remote,
  } from "$lib/remote/business_like/business_like.remote.js";
  import { Format } from "$lib/utils/format.util.js";

  let { business_id }: { business_id: string } = $props();

  const my_business_like = get_my_business_like_by_business_remote(business_id);
  const business_like_count = count_business_likes_remote(business_id);
</script>

<Toggle
  variant="outline"
  icon="lucide/thumbs-up"
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
