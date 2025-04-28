<template>
  <div class="d-flex align-center">
    <v-btn
      icon="mdi-calendar-arrow-left"
      variant="text"
      rounded="cincle"
    />

    <v-menu
      v-model="menu"
      transition="slide-y-transition"
    >
      <template #activator="{ props }">
        <v-btn
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
      icon="mdi-calendar-arrow-right" 
      variant="text"
      rounded="cincle"
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
      selectedDates: [],
      editingDates: [],
      initialPeriod: null,
      finalPeriod: null,
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
    this.editingDates = [...this.selectedDates]
  },
  methods: {
    selectItem(item) {
      switch (item.type) {
        case 1: 
          this.initialPeriod = dayjs().startOf('day').format('DD/MM/YYYY')
          this.finalPeriod = dayjs().startOf('day').format('DD/MM/YYYY')

          item.period = this.initialPeriod
          break
        case 2: 
          this.initialPeriod = dayjs().startOf('week').format('DD/MM/YYYY')
          this.finalPeriod = dayjs().endOf('week').format('DD/MM/YYYY')
          
          item.period = `${this.initialPeriod} - ${this.finalPeriod}`
          break
        case 3: 
          this.initialPeriod = dayjs().startOf('month').format('DD/MM/YYYY')
          this.finalPeriod = dayjs().endOf('month').format('DD/MM/YYYY')
          
          item.period = `${this.initialPeriod} - ${this.finalPeriod}`
          break
        case 4: 
          this.initialPeriod = dayjs().startOf('year').format('DD/MM/YYYY')
          this.finalPeriod = dayjs().endOf('year').format('DD/MM/YYYY')
          
          item.period = `${this.initialPeriod} - ${this.finalPeriod}`
          break
        case 5:
          this.showSelectPeriod = true
          break
      }
  
      if (item.type !== 5) {
        
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

      this.$emit('update:period', {
        initialPeriod: dayjs(initial).format('YYYY-MM-DD'),
        finalPeriod:   dayjs(final).format('YYYY-MM-DD')
      })

      this.showSelectPeriod = false
      this.menu = false
    },
    cancelAction() {
      this.editingDates = [...this.selectedDates]
    }
  }
}
</script>