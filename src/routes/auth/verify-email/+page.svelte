<script lang="ts">
  import FormButton from "$lib/components/buttons/FormButton.svelte";
  import Alert from "$lib/components/ui/alert/Alert.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
  import Field from "$lib/components/ui/field/Field.svelte";
  import Icon from "$lib/components/ui/icon/Icon.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { send_verification_email_remote } from "$lib/remote/auth/user.remote";
  import { toast } from "svelte-sonner";

  const form = send_verification_email_remote;
</script>

<article>
  <Alert
    class="mx-auto max-w-sm"
    description="A verification link has been sent to your email address. Please check your inbox and click the link to verify your email."
  >
    {#snippet title()}
      <span class="flex items-center gap-2">
        <Icon
          class="size-5"
          icon="lucide/mail"
        />
        <h3>Verify your email address</h3>
      </span>
    {/snippet}
  </Alert>

  <Card
    class="mx-auto max-w-sm"
    title="Haven't received the email?"
    description="Check your spam folder or try resending below."
  >
    {#snippet content()}
      <form
        class="flex flex-col gap-3"
        {...form.enhance(async ({ submit }) => {
          await submit();

          const res = form.result;
          if (res?.ok) {
            toast.success(res.data.message);
          } else if (res?.error) {
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
              autocomplete="email"
            />
          {/snippet}
        </Field>

        <FormButton
          {form}
          icon="lucide/mail"
          variant="secondary"
        >
          Resend verification email
        </FormButton>
      </form>
    {/snippet}
  </Card>
</article>
