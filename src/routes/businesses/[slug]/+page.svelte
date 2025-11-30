<script lang="ts">
  import ShareButton from "$lib/components/buttons/ShareButton.svelte";
  import GoogleMapIFrame from "$lib/components/map/GoogleMapIFrame.svelte";
  import PrerenderedMarkdown from "$lib/components/text/markdown/PrerenderedMarkdown.svelte";

  let { data } = $props();
</script>

<article>
  <header class="flex items-center justify-between gap-3">
    <h1>{data.business.name}</h1>

    <ShareButton
      data={{ title: data.business.name, text: data.seo.description }}
    />
  </header>

  <section>
    <PrerenderedMarkdown html={data.prerendered.description} />
  </section>

  <section>
    <GoogleMapIFrame
      google_place_id={data.business.google_place_id}
      formatted_address={data.business.formatted_address}
    />
  </section>
</article>
