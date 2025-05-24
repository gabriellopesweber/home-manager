
<template>
  <v-container>
    <v-row>
      <!-- Saldo Atual -->
      <v-col cols="12">
        <BalanceView
          :balance="balanceDetailed.conciliated.balance"
          :predicted="balanceDetailed.predicted.balance"
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
          class="pa-4 h-100"
          elevation="2"
          title="Gráfico Financeiro"
        >
          <LineChart :data="graficoSaldo" />
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

import LineChart from '@/components/LineChart.vue'
import BaseMaterialCard from '@/components/BaseMaterialCard.vue'
import BalanceView from '@/views/dashboard/BalanceView.vue'
import LastThreeTransactionsView from '@/views/dashboard/LastThreeTransactionsView.vue'
import FinancialSummary from '@/views/dashboard/FinancialSummary.vue'

export default {
  components: {
    BaseMaterialCard,
    LineChart,
    BalanceView,
    LastThreeTransactionsView,
    FinancialSummary
  },
  data() {
    return {
      saldoAtual: 0,
      balanceDetailed: {
        conciliated: {
          income: 0,
          expense: 0,
          transfer: 0,
          balance: 0
        },
        predicted: {
          income: 0,
          expense: 0,
          transfer: 0,
          balance: 0
        }
      },
      graficoSaldo: {},
      resumo: {
        receitas: 0,
        despesas: 0,
        investimentos: 0,
      },
    }
  },
  created() {
    this.getDataBalance()
    this.carregarDados()
  },
  methods: {
    async getDataBalance() {
      try {
        this.loading = true
        this.balanceDetailed = await LaunchService.getDetailedBalanceData(dayjs().endOf('month').format('YYYY-MM-DD'))
      } catch {
        this.$showMessage('Ocorre um erro inesperado ao carregar os dados', 'error')
      } finally {
        this.loading = false
      }
    },
    async carregarDados() {
      // Simulação de carregamento de dados (iremos substituir pela API real)
      this.saldoAtual = 5000
      this.ultimasTransacoes = [
        { descricao: 'Salário', valor: '3000' },
        { descricao: 'Aluguel', valor: '-1200' },
        { descricao: 'Supermercado', valor: '400' },
      ]
      this.graficoSaldo = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
        datasets: [{
          label: 'Saldo',
          data: [3000, 3500, 2800, 3200, 5000],
          borderColor: 'blue'
        }, { 
          label: 'Despesas',
          data: [1200, 1500, 1300, 1700, 2500],
          borderColor: 'red'
        }, { 
          label: 'Receitas',
          data: [4000, 5000, 4500, 5200, 6000],
          borderColor: 'green'
        }]
      }
      this.resumo = { receitas: 6000, despesas: 2500, investimentos: 1500 }
    }
  }
}
</script>