
<template>
  <v-container>
    <v-row>
      <!-- Saldo Atual -->
      <v-col cols="12">
        <BaseMaterialCard
          class="pa-4"
          elevation="2"
          title="Saldo Atual"
        >
          <template #subtitle>
            <span class="text-h4 font-weight-bold">
              {{ formatMoney(saldoAtual) }}
            </span>
          </template>
        </BaseMaterialCard>
      </v-col>
      
      <!-- Últimas Transações -->
      <v-col
        cols="12"
        md="6"
      >
        <BaseMaterialCard
          class="pa-4 h-100"
          elevation="2"
          title="Últimas Transações"
        >
          <v-list density="compact">
            <v-list-item
              v-for="(transacao, index) in ultimasTransacoes"
              :key="index"
            >
              <v-list-item-title>{{ transacao.descricao }}</v-list-item-title>
              <v-list-item-subtitle>{{ formatMoney(transacao.valor) }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </BaseMaterialCard>
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
        <BaseMaterialCard
          class="pa-4"
          elevation="2"
          title="Resumo Financeiro"
        >
          <v-row dense>
            <v-col
              cols="12"
              md="4"
            >
              <v-card
                class="pa-2 text-center"
                border
              >
                <v-card-subtitle>Receitas</v-card-subtitle>
                <v-card-title class="text-success">
                  {{ resumo.receitas }}
                </v-card-title>
              </v-card>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-card
                class="pa-2 text-center"
                border
              >
                <v-card-subtitle>Despesas</v-card-subtitle>
                <v-card-title class="text-error">
                  {{ resumo.despesas }}
                </v-card-title>
              </v-card>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-card
                class="pa-2 text-center"
                border
              >
                <v-card-subtitle>Investimentos</v-card-subtitle>
                <v-card-title class="text-primary">
                  {{ resumo.investimentos }}
                </v-card-title>
              </v-card>
            </v-col>
          </v-row>
        </BaseMaterialCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LineChart from '@/components/LineChart.vue'
import BaseMaterialCard from '@/components/BaseMaterialCard.vue'
import { formatCurrencyBR } from '@/utils/monetary.js'

export default {
  components: { BaseMaterialCard, LineChart },
  data() {
    return {
      saldoAtual: 0,
      ultimasTransacoes: [],
      graficoSaldo: {},
      resumo: {
        receitas: 0,
        despesas: 0,
        investimentos: 0,
      },
    }
  },
  computed: {
    formatMoney () {
      return (value) => {
        return formatCurrencyBR(value)
      }
    }
  },
  created() {
    this.carregarDados()
  },
  methods: {
    async carregarDados () {
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