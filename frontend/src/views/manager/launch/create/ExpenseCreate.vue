<template>
  <BaseMaterialDialog
    v-model="dialog"
    max-width="1200"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #title>
      <span class="d-flex justify-center"> {{ isEdit ? 'Editar' : 'Cadastrar' }} Despesa </span>
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
              v-model="dataSend.description"
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
              v-model="dataSend.date"
              :configuration-btn="{ 
                color: 'primary',
                prependIcon: 'mdi-calendar',
                size: 'large'
              }"
              @update:model-value="afterUpdateDate"
            />
          </v-col>

          <v-col
            class="d-flex"
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="maskedAmount"
              label="Valor"
              prefix="R$"
              variant="outlined"
              :rules="[() => $validation('required', dataSend.value)]"
              @keypress="onlyNumbers"
            />

            <div class="ml-2">
              <v-fade-transition leave-absolute>
                <v-btn
                  v-if="!dataSend.status"
                  v-tooltip:top="'Alterar para pendente'"
                  icon="mdi-thumb-up"
                  color="success"
                  variant="text"
                  rounded="circle"
                  @click="dataSend.status = 1"
                />

                <v-btn
                  v-else
                  v-tooltip:top="'Alterar para pagamento efetuado'"
                  icon="mdi-thumb-down"
                  variant="text"
                  rounded="circle"
                  @click="dataSend.status = 0"
                />
              </v-fade-transition>
            </div>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-autocomplete
              v-model="dataSend.category"
              label="Categoria"
              item-value="id"
              item-title="name"
              variant="outlined"
              :rules="[() => $validation('required', dataSend.category)]"
              :items="itemsCategory"
              :loading-items="loadingItems"
            />
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-autocomplete
              v-model="dataSend.account"
              label="Conta"
              item-value="id"
              item-title="name"
              variant="outlined"
              :rules="[() => $validation('required', dataSend.account)]"
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
            v-if="!isEdit"
            direction="left center"
            transition="slide-y-transition"
            default-tooltip-location="top"
            open-on-hover
            :curenty-type="fabType"
            :modal-is-open="dialog"
            :default-icon="actions[0].icon"
            :actions="actions"
            :loading="loading"
            @action="executeAction(fabType)"
            @update:curenty-type="fabType = $event"
          />

          <v-btn
            v-else 
            v-tooltip:top="'Salvar'"
            icon="mdi-check"
            class="bg-success"
            rounded="circle"
            :loading="loading"
            @click="validateAndUpdate"
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
import ActionSpeedDial from '@/components/ActionSpeedDial.vue'
import dayjs from 'dayjs'

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
      default: () => ([])
    },
    editItem: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:model-value', 'insert:item'],
  data () {
    return {
      dialog: false,
      loading: false,
      loadingItems: false,
      isValid: false,
      amount: "0,00",
      type: 'expense',
      isEdit: false,
      dataSend: {
        description: '',
        date: '',
        status: null,
        value: 0,
        category: null,
        account: null
      },
      itemsAccount: [],
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
        
        this.dataSend.value = numeric
        this.amount = formatCurrencyMaskBR(val)
      }
    }
  },
  watch: {
    showDialog(value) {
      this.dialog = value
      if (value) {
        if (Object.keys(this.editItem).length > 0) {
          this.isEdit = true
          this.dataSend = {...this.editItem}
          this.maskedAmount = -this.editItem.value
        }
        this.populateItems()
      } else {
        this.isEdit = false
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
    async validateAndCreate() {
      if (this.validate()) {
        if (await this.createExpense()) {
          this.$emit('update:model-value', false)
        }
      }
    },
    validate() {
      this.$refs.form.validate()

      if (!this.dataSend.date) {
        this.$showMessage("Informe uma data!", "warning") 
        return false
      }
     
      return this.isValid
    },
    async validateAndUpdate() {
      if (this.validate()) {
        try {
          this.loading = true

          if (this.dataSend.value > 0) this.dataSend.value = -this.dataSend.value

          const newItem = await ExpenseService.update(this.dataSend.id, this.dataSend)
          newItem.type = this.type

          this.$emit('insert:item', newItem)
          this.$showMessage("Atualizado com sucesso!", "success")
          this.$emit('update:model-value', false)
        } catch {
          this.$showMessage("Ocorreu um erro ao atualizar a despesa!", "error")
          return false
        } finally {
          this.loading = false
        }

        return true
      }
    },
    async createExpense() {
      try {
        this.loading = true

        if (this.dataSend.value > 0) this.dataSend.value = -this.dataSend.value

        const newItem = await ExpenseService.create(this.dataSend)
        newItem.type = this.type
        this.$emit('insert:item', newItem)
        this.$showMessage("Cadastro efetuado!", "success")
      } catch {
        this.$showMessage("Ocorreu um erro ao cadastrar Receita!", "error")
        return false
      } finally {
        this.loading = false
      }

      return true
    },
    clearForm() {
      this.amount = "0,00"
      this.dataSend = {
        description: '',
        date: '',
        status: null,
        value: 0,
        category: null,
        account: null
      }
    },
    afterUpdateDate(date) {
      if (!date) return false

      if (dayjs().isBefore(dayjs(date))) {
        this.dataSend.status = 1
      }

      if (dayjs().isSameOrAfter(dayjs(date))) {
        this.dataSend.status = 0
      }
    }
  }
}
</script>