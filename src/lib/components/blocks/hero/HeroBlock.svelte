<script lang="ts">
  import Logo from "$lib/components/image/Logo.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { APP } from "$lib/const/app.const";
  import { get_all_my_businesses_remote } from "$lib/remote/business/business.remote";

  const my_businesses = get_all_my_businesses_remote();
</script>

<header
  class="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 px-8 py-20 text-center shadow-lg"
>
  <div class="bg-grid-pattern absolute inset-0 opacity-[0.02]"></div>

  <div class="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6">
    <div class="rounded-2xl bg-background/80 p-4 shadow-xl backdrop-blur-sm">
      <Logo size="size-16" />
    </div>

    <h1 class="text-5xl font-extrabold tracking-tight sm:text-6xl">
      {APP.NAME}
    </h1>
    <p class="text-xl text-muted-foreground sm:text-2xl">
      {APP.DESCRIPTION}
    </p>

    <div class="mt-4 flex flex-wrap justify-center gap-4">
      <Button
        href="/businesses"
        size="lg"
      >
        Explore Businesses
      </Button>

      <Button
        variant="outline"
        href="/apply"
        size="lg"
      >
        List Your Business
      </Button>

      {#if my_businesses.current?.length}
        <Button
          href="/s/businesses"
          size="lg"
          variant="secondary"
        >
          My Businesses
        </Button>
      {/if}
    </div>
  </div>
</header>

<style>
  .bg-grid-pattern {
    background-image:
      linear-gradient(
        to right,
        hsl(var(--foreground) / 0.1) 1px,
        transparent 1px
      ),
      linear-gradient(
        to bottom,
        hsl(var(--foreground) / 0.1) 1px,
        transparent 1px
      );
    background-size: 24px 24px;
  }
</style>
