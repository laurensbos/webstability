import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LivePreview } from './LivePreview'
import { useLocalStorage } from '../hooks/useLocalStorage'

type WizardState = {
  businessName: string
  industry: string
  template: string
  title: string
  subtitle: string
  cta: string
  contactEmail: string
}

const initial: WizardState = {
  businessName: '',
  industry: 'general',
  template: 'starter',
  title: 'Moderne website die converteert',
  subtitle: 'Klaar voor online succes — snel live, SEO-ready en mobiel geoptimaliseerd.',
  cta: 'Start nu',
  contactEmail: '',
}

export function OnboardingWizard(){
  const [data, setData] = useLocalStorage<WizardState>('onboard:data', initial)
  const [step, setStep] = useLocalStorage<number>('onboard:step', 1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function patch(partial: Partial<WizardState>){
    setData({ ...data, ...partial })
  }

  async function submit(){
    setLoading(true)
    setMessage(null)
    try{
      const res = await fetch('/api/onboard', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const json = await res.json()
      setMessage('Project aangemaakt — ID: ' + json.id)
      setStep(4)
      setData({ ...data })
    }catch(err){
      setMessage('Er is iets misgegaan bij het aanmaken.')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div>
          <div className="mb-4">
            <div className="text-sm text-slate-500 dark:text-gray-400">Stap {step} van 3</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Snel je website brief</h3>
            <p className="text-sm text-slate-600 dark:text-gray-300 mt-1">In 3 stappen een eerste website-brief en preview.</p>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.form key="step1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} onSubmit={(e)=>{e.preventDefault(); setStep(2)}} className="space-y-4">
                  <label className="block">
                    <div className="text-sm font-medium text-slate-700 dark:text-gray-300">Bedrijfsnaam</div>
                    <input value={data.businessName} onChange={(e)=>patch({ businessName: e.target.value })} className="mt-2 w-full px-4 py-2 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400" placeholder="Bijv. Jansen Fietsen" required />
                  </label>

                  <label className="block">
                    <div className="text-sm font-medium text-slate-700 dark:text-gray-300">Branche</div>
                    <select value={data.industry} onChange={(e)=>patch({ industry: e.target.value })} className="mt-2 w-full px-4 py-2 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="general">Algemeen</option>
                      <option value="restaurant">Horeca</option>
                      <option value="shop">Webshop</option>
                      <option value="service">Dienstverlener</option>
                    </select>
                  </label>

                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary px-4 py-2 rounded-md">Volgende</button>
                  </div>
                </motion.form>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Kies template</div>
                    <div className="mt-3 flex gap-3">
                      <button onClick={()=>patch({ template: 'starter' })} className={`px-4 py-2 rounded-md border ${data.template === 'starter' ? 'bg-violet-600 text-white' : 'bg-white dark:bg-gray-700 dark:text-white'}`}>Starter</button>
                      <button onClick={()=>patch({ template: 'shop' })} className={`px-4 py-2 rounded-md border ${data.template === 'shop' ? 'bg-violet-600 text-white' : 'bg-white dark:bg-gray-700 dark:text-white'}`}>Webshop</button>
                    </div>
                  </div>

                  <div>
                    <label>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Korte headline</div>
                      <input value={data.title} onChange={(e)=>patch({ title: e.target.value })} className="mt-2 w-full px-4 py-2 rounded-md border dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    </label>
                    <label className="block mt-3">
                      <div className="text-sm font-medium text-slate-700 dark:text-gray-300">Subheadline</div>
                      <input value={data.subtitle} onChange={(e)=>patch({ subtitle: e.target.value })} className="mt-2 w-full px-4 py-2 rounded-md border dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    </label>
                    <div className="flex gap-3 mt-4">
                      <button onClick={()=>setStep(1)} className="px-4 py-2 rounded-md border dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Terug</button>
                      <button onClick={()=>setStep(3)} className="btn-primary px-4 py-2 rounded-md">Volgende</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
                  <label>
                    <div className="text-sm font-medium text-slate-700 dark:text-gray-300">Contact e-mail</div>
                    <input value={data.contactEmail} onChange={(e)=>patch({ contactEmail: e.target.value })} className="mt-2 w-full px-4 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="jij@bedrijf.nl" type="email" />
                  </label>

                  <div className="flex gap-3">
                    <button onClick={()=>setStep(2)} className="px-4 py-2 rounded-md border dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Terug</button>
                    <button onClick={submit} disabled={loading} className="btn-primary px-4 py-2 rounded-md">{loading ? 'Aanmaken...' : 'Aanmaken & preview'}</button>
                  </div>

                  {message && <div className="mt-3 text-sm text-slate-600 dark:text-gray-400">{message}</div>}
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="p-4 rounded-md bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300">Je project is aangemaakt. Bekijk de preview of ga verder naar pricing / publish.</div>
                  <div className="mt-4 space-y-2">
                    <a href="/#pricing" className="text-indigo-600 dark:text-indigo-400">Bekijk pakketten</a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <div className="sticky top-24">
            <LivePreview content={{ businessName: data.businessName, title: data.title, subtitle: data.subtitle, cta: data.cta }} onChange={(patch)=>patch && setData(prev=>({...prev,...patch}))} />
            <div className="mt-4 text-sm text-slate-500 dark:text-gray-400">Tip: klik op tekst in de preview om direct te bewerken. Opslaan gebeurt automatisch bij afronding.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
