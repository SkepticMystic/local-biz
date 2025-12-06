<script lang="ts">
  import { cn } from "$lib/utils/shadcn.util";
  import type { Snippet } from "svelte";
  import { tv, type VariantProps } from "tailwind-variants";
  import Icon from "../icon/Icon.svelte";

  const chipVariants = tv({
    base: "inline-flex items-center justify-center rounded-full text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50",
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-6 px-2.5 text-[10px]",
        default: "h-8 px-3 text-xs",
        lg: "h-9 px-4 text-sm",
      },
      active: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "outline",
        active: true,
        class:
          "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground",
      },
      {
        variant: "ghost",
        active: true,
        class: "bg-accent text-accent-foreground",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      active: false,
    },
  });

  type Variant = VariantProps<typeof chipVariants>["variant"];
  type Size = VariantProps<typeof chipVariants>["size"];

  let {
    class: className,
    variant = "default",
    size = "default",
    active = false,
    disabled = false,
    removable = false,
    onclick,
    onremove,
    href,
    children,
    avatar,
    icon,
    ...rest
  }: {
    class?: string;
    variant?: Variant;
    size?: Size;
    active?: boolean;
    disabled?: boolean;
    removable?: boolean;
    onclick?: (e: MouseEvent) => void;
    onremove?: (e: MouseEvent) => void;
    href?: string;
    children?: Snippet;
    avatar?: Snippet;
    icon?: Snippet;
  } = $props();

  const isInteractive = !!onclick || !!href || active !== undefined;
  const Element = href ? "a" : isInteractive ? "button" : "div";

  function handleClick(e: MouseEvent) {
    if (disabled) return;
    onclick?.(e);
  }

  function handleRemove(e: MouseEvent) {
    e.stopPropagation();
    if (disabled) return;
    onremove?.(e);
  }
</script>

<svelte:element
  this={Element}
  {href}
  {disabled}
  tabindex={isInteractive ? 0 : -1}
  onclick={isInteractive ? handleClick : undefined}
  aria-pressed={isInteractive ? active : undefined}
  class={cn(chipVariants({ variant, size, active }), className)}
  {...rest}
>
  {#if avatar}
    <span
      class={cn("mr-2 -ml-1 flex shrink-0", size === "sm" && "mr-1.5 -ml-1")}
    >
      {@render avatar()}
    </span>
  {:else if icon}
    <span class={cn("mr-2 flex shrink-0", size === "sm" && "mr-1.5")}>
      {@render icon()}
    </span>
  {/if}

  <span>
    {#if children}
      {@render children()}
    {/if}
  </span>

  {#if removable}
    <button
      type="button"
      aria-label="Remove"
      onclick={handleRemove}
      class={cn(
        "-mr-1 ml-2 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/20",
        size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
      )}
    >
      <Icon
        icon="lucide/x"
        class="h-3 w-3"
      />
    </button>
  {/if}
</svelte:element>
