import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../lib/motion'

export default function DomainChecker(){
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [message, setMessage] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  function sanitizeDomain(input: string){
    return input.trim().replace(/^https?:\/\//,'').replace(/[^a-z0-9.-]/gi,'').toLowerCase()
  }

  async function check(d: string){
    if(!d) return
    setLoading(true)
    setMessage('Controleren...')
    setAvailable(null)
    try{
      const res = await fetch('/api/check?domain=' + encodeURIComponent(d))
      const json = await res.json()
      setAvailable(!!json.available)
      setSuggestions(json.suggestions || [])
      setMessage(json.available ? 'Beschikbaar' : 'Niet beschikbaar')
    }catch(e){
      setMessage('Kon niet controleren')
    }finally{
      setLoading(false)
    }
  }

  function onSubmit(e: React.FormEvent){
    e.preventDefault()
    const s = sanitizeDomain(domain)
    if(!s) return
    check(s)
  }

  function pickSuggestion(s: string){
    setDomain(s)
    check(s)
  }

  function chooseAndCheckout(d: string){
    window.dispatchEvent(new CustomEvent('open-checkout', { detail: { plan: 'Starter', domain: d } }))
  }

  useEffect(()=>{
    if(domain === ''){ setAvailable(null); setMessage('') }
  },[domain])

  return (
    <section id="domains" className="py-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h3 className="text-2xl font-semibold" variants={fadeInUp} initial="hidden" animate="show">Domeinchecker</motion.h3>
        <motion.p className="text-[var(--muted)] mt-2" variants={fadeInUp} initial="hidden" animate="show">Controleer of je domein beschikbaar is.</motion.p>

        <form onSubmit={onSubmit} className="mt-6 w-full relative card p-4 sm:p-6 rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.98)' }}>
          {/* center inner content and constrain width for better mobile centering */}
          <div className="mx-auto max-w-lg">
            {/* fireworks behind the form for premium look (hidden on small screens) */}
            <div className="fireworks-bg hidden sm:block" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="relative z-10 text-center sm:text-left">
              <label htmlFor="domain" className="sr-only">Domein controleren</label>

              {/* stack input + button on mobile, inline on larger screens */}
              <div className="flex gap-3 items-center flex-col sm:flex-row">
                <input
                  id="domain"
                  value={domain}
                  onChange={(e)=>setDomain(e.target.value)}
                  className={`w-full sm:flex-1 min-w-0 px-3 py-3 rounded-md border ${available === true ? 'input-valid' : available === false ? 'input-invalid' : ''}`}
                  placeholder="Jouw droomdomein.nl"
                  aria-label="Domein voorbeeld: jouwbedrijf.nl"
                />

                <button type="submit" disabled={loading} className="btn-primary small w-full sm:w-auto" aria-disabled={loading}>
                  {loading ? 'Even...' : 'Controleer'}
                </button>
              </div>

              <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  {available === true && <div className="badge badge-available">Beschikbaar</div>}
                  {available === false && <div className="badge badge-unavailable">Bezet</div>}
                  {available === null && <div className="badge badge-muted">Controleer je domein</div>}
                  <div className="sr-only" role="status" aria-live="polite">{message}</div>
                </div>

                <div className="text-xs text-[var(--muted)]">Inclusief SSL & dagelijkse backups</div>
              </div>

              {suggestions.length > 0 && (
                <div className="mt-3 grid gap-2 grid-cols-1 sm:flex sm:flex-row sm:flex-wrap justify-center sm:justify-start">
                  {suggestions.map(s => (
                    <button key={s} type="button" onClick={()=>pickSuggestion(s)} className="suggestion-chip w-full sm:w-auto text-center" aria-label={`Gebruik ${s}`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {available === true && (
                <div className="mt-3 flex justify-center sm:justify-start">
                  <button type="button" onClick={()=>chooseAndCheckout(domain)} className="btn-primary w-full sm:w-auto">Kies dit domein</button>
                </div>
              )}

            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
