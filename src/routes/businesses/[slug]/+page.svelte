<script lang="ts">
  import BusinessLikeToggle from "$lib/components/buttons/BusinessLikeToggle.svelte";
  import ShareButton from "$lib/components/buttons/ShareButton.svelte";
  import Favicon from "$lib/components/image/Favicon.svelte";
  import GoogleMapIFrame from "$lib/components/map/GoogleMapIFrame.svelte";
  import PrerenderedMarkdown from "$lib/components/text/markdown/PrerenderedMarkdown.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Avatar from "$lib/components/ui/avatar/avatar.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import ImageZoomTrigger from "$lib/components/ui/image-zoom/image-zoom-trigger.svelte";
  import ImageZoom from "$lib/components/ui/image-zoom/image-zoom.svelte";
  import { IMAGES } from "$lib/const/image/image.const.js";
  import { Url } from "$lib/utils/urls.js";

  let { data } = $props();
  const business = $state(data.business);
</script>

<article>
  <header class="flex items-center justify-between gap-3">
    <div class="flex items-center gap-2">
      <Avatar
        src={business.logo}
        fallback={business.name[0]}
      ></Avatar>

      <h1>{business.name}</h1>
    </div>

    <ButtonGroup>
      <ButtonGroup>
        <BusinessLikeToggle business_id={business.id} />
      </ButtonGroup>

      <ButtonGroup>
        <ShareButton
          data={{
            title: business.name,
            text: data.seo.description,
          }}
        />
      </ButtonGroup>
    </ButtonGroup>
  </header>

  <section>
    <div class="flex flex-wrap gap-3">
      {#each data.business.urls as url (url.data)}
        <Anchor
          target="_blank"
          href={url.data}
        >
          <Favicon href={url.data} />
          {url.label || Url.strip_protocol(url.data)}
        </Anchor>
      {/each}

      {#each data.business.emails as email (email.data)}
        <Anchor
          target="_blank"
          icon="lucide/mail"
          href="mailto:{email.data}"
        >
          {email.label || email.data}
        </Anchor>
      {/each}

      {#each data.business.phones as phone (phone.data)}
        <Anchor
          target="_blank"
          icon="lucide/phone"
          href="tel:{phone.data}"
        >
          {phone.label || phone.data}
        </Anchor>
      {/each}
    </div>
  </section>

  {#if data.prerendered.description}
    <section>
      <PrerenderedMarkdown html={data.prerendered.description} />
    </section>
  {/if}

  {#if business.images.length}
    <section>
      <div class="flex flex-wrap gap-3">
        <ImageZoom>
          {#each business.images as image (image.url)}
            <ImageZoomTrigger
              {image}
              {...IMAGES.SIZES.THUMBNAIL}
            ></ImageZoomTrigger>
          {/each}
        </ImageZoom>
      </div>
    </section>
  {/if}

  {#if business.google_place_id}
    <section>
      <GoogleMapIFrame
        google_place_id={business.google_place_id}
        formatted_address={business.formatted_address}
      />
    </section>
  {/if}
</article>
