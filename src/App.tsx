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
import FloatingWhatsApp from './components/FloatingWhatsApp'
import './index.css'

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header urgencyBannerVisible={false} />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Portfolio />
        <Comparison />
        <DomainChecker />
        <Pricing />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      
      {/* Alleen WhatsApp - subtiel en nuttig */}
      <FloatingWhatsApp />
    </div>
  )
}
