import React, { useState } from 'react'
import PricingToggle from './PricingToggle'
import { motion } from 'framer-motion'
import { fadeInUp } from '../lib/motion'
import { Check } from 'lucide-react'

export default function Pricing(){
  const [yearly, setYearly] = useState(false)
  const monthlyStarter = 49
  const monthlyShop = 79
  const starterPrice = yearly ? Math.round(monthlyStarter * 12 * 0.9) : monthlyStarter
  const shopPrice = yearly ? Math.round(monthlyShop * 12 * 0.9) : monthlyShop

  function openCheckout(plan: string){
    const evt = new CustomEvent('open-checkout', { detail: { plan } })
    window.dispatchEvent(evt)
  }

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once:true, amount: 0.2 }}>
          <h2 id="pricing-heading" className="text-2xl md:text-3xl font-semibold text-[var(--brand-dark)]">Prijzen</h2>
          <p className="mt-3 text-[var(--muted)] max-w-xl">Eenvoudige prijzen, geen onverwachte kosten. Jaarlijks betalen is goedkoper.</p>

          <div className="mt-6">
            <PricingToggle onChange={(y)=>setYearly(y)} />
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="border border-transparent rounded-lg p-6 bg-[rgba(255,255,255,0.02)] shadow-sm">
              <div className="text-sm font-semibold text-[var(--brand-dark)]">Starter</div>
              <div className="mt-3 text-3xl font-extrabold text-[var(--brand-dark)]">€{starterPrice} <span className="text-sm font-medium"> {yearly ? '/ jaar' : '/ maand'}</span></div>
              <p className="text-sm text-[var(--muted)] mt-2">Direct online met een compacte website, inclusief hosting en updates.</p>

              <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                <li className="flex items-start gap-2"><Check size={16} className="text-[#ffd98a]" /> 3 pagina's (Home, Over, Contact)</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-[#ffd98a]" /> Basis SEO & snelheid optimalisaties</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-[#ffd98a]" /> 1 uur onboarding</li>
              </ul>

              <div className="mt-6">
                <button onClick={()=>openCheckout('Starter')} className="w-full btn-primary">Start met Starter</button>
              </div>
            </div>

            <div className="border border-transparent rounded-lg p-6 bg-[rgba(255,255,255,0.02)] shadow-sm">
              <div className="text-sm font-semibold text-[var(--brand-dark)]">Webshop</div>
              <div className="mt-3 text-3xl font-extrabold text-[var(--brand-dark)]">€{shopPrice} <span className="text-sm font-medium"> {yearly ? '/ jaar' : '/ maand'}</span></div>
              <p className="text-sm text-[var(--muted)] mt-2">Complete e‑commerce setup met betaalopties en productbeheer.</p>

              <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                <li className="flex items-start gap-2"><Check size={16} className="text-[#ffd98a]" /> Product catalogus</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-[#ffd98a]" /> Betalingen & verzending</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-[#ffd98a]" /> Integraties met payment providers</li>
              </ul>

              <div className="mt-6">
                <button onClick={()=>openCheckout('Webshop')} className="w-full btn-primary">Start Webshop</button>
              </div>
            </div>

            <div className="border border-transparent rounded-lg p-6 bg-[rgba(255,255,255,0.02)] shadow-sm">
              <div className="text-sm font-semibold text-[var(--brand-dark)]">Maatwerk</div>
              <p className="text-sm text-[var(--muted)] mt-2">Gepersonaliseerde oplossingen voor complexe wensen.</p>
              <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                <li className="flex items-start gap-2"><Check size={16} className="text-[#ffd98a]" /> Integraties op maat</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-[#ffd98a]" /> Dedicated support</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-[#ffd98a]" /> Offerte & planning</li>
              </ul>
              <div className="mt-6">
                <button onClick={()=>openCheckout('Maatwerk')} className="w-full btn-primary">Vraag offerte aan</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
