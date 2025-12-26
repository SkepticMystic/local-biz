<script lang="ts">
  import { resolve } from "$app/paths";
  import { BetterAuthClient } from "$lib/auth-client.js";
  import CredentialSigninForm from "$lib/components/auth/authenticate/CredentialSigninForm.svelte";
  import SocialSigninButton from "$lib/components/auth/authenticate/SocialSigninButton.svelte";
  import PasskeySigninButton from "$lib/components/auth/passkeys/PasskeySigninButton.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { APP } from "$lib/const/app.const";
  import { AUTH, type IAuth } from "$lib/const/auth/auth.const";

  let { data } = $props();

  const last_method = BetterAuthClient.getLastUsedLoginMethod();
  console.log("last_method", last_method);
</script>

<Card
  class="mx-auto w-full max-w-[353px]"
  title="Signin to {APP.NAME}"
>
  {#snippet content()}
    <div class="space-y-5">
      {#if last_method}
        {@const provider = AUTH.PROVIDERS.MAP[last_method as IAuth.ProviderId]}

        {#if provider}
          <div class="flex w-full justify-center">
            <Badge variant="outline">
              You last signed in with <strong>{provider.name}</strong>
            </Badge>
          </div>
        {/if}
      {/if}

      <ButtonGroup
        class="w-full"
        orientation="vertical"
      >
        {#each AUTH.PROVIDERS.IDS as provider_id (provider_id)}
          {@const { is_social } = AUTH.PROVIDERS.MAP[provider_id]}

          <ButtonGroup class="w-full">
            {#if is_social}
              <SocialSigninButton
                {provider_id}
                redirect_uri={data.search.redirect_uri}
              />
            {/if}
          </ButtonGroup>
        {/each}

        <ButtonGroup class="w-full">
          <PasskeySigninButton redirect_uri={data.search.redirect_uri} />
        </ButtonGroup>
      </ButtonGroup>

      <Separator />

      <CredentialSigninForm redirect_uri={data.search.redirect_uri} />

      <ButtonGroup orientation="vertical">
        <ButtonGroup>
          <Button
            variant="link"
            href={resolve("/auth/forgot-password")}
          >
            Forgot your password?
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            variant="link"
            href={resolve("/auth/signup")}
          >
            Don't have an account? Sign up
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </div>
  {/snippet}
</Card>
