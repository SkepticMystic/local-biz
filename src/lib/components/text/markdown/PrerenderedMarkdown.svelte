<script lang="ts">
  import { HTMLUtil, type IHTML } from "$lib/utils/html/html.util";

  let { html }: { html: IHTML.Prerendered } = $props();
</script>

<div class="prose">
  {@html HTMLUtil.sanitize(html)}
</div>
