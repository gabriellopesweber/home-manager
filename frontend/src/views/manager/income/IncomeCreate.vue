<template>
  <BaseMaterialDialog
    v-model="dialog"
    max-width="1200"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #title>
      <span class="d-flex justify-center"> Cadastrar Receita </span>
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
              v-model="incomeData.description"
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
              v-model="incomeData.date"
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
              v-model="incomeData.status"
              label="Status"
              variant="outlined"
              :items="itemsStatus"
              :rules="[() => $validation('required', incomeData.status)]"
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
              :rules="[() => $validation('required', incomeData.value)]"
              @keypress="onlyNumbers"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-autocomplete
              v-model="incomeData.category"
              label="Categoria"
              item-value="_id"
              item-title="name"
              variant="outlined"
              :rules="[() => $validation('required', incomeData.category)]"
              :items="itemsCategory"
              :loading-items="loadingItems"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-autocomplete
              v-model="incomeData.account"
              label="Conta"
              item-value="_id"
              item-title="name"
              variant="outlined"
              :rules="[() => $validation('required', incomeData.account)]"
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
          class="ml-6"
          @click="clearForm"
        >
          Limpar
        </v-btn>

        <div class="mr-6">
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
import IncomeService from "@/services/IncomeService"

import BaseMaterialDialog from '@/components/BaseMaterialDialog.vue'
import GlobalDataPiker from '@/components/GlobalDataPiker.vue'
import ActionSpeedDial from '../../../components/ActionSpeedDial.vue'

export default {
  name: "IncomeCreate",
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
  emits: ['update:model-value'],
  data () {
    return {
      dialog: false,
      loadingItems: false,
      loadingCreate: false,
      isValid: false,
      amount: "0,00",
      incomeData: {
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
        { value: 1, title: 'Pendente' },
        { value: 2, title: 'Cancelado' }
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
        
        this.incomeData.value = numeric
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
          await this.createIncome()
        }
      }
    },
    async validateAndCreate(){
      if (this.validate()) {
        if (await this.createIncome()) {
          this.$emit('update:model-value', false)
        }
      }
    },
    validate() {
      this.$refs.form.validate()
      return this.isValid
    },
    async createIncome() {
      try {
        this.loadingCreate = true

        await IncomeService.create(this.incomeData)

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
      this.incomeData = {
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