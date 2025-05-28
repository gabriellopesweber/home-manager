<template>
  <BaseMaterialDialog
    v-model="internalShowDialog"
    width="500"
    :show-close-btn="false"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template 
      v-if="title"
      #title
    >
      <span class="d-flex justify-center">{{ title }}</span>
    </template>

    <template 
      v-if="text"
      #default
    >
      <span>{{ text }}</span>
    </template>

    <template 
      v-else-if="$slots.default"
      #default
    >
      <slot name="default" />
    </template>

    <template #actions>
      <v-confirm-edit
        v-model="proxyModel"
        :ok-text="okText"
        :cancel-text="cancelText"
        :color="color"
        :disabled="false"
        @cancel="cancelAction"
        @save="confirmAction"
      >
        <!-- eslint-disable-next-line vue/no-unused-vars -->
        <template #default="{ model: _, actions }">
          <div class="d-flex justify-space-between w-100">
            <component :is="actions" />
          </div>
        </template>
      </v-confirm-edit>
    </template>
  </BaseMaterialDialog>
</template>

<script>
import BaseMaterialDialog from "@/components/BaseMaterialDialog.vue"

export default {
  name: 'ConfirmDialog',
  components: {
    BaseMaterialDialog
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Confirmar ação',
    },
    text: {
      type: String,
      default: '',
    },
    okText: {
      type: String,
      default: 'Confirmar',
    },
    cancelText: {
      type: String,
      default: 'Cancelar',
    },
    color: {
      type: String,
      default: 'primary',
    }
  },
  emits: ['update:model-value', 'confirm', 'cancel'],
  data() {
    return {
      internalShowDialog: this.modelValue,
      proxyModel: null,
    }
  },
  watch: {
    modelValue(val) {
      this.internalShowDialog = val
    },
    internalShowDialog(val) {
      this.$emit('update:model-value', val)
    }
  },
  methods: {
    confirmAction() {
      this.$emit('confirm')
      this.internalShowDialog = false
    },
    cancelAction() {
      this.$emit('cancel')
      this.internalShowDialog = false
    }
  }
}
</script>