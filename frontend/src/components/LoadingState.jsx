import { motion } from 'motion/react'

function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="cinematic-loading" role="status" aria-live="polite">
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
        className="cinematic-loading__ring"
      />
      <span>{label}</span>
    </div>
  )
}

export default LoadingState
