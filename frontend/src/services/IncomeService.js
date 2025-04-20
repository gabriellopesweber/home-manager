import axios from "@/services/api"

class IncomeService {
  constructor() {
    this.baseUrl = "/income"
  }

  async create(params) {
    try {
      const response = await axios.post(`${this.baseUrl}/`, params)
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

  async getById(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async update(category, status, value, date, description, account) {
    try {
      const response = await axios.put(`${this.baseUrl}/`, {
        category,
        status,
        value,
        date,
        description,
        account
      })
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

export default new IncomeService