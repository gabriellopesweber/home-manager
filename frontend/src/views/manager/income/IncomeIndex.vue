<template>
  <div>
    <v-container
      fluid
      class="mt-5"
    >
      <BaseMaterialCard>
        <template #title>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="6"
            >
              <span> Lançamentos </span>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <GlobalSelectPeriod />
            </v-col>
          </v-row>
        </template>
        
        <template #append>
          <ActionSpeedDial
            default-tooltip-location="left"
            open-on-hover
            :actions="actions"
            :curenty-type="fabType"
            @action="executeAction(fabType)"
            @update:curenty-type="fabType = $event"
          />
        </template>

        <v-data-table
          :items="items"
          :headers="header"
        >
          <template #item.type="{ item }">
            <v-icon
              v-if="item.type === 'income'"
              color="success"
            >
              mdi-cash-plus
            </v-icon>
            <v-icon
              v-else-if="item.type === 'expense'"
              color="error"
            >
              mdi-cash-minus
            </v-icon>
            <v-icon
              v-else-if="item.type === 'transfer'"
              color="primary"
            >
              mdi-bank-transfer
            </v-icon>
          </template>

          <template #item.value="{ item }">
            R$: {{ maskedAmount(item.value) }}
          </template>
        </v-data-table>
      </BaseMaterialCard>
    </v-container>

    <IncomeCreate
      :show-dialog="showIncome"
      @update:model-value="showIncome = $event"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import LaunchService from '../../../services/LaunchService'
import { headerLaunch } from '../../../constants/headers/launch'
import { formatCurrencyMaskBR } from '@/utils/monetary'

import BaseMaterialCard from '@/components/BaseMaterialCard.vue'
import IncomeCreate from './IncomeCreate.vue'
import GlobalSelectPeriod from '../../../components/GlobalSelectPeriod.vue'
import ActionSpeedDial from '../../../components/ActionSpeedDial.vue'

export default {
  name: "IncomeIndex",
  components: {
    BaseMaterialCard,
    IncomeCreate,
    GlobalSelectPeriod,
    ActionSpeedDial
  },
  data () {
    return {
      fabType: 'receita',
      showIncome: false,
      showExpense: false,
      showTransfer: false,
      items: [],
      header: headerLaunch,
      actions: [
        {
          icon: 'mdi-cash-plus',
          text: 'Cadastrar Receita',
          color: 'success',
          type: 'receita'
        },
        {
          icon: 'mdi-cash-minus',
          text: 'Cadastrar Despesa',
          color: 'red',
          type: 'despesa'
        },
        {
          icon: 'mdi-bank-transfer',
          text: 'Transferir',
          color: 'primary',
          type: 'transferencia'
        }
      ]
    }
  },
  computed: {
    maskedAmount() {
      return value => formatCurrencyMaskBR(value)
    }
  },
  async created() {
    this.items = await LaunchService.getAll(dayjs().startOf('month').toISOString(), dayjs().endOf('day').toISOString())
  },
  methods: {
    executeAction(type) {
      if (type === 'receita') this.showIncome = true
      if (type === 'despesa') this.showExpense = true
      if (type === 'transferencia') this.showTransfer = true
    }
  }
}
</script>