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
import { getAll } from '@/services/IncomeService'

export default {
  name: "ReportIncomeIndex",
  components: {
    BaseMaterialCard
  },
  data () {
    return {
      items: [],
      loading: false
    }
  },
  async created () {
    try {
      this.loading = true
      this.items = await getAll()
    } catch {
      // Exibir mensagem de erro
    } finally {
      this.loading = false
    }
  }
}
</script>