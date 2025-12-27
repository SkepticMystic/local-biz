<script lang="ts">
  import { resolve } from "$app/paths";
  import FAQBlock from "$lib/components/blocks/faq/FAQBlock.svelte";
  import FeaturesBlock from "$lib/components/blocks/features/FeaturesBlock.svelte";
  import HeroBlock from "$lib/components/blocks/hero/HeroBlock.svelte";
  import StatsBlock from "$lib/components/blocks/stats/StatsBlock.svelte";
  import BusinessCard from "$lib/components/cards/business/BusinessCard.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import ItemCarousel from "$lib/components/ui/carousel/ItemCarousel.svelte";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import { search_public_businesses_remote } from "$lib/remote/business/business.remote";
</script>

<article class="mx-auto flex max-w-4xl flex-col gap-y-16 pb-16">
  <HeroBlock />

  <div class="mx-auto flex w-full max-w-3xl flex-col gap-y-16 px-4">
    <section id="featured">
      <div class="mb-6 text-center">
        <h2 class="text-3xl font-bold">Spotlight</h2>
        <p class="text-muted-foreground">Check out these local businesses</p>
      </div>

      <svelte:boundary>
        {#snippet pending()}
          <Skeleton class="h-32 w-full" />
        {/snippet}

        <ItemCarousel
          items={await search_public_businesses_remote({
            limit: 3,
            where: {},
            orderBy: "RANDOM()",
          })}
        >
          {#snippet item(business)}
            <BusinessCard {business} />
          {/snippet}
        </ItemCarousel>
      </svelte:boundary>
    </section>

    <section id="features">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold">Why Shop Local?</h2>
        <p class="text-muted-foreground">Because your community matters</p>
      </div>

      <FeaturesBlock />
    </section>

    <section id="stats">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold">Growing Every Day</h2>
        <p class="text-muted-foreground">
          Join our community of local supporters
        </p>
      </div>

      <StatsBlock />
    </section>

    <FAQBlock />

    <section id="contact">
      <div class="mb-6 text-center">
        <h2 class="text-3xl font-bold">Let's Connect!</h2>
        <p class="text-muted-foreground">
          Have questions? Want to get involved? We'd love to hear from you!
        </p>
      </div>

      <div class="flex justify-center">
        <Button
          size="lg"
          icon="lucide/mail"
          href={resolve("/contact")}
        >
          Get in Touch
        </Button>
      </div>
    </section>
  </div>
</article>
