import axios from "@/services/api"

class CardService {
  constructor() {
    this.baseUrl = "/card"
  }

  async create(params) {
    try {
      const { account_id, name, brand, type, last_four_digits, card_limit, due_date, closing_date, is_active } = params
      const response = await axios.post(`${this.baseUrl}/`, {
        account_id,
        name,
        brand,
        type,
        last_four_digits,
        card_limit,
        due_date,
        closing_date,
        is_active
      })
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getAll(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/?account_id=${id}`)
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
      const { account_id, name, brand, type, last_four_digits, card_limit, due_date, closing_date, is_active } = params
      const response = await axios.put(`${this.baseUrl}/${id}`, {
        account_id,
        name,
        brand,
        type,
        last_four_digits,
        card_limit,
        due_date,
        closing_date,
        is_active
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

export default new CardService