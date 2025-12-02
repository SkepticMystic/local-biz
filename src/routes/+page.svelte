<script lang="ts">
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { APP } from "$lib/const/app.const";
</script>

<article class="mx-auto mt-32 flex max-w-lg flex-col items-center">
  <header>
    <h1>{APP.NAME}</h1>
  </header>

  <div class="my-14">
    <ButtonGroup>
      <ButtonGroup>
        <Button href="/apply">Apply</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button
          variant="secondary"
          href="/s/businesses"
        >
          My Businesses
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  </div>
</article>
