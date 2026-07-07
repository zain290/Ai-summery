import { Link, useLocation } from 'react-router-dom'
import { ROUTES, APP_NAME } from '../../utils/constants'

export function Header() {
  const location = useLocation()

  const linkClass = (path: string) =>
    `transition-colors ${location.pathname === path ? 'text-text' : 'text-text-muted hover:text-text'}`

  return (
    <header className="border-b border-white/10 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={ROUTES.home} className="text-xl font-bold text-primary">
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link to={ROUTES.home} className={linkClass(ROUTES.home)}>Home</Link>
          <Link to={ROUTES.history} className={linkClass(ROUTES.history)}>History</Link>
          <Link to={ROUTES.instructions} className={linkClass(ROUTES.instructions)}>How to Use</Link>
        </nav>
      </div>
    </header>
  )
}
