import { useState } from 'react'
import { smoothScroll } from '../lib/smoothScroll'

export default function Deal(){
  const [coupon, setCoupon] = useState('NEWYEAR30')
  const [applied, setApplied] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [couponInfo, setCouponInfo] = useState<any | null>({ code: 'NEWYEAR30', discount: 0.3, expires: '2026-01-31' })

  const basePrice = 29 // eur /month for Business
  const discounted = +(basePrice * (1 - (couponInfo?.discount || 0))).toFixed(2)

  function track(event: string, props: Record<string, any> = {}){
    try{ (window as any).dataLayer = (window as any).dataLayer || []; (window as any).dataLayer.push({ event, ...props }) }catch(e){}
  }

  async function applyCoupon(){
    setProcessing(true)
    try{
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(coupon)}`)
      const json = await res.json()
      if(json && json.valid){
        setApplied(true)
        setCouponInfo({ code: json.code, discount: Number(json.discount), expires: json.expires })
        track('deal_coupon_valid', { coupon: coupon.toUpperCase(), discount: json.discount })
      } else {
        setApplied(false)
        setCouponInfo(null)
        track('deal_coupon_invalid', { coupon: coupon.toUpperCase() })
      }
    }catch(e){
      setApplied(false)
      setCouponInfo(null)
      track('deal_coupon_error', { coupon: coupon.toUpperCase() })
    }

    setProcessing(false)
  }

  async function claimDeal(){
    if(!applied) return
    setProcessing(true)
    track('deal_claim_clicked', { coupon, plan: 'Business', price: discounted })

    // Open checkout modal via custom event so existing modal can react
    window.dispatchEvent(new CustomEvent('open-checkout', { detail: { plan: 'Business', coupon: couponInfo?.code || null, price: discounted } }))

    // Also create a lightweight onboard project to reserve the slot (mock)
    try{
      await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: 'Nieuwjaarsdeal aanvraag', plan: 'Business', coupon: couponInfo?.code })
      })
    }catch(e){ /* ignore */ }

    setProcessing(false)
    // scroll to pricing as fallback
    smoothScroll('#pricing')
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="card text-[var(--brand-dark)] rounded-xl p-6 shadow-md">
        <h1 className="text-2xl font-extrabold">Nieuwjaarsdeal — 30% korting</h1>
        <p className="mt-2 text-[var(--muted)]">Claim 30% korting op ons Business-pakket bij jaarbetaling. Beperkte beschikbaarheid.</p>

        <div className="mt-4 grid md:grid-cols-2 gap-4 items-center">
          <div>
            <div className="text-sm text-[var(--muted)]">Standaard prijs</div>
            <div className="text-3xl font-bold text-[var(--brand-dark)]">€{basePrice}<span className="text-sm">/mnd</span></div>
          </div>

          <div>
            <label className="text-xs text-[var(--muted)]">Coupon</label>
            <div className="mt-2 flex gap-2">
              <input value={coupon} onChange={e=>setCoupon(e.target.value)} className="flex-1 px-3 py-2 rounded-md bg-[rgba(255,255,255,0.02)] text-[var(--brand-dark)]" />
              <button onClick={applyCoupon} className="px-3 rounded-md font-semibold bg-[rgba(255,217,138,0.12)] text-[#ffd98a]" disabled={processing}>{processing ? 'Controleren…' : 'Toepassen'}</button>
            </div>

            {couponInfo && applied ? (
              <div className="mt-2 text-sm text-[var(--muted)]">Korting toegepast — nieuwe prijs: <strong>€{discounted}/mnd</strong> (code {couponInfo.code}, verloopt {couponInfo.expires})</div>
            ) : (
              <div className="mt-2 text-sm text-[var(--muted)]">{applied ? 'Voer een coupon in en klik Toepassen.' : 'Coupon ongeldig of verlopen.'}</div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button disabled={!applied || processing} onClick={claimDeal} className="btn-primary">
            {processing ? 'Bezig...' : 'Claim & naar afrekenen'}
          </button>
          <button onClick={()=>smoothScroll('#pricing')} className="text-[var(--muted)] underline">Bekijk pakketten</button>
        </div>

        <p className="mt-3 text-xs text-[var(--muted)]">14 dagen niet-goed-geld-terug — coupon alleen geldig voor nieuwe klanten.</p>
      </div>
    </main>
  )
}
