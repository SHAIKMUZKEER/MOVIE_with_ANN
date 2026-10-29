function GlassCard({ children, className = '', as: Element = 'div' }) {
  return (
    <Element className={`glass-surface rounded-3xl ${className}`}>
      {children}
    </Element>
  )
}

export default GlassCard
