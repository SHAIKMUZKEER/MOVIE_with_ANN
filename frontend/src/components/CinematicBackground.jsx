import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import CinematicScene from './CinematicScene'

import movieCollage from '../images/anika-de-klerk-dWYjy9zIiF8-unsplash.jpg'
import filmReel from '../images/tyson-moultrie-BQTHOGNHo08-unsplash.jpg'
import cosmicCinema from '../images/ChatGPT Image Sep 15, 2026, 10_11_54 PM.png'

const slideshowImages = [movieCollage, filmReel, cosmicCinema]

function CinematicBackground() {
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveImage((currentImage) => (currentImage + 1) % slideshowImages.length)
    }, 5000)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="cinematic-background pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-[#050817]">
        {slideshowImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out ${
              activeImage === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(2,4,12,0.7)_0%,rgba(2,4,12,0.28)_42%,rgba(2,4,12,0.72)_100%)]" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,transparent_12%,rgba(1,3,12,0.46)_100%)]" />
      <div className="absolute inset-0 z-[3] opacity-35">
        <CinematicScene />
      </div>
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute left-[-15%] top-[5%] z-10 h-[500px] w-[500px] rounded-full bg-blue-600/[0.08] blur-[140px] sm:h-[700px] sm:w-[700px]"
      />
      <motion.div
        animate={{
          x: [0, -45, 25, 0],
          y: [0, 25, -20, 0],
          scale: [1, 0.94, 1.08, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute right-[-15%] top-[8%] z-10 h-[500px] w-[500px] rounded-full bg-violet-600/[0.08] blur-[140px] sm:h-[700px] sm:w-[700px]"
      />
      <motion.div
        animate={{
          x: [0, 35, -25, 0],
          y: [0, -20, 25, 0],
          scale: [1, 1.06, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-[-20%] right-[5%] z-10 h-[450px] w-[450px] rounded-full bg-fuchsia-600/[0.04] blur-[140px] sm:h-[600px] sm:w-[600px]"
      />
      <div
        className="absolute inset-0 z-10 opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(circle at center, black, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 72%)',
        }}
      />
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(1,3,12,0.52)_100%)]" />
    </div>
  )
}

export default CinematicBackground