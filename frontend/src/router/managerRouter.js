import ReportRevenueIndex from '@/views/report/ReportRevenueIndex.vue'
import ReportExpenseIndex from '@/views/report/ReportExpenseIndex.vue'

const managerRouter = [
  {
    path: '/gerenciamento/receitas',
    name: "manager.receitas",
    component: ReportRevenueIndex,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/gerenciamento/saidas',
    name: "manager.saidas",
    component: ReportExpenseIndex,
    meta: {
      requiresAuth: true
    }
  }
]

export { managerRouter }