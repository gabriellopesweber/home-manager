import { defineStore } from "pinia"
import AuthService from "@/services/authService"
import dayjs from "dayjs"

export const useAuthStore = defineStore("authorization", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: null,
    timeActive: localStorage.getItem("timeActive") || null,
    timeExpired: localStorage.getItem("timeExpired") || null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(email, password) {
      try {
        const response = await AuthService.login(email, password)
        this.token = response.token
        this.timeActive = dayjs().toISOString()
        this.timeExpired = dayjs().add(2, 'hour').toISOString()

        localStorage.setItem("token", this.token)
        localStorage.setItem("timeActive", this.timeActive)
        localStorage.setItem("timeExpired", this.timeExpired)
      } catch (error) {
        throw new error
      }
    },

    async refreshToken() {
      try {
        const response = await AuthService.refreshToken(this.token)

        this.token = response.token
        this.timeActive = dayjs().toISOString()
        this.timeExpired = dayjs().add(2, 'hour').toISOString()

        localStorage.setItem("token", this.token)
        localStorage.setItem("timeActive", this.timeActive)
        localStorage.setItem("timeExpired", this.timeExpired)
      } catch (error) {
        throw new error
      }
    },

    updateTimeActive(time) {
      this.timeActive = time
      localStorage.setItem("timeActive", this.timeActive)
    },

    logout() {
      this.token = ""
      this.user = null
      this.timeActive = null
      this.timeExpired = null

      localStorage.removeItem("token")
      localStorage.removeItem("timeActive")
      localStorage.removeItem("timeExpired")
    }
  }
})