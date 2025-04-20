import axios from "@/services/api"

class TransferService {
  constructor() {
    this.baseUrl = "/transfer"
  }

  async create(origin_account, destination_account, status, value, date, description) {
    try {
      const response = await axios.post(`${this.baseUrl}/`, {
        origin_account,
        destination_account,
        status,
        value,
        date,
        description
      })
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

  async update(origin_account, destination_account, status, value, date, description) {
    try {
      const response = await axios.put(`${this.baseUrl}/`, {
        origin_account,
        destination_account,
        status,
        value,
        date,
        description
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

export default new TransferService