import axios from "@/services/api"

const API_URL = "/expense"

export const create = async (category, status, value, date, description, account) => {
  try {
    const response = await axios.post(`${API_URL}/`, {
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

export const getAll = async () => {
  try {
    const response = await axios.get(`${API_URL}/`)
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

export const update = async (category, status, value, date, description, account) => {
  try {
    const response = await axios.put(`${API_URL}/`, {
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

export const deleteById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}