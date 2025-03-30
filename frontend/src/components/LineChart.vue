<template>
  <LineChart
    :data="chartData"
    :options="chartOptions"
  />
</template>

<script>
import { Line as LineChart } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import { formatCurrencyBR } from '@/utils/monetary.js'

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
        datasets: this.data.datasets.map((dataset, index) => ({
          ...dataset,
          borderColor: ['#4CAF50', '#FF5252', '#42A5F5'][index] || '#000000',
          backgroundColor: ['rgba(76, 175, 80, 0.2)', 'rgba(255, 82, 82, 0.2)', 'rgba(66, 165, 245, 0.2)'][index] 
            || 'rgba(0,0,0,0.2)',
          borderWidth: 2,
          pointBackgroundColor: ['#388E3C', '#D32F2F', '#1976D2'][index] || '#000000'
        }))
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                let value = tooltipItem.raw
                return formatCurrencyBR(value)
              }
            }
          }
        }
      }
    }
  }
}
</script>
