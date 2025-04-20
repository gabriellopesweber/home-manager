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
          <v-speed-dial
            location="bottom center"
            transition="scale-transition"
            open-on-hover
          >
            <template #activator="{ props: speedDial }">
              <div v-bind="speedDial">
                <v-tooltip location="left">
                  <template #activator="{ props: tooltip }">
                    <v-fab
                      v-bind="tooltip"
                      rounded="circle"
                      :icon="fabIcon"
                      :color="colorAction"
                      :aria-label="`Executar ação de ${textAction}`"
                      @click="executeAction(fabIcon)"
                    />
                  </template>
                  <span>{{ textAction }}</span>
                </v-tooltip>
              </div>
            </template>

            <v-btn
              v-for="(action, index) in actions"
              :key="index"
              v-tooltip:left="`${action.text}`"
              :icon="action.icon"
              rounded="circle"
              :color="action.color"
              @click="updateTypeAction(action.icon, action.type, action.color)"
            />
          </v-speed-dial>
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

import BaseMaterialCard from '@/components/BaseMaterialCard.vue'
import IncomeCreate from './IncomeCreate.vue'
import GlobalSelectPeriod from '../../../components/GlobalSelectPeriod.vue'
import { headerLaunch } from '../../../constants/headers/launch'

export default {
  name: "IncomeIndex",
  components: {
    BaseMaterialCard,
    IncomeCreate,
    GlobalSelectPeriod
  },
  data () {
    return {
      fabIcon: 'mdi-cash-plus',
      colorAction: "success",
      textAction: 'Cadastrar Receita',
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
    updateTypeAction(icon, type, color) {
      const found = this.actions.find(a => a.type === type)
      if (!found) return

      this.fabIcon = icon
      this.colorAction = color
      this.textAction = found.text

      this.executeAction(this.fabIcon)
    },
    executeAction(icon) {
      if (icon === 'mdi-cash-plus') this.showIncome = true
      if (icon === 'mdi-cash-minus') this.showExpense = true
      if (icon === 'mdi-bank-transfer') this.showTransfer = true
    }
  }
}
</script>