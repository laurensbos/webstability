import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route, Navigate, useParams, useSearchParams } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import CookieConsent from './components/CookieConsent'
import { AuthProvider } from './contexts/AuthContext'
import { DarkModeProvider } from './contexts/DarkModeContext'
import ProtectedRoute from './components/ProtectedRoute'
import { initSentry } from './lib/sentry'

// Initialize i18n
import './lib/i18n'

// Initialize Sentry error tracking
initSentry()

// Redirect components that preserve URL parameters
function RedirectToOnboarding() {
  const { projectId } = useParams()
  const [searchParams] = useSearchParams()
  const queryString = searchParams.toString()
  const url = projectId ? `/onboarding/${projectId}` : '/onboarding'
  return <Navigate to={queryString ? `${url}?${queryString}` : url} replace />
}

function RedirectToStatus() {
  const { projectId } = useParams()
  const [searchParams] = useSearchParams()
  const queryString = searchParams.toString()
  const url = projectId ? `/status/${projectId}` : '/status'
  return <Navigate to={queryString ? `${url}?${queryString}` : url} replace />
}

// Lazy load pagina's voor betere performance
const Portfolio = lazy(() => import('./pages/Portfolio'))
const Deal = lazy(() => import('./pages/Deal'))
const Kennisbank = lazy(() => import('./pages/Kennisbank'))
const Article = lazy(() => import('./pages/Article'))
const Contact = lazy(() => import('./pages/Contact'))
const StartProject = lazy(() => import('./pages/StartProject'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const KlantOnboarding = lazy(() => import('./pages/KlantOnboarding'))
const ProjectStatus = lazy(() => import('./pages/ProjectStatus'))
const OverOns = lazy(() => import('./pages/OverOns'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Voorwaarden = lazy(() => import('./pages/Voorwaarden'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Bedankt = lazy(() => import('./pages/Bedankt'))
const Webshop = lazy(() => import('./pages/Webshop'))
const Websites = lazy(() => import('./pages/Websites'))
const LogoMaken = lazy(() => import('./pages/LogoMaken'))
const Luchtvideografie = lazy(() => import('./pages/Dronebeelden'))
const StartService = lazy(() => import('./pages/StartService'))
const BedanktService = lazy(() => import('./pages/BedanktService'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const WachtwoordResetten = lazy(() => import('./pages/WachtwoordResetten'))
const DeveloperDashboard = lazy(() => import('./components/developer/DeveloperDashboardNew'))
const Login = lazy(() => import('./pages/Login'))
const MarketingDashboard = lazy(() => import('./pages/MarketingDashboard'))
const Unauthorized = lazy(() => import('./pages/Unauthorized'))
const ClientOnboarding = lazy(() => import('./pages/ClientOnboarding'))
const EmailVerified = lazy(() => import('./pages/EmailVerified'))
const MijnProjecten = lazy(() => import('./pages/MijnProjecten'))

// Loading spinner component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">Laden...</p>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DarkModeProvider>
        <AuthProvider>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* === HOMEPAGE === */}
              <Route path="/" element={<App />} />
              
              {/* === SERVICES === */}
              <Route path="/start" element={<StartProject />} />
              <Route path="/start/:serviceType" element={<StartService />} />
              <Route path="/websites" element={<Websites />} />
              <Route path="/website-laten-maken" element={<Navigate to="/websites" replace />} />
              <Route path="/webshop" element={<Webshop />} />
              <Route path="/webshop-laten-maken" element={<Navigate to="/webshop" replace />} />
              <Route path="/logo-maken" element={<LogoMaken />} />
              <Route path="/logo" element={<Navigate to="/logo-maken" replace />} />
              <Route path="/logo-laten-maken" element={<Navigate to="/logo-maken" replace />} />
              <Route path="/luchtvideografie" element={<Luchtvideografie />} />
              <Route path="/luchtfoto" element={<Navigate to="/luchtvideografie" replace />} />
              <Route path="/dronebeelden" element={<Navigate to="/luchtvideografie" replace />} />
              <Route path="/drone" element={<Navigate to="/luchtvideografie" replace />} />
              
              {/* === THANK YOU PAGES === */}
              <Route path="/bedankt" element={<Bedankt />} />
              <Route path="/bedankt-service" element={<BedanktService />} />
              
              {/* === CLIENT PORTAL === */}
              <Route path="/status/:projectId" element={<ProjectStatus />} />
              <Route path="/status" element={<ProjectStatus />} />
              <Route path="/project-status/:projectId" element={<RedirectToStatus />} />
              <Route path="/project-status" element={<Navigate to="/status" replace />} />
              <Route path="/project/:projectId" element={<RedirectToStatus />} />
              <Route path="/project" element={<Navigate to="/status" replace />} />
              <Route path="/mijn-projecten" element={<MijnProjecten />} />
              <Route path="/my-projects" element={<Navigate to="/mijn-projecten" replace />} />
              
              {/* === ONBOARDING === */}
              <Route path="/onboarding/:projectId" element={<KlantOnboarding />} />
              <Route path="/onboarding" element={<KlantOnboarding />} />
              <Route path="/klant-onboarding/:projectId" element={<RedirectToOnboarding />} />
              <Route path="/klant-onboarding" element={<Navigate to="/onboarding" replace />} />
              <Route path="/intake/:projectId" element={<ClientOnboarding />} />
              <Route path="/intake" element={<ClientOnboarding />} />
              
              {/* === AUTH === */}
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/wachtwoord-resetten" element={<WachtwoordResetten />} />
              <Route path="/wachtwoord-vergeten" element={<Navigate to="/wachtwoord-resetten" replace />} />
              <Route path="/email-verified" element={<EmailVerified />} />
              <Route path="/email-bevestigd" element={<Navigate to="/email-verified" replace />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* === CONTENT PAGES === */}
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/case-studies" element={<Navigate to="/portfolio" replace />} />
              <Route path="/succesverhalen" element={<Navigate to="/portfolio" replace />} />
              <Route path="/kennisbank" element={<Kennisbank />} />
              <Route path="/kennisbank/:slug" element={<Article />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/over-ons" element={<OverOns />} />
              <Route path="/deal" element={<Deal />} />
              
              {/* === LEGAL === */}
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/voorwaarden" element={<Voorwaarden />} />
              <Route path="/prijzen" element={<Navigate to="/#pricing" replace />} />
              <Route path="/pricing" element={<Navigate to="/#pricing" replace />} />
              
              {/* === ADMIN DASHBOARDS (Protected) === */}
              <Route path="/dash" element={<Dashboard />} />
              <Route 
                path="/developer" 
                element={
                  <ProtectedRoute requireRole="developer">
                    <DeveloperDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/websales" 
                element={
                  <ProtectedRoute requireRole="marketing">
                    <MarketingDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* === 404 === */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          {/* Cookie consent banner */}
          <CookieConsent />
        </Suspense>
        </AuthProvider>
      </DarkModeProvider>
    </BrowserRouter>
  </StrictMode>,
)
