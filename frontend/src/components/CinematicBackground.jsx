import { motion } from 'motion/react'
import CinematicScene from './CinematicScene'

function CinematicBackground() {

  return (

    <div
      className="
        fixed
        inset-0
        z-0
        overflow-hidden
        bg-[#02030a]
      "
    >

      {/* =================================================
          3D WORLD
      ================================================= */}

      <div
        className="
          absolute
          inset-0
          z-0
        "
      >

        <CinematicScene />

      </div>


      {/* =================================================
          BLUE NEBULA
      ================================================= */}

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
        className="
          pointer-events-none
          absolute
          left-[-15%]
          top-[5%]
          z-10
          h-[500px]
          w-[500px]
          rounded-full
          bg-blue-600/[0.09]
          blur-[140px]
          sm:h-[700px]
          sm:w-[700px]
        "
      />


      {/* =================================================
          PURPLE NEBULA
      ================================================= */}

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
        className="
          pointer-events-none
          absolute
          right-[-15%]
          top-[8%]
          z-10
          h-[500px]
          w-[500px]
          rounded-full
          bg-purple-600/[0.10]
          blur-[140px]
          sm:h-[700px]
          sm:w-[700px]
        "
      />


      {/* =================================================
          PINK ATMOSPHERE
      ================================================= */}

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
        className="
          pointer-events-none
          absolute
          bottom-[-20%]
          right-[5%]
          z-10
          h-[450px]
          w-[450px]
          rounded-full
          bg-fuchsia-600/[0.07]
          blur-[140px]
          sm:h-[600px]
          sm:w-[600px]
        "
      />


      {/* =================================================
          CINEMATIC LIGHT ARC
      ================================================= */}

      <motion.div
        animate={{
          rotate: [0, 3, -2, 0],
          x: [0, 20, -10, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="
          pointer-events-none
          absolute
          left-[-20%]
          top-[38%]
          z-10
          h-[250px]
          w-[140%]
          rotate-[-8deg]
          rounded-[50%]
          border
          border-indigo-400/[0.15]
          blur-[1px]
        "
      />


      {/* =================================================
          SECOND LIGHT ARC
      ================================================= */}

      <motion.div
        animate={{
          rotate: [0, -3, 2, 0],
          x: [0, -15, 10, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="
          pointer-events-none
          absolute
          left-[-20%]
          top-[42%]
          z-10
          h-[200px]
          w-[140%]
          rotate-[-8deg]
          rounded-[50%]
          border
          border-purple-400/[0.10]
          blur-[2px]
        "
      />


      {/* =================================================
          SUBTLE GRID
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-10
          opacity-[0.025]
        "
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',

          backgroundSize:
            '80px 80px',

          maskImage:
            'radial-gradient(circle at center, black, transparent 72%)',

          WebkitMaskImage:
            'radial-gradient(circle at center, black, transparent 72%)',
        }}
      />


      {/* =================================================
          VIGNETTE
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-20
          bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.50)_100%)]
        "
      />

    </div>

  )
}

export default CinematicBackground