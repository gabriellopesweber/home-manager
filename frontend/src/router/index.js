import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/authStore"
import { authRouter } from '@/router/authRouter'
import { dashboardRouter } from '@/router/dashboardRouter'
import { reportRouter } from '@/router/reportRouter'
import { managerRouter } from '@/router/managerRouter'

const routes = [
  ...authRouter,
  ...dashboardRouter,
  ...reportRouter,
  ...managerRouter,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
