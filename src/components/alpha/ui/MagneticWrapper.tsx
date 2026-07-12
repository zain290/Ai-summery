import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useMagneticEffect } from '../../../hooks/useMagneticEffect'

interface MagneticWrapperProps {
  children: ReactNode
  strength?: number
  className?: string
}

export function MagneticWrapper({ children, strength = 0.5, className = '' }: MagneticWrapperProps) {
  const { ref, style, onMouseMove, onMouseLeave } = useMagneticEffect(strength)

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={style}
    >
      {children}
    </motion.div>
  )
}
