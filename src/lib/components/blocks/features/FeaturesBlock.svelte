<script lang="ts">
  import Card from "$lib/components/ui/card/Card.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";

  const FEATURES: {
    icon: string;
    title: string;
    content: string;
    description?: string;
  }[] = [
    {
      icon: "lucide/zap",
      title: "Customizable",
      content:
        "Extensive customization options, allowing you to tailor every aspect to meet your specific needs.",
    },
    {
      icon: "lucide/settings",
      title: "You have full control",
      content:
        "From design elements to functionality, you have complete control to create a unique and personalized experience.",
    },
    {
      icon: "lucide/sparkles",
      title: "Powered By AI",
      content:
        "Elements to functionality, you have complete control to create a unique experience.",
    },
  ];
</script>

<div class="grid gap-x-8 gap-y-4 md:grid-cols-3">
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
