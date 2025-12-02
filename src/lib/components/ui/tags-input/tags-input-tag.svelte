<script lang="ts">
  import Icon from "../icon/Icon.svelte";

  type Props = {
    name: string;
    value: string;
    active: boolean;
    disabled: boolean | null;
    onDelete: (value: string) => void;
  };

  let { name, value, disabled, onDelete, active }: Props = $props();
</script>

<div
  aria-selected={active}
  class="flex place-items-center gap-2 rounded-md bg-secondary px-2 py-0.5 ring-offset-background transition-all hover:cursor-default hover:bg-secondary/90 aria-selected:bg-secondary/90 aria-selected:ring-2 aria-selected:ring-ring aria-selected:ring-offset-2"
>
  <input
    {name}
    {value}
    type="hidden"
  />

  <span>{value}</span>

  <button
    {disabled}
    type="button"
    onclick={() => onDelete(value)}
  >
    <Icon
      icon="lucide/x"
      class="size-4"
    />
  </button>
</div>
