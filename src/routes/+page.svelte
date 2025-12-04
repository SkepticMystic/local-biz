<script lang="ts">
  import FeaturesBlock from "$lib/components/blocks/features/FeaturesBlock.svelte";
  import StatsBlock from "$lib/components/blocks/stats/StatsBlock.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { APP } from "$lib/const/app.const";
</script>

<article class="mx-auto mt-32 max-w-lg">
  <header class="flex flex-col items-center gap-2">
    <h1 class="text-center">
      {APP.NAME}
    </h1>

    <p>
      {APP.DESCRIPTION}
    </p>
  </header>

  <section class="flex flex-col items-center pt-6 pb-12">
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
  </section>

  <section id="features">
    <FeaturesBlock />
  </section>

  <section id="stats">
    <StatsBlock />
  </section>
</article>
