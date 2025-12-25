<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import FieldError from "$lib/components/ui/field/field-error.svelte";
  import { format_bytes } from "$lib/components/ui/file-drop-zone";
  import FileDropZone from "$lib/components/ui/file-drop-zone/file-drop-zone.svelte";
  import type { FileDropZoneProps } from "$lib/components/ui/file-drop-zone/types";
  import { upload_images_remote } from "$lib/remote/image/image.remote";
  import type { ResourceKey } from "$lib/schema/resource/resource.schema";
  import { onDestroy } from "svelte";
  import { toast } from "svelte-sonner";
  import { SvelteMap } from "svelte/reactivity";

  let {
    resource_id,
    resource_kind,
    after_upload,
  }: ResourceKey & {
    after_upload?: (results: NonNullable<typeof form.result>) => void;
  } = $props();

  let urls = new SvelteMap<string, string>();
  const revoke_urls = () => {
    urls.forEach((url, name) => {
      urls.delete(name);
      URL.revokeObjectURL(url);
    });
  };

  const form = upload_images_remote;

  const onUpload: FileDropZoneProps["onUpload"] = async (files) => {
    revoke_urls();

    for (const file of files) {
      urls.set(file.name, URL.createObjectURL(file));
    }

    form.fields.files.set(files);
  };

  const onFileRejected: FileDropZoneProps["onFileRejected"] = async ({
    reason,
    file,
  }) => {
    toast.error(`${file.name} failed to upload`, { description: reason });
  };

  onDestroy(() => {
    revoke_urls();
  });
</script>

<form
  {...form.enhance(async (e) => {
    await e.submit();

    const res = form.result;
    console.log("form.fields.allIssues()", form.fields.allIssues());

    if (res) {
      after_upload?.(res);

      if (res.every((r) => r.ok)) {
        form.fields.files.set([]);
      } else {
        for (const r of res) {
          if (r.ok === false) {
            toast.error(r.error.message);
          }
        }
      }
    }
  })}
  enctype="multipart/form-data"
  class="flex w-full flex-col gap-2 p-6"
>
  <input {...form.fields.resource_id.as("hidden", resource_id)} />
  <input {...form.fields.resource_kind.as("hidden", resource_kind)} />

  <FileDropZone
    {onUpload}
    {onFileRejected}
    accept="image/*"
    fileCount={form.fields.files.value()?.length ?? 0}
    {...form.fields.files.as("file multiple")}
  />

  <div class="flex flex-col gap-2">
    {#each form.fields.files.value() as file, i (file.name)}
      {@const url = urls.get(file.name)}

      <div class="flex place-items-center justify-between gap-2">
        <div class="flex place-items-center gap-2">
          <div class="relative size-12 overflow-clip">
            <img
              src={url}
              alt={file.name}
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-clip"
            />
          </div>

          <div class="flex flex-col">
            <span class="text-nowrap">{file.name}</span>
            <span class="font-mono text-sm text-muted-foreground">
              {format_bytes(file.size)}
            </span>
          </div>
        </div>

        <Button
          icon="lucide/x"
          variant="outline"
          disabled={form.pending > 0}
          onclick={() => {
            if (url) {
              urls.delete(file.name);
              URL.revokeObjectURL(url);
            }

            form.fields.files.set([
              ...(form.fields.files.value()?.slice(0, i) ?? []),
              ...(form.fields.files.value()?.slice(i + 1) ?? []),
            ]);
          }}
        />
      </div>
    {/each}
  </div>

  <Button
    type="submit"
    class="w-fit"
    icon="lucide/upload"
    loading={form.pending > 0}
    disabled={!form.fields.files.value()?.length}
  >
    Upload images
  </Button>

  <FieldError errors={form.fields.allIssues()} />
</form>
