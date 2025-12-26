<script lang="ts">
  import { resolve } from "$app/paths";
  import AccordionContent from "$lib/components/ui/accordion/accordion-content.svelte";
  import AccordionItem from "$lib/components/ui/accordion/accordion-item.svelte";
  import AccordionRoot from "$lib/components/ui/accordion/accordion-root.svelte";
  import AccordionTrigger from "$lib/components/ui/accordion/accordion-trigger.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";

  let faqItems = [
    {
      id: "item-1",
      question: "How do I list my business?",
      answer:
        "Create a free account and click 'List Your Business' from the homepage. Fill out your business details, add photos, and submit for approval. Once approved, your listing will be live on the platform.",
    },
    {
      id: "item-2",
      question: "Is it free to list my business?",
      answer:
        "Yes, creating a basic business listing is completely free. You can add your business information, photos, contact details, and location at no cost.",
    },
    {
      id: "item-3",
      question: "How long does approval take?",
      answer:
        "Most business listings are reviewed and approved within 24-48 hours. You'll receive an email notification once your listing is approved and live on the platform.",
    },
    {
      id: "item-4",
      question: "Can I edit my business listing after it's published?",
      answer:
        "Yes, you can update your business information, photos, contact details, and other information anytime from your account dashboard. Changes may require re-approval to ensure quality.",
    },
    {
      id: "item-5",
      question: "How do customers find my business?",
      answer:
        "Customers can discover your business through search, browsing by category, or through social shares. We optimize listings to help local customers find the services they need.",
    },
  ];
</script>

<section id="faq">
  <div class="mx-auto max-w-5xl px-4 md:px-6">
    <div class="mx-auto max-w-xl text-center">
      <h2>Frequently Asked Questions</h2>

      <p class="mt-4 text-balance text-muted-foreground">
        Find answers to common questions about listing your business, managing
        your profile, and connecting with local customers.
      </p>
    </div>

    <div class="mx-auto mt-12 max-w-xl">
      <AccordionRoot
        type="single"
        class="w-full rounded-md border bg-card px-8 py-3 shadow-sm ring-muted dark:ring-0"
      >
        {#each faqItems as item, index}
          <AccordionItem
            value={item.id}
            class={[faqItems.length - 1 !== index ? "border-b" : "border-none"]}
          >
            <AccordionTrigger class="cursor-pointer text-base ">
              {item.question}
            </AccordionTrigger>

            <AccordionContent>
              <p class="text-base">
                {item.answer}
              </p>
            </AccordionContent>
          </AccordionItem>
        {/each}
      </AccordionRoot>

      <p class="mt-6 px-4 text-muted-foreground">
        Can't find what you're looking for? <Anchor href={resolve("/contact")}>
          Contact us
        </Anchor>
      </p>
    </div>
  </div>
</section>
