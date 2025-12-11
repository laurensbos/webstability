import { useState } from 'react'
import { CheckCircle, XCircle, Search } from 'lucide-react'

function normalize(s: string){
  return s.trim().toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').split(/[/?#]/)[0]
}

export default function HeroDomain(){
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [sugs, setSugs] = useState<string[]>([])

  async function check(d: string){
    setLoading(true)
    setAvailable(null)
    setSugs([])
    try{
      const res = await fetch(`/api/check?domain=${encodeURIComponent(d)}`)
      const json = await res.json()
      setAvailable(!!json.available)
      setSugs(json.suggestions||[])
      // announce
      const ann = document.getElementById('domain-ann')
      if(ann){ ann.textContent = json.available ? `${d} is beschikbaar` : `${d} is bezet` }
    }catch(e){
      setAvailable(null)
      setSugs([])
    }
    setLoading(false)
  }

  return (
    <form onSubmit={(e)=>{e.preventDefault(); check(normalize(domain))}} className="w-full">
      <label className="sr-only">Domein</label>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input value={domain} onChange={(e)=>setDomain(e.target.value)} placeholder="jouwdomein.nl" className="w-full px-4 py-3 rounded-lg border" aria-label="Domein" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {loading ? <div className="spinner w-4 h-4" /> : available === true ? <CheckCircle size={18} className="text-green-500" /> : available === false ? <XCircle size={18} className="text-red-500" /> : <Search size={18} className="text-slate-400" />}
          </div>
        </div>

        <button type="submit" className="btn-primary px-4 py-2">Zoek domein</button>
      </div>

      {sugs.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {sugs.map(s=> (
            <button key={s} type="button" className="suggestion-chip" onClick={()=>{setDomain(s); check(s)}} aria-label={`Gebruik ${s}`}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div id="domain-ann" aria-live="polite" className="sr-only" />
    </form>
  )
}
