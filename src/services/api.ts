import axios from 'axios'

const api = axios.create({
  // Use VITE_API_URL from environment if available, otherwise default to localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('awaj-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('awaj-token')
      localStorage.removeItem('awaj-user')
      // Don't redirect here — let the stores handle it
    }
    return Promise.reject(error)
  }
)

export default api
