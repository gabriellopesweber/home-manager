<template>
  <v-dialog
    v-model="showDialog"
    rounded="xl"
  >
    <template 
      v-if="showInternalBtn"
      #activator="{ props: activation }"
    >
      <v-btn 
        v-tooltip="{...configurationBtn['VTooltip'] ? configurationBtn['VTooltip'] : {text: '', disabled: true} }"
        v-bind="{ ...activation, ...configurationBtn }"
      />
    </template>

    <template #default>
      <BaseMaterialCard
        :title="title"
        :subtitle="subtitle"
      >
        <template
          v-if="$slots.title"
          #title
        >
          <slot name="title" />
        </template>

        <template
          v-if="$slots.subtitle"
          #subtitle
        >
          <slot name="subtitle" />
        </template>

        <template
          v-if="$slots.subtitle"
          #item
        >
          <slot name="item" />
        </template>

        <template
          v-if="showCloseBtn"
          #append
        >
          <v-btn
            icon="mdi-close"
            rounded="circule"
            size="small"
            variant="text"
            @click="$emit('update:model-value', false)"
          />
        </template>

        <v-card-text>
          <slot name="default" />
        </v-card-text>

        <v-card-actions
          v-if="$slots.actions"
        >
          <slot name="actions" />
        </v-card-actions>
      </BaseMaterialCard>
    </template>
  </v-dialog>
</template>

<script>
import BaseMaterialCard from '@/components/BaseMaterialCard.vue'

export default {
  components: {
    BaseMaterialCard
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    showInternalBtn: {
      type: Boolean,
      default: false
    },
    showCloseBtn: {
      type: Boolean,
      default: true
    },
    configurationBtn: {
      type: Object,
      default: () => ({
        text: "Abrir",
        color: "primary"
      })
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    }
  },
  emits: ['update:model-value'],
  computed: {
    showDialog: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:model-value', value)
        return value
      }
    }
  }
}
</script>