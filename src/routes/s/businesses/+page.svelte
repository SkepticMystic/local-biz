<script lang="ts">
  import { resolve } from "$app/paths";
  import { BusinessClient } from "$lib/clients/business/business.client";
  import Picture from "$lib/components/image/Picture.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Item from "$lib/components/ui/item/Item.svelte";
  import ItemList from "$lib/components/ui/item/ItemList.svelte";
  import { get_all_my_businesses_remote } from "$lib/remote/business/business.remote";

  const businesses = get_all_my_businesses_remote();
</script>

<article>
  <header>
    <h1>My Businesses</h1>
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
      {@const href = resolve("/s/businesses/[slug]", business)}

      <Item title={business.name}>
        {#snippet media()}
          <Picture
            {href}
            width={40}
            height={40}
            src={business.logo}
            alt={business.name}
            fallback={business.name[0]}
          />
        {/snippet}

        {#snippet description()}
          <Icon icon="lucide/map-pin" />
          {business.formatted_address}
        {/snippet}

        {#snippet actions()}
          <ButtonGroup>
            <ButtonGroup>
              <Button
                variant="outline"
                icon="lucide/eye"
                href={resolve("/businesses/[slug]", business)}
              >
                View
              </Button>
            </ButtonGroup>

            <ButtonGroup>
              <Button
                icon="lucide/pencil"
                href={resolve("/s/businesses/[slug]/edit", business)}
              >
                Edit
              </Button>
            </ButtonGroup>

            <ButtonGroup>
              <Button
                icon="lucide/trash"
                variant="destructive"
                onclick={() => BusinessClient.delete(business.id)}
              >
                Delete
              </Button>
            </ButtonGroup>
          </ButtonGroup>
        {/snippet}
      </Item>
    {/snippet}
  </ItemList>
</article>
