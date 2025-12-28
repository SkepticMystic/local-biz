<script lang="ts">
  import BusinessForm from "$lib/components/form/business/BusinessForm.svelte";
  import BackAnchor from "$lib/components/links/BackAnchor.svelte";

  let { data } = $props();

  const { business } = data;
</script>

<article>
  <header>
    <h1>Update {business.name}</h1>

    <BackAnchor backto="Business" />
  </header>

  <BusinessForm
    admin
    mode="update"
    initial={business}
  ></BusinessForm>
</article>
