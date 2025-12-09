import React, { useState } from 'react'

export default function Footer(){
  const [email, setEmail] = useState('')
  const [ok, setOk] = useState(false)

  async function subscribe(){
    if(!email) return
    try{ await fetch('/api/onboard', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ title: 'newsletter', email }) }) }catch(e){}
    setOk(true)
  }

  return (
    <footer className="mt-20 bg-transparent py-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[var(--brand-500)] flex items-center justify-center text-white font-semibold">ws</div>
            <div>
              <div className="font-semibold text-[var(--text)]">webstability</div>
              <div className="text-sm text-[var(--muted)]">Websites voor ondernemers</div>
            </div>
          </div>
        </div>

        <div>
          <div className="font-semibold text-[var(--text)]">Product</div>
          <ul className="mt-2 text-sm text-[var(--muted)] space-y-2">
            <li><a href="#features">Producten</a></li>
            <li><a href="#pricing">Prijzen</a></li>
            <li><a href="/deal">Nieuwjaarsdeal</a></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold text-[var(--text)]">Nieuwsbrief</div>
          <div className="mt-2 flex gap-2">
            <input className="flex-1 px-3 py-2 rounded bg-white text-[var(--text)]" placeholder="E-mailadres" value={email} onChange={e=>setEmail(e.target.value)} />
            <button onClick={subscribe} className="bg-gradient-to-r from-[var(--brand-500)] to-[var(--accent-2)] text-white px-3 py-2 rounded">Aanmelden</button>
          </div>
          {ok && <div className="mt-2 text-sm text-emerald-400">Bedankt! We houden je op de hoogte.</div>}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-[var(--muted)]">© {new Date().getFullYear()} webstability — Alle rechten voorbehouden</div>
    </footer>
  )
}
