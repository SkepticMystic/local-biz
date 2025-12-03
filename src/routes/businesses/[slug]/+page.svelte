<script lang="ts">
  import BusinessViewer from "$lib/components/viewers/BusinessViewer.svelte";

  let { data } = $props();
</script>

<BusinessViewer
  business={data.business}
  streamed={data.streamed}
  prerendered={data.prerendered}
/>
