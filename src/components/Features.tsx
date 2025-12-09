import React, { useState } from 'react'
import { Globe, Zap, Phone } from 'lucide-react'
import useReveal from '../hooks/useReveal'
import { motion } from 'framer-motion'
import { staggerContainer, fadeInUp, pop } from '../lib/motion'
import { Rocket, Shield, DollarSign, Users, TrendingUp, ShoppingCart } from 'lucide-react'

const ITEMS = [
  { title: 'Snel live', desc: 'Klaar binnen een week', icon: Rocket },
  { title: 'Veilige hosting', desc: 'SSL + backups', icon: Shield },
  { title: 'Betaalbaar', desc: 'Transparante prijzen', icon: DollarSign },
  { title: 'Support', desc: 'Echte mensen, snelle antwoorden', icon: Users },
  { title: 'SEO-gericht', desc: 'Structuur voor zichtbaarheid', icon: TrendingUp },
  { title: 'E-commerce', desc: 'Betaalmethodes en voorraad', icon: ShoppingCart },
]

export default function Features() {
  const { ref, visible } = useReveal()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const items = [
    { id: 1, title: 'SEO & zichtbaarheid', icon: Globe, text: 'Geoptimaliseerde pagina’s, metadata en performance zodat klanten je makkelijker vinden.', details: 'Wij optimaliseren je pagina-architectuur, metadata en content flow zodat je website direct beter gevonden wordt. Dit levert je structureel meer relevante bezoekers.' },
    { id: 2, title: 'Snel en betrouwbaar', icon: Zap, text: 'Lichtgewicht sites met aandacht voor Core Web Vitals en snelle laadtijden.', details: 'Wij bouwen met performance-first principes: minimale assets, slimme caching en image optimisation — voor snellere pagina’s en hogere conversies.' },
    { id: 3, title: 'Persoonlijke support', icon: Phone, text: 'Direct contact met hetzelfde team dat je website bouwt, van onboarding tot onderhoud.', details: 'Geen anonieme helpdesk: één vast contactpersoon die je adviseert bij updates, security en groeikansen.' },
  ]

  return (
    <section id="features" className="py-20 bg-white/4">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial="hidden" animate={visible ? 'show' : 'hidden'} variants={staggerContainer}>
          <motion.h2 className={`text-3xl font-bold`} variants={fadeInUp}>Waarom kiezen ondernemers voor webstability?</motion.h2>
          <motion.p className="mt-2 text-slate-600 max-w-2xl" variants={fadeInUp}>Wij leveren complete websites die leads opleveren: snelle oplevering, conversiegerichte ontwerpkeuzes en support die meegroeit met je bedrijf.</motion.p>

          <motion.div ref={ref} className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6" variants={staggerContainer}>
            {items.map((it, i) => (
              <motion.article key={it.id} className={`card flex flex-col gap-4`} variants={fadeInUp} whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 160 }} onClick={() => setOpenIndex(openIndex === i ? null : i)} aria-expanded={openIndex === i}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg, rgba(109,40,217,0.12), rgba(6,182,212,0.08))'}}>
                    <it.icon color="var(--brand-500)" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{it.title}</h3>
                    <p className="text-sm text-slate-600 mt-2">{it.text}</p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="text-sm text-slate-500">{openIndex === i ? 'Klik om te sluiten' : 'Klik om meer te lezen'}</div>
                  <div className="text-sm text-brand-600 font-semibold">Meer</div>
                </div>

                {openIndex === i && (
                  <motion.div className="pt-3 border-t mt-3 text-sm text-slate-600" initial={{opacity:0}} animate={{opacity:1}}>
                    {it.details}
                    <div className="mt-3">
                      <a href="#pricing" className="btn-primary">Bekijk pakketten</a>
                    </div>
                  </motion.div>
                )}
              </motion.article>
            ))}
          </motion.div>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" className="grid md:grid-cols-3 gap-6 mt-16">
          {ITEMS.map((it)=> (
            <motion.div key={it.title} variants={pop} className="bg-white/6 p-6 rounded-lg">
              <div className="text-2xl text-[var(--brand-500)]">
                <it.icon size={28} />
              </div>
              <div className="mt-2 font-semibold">{it.title}</div>
              <div className="mt-1 text-sm text-slate-300">{it.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 text-center">
          <div className="text-sm text-slate-400">Inclusief: Gratis migratie, SSL, en 14 dagen niet-goed-geld-terug</div>
        </div>
      </div>
    </section>
  )
}
