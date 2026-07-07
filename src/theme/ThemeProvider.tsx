import type { ReactNode } from 'react'
import { ThemeContext } from './ThemeContext'
import { tokens } from './tokens'

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={tokens}>
      {children}
    </ThemeContext.Provider>
  )
}
