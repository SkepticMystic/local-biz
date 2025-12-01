<script lang="ts">
  import { ImageClient } from "$lib/clients/image/image.client";
  import Button from "$lib/components/ui/button/button.svelte";
  import type { Image } from "$lib/server/db/models/image.model";

  let {
    image,
    on_delete,
  }: {
    image: Pick<Image, "id">;
    on_delete?: () => void;
  } = $props();
</script>

<Button
  title="Delete"
  icon="lucide/trash"
  variant="destructive"
  onclick={async () => {
    const res = await ImageClient.delete(image.id);
    if (res.ok) {
      on_delete?.();
    }
  }}
/>
