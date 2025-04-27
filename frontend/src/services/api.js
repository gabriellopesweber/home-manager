import axios from "axios"
import dayjs from "dayjs"
import { useAuthStore } from "../stores/authStore"

const API = axios.create({
  baseURL: "http://localhost:5002",
})

API.interceptors.request.use(async config => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    const now = dayjs()
    const lastActive = dayjs(authStore.timeActive)
    const expiredAt = dayjs(authStore.timeExpired)

    const diffActiveMinutes = now.diff(lastActive, 'minute')
    const diffExpiredMinutes = now.diff(expiredAt, 'minute')

    if (diffExpiredMinutes >= 0) {
      authStore.logout()
      window.location.href = '/login'
      throw new Error('Sessão expirada. Faça login novamente.')
    }

    if (diffActiveMinutes >= 1) {
      try {
        await authStore.refreshToken()
        config.headers.Authorization = `Bearer ${authStore.token}`
      } catch (error) {
        console.error('Falha ao renovar token.', error)
        authStore.logout()
        window.location.href = '/login'
        throw error
      }
    } else {
      authStore.updateTimeActive(now.toISOString())
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
  }

  return config
}, error => {
  return Promise.reject(error)
})

export default API
