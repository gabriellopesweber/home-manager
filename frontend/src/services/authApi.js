import axios from 'axios'

export const AuthAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})