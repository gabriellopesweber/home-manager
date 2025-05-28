<template>
  <BaseMaterialCard
    class="pa-4"
    elevation="2"
    :title="title"
  >
    <template #default>
      <v-row dense>
        <v-col cols="12">
          <span class="text-body-0 font-weight-medium">
            Saldo atual: 
          </span>
          <span class="text-body-1 font-weight-bold">
            {{ formatMoney(balance) }}
          </span>
        </v-col>

        <v-col cols="12">
          <span class="text-body-0 font-weight-medium">
            Saldo previsto: 
          </span>
          <span class="text-body-1 font-weight-bold">
            {{ formatMoney(predicted) }}
          </span>
        </v-col>
      </v-row>
    </template>

    <template #append>
      <v-icon
        v-tooltip:left="'As informações apresentadas correspondem aos lançamentos já registrados neste mês.'"
        icon="mdi-information-outline" 
      /> 
    </template>
  </BaseMaterialCard>
</template>

<script>
import { formatCurrencyMaskBR } from '@/utils/monetary.js'

import BaseMaterialCard from '@/components/BaseMaterialCard.vue'

export default {
  components: {
    BaseMaterialCard
  },
  props: {
    balance: {
      type: Number,
      default: 0
    },
    predicted: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      title: 'Detalhes do saldo'
    }
  },
  computed: {
    formatMoney() {
      return value => {
        return formatCurrencyMaskBR(value)
      }
    }
  },
}
</script>