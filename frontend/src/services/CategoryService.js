import axios from "@/services/api"

const API_URL = "/category"

export const create = async (name, type) => {
  try {
    const response = await axios.post(`${API_URL}/`, { name, type })
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

export const update = async (name, type) => {
  try {
    const response = await axios.put(`${API_URL}/`, { name, type })
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