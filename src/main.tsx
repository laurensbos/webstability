import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import CookieConsent from './components/CookieConsent'
import { AuthProvider } from './contexts/AuthContext'
import { DarkModeProvider } from './contexts/DarkModeContext'
import ProtectedRoute from './components/ProtectedRoute'
import { initSentry } from './lib/sentry'

// Initialize Sentry error tracking
initSentry()

// Lazy load pagina's voor betere performance
const OnboardingWizard = lazy(() => import('./components/OnboardingWizard').then(m => ({ default: m.OnboardingWizard })))
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
const DeveloperDashboard = lazy(() => import('./pages/DeveloperDashboard'))
const Login = lazy(() => import('./pages/Login'))
const MarketingDashboard = lazy(() => import('./pages/MarketingDashboardNew'))
const Unauthorized = lazy(() => import('./pages/Unauthorized'))
const ClientOnboarding = lazy(() => import('./pages/ClientOnboarding'))

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
              <Route path="/" element={<App />} />
              <Route path="/wizard" element={<OnboardingWizard />} />
              <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/case-studies" element={<Navigate to="/portfolio" replace />} />
            <Route path="/succesverhalen" element={<Navigate to="/portfolio" replace />} />
            <Route path="/deal" element={<Deal />} />
            <Route path="/kennisbank" element={<Kennisbank />} />
            <Route path="/kennisbank/:slug" element={<Article />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/start" element={<StartProject />} />
            <Route path="/bedankt" element={<Bedankt />} />
            <Route path="/dash" element={<Dashboard />} />
            
            {/* Login route */}
            <Route path="/login" element={<Login />} />
            
            {/* Onboarding routes - canonical path + redirects */}
            <Route path="/onboarding/:projectId" element={<KlantOnboarding />} />
            <Route path="/onboarding" element={<KlantOnboarding />} />
            <Route path="/klant-onboarding/:projectId" element={<Navigate to="/onboarding/:projectId" replace />} />
            <Route path="/klant-onboarding" element={<Navigate to="/onboarding" replace />} />
            
            {/* New client onboarding with service-specific forms */}
            <Route path="/intake/:projectId" element={<ClientOnboarding />} />
            <Route path="/intake" element={<ClientOnboarding />} />
            
            {/* Project status routes - canonical path + redirects */}
            <Route path="/status/:projectId" element={<ProjectStatus />} />
            <Route path="/status" element={<ProjectStatus />} />
            <Route path="/project-status/:projectId" element={<Navigate to="/status/:projectId" replace />} />
            <Route path="/project-status" element={<Navigate to="/status" replace />} />
            <Route path="/project/:projectId" element={<Navigate to="/status/:projectId" replace />} />
            <Route path="/project" element={<Navigate to="/status" replace />} />
            
            <Route path="/over-ons" element={<OverOns />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/voorwaarden" element={<Voorwaarden />} />
            <Route path="/webshop" element={<Webshop />} />
            <Route path="/webshop-laten-maken" element={<Webshop />} />
            <Route path="/websites" element={<Websites />} />
            <Route path="/website-laten-maken" element={<Websites />} />
            <Route path="/logo-maken" element={<LogoMaken />} />
            <Route path="/prijzen" element={<Navigate to="/#pricing" replace />} />
            <Route path="/pricing" element={<Navigate to="/#pricing" replace />} />
            <Route path="/logo" element={<LogoMaken />} />
            <Route path="/logo-laten-maken" element={<LogoMaken />} />
            <Route path="/luchtvideografie" element={<Luchtvideografie />} />
            <Route path="/luchtfoto" element={<Luchtvideografie />} />
            <Route path="/dronebeelden" element={<Navigate to="/luchtvideografie" replace />} />
            <Route path="/drone" element={<Navigate to="/luchtvideografie" replace />} />
            
            {/* Service request routes */}
            <Route path="/start/:serviceType" element={<StartService />} />
            <Route path="/bedankt-service" element={<BedanktService />} />
            
            {/* Password reset */}
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/wachtwoord-resetten" element={<WachtwoordResetten />} />
            <Route path="/wachtwoord-vergeten" element={<WachtwoordResetten />} />
            
            {/* Developer dashboard - protected */}
            <Route 
              path="/developer" 
              element={
                <ProtectedRoute requireRole="developer">
                  <DeveloperDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Marketing CRM - protected for sales team */}
            <Route 
              path="/websales" 
              element={
                <ProtectedRoute requireRole="marketing">
                  <MarketingDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Unauthorized page */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            
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
