<template>
  <v-container
    fluid
    class="mt-5"
  >
    <BaseMaterialCard title="Receita">
      <template #append>
        <BaseMaterialDialog
          v-model="showDialog"
          :configuration-btn="getConfiguration"
        >
          <template #title>
            <span class="d-flex justify-center"> Cadastrar Receita </span>
          </template>

          <template #default>
            <v-form ref="form">
              <v-row>
                <v-col
                  cols="12"
                  md="9"
                >
                  <v-text-field
                    label="Descrição"
                    variant="outlined"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="3"
                >
                  <GlobalDataPiker
                    v-model="dateSelected"
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
                    label="Status"
                    variant="outlined"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-number-input
                    label="Valor"
                    control-variant="hidden"
                    variant="outlined"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-autocomplete
                    label="Status"
                    variant="outlined"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-autocomplete
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
      dateSelected: ''
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
    }
  },
  watch: {
    dateSelected (value) { 
      console.log(value)
    }
  },
}
</script>