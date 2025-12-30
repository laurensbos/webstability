import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
      setCouponError(t('checkout.coupon.enterCode'))
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
        setCouponError(data.error || t('checkout.coupon.invalid'))
      }
    } catch (e) {
      setCouponError(t('checkout.coupon.checkError'))
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
        alert(t('checkout.errors.emailInUse'))
      } else {
        alert(data.error || t('checkout.errors.general'))
      }

    }catch(e){
      alert(t('checkout.errors.general'))
    }

    setProcessing(false)
  }

  // Success scherm na aanvraag - Enhanced
  if (success && projectId) {
    return (
      <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>{setOpen(false); setSuccess(false); setProjectId(null)}} />
        <motion.div 
          className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-center max-h-[90vh] overflow-y-auto border-2 border-gray-100 dark:border-gray-700" 
          initial={{opacity:0, y: 20, scale: 0.95}} 
          animate={{opacity:1, y: 0, scale: 1}} 
          transition={{duration:0.25, type: 'spring', stiffness: 300, damping: 25}}
        >
          {/* Mobile drag handle */}
          <div className="sm:hidden flex justify-center -mt-2 mb-4">
            <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>
          
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/30">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {t('checkout.success.title')} 🎉
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-5 text-base">
            {t('checkout.success.description', { type: isWebshop ? 'webshop' : 'website' })}
          </p>
          
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-5 mb-6 border-2 border-gray-100 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">{t('checkout.success.projectId')}</p>
            <p className="text-2xl font-mono font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">{projectId}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              {t('checkout.success.saveId')}
            </p>
          </div>
          
          {/* Direct action buttons */}
          <div className="space-y-3 mb-6">
            <motion.a 
              href={`/intake/${projectId}`}
              className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-blue-500 text-white rounded-xl font-semibold text-center flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {t('checkout.success.startUpload')} →
            </motion.a>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {t('checkout.success.uploadHint')}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 mb-6 text-left border-2 border-blue-100 dark:border-blue-800">
            <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📋</span>
              </span>
              {t('checkout.success.whatsNext.title')}
            </h4>
            <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <span><strong>{t('checkout.success.whatsNext.now')}:</strong> {t('checkout.success.whatsNext.step1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <span>{t('checkout.success.whatsNext.step2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <span>{t('checkout.success.whatsNext.step3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                <span>{t('checkout.success.whatsNext.step4')}</span>
              </li>
            </ol>
          </div>
          
          <motion.button 
            onClick={()=>{setOpen(false); setSuccess(false); setProjectId(null)}}
            className="w-full py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 text-sm font-medium transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('checkout.success.later')}
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setOpen(false)} />
      <motion.div 
        className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto border-2 border-gray-100 dark:border-gray-700" 
        initial={{opacity:0, y: 20, scale: 0.95}} 
        animate={{opacity:1, y: 0, scale: 1}} 
        transition={{duration:0.25, type: 'spring', stiffness: 300, damping: 25}}
      >
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-blue-500 to-indigo-500 rounded-t-2xl sm:rounded-t-xl" />
        
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center -mt-1 mb-3">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('checkout.form.title', { plan: isWebshop ? 'Webshop' : plan })}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('checkout.form.subtitle')}</p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder={t('checkout.form.name')} className="w-full px-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" required />
          <input value={companyName} onChange={(e)=>setCompanyName(e.target.value)} placeholder={t('checkout.form.companyName')} className="w-full px-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" />
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder={t('checkout.form.email')} className="w-full px-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" required />
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} type="tel" placeholder={t('checkout.form.phone')} className="w-full px-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" />
          <input value={domain} onChange={(e)=>setDomain(e.target.value)} placeholder={t('checkout.form.domain')} className="w-full px-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" />

          {/* Kortingscode sectie - Enhanced */}
          <div className="mt-3">
            {appliedDiscount ? (
              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/30">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-green-700 dark:text-green-300">{appliedDiscount.code}</span>
                    <span className="text-sm text-green-600 dark:text-green-400 ml-2 font-medium">
                      -{appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}%` : `€${appliedDiscount.value}`}
                    </span>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={removeCoupon}
                  className="text-sm text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 underline font-medium"
                >
                  {t('checkout.coupon.remove')}
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
                  placeholder={t('checkout.coupon.placeholder')}
                  className="flex-1 px-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => validateCoupon()}
                  disabled={checkingCoupon || !couponCode.trim()}
                  className="px-5 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-500 dark:hover:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
                >
                  {checkingCoupon ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : t('checkout.coupon.apply')}
                </button>
              </div>
            )}
            {couponError && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-2 font-medium">{couponError}</p>
            )}
          </div>

          {/* Summary card - Enhanced */}
          <div className="mt-4 p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border-2 border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t('checkout.summary.package')}</div>
              <div className="font-bold text-gray-900 dark:text-white">{isWebshop ? 'Webshop' : plan}</div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t('checkout.summary.setupCost')}</div>
              <div className="font-bold text-gray-900 dark:text-white">€{prices.setup}</div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t('checkout.summary.monthly')}</div>
              <div className="font-bold text-gray-900 dark:text-white">€{prices.monthly}/{t('checkout.summary.perMonth')}</div>
            </div>
            {appliedDiscount && (
              <div className="flex items-center justify-between mt-2">
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">{t('checkout.summary.discount')} ({appliedDiscount.code})</div>
                <div className="font-bold text-green-600 dark:text-green-400">
                  -{appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}%` : `€${appliedDiscount.value}`}
                </div>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span className="w-5 h-5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-md flex items-center justify-center text-white text-xs">💡</span>
                {t('checkout.summary.paymentNote')}
              </p>
            </div>
          </div>

          {/* Action buttons - Enhanced */}
          <div className="flex items-center justify-between pt-4 gap-3">
            <motion.button 
              type="button" 
              className="flex-1 px-5 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 font-semibold transition-all" 
              onClick={()=>setOpen(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t('common.cancel')}
            </motion.button>
            <motion.button 
              type="submit" 
              className="flex-1 px-5 py-3.5 bg-gradient-to-r from-primary-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all" 
              disabled={processing}
              whileHover={{ scale: processing ? 1 : 1.02 }}
              whileTap={{ scale: processing ? 1 : 0.98 }}
            >
              {processing ? t('checkout.form.processing') : t('checkout.form.submit')}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
