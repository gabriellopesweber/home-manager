import AccountIndex from '@/views/manager/account/AccountIndex.vue'
import IncomeIndex from '@/views/manager/launch/IncomeIndex.vue'

const managerRouter = [
  {
    path: '/gerenciamento/lancamentos',
    name: "manager.launch",
    component: IncomeIndex,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/gerenciamento/contas',
    name: "manager.account",
    component: AccountIndex,
    meta: {
      requiresAuth: true
    }
  }
]

export { managerRouter }