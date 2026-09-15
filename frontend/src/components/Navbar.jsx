import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const handleLogout = () => {
    closeMenu()
    logout()
  }

  const publicLinks = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'How It Works',
      path: '/#how-it-works',
    },
    {
      name: 'About',
      path: '/#about',
    },
  ]

  const protectedLinks = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'Movies',
      path: '/movies',
    },
    {
      name: 'Recommendations',
      path: '/recommendations',
    },
    {
      name: 'Profile',
      path: '/profile',
    },
  ]

  const links = isAuthenticated
    ? protectedLinks
    : publicLinks

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080808]/90 backdrop-blur-xl">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-10">

        {/* ===================================== */}
        {/* LOGO */}
        {/* ===================================== */}

        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-bold text-black">
            M
          </div>

          <div className="hidden sm:block">

            <p className="text-lg font-semibold tracking-tight text-white">
              MOVIEAI
            </p>

            <p className="text-[9px] uppercase tracking-[0.3em] text-white/25">
              Recommendation System
            </p>

          </div>

        </Link>

        {/* ===================================== */}
        {/* DESKTOP NAVIGATION */}
        {/* ===================================== */}

        <nav className="hidden items-center gap-2 md:flex">

          {links.map((link) => {

            const isActive =
              link.path === location.pathname

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`rounded-full px-5 py-2.5 text-sm transition-all duration-300 ${
                  isActive
                    ? 'bg-white/[0.08] text-white'
                    : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            )
          })}

          {/* Logout */}

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="ml-3 rounded-full bg-white/[0.08] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              Sign Out
            </button>
          )}

          {/* Login / Get Started */}

          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="ml-3 rounded-full px-5 py-3 text-sm text-white/70 transition hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90"
              >
                Get Started
              </Link>
            </>
          )}

        </nav>

        {/* ===================================== */}
        {/* MOBILE MENU BUTTON */}
        {/* ===================================== */}

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08] md:hidden"
          aria-label={
            menuOpen
              ? 'Close navigation menu'
              : 'Open navigation menu'
          }
          aria-expanded={menuOpen}
        >

          <div className="relative h-5 w-5">

            <motion.span
              animate={
                menuOpen
                  ? {
                      rotate: 45,
                      y: 7,
                    }
                  : {
                      rotate: 0,
                      y: 0,
                    }
              }
              className="absolute left-0 top-0 h-[2px] w-5 rounded-full bg-white"
            />

            <motion.span
              animate={{
                opacity: menuOpen ? 0 : 1,
              }}
              className="absolute left-0 top-[7px] h-[2px] w-5 rounded-full bg-white"
            />

            <motion.span
              animate={
                menuOpen
                  ? {
                      rotate: -45,
                      y: -7,
                    }
                  : {
                      rotate: 0,
                      y: 14,
                    }
              }
              className="absolute left-0 top-[14px] h-[2px] w-5 rounded-full bg-white"
            />

          </div>

        </button>

      </div>

      {/* ===================================== */}
      {/* MOBILE NAVIGATION */}
      {/* ===================================== */}

      <AnimatePresence>

        {menuOpen && (

          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: 'auto',
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.35,
              ease: 'easeInOut',
            }}
            className="overflow-hidden border-t border-white/[0.06] md:hidden"
          >

            <nav className="mx-auto max-w-7xl px-5 py-5 sm:px-6">

              <div className="flex flex-col gap-2">

                {links.map((link, index) => {

                  const isActive =
                    link.path === location.pathname

                  return (
                    <motion.div
                      key={link.name}
                      initial={{
                        opacity: 0,
                        x: -15,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                    >

                      <Link
                        to={link.path}
                        onClick={closeMenu}
                        className={`block rounded-2xl px-4 py-3.5 text-sm transition ${
                          isActive
                            ? 'bg-white/[0.08] text-white'
                            : 'text-white/55 hover:bg-white/[0.04] hover:text-white'
                        }`}
                      >
                        {link.name}
                      </Link>

                    </motion.div>
                  )
                })}

                {/* Mobile logout */}

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 w-full rounded-2xl bg-white/[0.08] px-4 py-3.5 text-left text-sm font-medium text-white transition hover:bg-white hover:text-black"
                  >
                    Sign Out
                  </button>
                )}

                {/* Mobile auth buttons */}

                {!isAuthenticated && (
                  <div className="mt-2 grid grid-cols-2 gap-2">

                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="rounded-2xl border border-white/10 px-4 py-3.5 text-center text-sm text-white/70 transition hover:bg-white/[0.05] hover:text-white"
                    >
                      Login
                    </Link>

                    <Link
                      to="/signup"
                      onClick={closeMenu}
                      className="rounded-2xl bg-white px-4 py-3.5 text-center text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      Get Started
                    </Link>

                  </div>
                )}

              </div>

            </nav>

          </motion.div>

        )}

      </AnimatePresence>

    </header>
  )
}

export default Navbar