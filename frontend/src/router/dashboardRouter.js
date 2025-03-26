import DashboardIndex from '@/views/DashboardIndex.vue'

const dashboardRouter = [
  {
    path: '/',
    name: "dashboard",
    component: DashboardIndex,
    meta: {
      requiresAuth: true
    }
  }
]

export { dashboardRouter }