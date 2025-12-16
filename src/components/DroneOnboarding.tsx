import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plane, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles,
  Building2,
  MapPin,
  Camera,
  Video,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Home,
  Trees,
  Factory,
  Waves,
  Sun,
  Sunset,
  Clock,
  User
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
  locationType: string
  locationCity: string
  locationAddress: string
  locationNotes: string
  preferredDate: string
  alternativeDate: string
  timePreference: string
  projectName: string
  projectDescription: string
  deliverables: string[]
  additionalNotes: string
  password: string
  confirmPassword: string
}

const PACKAGES: PackageType[] = [
  {
    id: 'basis',
    name: 'Basis',
    price: '€399',
    priceLabel: ' excl. BTW',
    tagline: 'Ideaal voor kleine projecten',
    description: 'Perfect voor een eerste kennismaking.',
    features: ['15 bewerkte fotos', '1 drone video (60 sec)', '1 locatie', 'Levering binnen 5 dagen'],
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    id: 'professional',
    name: 'Professioneel',
    price: '€699',
    priceLabel: ' excl. BTW',
    tagline: 'Meest gekozen',
    description: 'Uitgebreid pakket voor bedrijven.',
    features: ['30 bewerkte fotos', '2 drone videos (90 sec)', 'Tot 2 locaties', 'Levering binnen 3 dagen'],
    gradient: 'from-amber-500 to-orange-600',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '€999',
    priceLabel: ' excl. BTW',
    tagline: 'Complete productie',
    description: 'Voor grote projecten en events.',
    features: ['50+ bewerkte fotos', 'Onbeperkt drone videos', 'Meerdere locaties', 'Same-day editing mogelijk'],
    gradient: 'from-orange-600 to-red-500',
  },
]

const STEPS = [
  { id: 1, title: 'Pakket', icon: Camera },
  { id: 2, title: 'Contact', icon: User },
  { id: 3, title: 'Locatie', icon: MapPin },
  { id: 4, title: 'Planning', icon: Clock },
  { id: 5, title: 'Project', icon: Video },
  { id: 6, title: 'Account', icon: Lock },
]

const LOCATION_TYPES = [
  { id: 'bedrijfspand', name: 'Bedrijfspand', icon: Building2 },
  { id: 'woning', name: 'Woning', icon: Home },
  { id: 'bouwproject', name: 'Bouwproject', icon: Factory },
  { id: 'landschap', name: 'Landschap', icon: Trees },
  { id: 'evenement', name: 'Evenement', icon: Camera },
  { id: 'water', name: 'Water/Kust', icon: Waves },
]

const TIME_PREFERENCES = [
  { id: 'ochtend', name: 'Ochtend', description: '7:00 - 12:00', icon: Sun },
  { id: 'middag', name: 'Middag', description: '12:00 - 17:00', icon: Sun },
  { id: 'golden-hour', name: 'Golden Hour', description: 'Zonsopgang/-ondergang', icon: Sunset },
  { id: 'flexibel', name: 'Flexibel', description: 'Wij adviseren', icon: Clock },
]

const DELIVERABLES = [
  { id: 'jpeg', name: 'Fotos (JPEG)' },
  { id: 'raw', name: 'RAW fotos' },
  { id: 'video-mp4', name: 'Video (MP4)' },
  { id: 'video-edit', name: 'Video met muziek' },
  { id: 'social', name: 'Social media formaten' },
]

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 opacity-20"
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
  let result = 'DR-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

interface DroneOnboardingProps {
  isFullPage?: boolean
  isStandalone?: boolean
  initialPackage?: 'basis' | 'professional' | 'premium'
  onClose?: () => void
}

export default function DroneOnboarding({ 
  isFullPage = true, 
  isStandalone = true, 
  initialPackage, 
  onClose 
}: DroneOnboardingProps) {
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
    locationType: '',
    locationCity: '',
    locationAddress: '',
    locationNotes: '',
    preferredDate: '',
    alternativeDate: '',
    timePreference: '',
    projectName: '',
    projectDescription: '',
    deliverables: ['Fotos (JPEG)', 'Video (MP4)'],
    additionalNotes: '',
    password: '',
    confirmPassword: '',
  })

  const selectedPackage = PACKAGES.find(p => p.id === formData.package)
  const currentGradient = selectedPackage?.gradient || 'from-orange-500 to-amber-500'

  const updateFormData = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleDeliverable = (name: string) => {
    const current = formData.deliverables
    if (current.includes(name)) {
      updateFormData('deliverables', current.filter(d => d !== name))
    } else {
      updateFormData('deliverables', [...current, name])
    }
  }

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return !!formData.package
      case 2: return !!formData.contactName && !!formData.email && !!formData.phone
      case 3: return !!formData.locationType && !!formData.locationCity
      case 4: return !!formData.preferredDate && !!formData.timePreference
      case 5: return !!formData.projectName && formData.deliverables.length > 0
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
          type: 'drone', 
          ...formData, 
          status: 'pending', 
          createdAt: new Date().toISOString() 
        }),
      })
      
      if (!response.ok) throw new Error('Failed')
      
      const bedanktUrl = '/bedankt?project=' + projectId + '&dienst=drone&email=' + encodeURIComponent(formData.email)
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

  // Get min date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-50 via-orange-50/20 to-slate-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 ${isFullPage ? 'pt-20' : ''}`}>
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
                    Kies je drone pakket
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Selecteer het pakket dat het beste bij jouw project past
                  </p>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
                  {PACKAGES.map((pkg) => (
                    <motion.button 
                      key={pkg.id} 
                      onClick={() => updateFormData('package', pkg.id)} 
                      className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.package === pkg.id 
                          ? 'border-transparent ring-2 ring-orange-500' 
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
                        <Plane className="w-4 h-4" />
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
                            <Check className={`w-4 h-4 flex-shrink-0 ${formData.package === pkg.id ? 'text-orange-500' : 'text-gray-400'}`} />
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

            {/* Step 2: Contact Info */}
            {currentStep === 2 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Contactgegevens
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Hoe kunnen we je bereiken?
                  </p>
                </div>
                
                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bedrijfsnaam
                    </label>
                    <input 
                      type="text" 
                      value={formData.companyName} 
                      onChange={(e) => updateFormData('companyName', e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      placeholder="info@jouwbedrijf.nl" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefoon *
                    </label>
                    <input 
                      type="tel" 
                      value={formData.phone} 
                      onChange={(e) => updateFormData('phone', e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      placeholder="06-12345678" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {currentStep === 3 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Locatie
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Waar gaan we filmen?
                  </p>
                </div>
                
                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type locatie *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {LOCATION_TYPES.map((loc) => {
                        const Icon = loc.icon
                        return (
                          <button 
                            key={loc.id} 
                            onClick={() => updateFormData('locationType', loc.id)} 
                            className={`p-3 rounded-xl border-2 text-center transition-all ${
                              formData.locationType === loc.id 
                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <Icon className={`w-5 h-5 mx-auto mb-1 ${formData.locationType === loc.id ? 'text-orange-500' : 'text-gray-400'}`} />
                            <span className={`font-medium text-sm ${
                              formData.locationType === loc.id 
                                ? 'text-orange-600 dark:text-orange-400' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {loc.name}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Plaats *
                    </label>
                    <input 
                      type="text" 
                      value={formData.locationCity} 
                      onChange={(e) => updateFormData('locationCity', e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      placeholder="Amsterdam" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Adres (optioneel)
                    </label>
                    <input 
                      type="text" 
                      value={formData.locationAddress} 
                      onChange={(e) => updateFormData('locationAddress', e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      placeholder="Straatnaam 123" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notities over de locatie
                    </label>
                    <textarea 
                      value={formData.locationNotes} 
                      onChange={(e) => updateFormData('locationNotes', e.target.value)} 
                      rows={3} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none" 
                      placeholder="Bijv. parkeren, toegang, hoogte beperkingen..." 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Planning */}
            {currentStep === 4 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Planning
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Wanneer wil je de opnames?
                  </p>
                </div>
                
                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Voorkeursdatum *
                    </label>
                    <input 
                      type="date" 
                      value={formData.preferredDate} 
                      min={minDate}
                      onChange={(e) => updateFormData('preferredDate', e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alternatieve datum
                    </label>
                    <input 
                      type="date" 
                      value={formData.alternativeDate}
                      min={minDate}
                      onChange={(e) => updateFormData('alternativeDate', e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tijdvoorkeur *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {TIME_PREFERENCES.map((time) => {
                        const Icon = time.icon
                        return (
                          <button 
                            key={time.id} 
                            onClick={() => updateFormData('timePreference', time.id)} 
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              formData.timePreference === time.id 
                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className={`w-4 h-4 ${formData.timePreference === time.id ? 'text-orange-500' : 'text-gray-400'}`} />
                              <span className={`font-medium ${
                                formData.timePreference === time.id 
                                  ? 'text-orange-600 dark:text-orange-400' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {time.name}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">{time.description}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      <strong>Let op:</strong> Drone opnames zijn afhankelijk van het weer. Bij slechte weersomstandigheden plannen we een nieuwe datum.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Project Details */}
            {currentStep === 5 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Project details
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Vertel ons meer over je project
                  </p>
                </div>
                
                <div className="space-y-6 max-w-lg mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Projectnaam *
                    </label>
                    <input 
                      type="text" 
                      value={formData.projectName} 
                      onChange={(e) => updateFormData('projectName', e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      placeholder="Bedrijfspand marketing video" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Wat wil je opnemen?
                    </label>
                    <textarea 
                      value={formData.projectDescription} 
                      onChange={(e) => updateFormData('projectDescription', e.target.value)} 
                      rows={3} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none" 
                      placeholder="Beschrijf wat je wilt vastleggen..." 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Gewenste output *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {DELIVERABLES.map((del) => (
                        <button 
                          key={del.id} 
                          onClick={() => toggleDeliverable(del.name)} 
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            formData.deliverables.includes(del.name) 
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className={`font-medium text-sm ${
                            formData.deliverables.includes(del.name) 
                              ? 'text-orange-600 dark:text-orange-400' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {formData.deliverables.includes(del.name) ? 'V ' : ''}{del.name}
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
                      rows={3} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none" 
                      placeholder="Bijv. specifieke shots, muziek, branding..." 
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
                  <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                    <p className="text-sm text-orange-700 dark:text-orange-300">
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
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
                      <li>Project: {formData.projectName}</li>
                      <li>Locatie: {formData.locationCity}</li>
                      <li>Datum: {formData.preferredDate}</li>
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
