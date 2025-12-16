import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ShoppingCart, 
  Building2, 
  Palette, 
  CreditCard, 
  Truck, 
  Package,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Loader2,
  Sparkles,
  Clock,
  Star,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'

// Types
interface WebshopOnboardingData {
  // Stap 1: Bedrijfsgegevens
  companyName: string
  contactName: string
  email: string
  phone: string
  address: string
  postalCode: string
  city: string
  kvkNumber: string
  btwNumber: string
  
  // Stap 2: Webshop Details
  shopName: string
  shopDescription: string
  expectedProducts: string // '1-25' | '26-100' | '100-500' | '500+'
  productCategories: string[]
  hasPhysicalStore: boolean
  currentWebsite: string
  
  // Stap 3: Producten & Voorraad
  productType: string // 'physical' | 'digital' | 'both'
  hasExistingProducts: boolean
  productSource: string // 'manual' | 'csv' | 'existing_system'
  needsInventoryManagement: boolean
  averageProductPrice: string
  
  // Stap 4: Betalingen & Verzending
  paymentMethods: string[]
  shippingOptions: string[]
  shippingZones: string[] // 'nl' | 'be' | 'eu' | 'worldwide'
  freeShippingThreshold: string
  returnPolicy: string
  
  // Stap 5: Branding & Design
  hasLogo: boolean
  brandColors: string
  designStyle: string // 'modern' | 'classic' | 'minimalist' | 'playful'
  inspirationUrls: string
  
  // Stap 6: Extra Wensen
  socialMedia: string
  marketingIntegrations: string[]
  additionalFeatures: string[]
  extraNotes: string
  
  // Pakket info
  selectedPackage: 'webshop'
  agreedToTerms: boolean
  projectPassword: string
  confirmPassword: string
}

const INITIAL_DATA: WebshopOnboardingData = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  address: '',
  postalCode: '',
  city: '',
  kvkNumber: '',
  btwNumber: '',
  
  shopName: '',
  shopDescription: '',
  expectedProducts: '1-25',
  productCategories: [],
  hasPhysicalStore: false,
  currentWebsite: '',
  
  productType: 'physical',
  hasExistingProducts: false,
  productSource: 'manual',
  needsInventoryManagement: true,
  averageProductPrice: '',
  
  paymentMethods: ['ideal'],
  shippingOptions: [],
  shippingZones: ['nl'],
  freeShippingThreshold: '',
  returnPolicy: '14 dagen',
  
  hasLogo: false,
  brandColors: '',
  designStyle: 'modern',
  inspirationUrls: '',
  
  socialMedia: '',
  marketingIntegrations: [],
  additionalFeatures: [],
  extraNotes: '',
  
  selectedPackage: 'webshop',
  agreedToTerms: false,
  projectPassword: '',
  confirmPassword: ''
}

const STEPS = [
  { id: 1, title: 'Bedrijfsgegevens', icon: Building2, color: 'from-emerald-500 to-green-600' },
  { id: 2, title: 'Webshop Details', icon: ShoppingCart, color: 'from-emerald-500 to-green-600' },
  { id: 3, title: 'Producten', icon: Package, color: 'from-emerald-500 to-green-600' },
  { id: 4, title: 'Betaling & Verzending', icon: Truck, color: 'from-orange-500 to-amber-600' },
  { id: 5, title: 'Branding', icon: Palette, color: 'from-pink-500 to-rose-600' },
  { id: 6, title: 'Extra & Bevestigen', icon: Sparkles, color: 'from-cyan-500 to-teal-600' },
]

const PRODUCT_CATEGORIES = [
  'Kleding & Mode', 'Elektronica', 'Huis & Tuin', 'Sport & Outdoor',
  'Beauty & Gezondheid', 'Speelgoed & Games', 'Eten & Drinken', 'Boeken & Media',
  'Auto & Motor', 'Kunst & Handwerk', 'Huisdieren', 'Anders'
]

const PAYMENT_METHODS = [
  { id: 'ideal', name: 'iDEAL', popular: true },
  { id: 'creditcard', name: 'Creditcard', popular: true },
  { id: 'paypal', name: 'PayPal', popular: true },
  { id: 'bancontact', name: 'Bancontact', popular: false },
  { id: 'klarna', name: 'Klarna (achteraf betalen)', popular: true },
  { id: 'applepay', name: 'Apple Pay', popular: false },
  { id: 'googlepay', name: 'Google Pay', popular: false },
]

const SHIPPING_OPTIONS = [
  { id: 'postnl', name: 'PostNL' },
  { id: 'dhl', name: 'DHL' },
  { id: 'dpd', name: 'DPD' },
  { id: 'ups', name: 'UPS' },
  { id: 'pickup', name: 'Afhalen in winkel' },
]

const MARKETING_INTEGRATIONS = [
  'Google Analytics', 'Facebook Pixel', 'Google Ads', 'Mailchimp',
  'Klaviyo', 'Instagram Shopping', 'Pinterest', 'TikTok Pixel'
]

const ADDITIONAL_FEATURES = [
  'Productreviews', 'Wishlist/Verlanglijst', 'Kortingscodes', 'Cadeaubonnen',
  'Loyaliteitsprogramma', 'Product vergelijken', 'Meertalig (NL/EN)', 'B2B prijzen'
]

interface WebshopOnboardingProps {
  onComplete?: (data: WebshopOnboardingData, projectId: string) => void
  onClose?: () => void
  isStandalone?: boolean
}

export default function WebshopOnboarding({ 
  onComplete, 
  onClose, 
  isStandalone = false
}: WebshopOnboardingProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<WebshopOnboardingData>(INITIAL_DATA)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void isStandalone // Keep for backwards compatibility
  const updateData = (updates: Partial<WebshopOnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }))
    // Clear errors for updated fields
    const clearedErrors = { ...errors }
    Object.keys(updates).forEach(key => delete clearedErrors[key])
    setErrors(clearedErrors)
  }

  const toggleArrayItem = (field: keyof WebshopOnboardingData, item: string) => {
    const current = data[field] as string[]
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item]
    updateData({ [field]: updated } as Partial<WebshopOnboardingData>)
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!data.companyName.trim()) newErrors.companyName = 'Bedrijfsnaam is verplicht'
        if (!data.contactName.trim()) newErrors.contactName = 'Contactpersoon is verplicht'
        if (!data.email.trim()) newErrors.email = 'Email is verplicht'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = 'Ongeldig email adres'
        if (!data.phone.trim()) newErrors.phone = 'Telefoonnummer is verplicht'
        break
      case 2:
        if (!data.shopName.trim()) newErrors.shopName = 'Webshop naam is verplicht'
        if (!data.shopDescription.trim()) newErrors.shopDescription = 'Korte omschrijving is verplicht'
        if (data.productCategories.length === 0) newErrors.productCategories = 'Selecteer minimaal 1 categorie'
        break
      case 3:
        // No required fields
        break
      case 4:
        if (data.paymentMethods.length === 0) newErrors.paymentMethods = 'Selecteer minimaal 1 betaalmethode'
        if (data.shippingZones.length === 0) newErrors.shippingZones = 'Selecteer minimaal 1 verzendzone'
        break
      case 5:
        if (!data.designStyle) newErrors.designStyle = 'Selecteer een stijl'
        break
      case 6:
        if (!data.projectPassword.trim()) newErrors.projectPassword = 'Kies een wachtwoord voor je project dashboard'
        else if (data.projectPassword.length < 6) newErrors.projectPassword = 'Wachtwoord moet minimaal 6 tekens zijn'
        if (!data.confirmPassword.trim()) newErrors.confirmPassword = 'Bevestig je wachtwoord'
        else if (data.projectPassword !== data.confirmPassword) newErrors.confirmPassword = 'Wachtwoorden komen niet overeen'
        if (!data.agreedToTerms) newErrors.agreedToTerms = 'Je moet akkoord gaan met de voorwaarden'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setSubmitting(true)

    try {
      // Genereer project ID
      const newProjectId = `WS-${Date.now().toString(36).toUpperCase()}`
      
      // Sla op in server
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newProjectId,
          type: 'webshop',
          packageType: 'webshop',
          password: data.projectPassword,
          customer: {
            name: data.contactName,
            email: data.email,
            phone: data.phone,
            companyName: data.companyName
          },
          onboardingData: data,
          status: 'onboarding',
          paymentStatus: 'pending',
          createdAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        // Ook opslaan in localStorage als backup
        const existingProjects = JSON.parse(localStorage.getItem('webstability_dev_projects') || '[]')
        existingProjects.push({
          projectId: newProjectId,
          businessName: data.companyName,
          package: 'webshop',
          phase: 'onboarding',
          client: {
            name: data.contactName,
            email: data.email,
            phone: data.phone,
            company: data.companyName
          },
          onboardingData: data,
          createdAt: new Date().toISOString()
        })
        localStorage.setItem('webstability_dev_projects', JSON.stringify(existingProjects))

        if (onComplete) {
          onComplete(data, newProjectId)
        } else {
          navigate(`/status/${newProjectId}`)
        }
      } else {
        // Fallback naar alleen localStorage
        const existingProjects = JSON.parse(localStorage.getItem('webstability_dev_projects') || '[]')
        existingProjects.push({
          projectId: newProjectId,
          businessName: data.companyName,
          package: 'webshop',
          phase: 'onboarding',
          client: {
            name: data.contactName,
            email: data.email,
            phone: data.phone,
            company: data.companyName
          },
          onboardingData: data,
          createdAt: new Date().toISOString()
        })
        localStorage.setItem('webstability_dev_projects', JSON.stringify(existingProjects))

        if (onComplete) {
          onComplete(data, newProjectId)
        } else {
          navigate(`/status/${newProjectId}`)
        }
      }
    } catch (error) {
      console.error('Submit error:', error)
      // Fallback - maak alsnog project ID aan
      const fallbackProjectId = `WS-${Date.now().toString(36).toUpperCase()}`
      if (onComplete) {
        onComplete(data, fallbackProjectId)
      } else {
        navigate(`/status/${fallbackProjectId}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const progress = (currentStep / STEPS.length) * 100

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-4 sm:p-6 text-white relative overflow-hidden">
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
                  <ShoppingCart className="w-6 h-6" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold">Webshop Aanvraag</h2>
                  <p className="text-white/80 text-sm">Start jouw professionele webshop</p>
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
                      isActive ? 'bg-white text-emerald-600 shadow-lg' : isComplete ? 'bg-white/30' : 'bg-white/10'
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
              {/* Step 1: Bedrijfsgegevens */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Bedrijfsgegevens</h3>
                    <p className="text-gray-500 text-sm">Vertel ons over je bedrijf</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bedrijfsnaam *
                      </label>
                      <input
                        type="text"
                        value={data.companyName}
                        onChange={e => updateData({ companyName: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.companyName ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-emerald-500`}
                        placeholder="Bijv. Fashion Store BV"
                      />
                      {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contactpersoon *
                      </label>
                      <input
                        type="text"
                        value={data.contactName}
                        onChange={e => updateData({ contactName: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.contactName ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-emerald-500`}
                        placeholder="Jan Jansen"
                      />
                      {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={data.email}
                        onChange={e => updateData({ email: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-emerald-500`}
                        placeholder="info@bedrijf.nl"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefoon *
                      </label>
                      <input
                        type="tel"
                        value={data.phone}
                        onChange={e => updateData({ phone: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-emerald-500`}
                        placeholder="06-12345678"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                      <input
                        type="text"
                        value={data.address}
                        onChange={e => updateData({ address: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                        placeholder="Straatnaam 123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                      <input
                        type="text"
                        value={data.postalCode}
                        onChange={e => updateData({ postalCode: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                        placeholder="1234 AB"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plaats</label>
                      <input
                        type="text"
                        value={data.city}
                        onChange={e => updateData({ city: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                        placeholder="Amsterdam"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">KVK nummer</label>
                      <input
                        type="text"
                        value={data.kvkNumber}
                        onChange={e => updateData({ kvkNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                        placeholder="12345678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">BTW nummer</label>
                      <input
                        type="text"
                        value={data.btwNumber}
                        onChange={e => updateData({ btwNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                        placeholder="NL123456789B01"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Webshop Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Webshop Details</h3>
                    <p className="text-gray-500 text-sm">Wat voor webshop wil je starten?</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Naam van je webshop *
                    </label>
                    <input
                      type="text"
                      value={data.shopName}
                      onChange={e => updateData({ shopName: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-lg border ${errors.shopName ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-emerald-500`}
                      placeholder="Bijv. Fashion Forward"
                    />
                    {errors.shopName && <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Korte omschrijving van je webshop *
                    </label>
                    <textarea
                      value={data.shopDescription}
                      onChange={e => updateData({ shopDescription: e.target.value })}
                      rows={3}
                      className={`w-full px-4 py-2.5 rounded-lg border ${errors.shopDescription ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-emerald-500`}
                      placeholder="Wat verkoop je en wie is je doelgroep?"
                    />
                    {errors.shopDescription && <p className="text-red-500 text-xs mt-1">{errors.shopDescription}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hoeveel producten verwacht je te verkopen?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['1-25', '26-100', '100-500', '500+'].map(option => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateData({ expectedProducts: option })}
                          className={`p-3 rounded-lg border-2 text-center transition ${
                            data.expectedProducts === option
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <div className="font-semibold">{option}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">producten</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Productcategorieën * <span className="text-gray-400 font-normal">(selecteer alle relevante)</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PRODUCT_CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleArrayItem('productCategories', cat)}
                          className={`p-2 rounded-lg border text-sm text-left transition ${
                            data.productCategories.includes(cat)
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          {data.productCategories.includes(cat) && <Check className="w-3 h-3 inline mr-1" />}
                          {cat}
                        </button>
                      ))}
                    </div>
                    {errors.productCategories && <p className="text-red-500 text-xs mt-1">{errors.productCategories}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Heb je al een fysieke winkel?
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateData({ hasPhysicalStore: true })}
                          className={`flex-1 p-2 rounded-lg border text-sm transition ${
                            data.hasPhysicalStore ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                          }`}
                        >
                          Ja
                        </button>
                        <button
                          type="button"
                          onClick={() => updateData({ hasPhysicalStore: false })}
                          className={`flex-1 p-2 rounded-lg border text-sm transition ${
                            !data.hasPhysicalStore ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                          }`}
                        >
                          Nee
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Huidige website (optioneel)
                      </label>
                      <input
                        type="url"
                        value={data.currentWebsite}
                        onChange={e => updateData({ currentWebsite: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Producten & Voorraad */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Producten & Voorraad</h3>
                    <p className="text-gray-500 text-sm">Hoe wil je je producten beheren?</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type producten
                    </label>
                    <div className="grid sm:grid-cols-3 gap-2">
                      {[
                        { id: 'physical', name: 'Fysieke producten', desc: 'Worden verzonden' },
                        { id: 'digital', name: 'Digitale producten', desc: 'Downloads, e-books, etc.' },
                        { id: 'both', name: 'Beide', desc: 'Fysiek én digitaal' },
                      ].map(option => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => updateData({ productType: option.id })}
                          className={`p-3 rounded-lg border-2 text-left transition ${
                            data.productType === option.id
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <div className="font-semibold text-sm">{option.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heb je al producten klaar om te uploaden?
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateData({ hasExistingProducts: true })}
                        className={`flex-1 p-3 rounded-lg border-2 text-center transition ${
                          data.hasExistingProducts ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                        }`}
                      >
                        <Package className="w-5 h-5 mx-auto mb-1" />
                        <div className="font-semibold text-sm">Ja, klaar</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateData({ hasExistingProducts: false })}
                        className={`flex-1 p-3 rounded-lg border-2 text-center transition ${
                          !data.hasExistingProducts ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                        }`}
                      >
                        <Clock className="w-5 h-5 mx-auto mb-1" />
                        <div className="font-semibold text-sm">Nog niet</div>
                      </button>
                    </div>
                  </div>

                  {data.hasExistingProducts && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hoe wil je producten toevoegen?
                      </label>
                      <div className="grid sm:grid-cols-3 gap-2">
                        {[
                          { id: 'manual', name: 'Handmatig', desc: 'Één voor één invoeren' },
                          { id: 'csv', name: 'CSV import', desc: 'Bulk upload via bestand' },
                          { id: 'existing_system', name: 'Bestaand systeem', desc: 'Migratie van andere shop' },
                        ].map(option => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => updateData({ productSource: option.id })}
                            className={`p-3 rounded-lg border-2 text-left transition ${
                              data.productSource === option.id
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-gray-200 hover:border-emerald-300'
                            }`}
                          >
                            <div className="font-semibold text-sm">{option.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Voorraadbeheer</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Automatisch voorraad bijhouden</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateData({ needsInventoryManagement: !data.needsInventoryManagement })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        data.needsInventoryManagement ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                        data.needsInventoryManagement ? 'left-6' : 'left-0.5'
                      }`} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gemiddelde productprijs (optioneel)
                    </label>
                    <input
                      type="text"
                      value={data.averageProductPrice}
                      onChange={e => updateData({ averageProductPrice: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                      placeholder="€ 50 - € 100"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Betalingen & Verzending */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Betaling & Verzending</h3>
                    <p className="text-gray-500 text-sm">Hoe wil je betalingen en verzendingen afhandelen?</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Betaalmethodes * <span className="text-gray-400 font-normal">(selecteer alle gewenste)</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PAYMENT_METHODS.map(method => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => toggleArrayItem('paymentMethods', method.id)}
                          className={`p-3 rounded-lg border-2 text-left transition ${
                            data.paymentMethods.includes(method.id)
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{method.name}</span>
                            {method.popular && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.paymentMethods && <p className="text-red-500 text-xs mt-1">{errors.paymentMethods}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verzendopties <span className="text-gray-400 font-normal">(optioneel)</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {SHIPPING_OPTIONS.map(option => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => toggleArrayItem('shippingOptions', option.id)}
                          className={`p-2 rounded-lg border text-sm transition ${
                            data.shippingOptions.includes(option.id)
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          {data.shippingOptions.includes(option.id) && <Check className="w-3 h-3 inline mr-1" />}
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verzendzones *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'nl', name: 'Nederland' },
                        { id: 'be', name: 'België' },
                        { id: 'eu', name: 'Europa' },
                        { id: 'worldwide', name: 'Wereldwijd' },
                      ].map(zone => (
                        <button
                          key={zone.id}
                          type="button"
                          onClick={() => toggleArrayItem('shippingZones', zone.id)}
                          className={`p-2 rounded-lg border text-sm transition ${
                            data.shippingZones.includes(zone.id)
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          {data.shippingZones.includes(zone.id) && <Check className="w-3 h-3 inline mr-1" />}
                          {zone.name}
                        </button>
                      ))}
                    </div>
                    {errors.shippingZones && <p className="text-red-500 text-xs mt-1">{errors.shippingZones}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gratis verzending vanaf (optioneel)
                      </label>
                      <input
                        type="text"
                        value={data.freeShippingThreshold}
                        onChange={e => updateData({ freeShippingThreshold: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                        placeholder="€ 50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Retourbeleid
                      </label>
                      <select
                        value={data.returnPolicy}
                        onChange={e => updateData({ returnPolicy: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="14 dagen">14 dagen (wettelijk minimum)</option>
                        <option value="30 dagen">30 dagen</option>
                        <option value="60 dagen">60 dagen</option>
                        <option value="anders">Anders / Geen retour</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Branding */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Branding & Design</h3>
                    <p className="text-gray-500 text-sm">Hoe moet je webshop eruit zien?</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Heb je al een logo?</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Anders kunnen wij er een maken</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateData({ hasLogo: !data.hasLogo })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        data.hasLogo ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                        data.hasLogo ? 'left-6' : 'left-0.5'
                      }`} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Huisstijlkleuren (optioneel)
                    </label>
                    <input
                      type="text"
                      value={data.brandColors}
                      onChange={e => updateData({ brandColors: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                      placeholder="Bijv. Donkerblauw, Goud"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gewenste stijl *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'modern', name: 'Modern', desc: 'Strak, minimalistisch, veel witruimte' },
                        { id: 'classic', name: 'Klassiek', desc: 'Elegant, tijdloos, verfijnd' },
                        { id: 'minimalist', name: 'Minimalistisch', desc: 'Simpel, clean, focus op producten' },
                        { id: 'playful', name: 'Speels', desc: 'Kleurrijk, levendig, creatief' },
                      ].map(style => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => updateData({ designStyle: style.id })}
                          className={`p-4 rounded-lg border-2 text-left transition ${
                            data.designStyle === style.id
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <div className="font-semibold">{style.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{style.desc}</div>
                        </button>
                      ))}
                    </div>
                    {errors.designStyle && <p className="text-red-500 text-xs mt-1">{errors.designStyle}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inspiratie websites (optioneel)
                    </label>
                    <textarea
                      value={data.inspirationUrls}
                      onChange={e => updateData({ inspirationUrls: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                      placeholder="Links naar webshops die je mooi vindt..."
                    />
                  </div>
                </div>
              )}

              {/* Step 6: Extra & Bevestigen */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Extra Features & Bevestigen</h3>
                    <p className="text-gray-500 text-sm">Laatste stap! Kies extra's en bevestig je aanvraag.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Social media links (optioneel)
                    </label>
                    <textarea
                      value={data.socialMedia}
                      onChange={e => updateData({ socialMedia: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                      placeholder="Instagram, Facebook, TikTok links..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marketing integraties <span className="text-gray-400 font-normal">(optioneel)</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {MARKETING_INTEGRATIONS.map(item => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleArrayItem('marketingIntegrations', item)}
                          className={`p-2 rounded-lg border text-xs transition ${
                            data.marketingIntegrations.includes(item)
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          {data.marketingIntegrations.includes(item) && <Check className="w-3 h-3 inline mr-0.5" />}
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extra features <span className="text-gray-400 font-normal">(optioneel)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {ADDITIONAL_FEATURES.map(item => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleArrayItem('additionalFeatures', item)}
                          className={`p-2 rounded-lg border text-sm transition ${
                            data.additionalFeatures.includes(item)
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          {data.additionalFeatures.includes(item) && <Check className="w-3 h-3 inline mr-1" />}
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Overige wensen of opmerkingen
                    </label>
                    <textarea
                      value={data.extraNotes}
                      onChange={e => updateData({ extraNotes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
                      placeholder="Nog iets dat we moeten weten?"
                    />
                  </div>

                  {/* Samenvatting */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                    <h4 className="font-bold text-emerald-900 mb-3">📋 Samenvatting</h4>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-600 dark:text-gray-400">Bedrijf:</span> <span className="font-medium">{data.companyName}</span></div>
                      <div><span className="text-gray-600 dark:text-gray-400">Webshop:</span> <span className="font-medium">{data.shopName}</span></div>
                      <div><span className="text-gray-600 dark:text-gray-400">Producten:</span> <span className="font-medium">{data.expectedProducts}</span></div>
                      <div><span className="text-gray-600 dark:text-gray-400">Stijl:</span> <span className="font-medium">{data.designStyle}</span></div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-white rounded-xl p-4 border-2 border-emerald-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900 dark:text-white">Webshop Pakket</span>
                      <span className="text-2xl font-bold text-emerald-600">€79/maand</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">+ €299 eenmalige opzet kosten</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Volledig werkende webshop</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Mollie betalingen geïntegreerd</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Onbeperkt producten</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Hosting & SSL inbegrepen</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Maandelijks aanpasbaar</li>
                    </ul>
                  </div>

                  {/* Wachtwoord aanmaken */}
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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
                            className={`w-full px-4 py-2.5 pr-10 rounded-lg border ${errors.projectPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500`}
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
                          className={`w-full px-4 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500`}
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
                  <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                    data.agreedToTerms ? 'border-emerald-500 bg-emerald-50' : errors.agreedToTerms ? 'border-red-500' : 'border-gray-200'
                  }`}>
                    <input
                      type="checkbox"
                      checked={data.agreedToTerms}
                      onChange={e => updateData({ agreedToTerms: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">Ik ga akkoord met de </span>
                      <a href="/voorwaarden" target="_blank" className="text-emerald-600 hover:underline">algemene voorwaarden</a>
                      <span className="font-medium text-gray-900 dark:text-white"> en </span>
                      <a href="/privacy" target="_blank" className="text-emerald-600 hover:underline">privacy policy</a>
                    </div>
                  </label>
                  {errors.agreedToTerms && <p className="text-red-500 text-xs">{errors.agreedToTerms}</p>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : prevStep}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            {currentStep === 1 ? 'Annuleren' : 'Vorige'}
          </button>

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
            >
              Volgende
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-green-700 transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verwerken...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Naar betaling
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
