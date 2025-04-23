<template>
  <div>
    <v-speed-dial
      :key="localKey"
      :location="direction"
      :transition="transition"
      :open-on-hover="openOnHover"
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
                :aria-label="`Executar ação de ${textAction}`"
                @click="executeAction(fabIcon)"
              />
            </template>
            <span>{{ textAction }}</span>
          </v-tooltip>
        </div>
      </template>

      <v-btn
        v-for="(action) in availableActions"
        :key="action.type"
        v-tooltip:left="`${action.text}`"
        :icon="action.icon"
        rounded="circle"
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
      default: 'Cadastrar Receita'
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
    }
  },
  emits: ['action', 'update:curenty-type'],
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
      return this.actions.filter(action => action.type !== this.curentyType)
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
