<template>
  <div>
    <v-container
      fluid
      class="mt-5"
    >
      <BaseMaterialCard>
        <template #title>
          <div class="d-flex justify-space-between my-2">
            <span> Lançamentos </span>

            <GlobalSelectPeriod @update:period="searchByPeriod" />

            <ActionSpeedDial
              direction="left center"
              default-tooltip-location="top"
              open-on-hover
              :actions="actions"
              :curenty-type="fabType"
              @action="executeAction(fabType)"
              @update:curenty-type="fabType = $event"
            />
          </div>
        </template>

        <v-data-table
          :items="items"
          :headers="header"
          :items-per-page="String(items.length)"
          :loading="loading"
          :cell-props="getCellProps"
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
            {{ formatAccount(item.account) }}
          </template>

          <template #item.status="{ item }">
            <v-btn
              v-if="item.status === 0"
              v-tooltip:top="'Alterar para pendente'"
              icon="mdi-thumb-up"
              color="success"
              variant="text"
              rounded="circle"
              :loading="loadingUpdateStatus[item.id]"
              @click="updateStatus(1, item)"
            />
            <v-btn
              v-else-if="item.status === 1"
              v-tooltip:top="'Alterar para pagamento efetuado'"
              icon="mdi-thumb-down"
              variant="text"
              rounded="circle"
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
              open-on-hover
              :auto-update-activator="false"
              :actions="actionsItem"
              :curenty-type="actionsType"
              @action="executeActionByItem(actionsType, item)"
              @update:curenty-type="actionsType = $event"
            />
          </template>

          <template #bottom>
            <v-row dense>
              <v-col
                class="d-flex justify-end px-10 pt-4"
                align-self="center"
                cols="12"
              >
                <span> Saldo atual:  </span>
                <span> $XX </span>
              </v-col>
              <v-col
                class="d-flex justify-end px-10 pb-4"
                align-self="center"
                cols="12"
              >
                <span> Saldo previsto:  </span>
                <span> XX </span>
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

    <IncomeCreate
      :show-dialog="showIncome"
      :items-category="itemsCategoryIncome"
      :edit-item="itemMarkedForEdit"
      @update:model-value="($event) => { 
        showIncome = $event
        itemMarkedForEdit = {}
      }"
      @insert:item="eventAfterCreate"
    />

    <ExpenseCreate
      :show-dialog="showExpense"
      :items-category="itemsCategoryExpense"
      :edit-item="itemMarkedForEdit"
      @update:model-value="($event) => { 
        showExpense = $event
        itemMarkedForEdit = {}
      }"
      @insert:item="eventAfterCreate"
    />

    <TransferCreate
      :show-dialog="showTransfer"
      :items-category="itemsCategoryTransfer"
      @update:model-value="($event) => { 
        showTransfer = $event
        itemMarkedForEdit = {}
      }"
      @insert:item="items.push($event)"
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
import IncomeCreate from '@/views/manager/launch/create/IncomeCreate.vue'
import ExpenseCreate from '@/views/manager/launch/create/ExpenseCreate.vue'
import TransferCreate from '@/views/manager/launch/create/TransferCreate.vue'

export default {
  name: "LaunchIndex",
  components: {
    BaseMaterialCard,
    IncomeCreate,
    ExpenseCreate,
    TransferCreate,
    GlobalSelectPeriod,
    ActionSpeedDial,
    GlobalConfirmEdit
  },
  data () {
    return {
      fabType: 'receita',
      actionsType: 'receita',
      showIncome: false,
      showExpense: false,
      showTransfer: false,
      showConformEdit: false,
      loading: false,
      loadingUpdateStatus: [],
      warningToShow: [],
      items: [],
      itemsCategory: [],
      itemsAccount: [],
      itemsCategoryIncome: [],
      itemsCategoryExpense: [],
      itemsCategoryTransfer: [],
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
          color: 'red',
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
      return accountId => {
        const accountsMap = new Map(this.itemsAccount.map(account => [account.id, account.name]))
        return accountsMap.get(accountId) || ''
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
        this.itemsCategoryTransfer = this.itemsCategory.filter(category => category.type === 'transter')
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
        this.$showMessage('Status atualizado com sucesso!', 'success')
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
        this.items = await LaunchService.getAll(period.initialPeriod, period.finalPeriod)
      } catch {
        this.$showMessage('Ocorre um problema ao atualizar os lançamentos!', 'error')
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
    eventAfterCreate(event) {
      const index = this.items.findIndex(i => i.id === event.id)
      
      if (typeof index === 'number') {
        this.items[index] = event
      } else {
        this.items.push(event)
      }
    }
  }
}
</script>