import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Pakket prijzen (moet overeenkomen met server)
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
  const [domain, setDomain] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountInfo | null>(null)
  const [couponError, setCouponError] = useState('')
  const [checkingCoupon, setCheckingCoupon] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [isWebshop, setIsWebshop] = useState(false)

  // Bereken prijzen op basis van pakket
  const packageKey = isWebshop ? 'webshop' : (plan?.toLowerCase() || 'starter')
  const prices = PACKAGE_PRICES[packageKey] || PACKAGE_PRICES.starter
  
  // Bereken korting
  const calculateDiscount = () => {
    if (!appliedDiscount) return 0
    const basePrice = prices.monthly + prices.setup
    if (appliedDiscount.type === 'percentage') {
      return Math.round(basePrice * (appliedDiscount.value / 100) * 100) / 100
    }
    return Math.min(appliedDiscount.value, basePrice)
  }
  
  const discount = calculateDiscount()
  const totalFirstPayment = prices.monthly + prices.setup - discount

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
      
      // create payment session met eerste betaling (inclusief eenmalige kosten)
      const resp = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ 
          amount: totalFirstPayment.toFixed(2),
          description: `Webstability ${productType} ${plan} - Eerste betaling`,
          customerName: name,
          customerEmail: email,
          packageType,
          isFirstPayment: true,
          discountCode: appliedDiscount?.code, // Stuur kortingscode mee
          metadata: { 
            plan, 
            domain, 
            coupon: appliedDiscount?.code,
            isWebshop,
            setupCost: prices.setup,
            monthlyCost: prices.monthly,
            discountAmount: discount
          }
        })
      })
      const data = await resp.json()
      
      if (data.paymentUrl) {
        // Redirect naar Mollie betaalpagina
        window.location.href = data.paymentUrl
      } else if (data.url) {
        // Fallback voor mock payment
        const popup = window.open(data.url, 'mockpay', 'width=480,height=680')

        function onMessage(ev: MessageEvent){
          if(ev.data?.type === 'mock-payment' && ev.data?.id){
            fetch(`/api/mock-pay/${ev.data.id}/complete`, { method: 'POST' }).catch(()=>{})
            try{ (window as any).dataLayer = (window as any).dataLayer || []; (window as any).dataLayer.push({ event: 'purchase', plan, coupon: appliedDiscount?.code, amount: totalFirstPayment, paymentId: ev.data.id }) }catch(e){}
            alert(`Betaling ontvangen — we beginnen met je ${plan} site. Dank!`)
            window.removeEventListener('message', onMessage)
            popup?.close()
            setOpen(false)
          }
        }
        window.addEventListener('message', onMessage)
      }

    }catch(e){
      alert('Er is iets misgegaan bij het aanmaken van de betaling')
    }

    setProcessing(false)
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={()=>setOpen(false)} />
      <motion.div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-card" initial={{opacity:0,scale:0.98,y:8}} animate={{opacity:1,scale:1,y:0}} transition={{duration:0.18}}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bestel: {isWebshop ? 'Webshop' : plan}</h3>
        <p className="text-sm text-slate-600 dark:text-gray-300 mt-1">Vul je gegevens in om direct te starten.</p>

        <form onSubmit={submit} className="mt-4 space-y-3">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Volledige naam" className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" required />
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="E-mail" className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" required />
          <input value={domain} onChange={(e)=>setDomain(e.target.value)} placeholder="Gewenst domein (optioneel)" className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />

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
                  className="flex-1 px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
              <div className="text-sm text-slate-700 dark:text-gray-300">Eerste maand</div>
              <div className="font-medium text-gray-900 dark:text-white">€{prices.monthly}</div>
            </div>
            {appliedDiscount && discount > 0 && (
              <div className="flex items-center justify-between mt-1">
                <div className="text-sm text-green-600 dark:text-green-400">Korting ({appliedDiscount.code})</div>
                <div className="font-medium text-green-600 dark:text-green-400">-€{discount.toFixed(2)}</div>
              </div>
            )}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-300 dark:border-gray-500">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Totaal eerste betaling</div>
              <div className="font-bold text-lg text-primary-600 dark:text-primary-400">€{totalFirstPayment.toFixed(2)}</div>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">Daarna €{prices.monthly}/maand</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button type="button" className="px-4 py-2 rounded border dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={()=>setOpen(false)}>Annuleer</button>
            <button type="submit" className="btn-primary" disabled={processing}>{processing ? 'Verwerken…' : 'Naar betaling'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
