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
            @action="executeAction(fabIcon)"
          />
        </template>

        <v-data-table
          :items="items"
          :headers="header"
        />
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
      fabIcon: 'mdi-cash-plus',
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
  async created() {
    this.items = await LaunchService.getAll(dayjs().startOf('month').toISOString(), dayjs().endOf('day').toISOString())
  },
  methods: {
    executeAction(icon) {
      if (icon === 'mdi-cash-plus') this.showIncome = true
      if (icon === 'mdi-cash-minus') this.showExpense = true
      if (icon === 'mdi-bank-transfer') this.showTransfer = true
    }
  }
}
</script>