import ReportIndex from '@/views/report/ReportIndex.vue'

const reportRouter = [{
  path: '/relatorios',
  name: "reports",
  component: ReportIndex,
  meta: {
    requiresAuth: true
  }
}]

export { reportRouter }