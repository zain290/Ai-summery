import { Link } from 'react-router-dom'
import { ROUTES } from '../utils/constants'

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-lg text-text-muted mb-6">Page not found</p>
      <Link
        to={ROUTES.home}
        className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition"
      >
        Go Home
      </Link>
    </div>
  )
}
