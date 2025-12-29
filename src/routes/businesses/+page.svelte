<script lang="ts">
  import BusinessItem from "$lib/components/items/business/BusinessItem.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Field from "$lib/components/ui/field/Field.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import ItemList from "$lib/components/ui/item/ItemList.svelte";
  import NativeSelectOption from "$lib/components/ui/native-select/native-select-option.svelte";
  import NativeSelect from "$lib/components/ui/native-select/native-select.svelte";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import TanstackTable from "$lib/components/ui/tanstack/TanstackTable.svelte";
  import { BUSINESS } from "$lib/const/business/business.const";
  import { get_all_public_businesses_remote } from "$lib/remote/business/business.remote";
  import { createColumnHelper } from "@tanstack/table-core";

  let { data } = $props();

  type TData = Awaited<
    ReturnType<typeof get_all_public_businesses_remote>
  >[number];

  const column = createColumnHelper<TData>();

  const columns = [
    column.accessor("name", {}),
    column.accessor("tags", {}),
    column.accessor("category", {}),
    column.accessor("formatted_address", {}),
  ];
</script>

<article>
  <header>
    <div class="flex flex-col gap-2">
      <h1>Businesses</h1>

      <p>See what Hermanus and the Overstrand has to offer</p>
    </div>
  </header>

  <svelte:boundary>
    {#snippet pending()}
      <Skeleton class="h-72 w-full" />
    {/snippet}

    <TanstackTable
      {columns}
      data={await get_all_public_businesses_remote()}
      states={{
        column_filters: data.search.category
          ? [{ id: "category", value: data.search.category }]
          : undefined,
      }}
    >
      {#snippet children(table)}
        <search class="flex flex-wrap items-end gap-2">
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
                value={table.getColumn("category")?.getFilterValue()}
                options={BUSINESS.CATEGORY.IDS.map((c) => ({
                  value: c,
                  label: BUSINESS.CATEGORY.MAP[c].label,
                }))}
                on_value_select={(value) =>
                  table.getColumn("category")?.setFilterValue(value)}
              >
                <NativeSelectOption value={undefined}>All</NativeSelectOption>
              </NativeSelect>
            {/snippet}
          </Field>

          <Button
            icon="lucide/x"
            variant={table.getRowModel().flatRows.length
              ? "outline"
              : "default"}
            onclick={() => table.resetColumnFilters()}
          ></Button>
        </search>

        {#snippet empty_action()}
          <Button
            icon="lucide/x"
            variant={"outline"}
            onclick={() => table.resetColumnFilters()}
          >
            Reset filters
          </Button>
        {/snippet}

        <ItemList
          items={table.getRowModel().flatRows.map((r) => r.original)}
          empty={{
            icon: "lucide/slash",
            title: "No businesses found",
            description: "No businesses match your search",
            content: empty_action,
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
