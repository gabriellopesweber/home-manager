import ReportIncomeIndex from '@/views/report/ReportIncomeIndex.vue'
import ReportExpenseIndex from '@/views/report/ReportExpenseIndex.vue'

const reportRouter = [
  {
    path: '/relatorio/receitas',
    name: "relatorio.receitas",
    component: ReportIncomeIndex,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/relatorio/saidas',
    name: "relatorio.saidas",
    component: ReportExpenseIndex,
    meta: {
      requiresAuth: true
    }
  },
]

export { reportRouter }