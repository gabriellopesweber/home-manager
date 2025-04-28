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
            direction="left center"
            default-tooltip-location="top"
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
          :items-per-page="String(items.length)"
          hide-default-footer
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
              v-tooltip:top="'Alterar para conciliado'"
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
      @update:model-value="showIncome = $event"
      @insert:item="items.push($event)"
    />

    <ExpenseCreate
      :show-dialog="showExpense"
      :items-category="itemsCategoryExpense"
      @update:model-value="showExpense = $event"
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
import { headerLaunch } from '@/constants/headers/launch'
import { formatCurrencyMaskBR } from '@/utils/monetary'

import BaseMaterialCard from '@/components/BaseMaterialCard.vue'
import IncomeCreate from '@/views/manager/launch/IncomeCreate.vue'
import GlobalSelectPeriod from '@/components/GlobalSelectPeriod.vue'
import GlobalConfirmEdit from '@/components/GlobalConfirmEdit.vue'
import ActionSpeedDial from '@/components/ActionSpeedDial.vue'
import AccountService from '@/services/AccountService'
import ExpenseCreate from '@/views/manager/launch/ExpenseCreate.vue'

export default {
  name: "IncomeIndex",
  components: {
    BaseMaterialCard,
    IncomeCreate,
    ExpenseCreate,
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
      loadingUpdateStatus: [],
      items: [],
      itemsCategory: [],
      itemsAccount: [],
      itemsCategoryIncome: [],
      itemsCategoryExpense: [],
      itemMarkedForDeletion: {},
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
    }
  },
  async created() {
    this.items = await LaunchService.getAll(dayjs().startOf('month').toISOString(), dayjs().endOf('day').toISOString())
    await this.populateCategory()
    await this.populateAccount()
  },
  methods: {
    async populateCategory(){
      this.itemsCategory = await CategoryService.getAll()
      this.itemsCategoryIncome = this.itemsCategory.filter(category => category.type === 'receita')
      this.itemsCategoryExpense = this.itemsCategory.filter(category => category.type === 'despesa')
    },
    async populateAccount(){
      this.itemsAccount = await AccountService.getAll()
    },
    executeAction(type) {
      if (type === 'receita') this.showIncome = true
      if (type === 'despesa') this.showExpense = true
      if (type === 'transferencia') this.showTransfer = true
    },
    executeActionByItem(type, item) {
      if (type === 'edit') console.log('editar') // Ações de edição
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
      }
    },
    async updateStatus(status, item) {
      try {
        this.loadingUpdateStatus[item.id] = true
        item.status = status
        if (item.type === 'income')
          await IncomeService.update(item.id, item)
        else if (item.type === 'expense')
          await ExpenseService.update(item.id, item)
        this.$showMessage('Status atualizado com sucesso!', 'success')
      } catch {
        this.$showMessage('Ocorre um problema ao atualizar o status!', 'error')
      } finally {
        this.loadingUpdateStatus[item.id] = false
      }
    }
  }
}
</script>