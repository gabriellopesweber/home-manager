<template>
  <v-container
    fluid
    class="mt-5"
  >
    <BaseMaterialCard title="Conta" />
  </v-container>
</template>

<script>
import BaseMaterialCard from '@/components/BaseMaterialCard.vue'

export default {
  name: "AccountIndex",
  components: {
    BaseMaterialCard
  },
  data () {
    return {}
  }
}
</script>