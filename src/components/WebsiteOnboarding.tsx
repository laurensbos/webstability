import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
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
  Loader2,
  Camera,
  Brush,
  Gift
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Types
interface PackageType {
  id: string
  name: string
  price: string
  priceLabel?: string
  setupFee: number
  monthlyFee: number
  tagline?: string
  description: string
  features: string[]
  gradient: string
  popular?: boolean
}

interface AppliedDiscount {
  code: string
  description: string
  setupDiscount: number
  monthlyDiscount: number
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
  discountCode: string
  addons: string[] // drone, logo
}

// Add-on services with bundle discounts
const ADDON_SERVICES = {
  logo: {
    id: 'logo',
    name: 'Logo Ontwerp',
    nameEn: 'Logo Design',
    price: 169,
    bundlePrice: 139, // €30 korting bij website
    description: 'Professioneel logo voor je merk',
    descriptionEn: 'Professional logo for your brand',
  },
  drone: {
    id: 'drone',
    name: 'Drone Beelden',
    nameEn: 'Drone Footage',
    price: 249,
    bundlePrice: 199, // €50 korting bij website
    description: 'Spectaculaire luchtopnames',
    descriptionEn: 'Spectacular aerial shots',
  },
}

// Discount code validation
const DISCOUNT_CODES = [
  {
    code: 'GRATIS26',
    description: 'Geen opstartkosten - Nieuwjaarsactie',
    type: 'setup_free' as const,
    validUntil: new Date('2026-03-01T23:59:59'),
  },
]

function validateDiscount(code: string, setupFee: number): { valid: boolean; discount?: AppliedDiscount; error?: string } {
  const normalizedCode = code.trim().toUpperCase()
  const discountCode = DISCOUNT_CODES.find(c => c.code === normalizedCode)
  
  if (!discountCode) {
    return { valid: false, error: 'Kortingscode niet gevonden' }
  }
  
  if (new Date() > discountCode.validUntil) {
    return { valid: false, error: 'Deze kortingscode is verlopen' }
  }
  
  return {
    valid: true,
    discount: {
      code: discountCode.code,
      description: discountCode.description,
      setupDiscount: discountCode.type === 'setup_free' ? setupFee : 0,
      monthlyDiscount: 0,
    }
  }
}

// Step IDs met icons - titles komen uit translations
const STEPS_BASE = [
  { id: 1, key: 'package', icon: Globe },
  { id: 2, key: 'business', icon: Building2 },
  { id: 3, key: 'design', icon: Palette },
  { id: 4, key: 'goal', icon: Target },
  { id: 5, key: 'pages', icon: FileText },
  { id: 6, key: 'account', icon: Lock },
]

// Color options met IDs - namen komen uit translations
const COLOR_OPTIONS_BASE = [
  { id: 'blue', color: 'bg-blue-500', hex: '#3B82F6' },
  { id: 'green', color: 'bg-green-500', hex: '#22C55E' },
  { id: 'red', color: 'bg-red-500', hex: '#EF4444' },
  { id: 'orange', color: 'bg-orange-500', hex: '#F97316' },
  { id: 'purple', color: 'bg-purple-500', hex: '#A855F7' },
  { id: 'black', color: 'bg-gray-900', hex: '#111827' },
  { id: 'gold', color: 'bg-amber-500', hex: '#F59E0B' },
  { id: 'pink', color: 'bg-pink-500', hex: '#EC4899' },
  { id: 'teal', color: 'bg-teal-500', hex: '#14B8A6' },
  { id: 'indigo', color: 'bg-indigo-500', hex: '#6366F1' },
]

// Page option IDs - labels komen uit translations
const PAGE_OPTIONS_BASE = [
  'home', 'about', 'services', 'portfolio', 'contact', 
  'blog', 'faq', 'pricing', 'team', 'careers'
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
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Translated packages
  const PACKAGES: PackageType[] = [
    {
      id: 'starter',
      name: t('onboarding.websiteOnboarding.packages.starter.name'),
      price: t('onboarding.websiteOnboarding.packages.starter.price'),
      priceLabel: t('onboarding.websiteOnboarding.step1.perMonthVat'),
      setupFee: 99,
      monthlyFee: 99,
      tagline: t('onboarding.websiteOnboarding.packages.starter.tagline'),
      description: t('onboarding.websiteOnboarding.packages.starter.description'),
      features: t('onboarding.websiteOnboarding.packages.starter.features', { returnObjects: true }) as string[],
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'professional',
      name: t('onboarding.websiteOnboarding.packages.professional.name'),
      price: t('onboarding.websiteOnboarding.packages.professional.price'),
      priceLabel: t('onboarding.websiteOnboarding.step1.perMonthVat'),
      setupFee: 179,
      monthlyFee: 149,
      tagline: t('onboarding.websiteOnboarding.packages.professional.tagline'),
      description: t('onboarding.websiteOnboarding.packages.professional.description'),
      features: t('onboarding.websiteOnboarding.packages.professional.features', { returnObjects: true }) as string[],
      gradient: 'from-primary-500 to-blue-500',
      popular: true,
    },
    {
      id: 'business',
      name: t('onboarding.websiteOnboarding.packages.business.name'),
      price: t('onboarding.websiteOnboarding.packages.business.price'),
      priceLabel: t('onboarding.websiteOnboarding.step1.perMonthVat'),
      setupFee: 239,
      monthlyFee: 199,
      tagline: t('onboarding.websiteOnboarding.packages.business.tagline'),
      description: t('onboarding.websiteOnboarding.packages.business.description'),
      features: t('onboarding.websiteOnboarding.packages.business.features', { returnObjects: true }) as string[],
      gradient: 'from-purple-500 to-pink-500',
    },
  ]

  // Translated steps
  const STEPS = STEPS_BASE.map(step => ({
    ...step,
    title: t(`onboarding.websiteOnboarding.steps.${step.key}`)
  }))

  // Translated color options
  const COLOR_OPTIONS = COLOR_OPTIONS_BASE.map(color => ({
    ...color,
    name: t(`onboarding.websiteOnboarding.colors.${color.id}`)
  }))

  // Translated page options
  const PAGE_OPTIONS = PAGE_OPTIONS_BASE.map(pageId => 
    t(`onboarding.websiteOnboarding.pageOptions.${pageId}`)
  )
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
    discountCode: '',
    addons: [],
  })

  // Discount state
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null)
  const [discountError, setDiscountError] = useState('')
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false)

  const selectedPackage = PACKAGES.find(p => p.id === formData.package)
  const currentGradient = selectedPackage?.gradient || 'from-primary-500 to-blue-500'

  // Check discount code
  const checkDiscountCode = () => {
    if (!formData.discountCode.trim()) {
      setDiscountError(t('onboarding.websiteOnboarding.discount.enterCode'))
      return
    }
    
    setIsCheckingDiscount(true)
    setDiscountError('')
    
    // Simulate small delay for UX
    setTimeout(() => {
      const result = validateDiscount(formData.discountCode, selectedPackage?.setupFee || 0)
      
      if (result.valid && result.discount) {
        setAppliedDiscount(result.discount)
        setDiscountError('')
      } else {
        // Map error types to translation keys
        const errorKey = result.error?.includes('niet gevonden') ? 'notFound' 
          : result.error?.includes('verlopen') ? 'expired' 
          : 'invalid'
        setDiscountError(t(`onboarding.websiteOnboarding.discount.${errorKey}`))
        setAppliedDiscount(null)
      }
      
      setIsCheckingDiscount(false)
    }, 500)
  }

  const removeDiscount = () => {
    setAppliedDiscount(null)
    setFormData(prev => ({ ...prev, discountCode: '' }))
  }

  // Calculate final prices
  const finalSetupFee = (selectedPackage?.setupFee || 0) - (appliedDiscount?.setupDiscount || 0)
  const finalMonthlyFee = (selectedPackage?.monthlyFee || 0) - (appliedDiscount?.monthlyDiscount || 0)
  const firstMonthTotal = finalSetupFee + finalMonthlyFee

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
          // Discount information
          discountCode: appliedDiscount?.code || null,
          discountDescription: appliedDiscount?.description || null,
          discountAmount: appliedDiscount ? appliedDiscount.setupDiscount + appliedDiscount.monthlyDiscount : 0,
          finalSetupFee: finalSetupFee,
          finalMonthlyFee: finalMonthlyFee,
          // Add-ons with bundle pricing
          addons: formData.addons,
          addonsTotal: formData.addons.reduce((sum, addon) => 
            sum + (addon === 'logo' ? ADDON_SERVICES.logo.bundlePrice : ADDON_SERVICES.drone.bundlePrice), 0
          ),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === 'EMAIL_IN_USE') {
          alert('Dit e-mailadres is al in gebruik. Log in met je bestaande project of gebruik een ander e-mailadres.')
        } else {
          alert(data.error || 'Er ging iets mis. Probeer het opnieuw.')
        }
        return
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
                    {t('onboarding.websiteOnboarding.step1.title')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('onboarding.websiteOnboarding.step1.subtitle')}
                  </p>
                </div>

                {/* Mobile: swipe to compare */}
                <div className="sm:hidden">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-3">
                    <span>{t('onboarding.websiteOnboarding.step1.scrollHint')}</span>
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
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
                          {pkg.price}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">{pkg.priceLabel || '/maand'}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('onboarding.websiteOnboarding.step1.setupFee', { fee: pkg.setupFee })}</p>
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
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
                        {pkg.price}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">{pkg.priceLabel || '/maand'}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('onboarding.websiteOnboarding.step1.setupFee', { fee: pkg.setupFee })}</p>
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

                {/* Add-ons Section */}
                {formData.package && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Gift className="w-5 h-5 text-primary-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('onboarding.websiteOnboarding.addons.title')}
                      </h3>
                      <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-medium">
                        {t('onboarding.websiteOnboarding.addons.bundleDiscount')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {t('onboarding.websiteOnboarding.addons.subtitle')}
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Logo Add-on */}
                      <motion.button
                        type="button"
                        onClick={() => {
                          const current = formData.addons
                          if (current.includes('logo')) {
                            updateFormData('addons', current.filter(a => a !== 'logo'))
                          } else {
                            updateFormData('addons', [...current, 'logo'])
                          }
                        }}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                          formData.addons.includes('logo')
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            formData.addons.includes('logo')
                              ? 'bg-purple-500 text-white'
                              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                          }`}>
                            <Brush className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {t('onboarding.websiteOnboarding.addons.logo.title')}
                              </span>
                              {formData.addons.includes('logo') && (
                                <Check className="w-4 h-4 text-purple-500" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {t('onboarding.websiteOnboarding.addons.logo.description')}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-lg font-bold text-gray-900 dark:text-white">€{ADDON_SERVICES.logo.bundlePrice}</span>
                              <span className="text-sm text-gray-400 line-through">€{ADDON_SERVICES.logo.price}</span>
                              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">
                                -€{ADDON_SERVICES.logo.price - ADDON_SERVICES.logo.bundlePrice}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.button>

                      {/* Drone Add-on */}
                      <motion.button
                        type="button"
                        onClick={() => {
                          const current = formData.addons
                          if (current.includes('drone')) {
                            updateFormData('addons', current.filter(a => a !== 'drone'))
                          } else {
                            updateFormData('addons', [...current, 'drone'])
                          }
                        }}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                          formData.addons.includes('drone')
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            formData.addons.includes('drone')
                              ? 'bg-blue-500 text-white'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          }`}>
                            <Camera className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {t('onboarding.websiteOnboarding.addons.drone.title')}
                              </span>
                              {formData.addons.includes('drone') && (
                                <Check className="w-4 h-4 text-blue-500" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {t('onboarding.websiteOnboarding.addons.drone.description')}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-lg font-bold text-gray-900 dark:text-white">€{ADDON_SERVICES.drone.bundlePrice}</span>
                              <span className="text-sm text-gray-400 line-through">€{ADDON_SERVICES.drone.price}</span>
                              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">
                                -€{ADDON_SERVICES.drone.price - ADDON_SERVICES.drone.bundlePrice}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    </div>

                    {/* Bundle Summary */}
                    {formData.addons.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {t('onboarding.websiteOnboarding.addons.bundleSummary')}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formData.addons.map(a => 
                                a === 'logo' ? t('onboarding.websiteOnboarding.addons.logo.title') : t('onboarding.websiteOnboarding.addons.drone.title')
                              ).join(' + ')}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                              +€{formData.addons.reduce((sum, addon) => 
                                sum + (addon === 'logo' ? ADDON_SERVICES.logo.bundlePrice : ADDON_SERVICES.drone.bundlePrice), 0
                              )}
                            </span>
                            <p className="text-xs text-green-600 dark:text-green-400">
                              {t('onboarding.websiteOnboarding.addons.youSave')} €{formData.addons.reduce((sum, addon) => 
                                sum + (addon === 'logo' ? (ADDON_SERVICES.logo.price - ADDON_SERVICES.logo.bundlePrice) : (ADDON_SERVICES.drone.price - ADDON_SERVICES.drone.bundlePrice)), 0
                              )}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 2: Company Info */}
            {currentStep === 2 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('onboarding.websiteOnboarding.step2.title')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('onboarding.websiteOnboarding.step2.subtitle')}
                  </p>
                </div>

                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('onboarding.websiteOnboarding.step2.companyName')}
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => updateFormData('companyName', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t('onboarding.websiteOnboarding.step2.companyNamePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('onboarding.websiteOnboarding.step2.industry')}
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => updateFormData('industry', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t('onboarding.websiteOnboarding.step2.industryPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('onboarding.websiteOnboarding.step2.currentWebsite')}
                    </label>
                    <input
                      type="url"
                      value={formData.currentWebsite}
                      onChange={(e) => updateFormData('currentWebsite', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t('onboarding.websiteOnboarding.step2.currentWebsitePlaceholder')}
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
                    {t('onboarding.websiteOnboarding.step3.title')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('onboarding.websiteOnboarding.step3.subtitle')}
                  </p>
                </div>

                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('onboarding.websiteOnboarding.step3.styleLabel')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['minimalistisch', 'modern', 'speels', 'zakelijk'].map((styleKey) => (
                        <button
                          key={styleKey}
                          onClick={() => updateFormData('designStyle', styleKey)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            formData.designStyle === styleKey
                              ? `border-primary-500 bg-primary-50 dark:bg-primary-900/20`
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className={`font-medium ${formData.designStyle === styleKey ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {t(`onboarding.websiteOnboarding.designStyles.${styleKey}`)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('onboarding.websiteOnboarding.step3.colorLabel')} <span className="text-gray-400 font-normal">- {t('onboarding.websiteOnboarding.step3.colorHint')}</span>
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
                          placeholder={t('onboarding.websiteOnboarding.step3.orCustomColor')}
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
                    {t('onboarding.websiteOnboarding.step4.title')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('onboarding.websiteOnboarding.step4.subtitle')}
                  </p>
                </div>

                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('onboarding.websiteOnboarding.step4.title')} *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['leads', 'brand', 'info', 'sell'].map((goalKey) => (
                        <button
                          key={goalKey}
                          onClick={() => updateFormData('goal', goalKey)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            formData.goal === goalKey
                              ? `border-primary-500 bg-primary-50 dark:bg-primary-900/20`
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className={`font-medium ${formData.goal === goalKey ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {t(`onboarding.websiteOnboarding.step4.goals.${goalKey}`)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('onboarding.websiteOnboarding.step4.uniqueFeatures')}
                    </label>
                    <textarea
                      value={formData.uniqueFeatures}
                      onChange={(e) => updateFormData('uniqueFeatures', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder={t('onboarding.websiteOnboarding.step4.uniqueFeaturesPlaceholder')}
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
                    {t('onboarding.websiteOnboarding.step5.title')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t('onboarding.websiteOnboarding.step5.subtitle', { limit: getPageLimit(), package: selectedPackage?.name })}
                  </p>
                </div>

                <div className="max-w-lg mx-auto px-1">
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
                              {t('onboarding.websiteOnboarding.upgrade.needMorePages')}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              {t('onboarding.websiteOnboarding.step5.subtitle', { limit: getPageLimit(), package: selectedPackage?.name })}
                            </p>
                          </div>
                          
                          {getNextPackage() && (
                            <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl p-4 mb-6">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-900 dark:text-white">{getNextPackage()?.name}</span>
                                <span className="text-primary-600 dark:text-primary-400 font-bold">{getNextPackage()?.price}</span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {t('onboarding.websiteOnboarding.upgrade.upToPages', { limit: PACKAGE_PAGE_LIMITS[getNextPackage()?.id || ''] || 10 })}
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
                                {t('onboarding.websiteOnboarding.upgrade.upgradeButton')}
                              </button>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-6">
                    {PAGE_OPTIONS.map((page) => {
                      const isSelected = formData.pages.includes(page)
                      const isDisabled = !isSelected && formData.pages.length >= getPageLimit()
                      return (
                        <button
                          key={page}
                          onClick={() => togglePage(page)}
                          className={`p-3 sm:p-3 rounded-xl border-2 text-center transition-all min-h-[48px] ${
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
                      {t('onboarding.websiteOnboarding.step5.extraWishes')}
                    </label>
                    <textarea
                      value={formData.extraFeatures}
                      onChange={(e) => updateFormData('extraFeatures', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder={t('onboarding.websiteOnboarding.step5.extraWishesPlaceholder')}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('onboarding.websiteOnboarding.step5.selectedPages', { count: formData.pages.length, limit: getPageLimit() })}
                    </p>
                    {formData.pages.length >= getPageLimit() && getNextPackage() && (
                      <button
                        onClick={() => setShowUpgradePrompt(true)}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
                      >
                        {t('onboarding.websiteOnboarding.upgrade.upgradePrompt')}
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
                    {t('onboarding.websiteOnboarding.step6.title')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('onboarding.websiteOnboarding.step6.subtitle')}
                  </p>
                </div>

                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('onboarding.websiteOnboarding.step6.email')}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t('onboarding.websiteOnboarding.step6.emailPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('onboarding.websiteOnboarding.step6.password')}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={t('onboarding.websiteOnboarding.step6.passwordPlaceholder')}
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
                      {t('onboarding.websiteOnboarding.step6.password')}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={t('onboarding.websiteOnboarding.step6.passwordPlaceholder')}
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
                      <p className="text-red-500 text-sm mt-1">{t('onboarding.websiteOnboarding.validation.passwordMismatch')}</p>
                    )}
                  </div>

                  {/* Cost Summary */}
                  <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 dark:from-primary-600 dark:to-cyan-600">
                    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Kostenoverzicht
                    </h4>
                    
                    {/* Package Info */}
                    <div className="mb-4 pb-4 border-b border-white/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/80">{t('onboarding.websiteOnboarding.summary.package')}</span>
                        <span className="font-semibold text-white">
                          {selectedPackage?.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">{t('onboarding.websiteOnboarding.summary.company')}</span>
                        <span className="text-white">{formData.companyName}</span>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">{t('onboarding.websiteOnboarding.pricing.oneTimeSetup')}</span>
                        <div className="text-right">
                          {appliedDiscount && appliedDiscount.setupDiscount > 0 ? (
                            <>
                              <span className="text-white/50 line-through text-sm mr-2">€{selectedPackage?.setupFee},-</span>
                              <span className="font-medium text-green-300">€{finalSetupFee},-</span>
                            </>
                          ) : (
                            <span className="font-medium text-white">€{selectedPackage?.setupFee},-</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">{t('onboarding.websiteOnboarding.pricing.monthlySubscription')}</span>
                        <span className="font-medium text-white">€{finalMonthlyFee},-</span>
                      </div>
                    </div>

                    {/* Discount Code Input */}
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <label className="block text-sm font-medium text-white mb-2">
                        Kortingscode
                      </label>
                      {appliedDiscount ? (
                        <div className="flex items-center justify-between p-3 bg-green-500/20 border border-green-400/30 rounded-xl">
                          <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-300" />
                            <div>
                              <span className="font-medium text-green-200">{appliedDiscount.code}</span>
                              <p className="text-xs text-green-300/80">{appliedDiscount.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={removeDiscount}
                            className="text-white/50 hover:text-red-300 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={formData.discountCode}
                            onChange={(e) => updateFormData('discountCode', e.target.value.toUpperCase())}
                            placeholder="Bijv. GRATIS26"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="characters"
                            spellCheck="false"
                            className="flex-1 px-4 py-2.5 rounded-xl border-0 bg-gray-800/50 text-white placeholder-white/40 focus:ring-2 focus:ring-white/50 focus:outline-none text-sm"
                          />
                          <button
                            onClick={checkDiscountCode}
                            disabled={isCheckingDiscount || !formData.discountCode.trim()}
                            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-medium transition-all text-sm whitespace-nowrap ${
                              formData.discountCode.trim() 
                                ? 'bg-white text-gray-900 hover:bg-gray-100' 
                                : 'bg-white/30 text-white/50 cursor-not-allowed'
                            }`}
                          >
                            {isCheckingDiscount ? (
                              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                            ) : (
                              'Toepassen'
                            )}
                          </button>
                        </div>
                      )}
                      {discountError && (
                        <p className="text-red-300 text-sm mt-2">{discountError}</p>
                      )}
                    </div>

                    {/* Total First Month */}
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-white">Eerste maand</span>
                          <p className="text-xs text-white/60">{t('onboarding.websiteOnboarding.pricing.inclSetup')}</p>
                        </div>
                        <div className="text-right">
                          {appliedDiscount && appliedDiscount.setupDiscount > 0 && (
                            <span className="text-white/50 line-through text-sm block">
                              €{(selectedPackage?.setupFee || 0) + (selectedPackage?.monthlyFee || 0)},-
                            </span>
                          )}
                          <span className="text-xl sm:text-2xl font-bold text-white">
                            €{firstMonthTotal},-
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-sm">
                        <span className="text-white/60">{t('onboarding.websiteOnboarding.pricing.thenPerMonth')}</span>
                        <span className="font-medium text-white">€{finalMonthlyFee},-</span>
                      </div>
                      {appliedDiscount && (
                        <div className="mt-3 p-2 bg-green-500/20 rounded-lg">
                          <p className="text-sm text-green-200 text-center font-medium">
                            {t('onboarding.websiteOnboarding.pricing.youSave', { amount: appliedDiscount.setupDiscount + appliedDiscount.monthlyDiscount })}
                          </p>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-white/50 mt-4 text-center">
                      {t('onboarding.websiteOnboarding.pricing.allPricesIncVat')}
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
            {t('onboarding.websiteOnboarding.navigation.previous')}
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
              {t('onboarding.websiteOnboarding.navigation.next')}
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
                  {t('onboarding.websiteOnboarding.navigation.submitting')}
                </>
              ) : (
                <>
                  {t('onboarding.websiteOnboarding.navigation.submit')}
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
