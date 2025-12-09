import React, { useEffect, useState, useRef } from 'react'
import { smoothScroll } from '../lib/smoothScroll'

export default function NewYearsDeal(){
  // deadline: 31 Jan 2026 23:59 local
  const deadline = new Date('2026-01-31T23:59:59')
  const [remaining, setRemaining] = useState(() => Math.max(0, deadline.getTime() - Date.now()))

  useEffect(()=>{
    const id = setInterval(()=>{
      setRemaining(Math.max(0, deadline.getTime() - Date.now()))
    }, 1000)
    return ()=>clearInterval(id)
  }, [])

  const days = Math.floor(remaining / (1000*60*60*24))
  const hours = Math.floor((remaining % (1000*60*60*24)) / (1000*60*60))
  const minutes = Math.floor((remaining % (1000*60*60)) / (1000*60))
  const seconds = Math.floor((remaining % (1000*60)) / 1000)

  const ctaRef = useRef<HTMLButtonElement | null>(null)

  function triggerBurst(){
    const el = ctaRef.current
    if(!el) return
    el.classList.remove('burst')
    // force reflow to restart animation
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    void el.offsetWidth
    el.classList.add('burst')
    window.setTimeout(()=> el.classList.remove('burst'), 700)
  }

  return (
    <section aria-labelledby="deal-heading" className="card-campaign text-[var(--text)] p-6 rounded-xl shadow-lg relative overflow-hidden">
      {/* Decorative fireworks inside the card (aria-hidden) */}
      <div className="deal-fireworks" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4 relative z-10">
        <div className="flex-1">
          <h2 id="deal-heading" className="text-2xl md:text-3xl font-semibold gold-text">Nieuwjaarsdeal — 30% korting</h2>
          <p className="mt-2 text-sm opacity-90">Speciaal voor ondernemers: een complete website, hosting en support — 30% korting tot eind januari. Slechts een beperkte hoeveelheid deal-plaatsen beschikbaar.</p>

          <div className="mt-4 flex items-center gap-3">
            <div className="bg-white/10 rounded px-3 py-1 text-sm font-medium">-30% KORTING</div>
            <div className="text-xs opacity-90">Voor nieuwe klanten · Betaal per jaar</div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="text-lg font-mono tracking-wide" aria-hidden>
              {String(days).padStart(2,'0')}d {String(hours).padStart(2,'0')}u {String(minutes).padStart(2,'0')}m {String(seconds).padStart(2,'0')}s
            </div>
            <button
              ref={ctaRef}
              onClick={() => { triggerBurst(); smoothScroll('#pricing') }}
              className="shimmer-btn bg-white text-purple-700 px-4 py-2 rounded-md font-semibold hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 relative overflow-hidden"
            >
              Profiteer nu
            </button>
          </div>

          <p className="mt-3 text-xs opacity-80">Geen limieten op pagina's. 14 dagen niet-goed-geld-terug garantie.</p>
        </div>

        <div className="w-full md:w-56 text-center md:text-right">
          <div className="inline-block bg-white/10 p-3 rounded-lg">
            <div className="text-sm opacity-90">Aanbieding geldig t/m</div>
            <div className="mt-2 font-semibold">31 jan 2026</div>
          </div>
        </div>
      </div>
    </section>
  )
}
