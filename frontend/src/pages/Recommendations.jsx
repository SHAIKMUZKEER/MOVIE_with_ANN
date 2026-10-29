import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router'

import api from '../services/api'
import LoadingState from '../components/LoadingState'
import PageTransition from '../components/PageTransition'

function Recommendations() {
  const navigate = useNavigate()

  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  // --------------------------------------------------
  // LOAD RECOMMENDATIONS
  // --------------------------------------------------

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/recommendations/')

        console.log(
          'RECOMMENDATION RESPONSE:',
          response.data
        )

        const data = response.data

        if (Array.isArray(data)) {
          setRecommendations(data)
        } else if (Array.isArray(data.recommendations)) {
          setRecommendations(data.recommendations)
        } else {
          setRecommendations([])
        }
      } catch (error) {
        console.error(
          'RECOMMENDATION ERROR:',
          error
        )

        console.error(
          'STATUS:',
          error.response?.status
        )

        console.error(
          'DATA:',
          error.response?.data
        )

        setError(
          error.response?.data?.detail ||
            'Unable to generate recommendations.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [retryCount])

  // --------------------------------------------------
  // GET MOVIE TITLE
  // --------------------------------------------------

  const getMovieTitle = (movie) => {
    if (typeof movie === 'string') {
      return movie
    }

    return movie?.title || 'Unknown movie'
  }

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen text-white">

        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-5 sm:px-8 lg:px-10">

          {/* Background glow */}

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-[120px] sm:h-[500px] sm:w-[500px]" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full max-w-xl text-center"
          >

            <LoadingState label="Finding your recommendations..." />

            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 sm:text-xs">
              MovieAI
            </p>

            <h1 className="mt-3 text-xl font-medium sm:text-2xl">
              Finding movies for you...
            </h1>

            <p className="mx-auto mt-3 max-w-md text-xs leading-5 text-white/35 sm:text-sm sm:leading-6">
              Our neural recommendation engine is
              analyzing your preferences.
            </p>

          </motion.div>

        </div>

      </main>
    )
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <main className="min-h-screen text-white">

        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-5 py-12 sm:px-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-3xl border border-red-500/20 bg-red-500/[0.04] p-6 text-center sm:p-10"
          >

            <p className="text-[10px] uppercase tracking-[0.3em] text-red-400/60 sm:text-xs">
              Recommendation Error
            </p>

            <h1 className="mt-4 text-xl font-medium sm:text-2xl">
              We couldn't find your recommendations.
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/40">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="button-secondary mt-8 w-full text-sm font-medium sm:w-auto"
            >
              Try Again
            </button>

          </motion.div>

        </div>

      </main>
    )
  }

  // --------------------------------------------------
  // EMPTY
  // --------------------------------------------------

  if (recommendations.length === 0) {
    return (
      <main className="min-h-screen text-white">

        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-5 py-12 sm:px-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-center"
          >

            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 sm:text-xs">
              MovieAI
            </p>

            <h1 className="mt-4 text-2xl font-medium sm:text-3xl">
              We need a little more information.
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/40">
              Rate a few movies so our recommendation
              engine can understand your preferences.
            </p>

            <button
              type="button"
              onClick={() => navigate('/initial-rating')}
              className="mt-8 w-full rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-white/90 sm:w-auto"
            >
              Rate Movies →
            </button>

          </motion.div>

        </div>

      </main>
    )
  }

  // --------------------------------------------------
  // RECOMMENDATIONS
  // --------------------------------------------------

  return (
    <main className="min-h-screen text-white">

      {/* ============================================== */}
      {/* BACKGROUND ATMOSPHERE */}
      {/* ============================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-1/2 top-[-300px] h-[450px] w-[650px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[120px] sm:h-[600px] sm:w-[900px] sm:blur-[150px]" />

        <div className="absolute right-[-250px] top-[25%] h-[400px] w-[400px] rounded-full bg-white/[0.018] blur-[110px] sm:h-[500px] sm:w-[500px] sm:blur-[130px]" />

        <div className="absolute bottom-[-250px] left-[-200px] h-[400px] w-[400px] rounded-full bg-white/[0.015] blur-[110px] sm:h-[500px] sm:w-[500px] sm:blur-[130px]" />

      </div>


      <PageTransition className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">

        {/* ============================================== */}
        {/* HEADER */}
        {/* ============================================== */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >

          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 sm:text-xs sm:tracking-[0.35em]">
            AI Selection
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Movies chosen for you.
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-6 text-white/40 sm:mt-6 sm:text-base sm:leading-7">
            These recommendations are generated from
            your movie preferences using our neural
            recommendation engine.
          </p>

        </motion.div>


        {/* ============================================== */}
        {/* SECTION HEADER */}
        {/* ============================================== */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
          className="mt-14 flex flex-col gap-3 sm:mt-20 sm:flex-row sm:items-end sm:justify-between"
        >

          <div>

            <p className="text-xs uppercase tracking-[0.3em] text-white/25">
              AI Selection
            </p>

            <h2 className="mt-2 text-xl font-medium sm:text-2xl">
              Recommended for you
            </h2>

          </div>

          <p className="text-sm text-white/30">
            {recommendations.length} movies
          </p>

        </motion.div>


        {/* ============================================== */}
        {/* MOVIE CARDS */}
        {/* ============================================== */}

        <div className="mt-7 grid gap-4 sm:mt-8 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">

          <AnimatePresence>

            {recommendations.map((movie, index) => {

              const title = getMovieTitle(movie)

              return (
                <motion.article
                  key={`${title}-${index}`}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.12,
                  }}
                  whileHover={{
                    y: -6,
                  }}
                  className="glass-surface group relative min-h-[320px] overflow-hidden p-5 transition-colors duration-500 hover:border-indigo-300/30 sm:min-h-[360px] sm:p-7"
                >

                  {/* Subtle card glow */}

                  <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/[0.025] blur-3xl transition duration-700 group-hover:bg-white/[0.05]" />


                  {/* Number */}

                  <div className="relative flex items-center justify-between">

                    <span className="text-xs tracking-[0.25em] text-white/20">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-white/30 sm:px-3 sm:text-[10px] sm:tracking-[0.2em]">
                      AI Pick
                    </span>

                  </div>


                  {/* Movie title */}

                  <div className="relative flex min-h-[220px] items-end sm:min-h-[260px]">

                    <div className="min-w-0">

                      <p className="mb-3 text-[9px] uppercase tracking-[0.25em] text-white/25 sm:text-[10px] sm:tracking-[0.3em]">
                        Recommended movie
                      </p>

                      <h3 className="break-words text-2xl font-medium leading-tight text-white/90 transition-colors duration-300 group-hover:text-white sm:text-3xl">
                        {title}
                      </h3>

                    </div>

                  </div>


                  {/* Bottom */}

                  <div className="absolute bottom-5 left-5 right-5 border-t border-white/[0.07] pt-4 sm:bottom-7 sm:left-7 sm:right-7">

                    <p className="text-[10px] leading-5 text-white/25 sm:text-xs">
                      Selected from movies you have not
                      previously rated.
                    </p>

                  </div>

                </motion.article>
              )

            })}

          </AnimatePresence>

        </div>


        {/* ============================================== */}
        {/* ACTION */}
        {/* ============================================== */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.5,
          }}
          className="mt-14 flex flex-col items-center text-center sm:mt-16"
        >

          <p className="max-w-md text-xs leading-5 text-white/30 sm:text-sm sm:leading-6">
            Want the model to understand your taste better?
          </p>

          <button
            type="button"
            onClick={() => navigate('/movies')}
            className="mt-5 w-full rounded-full border border-white/15 px-7 py-3.5 text-sm font-medium text-white transition duration-300 hover:bg-white hover:text-black sm:w-auto"
          >
            Explore More Movies →
          </button>

        </motion.div>


      </PageTransition>

    </main>
  )
}

export default Recommendations