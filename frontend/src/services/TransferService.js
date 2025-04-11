import axios from "@/services/api"

const API_URL = "/transfer"

export const create = async (origin_account, destination_account, status, value, date, description) => {
  try {
    const response = await axios.post(`${API_URL}/`, {
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

export const update = async (origin_account, destination_account, status, value, date, description) => {
  try {
    const response = await axios.put(`${API_URL}/`, {
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

export const deleteById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}