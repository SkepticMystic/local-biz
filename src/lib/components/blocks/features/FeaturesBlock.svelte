<script lang="ts">
  import Card from "$lib/components/ui/card/Card.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";

  // Customer-facing feature cards
  const FEATURES: {
    icon: string;
    title: string;
    content: string;
    description?: string;
  }[] = [
    {
      icon: "lucide/map-pin",
      title: "Locally Owned",
      content:
        "All business owners live in the same area they operate, so you can be sure that your support feeds back into your community.",
    },
    {
      icon: "lucide/thumbs-up",
      title: "Publicly Rated",
      content: "See ratings and reviews of a business.",
    },
    {
      icon: "lucide/users",
      title: "Community Supported",
      content: "Get help from other business owners in your area.",
    },
  ];
</script>

<div class="grid gap-x-4 gap-y-4 md:grid-cols-3">
  {#each FEATURES as feat (feat.title)}
    <Card content={feat.content}>
      {#snippet title()}
        <Icon
          icon={feat.icon}
          label={feat.title}
        />
      {/snippet}
    </Card>
  {/each}
</div>
