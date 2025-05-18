import DashboardIndex from '@/views/dashboard/DashboardIndex.vue'

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