<script lang="ts">
  import { page } from "$app/state";
  import BusinessLikeToggle from "$lib/components/buttons/BusinessLikeToggle.svelte";
  import ShareButton from "$lib/components/buttons/ShareButton.svelte";
  import Favicon from "$lib/components/image/Favicon.svelte";
  import GoogleMapIFrame from "$lib/components/map/GoogleMapIFrame.svelte";
  import PrerenderedMarkdown from "$lib/components/text/markdown/PrerenderedMarkdown.svelte";
  import RenderMarkdown from "$lib/components/text/markdown/RenderMarkdown.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Avatar from "$lib/components/ui/avatar/Avatar.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
  import ImageZoomTrigger from "$lib/components/ui/image-zoom/image-zoom-trigger.svelte";
  import ImageZoom from "$lib/components/ui/image-zoom/image-zoom.svelte";
  import { APP } from "$lib/const/app.const";
  import { BUSINESS } from "$lib/const/business/business.const";
  import { IMAGES } from "$lib/const/image/image.const.js";
  import { search_public_businesses_remote } from "$lib/remote/business/business.remote";
  import type { Business } from "$lib/server/db/models/business.model";
  import type { Image } from "$lib/server/db/models/image.model";
  import type { SellerProfile } from "$lib/server/db/models/seller_profile.model";
  import { App } from "$lib/utils/app";
  import type { IHTML } from "$lib/utils/html/html.util";
  import { SEOUtil } from "$lib/utils/seo/seo.util";
  import { Url } from "$lib/utils/urls.js";
  import { captureException } from "@sentry/sveltekit";
  import { parsePhoneNumberFromString as parse_phone_number } from "libphonenumber-js/min";
  import UserReportDialog from "../dialogs/user_report/UserReportDialog.svelte";
  import BusinessItem from "../items/business/BusinessItem.svelte";
  import GooglePlaceLink from "../links/GooglePlaceLink.svelte";
  import ChipGroup from "../ui/chip/chip-group.svelte";
  import Chip from "../ui/chip/chip.svelte";
  import ItemList from "../ui/item/ItemList.svelte";
  import Separator from "../ui/separator/separator.svelte";
  import Skeleton from "../ui/skeleton/skeleton.svelte";

  let {
    business,
    streamed,
    prerendered,
  }: {
    business: Pick<
      Business,
      | "id"
      | "logo"
      | "name"
      | "slug"
      | "tags"
      | "urls"
      | "emails"
      | "phones"
      | "category"
      | "google_place_id"
      | "formatted_address"
    > & {
      images: Pick<Image, "url" | "thumbhash">[];
    };

    prerendered: {
      description: IHTML.Prerendered | null;
    };

    streamed: {
      seller_profile: Promise<
        | Pick<SellerProfile, "name" | "slug" | "logo" | "description">
        | undefined
      >;
    };
  } = $props();
</script>

<article>
  <header class="flex flex-wrap items-center justify-between gap-3">
    <span class="flex flex-wrap items-center gap-2">
      <Avatar
        class="size-10"
        src={business.logo}
        alt={business.name}
        fallback={business.name[0]}
      ></Avatar>

      <h1>{business.name}</h1>
    </span>

    <ButtonGroup>
      <ButtonGroup>
        <BusinessLikeToggle business_id={business.id} />
      </ButtonGroup>

      <ButtonGroup>
        <ShareButton
          data={{
            title: business.name,
            // NOTE: Don't use `resolve` here, it adds a base route which breaks things
            url: App.full_url(`/businesses/${business.slug}`).toString(),
            text:
              page.data.seo?.description ||
              `Check out this business on ${APP.NAME}`,
          }}
        />
      </ButtonGroup>

      <ButtonGroup>
        <UserReportDialog
          resource_kind="business"
          resource_id={business.id}
        />
      </ButtonGroup>
    </ButtonGroup>
  </header>

  <section>
    <h2 class="sr-only">Business URLs & Contact Info</h2>

    <address class="flex flex-wrap gap-3">
      {#each business.urls as url (url.data)}
        {@const label = url.label || Url.format(url.data)}

        <Anchor
          target="_blank"
          href={SEOUtil.utmify(url.data, {
            content: label,
            term: business.name,
          })}
        >
          <Favicon href={url.data} />
          {label}
        </Anchor>
      {/each}

      {#each business.emails as email (email.data)}
        <Anchor
          target="_blank"
          icon="lucide/mail"
          href="mailto:{email.data}"
        >
          {email.label || email.data}
        </Anchor>
      {/each}

      {#each business.phones as phone (phone.data)}
        <Anchor
          target="_blank"
          icon="lucide/phone"
          href="tel:{phone.data}"
        >
          {phone.label ||
            parse_phone_number(phone.data)?.formatNational() ||
            phone.data}
        </Anchor>
      {/each}

      {#if business.google_place_id && business.formatted_address}
        <GooglePlaceLink
          icon="lucide/map-pin"
          google_place_id={business.google_place_id}
          formatted_address={business.formatted_address}
        />
      {/if}
    </address>
  </section>

  {#if business.tags.length}
    <section>
      <h2 class="sr-only">Tags</h2>

      <ChipGroup>
        {#each business.tags as tag (tag)}
          <Chip variant="outline">
            #{tag}
          </Chip>
        {/each}
      </ChipGroup>
    </section>
  {/if}

  {#if prerendered.description}
    <section>
      <h2 class="sr-only">Description</h2>

      <blockquote>
        <PrerenderedMarkdown html={prerendered.description} />
      </blockquote>
    </section>
  {/if}

  {#if business.images.length}
    <section>
      <h2 class="sr-only">Images</h2>

      <div class="flex flex-wrap gap-3">
        <ImageZoom>
          {#each business.images as image, i (image.url)}
            <ImageZoomTrigger
              {...IMAGES.SIZES.PREVIEW}
              {image}
              class="max-w-full"
              prioritize={i === 0}
            ></ImageZoomTrigger>
          {/each}
        </ImageZoom>
      </div>
    </section>
  {/if}

  {#if business.google_place_id}
    <section>
      <h2 class="sr-only">Location/Address</h2>

      <GoogleMapIFrame
        google_place_id={business.google_place_id}
        formatted_address={business.formatted_address}
      />
    </section>
  {/if}

  <svelte:boundary onerror={(error) => captureException(error)}>
    {@const seller_profile = await streamed.seller_profile}

    {#snippet pending()}{/snippet}

    {#snippet failed(_error, _reset)}{/snippet}

    {#if seller_profile && seller_profile.name && seller_profile.description}
      <section
        class="mt-10"
        id="seller-profile"
      >
        <Card description="Owner of {business.name}">
          {#snippet title()}
            <div class="flex items-center gap-2">
              <Avatar
                src={seller_profile.logo}
                alt={seller_profile.name}
                fallback={seller_profile.name[0]}
              />

              <h3>
                {seller_profile.name}
              </h3>
            </div>
          {/snippet}

          {#snippet content()}
            <RenderMarkdown value={seller_profile.description} />
          {/snippet}
        </Card>
      </section>
    {/if}
  </svelte:boundary>

  <Separator />

  <section id="related-businesses">
    <div>
      <h2>Related businesses</h2>
      <p class="text-muted-foreground">
        Other businesses in the {BUSINESS.CATEGORY.MAP[
          business.category
        ].label.toLocaleLowerCase()}
        category
      </p>
    </div>

    <svelte:boundary onerror={(error) => captureException(error)}>
      {@const related_businesses = await search_public_businesses_remote({
        where: {
          id: { nin: [business.id] },
          category: { in: [business.category] },
        },
      })}

      {#snippet pending()}
        <Skeleton class="h-40 w-full" />
      {/snippet}

      {#snippet failed(_error, _reset)}{/snippet}

      <ItemList
        items={related_businesses}
        empty={{
          icon: "lucide/slash",
          title: "No related businesses found",
          description: "Check back later",
        }}
      >
        {#snippet item(business)}
          <BusinessItem {business} />
        {/snippet}
      </ItemList>
    </svelte:boundary>
  </section>
</article>
