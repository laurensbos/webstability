import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  PenTool, 
  Building2, 
  Palette,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Loader2,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Target,
  Zap,
  Heart,
  Briefcase
} from 'lucide-react'

// Types
interface LogoOnboardingData {
  // Stap 1: Pakket keuze
  selectedPackage: 'basis' | 'uitgebreid'
  
  // Stap 2: Bedrijfsgegevens
  companyName: string
  contactName: string
  email: string
  phone: string
  industry: string
  
  // Stap 3: Logo voorkeuren
  logoStyle: string[]
  colorPreferences: string[]
  existingLogo: boolean
  competitors: string
  
  // Stap 4: Merk & doelgroep
  brandValues: string[]
  targetAudience: string
  additionalInfo: string
  
  // Stap 5: Bevestigen
  agreedToTerms: boolean
  projectPassword: string
  confirmPassword: string
}

const INITIAL_DATA: LogoOnboardingData = {
  selectedPackage: 'uitgebreid',
  
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
  { id: 1, title: 'Pakket', icon: PenTool },
  { id: 2, title: 'Bedrijf', icon: Building2 },
  { id: 3, title: 'Stijl', icon: Palette },
  { id: 4, title: 'Merk', icon: Target },
  { id: 5, title: 'Bevestigen', icon: Sparkles }
]

const PACKAGES = {
  basis: {
    name: 'Basis',
    price: 182,
    priceExcl: 150,
    description: 'Perfect voor startende ondernemers',
    features: ['2 logo concepten', '2 revisierondes', 'Alle bestandsformaten', 'Kleurenpalet'],
    popular: false
  },
  uitgebreid: {
    name: 'Uitgebreid',
    price: 302,
    priceExcl: 250,
    description: 'Complete branding voor je bedrijf',
    features: ['4 logo concepten', 'Onbeperkte revisies', 'Alle bestandsformaten', 'Kleurenpalet', 'Visitekaartje ontwerp', 'Brandbook'],
    popular: true
  }
}

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
  isFullPage?: boolean
  initialPackage?: 'basis' | 'uitgebreid'
}

export default function LogoOnboarding({ 
  onComplete, 
  onClose,
  isFullPage = false,
  initialPackage = 'uitgebreid'
}: LogoOnboardingProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<LogoOnboardingData>({
    ...INITIAL_DATA,
    selectedPackage: initialPackage
  })
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

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    switch (currentStep) {
      case 1:
        if (!data.selectedPackage) newErrors.selectedPackage = 'Kies een pakket'
        break
      case 2:
        if (!data.companyName.trim()) newErrors.companyName = 'Vul je bedrijfsnaam in'
        if (!data.contactName.trim()) newErrors.contactName = 'Vul je naam in'
        if (!data.email.trim()) newErrors.email = 'Vul je email in'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = 'Vul een geldig emailadres in'
        if (!data.industry) newErrors.industry = 'Selecteer je branche'
        break
      case 3:
        if (data.logoStyle.length === 0) newErrors.logoStyle = 'Selecteer minimaal 1 stijl'
        if (data.colorPreferences.length === 0) newErrors.colorPreferences = 'Selecteer minimaal 1 kleur'
        break
      case 4:
        if (data.brandValues.length === 0) newErrors.brandValues = 'Selecteer minimaal 1 merkwaarde'
        break
      case 5:
        if (!data.projectPassword.trim()) newErrors.projectPassword = 'Kies een wachtwoord'
        else if (data.projectPassword.length < 6) newErrors.projectPassword = 'Minimaal 6 tekens'
        if (!data.confirmPassword.trim()) newErrors.confirmPassword = 'Bevestig je wachtwoord'
        else if (data.projectPassword !== data.confirmPassword) newErrors.confirmPassword = 'Wachtwoorden komen niet overeen'
        if (!data.agreedToTerms) newErrors.agreedToTerms = 'Je moet akkoord gaan met de voorwaarden'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
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
    if (!validateStep()) return

    setSubmitting(true)

    try {
      const newProjectId = `LOGO-${Date.now().toString(36).toUpperCase()}`
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newProjectId,
          type: 'logo',
          packageType: data.selectedPackage,
          password: data.projectPassword,
          customer: {
            name: data.contactName,
            email: data.email,
            phone: data.phone,
            company: data.companyName
          },
          details: {
            industry: data.industry,
            logoStyle: data.logoStyle,
            colorPreferences: data.colorPreferences,
            existingLogo: data.existingLogo,
            competitors: data.competitors,
            brandValues: data.brandValues,
            targetAudience: data.targetAudience,
            additionalInfo: data.additionalInfo
          },
          pricing: PACKAGES[data.selectedPackage],
          status: 'intake',
          createdAt: new Date().toISOString()
        })
      })

      if (!response.ok) throw new Error('Failed to create project')

      if (onComplete) {
        onComplete(data, newProjectId)
      } else {
        navigate(`/project/${newProjectId}?new=true`)
      }
    } catch (error) {
      console.error('Error submitting:', error)
      setErrors({ submit: 'Er ging iets mis. Probeer het opnieuw.' })
    } finally {
      setSubmitting(false)
    }
  }

  const progress = (currentStep / STEPS.length) * 100
  const selectedPackage = PACKAGES[data.selectedPackage]

  // Full page wrapper for non-modal mode
  const Wrapper = isFullPage ? ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {children}
      </div>
    </div>
  ) : ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-16 sm:pt-8 pb-4 sm:pb-8 px-2 sm:px-4 overflow-y-auto"
    >
      {children}
    </motion.div>
  )

  return (
    <Wrapper>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className={`bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col ${isFullPage ? '' : 'max-h-[90vh] my-auto'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-4 sm:p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white transform -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center"
                >
                  <PenTool className="w-6 h-6" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold">Logo Design Aanvraag</h2>
                  <p className="text-white/80 text-sm">Jouw unieke merkidentiteit</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose ? onClose : () => navigate(-1)} 
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Progress bar */}
            <div className="bg-white/20 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-white rounded-full"
              />
            </div>

            {/* Step indicators */}
            <div className="flex justify-between mt-4 overflow-x-auto">
              {STEPS.map(step => {
                const isActive = step.id === currentStep
                const isComplete = step.id < currentStep
                return (
                  <motion.div
                    key={step.id}
                    whileHover={{ scale: 1.05 }}
                    className={`flex flex-col items-center min-w-[60px] cursor-pointer ${
                      isActive ? 'text-white' : isComplete ? 'text-white/80' : 'text-white/40'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isActive ? 'bg-white text-purple-600 shadow-lg' : isComplete ? 'bg-white/30' : 'bg-white/10'
                    }`}>
                      {isComplete ? <Check className="w-4 h-4" /> : step.id}
                    </div>
                    <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 1: Pakket kiezen */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Kies je pakket</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Selecteer het pakket dat het beste bij jouw wensen past</p>
                  </div>

                  {/* Package cards */}
                  <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible">
                    {(Object.entries(PACKAGES) as [string, typeof PACKAGES.basis][]).map(([key, pkg]) => {
                      const isSelected = data.selectedPackage === key
                      const isPopular = pkg.popular
                      
                      return (
                        <motion.button
                          key={key}
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateData({ selectedPackage: key as 'basis' | 'uitgebreid' })}
                          className={`relative flex-shrink-0 w-[280px] sm:w-full snap-center text-left bg-white dark:bg-gray-800 rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg ${
                            isSelected 
                              ? 'border-purple-500 shadow-lg shadow-purple-100 dark:shadow-purple-900/30' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {/* Popular badge */}
                          {isPopular && (
                            <div className="absolute top-3 right-3 z-10">
                              <span className="bg-gradient-to-r from-purple-500 to-violet-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                                Meest gekozen
                              </span>
                            </div>
                          )}
                          
                          {/* Colored header */}
                          <div className={`bg-gradient-to-br ${isSelected ? 'from-purple-500 to-violet-600' : 'from-gray-600 to-gray-700'} p-4 flex items-center justify-between min-h-[100px]`}>
                            <div className="text-white">
                              <h4 className="font-bold text-lg">{pkg.name}</h4>
                              <p className="text-white/80 text-sm">Logo ontwerp</p>
                            </div>
                            <div className="text-right text-white">
                              <div className="text-2xl font-bold">€{pkg.price}</div>
                              <div className="text-white/80 text-xs">eenmalig</div>
                              <div className="text-white/60 text-xs">excl. €{pkg.priceExcl} BTW</div>
                            </div>
                          </div>
                          
                          {/* Features */}
                          <div className="p-4">
                            <div className="space-y-2 mb-3">
                              {pkg.features.slice(0, 5).map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                  <Check className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                            
                            <p className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
                              {pkg.description}
                            </p>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                  
                  <p className="text-center text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                    ← Swipe voor meer pakketten →
                  </p>

                  <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 p-4 rounded-xl">
                    <p className="text-purple-800 dark:text-purple-200 text-sm">
                      <strong>💡 Inclusief:</strong> Vectorbestanden (AI, EPS, SVG), PNG/JPEG in hoge resolutie en kleurenpalet.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Bedrijfsgegevens */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Bedrijfsgegevens</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Vertel ons over je bedrijf</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bedrijfsnaam *
                      </label>
                      <input
                        type="text"
                        value={data.companyName}
                        onChange={e => updateData({ companyName: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.companyName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500`}
                        placeholder="Je bedrijfsnaam"
                      />
                      {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contactpersoon *
                      </label>
                      <input
                        type="text"
                        value={data.contactName}
                        onChange={e => updateData({ contactName: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.contactName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500`}
                        placeholder="Je naam"
                      />
                      {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        value={data.email}
                        onChange={e => updateData({ email: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500`}
                        placeholder="email@bedrijf.nl"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Telefoon
                      </label>
                      <input
                        type="tel"
                        value={data.phone}
                        onChange={e => updateData({ phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        placeholder="06-12345678"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      In welke branche ben je actief? *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {INDUSTRIES.map(ind => (
                        <button
                          key={ind}
                          type="button"
                          onClick={() => updateData({ industry: ind })}
                          className={`p-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                            data.industry === ind
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                          }`}
                        >
                          {ind}
                        </button>
                      ))}
                    </div>
                    {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Logo Stijl */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Logo Stijl</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Wat voor stijl logo zoek je?</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Kies je stijl(en) *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {LOGO_STYLES.map(style => {
                          const Icon = style.icon
                          const isSelected = data.logoStyle.includes(style.id)
                          return (
                            <button
                              key={style.id}
                              type="button"
                              onClick={() => toggleArrayItem('logoStyle', style.id)}
                              className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                                isSelected
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className={`font-semibold ${isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-gray-900 dark:text-white'}`}>
                                  {style.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{style.description}</p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                      {errors.logoStyle && <p className="text-red-500 text-xs mt-1">{errors.logoStyle}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Kleurvoorkeuren *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {COLOR_OPTIONS.map(color => {
                          const isSelected = data.colorPreferences.includes(color.id)
                          return (
                            <button
                              key={color.id}
                              type="button"
                              onClick={() => toggleArrayItem('colorPreferences', color.id)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                                isSelected
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full ${color.color}`} />
                              {color.name}
                            </button>
                          )
                        })}
                      </div>
                      {errors.colorPreferences && <p className="text-red-500 text-xs mt-1">{errors.colorPreferences}</p>}
                    </div>

                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.existingLogo}
                          onChange={e => updateData({ existingLogo: e.target.checked })}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Ik heb al een bestaand logo dat vernieuwd moet worden</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Concurrenten of inspiratie (optioneel)
                      </label>
                      <textarea
                        value={data.competitors}
                        onChange={e => updateData({ competitors: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        placeholder="Links naar logo's die je mooi vindt..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Merk */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Merk & Doelgroep</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Help ons je merk te begrijpen</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Welke waarden zijn belangrijk voor je merk? *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {BRAND_VALUES.map(value => {
                          const isSelected = data.brandValues.includes(value)
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => toggleArrayItem('brandValues', value)}
                              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                                isSelected
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                              }`}
                            >
                              {value}
                            </button>
                          )
                        })}
                      </div>
                      {errors.brandValues && <p className="text-red-500 text-xs mt-1">{errors.brandValues}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Wie is je doelgroep? (optioneel)
                      </label>
                      <textarea
                        value={data.targetAudience}
                        onChange={e => updateData({ targetAudience: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        placeholder="Bijv. jonge ondernemers, 25-40 jaar..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Aanvullende informatie (optioneel)
                      </label>
                      <textarea
                        value={data.additionalInfo}
                        onChange={e => updateData({ additionalInfo: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        placeholder="Iets dat we moeten weten over je merk of logo wensen..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Bevestigen */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Bevestig je aanvraag</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Controleer je gegevens en rond af</p>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Gekozen pakket</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedPackage.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Bedrijf</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{data.companyName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Stijl</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{data.logoStyle.map(s => LOGO_STYLES.find(ls => ls.id === s)?.name).join(', ')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Totaal</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400 text-lg">€{selectedPackage.price}</span>
                    </div>
                  </div>

                  {/* Password section */}
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
                    data.agreedToTerms 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' 
                      : errors.agreedToTerms 
                        ? 'border-red-500' 
                        : 'border-gray-200 dark:border-gray-600'
                  }`}>
                    <input
                      type="checkbox"
                      checked={data.agreedToTerms}
                      onChange={e => updateData({ agreedToTerms: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-0.5"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Ik ga akkoord met de voorwaarden</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Ik begrijp dat er een vrijblijvend concept wordt gemaakt. Pas na goedkeuring wordt de factuur verstuurd.
                      </p>
                    </div>
                  </label>
                  {errors.agreedToTerms && <p className="text-red-500 text-xs">{errors.agreedToTerms}</p>}
                  {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{currentStep === 1 ? 'Terug naar diensten' : 'Vorige'}</span>
            <span className="sm:hidden">Terug</span>
          </button>

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25"
            >
              Volgende
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Versturen...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Aanvraag versturen
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </Wrapper>
  )
}
