<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import FormButton from "$lib/components/buttons/FormButton.svelte";
  import Alert from "$lib/components/ui/alert/Alert.svelte";
  import Card from "$lib/components/ui/card/Card.svelte";
  import Field from "$lib/components/ui/field/Field.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { reset_password_remote } from "$lib/remote/auth/user.remote";
  import { toast } from "svelte-sonner";

  let { data } = $props();

  const form = reset_password_remote;
</script>

<article>
  <Card
    title="Reset Password"
    class="mx-auto w-full max-w-xs"
    description="Choose a new password for your account"
  >
    {#snippet content()}
      {#if data.search.token}
        <form
          class="space-y-3"
          {...form.enhance(async ({ submit }) => {
            await submit();

            const res = form.result;
            if (res?.ok) {
              toast.success("Password reset successfully");
              await goto(resolve("/auth/signin"));
            } else if (res?.error) {
              toast.error(res.error.message);
            }
          })}
        >
          <input {...form.fields.token.as("hidden", data.search.token)} />
          <Field
            label="New password"
            field={form.fields.new_password}
          >
            {#snippet input({ props, field })}
              <Input
                {...props}
                {...field?.as("password")}
                required
                autocomplete="new-password"
              />
            {/snippet}
          </Field>

          <FormButton
            {form}
            class="w-full"
            icon="lucide/key"
          >
            Reset Password
          </FormButton>
        </form>
      {:else}
        <Alert
          variant="destructive"
          title="Invalid reset token"
          description={data.search.error ?? ""}
        />
      {/if}
    {/snippet}
  </Card>
</article>
