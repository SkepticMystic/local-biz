<script lang="ts">
  import { resolve } from "$app/paths";
  import { SellerProfileClient } from "$lib/clients/seller_profile/seller_profile.client.js";
  import BackAnchor from "$lib/components/links/BackAnchor.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Avatar from "$lib/components/ui/avatar/Avatar.svelte";
  import DataTable from "$lib/components/ui/data-table/data-table.svelte";
  import { renderComponent } from "$lib/components/ui/data-table/render-helpers.js";
  import Field from "$lib/components/ui/field/Field.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { Items } from "$lib/utils/items.util.js";
  import { CellHelpers } from "$lib/utils/tanstack/table.util.js";
  import { createColumnHelper } from "@tanstack/table-core";

  let { data } = $props();
  let seller_profiles = $state(data.seller_profiles);

  const column = createColumnHelper<(typeof seller_profiles)[number]>();

  const columns = [
    column.display({
      id: "avatar",
      enableHiding: false,
      enableSorting: false,

      cell: ({ row }) =>
        renderComponent(Avatar, {
          src: row.original.logo,
          fallback: row.original.name[0],
        }),
    }),

    column.accessor("slug", {
      meta: { label: "Name" },

      cell: ({ row }) =>
        renderComponent(Anchor, {
          content: row.original.name,
          href: resolve("/admin/seller-profiles/[slug]", row.original),
        }),
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
</script>

<article>
  <header>
    <h1>Seller Profiles</h1>

    <BackAnchor backto="Admin" />
  </header>

  <DataTable
    {columns}
    data={seller_profiles}
    actions={(row) => [
      {
        title: row.original.approved_at ? "Deny" : "Approve",
        icon: row.original.approved_at ? "lucide/x" : "lucide/check",
        onselect: () =>
          SellerProfileClient.toggle_approved_at(row.id, {
            on_success: (data) =>
              (seller_profiles = Items.patch(seller_profiles, row.id, data)),
          }),
      },
    ]}
  >
    {#snippet header(table)}
      <search class="flex flex-wrap gap-3">
        <Field
          label="Name"
          class="w-fit"
        >
          {#snippet input({ props })}
            <Input
              {...props}
              placeholder="Search by name"
              bind:value={
                () => table.getColumn("name")?.getFilterValue(),
                (v) => table.getColumn("name")?.setFilterValue(v)
              }
            />
          {/snippet}
        </Field>
      </search>
    {/snippet}
  </DataTable>
</article>
