import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './theme/ThemeProvider'
import { Layout } from './components/layout/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Home } from './pages/Home'
import { History } from './pages/History'
import { Instructions } from './pages/Instructions'
import { NotFound } from './pages/NotFound'
import { ROUTES } from './utils/constants'

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path={ROUTES.home} element={<Home />} />
              <Route path={ROUTES.history} element={<History />} />
              <Route path={ROUTES.instructions} element={<Instructions />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
