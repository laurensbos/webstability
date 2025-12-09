import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import StickyCTA from './components/StickyCTA'
import CheckoutModal from './components/CheckoutModal'
import DemoModal from './components/DemoModal'
import Comparison from './components/Comparison'
import NewYearsDeal from './components/NewYearsDeal'
import HowItWorks from './components/HowItWorks'
import './index.css'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type Props = { heroVariant?: 'default' | 'alt' }

export default function App({ heroVariant = 'default' }: Props){
  const [demoOpen, setDemoOpen] = useState(false)
  const [ctaText, setCtaText] = useState('Vraag demo aan')

  useEffect(()=>{
    function h(){setDemoOpen(true)}
    window.addEventListener('open-demo', h)
    return ()=> window.removeEventListener('open-demo', h)
  },[])

  useEffect(()=>{
    function onScroll(){
      const pricing = document.getElementById('pricing')
      if(!pricing) return
      const rect = pricing.getBoundingClientRect()
      if(rect.top < 120){
        setCtaText('Claim 30% nu')
      } else {
        setCtaText('Vraag demo aan')
      }
    }
    window.addEventListener('scroll', onScroll)
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])

  return (
    <div className="min-h-screen bg-transparent text-[var(--brand-dark)]">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main key="main" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
          <Hero variant={heroVariant} />

          {/* Moved: New Years deal should sit directly under the hero for emphasis */}
          <div className="max-w-7xl mx-auto px-6 -mt-6">
            <NewYearsDeal />
          </div>

          {/* New: clear how-it-works section */}
          <div className="max-w-7xl mx-auto px-6 mt-10">
            <HowItWorks />
          </div>

          <Features />
          <Comparison />
          <Pricing />
          <Testimonials />
          <FAQ />
          {/* DomainChecker removed from the bottom of the page to avoid duplication with the hero domain input */}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <StickyCTA text={ctaText} />
      <CheckoutModal />
      <DemoModal open={demoOpen} onClose={()=>setDemoOpen(false)} />
    </div>
  )
}
