<template>
  <div class="d-flex align-center">
    <v-btn
      v-tooltip:top="'Período anterior'"
      icon="mdi-calendar-arrow-left"
      variant="text"
      rounded="circle"
      @click="previousPeriod"
    />

    <v-menu
      v-model="menu"
      transition="slide-y-transition"
      :close-on-content-click="false"
    >
      <template #activator="{ props }">
        <v-btn
          v-tooltip:top="'Selecione o período'"
          v-bind="props"
          color="primary"
          variant="text"
        >
          {{ selectedLabel }}
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.type"
          class="d-flex justify-center"
          @click="selectItem(item)"
        >
          <template v-if="item.type !== 5">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </template>

          <template v-else>
            <v-menu
              v-model="showCustomPicker"
              transition="scale-transition"
              :close-on-content-click="false"
            >
              <template #activator="{ props: nestedProps }">
                <v-list-item-title v-bind="nestedProps">
                  {{ item.title }}
                </v-list-item-title>
              </template>

              <v-card class="d-flex flex-column">
                <v-confirm-edit
                  v-model="customRange"
                  color="primary"
                  @cancel="handleCustomCancel"
                  @save="handleCustomSave"
                >
                  <template #default="{ model: proxyModel, actions }">
                    <v-date-picker
                      v-model="proxyModel.value"
                      color="primary"
                      show-adjacent-months
                      hide-header
                      multiple="range"
                    />
                    <component :is="actions" />
                  </template>
                </v-confirm-edit>
              </v-card>
            </v-menu>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn
      v-tooltip:top="'Próximo período'"
      icon="mdi-calendar-arrow-right"
      variant="text"
      rounded="circle"
      @click="nextPeriod"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'GlobalSelectPeriod',
  emits: ['update:period'],
  data() {
    return {
      menu: false,
      showCustomPicker: false,
      items: [
        { title: 'Hoje', type: 1, flag: 'day' },
        { title: 'Esta semana', type: 2, flag: 'week' },
        { title: 'Este mês', type: 3, flag: 'month' },
        { title: 'Este ano', type: 4, flag: 'year' },
        { title: 'Personalizado', type: 5 }
      ],
      activeItem: null,
      baseCustomRange: [],
      count: 0,
      customRange: [],
    }
  },
  computed: {
    selectedLabel() {
      if (!this.activeItem) return 'Selecione o período'
      if (this.activeItem.type === 5) return this.customLabel
      return this.activeItem.period
    },
    customLabel() {
      if (this.customRange.length < 2) return 'Personalizado'
      // Usa primeiro e último elemento para definir início e fim
      const start = this.customRange[0]
      const end = this.customRange[this.customRange.length - 1]
      return `Personalizado: ${dayjs(start).format('DD/MM/YYYY')} – ${dayjs(end).format('DD/MM/YYYY')}`
    },
  },
  watch: {
    customRange(newRange) {
      if (newRange.length >= 2) {
        this.emitUpdate(newRange[0], newRange[newRange.length - 1])
        this.baseCustomRange = [...newRange]
      }
    }
  },
  mounted() {
    this.selectItem(this.items.find(i => i.type === 3))
  },
  methods: {
    selectItem(item) {
      this.activeItem = item
      this.count = 0
      if (item.type === 5) {
        this.showCustomPicker = true
        return
      }
      this.showCustomPicker = false
      this.calculatePeriod()
      this.menu = false
    },
    calculatePeriod() {
      const flag = this.activeItem.flag
      const start = dayjs().startOf(flag).add(this.count, flag)
      const end = dayjs().endOf(flag).add(this.count, flag)

      this.activeItem.period =
        this.activeItem.type === 1
          ? start.format('DD/MM/YYYY')
          : `${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`

      this.emitUpdate(start, end)
    },
    previousPeriod() {
      if (this.activeItem.type === 5) {
        this.shiftCustom(-1)
      } else {
        this.count--
        this.calculatePeriod()
      }
    },
    nextPeriod() {
      if (this.activeItem.type === 5) {
        this.shiftCustom(1)
      } else {
        this.count++
        this.calculatePeriod()
      }
    },
    shiftCustom(direction) {
      if (!this.baseCustomRange.length) return
      const days = dayjs(this.baseCustomRange[1]).diff(this.baseCustomRange[0], 'day') + 1
      this.customRange = this.baseCustomRange.map(date =>
        dayjs(date).add(direction * days, 'day').toDate()
      )
    },
    handleCustomSave(dates) {
      if (dates.length >= 2) {
        this.customRange = dates
        this.baseCustomRange = [...dates]
        this.activeItem = this.items.find(i => i.type === 5)
        this.emitUpdate(dates[0], dates[dates.length - 1])
      }
      this.showCustomPicker = false
      this.menu = false
    },
    handleCustomCancel() {
      this.customRange = [...this.baseCustomRange]
      this.showCustomPicker = false
    },
    emitUpdate(start, end) {
      this.$emit('update:period', {
        initialPeriod: dayjs(start).format('YYYY-MM-DD'),
        finalPeriod: dayjs(end).format('YYYY-MM-DD')
      })
    }
  }
}
</script>