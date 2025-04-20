<template>
  <BaseMaterialDialog
    v-model="dialog"
    max-width="1200"
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
        <v-btn
          class="mr-6"
          type="submit"
          color="primary"
          :loading="loadingCreate"
          @click="validateAndCreate"
        >
          Cadastrar
        </v-btn>
      </div>
    </template>
  </BaseMaterialDialog>
</template>

<script>
import { formatCurrencyMaskBR } from '@/utils/monetary'
import CategoryService from "@/services/CategoryService"
import AccountService from "@/services/AccountService"
import IncomeService from "@/services/IncomeService"

import BaseMaterialDialog from '@/components/BaseMaterialDialog.vue'
import GlobalDataPiker from '@/components/GlobalDataPiker.vue'

export default {
  name: "IncomeCreate",
  components: {
    BaseMaterialDialog,
    GlobalDataPiker
  },
  props: {
    showDialog: {
      type: Boolean,
      required: true
    }
  },
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
      itemsCategory: [],
      itemsAccount: [],
      itemsStatus: [
        { value: 0, title: 'Conciliado' },
        { value: 1, title: 'Pendente' },
        { value: 2, title: 'Cancelado' }
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
        this.itemsCategory = await CategoryService.getAll({type: 'receita'})
        this.itemsAccount = await AccountService.getAll()
      } catch {
        this.$showMessage("Ocorreu um erro ao carregar os items!", "error")
      } finally { 
        this.loadingItems = false
      }
    },
    async validateAndCreate () {
      this.$refs.form.validate()
      if (!this.isValid) return

      try {
        this.loadingCreate = true

        await IncomeService.create(this.incomeData)

      } catch {
        this.$showMessage("Ocorreu um erro ao cadastrar Receita!", "error")
      } finally {
        this.loadingCreate = false
      }
    },
    clearForm () {
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