import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PenTool, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles,
  Building2,
  Palette,
  Target,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Zap,
  Heart,
  Briefcase
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PackageType {
  id: string
  name: string
  price: string
  priceLabel?: string
  tagline?: string
  description: string
  features: string[]
  gradient: string
  popular?: boolean
}

interface FormData {
  package: string
  companyName: string
  contactName: string
  email: string
  phone: string
  industry: string
  logoStyles: string[]
  colorPreferences: string[]
  existingLogo: boolean
  competitors: string
  brandValues: string[]
  targetAudience: string
  additionalNotes: string
  password: string
  confirmPassword: string
}

const PACKAGES: PackageType[] = [
  {
    id: 'basis',
    name: 'Basis',
    price: '€150',
    priceLabel: ' excl. BTW',
    tagline: 'Perfect om te starten',
    description: 'Ideaal voor startende ondernemers.',
    features: ['2 logo concepten', '2 revisierondes', 'Alle bestandsformaten', 'Kleurenpalet'],
    gradient: 'from-purple-500 to-violet-500',
  },
  {
    id: 'uitgebreid',
    name: 'Uitgebreid',
    price: '€250',
    priceLabel: ' excl. BTW',
    tagline: 'Meest gekozen',
    description: 'Complete branding voor je bedrijf.',
    features: ['4 logo concepten', 'Onbeperkte revisies', 'Alle bestandsformaten', 'Kleurenpalet', 'Visitekaartje ontwerp', 'Brandbook'],
    gradient: 'from-violet-500 to-purple-600',
    popular: true,
  },
]

const STEPS = [
  { id: 1, title: 'Pakket', icon: PenTool },
  { id: 2, title: 'Bedrijf', icon: Building2 },
  { id: 3, title: 'Stijl', icon: Palette },
  { id: 4, title: 'Merk', icon: Target },
  { id: 5, title: 'Details', icon: Sparkles },
  { id: 6, title: 'Account', icon: Lock },
]

const LOGO_STYLES = [
  { id: 'minimalistisch', name: 'Minimalistisch', icon: Zap, description: 'Strak en eenvoudig' },
  { id: 'modern', name: 'Modern', icon: Sparkles, description: 'Hedendaags en fris' },
  { id: 'klassiek', name: 'Klassiek', icon: Briefcase, description: 'Tijdloos en betrouwbaar' },
  { id: 'speels', name: 'Speels', icon: Heart, description: 'Vrolijk en creatief' },
]

const COLOR_OPTIONS = [
  { id: 'blauw', name: 'Blauw', color: 'bg-blue-500' },
  { id: 'groen', name: 'Groen', color: 'bg-green-500' },
  { id: 'rood', name: 'Rood', color: 'bg-red-500' },
  { id: 'oranje', name: 'Oranje', color: 'bg-orange-500' },
  { id: 'paars', name: 'Paars', color: 'bg-purple-500' },
  { id: 'zwart', name: 'Zwart', color: 'bg-gray-900' },
  { id: 'goud', name: 'Goud', color: 'bg-amber-500' },
  { id: 'roze', name: 'Roze', color: 'bg-pink-500' },
]

const BRAND_VALUES = [
  'Betrouwbaar', 'Innovatief', 'Vriendelijk', 'Professioneel',
  'Duurzaam', 'Luxe', 'Betaalbaar', 'Exclusief'
]

const INDUSTRIES = [
  'Bouw & Renovatie', 'Horeca', 'Retail', 'Zakelijke diensten',
  'Gezondheid & Welzijn', 'Tech & IT', 'Creatief', 'Anders'
]

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-violet-500 opacity-20"
          initial={{ x: Math.random() * 1000, y: Math.random() * 800 }}
          animate={{ x: Math.random() * 1000, y: Math.random() * 800 }}
          transition={{ 
            duration: Math.random() * 20 + 10, 
            repeat: Infinity, 
            repeatType: 'reverse', 
            ease: 'linear' 
          }}
        />
      ))}
    </div>
  )
}

function generateProjectId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = 'LG-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

interface LogoOnboardingProps {
  isFullPage?: boolean
  isStandalone?: boolean
  initialPackage?: 'basis' | 'uitgebreid'
  onClose?: () => void
}

export default function LogoOnboarding({ 
  isFullPage = true, 
  isStandalone = true, 
  initialPackage, 
  onClose 
}: LogoOnboardingProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(initialPackage ? 2 : 1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    package: initialPackage || '',
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    industry: '',
    logoStyles: [],
    colorPreferences: [],
    existingLogo: false,
    competitors: '',
    brandValues: [],
    targetAudience: '',
    additionalNotes: '',
    password: '',
    confirmPassword: '',
  })

  const selectedPackage = PACKAGES.find(p => p.id === formData.package)
  const currentGradient = selectedPackage?.gradient || 'from-purple-500 to-violet-500'

  const updateFormData = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: 'logoStyles' | 'colorPreferences' | 'brandValues', item: string) => {
    const current = formData[field]
    if (current.includes(item)) {
      updateFormData(field, current.filter(i => i !== item))
    } else {
      updateFormData(field, [...current, item])
    }
  }

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return !!formData.package
      case 2: return !!formData.companyName && !!formData.contactName && !!formData.email && !!formData.industry
      case 3: return formData.logoStyles.length > 0 && formData.colorPreferences.length > 0
      case 4: return formData.brandValues.length > 0
      case 5: return true // Optional step
      case 6: return !!formData.password && formData.password === formData.confirmPassword && formData.password.length >= 6
      default: return false
    }
  }

  const handleNext = () => {
    if (currentStep < 6 && canProceed()) {
      setCurrentStep(prev => prev + 1)
    }
  }
  
  const handleBack = () => {
    const minStep = initialPackage ? 2 : 1
    if (currentStep <= minStep) {
      if (onClose) {
        onClose()
      } else if (!isStandalone) {
        navigate(-1)
      }
    } else {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!canProceed()) return
    setIsSubmitting(true)
    const projectId = generateProjectId()
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectId, 
          type: 'logo', 
          ...formData, 
          status: 'pending', 
          createdAt: new Date().toISOString() 
        }),
      })
      
      if (!response.ok) throw new Error('Failed')
      
      const bedanktUrl = '/bedankt?project=' + projectId + '&dienst=logo&email=' + encodeURIComponent(formData.email)
      navigate(bedanktUrl)
    } catch (error) {
      console.error(error)
      alert('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => { 
    window.scrollTo({ top: 0, behavior: 'smooth' }) 
  }, [currentStep])

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-50 via-purple-50/20 to-slate-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 ${isFullPage ? 'pt-20' : ''}`}>
      <FloatingParticles />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              return (
                <div key={step.id} className="flex items-center">
                  <motion.div 
                    className={`flex flex-col items-center ${isActive || isCompleted ? 'opacity-100' : 'opacity-40'}`}
                    animate={{ scale: isActive ? 1.1 : 1 }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted 
                        ? `bg-gradient-to-r ${currentGradient} text-white` 
                        : isActive 
                          ? `bg-gradient-to-r ${currentGradient} text-white shadow-lg` 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className="text-xs mt-2 font-medium text-gray-600 dark:text-gray-400 hidden sm:block">
                      {step.title}
                    </span>
                  </motion.div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                      isCompleted ? `bg-gradient-to-r ${currentGradient}` : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStep} 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }} 
            transition={{ duration: 0.3 }} 
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700"
          >
            
            {/* Step 1: Package Selection */}
            {currentStep === 1 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Kies je logo pakket
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Selecteer het pakket dat het beste bij je past
                  </p>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
                  {PACKAGES.map((pkg) => (
                    <motion.button 
                      key={pkg.id} 
                      onClick={() => updateFormData('package', pkg.id)} 
                      className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.package === pkg.id 
                          ? 'border-transparent ring-2 ring-purple-500' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }}
                    >
                      {formData.package === pkg.id && (
                        <motion.div 
                          className={`absolute inset-0 bg-gradient-to-r ${pkg.gradient} opacity-10 rounded-2xl`}
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 0.1 }} 
                        />
                      )}
                      
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${pkg.gradient} text-white text-xs font-semibold shadow-lg`}>
                            <Sparkles className="w-3 h-3" />
                            {pkg.tagline}
                          </span>
                        </div>
                      )}
                      
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${pkg.gradient} text-white text-sm font-medium mb-3 ${pkg.popular ? 'mt-2' : ''}`}>
                        <PenTool className="w-4 h-4" />
                        {pkg.name}
                      </div>
                      
                      {pkg.tagline && !pkg.popular && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{pkg.tagline}</p>
                      )}
                      
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {pkg.price}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          {pkg.priceLabel}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{pkg.description}</p>
                      
                      <ul className="space-y-2">
                        {pkg.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Check className={`w-4 h-4 flex-shrink-0 ${formData.package === pkg.id ? 'text-purple-500' : 'text-gray-400'}`} />
                            {f}
                          </li>
                        ))}
                      </ul>
                      
                      {formData.package === pkg.id && (
                        <motion.div className="absolute top-4 right-4" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${pkg.gradient} flex items-center justify-center`}>
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Company Info */}
            {currentStep === 2 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Bedrijfsgegevens
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Vertel ons over je bedrijf
                  </p>
                </div>
                
                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bedrijfsnaam *
                    </label>
                    <input 
                      type="text" 
                      value={formData.companyName} 
                      onChange={(e) => updateFormData('companyName', e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                      placeholder="Jouw Bedrijf" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contactpersoon *
                    </label>
                    <input 
                      type="text" 
                      value={formData.contactName} 
                      onChange={(e) => updateFormData('contactName', e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                      placeholder="Jan Jansen" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        E-mailadres *
                      </label>
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => updateFormData('email', e.target.value)} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                        placeholder="info@bedrijf.nl" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Telefoon
                      </label>
                      <input 
                        type="tel" 
                        value={formData.phone} 
                        onChange={(e) => updateFormData('phone', e.target.value)} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                        placeholder="06-12345678" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Branche *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {INDUSTRIES.map((ind) => (
                        <button 
                          key={ind} 
                          onClick={() => updateFormData('industry', ind)} 
                          className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                            formData.industry === ind 
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className={`font-medium ${
                            formData.industry === ind 
                              ? 'text-purple-600 dark:text-purple-400' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {ind}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Logo Style */}
            {currentStep === 3 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Logo stijl
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Welke stijl past bij jouw merk?
                  </p>
                </div>
                
                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stijlvoorkeuren * <span className="text-gray-400">(selecteer 1 of meer)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {LOGO_STYLES.map((style) => {
                        const Icon = style.icon
                        const isSelected = formData.logoStyles.includes(style.id)
                        return (
                          <button 
                            key={style.id} 
                            onClick={() => toggleArrayItem('logoStyles', style.id)} 
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              isSelected 
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className={`w-5 h-5 ${isSelected ? 'text-purple-500' : 'text-gray-400'}`} />
                              <span className={`font-medium ${
                                isSelected 
                                  ? 'text-purple-600 dark:text-purple-400' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {style.name}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">{style.description}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kleurvoorkeuren * <span className="text-gray-400">(selecteer 1 of meer)</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {COLOR_OPTIONS.map((color) => {
                        const isSelected = formData.colorPreferences.includes(color.id)
                        return (
                          <button 
                            key={color.id} 
                            onClick={() => toggleArrayItem('colorPreferences', color.id)} 
                            className={`p-3 rounded-xl border-2 text-center transition-all ${
                              isSelected 
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <div className={`w-8 h-8 ${color.color} rounded-full mx-auto mb-1 ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`} />
                            <span className={`text-xs font-medium ${
                              isSelected 
                                ? 'text-purple-600 dark:text-purple-400' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {color.name}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => updateFormData('existingLogo', !formData.existingLogo)} 
                      className={`flex-1 p-4 rounded-xl border-2 text-center ${
                        formData.existingLogo 
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className={`font-medium text-sm ${
                        formData.existingLogo 
                          ? 'text-purple-600 dark:text-purple-400' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {formData.existingLogo ? 'V ' : ''}Ik heb al een logo (restyling)
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Brand Values */}
            {currentStep === 4 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Merkwaarden
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Wat wil je uitstralen?
                  </p>
                </div>
                
                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kernwaarden * <span className="text-gray-400">(selecteer 1 of meer)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {BRAND_VALUES.map((value) => {
                        const isSelected = formData.brandValues.includes(value)
                        return (
                          <button 
                            key={value} 
                            onClick={() => toggleArrayItem('brandValues', value)} 
                            className={`p-3 rounded-xl border-2 text-center transition-all ${
                              isSelected 
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <span className={`font-medium text-sm ${
                              isSelected 
                                ? 'text-purple-600 dark:text-purple-400' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {isSelected ? 'V ' : ''}{value}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Doelgroep
                    </label>
                    <input 
                      type="text" 
                      value={formData.targetAudience} 
                      onChange={(e) => updateFormData('targetAudience', e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                      placeholder="Bijv. jonge ondernemers, gezinnen, zakelijke klanten..." 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Additional Details */}
            {currentStep === 5 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Extra informatie
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Heb je nog aanvullende wensen?
                  </p>
                </div>
                
                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Concurrenten of inspiratie
                    </label>
                    <textarea 
                      value={formData.competitors} 
                      onChange={(e) => updateFormData('competitors', e.target.value)} 
                      rows={3} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" 
                      placeholder="Welke logos vind je mooi? Wie zijn je concurrenten?" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Overige wensen
                    </label>
                    <textarea 
                      value={formData.additionalNotes} 
                      onChange={(e) => updateFormData('additionalNotes', e.target.value)} 
                      rows={4} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" 
                      placeholder="Bijv. moet het logo een icoon bevatten? Specifieke tekst? Tagline?" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Account */}
            {currentStep === 6 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Maak je account aan
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Hiermee kun je je project volgen
                  </p>
                </div>
                
                <div className="space-y-6 max-w-lg mx-auto">
                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      <strong>E-mail:</strong> {formData.email}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Wachtwoord *
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={formData.password} 
                        onChange={(e) => updateFormData('password', e.target.value)} 
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                        placeholder="Min. 6 karakters" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bevestig wachtwoord *
                    </label>
                    <div className="relative">
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        value={formData.confirmPassword} 
                        onChange={(e) => updateFormData('confirmPassword', e.target.value)} 
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                        placeholder="Herhaal wachtwoord" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">Wachtwoorden komen niet overeen</p>
                    )}
                  </div>
                  
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${currentGradient} bg-opacity-10`}>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Samenvatting
                    </h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Pakket: {selectedPackage?.name} - {selectedPackage?.price}</li>
                      <li>Bedrijf: {formData.companyName}</li>
                      <li>Stijl: {formData.logoStyles.join(', ')}</li>
                      <li>Kleuren: {formData.colorPreferences.join(', ')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button 
            onClick={handleBack} 
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Vorige
          </button>
          
          {currentStep < 6 ? (
            <button 
              onClick={handleNext} 
              disabled={!canProceed()} 
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                canProceed() 
                  ? `bg-gradient-to-r ${currentGradient} text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5` 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              Volgende
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              disabled={!canProceed() || isSubmitting} 
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                canProceed() && !isSubmitting 
                  ? `bg-gradient-to-r ${currentGradient} text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5` 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Versturen...
                </>
              ) : (
                <>
                  Verstuur aanvraag
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
