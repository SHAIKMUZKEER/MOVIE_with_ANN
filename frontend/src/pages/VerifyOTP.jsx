import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import api from '../services/api'

function VerifyOTP() {
  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email || ''

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOtpChange = (event) => {
    const value = event.target.value

    // Allow only numbers and maximum 6 digits
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value)
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email) {
      setError('Email information is missing. Please request a new code.')
      return
    }

    if (otp.length !== 6) {
      setError('Please enter the 6-digit verification code.')
      return
    }

    setError('')
    setLoading(true)

    try {
      await api.post('/auth/verify-otp', {
        email,
        otp,
      })

      navigate('/reset-password', {
        state: {
          email,
          otp,
        },
      })
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        'Invalid or expired verification code.'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-12 text-white">

      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">

        <div className="w-full">

          {/* Back */}
          <Link
            to="/forgot-password"
            className="mb-10 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-white"
          >
            ← Back
          </Link>

          {/* Heading */}
          <div className="mb-8">

            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-500">
              MovieAI
            </p>

            <h1 className="text-4xl font-bold tracking-tight">
              Verify your email
            </h1>

            <p className="mt-3 text-gray-500">
              Enter the 6-digit verification code sent to your email.
            </p>

            {email && (
              <p className="mt-3 text-sm text-gray-400">
                Code sent to{' '}
                <span className="text-white">
                  {email}
                </span>
              </p>
            )}

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

          {/* OTP Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>

              <label
                htmlFor="otp"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Verification code
              </label>

              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-center text-2xl font-semibold tracking-[0.5em] text-white outline-none transition focus:border-white/30 focus:bg-white/[0.06]"
              />

            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full rounded-xl bg-white px-5 py-3.5 font-semibold text-black transition-all duration-300 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify code'}
            </button>

          </form>

          {/* Back to Login */}
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

export default VerifyOTP