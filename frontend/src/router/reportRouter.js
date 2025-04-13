import ReportIncomeIndex from '@/views/report/ReportIncomeIndex.vue'
import ReportExpenseIndex from '@/views/report/ReportExpenseIndex.vue'

const reportRouter = [
  {
    path: '/relatorio/receitas',
    name: "report.income",
    component: ReportIncomeIndex,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/relatorio/saidas',
    name: "report.expense",
    component: ReportExpenseIndex,
    meta: {
      requiresAuth: true
    }
  },
]

export { reportRouter }