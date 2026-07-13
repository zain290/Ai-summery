import { Link } from 'react-router-dom'
import { ROUTES, APP_NAME } from '../utils/constants'
import SEO from '../components/layout/SEO'

export function NotFound() {
  return (
    <>
      <SEO
        title={`Page Not Found | ${APP_NAME}`}
        description="The page you are looking for does not exist. Return to the homepage."
        canonicalUrl={window.location.origin + '/404'}
        noindex
      />
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
    </>
  )
}
