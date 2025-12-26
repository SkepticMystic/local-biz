<script lang="ts">
  import ExtractSnippet from "$lib/components/util/ExtractSnippet.svelte";
  import type { MaybeSnippet } from "$lib/interfaces/svelte/svelte.types";
  import { cn, type WithElementRef } from "$lib/utils/shadcn.util";
  import type { HTMLAnchorAttributes } from "svelte/elements";
  import Icon from "../icon/Icon.svelte";

  let {
    href,
    icon,
    content,
    disabled,
    children,
    class: klass,
    ref = $bindable(null),
    ...rest_props
  }: WithElementRef<HTMLAnchorAttributes> & {
    icon?: string | null;
    disabled?: boolean | null;
    content?: MaybeSnippet;
  } = $props();
</script>

<a
  aria-disabled={disabled}
  href={disabled ? undefined : href}
  role={disabled ? "link" : undefined}
  tabindex={disabled ? -1 : undefined}
  class={cn(
    // NOTE: Copied from buttonVariants.variant === 'link'
    // But we don't take the rest cause then it forces the `size` classes on us
    "inline-block underline underline-offset-4",
    // Mine
    "font-medium",
    klass,
  )}
  bind:this={ref}
  {...rest_props}
>
  <span class="flex items-center gap-1.5">
    <Icon
      {icon}
      class="shrink-0"
    />

    {#if children}
      {@render children()}
    {:else if content}
      <ExtractSnippet snippet={content} />
    {/if}
  </span>
</a>
