import axios from "@/services/api"

class ExpenseService {
  constructor() {
    this.baseUrl = "/expense"
  }

  async create(params) {
    try {
      const response = await axios.post(`${this.baseUrl}/`, params)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getAll(filters = {}) {
    try {
      const { account_id } = filters
      const response = await axios.get(`${this.baseUrl}/${account_id ? `account_id=${account_id}` : ``}`)
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
      const { category, status, value, date, description, account } = params
      const response = await axios.put(`${this.baseUrl}/${id}`, {
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

export default new ExpenseService