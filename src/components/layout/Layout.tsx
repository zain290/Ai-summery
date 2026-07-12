import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { useState, useEffect } from 'react'

export function Layout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = document.documentElement
    root.classList.add(theme)
    root.classList.add(`theme-${theme}`)
    return () => {
      root.classList.remove(theme, `theme-${theme}`)
    }
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  return (
    <div className="bg-background text-text min-h-screen transition-colors duration-500 selection:bg-primary selection:text-white w-full">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="w-full min-h-screen">
        {children}
      </main>
      <Footer theme={theme} />
    </div>
  )
}
