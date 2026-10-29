import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '../context/useAuth'

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef(null)

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const handleNavClick = (path, e) => {
    closeMenu()

    if (path === '/') {
      if (location.pathname === '/') {
        e?.preventDefault()
        if (location.hash) {
          navigate('/', { replace: true })
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else if (path.startsWith('/#')) {
      const id = path.replace('/#', '')
      if (location.pathname === '/') {
        e?.preventDefault()
        navigate(path)
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const scrollToElement = () => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
          return true
        }
        return false
      }

      if (!scrollToElement()) {
        const timer = setTimeout(scrollToElement, 100)
        return () => clearTimeout(timer)
      }
    }
  }, [location.pathname, location.hash])

  const isLinkActive = (path) => {
    if (path.startsWith('/#')) {
      return location.pathname + location.hash === path
    }
    return location.pathname === path && !location.hash
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (menuOpen && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [menuOpen])

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
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#050817]/70 backdrop-blur-2xl">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-10">

        {/* ===================================== */}
        {/* LOGO */}
        {/* ===================================== */}

        <Link
          to="/"
          onClick={(e) => handleNavClick('/', e)}
          className="group flex items-center gap-3"
        >

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-300 to-blue-500 text-lg font-bold text-slate-950 shadow-[0_0_30px_rgba(99,102,241,0.28)] transition-transform duration-500 group-hover:rotate-6">
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

            const isActive = isLinkActive(link.path)

            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => handleNavClick(link.path, e)}
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

          {/* Login / Signup */}

          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className={`rounded-full px-5 py-2.5 text-sm transition-all duration-300 ${
                  location.pathname === '/login'
                    ? 'bg-white/[0.08] text-white'
                    : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={closeMenu}
                className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/signup'
                    ? 'border-white/30 bg-white/[0.12] text-white'
                    : 'border-white/15 bg-white/[0.06] text-white hover:border-white/30 hover:bg-white/[0.12]'
                }`}
              >
                Signup
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

                  const isActive = isLinkActive(link.path)

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
                        onClick={(e) => handleNavClick(link.path, e)}
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
                      className={`rounded-2xl border px-4 py-3.5 text-center text-sm transition ${
                        location.pathname === '/login'
                          ? 'border-white/30 bg-white/[0.08] text-white'
                          : 'border-white/10 text-white/70 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      Login
                    </Link>

                    <Link
                      to="/signup"
                      onClick={closeMenu}
                      className={`rounded-2xl border px-4 py-3.5 text-center text-sm font-medium transition ${
                        location.pathname === '/signup'
                          ? 'border-white/30 bg-white/[0.12] text-white'
                          : 'border-white/15 bg-white/[0.06] text-white hover:border-white/30 hover:bg-white/[0.12]'
                      }`}
                    >
                      Signup
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