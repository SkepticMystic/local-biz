<script lang="ts">
  import type { User } from "$lib/server/db/models/auth.model";
  import type { ComponentProps } from "svelte";
  import Avatar from "./Avatar.svelte";

  let {
    user,
    ...rest
  }: ComponentProps<typeof Avatar> & {
    user: User;
  } = $props();

  const label = user.name || user.email;
</script>

<Avatar
  {...rest}
  title={label}
  src={user.image}
  alt="{label} avatar"
  fallback={label.at(0) || "?"}
/>
