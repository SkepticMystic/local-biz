<script lang="ts">
  import UserReportForm from "$lib/components/form/user_report/UserReportForm.svelte";
  import Dialog from "$lib/components/ui/dialog/dialog.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import type { ResourceKind } from "$lib/const/resource/resource.const";

  let {
    resource_id,
    resource_kind,
  }: {
    resource_id: string;
    resource_kind: ResourceKind;
  } = $props();
</script>

<Dialog
  variant="outline"
  title="Submit a report"
>
  {#snippet trigger()}
    <Icon icon="lucide/flag" />
    Report
  {/snippet}

  {#snippet content()}
    <UserReportForm
      {resource_id}
      {resource_kind}
    />
  {/snippet}
</Dialog>
