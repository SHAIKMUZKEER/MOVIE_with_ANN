import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import api, {
  getCurrentUser,
  getRatingStatus,
} from '../services/api'

import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      // ------------------------------------------------
      // STEP 1: LOGIN
      // ------------------------------------------------

      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      })

      console.log('LOGIN RESPONSE:', response.data)

      const accessToken = response.data.access_token

      // ------------------------------------------------
      // STEP 2: SAVE JWT
      // ------------------------------------------------

      localStorage.setItem('access_token', accessToken)

      console.log('TOKEN SAVED')

      // ------------------------------------------------
      // STEP 3: GET CURRENT USER
      // ------------------------------------------------

      const userData = await getCurrentUser()

      console.log('CURRENT USER:', userData)

      // Save token + user in AuthContext
      login(accessToken, userData)

      // ------------------------------------------------
      // STEP 4: HISTORICAL USER
      // ------------------------------------------------

      if (userData.user_type === 'historical') {
        console.log('Historical user → Recommendations')

        navigate('/recommendations')
        return
      }

      // ------------------------------------------------
      // STEP 5: WEBSITE USER
      // ------------------------------------------------

      const ratingStatus = await getRatingStatus()

      console.log('RATING STATUS:', ratingStatus)

      if (ratingStatus.has_ratings) {
        console.log(
          'Website user already has ratings → Recommendations'
        )

        navigate('/recommendations')
      } else {
        console.log(
          'Website user has no ratings → Initial Rating'
        )

        navigate('/initial-rating')
      }

    } catch (error) {
      console.error('LOGIN FLOW ERROR:', error)
      console.error('STATUS:', error.response?.status)
      console.error('DATA:', error.response?.data)

      if (error.response?.status === 401) {
        setError('Invalid email or password.')
      } else {
        setError(
          error.response?.data?.detail ||
            'Unable to complete login. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-12 text-white">

      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">

        <div className="w-full">

          {/* Back to Home */}

          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-white"
          >
            ← Back to home
          </Link>

          {/* Heading */}

          <div className="mb-8">

            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-500">
              MovieAI
            </p>

            <h1 className="text-4xl font-bold tracking-tight">
              Welcome back
            </h1>

            <p className="mt-3 text-gray-500">
              Sign in to continue your movie discovery journey.
            </p>

          </div>

          {/* Error */}

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Login Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition focus:border-white/30 focus:bg-white/[0.06]"
              />

            </div>

            {/* Password */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-300"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs text-gray-500 transition-colors hover:text-white"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="relative">

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-12 text-white outline-none transition focus:border-white/30 focus:bg-white/[0.06]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-white"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >

                  {showPassword ? (

                    /* Eye Off */

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>

                  ) : (

                    /* Eye */

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>

                  )}

                </button>

              </div>

            </div>

            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white px-5 py-3.5 font-semibold text-black transition-all duration-300 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </form>

          {/* Signup */}

          <p className="mt-8 text-center text-sm text-gray-500">

            Don't have an account?{' '}

            <Link
              to="/signup"
              className="font-medium text-white hover:underline"
            >
              Create an account
            </Link>

          </p>

        </div>

      </div>

    </main>
  )
}

export default Login