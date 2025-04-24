<template>
  <BaseMaterialDialog
    v-model="internalShowDialog"
    width="400"
    :title="title"
    :show-close-btn="false"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #default>
      <span>{{ text }}</span>
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
          <component :is="actions" />
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
      default: 'Deseja realmente continuar com esta ação?',
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