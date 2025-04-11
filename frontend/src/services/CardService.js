import axios from "@/services/api"

const API_URL = "/card"

export const create = async (account_id, name, brand, type, last_four_digits, card_limit, due_date, closing_date, is_active) => {
  try {
    const response = await axios.post(`${API_URL}/`, {
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

export const getAll = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/?account_id=${id}`)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const getById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const update = async (account_id, name, brand, type, last_four_digits, card_limit, due_date, closing_date, is_active) => {
  try {
    const response = await axios.put(`${API_URL}/`, {
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

export const deleteById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}