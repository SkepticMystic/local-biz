<script lang="ts">
  import Captcha from "$lib/components/auth/Captcha.svelte";
  import FormButton from "$lib/components/buttons/FormButton.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
  import Field from "$lib/components/ui/field/Field.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { request_password_reset_remote } from "$lib/remote/auth/user.remote";
  import { toast } from "svelte-sonner";

  const form = request_password_reset_remote;
</script>

<article>
  <Card
    title="Forgot your password?"
    description="Enter your email to reset it"
    class="mx-auto w-full max-w-[353px]"
  >
    {#snippet content()}
      <form
        class="space-y-3"
        {...form.enhance(async (e) => {
          await e.submit();

          const res = request_password_reset_remote.result;
          if (res?.ok) {
            toast.success(res.data.message);

            e.form.reset();
          } else if (res?.error.message) {
            toast.error(res.error.message);
          }
        })}
      >
        <Field
          label="Email"
          field={form.fields.email}
        >
          {#snippet input({ props, field })}
            <Input
              {...props}
              {...field?.as("email")}
              required
              autofocus
              autocomplete="email"
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

        <FormButton
          {form}
          class="w-full"
          icon="lucide/mail"
        >
          Request password reset
        </FormButton>
      </form>
    {/snippet}
  </Card>
</article>
