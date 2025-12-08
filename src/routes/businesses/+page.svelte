<script lang="ts">
  import BusinessItem from "$lib/components/items/business/BusinessItem.svelte";
  import ItemList from "$lib/components/ui/item/ItemList.svelte";
  import { get_all_public_businesses_remote } from "$lib/remote/business/business.remote";

  const businesses = get_all_public_businesses_remote();
</script>

<article>
  <header>
    <div class="flex flex-col gap-2">
      <h1>Businesses</h1>

      <p>See what the local community has to offer</p>
    </div>
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
      <BusinessItem {business} />
    {/snippet}
  </ItemList>
</article>
