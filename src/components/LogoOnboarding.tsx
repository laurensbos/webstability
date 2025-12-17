import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
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
  customColor: string
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
    id: 'logo',
    name: 'Logo Design',
    price: '€169',
    priceLabel: ' incl. BTW',
    tagline: 'Alles wat je nodig hebt',
    description: 'Professioneel logo voor je bedrijf.',
    features: ['2 logo concepten', '2 revisierondes', 'Alle bestandsformaten', 'Kleurenpalet'],
    gradient: 'from-purple-500 to-violet-500',
  },
]

const STEPS = [
  { id: 1, title: 'Bedrijf', icon: Building2 },
  { id: 2, title: 'Stijl', icon: Palette },
  { id: 3, title: 'Merk', icon: Target },
  { id: 4, title: 'Details', icon: Sparkles },
  { id: 5, title: 'Account', icon: Lock },
]

const LOGO_STYLES = [
  { id: 'minimalistisch', name: 'Minimalistisch', icon: Zap, description: 'Strak en eenvoudig' },
  { id: 'modern', name: 'Modern', icon: Sparkles, description: 'Hedendaags en fris' },
  { id: 'klassiek', name: 'Klassiek', icon: Briefcase, description: 'Tijdloos en betrouwbaar' },
  { id: 'speels', name: 'Speels', icon: Heart, description: 'Vrolijk en creatief' },
]

const COLOR_OPTIONS = [
  { id: 'blauw', name: 'Blauw', color: 'bg-blue-500', hex: '#3B82F6' },
  { id: 'groen', name: 'Groen', color: 'bg-green-500', hex: '#22C55E' },
  { id: 'rood', name: 'Rood', color: 'bg-red-500', hex: '#EF4444' },
  { id: 'oranje', name: 'Oranje', color: 'bg-orange-500', hex: '#F97316' },
  { id: 'paars', name: 'Paars', color: 'bg-purple-500', hex: '#A855F7' },
  { id: 'zwart', name: 'Zwart', color: 'bg-gray-900', hex: '#111827' },
  { id: 'goud', name: 'Goud', color: 'bg-amber-500', hex: '#F59E0B' },
  { id: 'roze', name: 'Roze', color: 'bg-pink-500', hex: '#EC4899' },
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
  onClose?: () => void
}

export default function LogoOnboarding({ 
  isFullPage = true, 
  isStandalone = true, 
  onClose 
}: LogoOnboardingProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    package: 'logo', // Automatisch het enige pakket selecteren
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    industry: '',
    logoStyles: [],
    colorPreferences: [],
    customColor: '',
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
      case 1: return !!formData.companyName && !!formData.contactName && !!formData.email && !!formData.industry
      case 2: return formData.logoStyles.length > 0 && formData.colorPreferences.length > 0
      case 3: return formData.brandValues.length > 0
      case 4: return true // Optional step
      case 5: return !!formData.password && formData.password === formData.confirmPassword && formData.password.length >= 6
      default: return false
    }
  }

  const handleNext = () => {
    if (currentStep < 5 && canProceed()) {
      setCurrentStep(prev => prev + 1)
    }
  }
  
  const handleBack = () => {
    if (currentStep <= 1) {
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
        <div className="mb-12 overflow-hidden">
          <div className="flex items-center justify-center max-w-2xl mx-auto overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
            
            {/* Step 1: Company Info */}
            {currentStep === 1 && (
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

            {/* Step 2: Logo Style */}
            {currentStep === 2 && (
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
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-3">
                      {COLOR_OPTIONS.map((color) => {
                        const isSelected = formData.colorPreferences.includes(color.id)
                        return (
                          <button 
                            key={color.id} 
                            type="button"
                            onClick={() => toggleArrayItem('colorPreferences', color.id)} 
                            className={`group relative aspect-square rounded-xl border-2 transition-all ${
                              isSelected 
                                ? 'border-purple-500 scale-110 z-10' 
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:scale-105'
                            }`}
                            title={color.name}
                          >
                            <div className={`absolute inset-1 ${color.color} rounded-lg`} />
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white drop-shadow-md" />
                              </div>
                            )}
                            <span className="sr-only">{color.name}</span>
                          </button>
                        )
                      })}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {formData.colorPreferences.map((colorId) => {
                        const color = COLOR_OPTIONS.find(c => c.id === colorId) || { name: colorId, color: 'bg-gray-500' }
                        return (
                          <span 
                            key={colorId}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                          >
                            <span className={`w-3 h-3 ${color.color} rounded-full`} />
                            {color.name}
                            <button 
                              type="button"
                              onClick={() => toggleArrayItem('colorPreferences', colorId)}
                              className="hover:text-purple-900 dark:hover:text-purple-100"
                            >
                              ×
                            </button>
                          </span>
                        )
                      })}
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <input
                        type="text"
                        value={formData.customColor || ''}
                        onChange={(e) => updateFormData('customColor', e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Of typ een kleur / hex code"
                      />
                      <label className="relative cursor-pointer">
                        <input
                          type="color"
                          value={formData.customColor?.startsWith('#') ? formData.customColor : '#A855F7'}
                          onChange={(e) => updateFormData('customColor', e.target.value)}
                          className="sr-only"
                        />
                        <div className="w-10 h-10 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 transition-colors flex items-center justify-center bg-gradient-to-br from-red-500 via-green-500 to-blue-500">
                          <Palette className="w-4 h-4 text-white drop-shadow-md" />
                        </div>
                      </label>
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

            {/* Step 3: Brand Values */}
            {currentStep === 3 && (
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

            {/* Step 4: Additional Details */}
            {currentStep === 4 && (
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

            {/* Step 5: Account */}
            {currentStep === 5 && (
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
                  
                  {/* Cost Summary */}
                  <div className={`p-4 sm:p-6 rounded-2xl bg-gradient-to-br ${currentGradient} bg-opacity-5 border border-gray-200 dark:border-gray-700`}>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Kostenoverzicht
                    </h4>
                    
                    {/* Package Info */}
                    <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Pakket</span>
                        <span className={`font-semibold bg-gradient-to-r ${currentGradient} bg-clip-text text-transparent`}>
                          {selectedPackage?.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-500">Bedrijf</span>
                        <span className="text-gray-700 dark:text-gray-300">{formData.companyName}</span>
                      </div>
                    </div>

                    {/* What's included */}
                    <div className="space-y-2 mb-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Inbegrepen:</span>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        {selectedPackage?.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-purple-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Total */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white">Totaal</span>
                          <p className="text-xs text-gray-500 dark:text-gray-500">Eenmalige kosten</p>
                        </div>
                        <span className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${currentGradient} bg-clip-text text-transparent`}>
                          {selectedPackage?.price}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 text-center">
                      Prijs is inclusief BTW • Geen verborgen kosten
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 mt-8">
          <button 
            onClick={handleBack} 
            className="flex-1 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold transition-all flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
            Terug
          </button>
          
          {currentStep < 5 ? (
            <button 
              onClick={handleNext} 
              disabled={!canProceed()} 
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                canProceed() 
                  ? `bg-gradient-to-r ${currentGradient} text-white shadow-lg` 
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
