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
            <v-form ref="form">
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
                    variant="outlined"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-autocomplete
                    v-model="incomeData.account"
                    label="Conta"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
            </v-form>
          </template>

          <template #actions>
            <div class="d-flex justify-space-between w-100 mb-2">
              <v-btn class="ml-6">
                Limpar
              </v-btn>
              <v-btn
                class="mr-6"
                type="submit"
                color="primary"
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
import { formatCurrencyMaskBR } from '../../../utils/monetary'

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
      incomeData: {
        description: '',
        dateSelected: '',
        status: null,
        value: 0,
        category: null,
        account: null
      }
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
  methods: {
    onlyNumbers(e) {
      const allowed = /[0-9]/
      if (!allowed.test(e.key)) e.preventDefault()
    },
    updateDate(e) {
      console.log(e)
    }
  }
}
</script>