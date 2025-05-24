<template>
  <v-col
    cols="12"
    md="4"
  >
    <v-card
      class="pa-4 h-100"
      border
      rounded="xl"
    >
      <v-card-title class="justify-center">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="6"
            class="text-right text-body-1"
          >
            Atual:
          </v-col>
          <v-col
            cols="6"
            class="text-left"
          >
            <v-icon
              :icon="icon"
              :color="color"
              class="mr-1"
            />
            <span :class="'text-' + color">{{ formatMoney(actual) }}</span>
          </v-col>

          <v-col
            cols="6"
            class="text-right text-body-1"
          >
            Previsto:
          </v-col>
          <v-col
            cols="6"
            class="text-left"
          >
            <v-icon
              :icon="icon"
              :color="color"
              class="mr-1"
            />
            <span :class="'text-' + color">{{ formatMoney(predicted) }}</span>
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
    title: {
      type: String,
      required: true
    },
    actual: {
      type: Number,
      required: true
    },
    predicted: {
      type: Number,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
  },
  computed: {
    formatMoney() {
      return value => formatCurrencyMaskBR(value)
    }
  },
}
</script>