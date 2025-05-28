import dayjs from "dayjs"
import api from "./api"
import { useAuthStore } from "../stores/authStore"

export function setupInterceptors() {
  api.interceptors.request.use(async config => {
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
        throw Promise.reject(new Error('Sessão expirada. Faça login novamente.'))
      }

      if (diffActiveMinutes >= 60) {
        try {
          await authStore.refreshToken()
          config.headers.Authorization = `Bearer ${authStore.token}`
        } catch {
          authStore.logout()
          window.location.href = '/login'
          return Promise.reject(new Error('Sessão expirada, falha ao renovar token.'))
        }
      } else {
        config.headers.Authorization = `Bearer ${authStore.token}`
      }
    }

    return config
  }, error => {
    return Promise.reject(error)
  })
}