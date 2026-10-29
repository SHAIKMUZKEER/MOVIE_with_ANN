import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import api from '../services/api'

function ForgotPassword() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      await api.post('/auth/forgot-password', {
        email,
      })

      navigate('/verify-otp', {
        state: { email },
      })
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        'Unable to process your request. Please try again.'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen px-6 py-12 text-white">

      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">

        <div className="glass-surface w-full p-6 sm:p-10">

          {/* Back to Login */}
          <Link
            to="/login"
            className="mb-10 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-white"
          >
            ← Back to login
          </Link>

          {/* Heading */}
          <div className="mb-8">

            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-500">
              MovieAI
            </p>

            <h1 className="text-4xl font-bold tracking-tight">
              Forgot password?
            </h1>

            <p className="mt-3 text-gray-500">
              Enter your email and we'll send you a verification code.
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition focus:border-white/30 focus:bg-white/[0.06]"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="button-primary w-full font-semibold"
            >
              {loading ? 'Sending code...' : 'Send verification code'}
            </button>

          </form>

          {/* Login */}
          <p className="mt-8 text-center text-sm text-gray-500">

            Remember your password?{' '}

            <Link
              to="/login"
              className="font-medium text-white hover:underline"
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </main>
  )
}

export default ForgotPassword