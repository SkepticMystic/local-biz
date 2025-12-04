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
      title: "Publicly Visible",
      content: "See ratings and reviews from other people in your area.",
    },
    {
      icon: "lucide/users",
      title: "Community Support",
      content:
        "Get help from other business owners in your area, and get feedback from them.",
    },
  ];
</script>

<div class="grid gap-x-4 gap-y-4 md:grid-cols-3">
  {#each FEATURES as feat}
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
