<script lang="ts">
  import ShareButton from "$lib/components/buttons/ShareButton.svelte";
  import GoogleMapIFrame from "$lib/components/map/GoogleMapIFrame.svelte";
  import PrerenderedMarkdown from "$lib/components/text/markdown/PrerenderedMarkdown.svelte";
  import Avatar from "$lib/components/ui/avatar/avatar.svelte";

  let { data } = $props();
</script>

<article>
  <header class="flex items-center justify-between gap-3">
    <div class="flex items-center gap-2">
      <Avatar
        src={data.business.logo}
        fallback={data.business.name[0]}
      ></Avatar>

      <h1>{data.business.name}</h1>
    </div>

    <ShareButton
      data={{ title: data.business.name, text: data.seo.description }}
    />
  </header>

  {#if data.prerendered.description}
    <section>
      <PrerenderedMarkdown html={data.prerendered.description} />
    </section>
  {/if}

  <section>
    <GoogleMapIFrame
      google_place_id={data.business.google_place_id}
      formatted_address={data.business.formatted_address}
    />
  </section>
</article>
