import Header from './components/Header'
import Hero from './components/Hero'
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import HowItWorks from './components/HowItWorks'
import Comparison from './components/Comparison'
import Portfolio from './components/Portfolio'
import StickyCTA from './components/StickyCTA'
import './index.css'

// Optimized homepage structure:
// 1. Hero - Hook met waardepropositie
// 2. Comparison - Waarom wij (pain point oplossen)
// 3. HowItWorks - Simpel proces uitleggen
// 4. Pricing - Transparante prijzen
// 5. Testimonials - Social proof
// 6. Portfolio - Bewijs van kwaliteit
// 7. FAQ - Laatste bezwaren wegnemen

export default function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header urgencyBannerVisible={false} />
      <main>
        <Hero />
        <Comparison />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <Portfolio />
        <FAQ />
      </main>
      <Footer />
      <StickyCTA />
    </div>
  )
}
