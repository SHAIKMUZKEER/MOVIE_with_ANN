import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/*
  ============================================
  REQUEST INTERCEPTOR
  ============================================
  Automatically attach JWT to protected requests.
*/

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/*
  ============================================
  RESPONSE INTERCEPTOR
  ============================================
  If backend says the JWT is invalid/expired,
  remove it and send the user back to login.
*/

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')

      // Don't redirect while already on authentication pages
      const publicPaths = [
        '/login',
        '/signup',
        '/forgot-password',
        '/verify-otp',
        '/reset-password',
      ]

      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

/*
  ============================================
  GET CURRENT USER
  ============================================
*/

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')

  return response.data
}

/*
  ============================================
  CHECK RATING STATUS
  ============================================
*/

export const getRatingStatus = async () => {
  const response = await api.get('/ratings/my-status')

  return response.data
}

/*
  ============================================
  SUBMIT BULK RATINGS
  ============================================
*/

export const submitBulkRatings = async (ratings) => {
  const response = await api.post('/ratings/bulk', {
    ratings,
  })

  return response.data
}

export default api