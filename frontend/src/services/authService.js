import axios from "@/services/api"

const API_URL = "/authorization"

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password })
    return response.data
  } catch (error) {
    if (error.response) {
      const { data, status } = error.response
      throw { data, status }
    }
    throw error
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const { data, status } = error.response
      throw { data, status }
    }
    throw error
  }
}


export const resetPassword = async (token, newPassword) => {
  try {
    await axios.post(`${API_URL}/reset-password`, { token, newPassword })
  } catch (error) {
    if (error.response) {
      const { data, status } = error.response
      throw { data, status }
    }
    throw error
  }
}

export const forgotPassword = async (email) => {
  try {
    await axios.post(`${API_URL}/forgot-password`, { email })
  } catch (error) {
    if (error.response) {
      const { data, status } = error.response
      throw { data, status }
    }
    throw error
  }
}

