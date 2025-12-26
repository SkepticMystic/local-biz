<script lang="ts">
  import { resolve } from "$app/paths";
  import FeaturesBlock from "$lib/components/blocks/features/FeaturesBlock.svelte";
  import StatsBlock from "$lib/components/blocks/stats/StatsBlock.svelte";
  import Logo from "$lib/components/image/Logo.svelte";
  import BusinessItem from "$lib/components/items/business/BusinessItem.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import { APP } from "$lib/const/app.const";
  import {
    get_all_my_businesses_remote,
    get_random_public_business_remote,
  } from "$lib/remote/business/business.remote";

  const my_businesses = get_all_my_businesses_remote();
  const featured_business = get_random_public_business_remote();
</script>

<article class="mx-auto mt-32 flex max-w-lg flex-col gap-y-7">
  <header class="flex flex-col items-center gap-4">
    <Logo size="size-10" />
    <h1>{APP.NAME}</h1>
    <p>{APP.DESCRIPTION}</p>
  </header>

  <section class="flex justify-center pb-10">
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

  <section id="featured">
    <div>
      <h2>Spotlight</h2>
      <p class="text-muted-foreground">Check out this awesome local business</p>
    </div>

    {#if !featured_business.current}
      <Skeleton class="h-32 w-full" />
    {:else if featured_business.current.ok}
      <BusinessItem
        variant="outline"
        business={featured_business.current.data}
      />
    {:else}{/if}
  </section>

  <section id="features">
    <div>
      <h2>Why Shop Local?</h2>
      <p class="text-muted-foreground">Because your community matters</p>
    </div>

    <FeaturesBlock />
  </section>

  <section id="stats">
    <div>
      <h2>Growing Every Day</h2>
      <p class="text-muted-foreground">
        Join our community of local supporters
      </p>
    </div>

    <StatsBlock />
  </section>

  <section id="contact">
    <div>
      <h2>Let's Connect!</h2>
      <p class="text-muted-foreground">
        Have questions? Want to get involved? We'd love to hear from you!
      </p>
    </div>

    <Button
      size="lg"
      icon="lucide/mail"
      href={resolve("/contact")}
    >
      Get in Touch
    </Button>
  </section>
</article>
