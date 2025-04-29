import AccountIndex from '@/views/manager/account/AccountIndex.vue'
import LaunchIndex from '@/views/manager/launch/LaunchIndex.vue'

const managerRouter = [
  {
    path: '/gerenciamento/lancamentos',
    name: "manager.launch",
    component: LaunchIndex,
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