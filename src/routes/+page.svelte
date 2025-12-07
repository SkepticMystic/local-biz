<script lang="ts">
  import FeaturesBlock from "$lib/components/blocks/features/FeaturesBlock.svelte";
  import StatsBlock from "$lib/components/blocks/stats/StatsBlock.svelte";
  import Logo from "$lib/components/image/Logo.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { APP } from "$lib/const/app.const";
  import { get_all_my_businesses_remote } from "$lib/remote/business/business.remote";

  const my_businesses = get_all_my_businesses_remote();
</script>

<article class="mx-auto mt-32 flex max-w-lg flex-col gap-y-7">
  <header class="flex flex-col items-center gap-4">
    <Logo size="size-10" />
    <h1>{APP.NAME}</h1>
    <p>{APP.DESCRIPTION}</p>
  </header>

  <section class="flex justify-center">
    <ButtonGroup>
      <ButtonGroup>
        {#if my_businesses.current?.length}
          <Button href="/s/businesses">My Businesses</Button>
        {:else}
          <Button href="/businesses">Businesses</Button>
        {/if}
      </ButtonGroup>

      <ButtonGroup>
        <Button
          variant="secondary"
          href="/apply"
        >
          Apply
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
