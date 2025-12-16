import { motion } from 'framer-motion'
import { useState } from 'react'

export default function SignupModal({ open, onClose }:{ open:boolean, onClose:()=>void }){
  const [email, setEmail] = useState('')
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-card" initial={{opacity:0,scale:0.96,y:8}} animate={{opacity:1,scale:1,y:0}} transition={{duration:0.22}}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Aanmelden voor een gratis adviesgesprek</h3>
        <p className="text-sm text-slate-600 dark:text-gray-300 mt-2">Laat je e‑mail achter en we nemen contact op om jouw wensen te bespreken.</p>
        <form className="mt-4 flex flex-col gap-3" onSubmit={(e)=>{e.preventDefault(); alert('Bedankt! We nemen contact op.'); onClose();}}>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="naam@bedrijf.nl" className="px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" required />
          <div className="text-xs text-slate-500 dark:text-gray-400">We gebruiken je e‑mail alleen om contact op te nemen. Geen spam.</div>
          <div className="flex items-center justify-end gap-2">
            <button type="button" className="px-4 py-2 rounded-lg border dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={onClose}>Annuleer</button>
            <button type="submit" className="btn-primary">Verstuur</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
