import { defineStore } from "pinia"
import axios from "@/services/api"

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
      try {
        const response = await axios.post("/authorization/login", { email, password })
        this.token = response.data.token
        localStorage.setItem("token", this.token)
      } catch (error) {
        throw error.response.data
      }
    },

    async register(name, email, password) {
      try {
        await axios.post("/authorization/register", { name, email, password })
      } catch (error) {
        throw error.response.data
      }
    },

    logout() {
      this.token = ""
      this.user = null
      localStorage.removeItem("token")
    },
  },
})