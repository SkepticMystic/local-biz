<script lang="ts">
  import { resolve } from "$app/paths";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import BusinessViewer from "$lib/components/viewers/BusinessViewer.svelte";

  let { data } = $props();
</script>

<nav class="flex flex-wrap items-center justify-between gap-3">
  <div>
    <Badge variant={data.business.admin_approved ? "success" : "warning"}>
      {data.business.admin_approved ? "Approved" : "Not approved"}
    </Badge>
  </div>

  <ButtonGroup>
    <ButtonGroup>
      <Button
        icon="lucide/edit"
        href={resolve("/s/businesses/[slug]/edit", data.business)}
      >
        Edit
      </Button>
    </ButtonGroup>
  </ButtonGroup>
</nav>

<Separator class="my-7" />

<BusinessViewer
  business={data.business}
  streamed={data.streamed}
  prerendered={data.prerendered}
/>
