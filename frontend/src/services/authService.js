import axios from "@/services/api"
import { AuthAPI } from "@/services/authApi"

class AuthService {
  constructor() {
    this.baseUrl = "/authorization"
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${this.baseUrl}/login`, { email, password })
      return response.data
    } catch (error) {
      if (error.response) {
        const { data, status } = error.response
        throw { data, status }
      }
      throw error
    }
  };

  async register(name, email, password) {
    try {
      const response = await axios.post(`${this.baseUrl}/register`, {
        name,
        email,
        password,
      })
      return response.data
    } catch (error) {
      if (error.response) {
        const { data, status } = error.response
        throw { data, status }
      }
      throw error
    }
  }


  async resetPassword(token, newPassword) {
    try {
      const response = await axios.post(`${this.baseUrl}/reset-password`, { token, newPassword })
      return response.data
    } catch (error) {
      if (error.response) {
        const { data, status } = error.response
        throw { data, status }
      }
      throw error
    }
  }

  async forgotPassword(email) {
    try {
      const response = await axios.post(`${this.baseUrl}/forgot-password`, { email })
      return response.data
    } catch (error) {
      if (error.response) {
        const { data, status } = error.response
        throw { data, status }
      }
      throw error
    }
  }

  async refreshToken(token) {
    try {
      const response = await AuthAPI.post(`${this.baseUrl}/refresh-token`, { token })
      return response.data
    } catch (error) {
      if (error.response) {
        const { data, status } = error.response
        throw { data, status }
      }
      throw error
    }
  }

}

export default new AuthService
