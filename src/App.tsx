import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import HowItWorks from './components/HowItWorks'
import DomainChecker from './components/DomainChecker'
import Comparison from './components/Comparison'
import Portfolio from './components/Portfolio'
import ExtraServices from './components/ExtraServices'
import DashboardPreview from './components/DashboardPreview'
import StickyCTA from './components/StickyCTA'
import FloatingChat from './components/FloatingChat'
import './index.css'

export default function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header urgencyBannerVisible={false} />
      <main>
        <Hero />
        <Comparison />
        <Portfolio />
        <Pricing />
        <Testimonials />
        <HowItWorks />
        <Features />
        <DashboardPreview />
        <FAQ />
        <DomainChecker />
        <ExtraServices />
      </main>
      <Footer />
      <StickyCTA />
      <FloatingChat variant="homepage" />
    </div>
  )
}
