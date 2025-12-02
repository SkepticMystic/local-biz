<script lang="ts">
  import SellerProfileForm from "$lib/components/form/seller_profile/SellerProfileForm.svelte";

  let { data } = $props();

  const { seller_profile } = data;
</script>

<article>
  <SellerProfileForm initial={seller_profile} />
</article>
