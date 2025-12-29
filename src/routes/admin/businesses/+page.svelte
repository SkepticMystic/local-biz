<script lang="ts">
  import { resolve } from "$app/paths";
  import { BusinessClient } from "$lib/clients/business/business.client.js";
  import BackAnchor from "$lib/components/links/BackAnchor.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import DataTable from "$lib/components/ui/data-table/data-table.svelte";
  import { renderComponent } from "$lib/components/ui/data-table/render-helpers.js";
  import Field from "$lib/components/ui/field/Field.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { Dates } from "$lib/utils/dates.js";
  import { Format } from "$lib/utils/format.util.js";
  import { Items } from "$lib/utils/items.util.js";
  import { CellHelpers } from "$lib/utils/tanstack/table.util.js";
  import { createColumnHelper } from "@tanstack/table-core";

  let { data } = $props();
  let businesses = $state(data.businesses);

  const column = createColumnHelper<(typeof businesses)[number]>();

  const columns = [
    column.accessor("name", {
      meta: { label: "Name" },

      cell: ({ row, getValue }) =>
        renderComponent(Anchor, {
          content: getValue(),
          href: resolve("/admin/businesses/[slug]", row.original),
        }),

      footer: ({ table }) =>
        Format.number(table.getRowModel().flatRows.length) + " businesses",
    }),

    column.accessor("user.email", {
      meta: { label: "Owner" },
    }),

    column.accessor("approved_at", {
      meta: { label: "Approved" },

      cell: (c) => {
        const value = c.getValue();

        return CellHelpers.time(c, {
          class:
            // NOTE: When we re-approve, the db updates updatedAt as well,
            // so we have to add a little lee-way
            value && c.row.original.updatedAt > Dates.add_ms(1_000, value)
              ? "text-destructive"
              : "",
        });
      },
    }),

    column.accessor("createdAt", {
      meta: { label: "Created" },

      cell: CellHelpers.time,
    }),
  ];

  const actions = {
    refresh_approval: (id: string) =>
      BusinessClient.refresh_approved_at(id, {
        on_success: (data) => (businesses = Items.patch(businesses, id, data)),
      }),
    toggle_approval: (id: string) =>
      BusinessClient.toggle_approved_at(id, {
        on_success: (data) => (businesses = Items.patch(businesses, id, data)),
      }),

    admin_delete: (business_id: string) =>
      BusinessClient.admin_delete(business_id, {
        on_success: () => (businesses = Items.remove(businesses, business_id)),
      }),
  };
</script>

<article>
  <header>
    <h1>Businesses</h1>

    <BackAnchor backto="Admin" />
  </header>

  <DataTable
    {columns}
    data={businesses}
    states={{
      selection: {},
    }}
    actions={(row) => [
      {
        icon: "lucide/pencil",
        title: "Edit",

        href: resolve("/admin/businesses/[slug]/edit", row.original),
      },
      {
        icon: row.original.approved_at ? "lucide/x" : "lucide/check",
        title: row.original.approved_at ? "Deny" : "Approve",
        onselect: () => actions.toggle_approval(row.id),
      },
      {
        hide: !row.original.approved_at,
        icon: "lucide/reload",
        title: "Refresh approval",
        onselect: () => actions.refresh_approval(row.id),
      },
      {
        icon: "lucide/chevron-right",
        title: "Transfer ownership",

        onselect: async () => {
          const target_user_email = prompt(
            "Enter the email address of the user you want to transfer ownership to",
          );
          if (!target_user_email) return;

          const res = await BusinessClient.admin_transfer_ownership({
            target_user_email,
            business_id: row.id,
          });

          if (res.ok) {
            businesses = Items.patch(businesses, row.id, {
              user: { email: res.data.target_user.email },
            });
          }
        },
      },
      {
        icon: "lucide/trash",
        title: "Delete",
        variant: "destructive",
        onselect: () => actions.admin_delete(row.id),
      },
    ]}
    bulk_actions={(rows) => [
      {
        title: "Toggle approval",
        icon: "lucide/check",
        onselect: () =>
          Promise.all(rows.map((row) => actions.toggle_approval(row.id))),
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
