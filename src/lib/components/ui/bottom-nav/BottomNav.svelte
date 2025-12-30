<script lang="ts">
  import { resolve } from "$app/paths";
  import BottomNavItem from "$lib/components/ui/bottom-nav/bottom-nav-item.svelte";
  import BottomNavRoot from "$lib/components/ui/bottom-nav/bottom-nav-root.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";

  const routes = $derived([
    {
      label: "Home",
      icon: "lucide/home",
      href: resolve("/"),
    },
    {
      label: "Businesses",
      icon: "lucide/briefcase",
      href: resolve("/businesses"),
    },
    {
      label: "Contact",
      icon: "lucide/mail",
      href: resolve("/contact"),
    },
  ]);
</script>

<BottomNavRoot>
  {#each routes as { icon, label, href }}
    <BottomNavItem {href}>
      <Icon
        {icon}
        class="size-6"
      />
      <span>{label}</span>
    </BottomNavItem>
  {/each}
</BottomNavRoot>
