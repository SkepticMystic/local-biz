<script lang="ts">
  import type { ResolvedPathname } from "$app/types";
  import { BetterAuthClient } from "$lib/auth-client";
  import { AdminClient } from "$lib/clients/auth/admin.client";
  import { APP } from "$lib/const/app.const";
  import { get_all_my_businesses_remote } from "$lib/remote/business/business.remote";
  import { session } from "$lib/stores/session.store";
  import { toast } from "svelte-sonner";
  import ButtonGroup from "../ui/button-group/button-group.svelte";
  import Button from "../ui/button/button.svelte";
  import DropdownMenu from "../ui/dropdown-menu/DropdownMenu.svelte";
  import ThemeSelector from "./ThemeSelector.svelte";

  const my_businesses = get_all_my_businesses_remote();

  interface Route {
    side: "center" | "right";
    label: string;
    href: ResolvedPathname;
    icon: string;
    /** Only show if user is authenticated */
    authed: boolean;
    admin?: boolean;
    hide?: boolean;
  }

  const routes: Route[] = $derived([
    {
      side: "right",
      label: "Profile",
      href: "/s/profile",
      icon: "lucide/user",
      authed: true,
      hide: !my_businesses.current?.length,
    },
    {
      side: "right",
      label: "Account",
      href: "/account",
      icon: "lucide/key",
      authed: true,
    },
    {
      side: "right",
      label: "Admin",
      href: "/admin",
      icon: "lucide/shield-check",
      authed: true,
      admin: true,
    },
    {
      side: "right",
      label: "Sign in",
      href: "/auth/signin",
      icon: "lucide/log-in",
      authed: false,
    },
    {
      side: "right",
      label: "Sign up",
      href: "/auth/signup",
      icon: "lucide/user-plus",
      authed: false,
    },
  ]);

  const show_route = (route: Route, side?: Route["side"]) => {
    if (side && route.side !== side) {
      return false;
    } else if (route.authed !== !!$session?.data?.session) {
      return false;
    } else if (route.admin && $session?.data?.user?.role !== "admin") {
      return false;
    } else if (route.hide) {
      return false;
    } else {
      return true;
    }
  };

  const signout = () =>
    BetterAuthClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.info("You have been signed out.");
          location.reload();
        },
        onError: (error) => {
          console.error("Error signing out:", error);
          location.reload();
        },
      },
    });
</script>

<nav class="mx-auto flex h-16 max-w-4xl items-center justify-between px-3">
  <ButtonGroup>
    <Button
      href="/"
      size="lg"
      variant="link"
    >
      {APP.NAME}
    </Button>
  </ButtonGroup>

  <ButtonGroup>
    <ButtonGroup>
      <ThemeSelector />
    </ButtonGroup>

    <ButtonGroup>
      <DropdownMenu
        variant="outline"
        title="Open menu"
        items={[
          {
            kind: "group",
            title: "My Account",
            items: routes.map((r) => ({
              icon: r.icon,
              title: r.label,
              href: r.href,
              hide: !show_route(r),
            })),
          },
          {
            kind: "item",
            title: "Sign out",
            onselect: signout,
            icon: "lucide/log-out",
            hide: !$session.data?.session,
          },

          {
            kind: "item",
            title: "Stop impersonating",
            icon: "lucide/stop-circle",
            hide: !$session.data?.session.impersonatedBy,
            onselect: () => AdminClient.stop_impersonating({}),
          },
        ]}
      ></DropdownMenu>
    </ButtonGroup>
  </ButtonGroup>
</nav>
