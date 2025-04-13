<template>
  <v-dialog
    v-model="showDialog"
    rounded="xl"
  >
    <template #activator="{ props: activation }">
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
          #append
        >
          <v-btn
            icon="mdi-close"
            rounded="circule"
            size="small"
            variant="text"
            @click="showDialog = false"
          />
        </template>

        <v-card-text class="pb-0">
          <slot name="default" />
        </v-card-text>

        <template
          v-if="$slots.actions"
          #actions
        >
          <slot name="actions" />
        </template>
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