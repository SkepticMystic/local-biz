<script lang="ts">
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import { count_users_remote } from "$lib/remote/auth/user.remote";
  import { count_all_public_businesses_remote } from "$lib/remote/business/business.remote";
  import { count_all_business_likes_remote } from "$lib/remote/business_like/business_like.remote";
  import NumberFlow from "@number-flow/svelte";

  const users = count_users_remote();
  const businesses = count_all_public_businesses_remote();
  const business_likes = count_all_business_likes_remote();
</script>

<div class="grid gap-4 sm:grid-cols-3">
  <div
    class="group flex flex-col items-center gap-y-3 rounded-lg border bg-card p-6 transition-all hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20"
  >
    <div
      class="rounded-full bg-purple-500/10 p-3 transition-colors group-hover:bg-purple-500/20"
    >
      <Icon
        icon="lucide/store"
        class="h-6 w-6 text-purple-500 transition-transform group-hover:scale-110"
      />
    </div>

    <p class="text-5xl font-bold tabular-nums">
      {#if businesses.current === undefined}
        <Skeleton class="h-12 w-16" />
      {:else}
        <NumberFlow
          trend={1}
          value={businesses.current}
        />
      {/if}
    </p>

    <p class="text-sm font-medium text-muted-foreground">Local Businesses</p>
  </div>

  <div
    class="group flex flex-col items-center gap-y-3 rounded-lg border bg-card p-6 transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
  >
    <div
      class="rounded-full bg-blue-500/10 p-3 transition-colors group-hover:bg-blue-500/20"
    >
      <Icon
        icon="lucide/users"
        class="h-6 w-6 text-blue-500 transition-transform group-hover:scale-110"
      />
    </div>

    <p class="text-5xl font-bold tabular-nums">
      {#if users.current === undefined}
        <Skeleton class="h-12 w-16" />
      {:else}
        <NumberFlow
          trend={1}
          value={users.current}
        />
      {/if}
    </p>

    <p class="text-sm font-medium text-muted-foreground">Community Members</p>
  </div>

  <div
    class="group flex flex-col items-center gap-y-3 rounded-lg border bg-card p-6 transition-all hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20"
  >
    <div
      class="rounded-full bg-red-500/10 p-3 transition-colors group-hover:bg-red-500/20"
    >
      <Icon
        icon="lucide/heart"
        class="h-6 w-6 text-red-500 transition-transform group-hover:scale-110"
      />
    </div>

    <p class="text-5xl font-bold tabular-nums">
      {#if business_likes.current === undefined}
        <Skeleton class="h-12 w-16" />
      {:else}
        <NumberFlow
          trend={1}
          value={business_likes.current}
        />
      {/if}
    </p>

    <p class="text-sm font-medium text-muted-foreground">Favorites Saved</p>
  </div>
</div>
