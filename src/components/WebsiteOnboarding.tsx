import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles,
  Building2,
  Palette,
  Target,
  FileText,
  Lock,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Types
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
  industry: string
  currentWebsite: string
  designStyle: string
  colorPreferences: string[]
  customColor: string
  competitors: string
  goal: string
  targetAudience: string
  uniqueFeatures: string
  pages: string[]
  extraFeatures: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

// Packages - matching /websites page
const PACKAGES: PackageType[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '€95',
    priceLabel: '/maand incl. BTW',
    tagline: 'Ideaal om te beginnen',
    description: 'Perfect voor ZZP\'ers en kleine ondernemers die een professionele online aanwezigheid willen.',
    features: [
      'Tot 5 pagina\'s',
      'Responsive design',
      'Contactformulier',
      'Google Maps integratie'
    ],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'professional',
    name: 'Professioneel',
    price: '€179',
    priceLabel: '/maand incl. BTW',
    tagline: 'Voor serieuze ondernemers',
    description: 'Voor ondernemers die meer willen dan een visitekaartje. Met blog en analytics.',
    features: [
      'Tot 10 pagina\'s',
      'Alles van Starter +',
      'Blog functionaliteit',
      'Social media integratie',
      'Google Analytics'
    ],
    gradient: 'from-primary-500 to-blue-500',
  },
  {
    id: 'business',
    name: 'Business',
    price: '€299',
    priceLabel: '/maand incl. BTW',
    tagline: 'Voor groeiende bedrijven',
    description: 'Alle tools om je bedrijf online te laten groeien met boekingssysteem en meer.',
    features: [
      'Tot 20 pagina\'s',
      'Alles van Professioneel +',
      'Online boekingssysteem',
      'Nieuwsbrief integratie',
      'Meerdere talen'
    ],
    gradient: 'from-purple-500 to-pink-500',
  },
]

const STEPS = [
  { id: 1, title: 'Pakket', icon: Globe },
  { id: 2, title: 'Bedrijf', icon: Building2 },
  { id: 3, title: 'Design', icon: Palette },
  { id: 4, title: 'Doel', icon: Target },
  { id: 5, title: 'Pagina\'s', icon: FileText },
  { id: 6, title: 'Account', icon: Lock },
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
  { id: 'teal', name: 'Teal', color: 'bg-teal-500', hex: '#14B8A6' },
  { id: 'indigo', name: 'Indigo', color: 'bg-indigo-500', hex: '#6366F1' },
]

const PAGE_OPTIONS = [
  'Home', 'Over ons', 'Diensten', 'Portfolio', 'Contact', 
  'Blog', 'FAQ', 'Prijzen', 'Team', 'Vacatures'
]

// Package limits for pages
const PACKAGE_PAGE_LIMITS: Record<string, number> = {
  'starter': 5,
  'professional': 10,
  'business': 20
}

// Floating Particles Component
function FloatingParticles({ gradient }: { gradient: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${gradient} opacity-20`}
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          animate={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

// Generate Project ID
function generateProjectId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = 'WS-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

interface WebsiteOnboardingProps {
  isFullPage?: boolean
  isStandalone?: boolean
  initialPackage?: 'starter' | 'professional' | 'business'
  onClose?: () => void
}

export default function WebsiteOnboarding({ 
  isFullPage = true, 
  isStandalone = true,
  initialPackage,
  onClose 
}: WebsiteOnboardingProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(initialPackage ? 2 : 1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  
  // Map initialPackage to internal package id if provided
  const getInitialPackage = () => {
    if (!initialPackage) return ''
    const packageMap: Record<string, string> = {
      'starter': 'starter',
      'professional': 'professional', 
      'business': 'business'
    }
    return packageMap[initialPackage] || ''
  }
  
  const [formData, setFormData] = useState<FormData>({
    package: getInitialPackage(),
    companyName: '',
    industry: '',
    currentWebsite: '',
    designStyle: '',
    colorPreferences: [],
    customColor: '',
    competitors: '',
    goal: '',
    targetAudience: '',
    uniqueFeatures: '',
    pages: ['Home', 'Contact'],
    extraFeatures: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const selectedPackage = PACKAGES.find(p => p.id === formData.package)
  const currentGradient = selectedPackage?.gradient || 'from-primary-500 to-blue-500'

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleColorPreference = (colorId: string) => {
    const current = formData.colorPreferences
    if (current.includes(colorId)) {
      updateFormData('colorPreferences', current.filter(c => c !== colorId))
    } else {
      updateFormData('colorPreferences', [...current, colorId])
    }
  }

  // Get page limit based on selected package
  const getPageLimit = () => PACKAGE_PAGE_LIMITS[formData.package] || 5
  
  // Get next upgrade package
  const getNextPackage = () => {
    if (formData.package === 'starter') return PACKAGES.find(p => p.id === 'professional')
    if (formData.package === 'professional') return PACKAGES.find(p => p.id === 'business')
    return null
  }

  const togglePage = (page: string) => {
    const pageLimit = getPageLimit()
    const isRemoving = formData.pages.includes(page)
    
    if (!isRemoving && formData.pages.length >= pageLimit) {
      // Show upgrade prompt instead of adding
      setShowUpgradePrompt(true)
      return
    }
    
    setFormData(prev => ({
      ...prev,
      pages: prev.pages.includes(page)
        ? prev.pages.filter(p => p !== page)
        : [...prev.pages, page]
    }))
  }
  
  const handleUpgrade = (packageId: string) => {
    updateFormData('package', packageId)
    setShowUpgradePrompt(false)
  }

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return !!formData.package
      case 2: return !!formData.companyName && !!formData.industry
      case 3: return !!formData.designStyle
      case 4: return !!formData.goal
      case 5: return formData.pages.length >= 2
      case 6: return !!formData.email && !!formData.password && formData.password === formData.confirmPassword && formData.password.length >= 6
      default: return false
    }
  }

  const handleNext = () => {
    if (currentStep < 6 && canProceed()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    // If we're on step 1, or step 2 with initialPackage (skipped step 1), call onClose
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
          type: 'website',
          package: formData.package,
          companyName: formData.companyName,
          industry: formData.industry,
          currentWebsite: formData.currentWebsite,
          designStyle: formData.designStyle,
          colorPreferences: formData.colorPreferences,
          customColor: formData.customColor,
          competitors: formData.competitors,
          goal: formData.goal,
          targetAudience: formData.targetAudience,
          uniqueFeatures: formData.uniqueFeatures,
          pages: formData.pages,
          extraFeatures: formData.extraFeatures,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          status: 'pending',
          createdAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }

      navigate(`/bedankt?project=${projectId}&dienst=website&email=${encodeURIComponent(formData.email)}`)
    } catch (error) {
      console.error('Error submitting project:', error)
      alert('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 ${isFullPage ? 'pt-20' : ''}`}>
      <FloatingParticles gradient={currentGradient} />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Progress Steps */}
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
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? `bg-gradient-to-r ${currentGradient} text-white`
                          : isActive
                          ? `bg-gradient-to-r ${currentGradient} text-white shadow-lg`
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className="text-xs mt-2 font-medium text-gray-600 dark:text-gray-400 hidden sm:block">
                      {step.title}
                    </span>
                  </motion.div>
                  
                  {index < STEPS.length - 1 && (
                    <div className={`w-8 sm:w-16 h-0.5 mx-2 ${isCompleted ? `bg-gradient-to-r ${currentGradient}` : 'bg-gray-200 dark:bg-gray-700'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
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
                    Kies je pakket
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Selecteer het pakket dat het beste bij jouw wensen past
                  </p>
                </div>

                {/* Mobile: swipe to compare */}
                <div className="sm:hidden">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-3">
                    <span>Swipe om te vergelijken</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>

                  <div className="flex gap-4 overflow-x-auto overflow-y-visible pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {PACKAGES.map((pkg) => (
                      <motion.button
                        key={pkg.id}
                        onClick={() => updateFormData('package', pkg.id)}
                        className={`relative flex-shrink-0 w-[280px] snap-center p-6 rounded-2xl border-2 text-left transition-all ${
                          formData.package === pkg.id ? 'border-transparent z-20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {formData.package === pkg.id && (
                          <motion.div className={`absolute inset-0 bg-gradient-to-r ${pkg.gradient} opacity-10 rounded-2xl`} initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} />
                        )}
                        {formData.package === pkg.id && (
                          <div className="absolute inset-1 rounded-2xl pointer-events-none border-2 border-primary-500 dark:border-primary-400" />
                        )}
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${pkg.gradient} text-white text-sm font-medium mb-3`}>
                          <Globe className="w-4 h-4" />
                          {pkg.name}
                        </div>
                        {pkg.tagline && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{pkg.tagline}</p>
                        )}
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {pkg.price}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">{pkg.priceLabel || '/maand'}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{pkg.description}</p>
                        <ul className="space-y-2">
                          {pkg.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <Check className={`w-4 h-4 flex-shrink-0 ${formData.package === pkg.id ? 'text-primary-500' : 'text-gray-400'}`} />
                              {feature}
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

                  <div className="flex justify-center gap-2 mt-3">
                    {PACKAGES.map((_, idx) => (
                      <div key={idx} className={`h-2 rounded-full transition-all ${idx === 0 ? 'bg-primary-500 w-6' : 'bg-gray-300 dark:bg-gray-600 w-2'}`} />
                    ))}
                  </div>
                </div>

                {/* Desktop: grid */}
                <div className="hidden sm:grid sm:grid-cols-3 gap-4 sm:gap-4 sm:overflow-visible">
                  {PACKAGES.map((pkg) => (
                    <motion.button
                      key={pkg.id}
                      onClick={() => updateFormData('package', pkg.id)}
                      className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.package === pkg.id
                          ? 'border-transparent z-20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {formData.package === pkg.id && (
                        <motion.div className={`absolute inset-0 bg-gradient-to-r ${pkg.gradient} opacity-10 rounded-2xl`} initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} />
                      )}
                      {formData.package === pkg.id && (
                        <div className="absolute inset-1 rounded-2xl pointer-events-none border-2 border-primary-500 dark:border-primary-400" />
                      )}
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${pkg.gradient} text-white text-sm font-medium mb-3`}>
                        <Globe className="w-4 h-4" />
                        {pkg.name}
                      </div>
                      {pkg.tagline && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{pkg.tagline}</p>
                      )}
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {pkg.price}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">{pkg.priceLabel || '/maand'}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{pkg.description}</p>
                      <ul className="space-y-2">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Check className={`w-4 h-4 flex-shrink-0 ${formData.package === pkg.id ? 'text-primary-500' : 'text-gray-400'}`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
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
                    Vertel over je bedrijf
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Zo kunnen we de website perfect afstemmen op jouw business
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Jouw Bedrijf B.V."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Branche *
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => updateFormData('industry', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="bijv. Horeca, IT, Retail..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Huidige website (optioneel)
                    </label>
                    <input
                      type="url"
                      value={formData.currentWebsite}
                      onChange={(e) => updateFormData('currentWebsite', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://www.jouwwebsite.nl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Design Preferences */}
            {currentStep === 3 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Design voorkeuren
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Welke stijl past het beste bij jouw merk?
                  </p>
                </div>

                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Design stijl *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Minimalistisch', 'Modern', 'Creatief', 'Zakelijk'].map((style) => (
                        <button
                          key={style}
                          onClick={() => updateFormData('designStyle', style)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            formData.designStyle === style
                              ? `border-primary-500 bg-primary-50 dark:bg-primary-900/20`
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className={`font-medium ${formData.designStyle === style ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {style}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kleurvoorkeur (optioneel) <span className="text-gray-400 font-normal">- selecteer 1 of meer</span>
                    </label>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-3">
                      {COLOR_OPTIONS.map((color) => {
                        const isSelected = formData.colorPreferences.includes(color.id)
                        return (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => toggleColorPreference(color.id)}
                            className={`group relative aspect-square rounded-xl border-2 transition-all ${
                              isSelected
                                ? 'border-primary-500 scale-110 z-10'
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
                          </button>
                        )
                      })}
                    </div>
                    {formData.colorPreferences.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.colorPreferences.map((colorId) => {
                          const color = COLOR_OPTIONS.find(c => c.id === colorId)
                          if (!color) return null
                          return (
                            <span 
                              key={colorId}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm"
                            >
                              <span className={`w-3 h-3 ${color.color} rounded-full`} />
                              {color.name}
                              <button 
                                type="button"
                                onClick={() => toggleColorPreference(colorId)}
                                className="hover:text-primary-900 dark:hover:text-primary-100 ml-0.5"
                              >
                                ×
                              </button>
                            </span>
                          )
                        })}
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={formData.customColor}
                          onChange={(e) => updateFormData('customColor', e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Of typ een kleur / hex code"
                        />
                        <div 
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md border border-gray-300 dark:border-gray-600"
                          style={{ 
                            backgroundColor: formData.customColor.startsWith('#') 
                              ? formData.customColor 
                              : '#E5E7EB'
                          }}
                        />
                      </div>
                      <label className="relative cursor-pointer">
                        <input
                          type="color"
                          value={formData.customColor.startsWith('#') ? formData.customColor : '#3B82F6'}
                          onChange={(e) => updateFormData('customColor', e.target.value)}
                          className="sr-only"
                        />
                        <div className="w-12 h-12 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 transition-colors flex items-center justify-center bg-gradient-to-br from-red-500 via-green-500 to-blue-500">
                          <Palette className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Concurrenten ter inspiratie (optioneel)
                    </label>
                    <textarea
                      value={formData.competitors}
                      onChange={(e) => updateFormData('competitors', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Websites die je mooi vindt..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Goals */}
            {currentStep === 4 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Wat wil je bereiken?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Vertel ons over je doelen en doelgroep
                  </p>
                </div>

                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hoofddoel van de website *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Meer leads', 'Verkopen', 'Informeren', 'Branding'].map((goal) => (
                        <button
                          key={goal}
                          onClick={() => updateFormData('goal', goal)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            formData.goal === goal
                              ? `border-primary-500 bg-primary-50 dark:bg-primary-900/20`
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className={`font-medium ${formData.goal === goal ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {goal}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Doelgroep (optioneel)
                    </label>
                    <input
                      type="text"
                      value={formData.targetAudience}
                      onChange={(e) => updateFormData('targetAudience', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="bijv. MKB-ondernemers, 30-50 jaar"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Wat maakt je uniek? (optioneel)
                    </label>
                    <textarea
                      value={formData.uniqueFeatures}
                      onChange={(e) => updateFormData('uniqueFeatures', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Wat onderscheidt jouw bedrijf van anderen..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Pages */}
            {currentStep === 5 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Welke pagina's wil je?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Je kunt tot {getPageLimit()} pagina's kiezen met het {selectedPackage?.name} pakket
                  </p>
                </div>

                <div className="max-w-lg mx-auto">
                  {/* Upgrade prompt modal */}
                  <AnimatePresence>
                    {showUpgradePrompt && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowUpgradePrompt(false)}
                      >
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        >
                          <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                              Meer pagina's nodig?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              Je hebt de limiet van {getPageLimit()} pagina's bereikt met het {selectedPackage?.name} pakket.
                            </p>
                          </div>
                          
                          {getNextPackage() && (
                            <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl p-4 mb-6">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-900 dark:text-white">{getNextPackage()?.name}</span>
                                <span className="text-primary-600 dark:text-primary-400 font-bold">{getNextPackage()?.price}</span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                Tot {PACKAGE_PAGE_LIMITS[getNextPackage()?.id || ''] || 10} pagina's + extra features
                              </p>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                {getNextPackage()?.features.slice(0, 3).map((f, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-primary-500" />
                                    {f}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="flex gap-3">
                            <button
                              onClick={() => setShowUpgradePrompt(false)}
                              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              Blijf bij {selectedPackage?.name}
                            </button>
                            {getNextPackage() && (
                              <button
                                onClick={() => handleUpgrade(getNextPackage()!.id)}
                                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-blue-500 text-white font-medium hover:shadow-lg transition-all"
                              >
                                Upgraden
                              </button>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {PAGE_OPTIONS.map((page) => {
                      const isSelected = formData.pages.includes(page)
                      const isDisabled = !isSelected && formData.pages.length >= getPageLimit()
                      return (
                        <button
                          key={page}
                          onClick={() => togglePage(page)}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            isSelected
                              ? `border-primary-500 bg-primary-50 dark:bg-primary-900/20`
                              : isDisabled
                                ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className={`font-medium text-sm ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {page}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Extra wensen (optioneel)
                    </label>
                    <textarea
                      value={formData.extraFeatures}
                      onChange={(e) => updateFormData('extraFeatures', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Andere pagina's of functionaliteiten..."
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Geselecteerd: {formData.pages.length}/{getPageLimit()} pagina's
                    </p>
                    {formData.pages.length >= getPageLimit() && getNextPackage() && (
                      <button
                        onClick={() => setShowUpgradePrompt(true)}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
                      >
                        Meer nodig? Upgrade →
                      </button>
                    )}
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
                    Hiermee kun je je project volgen en beheren
                  </p>
                </div>

                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      E-mailadres *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="jouw@email.nl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefoonnummer (optioneel)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="06-12345678"
                    />
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
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Minimaal 6 karakters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
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
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Herhaal je wachtwoord"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">Wachtwoorden komen niet overeen</p>
                    )}
                  </div>

                  {/* Summary */}
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${currentGradient} bg-opacity-10`}>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Samenvatting
                    </h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Pakket: {selectedPackage?.name}</li>
                      <li>• Bedrijf: {formData.companyName}</li>
                      <li>• Stijl: {formData.designStyle}</li>
                      <li>• Pagina's: {formData.pages.join(', ')}</li>
                    </ul>
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

          {currentStep < 6 ? (
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
