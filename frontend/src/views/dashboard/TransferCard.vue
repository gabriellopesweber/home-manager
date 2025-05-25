<template>
  <v-col
    v-if="transferPredicted && transferConciliated"
    cols="12"
    md="4"
  >
    <v-card
      class="pa-4 h-100"
      border
      rounded="xl"
    >
      <v-card-title class="justify-center">
        Transferências
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <!-- Entrada -->
          <v-col
            cols="12"
            class="d-flex justify-space-between"
          >
            <span class="text-body-1">Entrada Atual</span>
            <span class="text-primary">
              <v-icon
                icon="mdi-menu-up"
                color="success"
                class="mr-1"
              />
              {{ formatMoney(transferConciliated?.transfer?.in) }}
            </span>
          </v-col>
          <v-col
            cols="12"
            class="d-flex justify-space-between"
          >
            <span class="text-body-1">Entrada Prevista</span>
            <span class="text-primary">
              <v-icon
                icon="mdi-menu-up"
                color="success"
                class="mr-1"
              />
              {{ formatMoney(transferPredicted?.transfer?.in) }}
            </span>
          </v-col>

          <!-- Saída -->
          <v-col
            cols="12"
            class="d-flex justify-space-between"
          >
            <span class="text-body-1">Saída Atual</span>
            <span class="text-primary">
              <v-icon
                icon="mdi-menu-down"
                color="error"
                class="mr-1"
              />
              {{ formatMoney(transferConciliated?.transfer?.out) }}
            </span>
          </v-col>
          <v-col
            cols="12"
            class="d-flex justify-space-between"
          >
            <span class="text-body-1">Saída Prevista</span>
            <span class="text-primary">
              <v-icon
                icon="mdi-menu-down"
                color="error"
                class="mr-1"
              />
              {{ formatMoney(transferPredicted?.transfer?.out) }}
            </span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import { formatCurrencyMaskBR } from '@/utils/monetary.js'

export default {
  props: {
    transferConciliated: {
      type: Object,
      default: () => ({})
    },
    transferPredicted: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    formatMoney() {
      return value => formatCurrencyMaskBR(value)
    }
  }
}
</script>
