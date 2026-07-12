import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './theme/ThemeProvider'
import { Layout } from './components/layout/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Home } from './pages/Home'
import { History } from './pages/History'
import { NotFound } from './pages/NotFound'
import { ROUTES } from './utils/constants'
import About from './pages/About'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import ScrollToTop from './components/alpha/ScrollToTop'

import { HelmetProvider } from 'react-helmet-async'

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ErrorBoundary>
        <BrowserRouter>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path={ROUTES.home} element={<Home />} />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
    </HelmetProvider>
  )
}
