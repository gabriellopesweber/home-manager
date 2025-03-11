import { createRouter, createWebHistory } from 'vue-router'
import DashboardIndex from '@/views/DashboardIndex.vue'
import AboutView from '@/views/AboutView.vue'

const routes = [
    { path: '/', name: "dashboard", component: DashboardIndex },
    { path: '/about', name: "about", component: AboutView }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
