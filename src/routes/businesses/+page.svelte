<script lang="ts">
  import { resolve } from "$app/paths";
  import Button from "$lib/components/ui/button/button.svelte";
  import Item from "$lib/components/ui/item/Item.svelte";
  import ItemList from "$lib/components/ui/item/ItemList.svelte";
  import { get_all_public_businesses_remote } from "$lib/remote/business/business.remote";

  const businesses = get_all_public_businesses_remote();
</script>

<article>
  <header>
    <h1>Businesses</h1>
  </header>

  <ItemList
    items={await businesses}
    empty={{
      icon: "lucide/slash",
      title: "No businesses found",
      description: "No businesses match your search",
      loading: businesses.loading,
    }}
  >
    {#snippet item(business)}
      <Item
        title={business.name}
        description={business.formatted_address}
      >
        {#snippet actions()}
          <Button href={resolve("/businesses/[slug]", business)}>View</Button>
        {/snippet}
      </Item>
    {/snippet}
  </ItemList>
</article>
