/**
 * PreLiveChecklist - Klant checklist na betaling
 * 
 * Toont alle items die klant moet invullen/bevestigen voordat website live kan.
 * Mobiel-geoptimaliseerd en gebruiksvriendelijk.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Globe,
  Mail,
  FileText,
  Shield,
  BarChart3,
  Loader2,
  ChevronDown,
  Sparkles,
  Building2,
  Info
} from 'lucide-react'

interface PreLiveChecklistProps {
  projectId: string
  projectData: {
    businessName: string
    domainInfo?: {
      hasDomain: boolean
      domainName?: string
      registrar?: string
      authCode?: string
      transferStatus?: string
    }
    emailInfo?: {
      emailPreference?: 'none' | 'new' | 'existing'
      currentProvider?: string
      desiredEmails?: string[]
    }
    legalInfo?: {
      hasPrivacyPolicy?: boolean
      privacyPolicyUrl?: string
      hasTermsConditions?: boolean
      termsConditionsUrl?: string
      wantsAnalytics?: boolean
    }
    businessInfo?: {
      kvkNumber?: string
      btwNumber?: string
    }
    preLiveChecklist?: {
      paymentReceived?: boolean
      authCodeProvided?: boolean
      privacyPolicyProvided?: boolean
      termsConditionsProvided?: boolean
      emailPreferenceConfirmed?: boolean
      analyticsAgreed?: boolean
      finalApprovalGiven?: boolean
    }
  }
  onUpdate: (data: Record<string, unknown>) => Promise<void>
}

// Domein registrars
const REGISTRARS = [
  { value: 'transip', label: 'TransIP' },
  { value: 'hostnet', label: 'Hostnet' },
  { value: 'strato', label: 'Strato' },
  { value: 'versio', label: 'Versio' },
  { value: 'mijndomein', label: 'Mijn Domein' },
  { value: 'godaddy', label: 'GoDaddy' },
  { value: 'andere', label: 'Anders' },
  { value: 'weet_niet', label: 'Weet ik niet' },
]

export default function PreLiveChecklist({ projectId, projectData, onUpdate }: PreLiveChecklistProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('domain')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Domein
    hasDomain: projectData.domainInfo?.hasDomain ?? true,
    domainName: projectData.domainInfo?.domainName || '',
    registrar: projectData.domainInfo?.registrar || '',
    authCode: projectData.domainInfo?.authCode || '',
    
    // Email
    emailPreference: projectData.emailInfo?.emailPreference || 'existing',
    currentEmailProvider: projectData.emailInfo?.currentProvider || '',
    desiredEmails: projectData.emailInfo?.desiredEmails?.join(', ') || '',
    
    // Juridisch
    hasPrivacyPolicy: projectData.legalInfo?.hasPrivacyPolicy ?? false,
    privacyPolicyUrl: projectData.legalInfo?.privacyPolicyUrl || '',
    wantsPrivacyPolicyCreated: false,
    hasTermsConditions: projectData.legalInfo?.hasTermsConditions ?? false,
    termsConditionsUrl: projectData.legalInfo?.termsConditionsUrl || '',
    wantsTermsCreated: false,
    wantsAnalytics: projectData.legalInfo?.wantsAnalytics ?? true,
    
    // Business
    kvkNumber: projectData.businessInfo?.kvkNumber || '',
    btwNumber: projectData.businessInfo?.btwNumber || '',
  })

  const checklist = projectData.preLiveChecklist || {}
  
  // Calculate progress
  const totalItems = 5
  const completedItems = [
    checklist.paymentReceived,
    checklist.authCodeProvided || !formData.hasDomain,
    checklist.privacyPolicyProvided || formData.hasPrivacyPolicy || formData.wantsPrivacyPolicyCreated,
    checklist.termsConditionsProvided || formData.hasTermsConditions || formData.wantsTermsCreated,
    checklist.emailPreferenceConfirmed,
  ].filter(Boolean).length

  const progress = Math.round((completedItems / totalItems) * 100)

  const handleSave = async (section: string) => {
    setIsSubmitting(true)
    try {
      await onUpdate({
        section,
        ...formData,
        projectId
      })
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const SectionHeader = ({ 
    id, 
    icon: Icon, 
    title, 
    subtitle, 
    isComplete 
  }: { 
    id: string
    icon: React.ElementType
    title: string
    subtitle: string
    isComplete: boolean
  }) => (
    <motion.button
      onClick={() => toggleSection(id)}
      whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
      whileTap={{ scale: 0.99 }}
      className="w-full flex items-center gap-4 p-5 sm:p-6 text-left transition-colors rounded-xl"
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
        isComplete 
          ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-green-500/25' 
          : 'bg-gray-800'
      }`}>
        {isComplete ? (
          <CheckCircle2 className="w-7 h-7 text-white" />
        ) : (
          <Icon className="w-7 h-7 text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-lg text-white">{title}</h3>
        <p className="text-sm text-gray-400 truncate">{subtitle}</p>
      </div>
      <motion.div 
        className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center"
        animate={{ rotate: expandedSection === id ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </motion.div>
    </motion.button>
  )

  return (
    <div className="space-y-6">
      {/* Progress header - Enhanced */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-purple-500/20 rounded-2xl p-6 sm:p-8 border-2 border-purple-500/30 overflow-hidden shadow-xl shadow-purple-500/10"
      >
        {/* Decorative blur orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-500 to-blue-500 opacity-20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 opacity-15 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative flex items-center gap-5 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Bijna live!</h2>
            <p className="text-gray-300">Vul onderstaande gegevens in</p>
          </div>
        </div>
        
        {/* Progress bar - Enhanced */}
        <div className="relative space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 font-medium">{completedItems} van {totalItems} items</span>
            <span className="font-bold text-purple-400">{progress}%</span>
          </div>
          <div className="h-4 bg-gray-800/80 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg shadow-purple-500/30"
            />
          </div>
        </div>

        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mt-6 p-5 bg-green-500/20 rounded-xl border-2 border-green-500/30 shadow-lg shadow-green-500/10"
          >
            <p className="text-green-400 font-bold text-center text-lg">
              ✅ Alles ingevuld! Je website gaat binnen 72 uur live.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Payment status - always first - Enhanced */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ y: -2 }}
        className="relative bg-gray-800/60 rounded-2xl overflow-hidden border-2 border-gray-700/50 shadow-lg"
      >
        {/* Gradient accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          checklist.paymentReceived 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'bg-gradient-to-r from-amber-500 to-orange-500'
        }`} />
        
        <div className="flex items-center gap-5 p-5 sm:p-6">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
            checklist.paymentReceived 
              ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-green-500/25' 
              : 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/25'
          }`}>
            {checklist.paymentReceived ? (
              <CheckCircle2 className="w-7 h-7 text-white" />
            ) : (
              <Loader2 className="w-7 h-7 text-white animate-spin" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Betaling</h3>
            <p className={`text-sm font-medium ${
              checklist.paymentReceived ? 'text-green-400' : 'text-amber-400'
            }`}>
              {checklist.paymentReceived 
                ? '✅ Betaling ontvangen' 
                : '⏳ Wachten op betaling...'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Domain section - Enhanced */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        whileHover={{ y: -2 }}
        className="relative bg-gray-800/60 rounded-2xl overflow-hidden border-2 border-gray-700/50 shadow-lg"
      >
        {/* Gradient accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          (checklist.authCodeProvided || !formData.hasDomain)
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
        }`} />
        
        <SectionHeader
          id="domain"
          icon={Globe}
          title="Domeinnaam"
          subtitle={formData.domainName || 'Waar moet je website op komen?'}
          isComplete={checklist.authCodeProvided || !formData.hasDomain}
        />
        
        <AnimatePresence>
          {expandedSection === 'domain' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-700/50"
            >
              <div className="p-4 sm:p-6 space-y-5">
                {/* Has domain toggle */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, hasDomain: true })}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      formData.hasDomain 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className="font-medium">Ik heb al een domeinnaam</span>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, hasDomain: false })}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      !formData.hasDomain 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className="font-medium">Ik wil een nieuwe domeinnaam</span>
                  </button>
                </div>

                {formData.hasDomain ? (
                  <>
                    {/* Domain name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Je domeinnaam
                      </label>
                      <input
                        type="text"
                        value={formData.domainName}
                        onChange={(e) => setFormData({ ...formData, domainName: e.target.value })}
                        placeholder="bijv. jouwbedrijf.nl"
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {/* Registrar */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Waar is je domein geregistreerd?
                      </label>
                      <select
                        value={formData.registrar}
                        onChange={(e) => setFormData({ ...formData, registrar: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Selecteer...</option>
                        {REGISTRARS.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Auth code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Autorisatiecode (EPP-code)
                        <span className="text-gray-500 font-normal ml-2">- indien beschikbaar</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.authCode}
                          onChange={(e) => setFormData({ ...formData, authCode: e.target.value })}
                          placeholder="bijv. Ab12Cd34Ef56"
                          className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition"
                          title="Hulp nodig?"
                        >
                          <Info className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        💡 Je vindt deze code in het dashboard van je domeinprovider. 
                        <a href="#" className="text-purple-400 hover:underline ml-1">Hoe vind ik deze?</a>
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-blue-300 text-sm">
                      🌐 Prima! Wij registreren een nieuwe domeinnaam voor je. 
                      Je ontvangt hierover bericht van onze developer.
                    </p>
                  </div>
                )}

                <motion.button
                  onClick={() => handleSave('domain')}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Opslaan
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Email section - Enhanced */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ y: -2 }}
        className="relative bg-gray-800/60 rounded-2xl overflow-hidden border-2 border-gray-700/50 shadow-lg"
      >
        {/* Gradient accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          checklist.emailPreferenceConfirmed
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'bg-gradient-to-r from-purple-500 to-pink-500'
        }`} />
        
        <SectionHeader
          id="email"
          icon={Mail}
          title="E-mail"
          subtitle="Zakelijke e-mail bij je domein"
          isComplete={!!checklist.emailPreferenceConfirmed}
        />
        
        <AnimatePresence>
          {expandedSection === 'email' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-700/50"
            >
              <div className="p-4 sm:p-6 space-y-5">
                <p className="text-gray-400 text-sm">
                  Wil je een zakelijk e-mailadres zoals info@{formData.domainName || 'jouwbedrijf.nl'}?
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => setFormData({ ...formData, emailPreference: 'none' })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      formData.emailPreference === 'none' 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className="font-medium block">Nee, geen zakelijke e-mail nodig</span>
                    <span className="text-sm text-gray-400">Ik gebruik mijn eigen e-mail (Gmail, etc.)</span>
                  </button>

                  <button
                    onClick={() => setFormData({ ...formData, emailPreference: 'existing' })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      formData.emailPreference === 'existing' 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className="font-medium block">Ik heb al zakelijke e-mail</span>
                    <span className="text-sm text-gray-400">Behoud mijn huidige e-mail (we passen alleen de website DNS aan)</span>
                  </button>

                  <button
                    onClick={() => setFormData({ ...formData, emailPreference: 'new' })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      formData.emailPreference === 'new' 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className="font-medium block">Ik wil nieuwe e-mailadressen</span>
                    <span className="text-sm text-gray-400">Maak nieuwe e-mailadressen aan bij mijn domein</span>
                  </button>
                </div>

                {formData.emailPreference === 'existing' && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <p className="text-green-300 text-sm">
                      ✅ Perfect! We passen alleen de website DNS aan. 
                      Je bestaande e-mail blijft gewoon werken.
                    </p>
                  </div>
                )}

                {formData.emailPreference === 'new' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Welke e-mailadressen wil je?
                    </label>
                    <input
                      type="text"
                      value={formData.desiredEmails}
                      onChange={(e) => setFormData({ ...formData, desiredEmails: e.target.value })}
                      placeholder="bijv. info@, contact@, support@"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                <motion.button
                  onClick={() => handleSave('email')}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Opslaan
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Legal section - Enhanced */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        whileHover={{ y: -2 }}
        className="relative bg-gray-800/60 rounded-2xl overflow-hidden border-2 border-gray-700/50 shadow-lg"
      >
        {/* Gradient accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          (checklist.privacyPolicyProvided || formData.hasPrivacyPolicy || formData.wantsPrivacyPolicyCreated) &&
          (checklist.termsConditionsProvided || formData.hasTermsConditions || formData.wantsTermsCreated)
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'bg-gradient-to-r from-cyan-500 to-blue-500'
        }`} />
        
        <SectionHeader
          id="legal"
          icon={Shield}
          title="Juridisch"
          subtitle="Privacybeleid & Algemene voorwaarden"
          isComplete={
            (checklist.privacyPolicyProvided || formData.hasPrivacyPolicy || formData.wantsPrivacyPolicyCreated) &&
            (checklist.termsConditionsProvided || formData.hasTermsConditions || formData.wantsTermsCreated)
          }
        />
        
        <AnimatePresence>
          {expandedSection === 'legal' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-700/50"
            >
              <div className="p-4 sm:p-6 space-y-6">
                {/* Privacy Policy */}
                <div className="space-y-3">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    Privacybeleid
                  </h4>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => setFormData({ 
                        ...formData, 
                        hasPrivacyPolicy: true, 
                        wantsPrivacyPolicyCreated: false 
                      })}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-left text-sm ${
                        formData.hasPrivacyPolicy && !formData.wantsPrivacyPolicyCreated
                          ? 'border-purple-500 bg-purple-500/10' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      Ik heb een privacybeleid (upload of link)
                    </button>

                    <button
                      onClick={() => setFormData({ 
                        ...formData, 
                        hasPrivacyPolicy: false, 
                        wantsPrivacyPolicyCreated: true 
                      })}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-left text-sm ${
                        formData.wantsPrivacyPolicyCreated
                          ? 'border-purple-500 bg-purple-500/10' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      Maak een privacybeleid voor mij (+€49)
                    </button>
                  </div>

                  {formData.hasPrivacyPolicy && !formData.wantsPrivacyPolicyCreated && (
                    <input
                      type="url"
                      value={formData.privacyPolicyUrl}
                      onChange={(e) => setFormData({ ...formData, privacyPolicyUrl: e.target.value })}
                      placeholder="Link naar je privacybeleid (Google Drive, website, etc.)"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  )}
                </div>

                {/* Terms & Conditions */}
                <div className="space-y-3">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    Algemene voorwaarden
                  </h4>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => setFormData({ 
                        ...formData, 
                        hasTermsConditions: true, 
                        wantsTermsCreated: false 
                      })}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-left text-sm ${
                        formData.hasTermsConditions && !formData.wantsTermsCreated
                          ? 'border-purple-500 bg-purple-500/10' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      Ik heb algemene voorwaarden (upload of link)
                    </button>

                    <button
                      onClick={() => setFormData({ 
                        ...formData, 
                        hasTermsConditions: false, 
                        wantsTermsCreated: true 
                      })}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-left text-sm ${
                        formData.wantsTermsCreated
                          ? 'border-purple-500 bg-purple-500/10' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      Maak algemene voorwaarden voor mij (+€49)
                    </button>

                    <button
                      onClick={() => setFormData({ 
                        ...formData, 
                        hasTermsConditions: false, 
                        wantsTermsCreated: false 
                      })}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-left text-sm ${
                        !formData.hasTermsConditions && !formData.wantsTermsCreated
                          ? 'border-purple-500 bg-purple-500/10' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      Niet nodig voor mijn website
                    </button>
                  </div>

                  {formData.hasTermsConditions && !formData.wantsTermsCreated && (
                    <input
                      type="url"
                      value={formData.termsConditionsUrl}
                      onChange={(e) => setFormData({ ...formData, termsConditionsUrl: e.target.value })}
                      placeholder="Link naar je algemene voorwaarden"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  )}
                </div>

                <motion.button
                  onClick={() => handleSave('legal')}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Opslaan
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Business info section - Enhanced */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ y: -2 }}
        className="relative bg-gray-800/60 rounded-2xl overflow-hidden border-2 border-gray-700/50 shadow-lg"
      >
        {/* Gradient accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          formData.kvkNumber
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'bg-gradient-to-r from-amber-500 to-orange-500'
        }`} />
        
        <SectionHeader
          id="business"
          icon={Building2}
          title="Bedrijfsgegevens"
          subtitle="KvK & BTW voor op je website"
          isComplete={!!formData.kvkNumber}
        />
        
        <AnimatePresence>
          {expandedSection === 'business' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-700/50"
            >
              <div className="p-5 sm:p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    KvK-nummer
                  </label>
                  <input
                    type="text"
                    value={formData.kvkNumber}
                    onChange={(e) => setFormData({ ...formData, kvkNumber: e.target.value })}
                    placeholder="12345678"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    BTW-nummer <span className="text-gray-500">(optioneel)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.btwNumber}
                    onChange={(e) => setFormData({ ...formData, btwNumber: e.target.value })}
                    placeholder="NL123456789B01"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <motion.button
                  onClick={() => handleSave('business')}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Opslaan
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Analytics section - Enhanced */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        whileHover={{ y: -2 }}
        className="relative bg-gray-800/60 rounded-2xl overflow-hidden border-2 border-gray-700/50 shadow-lg"
      >
        {/* Gradient accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          checklist.analyticsAgreed
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'bg-gradient-to-r from-pink-500 to-rose-500'
        }`} />
        
        <SectionHeader
          id="analytics"
          icon={BarChart3}
          title="Website Analytics"
          subtitle="Bezoekersstatistieken bijhouden"
          isComplete={!!checklist.analyticsAgreed}
        />
        
        <AnimatePresence>
          {expandedSection === 'analytics' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-700/50"
            >
              <div className="p-5 sm:p-6 space-y-5">
                <p className="text-gray-400 text-sm">
                  Wil je inzicht in hoeveel bezoekers je website krijgt?
                </p>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setFormData({ ...formData, wantsAnalytics: true })}
                    className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                      formData.wantsAnalytics 
                        ? 'border-purple-500 bg-purple-500/15 shadow-lg shadow-purple-500/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className="font-bold block">Ja, graag analytics toevoegen</span>
                    <span className="text-sm text-gray-400">Gratis bezoekersstatistieken via Google Analytics</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setFormData({ ...formData, wantsAnalytics: false })}
                    className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                      !formData.wantsAnalytics 
                        ? 'border-purple-500 bg-purple-500/15 shadow-lg shadow-purple-500/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className="font-bold block">Nee, niet nodig</span>
                    <span className="text-sm text-gray-400">Je kunt dit later nog toevoegen</span>
                  </motion.button>
                </div>

                <motion.button
                  onClick={() => handleSave('analytics')}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Opslaan
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Info box - Enhanced */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl p-6 overflow-hidden shadow-lg shadow-blue-500/5"
      >
        {/* Decorative blur orb */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-lg text-blue-300 mb-2">Wat gebeurt er na het invullen?</h4>
            <ul className="text-sm text-gray-400 space-y-1.5">
              <li>✅ Onze developer configureert je domein</li>
              <li>✅ Website wordt overgezet naar live server</li>
              <li>✅ SSL-certificaat wordt geïnstalleerd</li>
              <li>✅ Je ontvangt bevestigingsmail wanneer live</li>
              <li>📱 Daarna zie je je website in dit dashboard</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
