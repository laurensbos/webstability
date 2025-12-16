import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Globe, 
  Building2, 
  Palette, 
  FileText, 
  Layout,
  Target,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Loader2,
  Sparkles,
  Clock,
  Star,
  Image,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MessageSquare,
  ExternalLink,
  Zap,
  BarChart3,
  Search,
  Smartphone,
  Upload,
  Link,
  CheckCircle,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react'

// Types
interface WebsiteOnboardingData {
  // Stap 1: Bedrijfsgegevens
  companyName: string
  contactName: string
  email: string
  phone: string
  address: string
  postalCode: string
  city: string
  kvkNumber: string
  
  // Stap 2: Website Doel & Type
  websiteGoal: string // 'leads' | 'info' | 'portfolio' | 'booking' | 'community'
  targetAudience: string
  uniqueSellingPoints: string
  competitors: string[]
  
  // Stap 3: Structuur & Pagina's
  pages: PageConfig[]
  hasExistingWebsite: boolean
  existingWebsiteUrl: string
  
  // Stap 4: Design & Branding
  hasLogo: boolean
  logoFile: File | null
  logoUrl: string
  logoDescription: string
  brandColors: string
  designStyle: string // 'modern' | 'classic' | 'minimalist' | 'bold' | 'playful'
  inspirationUrls: string
  fontPreference: string
  
  // Stap 5: Content & Media
  hasContent: boolean
  contentNotes: string
  hasPhotos: boolean
  photoFiles: File[]
  photoUrl: string // WeTransfer/Google Drive link
  photoNotes: string
  needsPhotography: boolean
  needsCopywriting: boolean
  
  // Stap 6: Functionaliteiten & Extra
  features: string[]
  wantsContactForm: boolean
  contactFormFields: string[]
  wantsSocialMedia: boolean
  socialMediaLinks: string
  wantsAnalytics: boolean
  wantsSEO: boolean
  additionalNotes: string
  
  // Pakket info & Account
  selectedPackage: 'starter' | 'professional' | 'business'
  projectPassword: string // Wachtwoord voor project status toegang
  confirmPassword: string // Bevestiging wachtwoord
  agreedToTerms: boolean
}

interface PageConfig {
  name: string
  description: string
  sections: string[]
}

const INITIAL_DATA: WebsiteOnboardingData = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  address: '',
  postalCode: '',
  city: '',
  kvkNumber: '',
  
  websiteGoal: '',
  targetAudience: '',
  uniqueSellingPoints: '',
  competitors: [],
  
  pages: [
    { name: 'Home', description: '', sections: ['hero', 'about', 'services', 'cta'] },
    { name: 'Over ons', description: '', sections: ['story', 'team', 'values'] },
    { name: 'Contact', description: '', sections: ['form', 'map', 'info'] },
  ],
  hasExistingWebsite: false,
  existingWebsiteUrl: '',
  
  hasLogo: false,
  logoFile: null,
  logoUrl: '',
  logoDescription: '',
  brandColors: '',
  designStyle: 'modern',
  inspirationUrls: '',
  fontPreference: '',
  
  hasContent: false,
  contentNotes: '',
  hasPhotos: false,
  photoFiles: [],
  photoUrl: '',
  photoNotes: '',
  needsPhotography: false,
  needsCopywriting: false,
  
  features: [],
  wantsContactForm: true,
  contactFormFields: ['naam', 'email', 'bericht'],
  wantsSocialMedia: true,
  socialMediaLinks: '',
  wantsAnalytics: true,
  wantsSEO: true,
  additionalNotes: '',
  
  selectedPackage: 'professional',
  projectPassword: '',
  confirmPassword: '',
  agreedToTerms: false
}

const STEPS = [
  { id: 1, title: 'Kies pakket', icon: Star, color: 'from-green-500 to-emerald-600' },
  { id: 2, title: 'Bedrijfsgegevens', icon: Building2, color: 'from-blue-500 to-primary-600' },
  { id: 3, title: 'Doel & Doelgroep', icon: Target, color: 'from-blue-500 to-primary-600' },
  { id: 4, title: 'Pagina\'s', icon: Layout, color: 'from-blue-500 to-primary-600' },
  { id: 5, title: 'Design & Branding', icon: Palette, color: 'from-purple-500 to-violet-600' },
  { id: 6, title: 'Content & Media', icon: Image, color: 'from-amber-500 to-orange-600' },
  { id: 7, title: 'Bevestigen', icon: Sparkles, color: 'from-cyan-500 to-teal-600' },
]

const WEBSITE_GOALS = [
  { id: 'leads', name: 'Leads genereren', description: 'Bezoekers omzetten naar klanten', icon: Target },
  { id: 'info', name: 'Informeren', description: 'Bedrijfsinformatie delen', icon: FileText },
  { id: 'portfolio', name: 'Portfolio tonen', description: 'Werk en projecten presenteren', icon: Image },
  { id: 'booking', name: 'Afspraken maken', description: 'Online reserveringen', icon: Calendar },
  { id: 'brand', name: 'Merk bouwen', description: 'Professionaliteit uitstralen', icon: Star },
]

const DESIGN_STYLES = [
  { id: 'modern', name: 'Modern & Minimalistisch', description: 'Strak, veel witruimte, clean' },
  { id: 'bold', name: 'Bold & Opvallend', description: 'Felle kleuren, grote typografie' },
  { id: 'classic', name: 'Klassiek & Professioneel', description: 'Tijdloos, betrouwbaar' },
  { id: 'playful', name: 'Speels & Creatief', description: 'Illustraties, unieke vormen' },
  { id: 'luxury', name: 'Luxe & Premium', description: 'Elegant, donkere tinten' },
]

// Preset kleuren voor huisstijl
const BRAND_COLORS = [
  { id: 'blue', name: 'Blauw', color: '#1E40AF', preview: 'bg-blue-700' },
  { id: 'green', name: 'Groen', color: '#059669', preview: 'bg-emerald-600' },
  { id: 'red', name: 'Rood', color: '#DC2626', preview: 'bg-red-600' },
  { id: 'purple', name: 'Paars', color: '#7C3AED', preview: 'bg-purple-600' },
  { id: 'orange', name: 'Oranje', color: '#EA580C', preview: 'bg-orange-600' },
  { id: 'teal', name: 'Teal', color: '#0D9488', preview: 'bg-teal-600' },
  { id: 'pink', name: 'Roze', color: '#DB2777', preview: 'bg-pink-600' },
  { id: 'gray', name: 'Grijs', color: '#4B5563', preview: 'bg-gray-600' },
  { id: 'black', name: 'Zwart', color: '#111827', preview: 'bg-gray-900' },
  { id: 'custom', name: 'Eigen kleur', color: '', preview: 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500' },
]

const DEFAULT_PAGES = [
  { name: 'Home', description: 'De hoofdpagina met eerste indruk', icon: Globe },
  { name: 'Over ons', description: 'Verhaal achter het bedrijf', icon: Users },
  { name: 'Diensten', description: 'Wat je aanbiedt', icon: Zap },
  { name: 'Portfolio', description: 'Voorbeelden van je werk', icon: Image },
  { name: 'Blog', description: 'Nieuws en artikelen', icon: FileText },
  { name: 'Contact', description: 'Contactgegevens en formulier', icon: Phone },
  { name: 'Prijzen', description: 'Tarieven en pakketten', icon: BarChart3 },
  { name: 'FAQ', description: 'Veelgestelde vragen', icon: MessageSquare },
  { name: 'Team', description: 'Je teamleden', icon: Users },
  { name: 'Referenties', description: 'Klantbeoordelingen', icon: Star },
]

const FEATURES = [
  { id: 'contactform', name: 'Contactformulier', description: 'Bezoekers kunnen je bereiken', icon: Mail },
  { id: 'analytics', name: 'Google Analytics', description: 'Bezoekersstatistieken', icon: BarChart3 },
  { id: 'seo', name: 'SEO Optimalisatie', description: 'Beter vindbaar in Google', icon: Search },
  { id: 'social', name: 'Social Media Links', description: 'Koppelingen naar je socials', icon: ExternalLink },
  { id: 'maps', name: 'Google Maps', description: 'Locatie op de kaart', icon: MapPin },
  { id: 'whatsapp', name: 'WhatsApp Button', description: 'Direct contact via WhatsApp', icon: MessageSquare },
  { id: 'booking', name: 'Afspraak Planner', description: 'Online afspraken maken', icon: Calendar },
  { id: 'newsletter', name: 'Nieuwsbrief', description: 'E-mail inschrijvingen', icon: Mail },
  { id: 'mobile', name: 'Mobiel Geoptimaliseerd', description: 'Perfect op alle apparaten', icon: Smartphone },
  { id: 'ssl', name: 'SSL Certificaat', description: 'Veilige verbinding (https)', icon: Check },
]

// Package pricing met maxPages en features per pakket
const PACKAGES = {
  starter: { 
    name: 'Starter', 
    price: 96, 
    priceExcl: 79, 
    setupFee: 120, 
    setupFeeExcl: 99,
    maxPages: 5,
    features: ['contactform', 'maps', 'mobile', 'ssl', 'seo']
  },
  professional: { 
    name: 'Professioneel', 
    price: 180, 
    priceExcl: 149, 
    setupFee: 180, 
    setupFeeExcl: 149,
    maxPages: 10,
    features: ['contactform', 'maps', 'mobile', 'ssl', 'seo', 'analytics', 'social', 'whatsapp']
  },
  business: { 
    name: 'Business', 
    price: 301, 
    priceExcl: 249, 
    setupFee: 241, 
    setupFeeExcl: 199,
    maxPages: 20,
    features: ['contactform', 'maps', 'mobile', 'ssl', 'seo', 'analytics', 'social', 'whatsapp', 'booking', 'newsletter']
  },
}

interface WebsiteOnboardingProps {
  onComplete?: (data: WebsiteOnboardingData, projectId: string) => void
  onClose?: () => void
  isStandalone?: boolean
  isFullPage?: boolean
  initialPackage?: 'starter' | 'professional' | 'business'
}

export default function WebsiteOnboarding({ 
  onComplete, 
  onClose, 
  isStandalone = false,
  isFullPage = false,
  initialPackage = 'professional'
}: WebsiteOnboardingProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<WebsiteOnboardingData>({
    ...INITIAL_DATA,
    selectedPackage: initialPackage
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [newCompetitor, setNewCompetitor] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void isStandalone // Keep for backwards compatibility
  const updateData = (updates: Partial<WebsiteOnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }))
    // Clear errors for updated fields
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
        // Pakketkeuze - geen validatie nodig, altijd een default
        break
      case 2:
        if (!data.companyName.trim()) newErrors.companyName = 'Bedrijfsnaam is verplicht'
        if (!data.contactName.trim()) newErrors.contactName = 'Contactpersoon is verplicht'
        if (!data.email.trim()) newErrors.email = 'E-mail is verplicht'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = 'Ongeldig e-mailadres'
        if (!data.phone.trim()) newErrors.phone = 'Telefoonnummer is verplicht'
        break
      case 3:
        if (!data.websiteGoal) newErrors.websiteGoal = 'Kies een doel voor je website'
        if (!data.targetAudience.trim()) newErrors.targetAudience = 'Beschrijf je doelgroep'
        break
      case 4:
        if (data.pages.length === 0) newErrors.pages = 'Selecteer minimaal 1 pagina'
        break
      case 5:
        if (!data.designStyle) newErrors.designStyle = 'Kies een design stijl'
        break
      case 7:
        // Wachtwoord validatie
        if (!data.projectPassword.trim()) newErrors.projectPassword = 'Kies een wachtwoord voor je project dashboard'
        else if (data.projectPassword.length < 6) newErrors.projectPassword = 'Wachtwoord moet minimaal 6 tekens zijn'
        if (!data.confirmPassword.trim()) newErrors.confirmPassword = 'Bevestig je wachtwoord'
        else if (data.projectPassword !== data.confirmPassword) newErrors.confirmPassword = 'Wachtwoorden komen niet overeen'
        // Akkoord validatie
        if (!data.agreedToTerms) newErrors.agreedToTerms = 'Je moet akkoord gaan met de voorwaarden'
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

  const handleSubmit = async () => {
    if (!validateStep()) return
    
    setSubmitting(true)
    
    try {
      // Generate project ID
      const newProjectId = `WS-${Date.now().toString(36).toUpperCase()}`
      
      // Upload logo if provided
      let logoUploadUrl = data.logoUrl
      if (data.logoFile) {
        const formData = new FormData()
        formData.append('file', data.logoFile)
        formData.append('projectId', newProjectId)
        formData.append('type', 'logo')
        
        try {
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          })
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json()
            logoUploadUrl = uploadData.url || `Bestand geüpload: ${data.logoFile.name}`
          }
        } catch (e) {
          // Upload failed, use description instead
          logoUploadUrl = `Logo bestand: ${data.logoFile.name} (upload later via developer link)`
        }
      }

      // Upload photos if provided
      let photoUploadUrls: string[] = []
      if (data.photoFiles.length > 0) {
        for (const file of data.photoFiles) {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('projectId', newProjectId)
          formData.append('type', 'photo')
          
          try {
            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              body: formData
            })
            if (uploadRes.ok) {
              const uploadData = await uploadRes.json()
              photoUploadUrls.push(uploadData.url || file.name)
            }
          } catch (e) {
            photoUploadUrls.push(`${file.name} (upload later via developer link)`)
          }
        }
      }

      // Prepare complete project data
      const completeData = {
        ...data,
        logoUrl: logoUploadUrl,
        photoUrls: photoUploadUrls.length > 0 ? photoUploadUrls : (data.photoUrl ? [data.photoUrl] : [])
      }
      
      // Calculate pricing
      const selectedPkg = PACKAGES[data.selectedPackage]
      const monthlyPrice = selectedPkg.price
      const setupFee = selectedPkg.setupFee
      const totalFirstPayment = monthlyPrice + setupFee
      
      // Try to save to API
      const response = await fetch(`/api/project/${newProjectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: newProjectId,
          type: 'website',
          packageType: data.selectedPackage,
          password: data.projectPassword, // Store password for project access
          businessName: data.companyName,
          contactName: data.contactName,
          contactEmail: data.email,
          contactPhone: data.phone,
          customer: {
            name: data.contactName,
            email: data.email,
            phone: data.phone,
            companyName: data.companyName,
            address: {
              street: data.address,
              postalCode: data.postalCode,
              city: data.city
            },
            kvk: data.kvkNumber
          },
          onboardingData: completeData,
          status: 'onboarding',
          paymentStatus: 'not_required', // Betaling pas na design goedkeuring
          pricing: {
            monthly: monthlyPrice,
            setup: setupFee,
            total: totalFirstPayment
          },
          createdAt: new Date().toISOString()
        })
      })

      // Generate developer upload links
      const devUploadLinks = {
        logo: `${window.location.origin}/developer/upload/${newProjectId}/logo`,
        photos: `${window.location.origin}/developer/upload/${newProjectId}/photos`,
        files: `${window.location.origin}/developer/upload/${newProjectId}/files`
      }

      // Always save to localStorage as backup
      const projectData = {
        projectId: newProjectId,
        businessName: data.companyName,
        package: 'website',
        packageTier: data.selectedPackage,
        phase: 'onboarding',
        client: {
          name: data.contactName,
          email: data.email,
          phone: data.phone,
          company: data.companyName
        },
        onboardingData: completeData,
        devUploadLinks,
        pricing: {
          monthly: monthlyPrice,
          setup: setupFee,
          total: totalFirstPayment
        },
        createdAt: new Date().toISOString()
      }

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
            companyName: data.companyName,
            packageType: 'website',
            packageTier: data.selectedPackage,
            pricing: {
              monthly: monthlyPrice,
              setup: setupFee
            },
            devUploadLinks,
            summary: {
              goal: data.websiteGoal,
              pages: data.pages.map(p => p.name).join(', '),
              designStyle: data.designStyle,
              hasLogo: data.hasLogo,
              hasContent: data.hasContent,
              hasPhotos: data.hasPhotos,
              needsCopywriting: data.needsCopywriting,
              needsPhotography: data.needsPhotography
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
            companyName: data.companyName,
            projectId: newProjectId,
            packageName: selectedPkg.name,
            monthlyPrice,
            setupFee,
            uploadLinks: devUploadLinks
          })
        })
      } catch (e) {
        console.log('Confirmation email failed')
      }

      if (response.ok || true) { // Continue even if API fails
        if (onComplete) {
          onComplete(completeData, newProjectId)
        } else {
          // Always navigate to status page
          navigate(`/status/${newProjectId}`)
        }
      }
    } catch (error) {
      console.error('Submit error:', error)
      // Fallback - create project ID anyway
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

  const addPage = (pageName: string) => {
    const maxPages = selectedPackage.maxPages
    if (!data.pages.find(p => p.name === pageName) && data.pages.length < maxPages) {
      updateData({ 
        pages: [...data.pages, { name: pageName, description: '', sections: [] }] 
      })
    }
  }

  const removePage = (pageName: string) => {
    updateData({ 
      pages: data.pages.filter(p => p.name !== pageName) 
    })
  }

  const addCompetitor = () => {
    if (newCompetitor.trim() && !data.competitors.includes(newCompetitor.trim())) {
      updateData({ competitors: [...data.competitors, newCompetitor.trim()] })
      setNewCompetitor('')
    }
  }

  const progress = (currentStep / STEPS.length) * 100
  const selectedPackage = PACKAGES[data.selectedPackage]

  // Full page wrapper for non-modal mode
  const Wrapper = isFullPage ? ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {children}
      </div>
    </div>
  ) : ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-16 sm:pt-8 pb-4 sm:pb-8 px-2 sm:px-4 overflow-y-auto"
    >
      {children}
    </motion.div>
  )

  return (
    <Wrapper>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className={`bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col ${isFullPage ? '' : 'max-h-[90vh] my-auto'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-600 p-4 sm:p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white dark:bg-gray-900 transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white dark:bg-gray-900 transform -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center"
                >
                  <Globe className="w-6 h-6" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold">Website Aanvraag</h2>
                  <p className="text-white/80 text-sm">Start jouw professionele website</p>
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
                className="h-full bg-white dark:bg-gray-900 rounded-full"
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
                      isActive ? 'bg-white dark:bg-gray-900 text-primary-600 shadow-lg' : isComplete ? 'bg-white/30' : 'bg-white/10'
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
              {/* Step 1: Pakket kiezen */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Kies je pakket</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Selecteer het pakket dat het beste bij jouw wensen past</p>
                  </div>

                  {/* Package cards - horizontal scroll on mobile, 3 columns on desktop */}
                  <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible">
                    {(Object.entries(PACKAGES) as [string, typeof PACKAGES.starter][]).map(([key, pkg]) => {
                      const isSelected = data.selectedPackage === key
                      const isPopular = key === 'professional'
                      
                      // Feature names for display
                      const featureNames: Record<string, string> = {
                        contactform: 'Contactformulier',
                        maps: 'Google Maps',
                        mobile: 'Mobiel Geoptimaliseerd',
                        ssl: 'SSL Certificaat',
                        seo: 'SEO Optimalisatie',
                        analytics: 'Google Analytics',
                        social: 'Social Media',
                        whatsapp: 'WhatsApp Integratie',
                        booking: 'Boekingssysteem',
                        newsletter: 'Nieuwsbrief'
                      }
                      
                      return (
                        <motion.button
                          key={key}
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateData({ selectedPackage: key as 'starter' | 'professional' | 'business' })}
                          className={`relative flex-shrink-0 w-[280px] sm:w-full snap-center text-left bg-white dark:bg-gray-800 rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg ${
                            isSelected 
                              ? 'border-primary-500 shadow-lg shadow-primary-100 dark:shadow-primary-900/30' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {/* Popular badge */}
                          {isPopular && (
                            <div className="absolute top-3 right-3 z-10">
                              <span className="bg-gradient-to-r from-primary-500 to-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                                Meest gekozen
                              </span>
                            </div>
                          )}
                          
                          {/* Colored header */}
                          <div className={`bg-gradient-to-br ${isSelected ? 'from-primary-500 to-blue-600' : 'from-gray-600 to-gray-700'} p-4 flex items-center justify-between`}>
                            <div className="text-white">
                              <h4 className="font-bold text-lg">{pkg.name}</h4>
                              <p className="text-white/80 text-sm">max. {pkg.maxPages} pagina's</p>
                            </div>
                            <div className="text-right text-white">
                              <div className="text-2xl font-bold">€{pkg.price}</div>
                              <div className="text-white/80 text-xs">per maand</div>
                              <div className="text-white/60 text-xs">+ €{pkg.setupFee} eenmalig</div>
                            </div>
                          </div>
                          
                          {/* Features */}
                          <div className="p-4">
                            <div className="space-y-2 mb-3">
                              {pkg.features.slice(0, 5).map(featureId => (
                                <div key={featureId} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  <span>{featureNames[featureId] || featureId}</span>
                                </div>
                              ))}
                              {pkg.features.length > 5 && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 pl-6">+ {pkg.features.length - 5} meer functies</p>
                              )}
                            </div>
                            
                            {/* Description */}
                            <p className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
                              {key === 'starter' && 'Perfect voor starters en kleine bedrijven'}
                              {key === 'professional' && 'Ideaal voor groeiende ondernemers'}
                              {key === 'business' && 'Voor bedrijven die meer willen'}
                            </p>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                  
                  {/* Swipe hint - mobile only */}
                  <p className="text-center text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                    ← Swipe voor meer pakketten →
                  </p>

                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-4 rounded-xl">
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      <strong>💡 Geen zorgen:</strong> Je kunt later altijd upgraden naar een groter pakket. Je betaalt pas na goedkeuring van het ontwerp.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Bedrijfsgegevens */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Bedrijfsgegevens</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Vertel ons over je bedrijf</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bedrijfsnaam *
                      </label>
                      <input
                        type="text"
                        value={data.companyName}
                        onChange={e => updateData({ companyName: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.companyName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                        placeholder="Bijv. Jansen & Zn"
                      />
                      {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contactpersoon *
                      </label>
                      <input
                        type="text"
                        value={data.contactName}
                        onChange={e => updateData({ contactName: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.contactName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                        placeholder="Jan Jansen"
                      />
                      {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        E-mailadres *
                      </label>
                      <input
                        type="email"
                        value={data.email}
                        onChange={e => updateData({ email: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                        placeholder="info@uwbedrijf.nl"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Telefoonnummer *
                      </label>
                      <input
                        type="tel"
                        value={data.phone}
                        onChange={e => updateData({ phone: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                        placeholder="06-12345678"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Adres
                      </label>
                      <input
                        type="text"
                        value={data.address}
                        onChange={e => updateData({ address: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        placeholder="Straatnaam 123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Postcode
                      </label>
                      <input
                        type="text"
                        value={data.postalCode}
                        onChange={e => updateData({ postalCode: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        placeholder="1234 AB"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Plaats
                      </label>
                      <input
                        type="text"
                        value={data.city}
                        onChange={e => updateData({ city: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        placeholder="Amsterdam"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        KvK-nummer
                      </label>
                      <input
                        type="text"
                        value={data.kvkNumber}
                        onChange={e => updateData({ kvkNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        placeholder="12345678"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Doel & Doelgroep */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Doel & Doelgroep</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Wat wil je bereiken met je website?</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Hoofddoel van de website *
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {WEBSITE_GOALS.map(goal => {
                        const isSelected = data.websiteGoal === goal.id
                        const Icon = goal.icon
                        return (
                          <motion.button
                            key={goal.id}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateData({ websiteGoal: goal.id })}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              isSelected 
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' 
                                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isSelected ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className={`font-medium ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'}`}>
                                  {goal.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{goal.description}</p>
                              </div>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                    {errors.websiteGoal && <p className="text-red-500 text-xs mt-2">{errors.websiteGoal}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Beschrijf je doelgroep *
                    </label>
                    <textarea
                      value={data.targetAudience}
                      onChange={e => updateData({ targetAudience: e.target.value })}
                      rows={3}
                      className={`w-full px-4 py-2.5 rounded-lg border ${errors.targetAudience ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                      placeholder="Bijv. Ondernemers tussen 30-50 jaar in de regio Amsterdam die op zoek zijn naar..."
                    />
                    {errors.targetAudience && <p className="text-red-500 text-xs mt-1">{errors.targetAudience}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Wat maakt je uniek? (USPs)
                    </label>
                    <textarea
                      value={data.uniqueSellingPoints}
                      onChange={e => updateData({ uniqueSellingPoints: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      placeholder="Bijv. 20 jaar ervaring, persoonlijke aanpak, snelle levering, gratis advies..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Concurrenten / Inspiratie websites
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newCompetitor}
                        onChange={e => setNewCompetitor(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addCompetitor())}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        placeholder="www.voorbeeld.nl"
                      />
                      <button
                        type="button"
                        onClick={addCompetitor}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Toevoegen
                      </button>
                    </div>
                    {data.competitors.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {data.competitors.map((comp, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                            {comp}
                            <button
                              type="button"
                              onClick={() => updateData({ competitors: data.competitors.filter((_, i) => i !== idx) })}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Pagina's */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Pagina's & Structuur</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Welke pagina's wil je op je website?</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Geselecteerd:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      data.pages.length > 0 ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {data.pages.length} / {selectedPackage.maxPages} pagina's
                    </span>
                    {data.pages.length >= selectedPackage.maxPages && (
                      <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                        Maximum bereikt voor {selectedPackage.name}
                      </span>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {DEFAULT_PAGES.map(page => {
                      const isSelected = data.pages.some(p => p.name === page.name)
                      const isDisabled = !isSelected && data.pages.length >= selectedPackage.maxPages
                      const Icon = page.icon
                      return (
                        <motion.button
                          key={page.name}
                          type="button"
                          whileHover={!isDisabled ? { scale: 1.02 } : {}}
                          whileTap={!isDisabled ? { scale: 0.98 } : {}}
                          onClick={() => !isDisabled && (isSelected ? removePage(page.name) : addPage(page.name))}
                          disabled={isDisabled}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            isSelected 
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' 
                              : isDisabled
                                ? 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 opacity-50 cursor-not-allowed'
                                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'}`}>
                                {page.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{page.description}</p>
                            </div>
                            {isSelected && (
                              <Check className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            )}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                  {errors.pages && <p className="text-red-500 text-xs mt-2">{errors.pages}</p>}

                  <div className="pt-4 border-t dark:border-gray-700">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.hasExistingWebsite}
                        onChange={e => updateData({ hasExistingWebsite: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">Ik heb al een bestaande website</span>
                    </label>
                    {data.hasExistingWebsite && (
                      <input
                        type="text"
                        value={data.existingWebsiteUrl}
                        onChange={e => updateData({ existingWebsiteUrl: e.target.value })}
                        className="mt-3 w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        placeholder="www.jouwwebsite.nl"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Design & Branding */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Design & Branding</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Hoe moet je website eruit zien?</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Design stijl *
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {DESIGN_STYLES.map(style => {
                        const isSelected = data.designStyle === style.id
                        return (
                          <motion.button
                            key={style.id}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateData({ designStyle: style.id })}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              isSelected 
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' 
                                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                                <Palette className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                              </div>
                              <div>
                                <p className={`font-medium ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'}`}>
                                  {style.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{style.description}</p>
                              </div>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                    {errors.designStyle && <p className="text-red-500 text-xs mt-2">{errors.designStyle}</p>}
                  </div>

                  {/* Kleuren kiezen */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Gewenste kleuren *
                    </label>
                    <div className="grid grid-cols-5 gap-2 mb-3">
                      {BRAND_COLORS.map((brandColor) => {
                        const isSelected = data.brandColors === brandColor.color || 
                          (brandColor.id === 'custom' && data.brandColors && !BRAND_COLORS.slice(0, -1).some(c => c.color === data.brandColors))
                        return (
                          <button
                            key={brandColor.id}
                            type="button"
                            onClick={() => {
                              if (brandColor.id === 'custom') {
                                updateData({ brandColors: '' })
                              } else {
                                updateData({ brandColors: brandColor.color })
                              }
                            }}
                            className={`relative aspect-square rounded-xl border-2 transition-all ${brandColor.preview} ${
                              isSelected 
                                ? 'border-primary-500 ring-2 ring-primary-200 scale-110' 
                                : 'border-transparent hover:scale-105'
                            }`}
                            title={brandColor.name}
                          >
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Check className="w-5 h-5 text-white drop-shadow-md" />
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                    {(data.brandColors === '' || !BRAND_COLORS.slice(0, -1).some(c => c.color === data.brandColors)) && (
                      <input
                        type="text"
                        value={data.brandColors}
                        onChange={e => updateData({ brandColors: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        placeholder="Vul je eigen kleurcode in (bijv. #1E40AF) of beschrijf je kleuren"
                      />
                    )}
                    {errors.brandColors && <p className="text-red-500 text-xs mt-2">{errors.brandColors}</p>}
                  </div>

                  <div>
                    <label className="flex items-center gap-3 mb-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.hasLogo}
                        onChange={e => updateData({ hasLogo: e.target.checked, logoFile: null, logoUrl: '' })}
                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Ik heb al een logo</span>
                    </label>
                    
                    {data.hasLogo && (
                      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Upload je logo of geef een link:</p>
                        
                        {/* File upload */}
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-primary-400 dark:hover:border-primary-500 transition-colors">
                          <input
                            type="file"
                            accept="image/*,.svg,.ai,.eps,.pdf"
                            onChange={e => {
                              const file = e.target.files?.[0]
                              if (file) {
                                updateData({ logoFile: file, logoUrl: '' })
                              }
                            }}
                            className="hidden"
                            id="logo-upload"
                          />
                          <label htmlFor="logo-upload" className="cursor-pointer">
                            {data.logoFile ? (
                              <div className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">{data.logoFile.name}</span>
                                <button 
                                  type="button"
                                  onClick={(e) => { e.preventDefault(); updateData({ logoFile: null }) }}
                                  className="ml-2 text-gray-400 hover:text-red-500"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="text-gray-500 dark:text-gray-400">
                                <Upload className="w-8 h-8 mx-auto mb-2" />
                                <p className="font-medium">Klik om logo te uploaden</p>
                                <p className="text-xs">PNG, JPG, SVG, AI, EPS of PDF</p>
                              </div>
                            )}
                          </label>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
                          <span className="text-xs text-gray-400">of</span>
                          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
                        </div>

                        {/* URL input */}
                        <div>
                          <div className="flex items-center gap-2">
                            <Link className="w-4 h-4 text-gray-400" />
                            <input
                              type="url"
                              value={data.logoUrl}
                              onChange={e => updateData({ logoUrl: e.target.value, logoFile: null })}
                              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                              placeholder="Link naar je logo (Google Drive, Dropbox, etc.)"
                            />
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Je kunt ook later uploaden via de developer link die je ontvangt
                        </p>
                      </div>
                    )}
                    
                    {!data.hasLogo && (
                      <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg">
                        💡 Geen logo? Wij kunnen er eentje voor je ontwerpen! (+€150)
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Inspiratie websites
                    </label>
                    <textarea
                      value={data.inspirationUrls}
                      onChange={e => updateData({ inspirationUrls: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      placeholder="Links naar websites die je mooi vindt..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Lettertype voorkeur
                    </label>
                    <input
                      type="text"
                      value={data.fontPreference}
                      onChange={e => updateData({ fontPreference: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      placeholder="Bijv. Modern en strak, of speels, of 'laat ik aan jullie over'"
                    />
                  </div>
                </div>
              )}

              {/* Step 6: Content & Media */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Content & Media</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Wat heb je al en wat heb je nodig?</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border dark:border-gray-700 rounded-xl">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.hasContent}
                          onChange={e => updateData({ hasContent: e.target.checked })}
                          className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">Ik heb teksten voor de website</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Over ons, diensten, etc.</p>
                        </div>
                      </label>
                      {data.hasContent && (
                        <textarea
                          value={data.contentNotes}
                          onChange={e => updateData({ contentNotes: e.target.value })}
                          rows={2}
                          className="mt-3 w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                          placeholder="Hoe lever je de teksten aan? (Word doc, email, etc.)"
                        />
                      )}
                      {!data.hasContent && (
                        <p className="mt-3 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                          💡 Geen teksten? Geen probleem! Wij kunnen helpen met het schrijven van de content.
                        </p>
                      )}
                    </div>

                    <div className="p-4 border dark:border-gray-700 rounded-xl">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.hasPhotos}
                          onChange={e => updateData({ hasPhotos: e.target.checked, photoFiles: [], photoUrl: '' })}
                          className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">Ik heb foto's voor de website</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Productfoto's, teamfoto's, etc.</p>
                        </div>
                      </label>
                      {data.hasPhotos && (
                        <div className="mt-4 space-y-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Upload je foto's of geef een link:</p>
                          
                          {/* File upload */}
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-primary-400 dark:hover:border-primary-500 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={e => {
                                const files = Array.from(e.target.files || [])
                                if (files.length > 0) {
                                  updateData({ photoFiles: [...data.photoFiles, ...files], photoUrl: '' })
                                }
                              }}
                              className="hidden"
                              id="photo-upload"
                            />
                            <label htmlFor="photo-upload" className="cursor-pointer">
                              <div className="text-gray-500 dark:text-gray-400">
                                <Upload className="w-8 h-8 mx-auto mb-2" />
                                <p className="font-medium">Klik om foto's te uploaden</p>
                                <p className="text-xs">Je kunt meerdere bestanden selecteren</p>
                              </div>
                            </label>
                          </div>

                          {/* Show uploaded files */}
                          {data.photoFiles.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{data.photoFiles.length} foto('s) geselecteerd:</p>
                              <div className="max-h-32 overflow-y-auto space-y-1">
                                {data.photoFiles.map((file, idx) => (
                                  <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg text-sm">
                                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 truncate">
                                      <CheckCircle className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                                      {file.name}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newFiles = data.photoFiles.filter((_, i) => i !== idx)
                                        updateData({ photoFiles: newFiles })
                                      }}
                                      className="text-gray-400 hover:text-red-500"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
                            <span className="text-xs text-gray-400">of</span>
                            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
                          </div>

                          {/* URL input */}
                          <div>
                            <div className="flex items-center gap-2">
                              <Link className="w-4 h-4 text-gray-400" />
                              <input
                                type="url"
                                value={data.photoUrl}
                                onChange={e => updateData({ photoUrl: e.target.value, photoFiles: [] })}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                placeholder="Link naar je foto's (WeTransfer, Google Drive, etc.)"
                              />
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Je kunt ook later uploaden via de developer link die je ontvangt
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      <strong>💡 Tip:</strong> Geen foto's? We gebruiken professionele stockfoto's die perfect bij jouw branche passen. Je kunt later altijd eigen foto's toevoegen.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 7: Account & Bevestigen */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  {/* Wachtwoord aanmaken */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-primary-50 dark:from-blue-900/30 dark:to-primary-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
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
                            className={`w-full px-4 py-2.5 pr-10 rounded-lg border ${errors.projectPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                            placeholder="Min. 8 tekens"
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
                          className={`w-full px-4 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500`}
                          placeholder="Herhaal wachtwoord"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Met dit wachtwoord kun je de voortgang van je project volgen op de statuspagina.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Functionaliteiten</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Deze functies zijn inbegrepen bij je {selectedPackage.name} pakket
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {FEATURES.map(feature => {
                      const isIncluded = selectedPackage.features.includes(feature.id)
                      const Icon = feature.icon
                      
                      if (!isIncluded) return null
                      
                      return (
                        <div
                          key={feature.id}
                          className="p-3 rounded-xl border-2 border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-primary-700 dark:text-primary-300">
                                {feature.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{feature.description}</p>
                            </div>
                            <Check className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {data.selectedPackage !== 'business' && (
                    <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 p-4 rounded-xl">
                      <p className="text-amber-800 dark:text-amber-200 text-sm">
                        <strong>💡 Tip:</strong> Upgrade naar een hoger pakket voor meer functionaliteiten zoals{' '}
                        {data.selectedPackage === 'starter' ? 'Google Analytics, WhatsApp button en meer.' : 'afspraakplanner en nieuwsbrief.'}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Social media links
                    </label>
                    <textarea
                      value={data.socialMediaLinks}
                      onChange={e => updateData({ socialMediaLinks: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      placeholder="Facebook, Instagram, LinkedIn URLs..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Overige wensen of opmerkingen
                    </label>
                    <textarea
                      value={data.additionalNotes}
                      onChange={e => updateData({ additionalNotes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      placeholder="Is er nog iets dat je wilt toevoegen?"
                    />
                  </div>

                  {/* Samenvatting */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 rounded-xl border border-primary-200 dark:border-primary-800">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      Jouw website pakket
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Pakket:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedPackage.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Per maand:</span>
                        <span className="ml-2 font-bold text-primary-600 dark:text-primary-400">€{selectedPackage.price}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">(incl. btw)</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Eenmalig:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">€{selectedPackage.setupFee}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">(incl. btw)</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Pagina's:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">{data.pages.length}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-primary-200 dark:border-primary-700">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Levertijd: 5-10 werkdagen na goedkeuring ontwerp</span>
                      </div>
                    </div>
                  </div>

                  {/* Akkoord */}
                  <div className={`p-4 rounded-xl border-2 ${errors.agreedToTerms ? 'border-red-500 bg-red-50 dark:bg-red-900/30' : 'border-gray-200 dark:border-gray-700'}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.agreedToTerms}
                        onChange={e => updateData({ agreedToTerms: e.target.checked })}
                        className="w-5 h-5 mt-0.5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Ik ga akkoord met de{' '}
                        <a href="/voorwaarden" target="_blank" className="text-primary-600 dark:text-primary-400 hover:underline">
                          algemene voorwaarden
                        </a>{' '}
                        en geef toestemming om mijn gegevens te verwerken voor dit project.
                      </span>
                    </label>
                    {errors.agreedToTerms && <p className="text-red-500 text-xs mt-2">{errors.agreedToTerms}</p>}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t dark:border-gray-700 p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
          <button
            type="button"
            onClick={currentStep === 1 ? (onClose ? onClose : () => navigate(-1)) : prevStep}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
            {currentStep === 1 ? 'Annuleren' : 'Vorige'}
          </button>

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
            >
              Volgende
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-lg font-medium hover:from-primary-700 hover:to-blue-700 transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verwerken...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Aanvraag versturen
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </Wrapper>
  )
}
