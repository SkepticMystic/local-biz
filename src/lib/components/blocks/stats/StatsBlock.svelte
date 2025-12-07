<script lang="ts">
  import { count_users_remote } from "$lib/remote/auth/user.remote";
  import { count_all_public_businesses_remote } from "$lib/remote/business/business.remote";
  import { count_all_business_likes_remote } from "$lib/remote/business_like/business_like.remote";
  import { Format } from "$lib/utils/format.util";

  const users = count_users_remote();
  const businesses = count_all_public_businesses_remote();
  const business_likes = count_all_business_likes_remote();
</script>

<div class="grid gap-x-4 gap-y-4 sm:grid-cols-3">
  <div class="flex flex-col items-center gap-y-2">
    <p class="text-4xl font-medium">
      {Format.number(businesses.current)}+
    </p>

    <p>Businesses</p>
  </div>

  <div class="flex flex-col items-center gap-y-2">
    <p class="text-4xl font-medium">
      {Format.number(users.current)}+
    </p>

    <p>Users</p>
  </div>

  <div class="flex flex-col items-center gap-y-2">
    <p class="text-4xl font-medium">
      {Format.number(business_likes.current)}+
    </p>

    <p>Likes</p>
  </div>
</div>
