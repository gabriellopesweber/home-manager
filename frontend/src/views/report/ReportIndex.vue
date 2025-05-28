<template>
  <v-container
    fluid
    class="mt-5"
  >
    <BaseMaterialCard>
      <template #title>
        <v-row dense>
          <v-col
            cols="12"
            md="3"
            class="d-flex align-center"
          >
            <span> Relatórios </span>
          </v-col>

          <v-col
            cols="12"
            md="6"
            class="d-flex justify-center"
          >
            <GlobalSelectPeriod @update:period="searchByPeriod" />
          </v-col>

          <v-col
            cols="12"
            md="3"
          />
        </v-row>
      </template>

      <v-tabs
        v-model="tab"
        grow
      >
        <v-tab value="one">
          Entrada X Saida
        </v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one">
          <v-row
            v-if="!loading"
            dense
          >
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

          <v-data-table
            :headers="header"
            :items="itemsByLabels"
            :cell-props="customCell"
            hover
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </BaseMaterialCard>
  </v-container>
</template>

<script>
import { headerReports } from '../../constants/headers/reports'
import { formatCurrencyMaskBR } from '@/utils/monetary.js'

import dashboardService from '@/services/DashboardService'

import BaseMaterialCard from '@/components/BaseMaterialCard.vue'
import GlobalSelectPeriod from '@/components/GlobalSelectPeriod.vue'
import BarChart from '@/components/BarChart.vue'

export default {
  components: {
    BaseMaterialCard,
    GlobalSelectPeriod,
    BarChart
  },
  data () {
    return {
      tab: 'one',
      data: [],
      items: [],
      header: headerReports,
      initialDate: null,
      finalDate: null,
      statusMode: true,
      status: null,
      loading: false
    }
  },
  computed: {
    itemsByLabels() {
      if (!Array.isArray(this.items) || this.items.length === 0) return []

      return this.items.flatMap(item => {
        const { labels, datasets } = item
        if (!Array.isArray(labels) || !Array.isArray(datasets)) return []

        const receitas = datasets.find(ds => ds.label === 'Receitas')?.data || []
        const despesas = datasets.find(ds => ds.label === 'Despesas')?.data || []
        const saldo = datasets.find(ds => ds.label === 'Saldo')?.data || []

        return labels.map((month, index) => {
          const income = receitas[index] || 0
          const expense = despesas[index] || 0
          const result = income - Math.abs(expense)
          const balance = saldo[index] || 0

          return {
            month: month.charAt(0).toUpperCase() + month.slice(1),
            income: formatCurrencyMaskBR(income),
            expense: formatCurrencyMaskBR(expense),
            result: formatCurrencyMaskBR(result),
            balance: formatCurrencyMaskBR(balance),
            resultRaw: result,
            balanceRaw: balance
          }
        })
      })
    }
  },
  methods: {
    async searchDatasets(status) {
      try {
        this.loading = true
        console.log("OI")
        if (this.initialDate && this.finalDate) {
          this.data = await dashboardService.getDatasets(status, this.initialDate, this.finalDate)
          this.items = [this.data]
        }
      } catch {
        this.$showMessage('Ocorre um problema ao buscar dados do grafico!', 'error')
      } finally {
        this.loading = false
      }
    },
    updateStatus(selected) {
      if (!selected) {
        this.status = 0
      } else {
        this.status = null
      }

      this.searchDatasets(this.status)
    },
    searchByPeriod(period) {
      this.initialDate = period.initialPeriod
      this.finalDate = period.finalPeriod
      this.searchDatasets(this.status)
    },
    customCell({ column, item }) {
      if (!item || !column) return {}

      if (column.value === 'result') {
        return { class: Number(item.resultRaw) >= 0 ? 'text-green' : 'text-error' }
      }

      if (column.value === 'balance') {
        return { class: Number(item.balanceRaw) >= 0 ? 'text-green' : 'text-error' }
      }

      return {}
    }
  }
}
</script>