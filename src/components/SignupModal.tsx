import { motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function SignupModal({ open, onClose }:{ open:boolean, onClose:()=>void }){
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-card" initial={{opacity:0,scale:0.96,y:8}} animate={{opacity:1,scale:1,y:0}} transition={{duration:0.22}}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('signupModal.title')}</h3>
        <p className="text-sm text-slate-600 dark:text-gray-300 mt-2">{t('signupModal.description')}</p>
        <form className="mt-4 flex flex-col gap-3" onSubmit={(e)=>{e.preventDefault(); alert(t('signupModal.thankYou')); onClose();}}>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder={t('signupModal.emailPlaceholder')} className="px-4 py-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" required />
          <div className="text-xs text-slate-500 dark:text-gray-400">{t('signupModal.privacy')}</div>
          <div className="flex items-center justify-end gap-2">
            <button type="button" className="px-4 py-2 rounded-lg border dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={onClose}>{t('signupModal.cancel')}</button>
            <button type="submit" className="btn-primary">{t('signupModal.submit')}</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
