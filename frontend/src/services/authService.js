import axios from "@/services/api"

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
      await axios.post(`${this.baseUrl}/reset-password`, { token, newPassword })
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
      await axios.post(`${this.baseUrl}/forgot-password`, { email })
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
      await axios.post(`${this.baseUrl}/refresh-password`, { token })
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
