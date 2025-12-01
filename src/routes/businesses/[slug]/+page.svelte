<script lang="ts">
  import BusinessLikeToggle from "$lib/components/buttons/BusinessLikeToggle.svelte";
  import ShareButton from "$lib/components/buttons/ShareButton.svelte";
  import Picture from "$lib/components/image/Picture.svelte";
  import GoogleMapIFrame from "$lib/components/map/GoogleMapIFrame.svelte";
  import PrerenderedMarkdown from "$lib/components/text/markdown/PrerenderedMarkdown.svelte";
  import Avatar from "$lib/components/ui/avatar/avatar.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import { IMAGES } from "$lib/const/image/image.const.js";

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

  {#if data.prerendered.description}
    <section>
      <PrerenderedMarkdown html={data.prerendered.description} />
    </section>
  {/if}

  {#if business.images.length}
    <section>
      <div class="flex flex-wrap gap-3">
        {#each business.images as image (image.url)}
          <Picture
            {image}
            {...IMAGES.SIZES.THUMBNAIL}
          />
        {/each}
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
