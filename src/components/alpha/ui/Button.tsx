import type { ReactNode } from 'react'
import { MagneticWrapper } from './MagneticWrapper'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  onClick?: () => void
}

const variants = {
  primary: 'bg-primary text-white hover:bg-red-700',
  secondary: 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'bg-transparent text-muted hover:text-text',
}

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <MagneticWrapper strength={0.3}>
      <button
        onClick={onClick}
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${variants[variant]}`}
      >
        {children}
      </button>
    </MagneticWrapper>
  )
}
