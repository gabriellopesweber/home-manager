import ReportIndex from '@/views/report/ReportIndex.vue'

const reportRouter = [{
  path: '/relatorio',
  name: "report",
  component: ReportIndex,
  meta: {
    requiresAuth: true
  }
}]

export { reportRouter }