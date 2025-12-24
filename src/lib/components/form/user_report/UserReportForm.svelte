<script lang="ts">
  import Captcha from "$lib/components/auth/Captcha.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Field from "$lib/components/ui/field/Field.svelte";
  import NativeSelect from "$lib/components/ui/native-select/native-select.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import type { ResourceKind } from "$lib/const/resource/resource.const";
  import { USER_REPORT } from "$lib/const/user_report/user_report.const";
  import { create_user_report_remote } from "$lib/remote/user_report/user_report.remote";
  import { toast } from "svelte-sonner";

  let {
    resource_id,
    resource_kind,
  }: {
    resource_id: string;
    resource_kind: ResourceKind;
  } = $props();

  const form = create_user_report_remote;
</script>

<form
  class="space-y-3"
  {...form.enhance(async (e) => {
    await e.submit();

    const res = form.result;
    if (res?.ok) {
      toast.success("Report submitted");

      e.form.reset();
    } else if (res?.error) {
      toast.error(res.error.message);
    }
  })}
>
  <input {...form.fields.resource_id.as("hidden", resource_id)} />
  <input {...form.fields.resource_kind.as("hidden", resource_kind)} />

  <Field
    label="Reason"
    field={form.fields.reason}
  >
    {#snippet input({ props, field })}
      <NativeSelect
        {...props}
        {...field?.as("select")}
        required
        placeholder="Select a reason for your report"
        options={USER_REPORT.REASON.IDS.map((value) => ({
          value,
          label: USER_REPORT.REASON.MAP[value].label,
        }))}
      />
    {/snippet}
  </Field>

  <Field
    label="Details"
    field={form.fields.details}
  >
    {#snippet input({ props, field })}
      <Textarea
        {...props}
        {...field?.as("text")}
        required
      ></Textarea>
    {/snippet}
  </Field>

  <Field
    label=""
    field={form.fields.captcha_token}
  >
    {#snippet input({ props, field })}
      <Captcha
        {...props}
        {...field?.as("text")}
      />
    {/snippet}
  </Field>

  <Button
    type="submit"
    icon="lucide/send"
    class="w-full"
    loading={form.pending > 0}
  >
    Submit
  </Button>
</form>
