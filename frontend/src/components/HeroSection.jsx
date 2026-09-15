import { motion } from 'motion/react'
import { Link } from 'react-router'

function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-[#080808]">

      {/* ========================================= */}
      {/* CINEMATIC BACKGROUND */}
      {/* ========================================= */}

      <div className="pointer-events-none absolute inset-0">

        {/* Main soft glow */}
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[120px] sm:h-[650px] sm:w-[650px]" />

        {/* Right cinematic rings */}
        <div className="absolute -right-32 top-24 h-[420px] w-[420px] rounded-full border border-white/[0.06] sm:h-[550px] sm:w-[550px]" />

        <div className="absolute -right-20 top-36 h-[300px] w-[300px] rounded-full border border-white/[0.05] sm:h-[400px] sm:w-[400px]" />

        {/* Bottom glow */}
        <div className="absolute bottom-[-200px] left-1/3 h-[450px] w-[450px] rounded-full bg-white/[0.015] blur-[100px]" />

      </div>

      {/* ========================================= */}
      {/* HERO CONTENT */}
      {/* ========================================= */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">

        <div className="w-full max-w-5xl">

          {/* Eyebrow */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
            className="mb-7 flex items-center gap-4 sm:mb-9"
          >

            <span className="h-px w-10 bg-white/20 sm:w-14" />

            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 sm:text-xs sm:tracking-[0.35em]">
              Intelligent Movie Discovery
            </p>

          </motion.div>

          {/* ========================================= */}
          {/* MAIN HEADING */}
          {/* ========================================= */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 35,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.1,
              ease: 'easeOut',
            }}
            className="max-w-5xl text-[3.5rem] font-semibold leading-[0.92] tracking-[-0.055em] text-white sm:text-[5rem] md:text-[6rem] lg:text-[7.5rem] xl:text-[8rem]"
          >

            Discover movies
            <br />

            <span className="text-white/35">
              made for you.
            </span>

          </motion.h1>

          {/* ========================================= */}
          {/* DESCRIPTION */}
          {/* ========================================= */}

          <motion.p
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: 'easeOut',
            }}
            className="mt-8 max-w-3xl text-base leading-7 text-white/55 sm:mt-10 sm:text-lg sm:leading-8 lg:text-xl"
          >
            Rate the movies you love and let our neural network
            learn your preferences to discover movies you'll
            actually want to watch.
          </motion.p>

          {/* ========================================= */}
          {/* BUTTONS */}
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
              duration: 0.8,
              delay: 0.4,
              ease: 'easeOut',
            }}
            className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:items-center sm:gap-4"
          >

            {/* Primary */}

            <Link
              to="/signup"
              className="group inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 sm:w-auto sm:px-8"
            >
              <span>
                Start Discovering
              </span>

              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>

            </Link>

            {/* Secondary */}

            <a
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/10 px-7 py-4 text-sm font-medium text-white/75 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] hover:text-white sm:w-auto sm:px-8"
            >
              How It Works
            </a>

          </motion.div>

        </div>

      </div>

      {/* ========================================= */}
      {/* HOW IT WORKS */}
      {/* ========================================= */}

      <div
        id="how-it-works"
        className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10"
      >

        <div className="border-t border-white/[0.08] pt-10 sm:pt-14">

          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">

            {/* STEP 01 */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.7,
              }}
            >

              <p className="text-2xl font-semibold text-white">
                01
              </p>

              <p className="mt-4 max-w-xs text-sm leading-6 text-white/45">
                Rate movies you have watched.
              </p>

            </motion.div>

            {/* STEP 02 */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
            >

              <p className="text-2xl font-semibold text-white">
                02
              </p>

              <p className="mt-4 max-w-xs text-sm leading-6 text-white/45">
                Our ANN learns your preferences.
              </p>

            </motion.div>

            {/* STEP 03 */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.7,
                delay: 0.2,
              }}
            >

              <p className="text-2xl font-semibold text-white">
                03
              </p>

              <p className="mt-4 max-w-xs text-sm leading-6 text-white/45">
                Get personalized recommendations.
              </p>

            </motion.div>

          </div>

        </div>

      </div>

    </section>
  )
}

export default HeroSection