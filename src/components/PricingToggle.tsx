import { useState } from 'react'

export default function PricingToggle({ onChange }:{ onChange:(yearly:boolean)=>void }){
  const [yearly, setYearly] = useState(false)
  function toggle(){
    setYearly((s)=>{ onChange(!s); return !s })
  }
  return (
    <div className="inline-flex items-center gap-3 bg-slate-100 rounded-full p-1">
      <span className={`px-3 text-sm ${!yearly ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>Maand</span>
      <button onClick={toggle} aria-pressed={yearly} className={`relative w-12 h-6 rounded-full transition-colors ${yearly ? 'bg-brand-600' : 'bg-slate-300'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${yearly ? 'translate-x-6' : ''}`}></span>
      </button>
      <span className={`px-3 text-sm ${yearly ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>Jaar</span>
    </div>
  )
}
