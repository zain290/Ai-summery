import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-text font-sans transition-colors duration-500">
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
