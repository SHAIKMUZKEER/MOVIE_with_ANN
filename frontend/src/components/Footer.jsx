import { Link } from 'react-router'

function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#070707] text-white">

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">

        {/* Main footer */}

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}

          <div className="lg:col-span-2">

            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-bold text-black">
                M
              </div>

              <div>

                <p className="text-lg font-semibold tracking-wide">
                  MOVIEAI
                </p>

                <p className="mt-0.5 text-[9px] uppercase tracking-[0.3em] text-white/30">
                  Recommendation System
                </p>

              </div>

            </Link>

            <p className="mt-7 max-w-md text-sm leading-7 text-white/35">
              Discover movies tailored to your taste
              through intelligent recommendations powered
              by an artificial neural network.
            </p>

          </div>

          {/* Explore */}

          <div>

            <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/30">
              Explore
            </p>

            <div className="mt-5 flex flex-col gap-3">

              <Link
                to="/"
                className="w-fit text-sm text-white/45 transition-colors hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/movies"
                className="w-fit text-sm text-white/45 transition-colors hover:text-white"
              >
                Movies
              </Link>

              <Link
                to="/recommendations"
                className="w-fit text-sm text-white/45 transition-colors hover:text-white"
              >
                Recommendations
              </Link>

            </div>

          </div>

          {/* Account */}

          <div>

            <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/30">
              Account
            </p>

            <div className="mt-5 flex flex-col gap-3">

              <Link
                to="/profile"
                className="w-fit text-sm text-white/45 transition-colors hover:text-white"
              >
                Profile
              </Link>

              <Link
                to="/login"
                className="w-fit text-sm text-white/45 transition-colors hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="w-fit text-sm text-white/45 transition-colors hover:text-white"
              >
                Create Account
              </Link>

            </div>

          </div>

        </div>

        {/* Divider */}

        <div className="my-12 h-px bg-white/[0.07]" />

        {/* Bottom */}

        <div className="flex flex-col gap-4 text-xs text-white/25 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2026 MovieAI. All rights reserved.
          </p>

          <p>
            Intelligent movie discovery.
          </p>

        </div>

      </div>

    </footer>
  )
}

export default Footer