<script lang="ts">
  import { IMAGE_HOSTING } from "$lib/const/image/image_hosting.const";
  import { cn } from "$lib/utils/shadcn.util";
  import { useId } from "bits-ui";
  import { format_bytes } from ".";
  import Icon from "../icon/Icon.svelte";
  import type { FileDropZoneProps, FileRejectedReason } from "./types";

  let {
    accept,
    children,
    onUpload,
    fileCount,
    id = useId(),
    onFileRejected,
    class: className,
    disabled = false,
    maxFileSize = IMAGE_HOSTING.LIMITS.MAX_FILE_SIZE_BYTES,
    maxFiles = IMAGE_HOSTING.LIMITS.MAX_COUNT.PER_RESOURCE,
    ...rest
  }: FileDropZoneProps = $props();

  if (maxFiles !== undefined && fileCount === undefined) {
    console.warn(
      "Make sure to provide FileDropZone with `fileCount` when using the `maxFiles` prompt",
    );
  }

  let uploading = $state(false);

  const drop = async (
    e: DragEvent & {
      currentTarget: EventTarget & HTMLLabelElement;
    },
  ) => {
    if (disabled || !canUploadFiles) return;

    e.preventDefault();

    const droppedFiles = Array.from(e.dataTransfer?.files ?? []);

    await upload(droppedFiles);
  };

  const change = async (
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) => {
    if (disabled) return;

    const selectedFiles = e.currentTarget.files;

    if (!selectedFiles) return;

    await upload(Array.from(selectedFiles));

    // this if a file fails and we upload the same file again we still get feedback
    // (e.target as HTMLInputElement).value = "";
  };

  const shouldAcceptFile = (
    file: File,
    fileNumber: number,
  ): FileRejectedReason | undefined => {
    if (maxFileSize !== undefined && file.size > maxFileSize)
      return "Maximum file size exceeded";

    if (maxFiles !== undefined && fileNumber > maxFiles)
      return "Maximum files uploaded";

    if (!accept) return undefined;

    const acceptedTypes = accept.split(",").map((a) => a.trim().toLowerCase());
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    const isAcceptable = acceptedTypes.some((pattern) => {
      // check extension like .mp4
      if (fileType.startsWith(".")) {
        return fileName.endsWith(pattern);
      }

      // if pattern has wild card like video/*
      if (pattern.endsWith("/*")) {
        const baseType = pattern.slice(0, pattern.indexOf("/*"));
        return fileType.startsWith(baseType + "/");
      }

      // otherwise it must be a specific type like video/mp4
      return fileType === pattern;
    });

    if (!isAcceptable) return "File type not allowed";

    return undefined;
  };

  const upload = async (uploadFiles: File[]) => {
    uploading = true;

    const validFiles: File[] = [];

    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i];
      if (!file) continue;

      const rejectedReason = shouldAcceptFile(file, (fileCount ?? 0) + i + 1);

      if (rejectedReason) {
        onFileRejected?.({ file, reason: rejectedReason });
        continue;
      }

      validFiles.push(file);
    }

    await onUpload(validFiles);

    uploading = false;
  };

  const canUploadFiles = $derived(
    !disabled &&
      !uploading &&
      !(
        maxFiles !== undefined &&
        fileCount !== undefined &&
        fileCount >= maxFiles
      ),
  );
</script>

<label
  for={id}
  ondrop={drop}
  aria-disabled={!canUploadFiles}
  ondragover={(e) => e.preventDefault()}
  class={cn(
    "flex h-48 w-full place-items-center justify-center rounded-lg border-2 border-dashed border-border p-6 transition-all hover:cursor-pointer hover:bg-accent/25 aria-disabled:opacity-50 aria-disabled:hover:cursor-not-allowed",
    className,
  )}
>
  {#if children}
    {@render children()}
  {:else}
    <div class="flex flex-col place-items-center justify-center gap-2">
      <div
        class="flex size-14 place-items-center justify-center rounded-full border border-dashed border-border text-muted-foreground"
      >
        <Icon
          icon="lucide/upload"
          class="size-7"
        />
      </div>

      <div class="flex flex-col gap-0.5 text-center">
        <span class="font-medium text-muted-foreground">
          Drag and drop files here, or click to select files
        </span>
        {#if maxFiles || maxFileSize}
          <span class="text-sm text-muted-foreground/75">
            {#if maxFiles}
              <span>You can upload {maxFiles} files</span>
            {/if}
            {#if maxFiles && maxFileSize}
              <span>(up to {format_bytes(maxFileSize)} each)</span>
            {/if}
            {#if maxFileSize && !maxFiles}
              <span>Maximum size {format_bytes(maxFileSize)}</span>
            {/if}
          </span>
        {/if}
      </div>
    </div>
  {/if}

  <input
    {...rest}
    {id}
    {accept}
    type="file"
    class="hidden"
    onchange={change}
    disabled={!canUploadFiles}
    multiple={maxFiles === undefined || maxFiles - (fileCount ?? 0) > 1}
  />
</label>
