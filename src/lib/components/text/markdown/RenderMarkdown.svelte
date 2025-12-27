<script lang="ts">
  import { HTMLUtil } from "$lib/utils/html/html.util";
  import { Markdown } from "$lib/utils/markdown/markdown.util";
  import type { ClassValue } from "svelte/elements";

  let {
    value,
    class: klass,
  }: {
    value: string;

    class?: ClassValue;
  } = $props();
</script>

<div class={["prose", klass]}>
  {@html HTMLUtil.sanitize(Markdown.to_html(value))}
</div>
