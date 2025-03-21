import axios from "axios";

const API_URL = "http://localhost:5002/authorization"

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password })
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
    }
    return response.data
  } catch (error) {
    throw error.response.data
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
    throw error.response.data
  }
}

export const logout = () => {
  localStorage.removeItem("token")
}