/**
 * Live Going Wizard
 * Multi-step wizard for domain & email configuration before going live
 * Shown to clients after payment in development/review phase
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  Mail,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Copy,
  Check,
  Server,
  Sparkles,
  X,
  Info
} from 'lucide-react'
import type { DomainInfo, EmailInfo, LegalInfo, BusinessInfo, LiveGoingData } from './developer/types'
import { DOMAIN_REGISTRARS, EMAIL_PROVIDERS } from './developer/types'

interface LiveGoingWizardProps {
  businessName: string
  initialData?: Partial<LiveGoingData>
  onSave: (data: LiveGoingData) => Promise<void>
  onClose?: () => void
}

const DEFAULT_DOMAIN_INFO: DomainInfo = {
  hasDomain: false,
  transferStatus: 'not_started'
}

const DEFAULT_EMAIL_INFO: EmailInfo = {
  hasBusinessEmail: false,
  wantsWebstabilityEmail: false,
  emailSetupStatus: 'not_started'
}

const DEFAULT_CHECKLIST = {
  // Automatisch
  paymentReceived: false,
  paymentReceivedAt: undefined,
  
  // Domein
  authCodeProvided: false,
  authCode: undefined,
  authCodeProvidedAt: undefined,
  domainTransferStarted: false,
  domainTransferCompleted: false,
  
  // Juridisch
  privacyPolicyProvided: false,
  termsConditionsProvided: false,
  
  // Email
  emailPreferenceConfirmed: false,
  emailSetupCompleted: false,
  
  // Analytics
  analyticsAgreed: false,
  
  // Final
  finalApprovalGiven: false,
  finalApprovalAt: undefined
}

export default function LiveGoingWizard({
  businessName,
  initialData,
  onSave,
  onClose
}: LiveGoingWizardProps) {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  
  // Form state
  const [domainInfo, setDomainInfo] = useState<DomainInfo>(
    initialData?.domainInfo || DEFAULT_DOMAIN_INFO
  )
  const [emailInfo, setEmailInfo] = useState<EmailInfo>(
    initialData?.emailInfo || DEFAULT_EMAIL_INFO
  )
  const [legalInfo] = useState<LegalInfo>(
    initialData?.legalInfo || {
      hasPrivacyPolicy: false,
      wantsPrivacyPolicyCreated: false,
      hasTermsConditions: false,
      wantsTermsCreated: false,
      wantsAnalytics: false
    }
  )
  const [businessInfo] = useState<BusinessInfo>(
    initialData?.businessInfo || {}
  )
  const [notes, setNotes] = useState(initialData?.notes || '')

  const totalSteps = 4 // Domain, Email, Summary, Done

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave({
        domainInfo,
        emailInfo,
        legalInfo,
        businessInfo,
        checklist: DEFAULT_CHECKLIST,
        notes
      })
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    if (step < totalSteps) {
      // Auto-save on each step
      await handleSave()
      setStep(step + 1)
    }
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  // DNS records to show
  const dnsRecords = [
    { type: 'A', name: '@', value: '76.76.21.21', description: 'Verwijst je domein naar onze servers' },
    { type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com', description: 'Voor www.jouwdomein.nl' },
  ]

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Klaar voor livegang!</h2>
              <p className="text-white/80 text-sm">Configureer je domein en email</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition">
              <X className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="mt-4 flex items-center gap-2">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-white/70">
          <span>Domein</span>
          <span>E-mail</span>
          <span>Overzicht</span>
          <span>Klaar</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          {/* Step 1: Domain */}
          {step === 1 && (
            <motion.div
              key="domain"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Heb je al een domeinnaam?</h3>
                <p className="text-gray-400 text-sm">
                  Een domeinnaam is je website adres, zoals www.{businessName.toLowerCase().replace(/\s+/g, '')}.nl
                </p>
              </div>

              {/* Yes/No selection */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDomainInfo({ ...domainInfo, hasDomain: true })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    domainInfo.hasDomain
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      domainInfo.hasDomain ? 'bg-emerald-500' : 'bg-gray-700'
                    }`}>
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-white">Ja, ik heb een domein</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    We helpen je om je bestaande domein te koppelen
                  </p>
                </button>

                <button
                  onClick={() => setDomainInfo({ 
                    ...domainInfo, 
                    hasDomain: false, 
                    wantsNewDomain: true,
                    transferStatus: 'not_needed'
                  })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    !domainInfo.hasDomain
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      !domainInfo.hasDomain ? 'bg-emerald-500' : 'bg-gray-700'
                    }`}>
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-white">Nee, nog niet</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    We kunnen een nieuw domein voor je registreren
                  </p>
                </button>
              </div>

              {/* Existing domain form */}
              {domainInfo.hasDomain && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-2"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Wat is je domeinnaam?
                    </label>
                    <input
                      type="text"
                      value={domainInfo.domainName || ''}
                      onChange={e => setDomainInfo({ ...domainInfo, domainName: e.target.value })}
                      placeholder="jouwbedrijf.nl"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Waar is je domein geregistreerd?
                    </label>
                    <select
                      value={domainInfo.registrar || ''}
                      onChange={e => setDomainInfo({ ...domainInfo, registrar: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Selecteer provider...</option>
                      {DOMAIN_REGISTRARS.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* DNS Instructions */}
                  {domainInfo.domainName && domainInfo.registrar && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-blue-300 font-medium text-sm mb-2">
                            DNS-instellingen aanpassen
                          </p>
                          <p className="text-blue-200/70 text-sm mb-3">
                            Om je domein te koppelen moet je de volgende DNS-records instellen bij {
                              DOMAIN_REGISTRARS.find(r => r.value === domainInfo.registrar)?.label || domainInfo.registrar
                            }:
                          </p>
                          
                          <div className="space-y-2">
                            {dnsRecords.map(record => (
                              <div key={record.name} className="bg-gray-900/50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-gray-400">
                                    {record.type} Record - {record.name}
                                  </span>
                                  <button
                                    onClick={() => handleCopy(record.value, record.name)}
                                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                  >
                                    {copied === record.name ? (
                                      <><Check className="w-3 h-3" /> Gekopieerd</>
                                    ) : (
                                      <><Copy className="w-3 h-3" /> Kopieer</>
                                    )}
                                  </button>
                                </div>
                                <code className="text-sm text-emerald-400 font-mono">{record.value}</code>
                                <p className="text-xs text-gray-500 mt-1">{record.description}</p>
                              </div>
                            ))}
                          </div>
                          
                          <p className="text-xs text-blue-200/50 mt-3">
                            💡 Het kan tot 24 uur duren voordat DNS-wijzigingen actief zijn
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* New domain form */}
              {!domainInfo.hasDomain && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-2"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Welke domeinnaam wil je? (optioneel)
                    </label>
                    <input
                      type="text"
                      value={domainInfo.preferredDomain || ''}
                      onChange={e => setDomainInfo({ ...domainInfo, preferredDomain: e.target.value })}
                      placeholder={`${businessName.toLowerCase().replace(/\s+/g, '')}.nl`}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      We checken of deze beschikbaar is en nemen contact op over de opties
                    </p>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-emerald-300 font-medium text-sm">Inclusief bij je pakket</p>
                        <p className="text-emerald-200/70 text-sm mt-1">
                          Domeinregistratie (.nl) is inbegrepen in je maandelijkse abonnement. We regelen dit voor je!
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 2: Email */}
          {step === 2 && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Zakelijke e-mail</h3>
                <p className="text-gray-400 text-sm">
                  Een professioneel e-mailadres zoals info@{domainInfo.domainName || 'jouwbedrijf.nl'}
                </p>
              </div>

              {/* Has business email */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setEmailInfo({ ...emailInfo, hasBusinessEmail: true })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    emailInfo.hasBusinessEmail
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      emailInfo.hasBusinessEmail ? 'bg-emerald-500' : 'bg-gray-700'
                    }`}>
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-white">Ja, ik heb al zakelijke email</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Google Workspace, Microsoft 365, of andere provider
                  </p>
                </button>

                <button
                  onClick={() => setEmailInfo({ ...emailInfo, hasBusinessEmail: false })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    !emailInfo.hasBusinessEmail
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      !emailInfo.hasBusinessEmail ? 'bg-emerald-500' : 'bg-gray-700'
                    }`}>
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-white">Nee, nog niet</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Ik wil graag een zakelijk e-mailadres
                  </p>
                </button>
              </div>

              {/* Existing email provider */}
              {emailInfo.hasBusinessEmail && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-2"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Welke e-mail provider gebruik je?
                    </label>
                    <select
                      value={emailInfo.currentProvider || ''}
                      onChange={e => setEmailInfo({ ...emailInfo, currentProvider: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Selecteer provider...</option>
                      {EMAIL_PROVIDERS.filter(p => p.value !== 'none').map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-blue-300 font-medium text-sm">MX-records behouden</p>
                        <p className="text-blue-200/70 text-sm mt-1">
                          We zorgen ervoor dat je bestaande e-mail blijft werken. 
                          De MX-records van je huidige provider blijven behouden.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Wants new email */}
              {!emailInfo.hasBusinessEmail && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-2"
                >
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Wat wil je voor e-mail?
                    </label>
                    
                    <button
                      onClick={() => setEmailInfo({ 
                        ...emailInfo, 
                        wantsWebstabilityEmail: true,
                        wantsEmailForwarding: false 
                      })}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        emailInfo.wantsWebstabilityEmail && !emailInfo.wantsEmailForwarding
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Server className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="font-medium text-white">Zakelijke mailbox</span>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Volledige mailbox met opslag (€5/maand per mailbox)
                          </p>
                        </div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setEmailInfo({ 
                        ...emailInfo, 
                        wantsEmailForwarding: true,
                        wantsWebstabilityEmail: true
                      })}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        emailInfo.wantsEmailForwarding
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="font-medium text-white">E-mail doorsturen (gratis)</span>
                          <p className="text-xs text-gray-400 mt-0.5">
                            info@jouwdomein.nl → jouw.email@gmail.com
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setEmailInfo({ 
                        ...emailInfo, 
                        wantsWebstabilityEmail: false,
                        wantsEmailForwarding: false,
                        emailSetupStatus: 'not_needed'
                      })}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        !emailInfo.wantsWebstabilityEmail && !emailInfo.wantsEmailForwarding
                          ? 'border-gray-600 bg-gray-800/50'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <X className="w-5 h-5 text-gray-500" />
                        <div>
                          <span className="font-medium text-gray-400">Geen zakelijke email nodig</span>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Ik regel dit later zelf
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Forwarding address input */}
                  {emailInfo.wantsEmailForwarding && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Naar welk e-mailadres wil je doorsturen?
                      </label>
                      <input
                        type="email"
                        value={emailInfo.forwardingAddress || ''}
                        onChange={e => setEmailInfo({ ...emailInfo, forwardingAddress: e.target.value })}
                        placeholder="jouw.email@gmail.com"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 3: Summary */}
          {step === 3 && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Overzicht</h3>
                <p className="text-gray-400 text-sm">
                  Controleer je keuzes voor de livegang
                </p>
              </div>

              {/* Domain summary */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-medium text-white">Domein</h4>
                </div>
                <div className="space-y-2 text-sm">
                  {domainInfo.hasDomain ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Domeinnaam</span>
                        <span className="text-white font-medium">{domainInfo.domainName || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Provider</span>
                        <span className="text-white">
                          {DOMAIN_REGISTRARS.find(r => r.value === domainInfo.registrar)?.label || '-'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status</span>
                        <span className="text-amber-400">DNS aanpassen nodig</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nieuw domein</span>
                        <span className="text-emerald-400">Wij regelen dit</span>
                      </div>
                      {domainInfo.preferredDomain && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Gewenste naam</span>
                          <span className="text-white">{domainInfo.preferredDomain}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Email summary */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <h4 className="font-medium text-white">E-mail</h4>
                </div>
                <div className="space-y-2 text-sm">
                  {emailInfo.hasBusinessEmail ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Huidige provider</span>
                        <span className="text-white">
                          {EMAIL_PROVIDERS.find(p => p.value === emailInfo.currentProvider)?.label || '-'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status</span>
                        <span className="text-emerald-400">Blijft behouden</span>
                      </div>
                    </>
                  ) : emailInfo.wantsEmailForwarding ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type</span>
                        <span className="text-white">E-mail doorsturen</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Doorsturen naar</span>
                        <span className="text-white">{emailInfo.forwardingAddress || '-'}</span>
                      </div>
                    </>
                  ) : emailInfo.wantsWebstabilityEmail ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type</span>
                        <span className="text-white">Zakelijke mailbox</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Kosten</span>
                        <span className="text-white">€5/maand per mailbox</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-gray-400">E-mail</span>
                      <span className="text-gray-500">Niet nodig</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Opmerkingen (optioneel)
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Bijv. specifieke wensen voor de livegang..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Done */}
          {step === 4 && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Gegevens opgeslagen!</h3>
              <p className="text-gray-400 mb-6">
                We nemen contact op over de volgende stappen voor je livegang.
              </p>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-left">
                <h4 className="font-medium text-emerald-400 mb-2">Wat gebeurt er nu?</h4>
                <ul className="space-y-2 text-sm text-emerald-200/80">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>We controleren je domein en DNS-instellingen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>SSL-certificaat wordt geïnstalleerd</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>E-mail wordt geconfigureerd (indien van toepassing)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Finale check en livegang! 🚀</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer navigation */}
      <div className="p-5 border-t border-gray-800 flex justify-between">
        <button
          onClick={handlePrev}
          disabled={step === 1}
          className="flex items-center gap-2 px-4 py-2.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition rounded-xl hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Vorige
        </button>

        {step < 4 ? (
          <button
            onClick={handleNext}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : step === 3 ? (
              <>Bevestigen <CheckCircle2 className="w-4 h-4" /></>
            ) : (
              <>Volgende <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        ) : (
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition"
          >
            Sluiten
          </button>
        )}
      </div>
    </div>
  )
}
