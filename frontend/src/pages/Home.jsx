import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import Footer from '../components/Footer'

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="relative z-10">

        <Navbar />

        <HeroSection />

        <Footer />

      </div>

    </div>
  )
}

export default Home