<template>
  <BarChart
    :data="chartData"
    :options="chartOptions"
  />
</template>

<script>
import { Bar as BarChart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { formatCurrencyMaskBR } from '@/utils/monetary.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  components: { BarChart },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    chartData() {
      return {
        labels: this.data.labels,
        datasets: this.data.datasets.map((dataset) => {
          const baseColor = dataset.borderColor || '#000000'

          return {
            ...dataset,
            backgroundColor: baseColor,
            borderRadius: 5,
            barPercentage: 0.9,
            categoryPercentage: 0.8
          }
        })
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          tooltip: {
            backgroundColor: '#1e1e2f',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#ffffff10',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (tooltipItem) => {
                let value = tooltipItem.raw
                return 'R$: ' + formatCurrencyMaskBR(value)
              }
            }
          },
          legend: {
            position: 'bottom',
            labels: {
              color: '#666',
              padding: 20,
              boxWidth: 16,
              font: {
                size: 13,
                family: 'Inter, sans-serif'
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#777',
              font: {
                size: 12
              }
            }
          },
          y: {
            grid: {
              drawBorder: false,
              color: '#eeeeee'
            },
            ticks: {
              color: '#777',
              font: {
                size: 12
              },
              callback: (value) => 'R$ ' + formatCurrencyMaskBR(value)
            }
          }
        }
      }
    }
  },
}
</script>
