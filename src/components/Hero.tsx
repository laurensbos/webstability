import React from 'react'
import { motion } from 'framer-motion'
import HeroDomain from './HeroDomain'
import { fadeInUp } from '../lib/motion'
import TrustBadges from './TrustBadges'
import DeviceMock from './DeviceMock'

type Props = { variant?: 'default' | 'alt' }

export default function Hero({ variant = 'default' }: Props){
  // Shared text classes with improved contrast
  const headlineClass = 'mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-[var(--text)]'
  const leadClass = 'mt-3 text-base sm:text-lg text-[var(--muted)] max-w-xl'

  // Small promo ribbon used in hero (links to full deal page)
  const PromoRibbon = () => (
    <div className="mt-3 inline-flex items-center gap-3">
      <a href="/deal" className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">Nieuwjaarsdeal — 30% korting</a>
      <a href="/deal" className="text-sm text-[var(--muted)] underline">Bekijk deal</a>
    </div>
  )

  return (
    <header className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 relative z-10">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once:true, amount: 0.2 }} className="grid lg:grid-cols-2 gap-8 items-center">

          {/* On small screens we place preview above copy for better mobile UX */}
          <div className="order-1 lg:order-0">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md md:max-w-lg">
                <DeviceMock />
                <div className="sr-only">Interactieve demo: klik om de korte rondleiding te openen.</div>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="order-0 lg:order-1">
            <span className="inline-flex items-center gap-3 bg-white/6 px-3 py-1 rounded-full text-sm text-white/90">Nieuw — snelle onboarding</span>
            <h1 className={headlineClass}>Professionele websites, snel & stressvrij</h1>
            <p className={leadClass}>Complete websites inclusief hosting, support en conversie-optimalisatie — gebouwd voor ondernemers die willen groeien.</p>

            <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center">
              <button className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--brand-500)] to-[var(--accent-2)] text-white px-5 py-3 rounded-md font-semibold shadow shimmer-btn" aria-label="Start gratis proef">Start gratis proef</button>
              <PromoRibbon />
            </div>

            <div className="mt-5">
              <HeroDomain />
            </div>

            {/* Compact row: stat, logos and trust badges inline on wide screens */}
            <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              {/* right: trust badges and small CTA */}
              <div className="flex items-center gap-4 justify-end">
                <TrustBadges compact />
                <a
                  href="#testimonials"
                  className="hidden md:inline-flex items-center gap-3 px-4 py-3 rounded-md bg-white/20 text-slate-800 hover:bg-gradient-to-r hover:from-[var(--brand-500)] hover:to-[var(--accent-2)] transition-all shimmer-btn"
                >
                  Bekijk klantcases
                </a>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      <div className="absolute left-0 top-0 w-2/3 h-full pointer-events-none opacity-8 bg-[linear-gradient(90deg,rgba(99,102,241,0.10),rgba(6,182,212,0.10))] blur-3xl" aria-hidden />
    </header>
  )
}
