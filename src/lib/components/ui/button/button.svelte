<script lang="ts">
  import type { ResolvedPathname } from "$app/types";
  import Icon from "../icon/Icon.svelte";
  import Loading from "../loading/Loading.svelte";
  import ButtonRoot, { type ButtonProps } from "./button-root.svelte";

  let {
    size = "default",
    ref = $bindable(null),
    loading,
    icon,
    label,
    onclick,
    children,
    ...restProps
  }: ButtonProps & {
    label?: string;
    loading?: boolean;
    icon?: string | null;
  } & (
      | {
          target?: never;
          href?: ResolvedPathname | ".";
        }
      | {
          href: string;
          target: "_blank";
        }
    ) = $props();

  if (size === "default" && icon && !children && !label) {
    size = "icon";
  }
</script>

<ButtonRoot
  {size}
  disabled={restProps.disabled || loading}
  onclick={async (e) => {
    loading = true;
    await onclick?.(e);
    loading = false;
  }}
  bind:ref
  {...restProps}
>
  <Loading {loading}>
    <Icon {icon} />
  </Loading>

  {#if children}
    {@render children()}
  {:else if label}
    {label}
  {/if}
</ButtonRoot>
