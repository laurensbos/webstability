import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles,
  Camera,
  Palette,
  ShoppingBag,
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  Loader2,
  MapPin,
  Building2,
  CheckCircle2
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

// Floating particles
function FloatingParticles() {
  const particles = [
    { size: 6, x: '8%', y: '15%', delay: 0, duration: 9, color: 'from-primary-400 to-primary-600' },
    { size: 8, x: '92%', y: '20%', delay: 1.5, duration: 11, color: 'from-blue-400 to-blue-600' },
    { size: 5, x: '15%', y: '75%', delay: 0.8, duration: 10, color: 'from-primary-300 to-primary-500' },
    { size: 7, x: '88%', y: '65%', delay: 2.2, duration: 12, color: 'from-purple-400 to-purple-600' },
    { size: 5, x: '5%', y: '45%', delay: 1, duration: 8, color: 'from-blue-300 to-blue-500' },
    { size: 4, x: '78%', y: '85%', delay: 0.5, duration: 9.5, color: 'from-primary-400 to-blue-500' },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${particle.color} opacity-60`}
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 15, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Service configurations
const services = {
  drone: {
    id: 'drone',
    title: 'Drone Beelden',
    subtitle: 'Professionele luchtopnames voor je bedrijf',
    icon: Camera,
    color: 'from-blue-500 to-cyan-500',
    price: 'Vanaf €301 (incl. BTW)',
    description: 'Spectaculaire luchtbeelden die je bedrijf van zijn beste kant laten zien.',
    features: [
      'Professionele 4K drone opnames',
      'Bewerkte video & foto\'s',
      'Binnen 5 werkdagen geleverd',
      'Inclusief rechten voor commercieel gebruik'
    ],
    hasCalendar: true,
  },
  logo: {
    id: 'logo',
    title: 'Logo Ontwerp',
    subtitle: 'Een uniek logo dat past bij jouw merk',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
    price: 'Vanaf €241 (incl. BTW)',
    description: 'Een professioneel logo dat je merk een gezicht geeft.',
    features: [
      '3 unieke concepten',
      'Onbeperkte revisies',
      'Alle bestandsformaten',
      'Inclusief huisstijl guide'
    ],
    hasCalendar: false,
  },
  webshop: {
    id: 'webshop',
    title: 'Webshop',
    subtitle: 'Verkoop online met een professionele webshop',
    icon: ShoppingBag,
    color: 'from-green-500 to-emerald-500',
    price: 'Vanaf €422/maand (incl. BTW)',
    description: 'Een complete webshop met alle functionaliteiten die je nodig hebt.',
    features: [
      'Onbeperkt producten',
      'iDEAL, creditcard & meer',
      'Voorraadbeheer',
      'Automatische facturen'
    ],
    hasCalendar: false,
    isWebsite: true, // Redirects to /start with webshop preset
  },
}

// Helper function to get next 14 available dates (excluding weekends)
const getAvailableDates = () => {
  const dates = []
  const today = new Date()
  let daysAdded = 0
  let currentDate = new Date(today)
  currentDate.setDate(currentDate.getDate() + 2) // Start from day after tomorrow

  while (daysAdded < 14) {
    const dayOfWeek = currentDate.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push(new Date(currentDate))
      daysAdded++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dates
}

// Generate time slots
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 9; hour <= 17; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    if (hour < 17) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
  }
  return slots
}

// Drone form data
interface DroneFormData {
  // Step 1: Location
  locationType: 'business' | 'event' | 'property' | 'other'
  locationAddress: string
  locationCity: string
  locationNotes: string
  
  // Step 2: What to capture
  captureType: string[]
  duration: '30min' | '1hour' | '2hours' | 'half-day'
  
  // Step 3: Scheduling
  preferredDate: string
  preferredTime: string
  flexibleSchedule: boolean
  
  // Step 4: Contact
  contactName: string
  contactEmail: string
  contactPhone: string
  businessName: string
  additionalNotes: string
}

// Logo form data
interface LogoFormData {
  // Step 1: Business info
  businessName: string
  industry: string
  businessDescription: string
  
  // Step 2: Style preferences
  style: string[]
  colors: string[]
  avoidColors: string[]
  
  // Step 3: Inspiration & requirements
  inspiration: string
  mustHave: string
  mustAvoid: string
  hasExistingLogo: boolean
  
  // Step 4: Contact
  contactName: string
  contactEmail: string
  contactPhone: string
  preferCall: boolean
  additionalNotes: string
}

const droneInitialData: DroneFormData = {
  locationType: 'business',
  locationAddress: '',
  locationCity: '',
  locationNotes: '',
  captureType: [],
  duration: '1hour',
  preferredDate: '',
  preferredTime: '',
  flexibleSchedule: true,
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  businessName: '',
  additionalNotes: '',
}

const logoInitialData: LogoFormData = {
  businessName: '',
  industry: '',
  businessDescription: '',
  style: [],
  colors: [],
  avoidColors: [],
  inspiration: '',
  mustHave: '',
  mustAvoid: '',
  hasExistingLogo: false,
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  preferCall: false,
  additionalNotes: '',
}

const captureOptions = [
  { id: 'building', label: 'Gebouw / Pand', icon: Building2 },
  { id: 'property', label: 'Vastgoed / Terrein', icon: MapPin },
  { id: 'event', label: 'Evenement', icon: Calendar },
  { id: 'product', label: 'Product in actie', icon: ShoppingBag },
  { id: 'team', label: 'Team / Personeel', icon: MessageSquare },
  { id: 'other', label: 'Anders', icon: Sparkles },
]

const logoStyles = [
  { id: 'modern', label: 'Modern & Minimalistisch' },
  { id: 'classic', label: 'Klassiek & Tijdloos' },
  { id: 'playful', label: 'Speels & Creatief' },
  { id: 'bold', label: 'Bold & Opvallend' },
  { id: 'elegant', label: 'Elegant & Luxe' },
  { id: 'tech', label: 'Tech & Innovatief' },
]

const colorOptions = [
  { id: 'blue', label: 'Blauw', color: '#3B82F6' },
  { id: 'green', label: 'Groen', color: '#22C55E' },
  { id: 'purple', label: 'Paars', color: '#8B5CF6' },
  { id: 'red', label: 'Rood', color: '#EF4444' },
  { id: 'orange', label: 'Oranje', color: '#F97316' },
  { id: 'teal', label: 'Teal', color: '#14B8A6' },
  { id: 'pink', label: 'Roze', color: '#EC4899' },
  { id: 'black', label: 'Zwart', color: '#1F2937' },
  { id: 'gold', label: 'Goud', color: '#D4AF37' },
]

const industries = [
  'Bouw & Renovatie',
  'Horeca',
  'Gezondheid & Welzijn',
  'Retail',
  'Technologie',
  'Consultancy',
  'Creatieve sector',
  'Sport & Fitness',
  'Beauty & Wellness',
  'Anders',
]

export default function StartService() {
  const navigate = useNavigate()
  const { serviceType } = useParams<{ serviceType: string }>()
  
  const service = services[serviceType as keyof typeof services]
  
  // Redirect webshop to /start
  useEffect(() => {
    if (serviceType === 'webshop') {
      navigate('/start?pakket=professional&type=webshop')
    }
    window.scrollTo(0, 0)
  }, [serviceType, navigate])
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [droneData, setDroneData] = useState<DroneFormData>(droneInitialData)
  const [logoData, setLogoData] = useState<LogoFormData>(logoInitialData)
  
  const totalSteps = 4
  
  if (!service || serviceType === 'webshop') {
    return null // Will redirect
  }
  
  const isDrone = serviceType === 'drone'
  const ServiceIcon = service.icon

  const updateDroneData = <K extends keyof DroneFormData>(key: K, value: DroneFormData[K]) => {
    setDroneData(prev => ({ ...prev, [key]: value }))
  }

  const updateLogoData = <K extends keyof LogoFormData>(key: K, value: LogoFormData[K]) => {
    setLogoData(prev => ({ ...prev, [key]: value }))
  }

  const canProceed = (): boolean => {
    if (isDrone) {
      switch (currentStep) {
        case 1: return droneData.locationAddress !== '' && droneData.locationCity !== ''
        case 2: return droneData.captureType.length > 0
        case 3: return droneData.preferredDate !== '' && droneData.preferredTime !== ''
        case 4: return droneData.contactName !== '' && droneData.contactEmail !== '' && droneData.contactPhone !== ''
        default: return true
      }
    } else {
      switch (currentStep) {
        case 1: return logoData.businessName !== '' && logoData.industry !== ''
        case 2: return logoData.style.length > 0
        case 3: return true // Optional step
        case 4: return logoData.contactName !== '' && logoData.contactEmail !== ''
        default: return true
      }
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps && canProceed()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const endpoint = isDrone ? '/api/service-request/drone' : '/api/service-request/logo'
      const data = isDrone ? droneData : logoData
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          serviceType: serviceType,
        }),
      })

      if (!response.ok) throw new Error('Server error')
      
      const result = await response.json()
      
      if (!result.success || !result.requestId) {
        throw new Error('Invalid response')
      }

      // Redirect to thank you page
      navigate(`/bedankt-service?type=${serviceType}&id=${result.requestId}`)
    } catch {
      alert('Er ging iets mis. Probeer het opnieuw of mail naar hallo@webstability.nl')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleArrayItem = <T extends string>(array: T[], item: T, max = 5): T[] => {
    if (array.includes(item)) {
      return array.filter(i => i !== item)
    } else if (array.length < max) {
      return [...array, item]
    }
    return array
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/50 via-white to-blue-50/50 relative overflow-hidden">
      <FloatingParticles />
      
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-primary-200/40 via-purple-100/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tl from-blue-200/40 via-primary-100/30 to-transparent rounded-full blur-3xl" />
      </div>
      
      <Header />
      
      <main className="pt-24 md:pt-32 pb-16 md:pb-20 relative z-10">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`inline-flex items-center gap-2 bg-gradient-to-r ${service.color} text-white rounded-full px-4 py-1.5 mb-4 shadow-lg`}
            >
              <ServiceIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{service.price}</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3"
            >
              {service.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-base md:text-lg"
            >
              {service.subtitle}
            </motion.p>
          </div>

          {/* Progress bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Stap {currentStep}/{totalSteps}</span>
              <span className="text-sm font-semibold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                className={`h-full bg-gradient-to-r ${service.color} rounded-full`}
              />
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200/60 shadow-2xl p-6 md:p-10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/20 via-transparent to-blue-50/20 pointer-events-none" />
            
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {/* DRONE STEPS */}
                {isDrone && currentStep === 1 && (
                  <motion.div
                    key="drone-step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Waar maken we de opnames?</h2>
                    <p className="text-gray-600 mb-6">Vertel ons over de locatie</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type locatie</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'business', label: 'Bedrijfspand' },
                            { id: 'event', label: 'Evenement' },
                            { id: 'property', label: 'Vastgoed' },
                            { id: 'other', label: 'Anders' },
                          ].map(type => (
                            <button
                              key={type.id}
                              onClick={() => updateDroneData('locationType', type.id as typeof droneData.locationType)}
                              className={`p-3 rounded-xl border-2 text-left transition-all ${
                                droneData.locationType === type.id
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <span className="font-medium">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
                        <input
                          type="text"
                          value={droneData.locationAddress}
                          onChange={(e) => updateDroneData('locationAddress', e.target.value)}
                          placeholder="Straatnaam en huisnummer"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plaats *</label>
                        <input
                          type="text"
                          value={droneData.locationCity}
                          onChange={(e) => updateDroneData('locationCity', e.target.value)}
                          placeholder="Bijv. Amsterdam"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Opmerkingen over de locatie</label>
                        <textarea
                          value={droneData.locationNotes}
                          onChange={(e) => updateDroneData('locationNotes', e.target.value)}
                          placeholder="Bijv. parkeren, toegang, bijzonderheden..."
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {isDrone && currentStep === 2 && (
                  <motion.div
                    key="drone-step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Wat willen we vastleggen?</h2>
                    <p className="text-gray-600 mb-6">Selecteer wat je wilt laten filmen</p>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Wat moet in beeld? *</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {captureOptions.map(option => {
                            const Icon = option.icon
                            return (
                              <button
                                key={option.id}
                                onClick={() => updateDroneData('captureType', toggleArrayItem(droneData.captureType, option.id))}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${
                                  droneData.captureType.includes(option.id)
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <Icon className={`w-5 h-5 mb-2 ${droneData.captureType.includes(option.id) ? 'text-primary-600' : 'text-gray-400'}`} />
                                <span className="font-medium text-sm">{option.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Geschatte duur opnames</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { id: '30min', label: '30 min', price: '€301' },
                            { id: '1hour', label: '1 uur', price: '€422' },
                            { id: '2hours', label: '2 uur', price: '€604' },
                            { id: 'half-day', label: 'Halve dag', price: '€906' },
                          ].map(duration => (
                            <button
                              key={duration.id}
                              onClick={() => updateDroneData('duration', duration.id as typeof droneData.duration)}
                              className={`p-4 rounded-xl border-2 text-center transition-all ${
                                droneData.duration === duration.id
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <span className="font-bold block">{duration.label}</span>
                              <span className="text-sm text-gray-500">{duration.price}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {isDrone && currentStep === 3 && (
                  <motion.div
                    key="drone-step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan je afspraak</h2>
                    <p className="text-gray-600 mb-6">Kies een datum en tijd die jou uitkomt</p>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary-600" />
                          Kies een datum *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {getAvailableDates().map((date) => {
                            const dateStr = date.toISOString().split('T')[0]
                            const dayName = date.toLocaleDateString('nl-NL', { weekday: 'short' })
                            const dayNum = date.getDate()
                            const month = date.toLocaleDateString('nl-NL', { month: 'short' })
                            return (
                              <button
                                key={dateStr}
                                onClick={() => updateDroneData('preferredDate', dateStr)}
                                className={`p-3 rounded-xl border-2 text-center transition-all ${
                                  droneData.preferredDate === dateStr
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <span className="text-xs text-gray-500 block capitalize">{dayName}</span>
                                <span className="font-bold text-lg">{dayNum}</span>
                                <span className="text-xs text-gray-500 block">{month}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary-600" />
                          Kies een starttijd *
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {generateTimeSlots().map((time) => (
                            <button
                              key={time}
                              onClick={() => updateDroneData('preferredTime', time)}
                              className={`p-2 rounded-lg border-2 text-center transition-all ${
                                droneData.preferredTime === time
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <span className="font-medium text-sm">{time}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
                        <input
                          type="checkbox"
                          checked={droneData.flexibleSchedule}
                          onChange={(e) => updateDroneData('flexibleSchedule', e.target.checked)}
                          className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <span className="font-medium">Ik ben flexibel met de datum/tijd</span>
                          <p className="text-sm text-gray-500">We kunnen dan rekening houden met het weer</p>
                        </div>
                      </label>
                    </div>
                  </motion.div>
                )}

                {isDrone && currentStep === 4 && (
                  <motion.div
                    key="drone-step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Jouw gegevens</h2>
                    <p className="text-gray-600 mb-6">Hoe kunnen we je bereiken?</p>
                    
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Je naam *</label>
                          <input
                            type="text"
                            value={droneData.contactName}
                            onChange={(e) => updateDroneData('contactName', e.target.value)}
                            placeholder="Voor- en achternaam"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrijfsnaam</label>
                          <input
                            type="text"
                            value={droneData.businessName}
                            onChange={(e) => updateDroneData('businessName', e.target.value)}
                            placeholder="Je bedrijf"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mailadres *</label>
                        <input
                          type="email"
                          value={droneData.contactEmail}
                          onChange={(e) => updateDroneData('contactEmail', e.target.value)}
                          placeholder="jouw@email.nl"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefoonnummer *</label>
                        <input
                          type="tel"
                          value={droneData.contactPhone}
                          onChange={(e) => updateDroneData('contactPhone', e.target.value)}
                          placeholder="06 12345678"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Extra wensen of opmerkingen</label>
                        <textarea
                          value={droneData.additionalNotes}
                          onChange={(e) => updateDroneData('additionalNotes', e.target.value)}
                          placeholder="Bijv. specifieke shots, muziek, deadlines..."
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* LOGO STEPS */}
                {!isDrone && currentStep === 1 && (
                  <motion.div
                    key="logo-step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Over jouw bedrijf</h2>
                    <p className="text-gray-600 mb-6">Vertel ons over je merk</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bedrijfsnaam *</label>
                        <input
                          type="text"
                          value={logoData.businessName}
                          onChange={(e) => updateLogoData('businessName', e.target.value)}
                          placeholder="De naam die in het logo moet"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Branche *</label>
                        <select
                          value={logoData.industry}
                          onChange={(e) => updateLogoData('industry', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Selecteer je branche</option>
                          {industries.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijf je bedrijf</label>
                        <textarea
                          value={logoData.businessDescription}
                          onChange={(e) => updateLogoData('businessDescription', e.target.value)}
                          placeholder="Wat doe je? Wie zijn je klanten? Wat maakt je uniek?"
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      
                      <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
                        <input
                          type="checkbox"
                          checked={logoData.hasExistingLogo}
                          onChange={(e) => updateLogoData('hasExistingLogo', e.target.checked)}
                          className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <span className="font-medium">Ik heb al een bestaand logo</span>
                          <p className="text-sm text-gray-500">We kunnen elementen overnemen of volledig opnieuw beginnen</p>
                        </div>
                      </label>
                    </div>
                  </motion.div>
                )}

                {!isDrone && currentStep === 2 && (
                  <motion.div
                    key="logo-step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Stijl & Kleuren</h2>
                    <p className="text-gray-600 mb-6">Welke sfeer past bij jouw merk?</p>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Gewenste stijl *</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {logoStyles.map(style => (
                            <button
                              key={style.id}
                              onClick={() => updateLogoData('style', toggleArrayItem(logoData.style, style.id, 3))}
                              className={`p-4 rounded-xl border-2 text-left transition-all ${
                                logoData.style.includes(style.id)
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <span className="font-medium text-sm">{style.label}</span>
                              {logoData.style.includes(style.id) && (
                                <CheckCircle2 className="w-4 h-4 text-primary-600 mt-1" />
                              )}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Selecteer max. 3 stijlen</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Gewenste kleuren</label>
                        <div className="flex flex-wrap gap-3">
                          {colorOptions.map(color => (
                            <button
                              key={color.id}
                              onClick={() => updateLogoData('colors', toggleArrayItem(logoData.colors, color.id, 4))}
                              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                                logoData.colors.includes(color.id)
                                  ? 'border-gray-800 bg-gray-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div 
                                className="w-4 h-4 rounded-full ring-1 ring-gray-200"
                                style={{ backgroundColor: color.color }}
                              />
                              <span className="text-sm">{color.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Kleuren vermijden</label>
                        <div className="flex flex-wrap gap-3">
                          {colorOptions.map(color => (
                            <button
                              key={color.id}
                              onClick={() => updateLogoData('avoidColors', toggleArrayItem(logoData.avoidColors, color.id, 4))}
                              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                                logoData.avoidColors.includes(color.id)
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div 
                                className="w-4 h-4 rounded-full ring-1 ring-gray-200"
                                style={{ backgroundColor: color.color }}
                              />
                              <span className="text-sm">{color.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!isDrone && currentStep === 3 && (
                  <motion.div
                    key="logo-step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Inspiratie & Wensen</h2>
                    <p className="text-gray-600 mb-6">Help ons je visie te begrijpen</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Inspiratie (logo's die je mooi vindt)
                        </label>
                        <textarea
                          value={logoData.inspiration}
                          onChange={(e) => updateLogoData('inspiration', e.target.value)}
                          placeholder="Links naar logo's, merken of afbeeldingen die je aanspreken..."
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dit moet er zeker in zitten
                        </label>
                        <textarea
                          value={logoData.mustHave}
                          onChange={(e) => updateLogoData('mustHave', e.target.value)}
                          placeholder="Bijv. een specifiek symbool, initialen, tagline..."
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dit absoluut niet
                        </label>
                        <textarea
                          value={logoData.mustAvoid}
                          onChange={(e) => updateLogoData('mustAvoid', e.target.value)}
                          placeholder="Bijv. geen clipart, geen bepaalde vormen..."
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {!isDrone && currentStep === 4 && (
                  <motion.div
                    key="logo-step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Jouw gegevens</h2>
                    <p className="text-gray-600 mb-6">Hoe kunnen we je bereiken?</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Je naam *</label>
                        <input
                          type="text"
                          value={logoData.contactName}
                          onChange={(e) => updateLogoData('contactName', e.target.value)}
                          placeholder="Voor- en achternaam"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mailadres *</label>
                        <input
                          type="email"
                          value={logoData.contactEmail}
                          onChange={(e) => updateLogoData('contactEmail', e.target.value)}
                          placeholder="jouw@email.nl"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefoonnummer</label>
                        <input
                          type="tel"
                          value={logoData.contactPhone}
                          onChange={(e) => updateLogoData('contactPhone', e.target.value)}
                          placeholder="06 12345678"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      
                      <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl cursor-pointer border border-primary-100">
                        <input
                          type="checkbox"
                          checked={logoData.preferCall}
                          onChange={(e) => updateLogoData('preferCall', e.target.checked)}
                          className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <span className="font-medium flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary-600" />
                            Ik wil graag gebeld worden
                          </span>
                          <p className="text-sm text-gray-500">We plannen een kort gesprek om je wensen te bespreken</p>
                        </div>
                      </label>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nog iets toe te voegen?</label>
                        <textarea
                          value={logoData.additionalNotes}
                          onChange={(e) => updateLogoData('additionalNotes', e.target.value)}
                          placeholder="Bijv. deadline, budget, andere wensen..."
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200/60">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-xl hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Vorige</span>
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r ${service.color} text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:-translate-y-0.5`}
                >
                  <span>Volgende</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className={`flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:-translate-y-0.5`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verzenden...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Verstuur aanvraag</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {service.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
