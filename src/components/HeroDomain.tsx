import { useState } from 'react'
import { CheckCircle, XCircle, Search, Loader2 } from 'lucide-react'

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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <input 
            value={domain} 
            onChange={(e)=>setDomain(e.target.value)} 
            placeholder="jouwdomein.nl" 
            className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-base" 
            aria-label="Domein" 
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {loading ? (
              <Loader2 size={18} className="text-primary-500 animate-spin" />
            ) : available === true ? (
              <CheckCircle size={18} className="text-green-500" />
            ) : available === false ? (
              <XCircle size={18} className="text-red-500" />
            ) : (
              <Search size={18} className="text-gray-400 dark:text-gray-500" />
            )}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !domain.trim()}
          className="px-6 py-3 sm:py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base whitespace-nowrap"
        >
          <Search size={18} />
          Controleer
        </button>
      </div>

      {/* Result message */}
      {available !== null && (
        <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 text-sm ${
          available 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          {available ? (
            <>
              <CheckCircle size={16} />
              <span><strong>{normalize(domain)}</strong> is beschikbaar!</span>
            </>
          ) : (
            <>
              <XCircle size={16} />
              <span><strong>{normalize(domain)}</strong> is helaas al bezet</span>
            </>
          )}
        </div>
      )}

      {sugs.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Alternatieven:</p>
          <div className="flex flex-wrap gap-2">
            {sugs.map(s=> (
              <button 
                key={s} 
                type="button" 
                className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors" 
                onClick={()=>{setDomain(s); check(s)}} 
                aria-label={`Gebruik ${s}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div id="domain-ann" aria-live="polite" className="sr-only" />
    </form>
  )
}
