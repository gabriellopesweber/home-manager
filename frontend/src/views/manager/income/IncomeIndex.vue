<template>
  <v-container
    fluid
    class="mt-5"
  >
    <BaseMaterialCard title="Receita">
      <template #append>
        <BaseMaterialDialog
          v-model="showDialog"
          max-width="1200"
          :configuration-btn="getConfiguration"
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
                    v-model="incomeData.dateSelected"
                    :configuration-btn="{ 
                      color: 'primary',
                      prependIcon: 'mdi-calendar',
                      size: 'large'
                    }"
                    :rules="[() => $validation('required', incomeData.dateSelected)]"
                    @update:model-value="updateDate"
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
                    :loading="loading"
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
                    :loading="loading"
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
                @click="validateAndCreate"
              >
                Cadastrar
              </v-btn>
            </div>
          </template>
        </BaseMaterialDialog>
      </template>
    </BaseMaterialCard>
  </v-container>
</template>

<script>
import BaseMaterialCard from '@/components/BaseMaterialCard.vue'
import BaseMaterialDialog from '@/components/BaseMaterialDialog.vue'
import GlobalDataPiker from '@/components/GlobalDataPiker.vue'
import CategoryService from "@/services/CategoryService"
import AccountService from "@/services/AccountService"
import { formatCurrencyMaskBR } from '@/utils/monetary'

export default {
  name: "IncomeIndex",
  components: {
    BaseMaterialCard,
    BaseMaterialDialog,
    GlobalDataPiker
  },
  data () {
    return {
      showDialog: false,
      loading: false,
      isValid: false,
      incomeData: {
        description: '',
        dateSelected: '',
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
    getConfiguration() {
      return {
        icon: "mdi-plus",
        rounded: "circule",
        size: "small",
        color: "success",
        VTooltip: {
          text: "Adicionar",
          location: "left"
        }
      }
    },
    maskedAmount: {
      get() {
        return this.incomeData.value
      },
      set(val) {
        this.incomeData.value = formatCurrencyMaskBR(val)
      }
    }
  },
  watch: {
    showDialog(value) {
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
    updateDate(e) {
      console.log(e)
    },
    async populateItems() {
      try {
        this.loading = true
        this.itemsCategory = await CategoryService.getAll({type: 'receita'})
        this.itemsAccount = await AccountService.getAll()
      } catch {
        this.$showMessage("Ocorreu um erro ao carregar os items!", "error")
      } finally { 
        this.loading = false
      }
    },
    async validateAndCreate () {
      this.$refs.form.validate()
      if (!this.isValid) return
    },
    clearForm () {
      this.incomeData = {
        description: '',
        dateSelected: '',
        status: null,
        value: 0,
        category: null,
        account: null
      }
    }
  }
}
</script>