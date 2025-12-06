<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import FormButton from "$lib/components/buttons/FormButton.svelte";
  import PhoneInput from "$lib/components/inputs/PhoneInput.svelte";
  import UrlInput from "$lib/components/inputs/UrlInput.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import FieldGroup from "$lib/components/ui/field/field-group.svelte";
  import FieldSeparator from "$lib/components/ui/field/field-separator.svelte";
  import Field from "$lib/components/ui/field/Field.svelte";
  import Fieldset from "$lib/components/ui/field/Fieldset.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import NativeSelect from "$lib/components/ui/native-select/native-select.svelte";
  import TagsInput from "$lib/components/ui/tags-input/tags-input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { BUSINESS } from "$lib/const/business/business.const";
  import { upsert_business_remote } from "$lib/remote/business/business.remote";
  import type { BusinessSchema } from "$lib/server/db/models/business.model";
  import { toast } from "svelte-sonner";
  import GooglePlacesInput from "../place/GooglePlacesInput.svelte";

  let props:
    | { mode: "create" }
    | {
        mode: "update";
        initial: BusinessSchema["update"];
      } = $props();

  const form = upsert_business_remote;

  if (props.mode === "update") {
    form.fields.set(props.initial);
  }
  $effect(() => {
    if (props.mode === "update") {
      form.fields.set(props.initial);
    }
  });
</script>

<form
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
          "Application submitted, we'll get back to you soon. In the meantime, update your profile to get started.",
          {
            duration: Infinity,
            action: {
              label: "Profile",
              onClick: () => goto(resolve("/s/profile")),
            },
          },
        );

        await goto(resolve("/s/businesses/[slug]", res.data));
      } else {
        toast.success("Business updated successfully");
      }
    } else if (res?.error) {
      toast.error(res.error.message);
    }
  })}
>
  <Fieldset legend="Business details">
    <FieldSeparator />

    <FieldGroup>
      {#if props.mode === "update"}
        <input {...form.fields.id.as("hidden", props.initial.id)} />
      {/if}

      <Field
        label="Name *"
        orientation="responsive"
        field={form.fields.name}
        description="This is how your business will be listed"
      >
        {#snippet input({ props, field })}
          <Input
            {...props}
            {...field?.as("text")}
            required
            class="sm:min-w-[300px]"
            autocomplete="organization"
          />
        {/snippet}
      </Field>

      <Field
        label="Category *"
        orientation="responsive"
        field={form.fields.category}
        description="What category best describes your business?"
      >
        {#snippet input({ props, field })}
          <NativeSelect
            {...props}
            {...field?.as("select")}
            required
            class="sm:min-w-[300px]"
            options={BUSINESS.CATEGORY.IDS.map((id) => ({
              value: id,
              icon: BUSINESS.CATEGORY.MAP[id].icon,
              label: BUSINESS.CATEGORY.MAP[id].label,
            }))}
          />
        {/snippet}
      </Field>

      <Field
        label="Tags"
        orientation="responsive"
        field={form.fields.tags}
        description="Keywords that describe your business"
      >
        {#snippet input({ props, field })}
          <TagsInput
            {...props}
            value={field?.value()}
          />
        {/snippet}
      </Field>

      <Field
        label="Logo URL"
        orientation="responsive"
        field={form.fields.logo}
        description="A link to your logo"
      >
        {#snippet input({ props, field })}
          {#if field}
            <UrlInput
              {...props}
              {...field.as("text")}
              class="sm:min-w-[300px]"
              placeholder="example.com/logo.png"
            />
          {/if}
        {/snippet}
      </Field>

      <Field
        label="Email address"
        orientation="responsive"
        field={form.fields.emails[0]!.data}
        description="Your business's email address"
      >
        {#snippet input({ props, field })}
          <Input
            {...props}
            {...field?.as("email")}
            icon="lucide/mail"
            align="inline-start"
            class="sm:min-w-[300px]"
            placeholder="business@example.com"
          />
        {/snippet}
      </Field>

      <Field
        label="Phone number"
        orientation="responsive"
        field={form.fields.phones[0]!.data}
        description="Your business's phone number"
      >
        {#snippet input({ props, field })}
          {#if field}
            <PhoneInput
              {...props}
              {...field.as("tel")}
              class="sm:min-w-[300px]"
            />
          {/if}
        {/snippet}
      </Field>

      <Field
        label="Website"
        orientation="responsive"
        field={form.fields.urls[0]!.data}
        description="Your business's website"
      >
        {#snippet input({ props, field })}
          {#if field}
            <UrlInput
              {...props}
              {...field.as("text")}
              class="sm:min-w-[300px]"
              placeholder="example.com"
            />
          {/if}
        {/snippet}
      </Field>

      <Field
        label="Address"
        orientation="responsive"
        description="Where is your business located?"
      >
        {#snippet input({ props: snippet_props })}
          <input
            class="hidden"
            {...form.fields.google_place_id.as("text")}
          />
          <input
            class="hidden"
            {...form.fields.formatted_address.as("text")}
          />
          <input
            class="hidden"
            {...form.fields.coord_lat.as("text")}
          />
          <input
            class="hidden"
            {...form.fields.coord_lng.as("text")}
          />

          <GooglePlacesInput
            {...snippet_props}
            google_place_id={form.fields.google_place_id.value()}
            formatted_address={form.fields.formatted_address.value()}
            on_change={(data) => {
              form.fields.coord_lat.set(data.coord_lat);
              form.fields.coord_lng.set(data.coord_lng);
              form.fields.google_place_id.set(data.google_place_id);
              form.fields.formatted_address.set(data.formatted_address ?? "");
            }}
          />
        {/snippet}
      </Field>

      <Field
        label="Bio"
        orientation="responsive"
        field={form.fields.description}
      >
        {#snippet description()}
          Tell your customers what your business is about. <br />
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
            placeholder="A short description of your business"
            class="min-h-32 resize-none sm:max-w-[500px] sm:min-w-[300px]"
          />
        {/snippet}
      </Field>

      <FormButton
        {form}
        class="w-full"
      />
    </FieldGroup>
  </Fieldset>
</form>
