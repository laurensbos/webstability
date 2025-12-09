import React from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../lib/motion'
import { Zap, Layers, Rocket } from 'lucide-react'

export default function HowItWorks(){
  return (
    <section aria-labelledby="how-heading" className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <h2 id="how-heading" className="text-2xl md:text-3xl font-semibold text-[var(--brand-dark)]">Zo werkt het</h2>
          <p className="mt-3 text-slate-600 max-w-xl">Van idee naar live site in een paar stappen — wij regelen het technische en jij bewaakt de groei.</p>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-100 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-50 text-purple-600">
                <Zap size={20} />
              </div>
              <h3 className="mt-4 font-semibold text-lg">1. Vertel je idee</h3>
              <p className="mt-2 text-sm text-slate-600">Snel onboarding-formulier: kies je industrie, domein en gewenste sjabloon — wij plannen een korte walkthrough.</p>
            </div>

            <div className="bg-white border border-slate-100 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-50 text-cyan-600">
                <Layers size={20} />
              </div>
              <h3 className="mt-4 font-semibold text-lg">2. Wij bouwen en optimaliseren</h3>
              <p className="mt-2 text-sm text-slate-600">Webstability levert een conversie-gericht ontwerp, responsive build en SEO-basisinstallatie — klaar voor conversie.</p>
            </div>

            <div className="bg-white border border-slate-100 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-600">
                <Rocket size={20} />
              </div>
              <h3 className="mt-4 font-semibold text-lg">3. Publiceren & groeien</h3>
              <p className="mt-2 text-sm text-slate-600">We koppelen je domein, zetten analytics en support klaar en geven je tips om bezoekers te converteren.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
