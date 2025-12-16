import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles,
  Building2,
  Palette,
  Target,
  Package,
  Lock,
  Eye,
  EyeOff,
  Loader2
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
  kvkNumber: string
  shopName: string
  productCategory: string
  estimatedProducts: string
  targetAudience: string
  designStyle: string
  brandColors: string
  hasLogo: boolean
  hasProductPhotos: boolean
  inspirationUrls: string
  additionalNotes: string
  password: string
  confirmPassword: string
}

const PACKAGES: PackageType[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '€249',
    priceLabel: '/maand excl. BTW',
    tagline: 'Ideaal om te beginnen',
    description: 'Perfect om te beginnen met online verkopen.',
    features: ['Tot 50 producten', 'iDEAL & creditcard', 'Basis verzendopties', 'Order management', 'E-mail notificaties'],
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    id: 'professional',
    name: 'Professioneel',
    price: '€349',
    priceLabel: '/maand excl. BTW',
    tagline: 'Meest gekozen',
    description: 'Voor serieuze webshops die willen groeien.',
    features: ['Tot 500 producten', 'Alle betaalmethodes', 'Geavanceerde verzending', 'Koppeling met boekhouden', 'Kortingscodes systeem', 'Klantaccounts'],
    gradient: 'from-green-500 to-teal-500',
    popular: true,
  },
]

const STEPS = [
  { id: 1, title: 'Pakket', icon: Package },
  { id: 2, title: 'Bedrijf', icon: Building2 },
  { id: 3, title: 'Webshop', icon: ShoppingBag },
  { id: 4, title: 'Design', icon: Palette },
  { id: 5, title: 'Doel', icon: Target },
  { id: 6, title: 'Account', icon: Lock },
]

const PRODUCT_CATEGORIES = [
  'Kleding & Mode',
  'Elektronica',
  'Voeding & Dranken',
  'Gezondheid & Beauty',
  'Huis & Tuin',
  'Sport & Outdoor',
  'Speelgoed & Games',
  'Kunst & Handwerk',
  'Anders'
]

const PRODUCT_AMOUNTS = [
  '1-25 producten',
  '25-50 producten',
  '50-100 producten',
  '100-250 producten',
  '250-500 producten',
  '500+ producten'
]

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 opacity-20"
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
  let result = 'WS-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

interface WebshopOnboardingProps {
  isFullPage?: boolean
  isStandalone?: boolean
  initialPackage?: 'starter' | 'professional'
  onClose?: () => void
}

export default function WebshopOnboarding({ 
  isFullPage = true, 
  isStandalone = true, 
  initialPackage, 
  onClose 
}: WebshopOnboardingProps) {
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
    kvkNumber: '',
    shopName: '',
    productCategory: '',
    estimatedProducts: '',
    targetAudience: '',
    designStyle: '',
    brandColors: '',
    hasLogo: false,
    hasProductPhotos: false,
    inspirationUrls: '',
    additionalNotes: '',
    password: '',
    confirmPassword: '',
  })

  const selectedPackage = PACKAGES.find(p => p.id === formData.package)
  const currentGradient = selectedPackage?.gradient || 'from-emerald-500 to-green-500'

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return !!formData.package
      case 2: return !!formData.companyName && !!formData.contactName && !!formData.email
      case 3: return !!formData.shopName && !!formData.productCategory && !!formData.estimatedProducts
      case 4: return !!formData.designStyle
      case 5: return !!formData.targetAudience
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
          type: 'webshop', 
          ...formData, 
          status: 'pending', 
          createdAt: new Date().toISOString() 
        }),
      })
      
      if (!response.ok) throw new Error('Failed')
      
      const bedanktUrl = '/bedankt?project=' + projectId + '&dienst=webshop&email=' + encodeURIComponent(formData.email)
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
    <div className={`min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 ${isFullPage ? 'pt-20' : ''}`}>
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
                    Kies je webshop pakket
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Selecteer het pakket dat het beste bij jouw webshop past
                  </p>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
                  {PACKAGES.map((pkg) => (
                    <motion.button 
                      key={pkg.id} 
                      onClick={() => updateFormData('package', pkg.id)} 
                      className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.package === pkg.id 
                          ? 'border-transparent ring-2 ring-emerald-500' 
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
                        <ShoppingBag className="w-4 h-4" />
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
                            <Check className={`w-4 h-4 flex-shrink-0 ${formData.package === pkg.id ? 'text-emerald-500' : 'text-gray-400'}`} />
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
                    Vul je bedrijfsgegevens in
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                      placeholder="Jouw Bedrijf B.V." 
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                      placeholder="Jan Jansen" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      E-mailadres *
                    </label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => updateFormData('email', e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                      placeholder="info@jouwbedrijf.nl" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Telefoon
                      </label>
                      <input 
                        type="tel" 
                        value={formData.phone} 
                        onChange={(e) => updateFormData('phone', e.target.value)} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                        placeholder="06-12345678" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        KVK
                      </label>
                      <input 
                        type="text" 
                        value={formData.kvkNumber} 
                        onChange={(e) => updateFormData('kvkNumber', e.target.value)} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                        placeholder="12345678" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Shop Details */}
            {currentStep === 3 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Over je webshop
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Vertel ons meer over wat je wilt verkopen
                  </p>
                </div>
                
                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Naam van je webshop *
                    </label>
                    <input 
                      type="text" 
                      value={formData.shopName} 
                      onChange={(e) => updateFormData('shopName', e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                      placeholder="Mijn Webshop" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Product categorie *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <button 
                          key={cat} 
                          onClick={() => updateFormData('productCategory', cat)} 
                          className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                            formData.productCategory === cat 
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className={`font-medium ${
                            formData.productCategory === cat 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {cat}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Aantal producten *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRODUCT_AMOUNTS.map((a) => (
                        <button 
                          key={a} 
                          onClick={() => updateFormData('estimatedProducts', a)} 
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            formData.estimatedProducts === a 
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className={`font-medium text-sm ${
                            formData.estimatedProducts === a 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {a}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Design */}
            {currentStep === 4 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Design voorkeuren
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Welke stijl past bij jouw webshop?
                  </p>
                </div>
                
                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Design stijl *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Minimalistisch', 'Modern', 'Luxe', 'Speels'].map((s) => (
                        <button 
                          key={s} 
                          onClick={() => updateFormData('designStyle', s)} 
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            formData.designStyle === s 
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className={`font-medium ${
                            formData.designStyle === s 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {s}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Huisstijl kleuren
                    </label>
                    <input 
                      type="text" 
                      value={formData.brandColors} 
                      onChange={(e) => updateFormData('brandColors', e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                      placeholder="bijv. Groen en wit" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => updateFormData('hasLogo', !formData.hasLogo)} 
                      className={`p-4 rounded-xl border-2 text-center ${
                        formData.hasLogo 
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className={`font-medium text-sm ${
                        formData.hasLogo 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {formData.hasLogo ? 'V ' : ''}Ik heb een logo
                      </span>
                    </button>
                    <button 
                      onClick={() => updateFormData('hasProductPhotos', !formData.hasProductPhotos)} 
                      className={`p-4 rounded-xl border-2 text-center ${
                        formData.hasProductPhotos 
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className={`font-medium text-sm ${
                        formData.hasProductPhotos 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {formData.hasProductPhotos ? 'V ' : ''}Ik heb productfotos
                      </span>
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Inspiratie webshops
                    </label>
                    <textarea 
                      value={formData.inspirationUrls} 
                      onChange={(e) => updateFormData('inspirationUrls', e.target.value)} 
                      rows={3} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none" 
                      placeholder="Links naar webshops die je mooi vindt..." 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Target Audience */}
            {currentStep === 5 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Doelgroep en Wensen
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Aan wie verkoop je?
                  </p>
                </div>
                
                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Doelgroep *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Consumenten (B2C)', 'Bedrijven (B2B)', 'Beide'].map((t) => (
                        <button 
                          key={t} 
                          onClick={() => updateFormData('targetAudience', t)} 
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            formData.targetAudience === t 
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className={`font-medium ${
                            formData.targetAudience === t 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {t}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Extra wensen
                    </label>
                    <textarea 
                      value={formData.additionalNotes} 
                      onChange={(e) => updateFormData('additionalNotes', e.target.value)} 
                      rows={4} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none" 
                      placeholder="Specifieke wensen voor je webshop..." 
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
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
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
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
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
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
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
                      <li>Pakket: {selectedPackage?.name}</li>
                      <li>Webshop: {formData.shopName}</li>
                      <li>Categorie: {formData.productCategory}</li>
                      <li>Stijl: {formData.designStyle}</li>
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
