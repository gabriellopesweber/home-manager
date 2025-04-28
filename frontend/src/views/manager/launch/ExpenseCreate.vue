<template>
  <BaseMaterialDialog
    v-model="dialog"
    max-width="1200"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #title>
      <span class="d-flex justify-center"> Cadastrar Despesa </span>
    </template>

    <template #default>
      <v-form
        ref="form" 
        v-model="isValid"
      >
        <v-row dense>
          <v-col
            cols="12"
            md="9"
          >
            <v-text-field
              v-model="expenseData.description"
              label="Descrição"
              variant="outlined"
            />
          </v-col>

          <v-col
            class="d-flex justify-center"
            cols="12"
            md="3"
          >
            <GlobalDataPiker
              v-model="expenseData.date"
              :configuration-btn="{ 
                color: 'primary',
                prependIcon: 'mdi-calendar',
                size: 'large'
              }"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-autocomplete
              v-model="expenseData.status"
              label="Status"
              variant="outlined"
              :items="itemsStatus"
              :rules="[() => $validation('required', expenseData.status)]"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="maskedAmount"
              label="Valor"
              prefix="R$"
              variant="outlined"
              :rules="[() => $validation('required', expenseData.value)]"
              @keypress="onlyNumbers"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-autocomplete
              v-model="expenseData.category"
              label="Categoria"
              item-value="id"
              item-title="name"
              variant="outlined"
              :rules="[() => $validation('required', expenseData.category)]"
              :items="itemsCategory"
              :loading-items="loadingItems"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-autocomplete
              v-model="expenseData.account"
              label="Conta"
              item-value="id"
              item-title="name"
              variant="outlined"
              :rules="[() => $validation('required', expenseData.account)]"
              :items="itemsAccount"
              :loading-items="loadingItems"
            />
          </v-col>
        </v-row>
      </v-form>
    </template>

    <template #actions>
      <div class="d-flex justify-space-between w-100 mb-2">
        <v-btn
          @click="clearForm"
        >
          Limpar
        </v-btn>

        <div>
          <ActionSpeedDial
            direction="left center"
            transition="slide-y-transition"
            default-tooltip-location="top"
            open-on-hover
            :curenty-type="fabType"
            :modal-is-open="dialog"
            :default-icon="actions[0].icon"
            :actions="actions"
            @action="executeAction(fabType)"
            @update:curenty-type="fabType = $event"
          />
        </div>
      </div>
    </template>
  </BaseMaterialDialog>
</template>

<script>
import { formatCurrencyMaskBR } from '@/utils/monetary'
import AccountService from "@/services/AccountService"
import ExpenseService from "@/services/ExpenseService"

import BaseMaterialDialog from '@/components/BaseMaterialDialog.vue'
import GlobalDataPiker from '@/components/GlobalDataPiker.vue'
import ActionSpeedDial from '../../../components/ActionSpeedDial.vue'

export default {
  name: "ExpenseCreate",
  components: {
    BaseMaterialDialog,
    GlobalDataPiker,
    ActionSpeedDial
  },
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    itemsCategory:{
      type: Array,
      default: () => []
    }
  },
  emits: ['update:model-value', 'insert:item'],
  data () {
    return {
      dialog: false,
      loadingItems: false,
      loadingCreate: false,
      isValid: false,
      amount: "0,00",
      expenseData: {
        description: '',
        date: '',
        status: null,
        value: 0,
        category: null,
        account: null
      },
      itemsAccount: [],
      itemsStatus: [
        { value: 0, title: 'Conciliado' },
        { value: 1, title: 'Pendente' }
      ],
      fabType: 'one',
      actions: [
        {
          icon: 'mdi-plus-circle-outline',
          text: 'Cadastrar',
          color: 'success',
          type: 'one'
        },
        {
          icon: 'mdi-plus-circle-multiple-outline',
          text: 'Cadastrar mais de uma',
          color: 'success',
          type: 'moreOne'
        }
      ]
    }
  },
  computed: {
    maskedAmount: {
      get() {
        return this.amount
      },
      set(val) {
        const cleaned = String(val).replace(/\D/g, '')
        let numeric = parseInt(cleaned, 10)
        
        if (isNaN(numeric)) numeric = 0
        
        this.expenseData.value = numeric
        this.amount = formatCurrencyMaskBR(val)
      }
    }
  },
  watch: {
    showDialog(value) {
      this.dialog = value
      if (value) {
        this.populateItems()
      } else {
        this.clearForm()
      }
    }
  },
  methods: {
    onlyNumbers(e) {
      const allowed = /[0-9]/
      if (!allowed.test(e.key)) e.preventDefault()
    },
    async populateItems() {
      try {
        this.loadingItems = true

        this.itemsAccount = await AccountService.getAll()
      } catch {
        this.$showMessage("Ocorreu um erro ao carregar os items!", "error")
      } finally { 
        this.loadingItems = false
      }
    },
    async executeAction(type) {
      if (type === 'one') await this.validateAndCreate()
      
      if (type === 'moreOne') {
        if (this.validate()) {
          await this.createExpense()
        }
      }
    },
    async validateAndCreate(){
      if (this.validate()) {
        if (await this.createExpense()) {
          this.$emit('update:model-value', false)
        }
      }
    },
    validate() {
      this.$refs.form.validate()

      if (!this.expenseData.date) {
        this.$showMessage("Informe uma data!", "warning") 
        return false
      }
     
      return this.isValid
    },
    async createExpense() {
      try {
        this.loadingCreate = true

        this.expenseData.value = -this.expenseData.value

        const newIncome = await ExpenseService.create(this.expenseData)
        newIncome.type = 'expense'
        this.$emit('insert:item', newIncome)
        this.$showMessage("Cadastro efetuado!", "success")
      } catch {
        this.$showMessage("Ocorreu um erro ao cadastrar Receita!", "error")
        return false
      } finally {
        this.loadingCreate = false
      }

      return true
    },
    clearForm() {
      this.amount = "0,00"
      this.expenseData = {
        description: '',
        date: '',
        status: null,
        value: 0,
        category: null,
        account: null
      }
    }
  }
}
</script>