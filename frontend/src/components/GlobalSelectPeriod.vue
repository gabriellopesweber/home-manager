<template>
  <div class="d-flex align-center">
    <v-btn
      v-tooltip:top="'Período anterior'"
      icon="mdi-calendar-arrow-left"
      variant="text"
      rounded="cincle"
      @click="previousPeriod"
    />

    <v-menu
      v-model="menu"
      transition="slide-y-transition"
    >
      <template #activator="{ props }">
        <v-btn
          v-tooltip:top="'Selecione o período'"
          v-bind="props"
          color="primary"
          variant="text"
        >
          {{ selectedItem ? selectedItem.period : 'Selecione o período' }}
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="selectItem(item)"
        >
          <template v-if="item.type !== 5">
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </template>

          <template v-else>
            <v-menu
              v-model="showSelectPeriod"
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
                  v-model="editingDates"
                  color="primary"
                  @cancel="cancelAction"
                  @save="confirmAction"
                >
                  <template #default="{ model: proxyModel, actions }">
                    <v-date-picker
                      v-model="proxyModel.value"
                      class="d-flex justify-center"
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
      rounded="cincle"
      @click="nextPeriod"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  emits: ['update:period'],
  data() {
    return {
      menu: false, 
      showSelectPeriod: false, 
      selectedItem: null,
      baseSelectedDates: [],
      selectedDates: [],
      editingDates: [],
      initialPeriod: null,
      finalPeriod: null,
      flag: 'month',
      count: 0,
      typeActive: 3,
      items: [
        { title: "Hoje", type: 1 },
        { title: "Esta semana", type: 2 },
        { title: "Este mês", type: 3 },
        { title: "Este ano", type: 4 },
        { title: "Personalizado", type: 5 }
      ]
    }
  },
  mounted() {
    this.editingDates = [...this.selectedDates],
    this.selectItem({type: 3})
  },
  methods: {
    selectItem(item) {
      this.typeActive = item.type
      switch (item.type) {
        case 1: 
          this.flag = 'day'
          break
        case 2: 
          this.flag = 'week'
          break
        case 3: 
          this.flag = 'month'
          break
        case 4: 
          this.flag = 'year'
          break
        case 5:
          this.showSelectPeriod = true
          break
      }
  
      if (item.type >= 1 && item.type <= 4) {
        this.initialPeriod = dayjs().startOf(this.flag).format('DD/MM/YYYY')
        this.finalPeriod = dayjs().endOf(this.flag).format('DD/MM/YYYY')

        if (this.typeActive === 1 ) {
          item.period = this.initialPeriod
        } else {
          item.period = `${this.initialPeriod} - ${this.finalPeriod}`
        }

        this.$emit('update:period', { 
          initialPeriod: dayjs(this.initialPeriod, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          finalPeriod: dayjs(this.finalPeriod, 'DD/MM/YYYY').format('YYYY-MM-DD')
        })

        this.selectedItem = item
        this.menu = false
      }
    },
    confirmAction() {
      this.selectedDates = [...this.editingDates]

      const initial = this.selectedDates[0]
      const final = this.selectedDates[this.selectedDates.length - 1]

      this.selectedItem = {
        period: `Personalizado (${dayjs(initial).format('DD/MM/YYYY')} – ${dayjs(final).format('DD/MM/YYYY')})`,
        type: 5
      }
      this.baseSelectedDates = []

      this.$emit('update:period', {
        initialPeriod: dayjs(initial).format('YYYY-MM-DD'),
        finalPeriod:   dayjs(final).format('YYYY-MM-DD')
      })

      this.showSelectPeriod = false
      this.menu = false
    },
    cancelAction() {
      this.editingDates = [...this.selectedDates]
    },
    previousPeriod() {
      this.count--
      this.handlerDate()
    },
    nextPeriod() {
      this.count++
      this.handlerDate()
    },
    handlerDate() {
      let start, end = null

      if (this.typeActive === 5 && !this.baseSelectedDates) {
        this.baseSelectedDates = [...this.selectedDates]
      }

      switch (this.typeActive) {
        case 1:
          this.initialPeriod = dayjs().startOf(this.flag).add(this.count, this.flag).format('DD/MM/YYYY')
          this.finalPeriod = dayjs().endOf(this.flag).add(this.count, this.flag).format('DD/MM/YYYY')
          this.selectedItem = { period: this.initialPeriod }
          break
        case 5:
          start = dayjs(this.baseSelectedDates[0]).add(this.count, 'day')
          end = dayjs(this.baseSelectedDates[this.baseSelectedDates.length - 1]).add(this.count, 'day')

          this.initialPeriod = start.format('DD/MM/YYYY')
          this.finalPeriod = end.format('DD/MM/YYYY')
          this.selectedItem = { period: `Personalizado (${this.initialPeriod} - ${this.finalPeriod})` }
          break
        default:
          this.initialPeriod = dayjs().startOf(this.flag).add(this.count, this.flag).format('DD/MM/YYYY')
          this.finalPeriod = dayjs().endOf(this.flag).add(this.count, this.flag).format('DD/MM/YYYY')
          this.selectedItem = { period: `${this.initialPeriod} - ${this.finalPeriod}` }
      }

      this.$emit('update:period', { 
        initialPeriod: dayjs(this.initialPeriod, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        finalPeriod: dayjs(this.finalPeriod, 'DD/MM/YYYY').format('YYYY-MM-DD')
      })
    }
  }
}
</script>