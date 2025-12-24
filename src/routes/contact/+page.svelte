<script lang="ts">
  import Captcha from "$lib/components/auth/Captcha.svelte";
  import Alert from "$lib/components/ui/alert/Alert.svelte";
  import Anchor from "$lib/components/ui/anchor/Anchor.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
  import Field from "$lib/components/ui/field/Field.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { contact_us_remote } from "$lib/remote/contact/contact.remote";
  import { session } from "$lib/stores/session.store";
  import { onDestroy } from "svelte";
  import { toast } from "svelte-sonner";

  const form = contact_us_remote;

  const session_listener = session.subscribe(($session) => {
    if ($session.data?.user) {
      form.fields.name.set($session.data.user.name);
      form.fields.email.set($session.data.user.email);

      try {
        session_listener();
      } catch (error) {
        console.log("session_listener.error", error);
      }
    }
  });

  onDestroy(() => {
    try {
      session_listener();
    } catch (error) {
      console.log("session_listener.error", error);
    }
  });
</script>

<article class="mx-auto max-w-xs">
  <Alert>
    {#snippet title()}
      <span class="text-lg">
        <Icon
          icon="lucide/circle-question-mark"
          class="size-5"
        />
        Looking to register your business?
      </span>
    {/snippet}

    {#snippet description()}
      <p>
        Visit our <Anchor href="/apply">Apply</Anchor> page to and fill in the form.
      </p>
    {/snippet}
  </Alert>

  <Card description="Fill out the form below to get in touch.">
    {#snippet title()}
      <header>
        <h1>Contact Us</h1>
      </header>
    {/snippet}

    {#snippet content()}
      <form
        class="space-y-3"
        {...form.enhance(async (e) => {
          console.log("form.enhance.e", e);
          await e.submit();

          console.log("form.enhance.res", form.result);

          const res = form.result;
          if (res?.ok) {
            toast.success("Message sent successfully");

            e.form.reset();
          } else if (res?.error) {
            toast.error(res.error.message);
          }
        })}
      >
        <Field
          label="Name"
          field={form.fields.name}
        >
          {#snippet input({ props, field })}
            <Input
              {...props}
              {...field?.as("text")}
              required
              autocomplete="name"
              placeholder="Your name"
            />
          {/snippet}
        </Field>

        <Field
          label="Email"
          field={form.fields.email}
        >
          {#snippet input({ props, field })}
            <Input
              {...props}
              {...field?.as("email")}
              required
              inputmode="email"
              autocomplete="email"
              placeholder="Your email address"
            />
          {/snippet}
        </Field>

        <Field
          label="Message"
          field={form.fields.message}
        >
          {#snippet input({ props, field })}
            <Textarea
              {...props}
              {...field?.as("text")}
              required
              class="max-h-72 min-h-24"
              placeholder="Your message"
            />
          {/snippet}
        </Field>

        <Field
          label=""
          field={form.fields.captcha_token}
        >
          {#snippet input({ props, field })}
            <Captcha
              {...props}
              {...field?.as("text")}
            />
          {/snippet}
        </Field>

        <Button
          type="submit"
          class="w-full"
          icon="lucide/send"
          loading={form.pending > 0}
        >
          Send Message
        </Button>
      </form>
    {/snippet}
  </Card>
</article>
