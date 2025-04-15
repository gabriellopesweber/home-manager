<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    max-width="290px"
    min-width="auto"
  >
    <template #activator="{ props: activation }">
      <v-btn
        v-bind="{ ...configurationBtn, ...activation }"
      >
        {{ selectedDate ? formatDate(selectedDate) : 'Selecione a data' }}
      </v-btn>
    </template>

    <v-date-picker
      v-model="selectedDate"
      show-adjacent-months
      @update:model-value="updateDate"
    />
  </v-menu>
</template>

<script>
import dayjs from 'dayjs'
import { useDate } from 'vuetify'

export default {
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    configurationBtn: {
      type: Object,
      default: () => ({
        color: 'primary'
      })
    }
  },
  emits: ['update:model-value'],
  data() {
    return {
      menu: false,
      selectedDate: this.modelValue,
      formatUtil: useDate()
    }
  },
  watch: {
    modelValue(newVal) {
      this.selectedDate = newVal
    }
  },
  methods: {
    updateDate(value) {
      this.selectedDate = value
      this.$emit('update:model-value', dayjs(value).toISOString())
      this.menu = false
    },
    formatDate(date) {
      if (!date) return ''
      return this.formatUtil.format(date, 'fullDate')
    }
  }
}
</script>
