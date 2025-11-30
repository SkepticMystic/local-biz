<script lang="ts">
  import BusinessForm from "$lib/components/form/business/BusinessForm.svelte";

  let { data } = $props();
</script>

<article>
  <header>
    <h1>Update {data.business.name}</h1>
  </header>

  <BusinessForm
    mode="update"
    initial={data.business}
  ></BusinessForm>
</article>
