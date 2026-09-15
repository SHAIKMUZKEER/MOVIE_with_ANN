import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'

import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function Profile() {
  const navigate = useNavigate()

  const {
    user,
    logout,
  } = useAuth()

  const [profile, setProfile] = useState(user || null)
  const [loading, setLoading] = useState(!user)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        /*
          Get the latest authenticated user
          information from the backend.
        */

        const response = await api.get('/auth/me')

        console.log(
          'PROFILE RESPONSE:',
          response.data
        )

        setProfile(response.data)

      } catch (error) {
        console.error(
          'PROFILE ERROR:',
          error
        )

        setError(
          error.response?.data?.detail ||
          'Unable to load profile.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getUserTypeLabel = () => {
    if (profile?.user_type === 'historical') {
      return 'Historical User'
    }

    return 'Website User'
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#080808] px-6 py-16 text-white lg:px-10">

      <div className="mx-auto max-w-5xl">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >

          <p className="text-xs uppercase tracking-[0.35em] text-white/35">
            Account
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight">
            Your profile.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/45">
            Manage your MovieAI account and continue
            your personalized movie journey.
          </p>

        </motion.div>


        {/* ========================================= */}
        {/* LOADING */}
        {/* ========================================= */}

        {loading && (
          <div className="mt-16 text-sm text-white/40">
            Loading profile...
          </div>
        )}


        {/* ========================================= */}
        {/* ERROR */}
        {/* ========================================= */}

        {!loading && error && (

          <div className="mt-12 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6">

            <p className="text-sm text-red-400">
              {error}
            </p>

          </div>

        )}


        {/* ========================================= */}
        {/* PROFILE */}
        {/* ========================================= */}

        {!loading && !error && profile && (

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
            className="mt-12"
          >

            {/* ===================================== */}
            {/* USER CARD */}
            {/* ===================================== */}

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 sm:p-10">

              <div className="flex flex-col gap-8 sm:flex-row sm:items-center">

                {/* Avatar */}

                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-white text-3xl font-bold text-black">

                  {profile.user_name
                    ? profile.user_name
                        .charAt(0)
                        .toUpperCase()
                    : 'M'}

                </div>


                {/* User information */}

                <div>

                  <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                    MovieAI Member
                  </p>

                  <h2 className="mt-3 text-3xl font-semibold">
                    {profile.user_name || 'User'}
                  </h2>

                  <p className="mt-2 text-sm text-white/40">
                    {profile.email}
                  </p>

                </div>

              </div>

            </div>


            {/* ===================================== */}
            {/* ACCOUNT INFORMATION */}
            {/* ===================================== */}

            <div className="mt-6 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8">

              <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                Account Information
              </p>

              <h2 className="mt-3 text-2xl font-medium">
                Personal details
              </h2>


              <div className="mt-8 divide-y divide-white/[0.07]">

                {/* Name */}

                <div className="flex flex-col justify-between gap-2 py-5 sm:flex-row">

                  <span className="text-sm text-white/35">
                    Name
                  </span>

                  <span className="text-sm font-medium text-white/80">
                    {profile.user_name || '—'}
                  </span>

                </div>


                {/* Email */}

                <div className="flex flex-col justify-between gap-2 py-5 sm:flex-row">

                  <span className="text-sm text-white/35">
                    Email
                  </span>

                  <span className="text-sm font-medium text-white/80">
                    {profile.email || '—'}
                  </span>

                </div>


                {/* User ID */}

                <div className="flex flex-col justify-between gap-2 py-5 sm:flex-row">

                  <span className="text-sm text-white/35">
                    User ID
                  </span>

                  <span className="text-sm font-medium text-white/80">
                    {profile.user_id || '—'}
                  </span>

                </div>


                {/* User Type */}

                <div className="flex flex-col justify-between gap-2 py-5 sm:flex-row">

                  <span className="text-sm text-white/35">
                    Account Type
                  </span>

                  <span className="rounded-full border border-white/[0.08] px-4 py-1.5 text-xs font-medium text-white/60">
                    {getUserTypeLabel()}
                  </span>

                </div>

              </div>

            </div>


            {/* ===================================== */}
            {/* ACTIONS */}
            {/* ===================================== */}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              {/* Recommendations */}

              <button
                type="button"
                onClick={() =>
                  navigate('/recommendations')
                }
                className="rounded-2xl border border-white/[0.08] bg-white/[0.025] px-6 py-5 text-left transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.05]"
              >

                <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                  AI Discovery
                </p>

                <p className="mt-2 text-base font-medium">
                  My Recommendations →
                </p>

              </button>


              {/* Movies */}

              <button
                type="button"
                onClick={() =>
                  navigate('/movies')
                }
                className="rounded-2xl border border-white/[0.08] bg-white/[0.025] px-6 py-5 text-left transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.05]"
              >

                <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                  Explore
                </p>

                <p className="mt-2 text-base font-medium">
                  Browse Movies →
                </p>

              </button>

            </div>


            {/* ===================================== */}
            {/* SIGN OUT */}
            {/* ===================================== */}

            <div className="mt-10 border-t border-white/[0.08] pt-8">

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-gray-700 px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-gray-600"
              >
                Sign Out
              </button>

            </div>

          </motion.div>

        )}

      </div>

    </section>
  )
}

export default Profile