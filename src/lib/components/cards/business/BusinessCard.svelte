<script lang="ts">
  import { resolve } from "$app/paths";
  import BusinessLikeToggle from "$lib/components/buttons/BusinessLikeToggle.svelte";
  import Picture from "$lib/components/image/Picture.svelte";
  import GooglePlaceLink from "$lib/components/links/GooglePlaceLink.svelte";
  import RenderMarkdown from "$lib/components/text/markdown/RenderMarkdown.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import CardContent from "$lib/components/ui/card/card-content.svelte";
  import CardDescription from "$lib/components/ui/card/card-description.svelte";
  import CardFooter from "$lib/components/ui/card/card-footer.svelte";
  import CardHeader from "$lib/components/ui/card/card-header.svelte";
  import CardRoot from "$lib/components/ui/card/card-root.svelte";
  import CardTitle from "$lib/components/ui/card/card-title.svelte";
  import ChipList from "$lib/components/ui/chip/ChipList.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import { BUSINESS } from "$lib/const/business/business.const";
  import type { Business } from "$lib/server/db/models/business.model";
  import type { Image } from "$lib/server/db/models/image.model";

  let {
    business,
  }: {
    business: Pick<
      Business,
      | "id"
      | "logo"
      | "name"
      | "slug"
      | "tags"
      | "category"
      | "description"
      | "google_place_id"
      | "formatted_address"
    > & {
      images: Pick<Image, "url" | "thumbhash">[];
    };
  } = $props();

  const href = $derived(resolve("/businesses/[slug]", business));
</script>

<div class="relative max-w-xs rounded-md border pt-0 shadow-lg">
  <div class="flex h-60 items-center justify-center">
    <Picture
      {href}
      width={320}
      height={240}
      alt={business.name}
      image={business.images[0]}
      fallback={business.name[0]}
    ></Picture>
  </div>

  <CardRoot class="gap-4 border-none">
    <CardHeader>
      <CardTitle>
        <div class="flex items-center gap-3">
          <Picture
            {href}
            width={32}
            height={32}
            src={business.logo}
            alt={business.name}
            fallback={business.name[0]}
          />
          <Anchor {href}>
            {business.name}
          </Anchor>
        </div>
      </CardTitle>

      <CardDescription>
        <div class="flex flex-col gap-y-2">
          <span>
            <Icon
              icon={BUSINESS.CATEGORY.MAP[business.category].icon}
              label={BUSINESS.CATEGORY.MAP[business.category].label}
            />
          </span>

          <!-- NOTE: We don't _need_ the place_id, google will still fallback to address -->
          {#if business.formatted_address}
            <GooglePlaceLink
              icon="lucide/map-pin"
              class="no-underline hover:underline"
              google_place_id={business.google_place_id}
              formatted_address={business.formatted_address}
            />
          {/if}

          <ChipList
            size="sm"
            variant="outline"
            chips={business.tags}
          />
        </div>
      </CardDescription>
    </CardHeader>

    <CardContent>
      <RenderMarkdown
        class="max-h-24 overflow-y-hidden text-sm"
        value={business.description.slice(0, 200)}
      />
    </CardContent>

    <CardFooter class="justify-between gap-3">
      <ButtonGroup>
        <BusinessLikeToggle business_id={business.id} />
      </ButtonGroup>

      <ButtonGroup>
        <Button {href}>
          View
          <Icon icon="lucide/arrow-right" />
        </Button>
      </ButtonGroup>
    </CardFooter>
  </CardRoot>
</div>
