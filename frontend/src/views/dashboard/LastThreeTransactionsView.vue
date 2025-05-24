<template>
  <BaseMaterialCard
    class="pa-4 h-100"
    elevation="2"
    :title="title"
  >
    <v-list
      v-if="lastThreeTransactions.length > 0"
      density="compact"
    >
      <v-list-item
        v-for="(transaction, index) in lastThreeTransactions"
        :key="index"
        class="pa-0"
      >
        <v-card
          class="ma-2"
          elevation="2"
          rounded="xl"
        >
          <v-card-text>
            <v-row no-gutters>
              <!-- Descrição e Tipo -->
              <v-col
                cols="6"
                class="d-flex align-center mb-2"
              >
                <v-icon :icon="iconByType(transaction.type)" />
                <span class="ml-2 text-subtitle-1 font-weight-medium">
                  {{ transaction.description }}
                </span>
              </v-col>

              <!-- Valor e Status -->
              <v-col
                cols="6"
                class="d-flex align-center justify-end mb-2"
              >
                <v-icon icon="mdi-cash" />
                <span class="ml-2 text-subtitle-1 font-weight-medium">
                  {{ formatMoney(transaction.value) }}
                </span>
                <v-icon
                  class="ml-4"
                  :icon="transaction.status === 0 ? 'mdi-thumb-up' : 'mdi-thumb-down'"
                  :color="transaction.status === 0 ? 'success' : 'error'"
                />
              </v-col>

              <!-- Data -->
              <v-col
                cols="6"
                class="d-flex align-center"
              >
                <v-icon icon="mdi-calendar" />
                <span class="ml-2">{{ formatDate(transaction.date) }}</span>
              </v-col>

              <!-- Conta -->
              <v-col
                cols="6"
                class="d-flex align-center justify-end"
              >
                <v-icon icon="mdi-bank" />
                <span class="ml-2">{{ transaction.accountName }}</span>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-list-item>
    </v-list>

    <v-alert
      v-else
      type="info"
      variant="outlined"
      rounded="lg"
      text="Não há lançamentos cadastrados"
    />
  </BaseMaterialCard>
</template>

<script>
import { formatCurrencyMaskBR } from '@/utils/monetary.js'

import dayjs from 'dayjs'
import dashboardService from '@/services/dashboardService'

import BaseMaterialCard from '@/components/BaseMaterialCard.vue'

export default {
  components: {
    BaseMaterialCard
  },
  data() {
    return {
      loading: false,
      title: "Últimos Lançamentos",
      lastThreeTransactions: []
    }
  },
  computed:{
    formatMoney() {
      return value => {
        return formatCurrencyMaskBR(value)
      }
    },
    formatDate() {
      return date => {
        if (!date) return ''
        
        return dayjs(date).format('DD/MM/YYYY')
      }
    },
    iconByType() {
      return type => {
        switch (type) {
          case "expense": 
            return 'mdi-cash-minus'
          case "income": 
            return 'mdi-cash-plus'
          case "transfer": 
            return 'mdi-bank-transfer'
        }
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      try {
        this.loading = true
        this.lastThreeTransactions = await dashboardService.lastThreeTransactions()
      } catch {
        this.$showMessage('Ocorreu um erro ao buscar as ultimas tres transações', 'error')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>