<template>
  <LineChart
    :data="chartData"
    :options="chartOptions"
  />
</template>

<script>
import { Line as LineChart } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'

// Registrar os componentes necessários do Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

export default {
  components: { LineChart },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    chartData() {
      return {
        labels: this.data.labels,
        datasets: [
          {
            ...this.data.datasets[0], 
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: '#388E3C'
          }
        ]
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  }
}
</script>
