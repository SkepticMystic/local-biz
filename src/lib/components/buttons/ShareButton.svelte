<script lang="ts">
  import { page } from "$app/state";
  import { SHARE } from "$lib/const/share/share.const";
  import { Share } from "$lib/utils/share/share.util";
  import { toast } from "svelte-sonner";
  import Button from "../ui/button/button.svelte";
  import Dialog from "../ui/dialog/dialog.svelte";
  import Icon from "../ui/icon/Icon.svelte";

  let {
    data,
    label,
  }: {
    label?: string;
    data: ShareData;
  } = $props();

  // NOTE: This allows passing `undefined` to leave out the property
  if (!Object.hasOwn(data, "url")) {
    data.url = page.url.href;
  }
</script>

{#if navigator.canShare?.(data)}
  <Button
    {label}
    variant="outline"
    icon="lucide/share"
    onclick={() => Share.native(data)}
  />
{:else}
  <Dialog
    title="Share"
    variant="outline"
    size={label ? "default" : "icon"}
    description="Share {data.title || 'this page'} on"
  >
    {#snippet trigger()}
      <Icon icon="lucide/share" />
      {label}
    {/snippet}

    {#snippet content()}
      <div class="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3">
        <Button
          icon="lucide/copy"
          variant="outline"
          title="Copy link"
          onclick={() =>
            navigator.clipboard
              .writeText(page.url.href)
              .then(() => toast.success("Copied to clipboard"))
              .catch(() => toast.error("Failed to copy to clipboard"))}
        >
          Copy link
        </Button>

        {#each SHARE.SOCIAL.IDS as social_id (social_id)}
          {@const platform = SHARE.SOCIAL.MAP[social_id]}

          <Button
            target="_blank"
            variant="outline"
            icon={platform.icon}
            title="Share on {platform.label}"
            href={Share.build_social_url[social_id](data).toString()}
          >
            {SHARE.SOCIAL.MAP[social_id].label}
          </Button>
        {/each}
      </div>
    {/snippet}
  </Dialog>
{/if}
