import axios from "@/services/api"

class AccountService {
  constructor() {
    this.baseUrl = "/account"
  }

  async create(params) {
    try {
      const { name, balance } = params
      const response = await axios.post(`${this.baseUrl}/`, { name, balance })
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getAll() {
    try {
      const response = await axios.get(`${this.baseUrl}/`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getTotalAssociated(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/total-associated/${id}`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getById(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async update(id, params) {
    try {
      const { name, balance } = params
      const response = await axios.put(`${this.baseUrl}/${id}`, { name, balance })
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async deleteById(id) {
    try {
      const response = await axios.delete(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }
}

export default new AccountService