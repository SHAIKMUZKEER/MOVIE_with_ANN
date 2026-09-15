import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router'

import api, { submitBulkRatings } from '../services/api'

function InitialRating() {
  const navigate = useNavigate()

  // Movies returned from backend search
  const [searchResults, setSearchResults] = useState([])

  // Movies selected by the user
  const [selectedMovies, setSelectedMovies] = useState([])

  // Search input
  const [searchQuery, setSearchQuery] = useState('')

  // Loading states
  const [searchLoading, setSearchLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Add custom movie state
  const [showAddMovie, setShowAddMovie] = useState(false)
  const [customMovieTitle, setCustomMovieTitle] = useState('')

  const [error, setError] = useState('')

  // --------------------------------------------------
  // SEARCH MOVIES
  // --------------------------------------------------

  useEffect(() => {
    const searchMovies = async () => {
      const query = searchQuery.trim()

      if (!query) {
        setSearchResults([])
        setSearchLoading(false)
        return
      }

      try {
        setSearchLoading(true)
        setError('')

        const response = await api.get('/movies/', {
          params: {
            search: query,
            limit: 10,
            offset: 0,
          },
        })

        setSearchResults(response.data)
      } catch (err) {
        console.error('Movie search error:', err)

        setError(
          err.response?.data?.detail ||
            'Unable to search movies.'
        )

        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }

    const timer = setTimeout(searchMovies, 350)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // --------------------------------------------------
  // GET MOVIE TITLE
  // --------------------------------------------------

  const getMovieTitle = (movie) => {
    return typeof movie === 'string'
      ? movie
      : movie.title
  }

  // --------------------------------------------------
  // SELECT MOVIE
  // --------------------------------------------------

  const selectMovie = (movie) => {
    const title = getMovieTitle(movie)

    const alreadySelected = selectedMovies.some(
      (selectedMovie) => selectedMovie.title === title
    )

    if (alreadySelected) {
      return
    }

    setSelectedMovies((previousMovies) => [
      ...previousMovies,
      {
        title,
        rating: null,
      },
    ])

    // Clear search after selecting
    setSearchQuery('')
    setSearchResults([])
  }

  // --------------------------------------------------
  // RATE MOVIE
  // --------------------------------------------------

  const rateMovie = (title, rating) => {
    setSelectedMovies((previousMovies) =>
      previousMovies.map((movie) =>
        movie.title === title
          ? {
              ...movie,
              rating,
            }
          : movie
      )
    )
  }

  // --------------------------------------------------
  // REMOVE MOVIE
  // --------------------------------------------------

  const removeMovie = (title) => {
    setSelectedMovies((previousMovies) =>
      previousMovies.filter(
        (movie) => movie.title !== title
      )
    )
  }

  // --------------------------------------------------
  // ADD CUSTOM MOVIE
  // --------------------------------------------------

  const addCustomMovie = () => {
    const title = customMovieTitle.trim()

    if (!title) {
      return
    }

    const alreadySelected = selectedMovies.some(
      (movie) =>
        movie.title.toLowerCase() === title.toLowerCase()
    )

    if (alreadySelected) {
      setError('This movie is already selected.')
      return
    }

    setSelectedMovies((previousMovies) => [
      ...previousMovies,
      {
        title,
        rating: null,
        isCustom: true,
      },
    ])

    setCustomMovieTitle('')
    setShowAddMovie(false)
    setError('')
  }

  // --------------------------------------------------
  // CONTINUE
  // --------------------------------------------------

  const ratedMovieCount = selectedMovies.filter(
    (movie) => movie.rating !== null
  ).length

  const handleContinue = async () => {
    if (ratedMovieCount === 0) {
      setError('Please rate at least one movie before continuing.')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      // Only send movies that actually have a rating
      const ratingPayload = selectedMovies
        .filter((movie) => movie.rating !== null)
        .map((movie) => ({
          title: movie.title,
          ratings: movie.rating,
        }))

      console.log('SUBMITTING RATINGS:', ratingPayload)

      const response = await submitBulkRatings(ratingPayload)

      console.log('BULK RATING RESPONSE:', response)

      // Only navigate after backend succeeds
      navigate('/recommendations')
    } catch (error) {
      console.error('BULK RATING ERROR:', error)
      console.error('STATUS:', error.response?.status)
      console.error('DATA:', error.response?.data)

      setError(
        error.response?.data?.detail ||
          'Unable to save your ratings. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ============================================== */}
      {/* BACKGROUND ATMOSPHERE */}
      {/* ============================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-1/2 top-[-300px] h-[450px] w-[650px] -translate-x-1/2 rounded-full bg-white/[0.035] blur-[120px] sm:h-[600px] sm:w-[800px] sm:blur-[140px]" />

        <div className="absolute bottom-[-300px] left-[-200px] h-[400px] w-[400px] rounded-full bg-white/[0.02] blur-[100px] sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />

      </div>


      <main className="relative mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">

        {/* ============================================== */}
        {/* HEADER */}
        {/* ============================================== */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >

          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-white/35 sm:text-xs sm:tracking-[0.35em]">
            Personalize your experience
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Tell us what you love.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/45 sm:mt-6 sm:text-base sm:leading-7">
            Search for movies you have actually watched
            and tell us how much you enjoyed them.
          </p>

        </motion.div>


        {/* ============================================== */}
        {/* SEARCH */}
        {/* ============================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
          className="relative mx-auto mt-10 max-w-3xl sm:mt-12"
        >

          <div className="relative">

            {/* Search icon */}

            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 sm:left-5"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />

              <path d="m20 20-4-4" />
            </svg>


            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search for a movie you've watched..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-12 py-4 text-sm text-white outline-none backdrop-blur-xl transition duration-300 placeholder:text-white/25 focus:border-white/25 focus:bg-white/[0.055] sm:px-14 sm:py-5 sm:text-base"
            />


            {searchLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/35 sm:right-5 sm:text-xs">
                Searching...
              </div>
            )}

          </div>


          {/* Search results */}

          <AnimatePresence>

            {searchQuery.trim() &&
              !searchLoading &&
              searchResults.length > 0 && (

                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 max-h-[60vh] overflow-y-auto overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/95 shadow-2xl backdrop-blur-2xl"
                >

                  {searchResults.map(
                    (movie, index) => {

                      const title =
                        getMovieTitle(movie)

                      const alreadySelected =
                        selectedMovies.some(
                          (selectedMovie) =>
                            selectedMovie.title === title
                        )

                      return (
                        <button
                          key={`${title}-${index}`}
                          type="button"
                          disabled={alreadySelected}
                          onClick={() =>
                            selectMovie(movie)
                          }
                          className="flex min-h-[60px] w-full items-center justify-between gap-4 border-b border-white/[0.06] px-4 py-4 text-left transition last:border-b-0 hover:bg-white/[0.05] disabled:cursor-default disabled:opacity-35 sm:px-5"
                        >

                          <div className="min-w-0">

                            <p className="truncate text-sm font-medium text-white/90">
                              {title}
                            </p>

                            {alreadySelected && (
                              <p className="mt-1 text-xs text-white/30">
                                Already selected
                              </p>
                            )}

                          </div>


                          {!alreadySelected && (
                            <span className="shrink-0 text-[10px] text-white/40 sm:text-xs">
                              Select →
                            </span>
                          )}

                        </button>
                      )
                    }
                  )}

                </motion.div>
              )}

          </AnimatePresence>

        </motion.div>


        {/* ============================================== */}
        {/* NOT FOUND / ADD MOVIE */}
        {/* ============================================== */}

        {searchQuery.trim() &&
          !searchLoading &&
          searchResults.length === 0 && (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-auto mt-6 max-w-3xl text-center"
            >

              <p className="text-sm text-white/35">
                Can't find the movie you're looking for?
              </p>


              {!showAddMovie ? (

                <button
                  type="button"
                  onClick={() => setShowAddMovie(true)}
                  className="mt-3 text-sm text-white/70 underline underline-offset-4 transition hover:text-white"
                >
                  + Add a movie manually
                </button>

              ) : (

                <div className="mx-auto mt-5 flex w-full max-w-xl flex-col gap-3 sm:flex-row">

                  <input
                    type="text"
                    value={customMovieTitle}
                    onChange={(event) =>
                      setCustomMovieTitle(
                        event.target.value
                      )
                    }
                    placeholder="Enter movie title..."
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
                  />


                  <button
                    type="button"
                    onClick={addCustomMovie}
                    className="w-full rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/85 sm:w-auto"
                  >
                    Add
                  </button>

                </div>
              )}

            </motion.div>
          )}


        {/* ============================================== */}
        {/* ERROR */}
        {/* ============================================== */}

        {error && (
          <div className="mx-auto mt-6 max-w-xl rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}


        {/* ============================================== */}
        {/* SELECTED MOVIES */}
        {/* ============================================== */}

        <section className="mt-14 sm:mt-16">

          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                Your selections
              </p>

              <h2 className="mt-2 text-xl font-medium sm:text-2xl">
                Movies you've watched
              </h2>

            </div>

            <div className="text-sm text-white/35">
              {ratedMovieCount} rated
            </div>

          </div>


          {selectedMovies.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-white/10 px-5 py-14 text-center sm:px-6 sm:py-16">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white/30">

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 5h16v14H4z" />
                  <path d="m8 5 2 14" />
                  <path d="m14 5 2 14" />
                </svg>

              </div>

              <p className="mt-5 text-sm text-white/35">
                Search above to add movies you've watched.
              </p>

            </div>

          ) : (

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <AnimatePresence>

                {selectedMovies.map(
                  (movie, index) => (

                    <motion.div
                      key={movie.title}
                      layout
                      initial={{
                        opacity: 0,
                        scale: 0.96,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.96,
                      }}
                      transition={{
                        duration: 0.35,
                      }}
                      className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 backdrop-blur-xl sm:p-5"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <span className="text-xs text-white/25">
                            {String(index + 1).padStart(
                              2,
                              '0'
                            )}
                          </span>

                          <h3 className="mt-2 line-clamp-2 text-sm font-medium text-white/90 sm:text-base">
                            {movie.title}
                          </h3>

                          {movie.isCustom && (
                            <span className="mt-2 inline-block text-[10px] uppercase tracking-wider text-white/25">
                              Added manually
                            </span>
                          )}

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            removeMovie(movie.title)
                          }
                          className="shrink-0 text-xs text-white/25 transition hover:text-white/70"
                          aria-label={`Remove ${movie.title}`}
                        >
                          Remove
                        </button>

                      </div>


                      {/* Rating */}

                      <div className="mt-6 sm:mt-7">

                        <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-white/25">
                          Your rating
                        </p>


                        <div className="grid grid-cols-5 gap-2">

                          {[1, 2, 3, 4, 5].map(
                            (rating) => (

                              <button
                                key={rating}
                                type="button"
                                onClick={() =>
                                  rateMovie(
                                    movie.title,
                                    rating
                                  )
                                }
                                aria-label={`Rate ${movie.title} ${rating} out of 5`}
                                className={`flex h-10 w-full items-center justify-center rounded-full border text-sm transition-all duration-300 sm:h-11 ${
                                  movie.rating === rating
                                    ? 'border-white bg-white text-black'
                                    : 'border-white/10 text-white/35 hover:border-white/30 hover:text-white'
                                }`}
                              >
                                {rating}
                              </button>

                            )
                          )}

                        </div>

                      </div>

                    </motion.div>
                  )
                )}

              </AnimatePresence>

            </div>
          )}

        </section>


        {/* ============================================== */}
        {/* CONTINUE */}
        {/* ============================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.4,
          }}
          className="mt-12 flex flex-col items-center sm:mt-14"
        >

          <button
            type="button"
            disabled={ratedMovieCount === 0 || submitting}
            onClick={handleContinue}
            className="w-full rounded-full bg-white px-9 py-4 text-sm font-medium text-black transition duration-300 hover:scale-[1.02] hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-25 sm:w-auto"
          >
            {submitting
              ? 'Building your recommendations...'
              : 'Build My Recommendations →'}
          </button>


          <p className="mt-4 text-center text-xs text-white/25">
            Rate at least one movie to continue.
          </p>

        </motion.div>

      </main>

    </div>
  )
}

export default InitialRating