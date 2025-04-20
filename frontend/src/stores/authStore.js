import { defineStore } from "pinia"
import AuthService from "@/services/AuthService"

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
      const response = await AuthService.login(email, password)
      this.token = response.token
      localStorage.setItem("token", this.token)
    },

    async register(name, email, password) {
      await AuthService.register(name, email, password)
    },

    async resetPassword(token, newPassword) {
      await AuthService.resetPassword(token, newPassword)
    },

    async forgotPassword(email) {
      await AuthService.forgotPassword(email)
    },

    logout() {
      this.token = ""
      this.user = null
      localStorage.removeItem("token")
    }
  }
})