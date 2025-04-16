import axios from "@/services/api"

class AccountService {
  constructor() {
    this.api = axios
    this.baseUrl = "/account"
  }

  async create(name, balance) {
    try {
      const response = await this.api.post(`${this.baseUrl}/`, { name, balance })
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getAll() {
    try {
      const response = await this.api.get(`${this.baseUrl}/`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getById(id) {
    try {
      const response = await this.api.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async update(name, balance) {
    try {
      const response = await this.api.put(`${this.baseUrl}/`, { name, balance })
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async deleteById(id) {
    try {
      const response = await this.api.delete(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }
}

export default new AccountService