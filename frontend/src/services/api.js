import axios from 'axios'

const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

const api = axios.create({
  baseURL: base,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.response.use(
  r => r,
  err => {
    // normalize error
    const message = err.response?.data?.error || err.message || 'Unknown error'
    return Promise.reject({ status: err.response?.status, message, details: err.response?.data })
  }
)

export default api
