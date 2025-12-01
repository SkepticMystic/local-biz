<script lang="ts">
  import DeleteImageButton from "$lib/components/buttons/DeleteImageButton.svelte";
  import BusinessForm from "$lib/components/form/business/BusinessForm.svelte";
  import UploadImageForm from "$lib/components/form/Image/UploadImageForm.svelte";
  import Picture from "$lib/components/image/Picture.svelte";
  import { IMAGES } from "$lib/const/image/image.const";
  import { Items } from "$lib/utils/items.util.js";

  let { data } = $props();

  let business = $state(data.business);
</script>

<article>
  <header>
    <h1>Update {business.name}</h1>
  </header>

  <BusinessForm
    mode="update"
    initial={business}
  ></BusinessForm>

  <section>
    <h2>Images</h2>

    <UploadImageForm
      resource_kind="business"
      resource_id={business.id}
      on_upload={(image) => {
        business.images = [...business.images, image];
      }}
    />

    <div class="flex flex-wrap gap-3">
      {#each business.images as image (image.id)}
        <div class="flex flex-col gap-1">
          <Picture
            {image}
            {...IMAGES.SIZES.THUMBNAIL}
          />
          <DeleteImageButton
            {image}
            on_delete={() => {
              business.images = Items.remove(business.images, image.id);
            }}
          />
        </div>
      {/each}
    </div>
  </section>
</article>
