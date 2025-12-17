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
    price: '€299',
    priceLabel: '/maand incl. BTW',
    tagline: 'Ideaal om te beginnen',
    description: 'Perfect om te beginnen met online verkopen.',
    features: ['Tot 50 producten', 'iDEAL & creditcard', 'Basis verzendopties', 'Order management', 'E-mail notificaties'],
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    id: 'professional',
    name: 'Professioneel',
    price: '€599',
    priceLabel: '/maand incl. BTW',
    description: 'Voor serieuze webshops die willen groeien.',
    features: ['Tot 500 producten', 'Alle betaalmethodes', 'Geavanceerde verzending', 'Koppeling met boekhouden', 'Kortingscodes systeem', 'Klantaccounts'],
    gradient: 'from-green-500 to-teal-500',
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
                
                {/* Desktop: grid */}
                <div className="hidden sm:grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  {PACKAGES.map((pkg) => (
                    <motion.button 
                      key={pkg.id} 
                      onClick={() => updateFormData('package', pkg.id)} 
                      className={`relative flex-shrink-0 w-full snap-center p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.package === pkg.id 
                          ? 'border-transparent z-20' 
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
                      {formData.package === pkg.id && (
                        <div className="absolute inset-1 rounded-2xl pointer-events-none border-2 border-emerald-500" />
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
                          formData.package === pkg.id ? 'border-transparent z-20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
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
                       {formData.package === pkg.id && (
                         <div className="absolute inset-1 rounded-2xl pointer-events-none border-2 border-emerald-500" />
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

                 <div className="flex justify-center gap-2 mt-3">
                   {PACKAGES.map((_, idx) => (
                     <div key={idx} className={`h-2 rounded-full transition-all ${idx === 0 ? 'bg-emerald-500 w-6' : 'bg-gray-300 dark:bg-gray-600 w-2'}`} />
                   ))}
                 </div>
               </div>
              </div>
            )}
            
            {/* Step 2: Company Info */}
            {currentStep === 2 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Bedrijfsinformatie
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Vul je bedrijfsgegevens in om verder te gaan
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bedrijfsnaam
                      </label>
                      <input 
                        type="text" 
                        value={formData.companyName} 
                        onChange={e => updateFormData('companyName', e.target.value)} 
                        className="block w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="Vul je bedrijfsnaam in"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contactpersoon
                      </label>
                      <input 
                        type="text" 
                        value={formData.contactName} 
                        onChange={e => updateFormData('contactName', e.target.value)} 
                        className="block w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="Vul je naam in"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        E-mailadres
                      </label>
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={e => updateFormData('email', e.target.value)} 
                        className="block w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="Vul je e-mailadres in"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Telefoonnummer
                      </label>
                      <input 
                        type="tel" 
                        value={formData.phone} 
                        onChange={e => updateFormData('phone', e.target.value)} 
                        className="block w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="Vul je telefoonnummer in"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      KVK-nummer
                    </label>
                    <input 
                      type="text" 
                      value={formData.kvkNumber} 
                      onChange={e => updateFormData('kvkNumber', e.target.value)} 
                      className="block w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      placeholder="Vul je KVK-nummer in"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Webshop Info */}
            {currentStep === 3 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Webshop informatie
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Geef informatie over je webshop en producten
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Webshop naam
                    </label>
                    <input 
                      type="text" 
                      value={formData.shopName} 
                      onChange={e => updateFormData('shopName', e.target.value)} 
                      className="block w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      placeholder="Vul je webshop naam in"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Productcategorie
                    </label>
                    <select 
                      value={formData.productCategory} 
                      onChange={e => updateFormData('productCategory', e.target.value)} 
                      className="block w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    >
                      <option value="">Selecteer een categorie</option>
                      {PRODUCT_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Geschat aantal producten
                    </label>
                    <select 
                      value={formData.estimatedProducts} 
                      onChange={e => updateFormData('estimatedProducts', e.target.value)} 
                      className="block w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    >
                      <option value="">Selecteer een optie</option>
                      {PRODUCT_AMOUNTS.map(amount => (
                        <option key={amount} value={amount}>{amount}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Doelgroep
                    </label>
                    <input 
                      type="text" 
                      value={formData.targetAudience} 
                      onChange={e => updateFormData('targetAudience', e.target.value)} 
                      className="block w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      placeholder="Bijv. Jongeren, ouders, tech-liefhebbers"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Design Preferences */}
            {currentStep === 4 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Ontwerpvoorkeuren
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Kies je ontwerpvoorkeuren voor de webshop
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ontwerpstijl
                    </label>
                    <input 
                      type="text" 
                      value={formData.designStyle} 
                      onChange={e => updateFormData('designStyle', e.target.value)} 
                      className="block w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      placeholder="Bijv. Modern, klassiek, minimalistisch"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Huisstijl kleuren
                    </label>
                    <input 
                      type="text" 
                      value={formData.brandColors} 
                      onChange={e => updateFormData('brandColors', e.target.value)} 
                      className="block w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      placeholder="Vul je huisstijl kleuren in (hex, rgb of kleurnaam)"
                    />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <input 
                          type="checkbox" 
                          checked={formData.hasLogo} 
                          onChange={e => updateFormData('hasLogo', e.target.checked)} 
                          className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500 transition-all"
                        />
                        Heb je een logo?
                      </label>
                    </div>
                    
                    <div className="flex-1">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <input 
                          type="checkbox" 
                          checked={formData.hasProductPhotos} 
                          onChange={e => updateFormData('hasProductPhotos', e.target.checked)} 
                          className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500 transition-all"
                        />
                        Heb je productfoto's?
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 5: Goals */}
            {currentStep === 5 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Doelen
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Stel je doelen en verwachtingen voor de webshop in
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Wat is je belangrijkste doel met de webshop?
                    </label>
                    <input 
                      type="text" 
                      value={formData.additionalNotes} 
                      onChange={e => updateFormData('additionalNotes', e.target.value)} 
                      className="block w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      placeholder="Bijv. Verkoop, leadgeneratie, informatievoorziening"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 6: Account Setup */}
            {currentStep === 6 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Account aanmaken
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Maak een account aan om je webshop te kunnen beheren
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Wachtwoord
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={formData.password} 
                        onChange={e => updateFormData('password', e.target.value)} 
                        className="block w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="Kies een sterk wachtwoord"
                      />
                      
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(prev => !prev)} 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Bevestig wachtwoord
                    </label>
                    <div className="relative">
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        value={formData.confirmPassword} 
                        onChange={e => updateFormData('confirmPassword', e.target.value)} 
                        className="block w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="Herhaal je wachtwoord"
                      />
                      
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(prev => !prev)} 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
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
          
          <button 
            onClick={currentStep === 6 ? handleSubmit : handleNext} 
            disabled={isSubmitting}
            className={`flex-1 px-4 py-3 rounded-lg bg-emerald-500 text-white font-semibold transition-all flex items-center justify-center gap-2 hover:bg-emerald-600 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
          >
            {currentStep === 6 ? (
              isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Verwerken...
                </>
              ) : (
                'Volgende'
              )
            ) : (
              <>
                Volgende
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
         </div>
       </div>
     </div>
   )
 }
