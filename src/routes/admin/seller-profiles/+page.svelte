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
  import NativeSelect from "$lib/components/ui/native-select/native-select.svelte";
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

    column.accessor("admin_approved", {
      meta: { label: "Approved" },

      cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
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
        title: row.original.admin_approved ? "Deny" : "Approve",
        icon: row.original.admin_approved ? "lucide/x" : "lucide/check",
        onselect: () =>
          SellerProfileClient.set_admin_approved({
            id: row.id,
            admin_approved: !row.original.admin_approved,
          }).then((r) => {
            if (r.ok) {
              seller_profiles = Items.patch(seller_profiles, row.id, {
                admin_approved: !row.original.admin_approved,
              });
            }
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

        <Field
          label="Approved"
          class="w-fit"
        >
          {#snippet input({ props })}
            <NativeSelect
              {...props}
              options={[
                { value: undefined, label: "All" },
                { value: true, label: "Yes" },
                { value: false, label: "No" },
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
