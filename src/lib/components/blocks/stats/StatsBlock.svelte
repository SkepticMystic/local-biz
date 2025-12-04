<script lang="ts">
  import { count_users_remote } from "$lib/remote/auth/user.remote";
  import { count_all_public_businesses_remote } from "$lib/remote/business/business.remote";
  import { Format } from "$lib/utils/format.util";

  const users = count_users_remote();
  const businesses = count_all_public_businesses_remote();
</script>

<div class="grid gap-x-4 gap-y-4 md:grid-cols-3">
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
</div>
