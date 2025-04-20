import axios from "@/services/api"

class CategoryService {
  constructor() {
    this.baseUrl = "/category"
  }

  async create(name, type) {
    try {
      const response = await axios.post(`${this.baseUrl}/`, { name, type })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async getAll(params = {}) {
    try {
      const response = await axios.get(`${this.baseUrl}/`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async getById(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async update(name, type) {
    try {
      const response = await axios.put(`${this.baseUrl}/`, { name, type })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async deleteById(id) {
    try {
      const response = await axios.delete(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

export default new CategoryService()
