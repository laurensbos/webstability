import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { OnboardingWizard } from './components/OnboardingWizard'
import CaseStudies from './pages/CaseStudies'
import Deal from './pages/Deal'
import { getVariant } from './lib/ab'

const variant = getVariant('hero_v1')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App heroVariant={variant} />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/deal" element={<Deal />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
