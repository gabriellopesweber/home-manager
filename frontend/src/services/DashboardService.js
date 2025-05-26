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

  async getDatasets(status, initial_date, final_date) {
    try {
      const filters = {}
      if (typeof status === "number") filters.status = status
      filters.initial_date = initial_date
      filters.final_date = final_date

      const queryString = new URLSearchParams(filters).toString()
      const response = await axios.get(`${this.baseUrl}/datasets/?${queryString}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

}

export default new DashboardService()
