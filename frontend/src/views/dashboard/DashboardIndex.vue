
<template>
  <v-container>
    <v-row>
      <!-- Saldo Atual -->
      <v-col cols="12">
        <BalanceView
          :balance="balanceDetailed?.conciliated?.balance"
          :predicted="balanceDetailed?.predicted?.balance"
        />
      </v-col>
      
      <!-- Últimas Transações -->
      <v-col
        cols="12"
        md="6"
      >
        <LastThreeTransactionsView />
      </v-col>
      
      <!-- Gráficos -->
      <v-col
        cols="12"
        md="6"
      >
        <BaseMaterialCard
          v-if="!loadingDataset"
          class="pa-4 h-100"
          elevation="2"
          title="Gráfico Financeiro"
        >
          <v-row dense>
            <v-col
              class="d-flex justify-end"
              cols="12"
            >
              <v-checkbox
                v-model="statusMode"
                label="Considerar movimentações não pagas"
                hide-details
                @update:model-value="updateStatus"
              />
            </v-col>
            <v-col>
              <BarChart
                height="300"
                :data="data"
              />
            </v-col>
          </v-row>
        </BaseMaterialCard>
      </v-col>
      
      <!-- Resumo Financeiro -->
      <v-col cols="12">
        <FinancialSummary :balance-detailed="balanceDetailed" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dayjs from 'dayjs'
import LaunchService from '@/services/LaunchService'
import dashboardService from '@/services/dashboardService'

import BarChart from '@/components/BarChart.vue'
import BaseMaterialCard from '@/components/BaseMaterialCard.vue'
import BalanceView from '@/views/dashboard/BalanceView.vue'
import LastThreeTransactionsView from '@/views/dashboard/LastThreeTransactionsView.vue'
import FinancialSummary from '@/views/dashboard/FinancialSummary.vue'

export default {
  components: {
    BaseMaterialCard,
    BarChart,
    BalanceView,
    LastThreeTransactionsView,
    FinancialSummary
  },
  data() {
    return {
      balanceDetailed: null,
      data: [],
      statusMode: true,
      status: null,
      loadingDataset: false,
      loadingBalance: false
    }
  },
  created() {
    this.getDataBalance()
    this.loadDatasets(this.status)
  },
  methods: {
    async getDataBalance() {
      try {
        this.loadingBalance = true
        this.balanceDetailed = await LaunchService.getDetailedBalanceData(dayjs().endOf('month').format('YYYY-MM-DD'))
        if (Object.keys(this.balanceDetailed).length === 0) {
          this.balanceDetailed = null
        }
      } catch {
        this.$showMessage('Ocorre um erro inesperado ao buscar lançamentos', 'error')
      } finally {
        this.loadingBalance = false
      }
    },
    async loadDatasets(status) {
      try {
        this.loadingDataset = true
        const start = dayjs().startOf('year').format('YYYY-MM-DD')
        const end = dayjs().endOf('year').format('YYYY-MM-DD')
        this.data = await dashboardService.getDatasets(status, start, end)
      } catch {
        this.$showMessage('Ocorre um erro inesperado ao carregar os dados do dashboard', 'error')
      } finally {
        this.loadingDataset = false
      }
    },
    updateStatus(selected) {
      if (!selected) {
        this.status = 0
      } else {
        this.status = null
      }

      this.loadDatasets(this.status)
    }
  }
}
</script>