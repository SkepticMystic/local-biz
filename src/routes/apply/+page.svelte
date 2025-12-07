<script lang="ts">
  import { resolve } from "$app/paths";
  import BusinessForm from "$lib/components/form/business/BusinessForm.svelte";
  import Alert from "$lib/components/ui/alert/Alert.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { APP } from "$lib/const/app.const";

  let { data } = $props();
</script>

<article>
  <header>
    <h1>Apply to list your business</h1>
  </header>

  {#if !data.session}
    <Alert>
      {#snippet title()}
        <span class="flex items-center gap-2">
          <Icon icon="lucide/user" />
          <span class="text-lg">
            You must have an account to list your business
          </span>
        </span>
      {/snippet}

      {#snippet description()}
        <p>
          In order to list your business on {APP.NAME}, you must first create an
          account.
        </p>

        <p>
          If you already have one, you can <Anchor
            href={resolve("/auth/signin")}
          >
            sign in here
          </Anchor>. Otherwise, <Anchor href={resolve("/auth/signup")}>
            click here to sign up
          </Anchor>.
        </p>
      {/snippet}
    </Alert>
  {:else}
    <BusinessForm mode="create"></BusinessForm>

    <Separator />
    <section>
      <Alert>
        {#snippet title()}
          <div class="flex items-center gap-2">
            <Icon icon="lucide/scale" />
            <h4>Legal Section</h4>
          </div>
        {/snippet}

        {#snippet description()}
          <p>
            Please note, by applying to list your business on {APP.NAME}, you
            agree to the following:
          </p>

          <ul class="list-inside list-disc">
            <li>
              To list a business, the owner must reside in the area the business
              serves. This will be determined at the discretion of the {APP.NAME}
              administrators.
            </li>
            <li>
              {APP.NAME} or any other entity associated with it cannot be held liable
              for any loss related to the listing of information submitted to this
              site.
            </li>
            <li>
              By using {APP.NAME} you agree that all content, images, etc are used
              by permission from the legal copyright holder and that you cannot hold
              {APP.NAME}
              or any other entity associated it responsible for any copyright disputes.
            </li>
          </ul>
        {/snippet}
      </Alert>
    </section>
  {/if}
</article>
