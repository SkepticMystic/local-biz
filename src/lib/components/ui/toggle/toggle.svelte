<script lang="ts">
  import { cn } from "$lib/utils/shadcn.util.js";
  import { Toggle as TogglePrimitive } from "bits-ui";
  import type { ComponentProps } from "svelte";
  import Icon from "../icon/Icon.svelte";
  import Loading from "../loading/Loading.svelte";
  import ToggleRoot from "./toggle-root.svelte";

  let {
    icon,
    loading,
    disabled,
    class: klass,
    ref = $bindable(null),
    pressed = $bindable(false),
    children,
    onPressedChange,
    ...restProps
  }: ComponentProps<typeof ToggleRoot> & {
    loading?: boolean;
    icon?: string | null;
  } = $props();
</script>

<TogglePrimitive.Root
  bind:ref
  bind:pressed
  data-slot="toggle"
  disabled={disabled || loading}
  class={cn(loading && "btn-loading", "cursor-pointer", klass)}
  onPressedChange={async (e) => {
    disabled = true;
    await onPressedChange?.(e);
    disabled = false;
  }}
  {...restProps}
>
  <Loading {loading} />
  <Icon {icon} />

  {@render children?.({ pressed })}
</TogglePrimitive.Root>
