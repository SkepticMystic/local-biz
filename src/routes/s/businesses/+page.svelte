<script lang="ts">
  import { resolve } from "$app/paths";
  import { BusinessClient } from "$lib/clients/business/business.client";
  import Picture from "$lib/components/image/Picture.svelte";
  import GooglePlaceLink from "$lib/components/links/GooglePlaceLink.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import ChipList from "$lib/components/ui/chip/ChipList.svelte";
  import DropdownMenu from "$lib/components/ui/dropdown-menu/DropdownMenu.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Item from "$lib/components/ui/item/Item.svelte";
  import ItemList from "$lib/components/ui/item/ItemList.svelte";
  import { BUSINESS } from "$lib/const/business/business.const";
  import { get_all_my_businesses_remote } from "$lib/remote/business/business.remote";

  const businesses = get_all_my_businesses_remote();
</script>

<article>
  <header>
    <div class="flex flex-col gap-2">
      <h1>My Businesses</h1>

      <p>Manage your businesses</p>
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
      {@const href = resolve("/s/businesses/[slug]", business)}

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
          <Anchor
            {href}
            class="text-lg font-semibold"
          >
            {business.name}
          </Anchor>
        {/snippet}

        {#snippet description()}
          <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
            <!-- NOTE: We don't _need_ the place_id, google will still fallback to address -->
            {#if business.formatted_address}
              <span>
                <Icon icon="lucide/map-pin" />
                <GooglePlaceLink
                  class="no-underline hover:underline"
                  google_place_id={business.google_place_id}
                  formatted_address={business.formatted_address}
                />
              </span>
            {/if}

            <span>
              <Icon
                icon={BUSINESS.CATEGORY.MAP[business.category].icon}
                label={BUSINESS.CATEGORY.MAP[business.category].label}
              />
            </span>

            <ChipList
              chips={business.tags}
              variant="outline"
            />
          </div>
        {/snippet}

        {#snippet actions()}
          <DropdownMenu
            variant="outline"
            label="Actions"
            items={[
              {
                title: "View",
                icon: "lucide/eye",
                href: resolve("/s/businesses/[slug]", business),
              },
              {
                title: "Edit",
                icon: "lucide/pencil",
                href: resolve("/s/businesses/[slug]/edit", business),
              },
              {
                title: "Delete",
                icon: "lucide/trash",
                variant: "destructive",
                onselect: () => BusinessClient.delete(business.id),
              },
            ]}
          />
        {/snippet}
      </Item>
    {/snippet}
  </ItemList>
</article>
