import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import api from '../services/api'

function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email || ''
  const otp = location.state?.otp || ''

  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: '',
  })

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })

    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email || !otp) {
      setError(
        'Password reset information is missing. Please request a new verification code.'
      )
      return
    }

    if (formData.new_password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    if (formData.new_password !== formData.confirm_password) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setLoading(true)

    try {
      await api.post('/auth/reset-password', {
        email,
        otp,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      })

      navigate('/login', {
        state: {
          message: 'Password reset successfully. Please sign in.',
        },
      })
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        'Unable to reset your password. Please try again.'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen px-6 py-12 text-white">

      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">

        <div className="glass-surface w-full p-6 sm:p-10">

          {/* Back */}
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
              Create new password
            </h1>

            <p className="mt-3 text-gray-500">
              Choose a new password for your MovieAI account.
            </p>

          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              role="alert"
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* New Password */}
            <div>

              <label
                htmlFor="new_password"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                New password
              </label>

              <div className="relative">

                <input
                  id="new_password"
                  name="new_password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.new_password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  minLength={6}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-12 text-white outline-none transition focus:border-white/30 focus:bg-white/[0.06]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(!showNewPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-white"
                  aria-label={
                    showNewPassword
                      ? 'Hide new password'
                      : 'Show new password'
                  }
                >
                  {showNewPassword ? (

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

            {/* Confirm Password */}
            <div>

              <label
                htmlFor="confirm_password"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Confirm new password
              </label>

              <div className="relative">

                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={
                    showConfirmPassword ? 'text' : 'password'
                  }
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  minLength={6}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-12 text-white outline-none transition focus:border-white/30 focus:bg-white/[0.06]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-white"
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                >
                  {showConfirmPassword ? (

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

            {/* Reset button */}
            <button
              type="submit"
              disabled={loading}
              className="button-primary w-full font-semibold"
            >
              {loading
                ? 'Resetting password...'
                : 'Reset password'}
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

export default ResetPassword