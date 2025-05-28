<template>
  <BaseMaterialCard
    class="pa-4"
    elevation="2"
    :title="title"
  >
    <v-row dense>
      <SummaryCard
        title="Receitas"
        :actual="balanceDetailed?.conciliated?.income"
        :predicted="balanceDetailed?.predicted?.income"
        icon="mdi-arrow-up-bold"
        color="success"
      />
      <SummaryCard
        title="Despesas"
        :actual="balanceDetailed?.conciliated?.expense"
        :predicted="balanceDetailed?.predicted?.expense"
        icon="mdi-arrow-down-bold"
        color="error"
      />
      
      <TransferCard 
        :transfer-conciliated="balanceDetailed?.conciliated"
        :transfer-predicted="balanceDetailed?.predicted"
      />
    </v-row>
  </BaseMaterialCard>
</template>

<script>
import BaseMaterialCard from '@/components/BaseMaterialCard.vue'
import SummaryCard from '@/views/dashboard/SummaryCard.vue'
import TransferCard from '@/views/dashboard/TransferCard.vue'

export default {
  components: {
    BaseMaterialCard,
    SummaryCard,
    TransferCard,
  },
  props: {
    balanceDetailed: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      title: 'Resumo Financeiro'
    }
  },
}
</script>
