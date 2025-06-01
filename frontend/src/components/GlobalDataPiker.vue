<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    max-width="290px"
    min-width="auto"
  >
    <template #activator="{ props: activation }">
      <v-text-field
        v-bind="activation"
        :model-value="formattedDate"
        :label="label"
        variant="outlined"
        readonly
        clearable
        name="date"
        :rules="rules"
        :error="hasError"
        :error-messages="internalErrorMessages"
        @click:clear="clearDate"
      />
    </template>

    <v-date-picker
      v-model="internalValue"
      show-adjacent-months
      data-cy="date-picker"
      rounded="xl"
      @update:model-value="updateDate"
    />
  </v-menu>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'GlobalDataPiker',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Selecione a data'
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:model-value'],
  data() {
    return {
      menu: false,
      internalValue: this.modelValue,
      hasError: false,
      internalErrorMessages: []
    }
  },
  computed: {
    formattedDate() {
      return this.internalValue
        ? dayjs(this.internalValue).format('DD/MM/YYYY')
        : ''
    }
  },
  watch: {
    modelValue(newVal) {
      this.internalValue = newVal
    }
  },
  methods: {
    updateDate(value) {
      this.internalValue = value
      this.$emit('update:model-value', dayjs(value).toISOString())
      this.menu = false
      this.validate()
    },
    clearDate() {
      this.internalValue = null
      this.$emit('update:model-value', null)
      this.validate()
    },
    validate() {
      this.hasError = false
      this.internalErrorMessages = []

      for (const rule of this.rules) {
        const result = rule(this.internalValue)
        if (result !== true) {
          this.hasError = true
          this.internalErrorMessages.push(result)
        }
      }

      return !this.hasError
    }
  }
}
</script>
