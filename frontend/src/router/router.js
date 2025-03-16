import { createRouter, createWebHistory } from 'vue-router'
import DashboardIndex from '@/views/DashboardIndex.vue'
import ReportRevenueIndex from '@/views/report/ReportRevenueIndex.vue'
import ReportExpenseIndex from '@/views/report/ReportExpenseIndex.vue'

const routes = [
  { path: '/', name: "dashboard", component: DashboardIndex },
  { path: '/relatorio/receitas', name: "relatorio.receitas", component: ReportRevenueIndex },
  { path: '/relatorio/saidas', name: "relatorio.saidas", component: ReportExpenseIndex },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
