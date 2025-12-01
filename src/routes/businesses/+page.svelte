<script lang="ts">
  import { resolve } from "$app/paths";
  import BusinessLikeToggle from "$lib/components/buttons/BusinessLikeToggle.svelte";
  import Picture from "$lib/components/image/Picture.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
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
      {@const href = resolve("/businesses/[slug]", business)}

      <Item>
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

        {#snippet title()}
          <Anchor {href}>
            {business.name}
          </Anchor>
        {/snippet}

        {#snippet description()}
          <Icon icon="lucide/map-pin" />
          {business.formatted_address}
        {/snippet}

        {#snippet actions()}
          <ButtonGroup>
            <ButtonGroup>
              <BusinessLikeToggle business_id={business.id} />
            </ButtonGroup>

            <ButtonGroup>
              <Button {href}>View</Button>
            </ButtonGroup>
          </ButtonGroup>
        {/snippet}
      </Item>
    {/snippet}
  </ItemList>
</article>
