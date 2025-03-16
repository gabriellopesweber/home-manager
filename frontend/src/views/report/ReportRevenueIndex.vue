<template>
  <v-container
    fluid
    class="mt-5"
  >
    <BaseMaterialCard title="Relatorio de Receitas">
      <v-data-table
        :items="items"
      />
    </BaseMaterialCard>
  </v-container>
</template>

<script>
import BaseMaterialCard from '@/components/BaseMaterialCard.vue'

export default {
  name: "ReportRevenueIndex",
  components: {
    BaseMaterialCard
  },
  data () {
    return {
      items: []
    }
  }
}
</script>