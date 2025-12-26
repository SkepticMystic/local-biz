<script lang="ts">
  import Anchor from "../ui/anchor/Anchor.svelte";

  let { backto }: { backto: string } = $props();
</script>

<Anchor
  href="."
  class="pt-2"
  icon="lucide/arrow-left"
>
  Back to {backto}
</Anchor>
