<script lang="ts">
  import BusinessItem from "$lib/components/items/business/BusinessItem.svelte";
  import ItemList from "$lib/components/ui/item/ItemList.svelte";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import TanstackTable from "$lib/components/ui/tanstack/TanstackTable.svelte";
  import { get_all_public_businesses_remote } from "$lib/remote/business/business.remote";
  import { createColumnHelper } from "@tanstack/table-core";

  type TData = Awaited<
    ReturnType<typeof get_all_public_businesses_remote>
  >[number];

  const column = createColumnHelper<TData>();

  const columns = [
    column.accessor("name", {}),
    column.accessor("category", {}),
    column.accessor("tags", {}),
    column.accessor("formatted_address", {}),
  ];
</script>

<article>
  <header>
    <div class="flex flex-col gap-2">
      <h1>Businesses</h1>

      <p>See what the local community has to offer</p>
    </div>
  </header>

  <svelte:boundary>
    {#snippet pending()}
      <Skeleton class="h-72 w-full" />
    {/snippet}

    <TanstackTable
      {columns}
      data={await get_all_public_businesses_remote()}
    >
      {#snippet children(table)}
        <!-- <search class="flex flex-wrap items-end gap-2">
          <Field
            label="Name"
            class="w-fit"
          >
            {#snippet input({ props })}
              <Input
                {...props}
                value={table.getColumn("name")?.getFilterValue()}
                oninput={(e) =>
                  table
                    .getColumn("name")
                    ?.setFilterValue(e.currentTarget.value)}
                placeholder="Search by name"
              />
            {/snippet}
          </Field>

          <Field
            label="Category"
            class="w-fit"
          >
            {#snippet input({ props })}
              <NativeSelect
                {...props}
                options={BUSINESS.CATEGORY.IDS.map((c) => ({
                  value: c,
                  label: BUSINESS.CATEGORY.MAP[c].label,
                }))}
                value={table.getColumn("category")?.getFilterValue()}
                on_value_select={(value) =>
                  table.getColumn("category")?.setFilterValue(value)}
              >
                <NativeSelectOption value={undefined}>All</NativeSelectOption>
              </NativeSelect>
            {/snippet}
          </Field>

          <Button
            icon="lucide/x"
            variant="outline"
            onclick={() => table.resetColumnFilters()}
          ></Button>
        </search> -->

        <ItemList
          items={table.getRowModel().flatRows.map((r) => r.original)}
          empty={{
            icon: "lucide/slash",
            title: "No businesses found",
            description: "No businesses match your search",
          }}
        >
          {#snippet item(business)}
            <BusinessItem {business} />
          {/snippet}
        </ItemList>
      {/snippet}
    </TanstackTable>
  </svelte:boundary>
</article>
