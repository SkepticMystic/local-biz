<script lang="ts">
  import { ImageClient } from "$lib/clients/image/image.client.js";
  import Picture from "$lib/components/image/Picture.svelte";
  import BackAnchor from "$lib/components/links/BackAnchor.svelte";
  import DataTable from "$lib/components/ui/data-table/data-table.svelte";
  import { renderComponent } from "$lib/components/ui/data-table/render-helpers.js";
  import { IMAGES } from "$lib/const/image/image.const.js";
  import { Items } from "$lib/utils/items.util.js";
  import { CellHelpers } from "$lib/utils/tanstack/table.util.js";
  import { createColumnHelper } from "@tanstack/table-core";

  let { data } = $props();
  let images = $state(data.images);

  const column = createColumnHelper<(typeof images)[number]>();

  const columns = [
    column.display({
      id: "thumbnail",
      meta: { label: "" },

      cell: ({ row }) =>
        renderComponent(Picture, {
          image: row.original,
          ...IMAGES.SIZES.THUMBNAIL,
        }),
    }),

    column.accessor("resource_kind", {
      meta: { label: "Resource kind" },
    }),

    column.accessor("approved_at", {
      meta: { label: "Approved" },

      cell: CellHelpers.time,
    }),

    column.accessor("createdAt", {
      meta: { label: "Created" },

      cell: CellHelpers.time,
    }),
  ];

  const actions = {
    toggle_approved_at: (id: string) =>
      ImageClient.toggle_approved_at(id, {
        on_success: (data) => (images = Items.patch(images, id, data)),
      }),
  };
</script>

<article>
  <header>
    <h1>Images</h1>

    <BackAnchor backto="Admin" />
  </header>

  <DataTable
    {columns}
    data={images}
    states={{
      selection: {},
      pagination: { pageIndex: 0, pageSize: 10 },
      // NOTE: To save on hosting data, only show images that need to be approved
      column_filters: [{ id: "approved_at", value: null }],
    }}
    actions={(row) => [
      {
        title: row.original.approved_at ? "Deny" : "Approve",
        icon: row.original.approved_at ? "lucide/x" : "lucide/check",

        onselect: () => actions.toggle_approved_at(row.id),
      },
    ]}
    bulk_actions={(rows) => [
      {
        title: "Toggle approval",
        icon: "lucide/check",
        onselect: () =>
          Promise.all(rows.map((row) => actions.toggle_approved_at(row.id))),
      },
    ]}
  >
    <!-- {#snippet header(table)}
      <search class="flex flex-wrap gap-3">
        <Field label="Approved">
          {#snippet input({ props })}
            <NativeSelect
              {...props}
              options={[
                { label: "All", value: undefined },
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              bind:value={
                () => table.getColumn("approved_at")?.getFilterValue(),
                (v) => table.getColumn("approved_at")?.setFilterValue(v)
              }
            />
          {/snippet}
        </Field>
      </search>
    {/snippet} -->
  </DataTable>
</article>
