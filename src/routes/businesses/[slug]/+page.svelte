<script lang="ts">
  import BusinessViewer from "$lib/components/viewers/BusinessViewer.svelte";

  let { data } = $props();
</script>

<BusinessViewer {...data} />
