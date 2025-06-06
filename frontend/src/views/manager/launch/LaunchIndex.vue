<template>
  <div>
    <v-container
      fluid
      class="mt-5"
    >
      <BaseMaterialCard>
        <template #title>
          <v-row dense>
            <v-col align-self="center">
              <span> Lançamentos </span>
            </v-col>
            <v-col
              class="d-flex justify-center"
              cols="12"
              md="auto"
              align-self="center"
            >
              <GlobalSelectPeriod @update:period="searchByPeriod" />
            </v-col>
            <v-col
              class="d-flex justify-end my-2"
              align-self="center"
            >
              <ActionSpeedDial
                direction="left center"
                default-tooltip-location="top"
                default-color="error"
                default-icon="mdi-cash-minus"
                open-on-hover
                :open="openManager"
                :actions="actions"
                :curenty-type="fabType"
                @action="executeAction(fabType)"
                @update:curenty-type="fabType = $event"
                @update:open="openManager = $event"
              />
            </v-col>
          </v-row>
        </template>

        <v-data-table
          :items="items"
          :headers="header"
          :items-per-page="String(items.length)"
          :loading="loading"
          :cell-props="getCellProps"
          hover
          hide-default-footer
        >
          <template #item.info="{ item }">
            <v-icon 
              v-if="warningIcons[item.id]"
              v-tooltip:top="'Conciliação em atraso'"
            >
              {{ warningIcons[item.id] }}
            </v-icon>
          </template>
          
          <template #item.type="{ item }">
            <v-icon
              v-tooltip:top="getConfigType(item.type).tooltip"
              :color="getConfigType(item.type).color"
              size="large"
            >
              {{ getConfigType(item.type).icon }}
            </v-icon>
          </template>

          <template #item.value="{ item }">
            R$: {{ maskedAmount(item.value) }}
          </template>

          <template #item.category="{ item }">
            {{ formatCategory(item.category) }}
          </template>

          <template #item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>

          <template #item.account="{ item }">
            <div
              v-if="item.type === 'transfer'"
              class="d-flex"
            >
              <span>{{ formatAccount(item).origin }}</span>
              <v-icon>mdi-arrow-right-thick</v-icon>
              <span>{{ formatAccount(item).destination }}</span>
            </div>

            <span v-else> {{ formatAccount(item) }} </span>
          </template>

          <template #item.status="{ item }">
            <v-btn
              v-if="item.status === 0"
              v-tooltip:top="'Alterar para pendente'"
              icon="mdi-thumb-up"
              color="success"
              variant="text"
              rounded="circle"
              :data-cy="`update-status-${item.type}-${item.id}`"
              :loading="loadingUpdateStatus[item.id]"
              @click="updateStatus(1, item)"
            />

            <v-btn
              v-else-if="item.status === 1"
              v-tooltip:top="'Alterar para pagamento efetuado'"
              icon="mdi-thumb-down"
              variant="text"
              rounded="circle"
              :data-cy="`update-status-${item.type}-${item.id}`"
              :loading="loadingUpdateStatus[item.id]"
              @click="updateStatus(0, item)"
            />
          </template>

          <template #item.actions="{ item }">
            <ActionSpeedDial
              direction="left center"
              default-tooltip-location="top"
              default-icon="mdi-cog-outline"
              default-text="Ações"
              default-color="primary"
              default-variant="text"
              :open="openAction[item.id] || false"
              :auto-update-activator="false"
              :actions="actionsItem"
              :curenty-type="actionsType"
              @action="executeActionByItem(actionsType, item)"
              @update:curenty-type="actionsType = $event"
              @update:open="openAction[item.id] = $event"
            />
          </template>

          <template #bottom>
            <v-row dense>
              <v-col
                v-for="(item, index) in balanceInfos"
                :key="index"
                class="px-10"
                cols="12"
              >
                <v-row
                  dense
                  :class="index === 0 ? 'mt-2' : ''"
                >
                  <v-col
                    class="d-flex justify-end"
                    cols="10"
                    align-self="center"
                  >
                    <span
                      class="text-capitalize"
                      :class="index === 0 ? 'font-weight-black' : ''"
                    >
                      {{ item.label }}
                    </span>
                  </v-col>

                  <v-col align-self="center">
                    <v-skeleton-loader
                      :loading="loading"
                      class="w-100 d-flex justify-end"
                      type="text"
                    >
                      <span
                        class="font-weight-light"
                        :class="item.color()"
                      >
                        {{ item.value() }}
                      </span>
                    </v-skeleton-loader>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </BaseMaterialCard>
    </v-container>

    <GlobalConfirmEdit
      v-model="showConformEdit"
      title="Excluir Item"
      text="Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
      ok-text="Sim, excluir"
      cancel-text="Cancelar"
      color="error"
      :item="itemMarkedForDeletion"
      @confirm="deleteItem"
      @cancel="itemMarkedForDeletion = {}"
    />

    <IncomeManager
      :show-dialog="showIncome"
      :items-category="itemsCategoryIncome"
      :edit-item="itemMarkedForEdit"
      @update:model-value="($event) => { 
        showIncome = $event
        itemMarkedForEdit = {}
      }"
      @insert:item="eventAfterCreate"
    />

    <ExpenseManager
      :show-dialog="showExpense"
      :items-category="itemsCategoryExpense"
      :edit-item="itemMarkedForEdit"
      @update:model-value="($event) => { 
        showExpense = $event
        itemMarkedForEdit = {}
      }"
      @insert:item="eventAfterCreate"
    />

    <TransferManager
      :show-dialog="showTransfer"
      :edit-item="itemMarkedForEdit"
      @update:model-value="($event) => { 
        showTransfer = $event
        itemMarkedForEdit = {}
      }"
      @insert:item="eventAfterCreate"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import LaunchService from '@/services/LaunchService'
import ExpenseService from '@/services/ExpenseService'
import IncomeService from '@/services/IncomeService'
import TransferService from '@/services/TransferService'
import CategoryService from "@/services/CategoryService"
import AccountService from '@/services/AccountService'
import { headerLaunch } from '@/constants/headers/launch'
import { formatCurrencyMaskBR } from '@/utils/monetary'

import BaseMaterialCard from '@/components/BaseMaterialCard.vue'
import GlobalSelectPeriod from '@/components/GlobalSelectPeriod.vue'
import GlobalConfirmEdit from '@/components/GlobalConfirmEdit.vue'
import ActionSpeedDial from '@/components/ActionSpeedDial.vue'
import IncomeManager from '@/views/manager/launch/manager/IncomeManager.vue'
import ExpenseManager from '@/views/manager/launch/manager/ExpenseManager.vue'
import TransferManager from '@/views/manager/launch/manager/TransferManager.vue'

export default {
  components: {
    BaseMaterialCard,
    IncomeManager,
    ExpenseManager,
    TransferManager,
    GlobalSelectPeriod,
    ActionSpeedDial,
    GlobalConfirmEdit
  },
  data() {
    return {
      fabType: 'despesa',
      actionsType: '',
      currentBalance: 0,
      predicted: 0,
      showIncome: false,
      showExpense: false,
      showTransfer: false,
      showConformEdit: false,
      loading: false,
      openManager: false,
      loadingUpdateStatus: [],
      openAction: [],
      warningToShow: [],
      items: [],
      itemsCategory: [],
      itemsAccount: [],
      itemsCategoryIncome: [],
      itemsCategoryExpense: [],
      itemMarkedForDeletion: {},
      itemMarkedForEdit: {},
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
          color: 'error',
          type: 'despesa'
        },
        {
          icon: 'mdi-bank-transfer',
          text: 'Transferir',
          color: 'primary',
          type: 'transferencia'
        }
      ],
      actionsItem: [
        {
          icon: 'mdi-delete-outline',
          text: 'Deletar',
          color: 'error',
          type: 'delete'
        },
        {
          icon: 'mdi-pencil-outline',
          text: 'Editar',
          color: 'primary',
          type: 'edit'
        }
      ],
      balanceInfos: [
        {
          label: 'Saldo atual:',
          value: () => this.maskedAmount(this.currentBalance),
          color: () => this.getColorValue(this.currentBalance),
        },
        {
          label: 'Saldo previsto:',
          value: () => this.maskedAmount(this.predicted),
          color: () => this.getColorValue(this.predicted),
        }
      ]
    }
  },
  computed: {
    maskedAmount() {
      return value => formatCurrencyMaskBR(value)
    },
    formatCategory() {
      return categoryID => {
        const itensFiltered = this.itemsCategory.find(ob => ob.id === categoryID)
        return itensFiltered?.name
      }
    },
    formatDate() {
      return date => {
        return dayjs(date).format("DD/MM/YYYY")
      }
    },
    formatAccount() {
      return item => {
        if (item.type === 'transfer') {
          const accountsMap = new Map(this.itemsAccount.map(account => [account.id, account.name]))
          return {
            destination: accountsMap.get(item.destination_account),
            origin: accountsMap.get(item.origin_account),
          }
        }

        const accountsMap = new Map(this.itemsAccount.map(account => [account.id, account.name]))
        return accountsMap.get(item.account) || ''
      }
    },
    warningIcons() {
      return this.items.reduce((acc, item) => {
        if (item.status === 1 && this.getWarningDateConciliation(item.date)) {
          this.warningToShow[item.id] = true
          acc[item.id] = 'mdi-circle-medium'
        }
        return acc
      }, {})
    },
    getConfigType() {
      return type => {
        const tooltipMap = {
          income: {
            icon: 'mdi-cash-plus',
            tooltip: 'Receita',
            color: 'success'
          },
          expense: {
            icon: 'mdi-cash-minus',
            tooltip: 'Despesa',
            color: 'error'
          },
          transfer: {
            icon: 'mdi-bank-transfer',
            tooltip: 'Transferencia',
            color: 'primary'
          },
        }

        return tooltipMap[type]
      }
    }
  },
  async created() {
    this.loading = true
    await this.populateCategory()
    await this.populateAccount()
    this.loading = false
  },
  methods: {
    async populateCategory() {
      try {
        this.itemsCategory = await CategoryService.getAll()
        this.itemsCategoryIncome = this.itemsCategory.filter(category => category.type === 'receita')
        this.itemsCategoryExpense = this.itemsCategory.filter(category => category.type === 'despesa')
      } catch {
        this.$showMessage('Ocorreu um problema ao buscar categorias', 'error')
      }
    },
    async populateAccount() {
      try {
        this.itemsAccount = await AccountService.getAll()
      } catch {
        this.$showMessage('Ocorreu um problema ao buscar contas', 'error')
      }
    },
    executeAction(type) {
      if (type === 'receita') this.showIncome = true
      if (type === 'despesa') this.showExpense = true
      if (type === 'transferencia') this.showTransfer = true
    },
    executeActionByItem(type, item) {
      if (type === 'edit') {
        this.itemMarkedForEdit = item
        switch (item.type) {
          case 'income':
            this.showIncome = true
            break
          case 'expense':
            this.showExpense = true
            break
          case 'transfer':
            this.showTransfer = true
            break
        }
      }
      
      if (type === 'delete') {
        this.itemMarkedForDeletion = item
        this.showConformEdit = true
      }
    },
    async deleteItem() {
      const {type, id} = this.itemMarkedForDeletion
      try {
        if (type === "income") {
          await IncomeService.deleteById(id)
        } else if (type === "transfer") {
          await TransferService.deleteById(id)
        } else if (type === "expense") {
          await ExpenseService.deleteById(id)
        }
        
        this.items = this.items.filter(item => item.id !== id)
        await this.financialStatement()
        this.$showMessage('Item excluido com sucesso!', 'success')
      } catch {
        this.$showMessage('Ocorre um problema ao excluir!', 'error')
      } finally {
        this.itemMarkedForDeletion = {}
      }
    },
    async updateStatus(status, item) {
      const oldStatus = item.status
      try {
        this.loadingUpdateStatus[item.id] = true
        item.status = status
        if (item.type === 'income')
          await IncomeService.update(item.id, item)
        else if (item.type === 'expense')
          await ExpenseService.update(item.id, item)
        else if (item.type === 'transfer')
          await TransferService.update(item.id, item)
        this.$showMessage('Status atualizado com sucesso!', 'success')

        await this.financialStatement()
      } catch {
        item.status = oldStatus
        this.$showMessage('Ocorre um problema ao atualizar o status!', 'error')
      } finally {
        this.loadingUpdateStatus[item.id] = false
      }
    },
    async searchByPeriod(period) {
      try {
        this.loading = true
        this.finalPeriod = period.finalPeriod
        this.items = await LaunchService.getAll(period.initialPeriod, period.finalPeriod)
        await this.financialStatement()
      } catch {
        this.$showMessage('Ocorre um problema ao atualizar os lançamentos!', 'error')
      } finally {
        this.loading = false
      }
    },
    async financialStatement() {
      try {
        this.loading = true
        
        const dataBalance = await LaunchService.getBalanceData(this.finalPeriod)
        this.currentBalance = dataBalance.balance
        this.predicted = dataBalance.predicted
      } catch {
        this.$showMessage('Ocorre um problema ao buscar balanço financeiro!', 'error')
      } finally {
        this.loading = false
      }
    },
    getWarningDateConciliation(date) {
      const now = dayjs()
      const dateDayjs = dayjs(date)

      return now.isSameOrAfter(dateDayjs, 'day')
    },
    getCellProps({ item }) {
      if (item.status === 1 && this.getWarningDateConciliation(item.date)) {
        return {
          class: 'bg-warning opacity-70 text-white',
        }
      }

      return {}
    },
    async eventAfterCreate(event) {
      const index = this.items.findIndex(i => i.id === event.id)
      
      if (typeof index === 'number' && index >= 0) {
        this.items[index] = event
      } else {
        this.items.push(event)
      }

      await this.financialStatement()
    },
    getColorValue(val) {
      const value = Number(val)

      if (value > 0) return 'text-success'
      if (value < 0) return 'text-error'
      return 'text-black'
    }
  }
}
</script>

<style scoped>
::v-deep(.v-skeleton-loader__text) {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
</style>