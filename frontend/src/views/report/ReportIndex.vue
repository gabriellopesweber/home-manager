<template>
  <v-container
    fluid
    class="mt-5"
  >
    <BaseMaterialCard>
      <template #title>
        <v-row dense>
          <v-col
            cols="12"
            md="3"
            class="d-flex align-center"
          >
            <span> Relatórios </span>
          </v-col>

          <v-col
            cols="12"
            md="6"
            class="d-flex justify-center"
          >
            <GlobalSelectPeriod @update:period="searchByPeriod" />
          </v-col>

          <v-col
            cols="12"
            md="3"
          />
        </v-row>
      </template>

      <v-row
        v-if="!loading"
        dense
      >
        <v-col
          class="d-flex justify-end"
          cols="12"
        >
          <v-checkbox
            v-model="statusMode"
            label="Considerar movimentações não pagas"
            hide-details
            @update:model-value="updateStatus"
          />
        </v-col>
        <v-col>
          <BarChart :data="data" />
        </v-col>
      </v-row>

      <v-data-table
        :items="items"
      />
    </BaseMaterialCard>
  </v-container>
</template>

<script>
import dashboardService from '@/services/dashboardService'

import BaseMaterialCard from '@/components/BaseMaterialCard.vue'
import GlobalSelectPeriod from '@/components/GlobalSelectPeriod.vue'
import BarChart from '@/components/BarChart.vue'

export default {
  components: {
    BaseMaterialCard,
    GlobalSelectPeriod,
    BarChart
  },
  data () {
    return {
      data: [],
      items: [],
      initialDate: null,
      finalDate: null,
      statusMode: true,
      status: null,
      loading: false
    }
  },
  methods: {
    async searchDatasets(status,) {
      try {
        this.loading = true

        if (this.initialDate && this.finalDate) {
          this.data = await dashboardService.getDatasets(status, this.initialDate, this.finalDate)
        }
      } catch {
        this.$showMessage('Ocorre um problema ao buscar dados do grafico!', 'error')
      } finally {
        this.loading = false
      }
    },
    updateStatus(selected) {
      if (!selected) {
        this.status = 0
      } else {
        this.status = null
      }

      this.searchDatasets(this.status)
    },
    searchByPeriod(period) {
      this.initialDate = period.initialPeriod
      this.finalDate = period.finalPeriod
      this.searchDatasets(this.status)
    },
  }
}
</script>