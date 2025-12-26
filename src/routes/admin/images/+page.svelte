<script lang="ts">
  import { ImageClient } from "$lib/clients/image/image.client.js";
  import Picture from "$lib/components/image/Picture.svelte";
  import BackAnchor from "$lib/components/links/BackAnchor.svelte";
  import DataTable from "$lib/components/ui/data-table/data-table.svelte";
  import { renderComponent } from "$lib/components/ui/data-table/render-helpers.js";
  import Field from "$lib/components/ui/field/Field.svelte";
  import NativeSelect from "$lib/components/ui/native-select/native-select.svelte";
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

    column.accessor("admin_approved", {
      meta: { label: "Approved" },

      cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
    }),

    column.accessor("createdAt", {
      meta: { label: "Created" },

      cell: CellHelpers.time,
    }),
  ];

  const actions = {
    set_approval: (
      ...args: Parameters<typeof ImageClient.set_admin_approved>
    ) =>
      ImageClient.set_admin_approved(...args).then((res) => {
        if (res.ok) {
          images = Items.patch(images, args[0].id, {
            admin_approved: args[0].admin_approved,
          });
        }
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
      column_filters: [{ id: "admin_approved", value: false }],
    }}
    actions={(row) => [
      {
        title: row.original.admin_approved ? "Deny" : "Approve",
        icon: row.original.admin_approved ? "lucide/x" : "lucide/check",

        onselect: () =>
          actions.set_approval({
            id: row.id,
            admin_approved: !row.original.admin_approved,
          }),
      },
    ]}
    bulk_actions={(rows) => [
      {
        title: "Approve",
        icon: "lucide/check",
        onselect: () =>
          Promise.all(
            rows.map((row) =>
              actions.set_approval(
                { id: row.id, admin_approved: true },
                { confirm: null },
              ),
            ),
          ),
      },
      {
        title: "Deny",
        icon: "lucide/x",
        onselect: () =>
          Promise.all(
            rows.map((row) =>
              actions.set_approval(
                { id: row.id, admin_approved: false },
                { confirm: null },
              ),
            ),
          ),
      },
    ]}
  >
    {#snippet header(table)}
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
                () => table.getColumn("admin_approved")?.getFilterValue(),
                (v) => table.getColumn("admin_approved")?.setFilterValue(v)
              }
            />
          {/snippet}
        </Field>
      </search>
    {/snippet}
  </DataTable>
</article>
