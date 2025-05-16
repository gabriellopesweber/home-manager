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
        <span class="d-flex justify-center"> {{ isEdit ? 'Editar' : 'Cadastrar' }} Cartão </span>
      </template>

      <template #default>
        <v-row dense>
          <v-col cols="12">
            <v-text-field
              v-model="dataSend.name"
              label="Nome"
              variant="outlined"
              :rules="[() => $validation('required', dataSend.name)]"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="maskedCardLimit"
              label="Limite do cartão"
              prefix="R$"
              variant="outlined"
              :rules="[() => $validation('required', dataSend.card_limit)]"
              @keypress="onlyNumbers"
            />
          </v-col>

          <v-col
            cols="12"
          >
            <v-number-input
              v-model="dataSend.due_date"
              label="Vence dia"
              variant="outlined"
              :rules="[() => $validation('required', dataSend.due_date)]"
            />
          </v-col>

          <v-col cols="12">
            <v-number-input
              v-model="dataSend.closing_date"
              label="Fecha dia"
              variant="outlined"
              :rules="[() => $validation('required', dataSend.closing_date)]"
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
import CardService from "@/services/CardService"

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
    accountId: {
      type: String,
      default: ''
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
      cardLimit: "0,00",
      isEdit: false,
      dataSend: {
        account_id: '',
        name: '',
        card_limit: null,
        due_date: null,
        closing_date: null,
        is_active: false
      }
    }
  },
  computed: {
    maskedCardLimit: {
      get() {
        return this.cardLimit
      },
      set(val) {
        const cleaned = String(val).replace(/\D/g, '')
        let numeric = parseInt(cleaned, 10)
        
        if (isNaN(numeric)) numeric = 0
        
        this.dataSend.card_limit = numeric
        this.cardLimit = formatCurrencyMaskBR(val)
      }
    }
  },
  watch: {
    modelValue(value) {
      this.dialog = value
      if (value) {
        if (Object.keys(this.editItem).length > 0) {
          this.isEdit = true
          this.dataSend = { ...this.editItem }
          this.maskedCardLimit = this.editItem.card_limit
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
            newItem = await CardService.update(this.dataSend.id, this.dataSend)
          } else {
            this.dataSend.account_id = this.accountId
            newItem = await CardService.create(this.dataSend)
          }

          if (!newItem) throw new Error
          
          this.$emit('insert:item', newItem)
          if (this.isEdit) {
            this.$showMessage("Atualizado com sucesso!", "success")
          } else {
            this.$showMessage("Cadastrado com sucesso!", "success")
          }
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
      this.cardLimit = "0,00"
      this.dataSend = {
        account_id: '',
        name: '',
        card_limit: null,
        due_date: null,
        closing_date: null,
        is_active: false
      }
    }
  }
}
</script>