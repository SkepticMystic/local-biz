<script lang="ts">
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import FieldGroup from "$lib/components/ui/field/field-group.svelte";
  import FieldSeparator from "$lib/components/ui/field/field-separator.svelte";
  import Field from "$lib/components/ui/field/Field.svelte";
  import Fieldset from "$lib/components/ui/field/Fieldset.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { upsert_seller_profile_remote } from "$lib/remote/seller_profile/seller_profile.remote";
  import type { SellerProfileSchema } from "$lib/server/db/models/seller_profile.model";
  import { toast } from "svelte-sonner";

  let {
    initial,
  }: {
    initial: SellerProfileSchema["update"] | undefined;
  } = $props();

  const form = upsert_seller_profile_remote;

  if (initial) {
    form.fields.set(initial);
  }
  $effect(() => {
    if (initial) {
      form.fields.set(initial);
    }
  });
</script>

<form
  {...form.enhance(async (e) => {
    if (
      initial &&
      !confirm(
        "Are you sure you want to update your profile? This will require admin approval before being visible to the public again.",
      )
    ) {
      return;
    }

    console.log("form.enhance.e", e);
    await e.submit();

    console.log("issues", form.fields.issues());
    console.log("allIssues", form.fields.allIssues());

    const res = form.result;
    console.log("form.result", res);
    if (res?.ok) {
      window.location.reload();
      toast.success("Profile updated");
    } else if (res?.error) {
      toast.error(res.error.message);
    }
  })}
>
  <Fieldset
    legend="Seller Profile"
    description="You've told us about your business, now you can tell us about yourself. Users will appreciate knowing who you are."
  >
    <FieldSeparator />

    <FieldGroup>
      {#if initial}
        <input {...form.fields.id.as("hidden", initial.id)} />
      {/if}

      <Field
        label="Name *"
        orientation="responsive"
        field={form.fields.name}
      >
        {#snippet input({ props, field })}
          <Input
            {...props}
            {...field?.as("text")}
            required
            class="sm:min-w-[300px]"
            autocomplete="name"
          />
        {/snippet}
      </Field>

      <Field
        label="Avatar"
        orientation="responsive"
        field={form.fields.logo}
        description="A link to a profile picture of you"
      >
        {#snippet input({ props, field })}
          <Input
            {...props}
            {...field?.as("url")}
            class="sm:min-w-[300px]"
            placeholder="https://example.com/logo.png"
          />
        {/snippet}
      </Field>

      <Field
        label="Bio"
        orientation="responsive"
        field={form.fields.description}
      >
        {#snippet description()}
          Tell us about yourself. <br />
          You can use
          <Anchor
            target="_blank"
            href="https://www.markdownguide.org/cheat-sheet/"
          >
            markdown
          </Anchor> to format your text.
        {/snippet}

        {#snippet input({ props, field })}
          <Textarea
            {...props}
            {...field?.as("text")}
            class="min-h-32 resize-none sm:max-w-[500px] sm:min-w-[300px]"
          />
        {/snippet}
      </Field>

      <Button
        type="submit"
        class="w-full"
        icon="lucide/send"
        loading={form.pending > 0}
      >
        Submit
      </Button>
    </FieldGroup>
  </Fieldset>
</form>
