<script lang="ts">
  import { HTMLUtil } from "$lib/utils/html/html.util";
  import { Markdown } from "$lib/utils/markdown/markdown.util";

  let { value }: { value: string } = $props();
</script>

<div class="prose">
  {@html HTMLUtil.sanitize(Markdown.to_html(value))}
</div>
