
<template>
  <v-container>
    <v-row>
      <!-- Saldo Atual -->
      <v-col cols="12">
        <BaseMaterialCard
          class="pa-4"
          elevation="2"
          title="Detalhes do saldo"
        >
          <template #default>
            <v-row dense>
              <v-col cols="12">
                <span class="text-body-0 font-weight-medium">
                  Saldo atual: 
                </span>
                <span class="text-body-1 font-weight-bold">
                  {{ formatMoney(balanceDetailed.conciliated.balance) }}
                </span>
              </v-col>

              <v-col cols="12">
                <span class="text-body-0 font-weight-medium">
                  Saldo previsto: 
                </span>
                <span class="text-body-1 font-weight-bold">
                  {{ formatMoney(balanceDetailed.predicted.balance) }}
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
                class="pa-2 text-center h-100"
                border
              >
                <v-card-subtitle>Receitas</v-card-subtitle>
                <v-card-title>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-row no-gutters>
                        <v-col
                          class="d-flex justify-end"
                          cols="6"
                          align-self="center"
                        >
                          <span class="text-body-1">
                            Atual: 
                          </span>
                        </v-col>
                        <v-col
                          class="d-flex justify-start ml-2"
                        >
                          <span class="text-success">
                            {{ formatMoney(balanceDetailed.conciliated.income) }}
                          </span>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12">
                      <v-row no-gutters>
                        <v-col
                          class="d-flex justify-end"
                          cols="6"
                          align-self="center"
                        >
                          <span class="text-body-1">
                            Previsto: 
                          </span>
                        </v-col>
                        <v-col
                          class="d-flex justify-start ml-2"
                        >
                          <span class="text-success">
                            {{ formatMoney(balanceDetailed.predicted.income) }}
                          </span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-title>
              </v-card>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-card
                class="pa-2 text-center h-100"
                border
              >
                <v-card-subtitle>Despesas</v-card-subtitle>
                <v-card-title>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-row no-gutters>
                        <v-col
                          class="d-flex justify-end"
                          cols="6"
                          align-self="center"
                        >
                          <span class="text-body-1">
                            Atual: 
                          </span>
                        </v-col>
                        <v-col
                          class="d-flex justify-start ml-2"
                        >
                          <span class="text-error">
                            {{ formatMoney(balanceDetailed.conciliated.expense) }}
                          </span>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12">
                      <v-row no-gutters>
                        <v-col
                          class="d-flex justify-end"
                          cols="6"
                          align-self="center"
                        >
                          <span class="text-body-1">
                            Previsto: 
                          </span>
                        </v-col>
                        <v-col
                          class="d-flex justify-start ml-2"
                        >
                          <span class="text-error">
                            {{ formatMoney(balanceDetailed.predicted.expense) }}
                          </span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
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
                <v-card-subtitle>Transferência</v-card-subtitle>
                <v-card-title>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          md="6"
                        > 
                          <span class="text-body-1"> Atual </span>
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                        > 
                          <span class="text-body-1"> Previsto </span>
                        </v-col>
                        <v-col
                          class="d-flex justify-end"
                          cols="2"
                        >
                          <v-icon
                            icon="mdi-menu-up"
                            color="success"
                          />
                        </v-col>
                        <v-col class="d-flex justify-start ml-2">
                          <span class="text-primary">
                            {{ formatMoney(balanceDetailed.conciliated.transfer.in) }}
                          </span>
                        </v-col>
                        <v-col
                          class="d-flex justify-end"
                          cols="2"
                        >
                          <v-icon
                            icon="mdi-menu-up"
                            color="success"
                          />
                        </v-col>
                        <v-col class="d-flex justify-start ml-2">
                          <span class="text-primary">
                            {{ formatMoney(balanceDetailed.predicted.transfer.in) }}
                          </span>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12">
                      <v-row no-gutters>
                        <v-col
                          class="d-flex justify-end"
                          cols="2"
                        >
                          <v-icon
                            icon="mdi-menu-down"
                            color="error"
                          />
                        </v-col>
                        <v-col
                          class="d-flex justify-start ml-2"
                        >
                          <span class="text-primary">
                            {{ formatMoney(balanceDetailed.conciliated.transfer.out) }}
                          </span>
                        </v-col>
                        <v-col
                          class="d-flex justify-end"
                          cols="2"
                        >
                          <v-icon
                            icon="mdi-menu-down"
                            color="error"
                          />
                        </v-col>
                        <v-col
                          class="d-flex justify-start ml-2"
                        >
                          <span class="text-primary">
                            {{ formatMoney(balanceDetailed.predicted.transfer.out) }}
                          </span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
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
import dayjs from 'dayjs'
import LaunchService from '@/services/LaunchService'
import { formatCurrencyMaskBR } from '@/utils/monetary.js'

import LineChart from '@/components/LineChart.vue'
import BaseMaterialCard from '@/components/BaseMaterialCard.vue'
import dashboardService from '@/services/dashboardService'

export default {
  components: { BaseMaterialCard, LineChart },
  data() {
    return {
      saldoAtual: 0,
      ultimasTransacoes: [],
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
  computed: {
    formatMoney () {
      return (value) => {
        return formatCurrencyMaskBR(value)
      }
    }
  },
  async created() {
    this.getDataBalance()
    this.carregarDados()
    console.log(await dashboardService.lastThreeTransactions())
  },
  methods: {
    async getDataBalance() {
      try {
        this.loading = true
        this.balanceDetailed = await LaunchService.getDetailedBalanceData(dayjs().endOf('month').format('YYYY-MM-DD'))
      } catch {
        this.$showMessage('Ocorre um erro inesperado ao carregar os dados', 'error')
      } finally {
        console.log(this.balanceDetailed)
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