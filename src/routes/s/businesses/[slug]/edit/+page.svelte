<script lang="ts">
  import DeleteImageButton from "$lib/components/buttons/DeleteImageButton.svelte";
  import BusinessForm from "$lib/components/form/business/BusinessForm.svelte";
  import UploadImagesForm from "$lib/components/form/image/UploadImagesForm.svelte";
  import Picture from "$lib/components/image/Picture.svelte";
  import BackAnchor from "$lib/components/links/BackAnchor.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import Toggle from "$lib/components/ui/toggle/toggle.svelte";
  import { IMAGES } from "$lib/const/image/image.const";
  import { Items } from "$lib/utils/items.util.js";

  let { data } = $props();

  const { business } = data;
  let images = $state(data.business.images);
</script>

<article>
  <header>
    <h1>Update {business.name}</h1>

    <BackAnchor backto="Business" />
  </header>

  <BusinessForm
    mode="update"
    initial={business}
  ></BusinessForm>

  <Separator />

  <section>
    <h2>Images</h2>

    <UploadImagesForm
      resource_kind="business"
      resource_id={business.id}
      after_upload={(results) =>
        results.forEach((r) => (r.ok ? images.push(r.data) : null))}
    />

    <div class="flex flex-wrap gap-3">
      {#each images as image (image.id)}
        <div class="flex flex-col gap-1">
          <Picture
            {image}
            {...IMAGES.SIZES.THUMBNAIL}
          />
          <ButtonGroup>
            <Toggle
              disabled
              pressed={image.admin_approved}
              title={image.admin_approved ? "Approved" : "Not approved"}
              icon={image.admin_approved ? "lucide/check" : "lucide/x"}
            >
              {image.admin_approved ? "Approved" : "Not approved"}
            </Toggle>

            <ButtonGroup>
              <DeleteImageButton
                {image}
                on_delete={() => {
                  images = Items.remove(images, image.id);
                }}
              />
            </ButtonGroup>
          </ButtonGroup>
        </div>
      {/each}
    </div>
  </section>
</article>
