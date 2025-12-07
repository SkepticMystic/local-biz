<script lang="ts">
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import { count_users_remote } from "$lib/remote/auth/user.remote";
  import { count_all_public_businesses_remote } from "$lib/remote/business/business.remote";
  import { count_all_business_likes_remote } from "$lib/remote/business_like/business_like.remote";
  import NumberFlow from "@number-flow/svelte";

  const users = count_users_remote();
  const businesses = count_all_public_businesses_remote();
  const business_likes = count_all_business_likes_remote();
</script>

<div class="grid gap-x-4 gap-y-4 sm:grid-cols-3">
  <div class="flex flex-col items-center gap-y-2">
    <p class="text-4xl font-medium">
      {#if businesses.current === undefined}
        <Skeleton class="h-9 w-12" />
      {:else}
        <NumberFlow
          trend={1}
          value={businesses.current}
        />
      {/if}
    </p>

    <p>Businesses</p>
  </div>

  <div class="flex flex-col items-center gap-y-2">
    <p class="text-4xl font-medium">
      {#if users.current === undefined}
        <Skeleton class="h-9 w-12" />
      {:else}
        <NumberFlow
          trend={1}
          value={users.current}
        />
      {/if}
    </p>

    <p>Users</p>
  </div>

  <div class="flex flex-col items-center gap-y-2">
    <p class="text-4xl font-medium">
      {#if business_likes.current === undefined}
        <Skeleton class="h-9 w-12" />
      {:else}
        <NumberFlow
          trend={1}
          value={business_likes.current}
        />
      {/if}
    </p>

    <p>Likes</p>
  </div>
</div>
