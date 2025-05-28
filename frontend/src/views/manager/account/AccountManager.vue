<template>
  <v-form
    ref="form"
    v-model="isValid"
    class="w-100" 
  >
    <BaseMaterialDialog
      v-model="dialog"
      max-width="600"
      @update:model-value="$emit('update:model-value', $event)"
    >
      <template #title>
        <span class="d-flex justify-center"> {{ isEdit ? 'Editar' : 'Cadastrar' }} Conta </span>
      </template>

      <template #default>
        <v-row dense>
          <v-col
            cols="12"
          >
            <v-text-field
              v-model="dataSend.name"
              label="Nome"
              variant="outlined"
              :rules="[() => $validation('required', dataSend.name)]"
            />
          </v-col>
          <v-col
            cols="12"
          >
            <v-text-field
              v-model="maskedAmount"
              label="Saldo"
              prefix="R$"
              variant="outlined"
              :rules="[() => $validation('required', dataSend.balance)]"
              @keypress="onlyNumbers"
            />
          </v-col>
        </v-row>
      </template>

      <template #actions>
        <div class="d-flex justify-center w-100">
          <v-btn
            v-tooltip:top="'Salvar'"
            class="mr-4 bg-success"
            icon="mdi-check"
            rounded="circle"
            size="large"
            :loading="loading"
            @click="validateAndManager"
          />
        </div>
      </template>
    </BaseMaterialDialog>
  </v-form>
</template>

<script>
import { formatCurrencyMaskBR } from '@/utils/monetary'
import AccountService from "@/services/AccountService"

import BaseMaterialDialog from '@/components/BaseMaterialDialog.vue'

export default {
  components: {
    BaseMaterialDialog,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: true
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
      isValid: false,
      amount: "0,00",
      isEdit: false,
      dataSend: {
        name: '',
        balance: 0
      }
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
        
        this.dataSend.balance = numeric
        this.amount = formatCurrencyMaskBR(val)
      }
    }
  },
  watch: {
    modelValue(value) {
      this.dialog = value
      if (value) {
        if (Object.keys(this.editItem).length > 0) {
          this.isEdit = true
          this.dataSend = {...this.editItem}
          this.maskedAmount = this.editItem.balance
        }
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
    validate() {
      this.$refs.form.validate()
      return this.isValid
    },
    async validateAndManager() {
      if (this.validate()) {
        try {
          this.loading = true
          let newItem = null

          if (this.isEdit) {
            newItem = await AccountService.update(this.dataSend.id, this.dataSend)
          } else {
            newItem = await AccountService.create(this.dataSend)
          }

          if (!newItem) throw new Error
          
          this.$emit('insert:item', newItem)
          this.$showMessage("Atualizado com sucesso!", "success")
          this.$emit('update:model-value', false)
        } catch {
          this.$showMessage("Ocorreu um erro ao atualizar a receita!", "error")
          return false
        } finally {
          this.loading = false
        }

        return true
      }
    },
    clearForm() {
      this.amount = "0,00"
      this.dataSend = {
        name: '',
        balance: 0,
      }
    }
  }
}
</script>