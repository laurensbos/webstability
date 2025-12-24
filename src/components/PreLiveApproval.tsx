import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  Circle, 
  Rocket, 
  FileText, 
  MapPin, 
  ScrollText,
  Globe,
  AlertCircle,
  PartyPopper,
  Shield,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock,
  User
} from 'lucide-react'

interface PreLiveApprovalProps {
  businessName: string
  projectPackage: string
  designPreviewUrl?: string
  liveUrl?: string
  domainInfo?: {
    hasDomain?: boolean
    domainName?: string
  }
  preLiveChecklist?: {
    contentApproved?: boolean
    contactInfoCorrect?: boolean
    termsAccepted?: boolean
    domainConfirmed?: boolean
    approvedAt?: string
    approvedByName?: string
  }
  onApprove: (checklist: {
    contentApproved: boolean
    contactInfoCorrect: boolean
    termsAccepted: boolean
    domainConfirmed: boolean
    approvedByName: string
  }) => Promise<void>
  monthlyAmount?: number
}

interface ChecklistItem {
  id: string
  label: string
  description: string
  icon: React.ElementType
  required: boolean
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'contentApproved',
    label: 'Alle content is correct',
    description: 'Teksten, prijzen, en informatie kloppen en zijn volledig.',
    icon: FileText,
    required: true
  },
  {
    id: 'contactInfoCorrect',
    label: 'Contactgegevens zijn juist',
    description: 'E-mailadres, telefoonnummer en adres zijn correct weergegeven.',
    icon: MapPin,
    required: true
  },
  {
    id: 'domainConfirmed',
    label: 'Domein is bevestigd',
    description: 'Het domein waarop de website komt te staan is correct.',
    icon: Globe,
    required: true
  },
  {
    id: 'termsAccepted',
    label: 'Ik ga akkoord met de voorwaarden',
    description: 'Het abonnement, betalingsvoorwaarden en afspraken zijn duidelijk.',
    icon: ScrollText,
    required: true
  }
]

export const PreLiveApproval: React.FC<PreLiveApprovalProps> = ({
  businessName,
  // projectPackage - reserved for future use
  designPreviewUrl,
  // liveUrl - reserved for future use
  domainInfo,
  preLiveChecklist,
  onApprove,
  monthlyAmount = 49
}) => {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    contentApproved: preLiveChecklist?.contentApproved || false,
    contactInfoCorrect: preLiveChecklist?.contactInfoCorrect || false,
    termsAccepted: preLiveChecklist?.termsAccepted || false,
    domainConfirmed: preLiveChecklist?.domainConfirmed || false
  })
  const [approverName, setApproverName] = useState(preLiveChecklist?.approvedByName || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const isAlreadyApproved = preLiveChecklist?.approvedAt
  const allChecked = Object.values(checklist).every(v => v) && approverName.trim().length > 0
  const checkedCount = Object.values(checklist).filter(v => v).length
  const progress = (checkedCount / CHECKLIST_ITEMS.length) * 100

  const handleToggle = (id: string) => {
    if (isAlreadyApproved) return
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSubmit = async () => {
    if (!allChecked || isSubmitting || isAlreadyApproved) return
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      await onApprove({
        contentApproved: checklist.contentApproved,
        contactInfoCorrect: checklist.contactInfoCorrect,
        termsAccepted: checklist.termsAccepted,
        domainConfirmed: checklist.domainConfirmed,
        approvedByName: approverName.trim()
      })
    } catch (err) {
      setError('Er is iets misgegaan. Probeer het opnieuw.')
      console.error('Approval error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Als al goedgekeurd, toon success state
  if (isAlreadyApproved) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <PartyPopper className="w-10 h-10 text-green-600" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Goedkeuring ontvangen! 🎉
          </h2>
          <p className="text-gray-600 mb-6">
            Je website wordt nu live gezet. Dit duurt meestal minder dan 24 uur.
          </p>
          
          <div className="bg-white rounded-xl p-6 max-w-md mx-auto">
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
              <User className="w-4 h-4" />
              <span>Goedgekeurd door: <strong>{preLiveChecklist?.approvedByName}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Op: <strong>{new Date(preLiveChecklist?.approvedAt || '').toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</strong></span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
              <Sparkles className="w-5 h-5" />
              <span>Wat gebeurt er nu?</span>
            </div>
            <ul className="text-sm text-blue-600 text-left space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>We configureren je domein en SSL-certificaat</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Je website wordt geüpload naar de server</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Je ontvangt een e-mail zodra je site live is!</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Rocket className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Laatste stap: Goedkeuring voor livegang
            </h2>
            <p className="text-gray-600">
              Controleer onderstaande punten en geef je akkoord. Daarna zetten we {businessName} live!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Preview Link */}
      {designPreviewUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Bekijk je website preview</p>
                <p className="text-sm text-gray-500">Controleer of alles klopt voordat je goedkeurt</p>
              </div>
            </div>
            <a
              href={designPreviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Bekijken</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      )}

      {/* Domain Info */}
      {domainInfo?.domainName && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Je website komt op:</p>
              <p className="text-green-700 font-mono">{domainInfo.domainName}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Voortgang</span>
          <span className="text-sm text-gray-500">{checkedCount} van {CHECKLIST_ITEMS.length}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Checklist Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Checklist voor livegang</h3>
          <p className="text-sm text-gray-500">Vink alle punten aan om door te gaan</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {CHECKLIST_ITEMS.map((item, index) => {
            const Icon = item.icon
            const isChecked = checklist[item.id]
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => handleToggle(item.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  isChecked ? 'bg-green-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    isChecked 
                      ? 'bg-green-500 text-white' 
                      : 'border-2 border-gray-300'
                  }`}>
                    {isChecked ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isChecked ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className={`font-medium ${isChecked ? 'text-green-700' : 'text-gray-900'}`}>
                        {item.label}
                      </span>
                      {item.required && (
                        <span className="text-xs text-red-500">*</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Terms Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <button
          onClick={() => setShowTerms(!showTerms)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-900">Bekijk de voorwaarden</span>
          </div>
          {showTerms ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        <AnimatePresence>
          {showTerms && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 border-t border-gray-100">
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-3">
                  <p><strong>Abonnement:</strong> Je gaat een maandelijks abonnement aan van €{monthlyAmount}/maand voor hosting, onderhoud en support.</p>
                  <p><strong>Looptijd:</strong> Het abonnement is maandelijks opzegbaar met een opzegtermijn van 30 dagen.</p>
                  <p><strong>Wijzigingen:</strong> Kleine tekstuele en afbeelding-wijzigingen zijn inbegrepen. Grote structurele wijzigingen worden apart besproken.</p>
                  <p><strong>Eigendom:</strong> Na volledige betaling van de eenmalige setup-kosten is het design jouw eigendom.</p>
                  <p><strong>Privacy:</strong> We respecteren je privacy en delen je gegevens nooit met derden zonder toestemming.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Name Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
      >
        <label className="block mb-2">
          <span className="font-medium text-gray-900">Je volledige naam</span>
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={approverName}
          onChange={(e) => setApproverName(e.target.value)}
          placeholder="Vul je naam in ter bevestiging"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
        />
        <p className="text-sm text-gray-500 mt-2">
          Door je naam in te vullen bevestig je dat je gemachtigd bent om namens {businessName} akkoord te geven.
        </p>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={handleSubmit}
        disabled={!allChecked || isSubmitting}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
          allChecked && !isSubmitting
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Bezig met verwerken...</span>
          </>
        ) : (
          <>
            <Rocket className="w-5 h-5" />
            <span>Goedkeuren & Live Zetten</span>
          </>
        )}
      </motion.button>

      {!allChecked && (
        <p className="text-center text-sm text-gray-500">
          Vink alle punten aan en vul je naam in om door te gaan
        </p>
      )}
    </div>
  )
}

export default PreLiveApproval
