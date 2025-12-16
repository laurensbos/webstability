import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Plane, 
  Camera,
  Video,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Loader2,
  Sparkles,
  Building2,
  Home,
  Trees,
  Factory,
  Waves,
  User,
  Upload,
  Link,
  CheckCircle,
  Sun,
  Sunset,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'

// Types
interface DroneOnboardingData {
  // Stap 1: Pakket keuze
  selectedPackage: 'basis' | 'professional' | 'premium'
  
  // Stap 2: Locatie & Planning
  locationType: string
  locationAddress: string
  locationCity: string
  locationPostalCode: string
  locationNotes: string
  preferredDate: string
  alternativeDate: string
  timePreference: string
  
  // Stap 3: Project Details
  projectName: string
  projectDescription: string
  deliverables: string[]
  referenceUrls: string
  referenceFiles: File[]
  
  // Stap 4: Bedrijfsgegevens
  companyName: string
  contactName: string
  email: string
  phone: string
  
  // Stap 5: Bevestigen
  additionalNotes: string
  agreedToTerms: boolean
  agreedToWeather: boolean
  projectPassword: string
  confirmPassword: string // Drone flights depend on weather
}

const INITIAL_DATA: DroneOnboardingData = {
  selectedPackage: 'professional',
  
  locationType: '',
  locationAddress: '',
  locationCity: '',
  locationPostalCode: '',
  locationNotes: '',
  preferredDate: '',
  alternativeDate: '',
  timePreference: '',
  
  projectName: '',
  projectDescription: '',
  deliverables: ['Foto\'s (JPEG)', 'Video (MP4)'],
  referenceUrls: '',
  referenceFiles: [],
  
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  
  additionalNotes: '',
  agreedToTerms: false,
  agreedToWeather: false,
  projectPassword: '',
  confirmPassword: ''
}

const STEPS = [
  { id: 1, title: 'Pakket', icon: Camera, color: 'from-orange-500 to-amber-600' },
  { id: 2, title: 'Locatie & Datum', icon: MapPin, color: 'from-orange-500 to-amber-600' },
  { id: 3, title: 'Project Details', icon: Video, color: 'from-orange-500 to-amber-600' },
  { id: 4, title: 'Contactgegevens', icon: User, color: 'from-orange-500 to-amber-600' },
  { id: 5, title: 'Bevestigen', icon: Sparkles, color: 'from-orange-500 to-amber-600' },
]

const PACKAGES = {
  basis: { 
    name: 'Basis', 
    price: 483, 
    priceExcl: 399, 
    description: 'Perfect voor kleine projecten',
    features: ['15 bewerkte foto\'s', '1 drone video (60 sec)', '1 locatie', 'Levering binnen 5 dagen'],
    popular: false
  },
  professional: { 
    name: 'Professioneel', 
    price: 846, 
    priceExcl: 699, 
    description: 'Uitgebreid pakket voor bedrijven',
    features: ['30 bewerkte foto\'s', '2 drone videos (elk 90 sec)', 'Tot 2 locaties', 'Levering binnen 3 dagen'],
    popular: true
  },
  premium: { 
    name: 'Premium', 
    price: 1209, 
    priceExcl: 999, 
    description: 'Complete productie voor grote projecten',
    features: ['50+ bewerkte foto\'s', 'Onbeperkt drone videos', 'Meerdere locaties', 'Same-day editing mogelijk'],
    popular: false
  },
}

const LOCATION_TYPES = [
  { id: 'bedrijfspand', name: 'Bedrijfspand', icon: Building2, description: 'Kantoor, winkel, fabriek' },
  { id: 'woning', name: 'Woning', icon: Home, description: 'Huis, villa, appartement' },
  { id: 'bouwproject', name: 'Bouwproject', icon: Factory, description: 'Nieuwbouw, renovatie' },
  { id: 'landschap', name: 'Landschap', icon: Trees, description: 'Natuur, parken, terreinen' },
  { id: 'evenement', name: 'Evenement', icon: Camera, description: 'Festival, bruiloft, sport' },
  { id: 'water', name: 'Water/Kust', icon: Waves, description: 'Strand, meer, haven' },
]

const TIME_PREFERENCES = [
  { id: 'ochtend', name: 'Ochtend', description: '7:00 - 12:00', icon: Sun },
  { id: 'middag', name: 'Middag', description: '12:00 - 17:00', icon: Sun },
  { id: 'golden-hour', name: 'Golden Hour', description: 'Zonsopgang/-ondergang', icon: Sunset },
  { id: 'flexibel', name: 'Flexibel', description: 'Wij adviseren', icon: Clock },
]

const DELIVERABLES = [
  { id: 'jpeg', name: 'Foto\'s (JPEG)', description: 'Bewerkte foto\'s in hoge kwaliteit' },
  { id: 'raw', name: 'RAW foto\'s', description: 'Onbewerkte foto\'s voor eigen editing' },
  { id: 'video-mp4', name: 'Video (MP4)', description: '4K video bestand' },
  { id: 'video-edit', name: 'Video editing', description: 'Gemonteerde video met muziek' },
  { id: '360', name: '360° foto\'s', description: 'Interactieve panorama foto\'s' },
  { id: 'social', name: 'Social media formaten', description: 'Geoptimaliseerd voor Instagram/TikTok' },
]

interface DroneOnboardingProps {
  onComplete?: (data: DroneOnboardingData, projectId: string) => void
  onClose?: () => void
  isStandalone?: boolean
  initialPackage?: 'basis' | 'professional' | 'premium'
}

export default function DroneOnboarding({ 
  onComplete, 
  onClose, 
  isStandalone = false,
  initialPackage = 'professional'
}: DroneOnboardingProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<DroneOnboardingData>({
    ...INITIAL_DATA,
    selectedPackage: initialPackage
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const updateData = (updates: Partial<DroneOnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }))
    const updatedKeys = Object.keys(updates)
    setErrors(prev => {
      const newErrors = { ...prev }
      updatedKeys.forEach(key => delete newErrors[key])
      return newErrors
    })
  }

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    switch (currentStep) {
      case 1:
        if (!data.selectedPackage) newErrors.selectedPackage = 'Kies een pakket'
        break
      case 2:
        if (!data.locationType) newErrors.locationType = 'Selecteer een type locatie'
        if (!data.locationCity.trim()) newErrors.locationCity = 'Vul een plaats in'
        if (!data.preferredDate) newErrors.preferredDate = 'Kies een voorkeursdatum'
        if (!data.timePreference) newErrors.timePreference = 'Selecteer een tijdvoorkeur'
        break
      case 3:
        if (!data.projectName.trim()) newErrors.projectName = 'Vul een projectnaam in'
        if (!data.projectDescription.trim()) newErrors.projectDescription = 'Beschrijf je project'
        if (data.deliverables.length === 0) newErrors.deliverables = 'Selecteer minimaal 1 deliverable'
        break
      case 4:
        if (!data.contactName.trim()) newErrors.contactName = 'Vul je naam in'
        if (!data.email.trim()) newErrors.email = 'Vul je e-mail in'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = 'Ongeldig e-mailadres'
        if (!data.phone.trim()) newErrors.phone = 'Vul je telefoonnummer in'
        break
      case 5:
        if (!data.projectPassword.trim()) newErrors.projectPassword = 'Kies een wachtwoord voor je project dashboard'
        else if (data.projectPassword.length < 6) newErrors.projectPassword = 'Wachtwoord moet minimaal 6 tekens zijn'
        if (!data.confirmPassword.trim()) newErrors.confirmPassword = 'Bevestig je wachtwoord'
        else if (data.projectPassword !== data.confirmPassword) newErrors.confirmPassword = 'Wachtwoorden komen niet overeen'
        if (!data.agreedToTerms) newErrors.agreedToTerms = 'Je moet akkoord gaan met de voorwaarden'
        if (!data.agreedToWeather) newErrors.agreedToWeather = 'Je moet akkoord gaan met de weervoorwaarden'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep() && currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const toggleDeliverable = (deliverableId: string) => {
    const deliverableName = DELIVERABLES.find(d => d.id === deliverableId)?.name || deliverableId
    if (data.deliverables.includes(deliverableName)) {
      updateData({ deliverables: data.deliverables.filter(d => d !== deliverableName) })
    } else {
      updateData({ deliverables: [...data.deliverables, deliverableName] })
    }
  }

  const handleSubmit = async () => {
    if (!validateStep()) return
    
    setSubmitting(true)
    
    try {
      const newProjectId = `DR-${Date.now().toString(36).toUpperCase()}`
      
      // Upload reference files if provided
      let uploadedReferenceUrls: string[] = []
      if (data.referenceFiles.length > 0) {
        for (const file of data.referenceFiles) {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('projectId', newProjectId)
          formData.append('type', 'reference')
          
          try {
            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              body: formData
            })
            if (uploadRes.ok) {
              const uploadData = await uploadRes.json()
              uploadedReferenceUrls.push(uploadData.url || file.name)
            }
          } catch (e) {
            uploadedReferenceUrls.push(`${file.name} (upload later via developer link)`)
          }
        }
      }

      const selectedPkg = PACKAGES[data.selectedPackage]
      const totalPrice = selectedPkg.price
      
      // Generate developer upload links
      const devUploadLinks = {
        reference: `${window.location.origin}/developer/upload/${newProjectId}/reference`,
        deliverables: `${window.location.origin}/developer/upload/${newProjectId}/deliverables`,
      }

      // Create project data
      const projectData = {
        projectId: newProjectId,
        businessName: data.companyName || data.projectName,
        package: 'drone',
        packageTier: data.selectedPackage,
        phase: 'planning',
        client: {
          name: data.contactName,
          email: data.email,
          phone: data.phone,
          company: data.companyName
        },
        onboardingData: {
          ...data,
          referenceUrls: uploadedReferenceUrls.length > 0 ? uploadedReferenceUrls : (data.referenceUrls ? [data.referenceUrls] : [])
        },
        devUploadLinks,
        pricing: {
          total: totalPrice,
          priceExcl: selectedPkg.priceExcl
        },
        shootDetails: {
          locationType: data.locationType,
          address: data.locationAddress,
          city: data.locationCity,
          postalCode: data.locationPostalCode,
          notes: data.locationNotes,
          preferredDate: data.preferredDate,
          alternativeDate: data.alternativeDate,
          timePreference: data.timePreference,
          deliverables: data.deliverables
        },
        createdAt: new Date().toISOString()
      }

      // Try to save to API
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      })

      // Save to localStorage as backup
      const existingProjects = JSON.parse(localStorage.getItem('webstability_dev_projects') || '[]')
      existingProjects.push(projectData)
      localStorage.setItem('webstability_dev_projects', JSON.stringify(existingProjects))

      // Send notification email to developer
      try {
        await fetch('/api/notifications/new-project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: newProjectId,
            clientName: data.contactName,
            clientEmail: data.email,
            clientPhone: data.phone,
            companyName: data.companyName || data.projectName,
            packageType: 'drone',
            packageTier: data.selectedPackage,
            pricing: {
              total: totalPrice
            },
            devUploadLinks,
            summary: {
              locationType: data.locationType,
              city: data.locationCity,
              preferredDate: data.preferredDate,
              timePreference: data.timePreference,
              deliverables: data.deliverables.join(', '),
              description: data.projectDescription
            }
          })
        })
      } catch (e) {
        console.log('Notification email failed, project still created')
      }

      // Send confirmation email to client
      try {
        await fetch('/api/notifications/project-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: data.email,
            clientName: data.contactName,
            companyName: data.companyName || data.projectName,
            projectId: newProjectId,
            packageName: `Drone ${selectedPkg.name}`,
            totalPrice,
            shootDate: data.preferredDate,
            location: `${data.locationCity}${data.locationAddress ? `, ${data.locationAddress}` : ''}`
          })
        })
      } catch (e) {
        console.log('Confirmation email failed')
      }

      if (response.ok || true) {
        if (onComplete) {
          onComplete(data, newProjectId)
        } else {
          navigate(`/status/${newProjectId}`)
        }
      }
    } catch (error) {
      console.error('Submit error:', error)
      const fallbackProjectId = `DR-${Date.now().toString(36).toUpperCase()}`
      if (onComplete) {
        onComplete(data, fallbackProjectId)
      } else {
        navigate(`/status/${fallbackProjectId}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <div className={`${isStandalone ? 'min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50' : ''}`}>
      {/* Header for standalone */}
      {isStandalone && (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-orange-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 dark:text-white">Dronebeelden Bestellen</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Professionele luchtopnames</p>
                </div>
              </div>
              <button
                onClick={() => onClose ? onClose() : navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </header>
      )}

      <div className={`max-w-4xl mx-auto ${isStandalone ? 'px-4 sm:px-6 py-8' : 'p-6'}`}>
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isCurrent ? 1.1 : 1,
                        backgroundColor: isCompleted ? '#f97316' : isCurrent ? '#fff' : '#f3f4f6'
                      }}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border-2 transition-colors ${
                        isCompleted 
                          ? 'border-orange-500 bg-orange-500' 
                          : isCurrent 
                            ? 'border-orange-500 bg-white shadow-lg shadow-orange-500/20' 
                            : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className={`w-5 h-5 ${isCurrent ? 'text-orange-500' : 'text-gray-400'}`} />
                      )}
                    </motion.div>
                    <span className={`mt-2 text-xs font-medium hidden sm:block ${isCurrent ? 'text-orange-600' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 ${isCompleted ? 'bg-orange-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={e => e.preventDefault()} className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Package Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Kies je drone pakket</h3>
                    <p className="text-gray-500 text-sm">Selecteer het pakket dat het beste past bij je project</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(PACKAGES).map(([key, pkg]) => {
                      const isSelected = data.selectedPackage === key
                      return (
                        <motion.button
                          key={key}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateData({ selectedPackage: key as 'basis' | 'professional' | 'premium' })}
                          className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg shadow-orange-500/20'
                              : 'border-gray-200 hover:border-orange-200 hover:shadow-md bg-white'
                          }`}
                        >
                          {pkg.popular && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold rounded-full shadow-lg">
                              Populair
                            </span>
                          )}
                          <div className="mb-3">
                            <h4 className="font-bold text-gray-900 dark:text-white">{pkg.name}</h4>
                          </div>
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-2xl font-bold text-orange-600">€{pkg.price}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">incl. BTW</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">{pkg.description}</p>
                          <ul className="space-y-1.5">
                            {pkg.features.map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <Check className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          {isSelected && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                  {errors.selectedPackage && (
                    <p className="text-red-500 text-sm">{errors.selectedPackage}</p>
                  )}
                </motion.div>
              )}

              {/* Step 2: Location & Date */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Locatie & Planning</h3>
                    <p className="text-gray-500 text-sm">Waar en wanneer gaan we filmen?</p>
                  </div>

                  {/* Location Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Type locatie *</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {LOCATION_TYPES.map((type) => {
                        const Icon = type.icon
                        const isSelected = data.locationType === type.id
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => updateData({ locationType: type.id })}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-orange-200'
                            }`}
                          >
                            <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-orange-600' : 'text-gray-400'}`} />
                            <p className={`font-medium text-sm ${isSelected ? 'text-orange-700' : 'text-gray-700'}`}>{type.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{type.description}</p>
                          </button>
                        )
                      })}
                    </div>
                    {errors.locationType && <p className="text-red-500 text-sm mt-1">{errors.locationType}</p>}
                  </div>

                  {/* Address */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adres (optioneel)</label>
                      <input
                        type="text"
                        value={data.locationAddress}
                        onChange={e => updateData({ locationAddress: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Straatnaam + huisnummer"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plaats *</label>
                        <input
                          type="text"
                          value={data.locationCity}
                          onChange={e => updateData({ locationCity: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-xl border ${errors.locationCity ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-orange-500`}
                          placeholder="Stad"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                        <input
                          type="text"
                          value={data.locationPostalCode}
                          onChange={e => updateData({ locationPostalCode: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500"
                          placeholder="1234 AB"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bijzonderheden locatie</label>
                    <textarea
                      value={data.locationNotes}
                      onChange={e => updateData({ locationNotes: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500"
                      placeholder="Bijv. parkeermogelijkheden, toegang, hoogtebeperkingen..."
                    />
                  </div>

                  {/* Date Selection */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Voorkeursdatum *</label>
                      <input
                        type="date"
                        value={data.preferredDate}
                        onChange={e => updateData({ preferredDate: e.target.value })}
                        min={getMinDate()}
                        className={`w-full px-4 py-2.5 rounded-xl border ${errors.preferredDate ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-orange-500`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alternatieve datum</label>
                      <input
                        type="date"
                        value={data.alternativeDate}
                        onChange={e => updateData({ alternativeDate: e.target.value })}
                        min={getMinDate()}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Time Preference */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Tijdvoorkeur *</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {TIME_PREFERENCES.map((time) => {
                        const Icon = time.icon
                        const isSelected = data.timePreference === time.id
                        return (
                          <button
                            key={time.id}
                            type="button"
                            onClick={() => updateData({ timePreference: time.id })}
                            className={`p-3 rounded-xl border-2 text-center transition-all ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-orange-200'
                            }`}
                          >
                            <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-orange-600' : 'text-gray-400'}`} />
                            <p className={`font-medium text-sm ${isSelected ? 'text-orange-700' : 'text-gray-700'}`}>{time.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{time.description}</p>
                          </button>
                        )
                      })}
                    </div>
                    {errors.timePreference && <p className="text-red-500 text-sm mt-1">{errors.timePreference}</p>}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-amber-800 text-sm">
                      <strong>☁️ Weerafhankelijk:</strong> Drone opnames zijn afhankelijk van het weer. We nemen 24 uur van tevoren contact op om te bevestigen of de shoot doorgaat.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Project Details */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Project Details</h3>
                    <p className="text-gray-500 text-sm">Vertel ons meer over je project</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Projectnaam / Bedrijfsnaam *</label>
                    <input
                      type="text"
                      value={data.projectName}
                      onChange={e => updateData({ projectName: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border ${errors.projectName ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-orange-500`}
                      placeholder="Bijv. Restaurant De Gouden Lepel"
                    />
                    {errors.projectName && <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijf wat je wilt vastleggen *</label>
                    <textarea
                      value={data.projectDescription}
                      onChange={e => updateData({ projectDescription: e.target.value })}
                      rows={4}
                      className={`w-full px-4 py-2.5 rounded-xl border ${errors.projectDescription ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-orange-500`}
                      placeholder="Bijv. 'Luchtopnames van ons restaurant en terras, met nadruk op de ligging aan het water en de sfeervolle tuin. Geschikt voor website en social media.'"
                    />
                    {errors.projectDescription && <p className="text-red-500 text-sm mt-1">{errors.projectDescription}</p>}
                  </div>

                  {/* Deliverables */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Gewenste deliverables *</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {DELIVERABLES.map((deliverable) => {
                        const isSelected = data.deliverables.includes(deliverable.name)
                        return (
                          <button
                            key={deliverable.id}
                            type="button"
                            onClick={() => toggleDeliverable(deliverable.id)}
                            className={`p-3 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-orange-200'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div>
                              <p className={`font-medium text-sm ${isSelected ? 'text-orange-700' : 'text-gray-700'}`}>{deliverable.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{deliverable.description}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    {errors.deliverables && <p className="text-red-500 text-sm mt-1">{errors.deliverables}</p>}
                  </div>

                  {/* Reference Material */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Referentiemateriaal (optioneel)</label>
                    <p className="text-xs text-gray-500 mb-3">Upload voorbeelden of geef links naar video's/foto's die je mooi vindt</p>
                    
                    <div className="space-y-3">
                      {/* File Upload */}
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-orange-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={e => {
                            const files = Array.from(e.target.files || [])
                            if (files.length > 0) {
                              updateData({ referenceFiles: [...data.referenceFiles, ...files] })
                            }
                          }}
                          className="hidden"
                          id="reference-upload"
                        />
                        <label htmlFor="reference-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="font-medium text-gray-600 dark:text-gray-400">Klik om bestanden te uploaden</p>
                          <p className="text-xs text-gray-400">Afbeeldingen of video's</p>
                        </label>
                      </div>

                      {/* Show uploaded files */}
                      {data.referenceFiles.length > 0 && (
                        <div className="space-y-2">
                          {data.referenceFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-orange-50 px-3 py-2 rounded-lg text-sm">
                              <span className="flex items-center gap-2 text-gray-700 truncate">
                                <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                                {file.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newFiles = data.referenceFiles.filter((_, i) => i !== idx)
                                  updateData({ referenceFiles: newFiles })
                                }}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* URL Input */}
                      <div className="flex items-center gap-2">
                        <Link className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={data.referenceUrls}
                          onChange={e => updateData({ referenceUrls: e.target.value })}
                          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500"
                          placeholder="Link naar YouTube, Vimeo of Pinterest..."
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Contact Details */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Contactgegevens</h3>
                    <p className="text-gray-500 text-sm">Hoe kunnen we je bereiken?</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bedrijfsnaam (optioneel)</label>
                    <input
                      type="text"
                      value={data.companyName}
                      onChange={e => updateData({ companyName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500"
                      placeholder="Je bedrijfsnaam"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contactpersoon *</label>
                    <input
                      type="text"
                      value={data.contactName}
                      onChange={e => updateData({ contactName: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border ${errors.contactName ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-orange-500`}
                      placeholder="Jouw naam"
                    />
                    {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-mailadres *</label>
                      <input
                        type="email"
                        value={data.email}
                        onChange={e => updateData({ email: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-orange-500`}
                        placeholder="je@email.nl"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefoonnummer *</label>
                      <input
                        type="tel"
                        value={data.phone}
                        onChange={e => updateData({ phone: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border ${errors.phone ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-orange-500`}
                        placeholder="06-12345678"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <p className="text-orange-800 text-sm">
                      <strong>📞 We bellen je:</strong> Na ontvangst van je aanvraag nemen we binnen 24 uur telefonisch contact op om de details te bespreken.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Confirm */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Bevestig je aanvraag</h3>
                    <p className="text-gray-500 text-sm">Controleer je gegevens en verstuur</p>
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200 dark:border-orange-800">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-orange-600" />
                      Samenvatting
                    </h4>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Pakket</span>
                        <span className="font-medium text-gray-900 dark:text-white">{PACKAGES[data.selectedPackage].name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Locatie</span>
                        <span className="font-medium text-gray-900 dark:text-white">{data.locationCity}{data.locationAddress && `, ${data.locationAddress}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Voorkeursdatum</span>
                        <span className="font-medium text-gray-900 dark:text-white">{data.preferredDate ? new Date(data.preferredDate).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' }) : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tijdvoorkeur</span>
                        <span className="font-medium text-gray-900 capitalize">{data.timePreference.replace('-', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Deliverables</span>
                        <span className="font-medium text-gray-900 text-right max-w-[200px]">{data.deliverables.join(', ')}</span>
                      </div>
                      
                      <div className="border-t border-orange-200 pt-3 mt-3">
                        <div className="flex justify-between text-lg">
                          <span className="font-bold text-gray-900 dark:text-white">Totaal</span>
                          <span className="font-bold text-orange-600">€{PACKAGES[data.selectedPackage].price}</span>
                        </div>
                        <p className="text-xs text-gray-500 text-right">incl. BTW (€{PACKAGES[data.selectedPackage].priceExcl} excl.)</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aanvullende opmerkingen</label>
                    <textarea
                      value={data.additionalNotes}
                      onChange={e => updateData({ additionalNotes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500"
                      placeholder="Nog iets dat we moeten weten?"
                    />
                  </div>

                  {/* Wachtwoord aanmaken */}
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-xl border border-orange-200 dark:border-orange-800">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
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
                            className={`w-full px-4 py-2.5 pr-10 rounded-lg border ${errors.projectPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500`}
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
                          className={`w-full px-4 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500`}
                          placeholder="Herhaal wachtwoord"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Met dit wachtwoord kun je de voortgang van je project volgen op de statuspagina.
                    </p>
                  </div>

                  {/* Terms */}
                  <div className="space-y-3">
                    <label className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${errors.agreedToTerms ? 'bg-red-50 border border-red-200' : 'bg-gray-50 hover:bg-gray-100'}`}>
                      <input
                        type="checkbox"
                        checked={data.agreedToTerms}
                        onChange={e => updateData({ agreedToTerms: e.target.checked })}
                        className="w-5 h-5 mt-0.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Ik ga akkoord met de <a href="/voorwaarden" target="_blank" className="text-orange-600 underline">algemene voorwaarden</a> en het <a href="/privacy" target="_blank" className="text-orange-600 underline">privacybeleid</a>.
                      </span>
                    </label>

                    <label className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${errors.agreedToWeather ? 'bg-red-50 border border-red-200' : 'bg-gray-50 hover:bg-gray-100'}`}>
                      <input
                        type="checkbox"
                        checked={data.agreedToWeather}
                        onChange={e => updateData({ agreedToWeather: e.target.checked })}
                        className="w-5 h-5 mt-0.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Ik begrijp dat drone opnames weerafhankelijk zijn en dat de shoot bij slecht weer wordt verplaatst naar een andere datum.
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Vorige
              </button>
            ) : (
              <div />
            )}

            {currentStep < STEPS.length ? (
              <motion.button
                type="button"
                onClick={nextStep}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all"
              >
                Volgende
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Versturen...
                  </>
                ) : (
                  <>
                    <Plane className="w-5 h-5" />
                    Aanvraag versturen
                  </>
                )}
              </motion.button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
