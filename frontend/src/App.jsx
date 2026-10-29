import { BrowserRouter, Routes, Route } from 'react-router'

import Recommendations from './pages/Recommendations'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOTP from './pages/VerifyOTP'
import ResetPassword from './pages/ResetPassword'
import InitialRating from './pages/InitialRating'
import Profile from './pages/Profile'
import Movies from './pages/Movies'

import ProtectedRoute from './components/ProtectedRoute'
import ProtectedLayout from './components/ProtectedLayout'
import CinematicBackground from './components/CinematicBackground'

function App() {
  return (
    <BrowserRouter>

      {/* GLOBAL CINEMATIC ENVIRONMENT */}

      <CinematicBackground />

      {/* APPLICATION CONTENT */}

      <div className="relative z-10">

        <Routes>

          {/* PUBLIC ROUTES */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/verify-otp"
            element={<VerifyOTP />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />


          {/* PROTECTED ROUTES */}

          <Route element={<ProtectedRoute />}>

            <Route element={<ProtectedLayout />}>

              <Route
                path="/initial-rating"
                element={<InitialRating />}
              />

              <Route
                path="/movies"
                element={<Movies />}
              />

              <Route
                path="/recommendations"
                element={<Recommendations />}
              />

              <Route
                path="/profile"
                element={<Profile />}
              />

            </Route>

          </Route>

        </Routes>

      </div>

    </BrowserRouter>
  )
}

export default App