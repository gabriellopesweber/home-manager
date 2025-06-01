<template>
  <div :data-cy="`speed-dial-${curentyType}`">
    <v-speed-dial
      :key="localKey"
      v-model="openSpeed"
      :location="direction"
      :transition="transition"
      :open-on-hover="openOnHover"
      data-cy="speed-dial"
    >
      <template #activator="{ props: speedDial }">
        <div v-bind="speedDial">
          <v-tooltip :location="defaultTooltipLocation">
            <template #activator="{ props: tooltip }">
              <v-fab
                v-bind="tooltip"
                rounded="circle"
                :icon="fabIcon"
                :color="colorAction"
                :variant="defaultVariant"
                :aria-label="`Executar ação de ${textAction}`"
                :data-cy="`open-create-${curentyType}`"
                :loading="loading"
                @click="autoUpdateActivator? executeAction(fabIcon): () => ({}) "
              />
            </template>
            <span>{{ textAction }}</span>
          </v-tooltip>
        </div>
      </template>
      <v-btn
        v-for="(action) in availableActions"
        :key="action.type"
        v-tooltip="{
          text: action.text,
          location: defaultTooltipLocation
        }"
        rounded="circle"
        :data-cy="`open-create-${action.type}`"
        :icon="action.icon"
        :color="action.color"
        @click="handleActionClick(action)"
      />
    </v-speed-dial>
  </div>
</template>

<script>
export default {
  name: 'ActionSpeedDial',
  props: {
    direction: {
      type: String,
      default: 'bottom center'
    },
    transition: {
      type: String,
      default: 'scale-transition'
    },
    openOnHover: {
      type: Boolean,
      default: false
    },
    actions: {
      type: Array,
      default: () => []
    },
    defaultIcon: {
      type: String,
      default: 'mdi-cash-plus'
    },
    defaultColor: {
      type: String,
      default: 'success'
    },
    defaultText: {
      type: String,
      default: 'Cadastrar'
    },
    defaultVariant: {
      type: String,
      default: "elevated"
    },
    defaultTooltipLocation: {
      type: String,
      default: 'top'
    },
    curentyType: {
      type: String,
      required: true
    },
    autoUpdateActivator: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  emits: ['action', 'update:curenty-type', 'update:open'],
  data() {
    return {
      fabIcon: this.defaultIcon,
      colorAction: this.defaultColor,
      textAction: this.defaultText,
      localKey: null
    }
  },
  computed: {
    availableActions() {
      if (this.autoUpdateActivator) return this.actions.filter(action => action.type !== this.curentyType)
      
      return this.actions
    },
    openSpeed: {
      get() {
        return this.open
      },
      set(value) {
        this.$emit('update:open', value)
      }
    }
  },
  methods: {
    handleActionClick(action) {
      if (this.autoUpdateActivator) {
        this.fabIcon = action.icon
        this.colorAction = action.color
        this.textAction = action.text
      }
      this.$emit('update:curenty-type', action.type)
      this.executeAction(action.icon)
    },
    executeAction(icon) {
      this.$emit('action', icon)
    }
  }
}
</script>
