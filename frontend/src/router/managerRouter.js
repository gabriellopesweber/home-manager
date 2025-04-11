import ExpenseIndex from '@/views/manager/expense/ExpenseIndex.vue'
import IncomeIndex from '@/views/manager/Income/IncomeIndex.vue'

const managerRouter = [
  {
    path: '/gerenciamento/receitas',
    name: "manager.income",
    component: IncomeIndex,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/gerenciamento/despesas',
    name: "manager.expense",
    component: ExpenseIndex,
    meta: {
      requiresAuth: true
    }
  }
]

export { managerRouter }