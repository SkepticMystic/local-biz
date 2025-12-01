<script lang="ts">
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { upload_image_remote } from "$lib/remote/image/image.remote";
  import type { Image } from "$lib/server/db/models/image.model";
  import { toast } from "svelte-sonner";

  let {
    resource_id,
    resource_kind,
    on_upload,
  }: Pick<Image, "resource_id" | "resource_kind"> & {
    on_upload?: (image: Image) => void;
  } = $props();

  const form = upload_image_remote;
</script>

<form
  enctype="multipart/form-data"
  {...form.enhance(async (e) => {
    await e.submit();

    const res = form.result;
    console.log("form.result", res);
    if (!res || !res.ok) {
      toast.error(res?.error?.message || "Upload failed");
    } else if (res.ok) {
      toast.success("Image uploaded");

      on_upload?.(res.data);
    }
  })}
>
  <input {...form.fields.resource_id.as("hidden", resource_id)} />
  <input {...form.fields.resource_kind.as("hidden", resource_kind)} />

  <ButtonGroup>
    <Input
      {...form.fields.file.as("file")}
      required
      accept="image/*"
      class="max-w-[220px]"
    />

    <!-- NOTE: On my phone, atleast, this forces the camera, no option for file upload -->
    <!-- capture="environment" -->

    <Button
      type="submit"
      icon="lucide/upload"
      loading={form.pending > 0}
    ></Button>
  </ButtonGroup>
</form>
