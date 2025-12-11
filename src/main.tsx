import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { OnboardingWizard } from './components/OnboardingWizard'
import CaseStudies from './pages/CaseStudies'
import Deal from './pages/Deal'
import Kennisbank from './pages/Kennisbank'
import Article from './pages/Article'
import Contact from './pages/Contact'
import StartProject from './pages/StartProject'
import Dashboard from './pages/Dashboard'
import OverOns from './pages/OverOns'
import Privacy from './pages/Privacy'
import Voorwaarden from './pages/Voorwaarden'
import NotFound from './pages/NotFound'
import Bedankt from './pages/Bedankt'
import Webshop from './pages/Webshop'
import KlantOnboarding from './pages/KlantOnboarding'
import ProjectStatus from './pages/ProjectStatus'
import BetalingSucces from './pages/BetalingSucces'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/succesverhalen" element={<CaseStudies />} />
        <Route path="/deal" element={<Deal />} />
        <Route path="/kennisbank" element={<Kennisbank />} />
        <Route path="/kennisbank/:slug" element={<Article />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/start" element={<StartProject />} />
        <Route path="/bedankt" element={<Bedankt />} />
        <Route path="/betaling-succes" element={<BetalingSucces />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/klant-onboarding" element={<KlantOnboarding />} />
        <Route path="/project-status" element={<ProjectStatus />} />
        <Route path="/over-ons" element={<OverOns />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/voorwaarden" element={<Voorwaarden />} />
        <Route path="/webshop" element={<Webshop />} />
        <Route path="/webshop-laten-maken" element={<Webshop />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
