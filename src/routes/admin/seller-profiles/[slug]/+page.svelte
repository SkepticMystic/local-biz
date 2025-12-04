<script lang="ts">
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  let { data } = $props();
</script>

<nav class="flex flex-wrap items-center justify-between gap-3">
  <div>
    <Badge variant={data.seller_profile.admin_approved ? "success" : "warning"}>
      {data.seller_profile.admin_approved ? "Approved" : "Not approved"}
    </Badge>
  </div>

  <ButtonGroup>
    <ButtonGroup>
      <!-- <Button
        icon="lucide/edit"
        href={resolve("/s/businesses/[slug]/edit", data.business)}
      >
        Edit
      </Button> -->
    </ButtonGroup>
  </ButtonGroup>
</nav>

<Separator class="my-7" />

<pre>{JSON.stringify(data.seller_profile, null, 2)}</pre>
