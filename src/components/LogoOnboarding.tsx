import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Palette, 
  Building2, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Loader2,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Zap,
  Heart,
  Target,
  Briefcase
} from 'lucide-react'

// Types
interface LogoOnboardingData {
  // Stap 1: Bedrijfsgegevens
  companyName: string
  contactName: string
  email: string
  phone: string
  industry: string
  
  // Stap 2: Logo voorkeuren
  logoStyle: string[]
  colorPreferences: string[]
  existingLogo: boolean
  competitors: string
  
  // Stap 3: Merk & doelgroep
  brandValues: string[]
  targetAudience: string
  additionalInfo: string
  
  // Stap 4: Bevestiging
  agreedToTerms: boolean
  projectPassword: string
  confirmPassword: string
}

const INITIAL_DATA: LogoOnboardingData = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  industry: '',
  logoStyle: [],
  colorPreferences: [],
  existingLogo: false,
  competitors: '',
  brandValues: [],
  targetAudience: '',
  additionalInfo: '',
  agreedToTerms: false,
  projectPassword: '',
  confirmPassword: ''
}

const STEPS = [
  { id: 1, title: 'Bedrijf', icon: Building2 },
  { id: 2, title: 'Stijl', icon: Palette },
  { id: 3, title: 'Merk', icon: Target },
  { id: 4, title: 'Bevestigen', icon: Sparkles }
]

const LOGO_STYLES = [
  { id: 'minimalist', name: 'Minimalistisch', icon: Zap, description: 'Strak en eenvoudig' },
  { id: 'modern', name: 'Modern', icon: Sparkles, description: 'Hedendaags en fris' },
  { id: 'classic', name: 'Klassiek', icon: Briefcase, description: 'Tijdloos en betrouwbaar' },
  { id: 'playful', name: 'Speels', icon: Heart, description: 'Vrolijk en creatief' }
]

const COLOR_OPTIONS = [
  { id: 'blue', name: 'Blauw', color: 'bg-blue-500' },
  { id: 'green', name: 'Groen', color: 'bg-green-500' },
  { id: 'red', name: 'Rood', color: 'bg-red-500' },
  { id: 'orange', name: 'Oranje', color: 'bg-orange-500' },
  { id: 'purple', name: 'Paars', color: 'bg-purple-500' },
  { id: 'black', name: 'Zwart', color: 'bg-gray-900' },
  { id: 'gold', name: 'Goud', color: 'bg-amber-500' },
  { id: 'pink', name: 'Roze', color: 'bg-pink-500' }
]

const BRAND_VALUES = [
  'Betrouwbaar', 'Innovatief', 'Vriendelijk', 'Professioneel',
  'Duurzaam', 'Luxe', 'Betaalbaar', 'Exclusief'
]

const INDUSTRIES = [
  'Bouw & Renovatie', 'Horeca', 'Retail', 'Zakelijke diensten',
  'Gezondheid & Welzijn', 'Tech & IT', 'Creatief', 'Anders'
]

interface LogoOnboardingProps {
  onComplete?: (data: LogoOnboardingData, projectId: string) => void
  onClose?: () => void
}

export default function LogoOnboarding({ onComplete, onClose }: LogoOnboardingProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<LogoOnboardingData>(INITIAL_DATA)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const updateData = (updates: Partial<LogoOnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }))
    const clearedErrors = { ...errors }
    Object.keys(updates).forEach(key => delete clearedErrors[key])
    setErrors(clearedErrors)
  }

  const toggleArrayItem = (field: keyof LogoOnboardingData, item: string) => {
    const current = data[field] as string[]
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item]
    updateData({ [field]: updated })
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!data.companyName.trim()) newErrors.companyName = 'Vul je bedrijfsnaam in'
        if (!data.contactName.trim()) newErrors.contactName = 'Vul je naam in'
        if (!data.email.trim()) newErrors.email = 'Vul je email in'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = 'Vul een geldig emailadres in'
        if (!data.industry) newErrors.industry = 'Selecteer je branche'
        break
      case 2:
        if (data.logoStyle.length === 0) newErrors.logoStyle = 'Selecteer minimaal 1 stijl'
        if (data.colorPreferences.length === 0) newErrors.colorPreferences = 'Selecteer minimaal 1 kleur'
        break
      case 3:
        if (data.brandValues.length === 0) newErrors.brandValues = 'Selecteer minimaal 1 merkwaarde'
        break
      case 4:
        if (!data.projectPassword.trim()) newErrors.projectPassword = 'Kies een wachtwoord voor je project dashboard'
        else if (data.projectPassword.length < 6) newErrors.projectPassword = 'Wachtwoord moet minimaal 6 tekens zijn'
        if (!data.confirmPassword.trim()) newErrors.confirmPassword = 'Bevestig je wachtwoord'
        else if (data.projectPassword !== data.confirmPassword) newErrors.confirmPassword = 'Wachtwoorden komen niet overeen'
        if (!data.agreedToTerms) newErrors.agreedToTerms = 'Je moet akkoord gaan met de voorwaarden'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    } else if (onClose) {
      onClose()
    } else {
      navigate('/start')
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setSubmitting(true)

    try {
      const newProjectId = `LOGO-${Date.now().toString(36).toUpperCase()}`
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newProjectId,
          type: 'logo',
          packageType: 'logo',
          password: data.projectPassword,
          customer: {
            name: data.contactName,
            email: data.email,
            phone: data.phone,
            companyName: data.companyName
          },
          onboardingData: data,
          status: 'onboarding',
          paymentStatus: 'pending',
          createdAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        const existingProjects = JSON.parse(localStorage.getItem('webstability_dev_projects') || '[]')
        existingProjects.push({
          projectId: newProjectId,
          businessName: data.companyName,
          package: 'logo',
          phase: 'onboarding',
          client: {
            name: data.contactName,
            email: data.email,
            phone: data.phone,
            company: data.companyName
          },
          onboardingData: data,
          createdAt: new Date().toISOString()
        })
        localStorage.setItem('webstability_dev_projects', JSON.stringify(existingProjects))

        if (onComplete) {
          onComplete(data, newProjectId)
        } else {
          navigate(`/status/${newProjectId}`)
        }
      } else {
        throw new Error('API request failed')
      }
    } catch (error) {
      console.error('Error submitting:', error)
      // Fallback to localStorage only
      const newProjectId = `LOGO-${Date.now().toString(36).toUpperCase()}`
      const existingProjects = JSON.parse(localStorage.getItem('webstability_dev_projects') || '[]')
      existingProjects.push({
        projectId: newProjectId,
        businessName: data.companyName,
        package: 'logo',
        phase: 'onboarding',
        client: {
          name: data.contactName,
          email: data.email,
          phone: data.phone,
          company: data.companyName
        },
        onboardingData: data,
        createdAt: new Date().toISOString()
      })
      localStorage.setItem('webstability_dev_projects', JSON.stringify(existingProjects))

      if (onComplete) {
        onComplete(data, newProjectId)
      } else {
        navigate(`/status/${newProjectId}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-purple-100 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white">Logo Design</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">€150 excl. BTW</p>
              </div>
            </div>
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id

              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted 
                      ? 'border-purple-500 bg-purple-500 text-white' 
                      : isCurrent 
                        ? 'border-purple-500 bg-white dark:bg-gray-800 shadow-lg shadow-purple-500/20' 
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isCurrent ? 'text-purple-500' : 'text-gray-400 dark:text-gray-500'}`} />
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium hidden sm:block ${isCurrent ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {step.title}
                  </span>
                  {index < STEPS.length - 1 && (
                    <div className={`absolute top-6 left-full w-full h-0.5 -translate-y-1/2 ${
                      isCompleted ? 'bg-purple-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`} style={{ width: 'calc(100% - 3rem)', left: 'calc(50% + 1.5rem)' }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={e => e.preventDefault()} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-purple-100 dark:border-gray-700 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 sm:p-8"
            >
              {/* Step 1: Bedrijfsgegevens */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Vertel ons over je bedrijf</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Zodat we een logo kunnen maken dat bij je past</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <Building2 className="w-4 h-4 inline mr-1" /> Bedrijfsnaam *
                      </label>
                      <input
                        type="text"
                        value={data.companyName}
                        onChange={e => updateData({ companyName: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border ${errors.companyName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500`}
                        placeholder="Je bedrijfsnaam"
                      />
                      {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <User className="w-4 h-4 inline mr-1" /> Contactpersoon *
                      </label>
                      <input
                        type="text"
                        value={data.contactName}
                        onChange={e => updateData({ contactName: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border ${errors.contactName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500`}
                        placeholder="Je naam"
                      />
                      {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <Mail className="w-4 h-4 inline mr-1" /> Email *
                      </label>
                      <input
                        type="email"
                        value={data.email}
                        onChange={e => updateData({ email: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500`}
                        placeholder="je@email.nl"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <Phone className="w-4 h-4 inline mr-1" /> Telefoon
                      </label>
                      <input
                        type="tel"
                        value={data.phone}
                        onChange={e => updateData({ phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        placeholder="06 12345678"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Branche *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {INDUSTRIES.map(industry => (
                        <button
                          key={industry}
                          type="button"
                          onClick={() => updateData({ industry })}
                          className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            data.industry === industry
                              ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-purple-200 dark:hover:border-purple-500 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {industry}
                        </button>
                      ))}
                    </div>
                    {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Logo voorkeuren */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Welke stijl past bij je?</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Selecteer de stijlen die je aanspreken</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Logo stijl *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {LOGO_STYLES.map(style => {
                        const Icon = style.icon
                        const isSelected = data.logoStyle.includes(style.id)
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => toggleArrayItem('logoStyle', style.id)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              isSelected
                                ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30'
                                : 'border-gray-200 dark:border-gray-600 hover:border-purple-200 dark:hover:border-purple-500'
                            }`}
                          >
                            <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                            <p className={`font-medium ${isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>{style.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{style.description}</p>
                          </button>
                        )
                      })}
                    </div>
                    {errors.logoStyle && <p className="text-red-500 text-xs mt-1">{errors.logoStyle}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Kleurvoorkeuren *</label>
                    <div className="flex flex-wrap gap-3">
                      {COLOR_OPTIONS.map(color => {
                        const isSelected = data.colorPreferences.includes(color.id)
                        return (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => toggleArrayItem('colorPreferences', color.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                              isSelected
                                ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full ${color.color}`} />
                            <span className={`text-sm font-medium ${isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>
                              {color.name}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                    {errors.colorPreferences && <p className="text-red-500 text-xs mt-1">{errors.colorPreferences}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Heb je al een logo?
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => updateData({ existingLogo: true })}
                        className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                          data.existingLogo
                            ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                            : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Ja, restyling gewenst
                      </button>
                      <button
                        type="button"
                        onClick={() => updateData({ existingLogo: false })}
                        className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                          !data.existingLogo
                            ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                            : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Nee, nieuw logo
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Concurrenten/inspiratie (optioneel)
                    </label>
                    <textarea
                      value={data.competitors}
                      onChange={e => updateData({ competitors: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="Noem bedrijven met logo's die je mooi vindt..."
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Merk & doelgroep */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Jouw merk</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Wat moet je logo uitstralen?</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Merkwaarden *</label>
                    <div className="flex flex-wrap gap-2">
                      {BRAND_VALUES.map(value => {
                        const isSelected = data.brandValues.includes(value)
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => toggleArrayItem('brandValues', value)}
                            className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                              isSelected
                                ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                            {value}
                          </button>
                        )
                      })}
                    </div>
                    {errors.brandValues && <p className="text-red-500 text-xs mt-1">{errors.brandValues}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Doelgroep (optioneel)
                    </label>
                    <input
                      type="text"
                      value={data.targetAudience}
                      onChange={e => updateData({ targetAudience: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="Bijv. jonge ondernemers, gezinnen, zakelijke klanten..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Aanvullende informatie
                    </label>
                    <textarea
                      value={data.additionalInfo}
                      onChange={e => updateData({ additionalInfo: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="Is er nog iets dat we moeten weten voor het ontwerp?"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Bevestigen */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Bevestig je aanvraag</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Controleer je gegevens en rond af</p>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2 text-sm">
                    <div><span className="text-gray-500 dark:text-gray-400">Bedrijf:</span> <span className="font-medium text-gray-900 dark:text-white">{data.companyName}</span></div>
                    <div><span className="text-gray-500 dark:text-gray-400">Contact:</span> <span className="font-medium text-gray-900 dark:text-white">{data.contactName}</span></div>
                    <div><span className="text-gray-500 dark:text-gray-400">Stijl:</span> <span className="font-medium text-gray-900 dark:text-white">{data.logoStyle.map(s => LOGO_STYLES.find(ls => ls.id === s)?.name).join(', ')}</span></div>
                    <div><span className="text-gray-500 dark:text-gray-400">Kleuren:</span> <span className="font-medium text-gray-900 dark:text-white">{data.colorPreferences.map(c => COLOR_OPTIONS.find(co => co.id === c)?.name).join(', ')}</span></div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-purple-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900 dark:text-white">Logo Design Pakket</span>
                      <span className="text-2xl font-bold text-purple-600">€150</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Eenmalige kosten, excl. BTW</p>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 3 unieke concepten</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 2 revisierondes</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Alle bestandsformaten</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Binnen 2 weken klaar</li>
                    </ul>
                  </div>

                  {/* Password */}
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        Maak je account aan
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Kies een wachtwoord om je project te kunnen volgen</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Wachtwoord *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={data.projectPassword}
                            onChange={e => updateData({ projectPassword: e.target.value })}
                            className={`w-full px-4 py-2.5 pr-10 rounded-lg border ${errors.projectPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500`}
                            placeholder="Min. 6 tekens"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.projectPassword && <p className="text-red-500 text-xs mt-1">{errors.projectPassword}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Bevestig wachtwoord *
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={data.confirmPassword}
                          onChange={e => updateData({ confirmPassword: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500`}
                          placeholder="Herhaal wachtwoord"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                    data.agreedToTerms ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : errors.agreedToTerms ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  }`}>
                    <input
                      type="checkbox"
                      checked={data.agreedToTerms}
                      onChange={e => updateData({ agreedToTerms: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">Ik ga akkoord met de </span>
                      <a href="/voorwaarden" target="_blank" className="text-purple-600 hover:underline">algemene voorwaarden</a>
                      <span className="font-medium text-gray-900 dark:text-white"> en </span>
                      <a href="/privacy" target="_blank" className="text-purple-600 hover:underline">privacy policy</a>
                    </div>
                  </label>
                  {errors.agreedToTerms && <p className="text-red-500 text-xs">{errors.agreedToTerms}</p>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Terug
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-violet-700 transition-all shadow-lg shadow-purple-500/20"
              >
                Volgende
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-violet-700 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verzenden...
                  </>
                ) : (
                  <>
                    Aanvraag versturen
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  )
}
