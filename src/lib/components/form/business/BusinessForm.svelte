<script lang="ts">
  import { BetterAuthClient } from "$lib/auth-client";
  import Button from "$lib/components/ui/button/button.svelte";
  import Field from "$lib/components/ui/field/Field.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import {
    create_business_remote,
    update_business_remote,
  } from "$lib/remote/business/business.remote";
  import type { BusinessSchema } from "$lib/server/db/models/business.model";
  import { toast } from "svelte-sonner";
  import GooglePlacesInput from "../place/GooglePlacesInput.svelte";

  let props:
    | { mode: "create" }
    | {
        mode: "update";
        initial: BusinessSchema["update"];
      } = $props();

  const form =
    props.mode === "create" ? create_business_remote : update_business_remote;

  if (props.mode === "update") {
    form.fields.set(props.initial);
  }
  $effect(() => {
    if (props.mode === "update") {
      form.fields.set(props.initial);
    }
  });

  $inspect(form.fields.value());
</script>

<form
  class="space-y-3"
  {...form.enhance(async (e) => {
    console.log("form.enhance.e", e);
    await e.submit();

    console.log("issues", form.fields.issues());
    console.log("allIssues", form.fields.allIssues());

    const res = form.result;
    console.log("form.result", res);
    if (res?.ok) {
      if (props.mode === "create") {
        toast.success(
          "Application submitted successfully. We'll get back to you soon.",
        );

        // NOTE: Don't redirect to the organization page,
        // The current session hasn't updated to have an activeOrganizationId yet
        BetterAuthClient.$store.notify("$sessionSignal");
        window.location.reload();
      } else {
        toast.success("Business updated successfully");
      }
    } else if (res?.error) {
      toast.error(res.error.message);
    }
  })}
>
  {#if props.mode === "update"}
    <input {...form.fields.id.as("hidden", props.initial.id)} />
  {/if}

  <Field
    label="Business name *"
    field={form.fields.name}
  >
    {#snippet input({ props, field })}
      <Input
        {...props}
        {...field?.as("text")}
        required
        autocomplete="organization"
      />
    {/snippet}
  </Field>

  <Field
    label="Logo URL"
    field={form.fields.logo}
    description="A link to your logo"
  >
    {#snippet input({ props, field })}
      <Input
        {...props}
        {...field?.as("url")}
        placeholder="https://example.com/logo.png"
      />
    {/snippet}
  </Field>

  <Field
    label="Bio"
    field={form.fields.description}
  >
    {#snippet input({ props, field })}
      <Textarea
        {...props}
        {...field?.as("text")}
        placeholder="A short description of your business"
      />
    {/snippet}
  </Field>

  <Field label="Place">
    {#snippet input({ props: snippet_props })}
      <input
        class="hidden"
        {...form.fields.google_place_id.as("text")}
      />
      <input
        class="hidden"
        {...form.fields.formatted_address.as("text")}
      />

      <GooglePlacesInput
        {...snippet_props}
        google_place_id={form.fields.google_place_id.value()}
        formatted_address={form.fields.formatted_address.value()}
        on_change={(data) => {
          form.fields.google_place_id.set(data.google_place_id);
          form.fields.formatted_address.set(data.formatted_address ?? "");
        }}
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
</form>
