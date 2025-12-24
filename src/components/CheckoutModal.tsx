import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Pakket prijzen (alleen ter informatie - betaling komt later)
const PACKAGE_PRICES: Record<string, { monthly: number; setup: number }> = {
  starter: { monthly: 79, setup: 99 },
  professional: { monthly: 148, setup: 179 },
  business: { monthly: 247, setup: 239 },
  webshop: { monthly: 247, setup: 299 }
}

interface DiscountInfo {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  description?: string
}

export default function CheckoutModal(){
  const [open, setOpen] = useState(false)
  const [plan, setPlan] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [domain, setDomain] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountInfo | null>(null)
  const [couponError, setCouponError] = useState('')
  const [checkingCoupon, setCheckingCoupon] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [isWebshop, setIsWebshop] = useState(false)
  const [success, setSuccess] = useState(false)
  const [projectId, setProjectId] = useState<string | null>(null)

  // Bereken prijzen op basis van pakket
  const packageKey = isWebshop ? 'webshop' : (plan?.toLowerCase() || 'starter')
  const prices = PACKAGE_PRICES[packageKey] || PACKAGE_PRICES.starter

  useEffect(()=>{
    function handler(e: any){
      const detail = e?.detail || {}
      setPlan(detail.plan || 'Starter')
      if(detail.domain) setDomain(detail.domain)
      if(detail.coupon) {
        setCouponCode(detail.coupon)
        // Auto-valideer de coupon als deze is meegegeven
        validateCoupon(detail.coupon)
      }
      if(detail.isWebshop) setIsWebshop(true)
      setOpen(true)
      try{ (window as any).dataLayer = (window as any).dataLayer || []; (window as any).dataLayer.push({ event: 'checkout_open', plan: detail.plan, coupon: detail.coupon }) }catch(e){}
    }
    window.addEventListener('open-checkout', handler as EventListener)
    return ()=> window.removeEventListener('open-checkout', handler as EventListener)
  },[])

  // Validate kortingscode
  async function validateCoupon(code?: string) {
    const codeToCheck = code || couponCode
    if (!codeToCheck.trim()) {
      setCouponError('Voer een kortingscode in')
      return
    }
    
    setCheckingCoupon(true)
    setCouponError('')
    
    try {
      const resp = await fetch(`/api/discounts?code=${encodeURIComponent(codeToCheck)}&validate=true`)
      const data = await resp.json()
      
      if (data.success && data.valid) {
        setAppliedDiscount({
          code: data.discount.code,
          type: data.discount.type,
          value: data.discount.value,
          description: data.discount.description
        })
        setCouponError('')
        setCouponCode(data.discount.code) // Zet de juiste code (uppercase)
      } else {
        setAppliedDiscount(null)
        setCouponError(data.error || 'Ongeldige kortingscode')
      }
    } catch (e) {
      setCouponError('Kon kortingscode niet controleren')
    }
    
    setCheckingCoupon(false)
  }
  
  // Verwijder kortingscode
  function removeCoupon() {
    setAppliedDiscount(null)
    setCouponCode('')
    setCouponError('')
  }

  if(!open) return null

  async function submit(e: React.FormEvent){
    e.preventDefault()
    setProcessing(true)

    try{
      const packageType = isWebshop ? 'webshop' : (plan?.toLowerCase() || 'starter')
      const productType = isWebshop ? 'Webshop' : 'Website'
      
      // Maak project aan ZONDER betaling - betaling komt na design goedkeuring
      const resp = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ 
          contactName: name,
          contactEmail: email,
          contactPhone: phone,
          companyName: companyName || name,
          domain: domain,
          package: packageType,
          productType,
          discountCode: appliedDiscount?.code,
          phase: 'onboarding', // Start in onboarding fase
          paymentStatus: 'pending', // Betaling nog niet gedaan
          metadata: { 
            plan, 
            domain, 
            coupon: appliedDiscount?.code,
            isWebshop,
            setupCost: prices.setup,
            monthlyCost: prices.monthly,
          }
        })
      })
      const data = await resp.json()
      
      if (data.success && data.project?.id) {
        setProjectId(data.project.id)
        setSuccess(true)
        try{ 
          (window as any).dataLayer = (window as any).dataLayer || []; 
          (window as any).dataLayer.push({ 
            event: 'project_request', 
            plan, 
            coupon: appliedDiscount?.code,
            projectId: data.project.id 
          }) 
        }catch(e){}
      } else if (data.code === 'EMAIL_IN_USE') {
        alert('Dit e-mailadres is al in gebruik bij een ander project. Log in met je bestaande project of gebruik een ander e-mailadres.')
      } else {
        alert(data.error || 'Er is iets misgegaan bij het aanmaken van je project')
      }

    }catch(e){
      alert('Er is iets misgegaan bij het aanmaken van je project')
    }

    setProcessing(false)
  }

  // Success scherm na aanvraag
  if (success && projectId) {
    return (
      <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-black/40" onClick={()=>{setOpen(false); setSuccess(false); setProjectId(null)}} />
        <motion.div 
          className="relative bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-card text-center max-h-[90vh] overflow-y-auto" 
          initial={{opacity:0, y: 20}} 
          animate={{opacity:1, y: 0}} 
          transition={{duration:0.18}}
        >
          {/* Mobile drag handle */}
          <div className="sm:hidden flex justify-center -mt-2 mb-4">
            <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>
          
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Aanvraag ontvangen! 🎉
          </h3>
          
          <p className="text-slate-600 dark:text-gray-300 mb-4">
            Je {isWebshop ? 'webshop' : 'website'} aanvraag is succesvol ontvangen.
          </p>
          
          <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">Je project ID:</p>
            <p className="text-xl font-mono font-bold text-primary-600 dark:text-primary-400">{projectId}</p>
            <p className="text-xs text-slate-500 dark:text-gray-500 mt-2">
              Bewaar dit ID om je project te volgen
            </p>
          </div>
          
          {/* Direct action buttons */}
          <div className="space-y-3 mb-6">
            <a 
              href={`/intake/${projectId}`}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Start met uploaden →
            </a>
            <p className="text-xs text-slate-500 dark:text-gray-500">
              Upload je logo, foto's en andere bestanden zodat we direct kunnen starten
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">📋 Wat gebeurt er nu?</h4>
            <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
              <li><strong>Nu:</strong> Vul de onboarding in & upload bestanden</li>
              <li>Wij maken een design op maat (5-7 dagen)</li>
              <li>Jij geeft feedback & keurt goed</li>
              <li>Na goedkeuring → betaling & live!</li>
            </ol>
          </div>
          
          <button 
            onClick={()=>{setOpen(false); setSuccess(false); setProjectId(null)}}
            className="w-full py-2 text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 text-sm"
          >
            Later doen
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={()=>setOpen(false)} />
      <motion.div 
        className="relative bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 max-w-lg w-full shadow-card max-h-[90vh] overflow-y-auto" 
        initial={{opacity:0, y: 20}} 
        animate={{opacity:1, y: 0}} 
        transition={{duration:0.18}}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center -mt-1 mb-3">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gratis aanvragen: {isWebshop ? 'Webshop' : plan}</h3>
        <p className="text-sm text-slate-600 dark:text-gray-300 mt-1">Vul je gegevens in. Betaling pas na design-goedkeuring.</p>

        <form onSubmit={submit} className="mt-4 space-y-3">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Je naam *" className="w-full px-3 py-2.5 text-base border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow" required />
          <input value={companyName} onChange={(e)=>setCompanyName(e.target.value)} placeholder="Bedrijfsnaam" className="w-full px-3 py-2.5 text-base border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow" />
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="E-mailadres *" className="w-full px-3 py-2.5 text-base border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow" required />
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} type="tel" placeholder="Telefoonnummer" className="w-full px-3 py-2.5 text-base border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow" />
          <input value={domain} onChange={(e)=>setDomain(e.target.value)} placeholder="Gewenst domein (optioneel)" className="w-full px-3 py-2.5 text-base border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow" />

          {/* Kortingscode sectie */}
          <div className="mt-2">
            {appliedDiscount ? (
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="font-medium text-green-700 dark:text-green-300">{appliedDiscount.code}</span>
                    <span className="text-sm text-green-600 dark:text-green-400 ml-2">
                      -{appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}%` : `€${appliedDiscount.value}`}
                    </span>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={removeCoupon}
                  className="text-sm text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 underline"
                >
                  Verwijderen
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input 
                  value={couponCode} 
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase())
                    setCouponError('')
                  }}
                  placeholder="Kortingscode"
                  className="flex-1 px-3 py-2.5 text-base border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => validateCoupon()}
                  disabled={checkingCoupon || !couponCode.trim()}
                  className="px-4 py-2 bg-slate-100 dark:bg-gray-600 text-slate-700 dark:text-gray-200 rounded hover:bg-slate-200 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkingCoupon ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : 'Toepassen'}
                </button>
              </div>
            )}
            {couponError && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">{couponError}</p>
            )}
          </div>

          <div className="mt-3 p-4 bg-slate-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-700 dark:text-gray-300">Pakket</div>
              <div className="font-medium text-gray-900 dark:text-white">{isWebshop ? 'Webshop' : plan}</div>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 dark:border-gray-600">
              <div className="text-sm text-slate-700 dark:text-gray-300">Eenmalige opstartkosten</div>
              <div className="font-medium text-gray-900 dark:text-white">€{prices.setup}</div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-sm text-slate-700 dark:text-gray-300">Maandelijks</div>
              <div className="font-medium text-gray-900 dark:text-white">€{prices.monthly}/mnd</div>
            </div>
            {appliedDiscount && (
              <div className="flex items-center justify-between mt-1">
                <div className="text-sm text-green-600 dark:text-green-400">Korting ({appliedDiscount.code})</div>
                <div className="font-medium text-green-600 dark:text-green-400">
                  -{appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}%` : `€${appliedDiscount.value}`}
                </div>
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-slate-300 dark:border-gray-500">
              <p className="text-xs text-slate-500 dark:text-gray-400">
                💡 Betaling pas na goedkeuring van je design
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button type="button" className="px-4 py-2 rounded border dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={()=>setOpen(false)}>Annuleer</button>
            <button type="submit" className="btn-primary" disabled={processing}>{processing ? 'Verwerken…' : 'Gratis aanvragen'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
