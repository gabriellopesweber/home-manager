import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/authStore"
import DashboardIndex from '@/views/DashboardIndex.vue'
import LoginView from "@/views/auth/LoginView.vue"
import RegisterView from "@/views/auth/RegisterView.vue"
import ReportRevenueIndex from '@/views/report/ReportRevenueIndex.vue'
import ReportExpenseIndex from '@/views/report/ReportExpenseIndex.vue'

const routes = [
  {
    path: '/login',
    name: "login",
    component: LoginView
  },
  {
    path: '/register',
    name: "register",
    component: RegisterView
  },
  {
    path: '/',
    name: "dashboard",
    component: DashboardIndex,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/relatorio/receitas',
    name: "relatorio.receitas",
    component: ReportRevenueIndex,
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
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login")
  } else {
    next()
  }
})

export default router
