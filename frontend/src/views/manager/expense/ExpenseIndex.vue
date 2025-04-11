<template>
  <v-container
    fluid
    class="mt-5"
  >
    <BaseMaterialCard title="Despesas" />
  </v-container>
</template>

<script>
import BaseMaterialCard from '@/components/BaseMaterialCard.vue'

export default {
  name: "ExpenseIndex",
  components: {
    BaseMaterialCard
  },
  data () {
    return {}
  }
}
</script>