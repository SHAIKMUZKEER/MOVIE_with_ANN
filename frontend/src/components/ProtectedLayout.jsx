import { Outlet } from 'react-router'
import Navbar from './Navbar'
import Footer from './Footer'

function ProtectedLayout() {
  return (
    <div className="relative min-h-screen bg-transparent text-white">

      {/* ========================================= */}
      {/* NAVBAR */}
      {/* ========================================= */}

      <Navbar />


      {/* ========================================= */}
      {/* PAGE CONTENT */}
      {/* ========================================= */}

      <main className="relative">
        <Outlet />
      </main>


      {/* ========================================= */}
      {/* FOOTER */}
      {/* ========================================= */}

      <Footer />

    </div>
  )
}

export default ProtectedLayout