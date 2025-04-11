import { defineStore } from "pinia"
import { login, register, resetPassword, forgotPassword } from "@/services/authService"

export const useAuthStore = defineStore("authorization", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(email, password) {
      const response = await login(email, password)
      this.token = response.token
      localStorage.setItem("token", this.token)
    },

    async register(name, email, password) {
      await register(name, email, password)
    },

    async resetPassword(token, newPassword) {
      await resetPassword(token, newPassword)
    },

    async forgotPassword(email) {
      await forgotPassword(email)
    },

    logout() {
      this.token = ""
      this.user = null
      localStorage.removeItem("token")
    }
  }
})