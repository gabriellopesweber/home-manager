import axios from "@/services/api"

class DashboardService {
  constructor() {
    this.baseUrl = "/dashboard"
  }

  async lastThreeTransactions() {
    try {
      const response = await axios.get(`${this.baseUrl}/last-three-transactions`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async getDatasets(status) {
    try {
      const filters = {}
      if (typeof status === "number") filters.status = status

      const queryString = new URLSearchParams(filters).toString()
      const response = await axios.get(`${this.baseUrl}/datasets/?${queryString}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

}

export default new DashboardService()
