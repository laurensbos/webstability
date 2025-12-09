import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CheckoutModal(){
  const [open, setOpen] = useState(false)
  const [plan, setPlan] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [domain, setDomain] = useState('')
  const [coupon, setCoupon] = useState<string | null>(null)
  const [price, setPrice] = useState<number | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(()=>{
    function handler(e: any){
      const detail = e?.detail || {}
      setPlan(detail.plan || 'Starter')
      if(detail.domain) setDomain(detail.domain)
      if(detail.coupon) setCoupon(detail.coupon)
      if(detail.price) setPrice(Number(detail.price))
      setOpen(true)
      try{ (window as any).dataLayer = (window as any).dataLayer || []; (window as any).dataLayer.push({ event: 'checkout_open', plan: detail.plan, coupon: detail.coupon, price: detail.price }) }catch(e){}
    }
    window.addEventListener('open-checkout', handler as EventListener)
    return ()=> window.removeEventListener('open-checkout', handler as EventListener)
  },[])

  if(!open) return null

  async function submit(e: React.FormEvent){
    e.preventDefault()
    setProcessing(true)

    try{
      // create mock payment session
      const resp = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: `Bestelling ${plan}`, plan, name, email, domain, coupon, price })
      })
      const data = await resp.json()
      const url = data.url

      // open popup to simulate payment
      const popup = window.open(url, 'mockpay', 'width=480,height=680')

      function onMessage(ev: MessageEvent){
        if(ev.data?.type === 'mock-payment' && ev.data?.id){
          // finalize by calling our mock-complete endpoint
          fetch(`/api/mock-pay/${ev.data.id}/complete`, { method: 'POST' }).catch(()=>{})
          try{ (window as any).dataLayer = (window as any).dataLayer || []; (window as any).dataLayer.push({ event: 'purchase', plan, coupon, price, paymentId: ev.data.id }) }catch(e){}
          alert(`Betaling ontvangen — we beginnen met je ${plan} site. Dank!`)
          window.removeEventListener('message', onMessage)
          popup?.close()
          setOpen(false)
        }
      }

      window.addEventListener('message', onMessage)

    }catch(e){
      alert('Er is iets misgegaan bij het aanmaken van de betaling')
    }

    setProcessing(false)
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={()=>setOpen(false)} />
      <motion.div className="relative bg-white rounded-2xl p-6 max-w-lg w-full shadow-card" initial={{opacity:0,scale:0.98,y:8}} animate={{opacity:1,scale:1,y:0}} transition={{duration:0.18}}>
        <h3 className="text-lg font-semibold">Bestel: {plan}</h3>
        <p className="text-sm text-slate-600 mt-1">Vul je gegevens in en we nemen contact op om je site live te zetten.</p>

        <form onSubmit={submit} className="mt-4 space-y-3">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Volledige naam" className="w-full px-3 py-2 border rounded" required />
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="E-mail" className="w-full px-3 py-2 border rounded" required />
          <input value={domain} onChange={(e)=>setDomain(e.target.value)} placeholder="Gewenst domein (optioneel)" className="w-full px-3 py-2 border rounded" />

          <div className="mt-3 p-3 bg-slate-50 rounded">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-700">Pakket</div>
              <div className="font-medium">{plan}</div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-sm text-slate-700">Prijs</div>
              <div className="font-medium">{price ? `€${price}/mnd` : '—'}</div>
            </div>
            {coupon && (
              <div className="flex items-center justify-between mt-1">
                <div className="text-sm text-slate-700">Coupon</div>
                <div className="font-medium">{coupon}</div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button type="button" className="px-4 py-2 rounded border" onClick={()=>setOpen(false)}>Annuleer</button>
            <button type="submit" className="btn-primary" disabled={processing}>{processing ? 'Verwerken…' : 'Naar betaling'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
