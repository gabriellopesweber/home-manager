import axios from "@/services/api"

class LaunchService {
  constructor() {
    this.baseUrl = "/launch"
  }

  async getAll(initial_date, final_date) {
    try {
      const response = await axios.get(`${this.baseUrl}/?initial_date=${initial_date}&final_date=${final_date}`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getBalanceData(final_date) {
    try {
      const response = await axios.get(`${this.baseUrl}/balance?final_date=${final_date}`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getDetailedBalanceData(final_date) {
    try {
      const response = await axios.get(`${this.baseUrl}/balance-detailed?final_date=${final_date}`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }
}

export default new LaunchService