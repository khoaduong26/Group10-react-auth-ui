import axios from 'axios'

const baseURL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:3000'

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const withAuthHeader = () => {
  const token =
    localStorage.getItem('token') || import.meta.env.VITE_DEV_TOKEN || ''
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

export default apiClient
