<script lang="ts">
  import { resolve } from "$app/paths";
  import BusinessLikeToggle from "$lib/components/buttons/BusinessLikeToggle.svelte";
  import Picture from "$lib/components/image/Picture.svelte";
  import GooglePlaceLink from "$lib/components/links/GooglePlaceLink.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import ChipGroup from "$lib/components/ui/chip/chip-group.svelte";
  import Chip from "$lib/components/ui/chip/chip.svelte";
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

      <ChipGroup>
        {#each business.tags as tag (tag)}
          <Chip variant="outline">
            #{tag}
          </Chip>
        {/each}
      </ChipGroup>
    </div>
  {/snippet}

  {#snippet actions()}
    <ButtonGroup orientation="vertical">
      <ButtonGroup>
        <BusinessLikeToggle business_id={business.id} />
      </ButtonGroup>

      <ButtonGroup>
        <Button {href}>View</Button>
      </ButtonGroup>
    </ButtonGroup>
  {/snippet}
</Item>
