<script lang="ts">
  import FeaturesBlock from "$lib/components/blocks/features/FeaturesBlock.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { APP } from "$lib/const/app.const";
</script>

<article class="mx-auto mt-32 max-w-lg">
  <header>
    <h1 class="text-center">
      {APP.NAME}
    </h1>
  </header>

  <section id="features">
    <FeaturesBlock />
  </section>

  <div class="my-14">
    <ButtonGroup>
      <ButtonGroup>
        <Button href="/apply">Apply</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button
          variant="secondary"
          href="/s/businesses"
        >
          My Businesses
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  </div>
</article>
