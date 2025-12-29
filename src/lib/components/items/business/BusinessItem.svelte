<script lang="ts">
  import { resolve } from "$app/paths";
  import BusinessLikeToggle from "$lib/components/buttons/BusinessLikeToggle.svelte";
  import Picture from "$lib/components/image/Picture.svelte";
  import GooglePlaceLink from "$lib/components/links/GooglePlaceLink.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import ChipList from "$lib/components/ui/chip/ChipList.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import ItemRoot from "$lib/components/ui/item/item-root.svelte";
  import Item from "$lib/components/ui/item/Item.svelte";
  import { BUSINESS } from "$lib/const/business/business.const";
  import type { Business } from "$lib/server/db/models/business.model";
  import type { ComponentProps } from "svelte";

  let {
    business,
    ...rest
  }: Omit<ComponentProps<typeof ItemRoot>, "title"> & {
    business: Pick<
      Business,
      | "id"
      | "logo"
      | "name"
      | "slug"
      | "tags"
      | "category"
      | "google_place_id"
      | "formatted_address"
    >;
  } = $props();

  const href = $derived(resolve("/businesses/[slug]", business));
</script>

<Item {...rest}>
  {#snippet title()}
    <div class="flex items-center gap-2">
      <Picture
        {href}
        width={48}
        height={48}
        src={business.logo}
        alt={business.name}
        fallback={business.name[0]}
      />

      <Anchor
        {href}
        class="text-lg font-semibold"
      >
        {business.name}
      </Anchor>
    </div>
  {/snippet}

  {#snippet description()}
    <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
      <!-- NOTE: We don't _need_ the place_id, google will still fallback to address -->
      {#if business.formatted_address}
        <GooglePlaceLink
          icon="lucide/map-pin"
          class="no-underline hover:underline"
          google_place_id={business.google_place_id}
          formatted_address={business.formatted_address}
        />
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
    <ButtonGroup orientation="vertical">
      <ButtonGroup>
        <BusinessLikeToggle business_id={business.id} />
      </ButtonGroup>

      <ButtonGroup>
        <Button {href}>
          View
          <Icon icon="lucide/arrow-right" />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  {/snippet}
</Item>
