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


}

export default new DashboardService()
