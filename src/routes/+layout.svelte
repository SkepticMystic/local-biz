<script lang="ts">
  import { dev } from "$app/environment";
  import FooterBlock from "$lib/components/blocks/footer/FooterBlock.svelte";
  import Navbar from "$lib/components/shell/Navbar.svelte";
  import SEO from "$lib/components/shell/SEO.svelte";
  import BottomNav from "$lib/components/ui/bottom-nav/BottomNav.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Sonner from "$lib/components/ui/sonner/sonner.svelte";
  import { session } from "$lib/stores/session.store";
  import { setUser } from "@sentry/sveltekit";
  import { injectAnalytics } from "@vercel/analytics/sveltekit";
  import { ModeWatcher } from "mode-watcher";
  import "./layout.css";

  let { children } = $props();

  injectAnalytics({ mode: dev ? "development" : "production", debug: false });

  const session_listener = session.subscribe(($session) => {
    if ($session.isPending || $session.isRefetching) {
      //
    } else if ($session.data) {
      setUser({
        id: $session.data.user.id,
        email: $session.data.user.email,
        username: $session.data.user.name,
        ip_address: $session.data.session.ipAddress,
      });

      try {
        session_listener();
      } catch {
        //
      }
    } else {
      setUser(null);

      try {
        session_listener();
      } catch {
        //
      }
    }
  });
</script>

<svelte:head>
  <SEO />
</svelte:head>

<ModeWatcher defaultMode="light" />

<div class="flex min-h-screen flex-col">
  <header>
    <Navbar />
  </header>

  <main class="mx-auto mt-1 mb-12 w-full max-w-4xl grow px-2 sm:px-3 md:px-5">
    {@render children?.()}
  </main>

  <FooterBlock />
</div>

<!-- Place this in your layout or page wrapper -->
<div class="fixed bottom-0 w-full md:hidden">
  <BottomNav />
</div>

<!-- NOTE: I struggled to get shad semantic classes working to style the toasts
 It's possible to apply them, but only when toastOptions.unstyled: true
 And then ALL other styles are removed...
 So, richColors for now -->
<Sonner
  richColors
  closeButton={true}
  duration={10_000}
>
  {#snippet loadingIcon()}
    <Icon
      icon="lucide/loader-2"
      class="size-5 animate-spin"
    />
  {/snippet}

  {#snippet successIcon()}
    <Icon
      icon="lucide/check"
      class="size-5"
    />
  {/snippet}

  {#snippet errorIcon()}
    <Icon
      icon="lucide/x"
      class="size-5"
    />
  {/snippet}

  {#snippet infoIcon()}
    <Icon
      icon="lucide/info"
      class="size-5"
    />
  {/snippet}

  {#snippet warningIcon()}
    <Icon
      icon="lucide/alert-triangle"
      class="size-5"
    />
  {/snippet}
</Sonner>
