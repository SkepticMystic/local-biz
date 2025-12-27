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
        "Every business owner lives right here in Hermanus and the Overstrand. When you shop local, your money stays in our community and helps your neighbors thrive.",
    },
    {
      icon: "lucide/thumbs-up",
      title: "Community Vetted",
      content:
        "Real reviews from real neighbors in Hermanus. See what others in the Overstrand are saying about local businesses.",
    },
    {
      icon: "lucide/users",
      title: "Stronger Together",
      content:
        "Join a growing network of people who believe in supporting Hermanus businesses. Together, we're building a more vibrant Overstrand.",
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
