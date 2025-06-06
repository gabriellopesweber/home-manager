import axios from "@/services/api"

class TransferService {
  constructor() {
    this.baseUrl = "/transfer"
  }

  async create(params) {
    try {
      const { origin_account, destination_account, status, value, date, description } = params
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
      throw error.response
    }
  }

  async getAll() {
    try {
      const response = await axios.get(`${this.baseUrl}/`)
      return response.data
    } catch (error) {
      throw error.response
    }
  }

  async getById(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      throw error.response
    }
  }

  async update(id, params) {
    try {
      const { origin_account, destination_account, status, value, date, description } = params
      const response = await axios.put(`${this.baseUrl}/${id}`, {
        origin_account,
        destination_account,
        status,
        value,
        date,
        description
      })
      return response.data
    } catch (error) {
      throw error.response
    }
  }

  async deleteById(id) {
    try {
      const response = await axios.delete(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      throw error.response
    }
  }

}

export default new TransferService