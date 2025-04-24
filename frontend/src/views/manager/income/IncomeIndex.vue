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

          <template #item.status="{ item }">
            {{ item.status }}
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
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import LaunchService from '../../../services/LaunchService'
import ExpenseService from '../../../services/ExpenseService'
import IncomeService from '../../../services/IncomeService'
import TransferService from '../../../services/TransferService'
import CategoryService from "@/services/CategoryService"
import { headerLaunch } from '../../../constants/headers/launch'
import { formatCurrencyMaskBR } from '@/utils/monetary'

import BaseMaterialCard from '@/components/BaseMaterialCard.vue'
import IncomeCreate from './IncomeCreate.vue'
import GlobalSelectPeriod from '../../../components/GlobalSelectPeriod.vue'
import ActionSpeedDial from '../../../components/ActionSpeedDial.vue'
import GlobalConfirmEdit from '../../../components/GlobalConfirmEdit.vue'

export default {
  name: "IncomeIndex",
  components: {
    BaseMaterialCard,
    IncomeCreate,
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
      items: [],
      itemsCategory: [],
      itemsCategoryIncome: [],
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
        const itensFiltered = this.itemsCategory.find(ob => ob._id === categoryID)
        return itensFiltered?.name
      }
    }
  },
  async created() {
    this.items = await LaunchService.getAll(dayjs().startOf('month').toISOString(), dayjs().endOf('day').toISOString())
    await this.populateCategory()
  },
  methods: {
    async populateCategory(){
      this.itemsCategory = await CategoryService.getAll()
      this.itemsCategoryIncome = this.itemsCategory.filter(category => category.type === 'receita')
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
      const {type, _id: id} = this.itemMarkedForDeletion
      try {
        if (type === "income") {
          await IncomeService.deleteById(id)
        } else if (type === "transfer") {
          await TransferService.deleteById(id)
        } else if (type === "expense") {
          await ExpenseService.deleteById(id)
        }
        
        this.items = this.items.filter(item => item._id !== id)
        this.$showMessage('Item excluido com sucesso!', 'success')
      } catch {
        this.$showMessage('Ocorre um problema ao excluir!', 'error')
      }

    }
  }
}
</script>