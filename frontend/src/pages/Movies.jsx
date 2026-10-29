import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'

import api from '../services/api'

function Movies() {
  const navigate = useNavigate()

  const [movies, setMovies] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchMovies = async (searchTerm = '') => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/movies/', {
        params: {
          search: searchTerm,
          limit: 20,
          offset: 0,
        },
      })

      console.log('MOVIES RESPONSE:', response.data)

      /*
        Backend may return either:

        [
          { movie_id, title },
          ...
        ]

        or:

        {
          movies: [...]
        }
      */

      const movieData = Array.isArray(response.data)
        ? response.data
        : response.data.movies || []

      setMovies(movieData)
    } catch (error) {
      console.error('MOVIES ERROR:', error)

      setError(
        error.response?.data?.detail ||
          'Unable to load movies.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => fetchMovies(), 0)

    return () => clearTimeout(timer)
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()

    fetchMovies(search.trim())
  }

  const clearSearch = () => {
    setSearch('')
    fetchMovies('')
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] px-5 py-12 text-white sm:px-8 sm:py-14 lg:px-10 lg:py-16">

      <div className="mx-auto max-w-7xl">

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
            Movie Library
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Discover movies.
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-6 text-white/45 sm:text-base sm:leading-7">
            Search through our movie collection and explore
            titles available in the recommendation system.
          </p>
        </motion.div>


        {/* ========================================= */}
        {/* SEARCH */}
        {/* ========================================= */}

        <motion.form
          onSubmit={handleSearch}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.1,
          }}
          className="mt-10 flex max-w-3xl flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search movies..."
              className="w-full rounded-2xl border border-white/[0.1] bg-white/[0.04] px-5 py-4 pr-12 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-white/[0.25] focus:bg-white/[0.06] sm:text-base"
            />

            {/* Search icon */}

            <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/30">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />

                <line
                  x1="20"
                  y1="20"
                  x2="16.65"
                  y2="16.65"
                />
              </svg>

            </div>

          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-white px-7 py-4 text-sm font-bold text-black transition-all duration-300 hover:bg-white/90 disabled:opacity-50 sm:w-auto"
          >
            Search
          </button>

        </motion.form>


        {/* ========================================= */}
        {/* SEARCH CLEAR */}
        {/* ========================================= */}

        {search && !loading && (
          <button
            type="button"
            onClick={clearSearch}
            className="mt-4 text-xs text-white/35 transition hover:text-white"
          >
            Clear search
          </button>
        )}


        {/* ========================================= */}
        {/* LOADING */}
        {/* ========================================= */}

        {loading && (
          <div className="mt-16 text-sm text-white/40">
            Loading movies...
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

            <button
              type="button"
              onClick={() =>
                fetchMovies(search)
              }
              className="mt-5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black"
            >
              Try Again
            </button>

          </div>

        )}


        {/* ========================================= */}
        {/* MOVIE RESULTS */}
        {/* ========================================= */}

        {!loading &&
          !error &&
          movies.length > 0 && (

            <>

              <div className="mt-14 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                    Collection
                  </p>

                  <h2 className="mt-3 text-xl font-medium sm:text-2xl">
                    {search
                      ? `Results for "${search}"`
                      : 'Explore movies'}
                  </h2>

                </div>

                <span className="text-sm text-white/30">
                  {movies.length} titles
                </span>

              </div>


              {/* ================================= */}
              {/* MOVIE LIST */}
              {/* ================================= */}

              <div className="mt-8 grid gap-3 sm:gap-4">

                {movies.map((movie, index) => (

                  <motion.article
                    key={
                      movie.movie_id ||
                      `${movie.title}-${index}`
                    }
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.03,
                    }}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-4 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.045] sm:px-6 sm:py-5"
                  >

                    <div className="flex min-w-0 items-center gap-4 sm:gap-6">

                      <span className="w-7 shrink-0 text-xs tracking-[0.2em] text-white/20 sm:w-8">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <h3 className="truncate text-sm font-medium text-white/80 transition-colors group-hover:text-white sm:text-base">
                        {movie.title}
                      </h3>

                    </div>


                    {movie.movie_id && (
                      <span className="shrink-0 text-[10px] text-white/20 sm:text-xs">
                        #{movie.movie_id}
                      </span>
                    )}

                  </motion.article>

                ))}

              </div>

            </>

          )}


        {/* ========================================= */}
        {/* NO RESULTS */}
        {/* ========================================= */}

        {!loading &&
          !error &&
          movies.length === 0 && (

            <div className="mt-16 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 text-center sm:p-12">

              <div className="text-3xl">
                ○
              </div>

              <h2 className="mt-5 text-xl font-medium">
                No movies found
              </h2>

              <p className="mt-3 text-sm text-white/40">
                Try searching with a different movie title.
              </p>

            </div>

          )}


        {/* ========================================= */}
        {/* RECOMMENDATION CTA */}
        {/* ========================================= */}

        <div className="mt-16 border-t border-white/[0.08] pt-10 sm:mt-20 sm:pt-12">

          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8 lg:flex-row lg:items-center">

            <div>

              <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                Ready to discover?
              </p>

              <h2 className="mt-3 text-xl font-medium sm:text-2xl">
                Let the AI choose for you.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
                Get personalized recommendations based on
                your movie preferences.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate('/recommendations')
              }
              className="w-full shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black transition-all duration-300 hover:bg-white/90 sm:w-auto"
            >
              Get My Recommendations →
            </button>

          </div>

        </div>

      </div>

    </section>
  )
}

export default Movies