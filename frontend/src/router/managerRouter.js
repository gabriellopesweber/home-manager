import AccountIndex from '@/views/manager/account/AccountIndex.vue'
import LaunchIndex from '@/views/manager/launch/LaunchIndex.vue'
import UserManagerIndex from '@/views/manager/user/UserManagerIndex.vue'

const managerRouter = [{
  path: '/gerenciamento/lancamentos',
  name: "manager.launch",
  component: LaunchIndex,
  meta: {
    requiresAuth: true
  }
}, {
  path: '/gerenciamento/contas',
  name: "manager.account",
  component: AccountIndex,
  meta: {
    requiresAuth: true
  }
}, {
  path: '/gerenciamento/usuarios',
  name: "manager.user",
  component: UserManagerIndex,
  meta: {
    requiresAuth: true
  }
}]

export { managerRouter }