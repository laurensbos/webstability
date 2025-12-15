import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Globe, 
  Palette, 
  Building2, 
  FileText,
  Sparkles,
  Rocket,
  ShoppingBag,
  Briefcase,
  Camera,
  Utensils,
  Wrench,
  Heart,
  GraduationCap,
  Home,
  Car,
  Scissors,
  Dumbbell,
  Music,
  X,
  Upload,
  Link,
  Loader2,
  AlertCircle,
  PenTool,
  BarChart3,
  Calendar,
  Languages,
  Mail,
  Users,
  Lock
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

// Floating particles for visual appeal - accepts serviceType for dynamic colors
function FloatingParticles({ serviceType }: { serviceType: ServiceType }) {
  const getParticleColors = () => {
    switch (serviceType) {
      case 'drone':
        return [
          'from-orange-400 to-amber-500',
          'from-amber-400 to-orange-500',
          'from-yellow-400 to-orange-500',
          'from-orange-300 to-amber-400',
        ]
      case 'logo':
        return [
          'from-purple-400 to-violet-500',
          'from-violet-400 to-purple-500',
          'from-pink-400 to-purple-500',
          'from-purple-300 to-violet-400',
        ]
      case 'webshop':
        return [
          'from-emerald-400 to-green-500',
          'from-green-400 to-emerald-500',
          'from-teal-400 to-green-500',
          'from-emerald-300 to-green-400',
        ]
      default:
        return [
          'from-primary-400 to-blue-500',
          'from-blue-400 to-primary-500',
          'from-purple-400 to-blue-500',
          'from-primary-300 to-blue-400',
        ]
    }
  }
  
  const colors = getParticleColors()
  
  const particles = [
    { size: 6, x: '8%', y: '15%', delay: 0, duration: 9, color: colors[0] },
    { size: 8, x: '92%', y: '20%', delay: 1.5, duration: 11, color: colors[1] },
    { size: 5, x: '15%', y: '75%', delay: 0.8, duration: 10, color: colors[2] },
    { size: 7, x: '88%', y: '65%', delay: 2.2, duration: 12, color: colors[3] },
    { size: 5, x: '5%', y: '45%', delay: 1, duration: 8, color: colors[0] },
    { size: 4, x: '78%', y: '85%', delay: 0.5, duration: 9.5, color: colors[1] },
    { size: 6, x: '45%', y: '8%', delay: 1.8, duration: 10.5, color: colors[2] },
    { size: 5, x: '95%', y: '40%', delay: 2.5, duration: 11, color: colors[3] },
    { size: 4, x: '25%', y: '90%', delay: 3, duration: 9, color: colors[0] },
    { size: 6, x: '65%', y: '12%', delay: 0.3, duration: 10, color: colors[1] },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={`${serviceType}-${i}`}
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

// Helper function to generate available time slots
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

// Helper function to get next 14 available dates (excluding weekends)
const getAvailableDates = () => {
  const dates = []
  const today = new Date()
  let daysAdded = 0
  let currentDate = new Date(today)
  currentDate.setDate(currentDate.getDate() + 1) // Start from tomorrow

  while (daysAdded < 14) {
    const dayOfWeek = currentDate.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday (0) and Saturday (6)
      dates.push(new Date(currentDate))
      daysAdded++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dates
}

// Types
type ServiceType = 'website' | 'drone' | 'logo' | 'webshop'

interface FormData {
  // Service type selection
  serviceType: ServiceType
  
  // Step 1: Package (for websites)
  package: 'starter' | 'professional' | 'business' | null
  
  // Step 2: Website type
  websiteType: string
  
  // Step 3: Industry
  industry: string
  
  // Step 4: Domain
  domainOption: 'new' | 'existing' | 'help'
  domainName: string
  
  // Step 5: Business info
  businessName: string
  businessDescription: string
  logoUrl: string
  
  // Step 6: Design preferences
  style: string
  colors: string[]
  customColor: string
  exampleSites: string[]
  
  // Step 7: Content
  pages: string[]
  hasContent: boolean
  contentNotes: string
  
  // Package-specific features (Professional & Business)
  wantsBlog: boolean
  blogTopics: string
  wantsAnalytics: boolean
  
  // Business-only features
  wantsBookingSystem: boolean
  bookingDescription: string
  wantsMultiLanguage: boolean
  languages: string[]
  wantsNewsletter: boolean
  estimatedVisitors: string
  
  // Drone-specific fields
  dronePackage: 'basis' | 'professional' | 'premium' | null
  droneLocationType: string
  droneDate: string
  droneTimePreference: string
  droneDescription: string
  droneDeliverables: string[]
  
  // Logo-specific fields
  logoPackage: 'basis' | 'professional' | null
  logoStyle: string
  logoColors: string[]
  logoInspiration: string
  logoDeadline: string
  
  // Webshop-specific fields
  webshopPackage: 'starter' | 'professional' | null
  webshopPlatform: string
  webshopProductCount: string
  webshopPaymentMethods: string[]
  webshopShipping: string
  webshopFeatures: string[]
  // Webshop design fields
  webshopStyle: string
  webshopColors: string[]
  webshopCustomColor: string
  webshopExampleSites: string[]
  webshopBrandAssets: string
  
  // Step 8: Call scheduling
  wantsCall: boolean
  callDate: string
  callTime: string
  callTopics: string[]
  
  // Step 9: Contact
  contactName: string
  contactEmail: string
  contactPhone: string
  preferredContact: 'email' | 'phone' | 'whatsapp'
  startDate: string
  additionalNotes: string
  
  // Project password for secure access
  projectPassword: string
}

const initialFormData: FormData = {
  serviceType: 'website',
  package: null,
  websiteType: '',
  industry: '',
  domainOption: 'new',
  domainName: '',
  businessName: '',
  businessDescription: '',
  logoUrl: '',
  style: '',
  colors: [],
  customColor: '',
  exampleSites: ['', '', ''],
  pages: ['Home', 'Over ons', 'Contact'],
  hasContent: false,
  contentNotes: '',
  // Package-specific features
  wantsBlog: false,
  blogTopics: '',
  wantsAnalytics: true,
  wantsBookingSystem: false,
  bookingDescription: '',
  wantsMultiLanguage: false,
  languages: [],
  wantsNewsletter: false,
  estimatedVisitors: '',
  // Drone-specific fields
  dronePackage: null,
  droneLocationType: '',
  droneDate: '',
  droneTimePreference: '',
  droneDescription: '',
  droneDeliverables: [],
  // Logo-specific fields
  logoPackage: null,
  logoStyle: '',
  logoColors: [],
  logoInspiration: '',
  logoDeadline: '',
  // Webshop-specific fields
  webshopPackage: null,
  webshopPlatform: '',
  webshopProductCount: '',
  webshopPaymentMethods: [],
  webshopShipping: '',
  webshopFeatures: [],
  // Webshop design fields
  webshopStyle: '',
  webshopColors: [],
  webshopCustomColor: '',
  webshopExampleSites: ['', '', ''],
  webshopBrandAssets: '',
  // Call scheduling
  wantsCall: true,
  callDate: '',
  callTime: '',
  callTopics: [],
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  preferredContact: 'email',
  startDate: '',
  additionalNotes: '',
  // Project password
  projectPassword: '',
}

const packages = [
  {
    id: 'starter',
    name: 'Starter',
    price: '96',
    priceExcl: '79',
    setupFee: '120',
    setupFeeExcl: '99',
    description: 'Perfect voor ZZP\'ers en starters',
    features: ['5 pagina\'s', 'Mobiel-vriendelijk', 'Contactformulier', 'SEO basis'],
    maxPages: 5,
  },
  {
    id: 'professional',
    name: 'Professioneel',
    price: '180',
    priceExcl: '149',
    setupFee: '180',
    setupFeeExcl: '149',
    description: 'Voor groeiende bedrijven',
    features: ['10 pagina\'s', 'Blog/nieuws', 'Google Analytics', 'Premium support'],
    popular: true,
    maxPages: 10,
  },
  {
    id: 'business',
    name: 'Business',
    price: '301',
    priceExcl: '249',
    setupFee: '241',
    setupFeeExcl: '199',
    description: 'Volledige zakelijke website',
    features: ['Onbeperkt pagina\'s', 'Webshop ready', 'Geavanceerde SEO', 'Prioriteit support'],
    maxPages: Infinity,
  },
]

const dronePackages = [
  {
    id: 'basis',
    name: 'Basis',
    price: '483',
    priceExcl: '399',
    description: 'Perfect voor kleine projecten',
    features: ['15 bewerkte foto\'s', '1 drone video (60 sec)', '1 locatie', 'Levering binnen 5 dagen'],
  },
  {
    id: 'professional',
    name: 'Professioneel',
    price: '846',
    priceExcl: '699',
    description: 'Uitgebreid pakket voor bedrijven',
    features: ['30 bewerkte foto\'s', '2 drone videos (elk 90 sec)', 'Tot 2 locaties', 'Levering binnen 3 dagen'],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '1209',
    priceExcl: '999',
    description: 'Complete productie voor grote projecten',
    features: ['50+ bewerkte foto\'s', 'Onbeperkt drone videos', 'Meerdere locaties', 'Same-day editing mogelijk'],
  },
]

const logoPackages = [
  {
    id: 'basis',
    name: 'Basis',
    price: '182',
    priceExcl: '150',
    description: 'Eenvoudig maar professioneel',
    features: ['2 concepten', '2 revisierondes', 'Logo bestanden (PNG, JPG)', 'Binnen 5 werkdagen'],
  },
  {
    id: 'professional',
    name: 'Professioneel',
    price: '362',
    priceExcl: '299',
    description: 'Complete huisstijl basis',
    features: ['4 concepten', 'Onbeperkte revisies', 'Alle bestandsformaten', 'Kleurenpalet & typografie'],
    popular: true,
  },
]

const webshopPackages = [
  {
    id: 'starter',
    name: 'Starter',
    price: '301',
    priceExcl: '249',
    setupFee: '362',
    setupFeeExcl: '299',
    description: 'Perfect om te beginnen met verkopen',
    features: ['Tot 50 producten', 'iDEAL & creditcard', 'Basis verzendopties', 'Mobiel-vriendelijk'],
    productCountOptions: ['1-10', '10-25', '25-50'],
  },
  {
    id: 'professional',
    name: 'Professioneel',
    price: '422',
    priceExcl: '349',
    setupFee: '362',
    setupFeeExcl: '299',
    description: 'Voor groeiende webshops',
    features: ['Tot 500 producten', 'Alle betaalmethodes', 'Geavanceerde verzending', 'Koppeling met boekhouden'],
    popular: true,
    productCountOptions: ['1-50', '50-150', '150-300', '300-500'],
  },
]

const droneLocationTypes = [
  { id: 'building', label: 'Gebouw / Pand', icon: Building2 },
  { id: 'construction', label: 'Bouwproject', icon: Wrench },
  { id: 'event', label: 'Evenement', icon: Music },
  { id: 'nature', label: 'Natuur / Landschap', icon: Home },
  { id: 'realestate', label: 'Vastgoed', icon: Home },
  { id: 'other', label: 'Anders', icon: Sparkles },
]

const logoStyles = [
  { id: 'modern', label: 'Modern & Minimalistisch', description: 'Strak en clean' },
  { id: 'classic', label: 'Klassiek & Tijdloos', description: 'Elegant en betrouwbaar' },
  { id: 'playful', label: 'Speels & Creatief', description: 'Kleurrijk en uniek' },
  { id: 'bold', label: 'Bold & Krachtig', description: 'Opvallend en sterk' },
  { id: 'handdrawn', label: 'Handgetekend', description: 'Authentiek en persoonlijk' },
]

const websiteTypes = [
  { id: 'business', label: 'Bedrijfswebsite', icon: Building2 },
  { id: 'portfolio', label: 'Portfolio', icon: Camera },
  { id: 'webshop', label: 'Webshop', icon: ShoppingBag },
  { id: 'landing', label: 'Landingspagina', icon: Rocket },
  { id: 'blog', label: 'Blog', icon: FileText },
  { id: 'other', label: 'Anders', icon: Sparkles },
]

const industries = [
  { id: 'construction', label: 'Bouw & Renovatie', icon: Wrench },
  { id: 'hospitality', label: 'Horeca', icon: Utensils },
  { id: 'health', label: 'Gezondheid & Welzijn', icon: Heart },
  { id: 'education', label: 'Onderwijs & Training', icon: GraduationCap },
  { id: 'realestate', label: 'Vastgoed', icon: Home },
  { id: 'automotive', label: 'Automotive', icon: Car },
  { id: 'beauty', label: 'Beauty & Wellness', icon: Scissors },
  { id: 'fitness', label: 'Sport & Fitness', icon: Dumbbell },
  { id: 'creative', label: 'Creatieve sector', icon: Music },
  { id: 'consulting', label: 'Consultancy', icon: Briefcase },
  { id: 'retail', label: 'Retail', icon: ShoppingBag },
  { id: 'other', label: 'Anders', icon: Sparkles },
]

const designStyles = [
  { id: 'modern', label: 'Modern & Minimalistisch', description: 'Strak, veel witruimte, clean' },
  { id: 'bold', label: 'Bold & Opvallend', description: 'Felle kleuren, grote typografie' },
  { id: 'classic', label: 'Klassiek & Professioneel', description: 'Tijdloos, betrouwbaar' },
  { id: 'playful', label: 'Speels & Creatief', description: 'Illustraties, unieke vormen' },
  { id: 'luxury', label: 'Luxe & Premium', description: 'Elegant, donkere tinten' },
]

const colorOptions = [
  { id: 'blue', label: 'Blauw', color: '#3B82F6', description: 'Vertrouwen, professionaliteit' },
  { id: 'green', label: 'Groen', color: '#22C55E', description: 'Natuur, groei, gezondheid' },
  { id: 'purple', label: 'Paars', color: '#8B5CF6', description: 'Creativiteit, luxe' },
  { id: 'red', label: 'Rood', color: '#EF4444', description: 'Energie, passie' },
  { id: 'orange', label: 'Oranje', color: '#F97316', description: 'Vriendelijk, energiek' },
  { id: 'teal', label: 'Teal', color: '#14B8A6', description: 'Modern, fris' },
  { id: 'pink', label: 'Roze', color: '#EC4899', description: 'Speels, vrouwelijk' },
  { id: 'black', label: 'Zwart', color: '#1F2937', description: 'Elegant, premium' },
]

const defaultPages = [
  'Home',
  'Over ons',
  'Diensten',
  'Portfolio',
  'Blog',
  'Contact',
  'Prijzen',
  'FAQ',
  'Team',
  'Testimonials',
]

export default function StartProject() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const formRef = useRef<HTMLDivElement>(null)
  
  // Check for pre-selected package from URL (e.g., /start?pakket=business)
  const preselectedPackage = searchParams.get('pakket') as 'starter' | 'professional' | 'business' | null
  const validPackages = ['starter', 'professional', 'business']
  const hasPreselectedPackage = preselectedPackage && validPackages.includes(preselectedPackage)
  
  // Check for pre-selected service from URL (e.g., /start?dienst=drone or /start?dienst=logo or /start?dienst=webshop)
  const preselectedService = searchParams.get('dienst') as ServiceType | null
  const validServices: ServiceType[] = ['website', 'drone', 'logo', 'webshop']
  const initialService: ServiceType = preselectedService && validServices.includes(preselectedService) ? preselectedService : 'website'
  
  // Check for webshop package (starter or professional)
  const validWebshopPackages = ['starter', 'professional']
  const hasPreselectedWebshopPackage = initialService === 'webshop' && preselectedPackage && validWebshopPackages.includes(preselectedPackage)
  
  const [currentStep, setCurrentStep] = useState(hasPreselectedPackage || hasPreselectedWebshopPackage ? 2 : 1)
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    serviceType: initialService,
    package: hasPreselectedPackage && initialService === 'website' ? preselectedPackage : null,
    webshopPackage: hasPreselectedWebshopPackage ? (preselectedPackage as 'starter' | 'professional') : null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newExampleSite, setNewExampleSite] = useState('')

  // Scroll to TOP on page load (not to form)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Calculate total steps based on service type
  const getTotalSteps = () => {
    switch (formData.serviceType) {
      case 'drone': return 5 // Package, Location, Details, Call, Contact
      case 'logo': return 5 // Package, Style, Colors, Call, Contact
      case 'webshop': return 6 // Package, Products, Design, Features, Call, Contact
      default: return 9 // Website flow
    }
  }
  
  const totalSteps = getTotalSteps()
  
  // Get step title based on service type and current step
  const getStepTitle = () => {
    if (formData.serviceType === 'drone') {
      const titles = ['Pakket', 'Locatie', 'Details', 'Gesprek', 'Contact']
      return titles[currentStep - 1] || ''
    }
    if (formData.serviceType === 'logo') {
      const titles = ['Pakket', 'Stijl', 'Kleuren', 'Gesprek', 'Contact']
      return titles[currentStep - 1] || ''
    }
    if (formData.serviceType === 'webshop') {
      const titles = ['Pakket', 'Producten', 'Design', 'Features', 'Gesprek', 'Contact']
      return titles[currentStep - 1] || ''
    }
    // Website flow
    const titles = ['Pakket', 'Type', 'Branche', 'Domein', 'Bedrijf', 'Stijl', 'Pagina\'s', 'Gesprek', 'Contact']
    return titles[currentStep - 1] || ''
  }

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }
  
  // Handle service type change
  const handleServiceChange = (service: ServiceType) => {
    setFormData({
      ...initialFormData,
      serviceType: service,
    })
    setCurrentStep(1)
  }

  const canProceed = (): boolean => {
    // Different validation per service type
    if (formData.serviceType === 'drone') {
      switch (currentStep) {
        case 1: return formData.dronePackage !== null
        case 2: return formData.droneLocationType !== ''
        case 3: return formData.businessName !== '' && formData.droneDescription !== ''
        case 4: return !formData.wantsCall || (formData.callDate !== '' && formData.callTime !== '' && formData.contactPhone !== '')
        case 5: return formData.contactName !== '' && formData.contactEmail !== '' && formData.projectPassword.length >= 4
        default: return true
      }
    }
    
    if (formData.serviceType === 'logo') {
      switch (currentStep) {
        case 1: return formData.logoPackage !== null
        case 2: return formData.logoStyle !== ''
        case 3: return formData.businessName !== '' && formData.logoColors.length > 0
        case 4: return !formData.wantsCall || (formData.callDate !== '' && formData.callTime !== '' && formData.contactPhone !== '')
        case 5: return formData.contactName !== '' && formData.contactEmail !== '' && formData.projectPassword.length >= 4
        default: return true
      }
    }
    
    if (formData.serviceType === 'webshop') {
      switch (currentStep) {
        case 1: return formData.webshopPackage !== null
        case 2: return formData.businessName !== '' && formData.webshopProductCount !== ''
        case 3: return formData.webshopStyle !== '' // Design step
        case 4: return formData.webshopPaymentMethods.length > 0
        case 5: return !formData.wantsCall || (formData.callDate !== '' && formData.callTime !== '' && formData.contactPhone !== '')
        case 6: return formData.contactName !== '' && formData.contactEmail !== '' && formData.projectPassword.length >= 4
        default: return true
      }
    }
    
    // Website flow
    switch (currentStep) {
      case 1: return formData.package !== null
      case 2: return formData.websiteType !== ''
      case 3: return formData.industry !== ''
      case 4: return formData.domainOption !== 'new' || formData.domainName !== ''
      case 5: return formData.businessName !== ''
      case 6: return formData.style !== ''
      case 7: return formData.pages.length > 0
      case 8: return !formData.wantsCall || (formData.callDate !== '' && formData.callTime !== '' && formData.contactPhone !== '')
      case 9: return formData.contactName !== '' && formData.contactEmail !== '' && formData.projectPassword.length >= 4
      default: return true
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
      // Build project data based on service type
      let projectData: Record<string, unknown>
      let apiEndpoint = '/api/project-request'
      
      if (formData.serviceType === 'drone') {
        const selectedPackage = dronePackages.find(p => p.id === formData.dronePackage)
        projectData = {
          serviceType: 'drone',
          package: formData.dronePackage,
          packageName: selectedPackage?.name,
          packagePrice: selectedPackage?.price,
          locationType: droneLocationTypes.find(t => t.id === formData.droneLocationType)?.label || formData.droneLocationType,
          preferredDate: formData.droneDate,
          timePreference: formData.droneTimePreference,
          businessName: formData.businessName,
          description: formData.droneDescription,
          deliverables: formData.droneDeliverables,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          remarks: formData.additionalNotes,
          projectPassword: formData.projectPassword,
          callScheduled: formData.wantsCall,
          callDate: formData.callDate,
          callTime: formData.callTime,
        }
        apiEndpoint = '/api/service-request'
      } else if (formData.serviceType === 'logo') {
        const selectedPackage = logoPackages.find(p => p.id === formData.logoPackage)
        projectData = {
          serviceType: 'logo',
          package: formData.logoPackage,
          packageName: selectedPackage?.name,
          packagePrice: selectedPackage?.price,
          style: logoStyles.find(s => s.id === formData.logoStyle)?.label || formData.logoStyle,
          colors: formData.logoColors,
          businessName: formData.businessName,
          businessDescription: formData.businessDescription,
          inspiration: formData.logoInspiration,
          deadline: formData.logoDeadline,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          remarks: formData.additionalNotes,
          projectPassword: formData.projectPassword,
          callScheduled: formData.wantsCall,
          callDate: formData.callDate,
          callTime: formData.callTime,
        }
        apiEndpoint = '/api/service-request'
      } else if (formData.serviceType === 'webshop') {
        const selectedPackage = webshopPackages.find(p => p.id === formData.webshopPackage)
        projectData = {
          serviceType: 'webshop',
          package: formData.webshopPackage,
          packageName: selectedPackage?.name,
          packagePrice: selectedPackage?.price,
          platform: formData.webshopPlatform,
          productCount: formData.webshopProductCount,
          paymentMethods: formData.webshopPaymentMethods,
          shipping: formData.webshopShipping,
          features: formData.webshopFeatures,
          // Design preferences
          style: formData.webshopStyle,
          colors: formData.webshopColors,
          customColor: formData.webshopCustomColor,
          exampleSites: formData.webshopExampleSites.filter(s => s).join(', '),
          brandAssets: formData.webshopBrandAssets,
          businessName: formData.businessName,
          businessDescription: formData.businessDescription,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          remarks: formData.additionalNotes,
          projectPassword: formData.projectPassword,
          callScheduled: formData.wantsCall,
          callDate: formData.callDate,
          callTime: formData.callTime,
        }
        apiEndpoint = '/api/service-request'
      } else {
        // Website flow
        const selectedPackage = packages.find(p => p.id === formData.package)
        projectData = {
          serviceType: 'website',
          package: formData.package,
          websiteType: websiteTypes.find(t => t.id === formData.websiteType)?.label || formData.websiteType,
          industry: industries.find(i => i.id === formData.industry)?.label || formData.industry,
          domain: formData.domainName,
          domainStatus: formData.domainOption,
          businessName: formData.businessName,
          description: formData.businessDescription,
          primaryColor: formData.colors[0] ? colorOptions.find(c => c.id === formData.colors[0])?.color || '' : '',
          customColor: formData.customColor,
          style: designStyles.find(s => s.id === formData.style)?.label || formData.style,
          exampleSites: formData.exampleSites.filter(s => s).join(', '),
          pages: formData.pages,
          content: formData.contentNotes,
          hasContent: formData.hasContent,
          wantsBlog: formData.wantsBlog,
          blogTopics: formData.blogTopics,
          wantsAnalytics: formData.wantsAnalytics,
          wantsBookingSystem: formData.wantsBookingSystem,
          bookingDescription: formData.bookingDescription,
          wantsMultiLanguage: formData.wantsMultiLanguage,
          languages: formData.languages,
          wantsNewsletter: formData.wantsNewsletter,
          estimatedVisitors: formData.estimatedVisitors,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          remarks: formData.additionalNotes,
          projectPassword: formData.projectPassword,
          callScheduled: formData.wantsCall,
          callDate: formData.callDate,
          callTime: formData.callTime,
          callTopics: formData.callTopics,
          packageName: selectedPackage?.name,
          packagePrice: selectedPackage?.price,
          setupFee: selectedPackage?.setupFee,
        }
      }

      // Send to server API - this saves to database and sends emails
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        throw new Error('Server error')
      }

      const result = await response.json()
      
      if (!result.success || !result.projectId) {
        throw new Error('Invalid server response')
      }

      // Use the projectId from server response
      const serverProjectId = result.projectId

      // Also save to localStorage for quick access
      const submission = {
        id: serverProjectId,
        timestamp: new Date().toISOString(),
        ...projectData,
      }
      
      const existingSubmissions = JSON.parse(localStorage.getItem('webstability_submissions') || '[]')
      existingSubmissions.push(submission)
      localStorage.setItem('webstability_submissions', JSON.stringify(existingSubmissions))

      // Redirect to thank you page with server's project ID, service type, and email
      const serviceParam = formData.serviceType !== 'website' ? `&dienst=${formData.serviceType}` : ''
      const emailParam = formData.contactEmail ? `&email=${encodeURIComponent(formData.contactEmail)}` : ''
      navigate(`/bedankt?project=${serverProjectId}${serviceParam}${emailParam}`)
    } catch {
      alert('Er ging iets mis. Probeer het opnieuw of mail direct naar hallo@webstability.nl')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addExampleSite = () => {
    if (newExampleSite && formData.exampleSites.length < 5) {
      let url = newExampleSite
      if (!url.startsWith('http')) {
        url = 'https://' + url
      }
      updateFormData('exampleSites', [...formData.exampleSites.filter(s => s), url])
      setNewExampleSite('')
    }
  }

  const removeExampleSite = (index: number) => {
    updateFormData('exampleSites', formData.exampleSites.filter((_, i) => i !== index))
  }

  const togglePage = (page: string) => {
    const selectedPackage = packages.find(p => p.id === formData.package)
    const maxPages = selectedPackage?.maxPages || 5
    
    if (formData.pages.includes(page)) {
      updateFormData('pages', formData.pages.filter(p => p !== page))
    } else if (formData.pages.length < maxPages) {
      updateFormData('pages', [...formData.pages, page])
    }
  }

  const toggleColor = (colorId: string) => {
    if (formData.colors.includes(colorId)) {
      updateFormData('colors', formData.colors.filter(c => c !== colorId))
    } else if (formData.colors.length < 3) {
      updateFormData('colors', [...formData.colors, colorId])
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Header />
      
      {/* Hero Section with dynamic colors based on service type */}
      <section className={`relative min-h-[40vh] flex items-end overflow-hidden pt-20 transition-colors duration-500 ${
        formData.serviceType === 'drone' 
          ? 'bg-gradient-to-br from-slate-50 via-orange-50/30 to-white'
          : formData.serviceType === 'logo'
            ? 'bg-gradient-to-br from-slate-50 via-purple-50/30 to-white'
            : formData.serviceType === 'webshop'
              ? 'bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white'
              : 'bg-gradient-to-br from-slate-50 via-primary-50/30 to-white'
      }`}>
        {/* Background decorations - dynamic colors */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className={`absolute top-0 right-0 w-[900px] h-[900px] rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 transition-colors duration-500 ${
              formData.serviceType === 'drone'
                ? 'bg-gradient-to-br from-orange-200/60 via-amber-100/40 to-yellow-100/30'
                : formData.serviceType === 'logo'
                  ? 'bg-gradient-to-br from-purple-200/60 via-violet-100/40 to-pink-100/30'
                  : formData.serviceType === 'webshop'
                    ? 'bg-gradient-to-br from-emerald-200/60 via-green-100/40 to-teal-100/30'
                    : 'bg-gradient-to-br from-primary-200/60 via-blue-100/40 to-purple-100/30'
            }`}
            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className={`absolute bottom-0 left-0 w-[700px] h-[700px] rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 transition-colors duration-500 ${
              formData.serviceType === 'drone'
                ? 'bg-gradient-to-tr from-amber-100/50 via-orange-100/40 to-transparent'
                : formData.serviceType === 'logo'
                  ? 'bg-gradient-to-tr from-violet-100/50 via-purple-100/40 to-transparent'
                  : formData.serviceType === 'webshop'
                    ? 'bg-gradient-to-tr from-green-100/50 via-emerald-100/40 to-transparent'
                    : 'bg-gradient-to-tr from-blue-100/50 via-primary-100/40 to-transparent'
            }`}
            animate={{ scale: [1, 1.08, 1], rotate: [0, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <FloatingParticles serviceType={formData.serviceType} />
          <div className={`absolute inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] transition-colors duration-500 ${
            formData.serviceType === 'drone'
              ? 'bg-[linear-gradient(to_right,#fed7aa33_1px,transparent_1px),linear-gradient(to_bottom,#fed7aa33_1px,transparent_1px)]'
              : formData.serviceType === 'logo'
                ? 'bg-[linear-gradient(to_right,#e9d5ff33_1px,transparent_1px),linear-gradient(to_bottom,#e9d5ff33_1px,transparent_1px)]'
                : formData.serviceType === 'webshop'
                  ? 'bg-[linear-gradient(to_right,#d1fae533_1px,transparent_1px),linear-gradient(to_bottom,#d1fae533_1px,transparent_1px)]'
                  : 'bg-[linear-gradient(to_right,#dbeafe33_1px,transparent_1px),linear-gradient(to_bottom,#dbeafe33_1px,transparent_1px)]'
          }`} />
          <div className={`absolute top-20 right-20 w-32 h-32 border rounded-full transition-colors duration-500 ${
            formData.serviceType === 'drone' ? 'border-orange-200/30'
              : formData.serviceType === 'logo' ? 'border-purple-200/30'
                : formData.serviceType === 'webshop' ? 'border-emerald-200/30'
                  : 'border-primary-200/30'
          }`} />
          <div className={`absolute top-24 right-24 w-24 h-24 border rounded-full transition-colors duration-500 ${
            formData.serviceType === 'drone' ? 'border-orange-300/20'
              : formData.serviceType === 'logo' ? 'border-purple-300/20'
                : formData.serviceType === 'webshop' ? 'border-emerald-300/20'
                  : 'border-primary-300/20'
          }`} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className={`inline-flex items-center gap-2 border rounded-full px-4 py-2 mb-6 ${
                  formData.serviceType === 'drone' 
                    ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200/50'
                    : formData.serviceType === 'logo'
                      ? 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200/50'
                      : formData.serviceType === 'webshop'
                        ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200/50'
                        : 'bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200/50'
                }`}
              >
                {formData.serviceType === 'drone' ? (
                  <Camera className="w-4 h-4 text-orange-600" />
                ) : formData.serviceType === 'logo' ? (
                  <Palette className="w-4 h-4 text-purple-600" />
                ) : formData.serviceType === 'webshop' ? (
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Rocket className="w-4 h-4 text-primary-600" />
                )}
                <span className={`text-sm font-medium ${
                  formData.serviceType === 'drone' ? 'text-orange-700'
                    : formData.serviceType === 'logo' ? 'text-purple-700'
                      : formData.serviceType === 'webshop' ? 'text-emerald-700'
                        : 'text-primary-700'
                }`}>
                  {formData.serviceType === 'drone' ? 'Binnen 48 uur bevestiging' : 
                   formData.serviceType === 'logo' ? 'Binnen 5 werkdagen klaar' : 
                   formData.serviceType === 'webshop' ? 'Binnen 2 weken live' : 'Binnen 7 dagen online'}
                </span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Start je{' '}
                <span className={`bg-clip-text text-transparent ${
                  formData.serviceType === 'drone' 
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600'
                    : formData.serviceType === 'logo'
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600'
                      : formData.serviceType === 'webshop'
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600'
                        : 'bg-gradient-to-r from-primary-600 to-blue-600'
                }`}>
                  {formData.serviceType === 'drone' ? 'drone project' : 
                   formData.serviceType === 'logo' ? 'logo ontwerp' : 
                   formData.serviceType === 'webshop' ? 'webshop' : 'website project'}
                </span>
              </h1>

              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Beantwoord een paar vragen zodat we direct aan de slag kunnen
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <main className="pb-16 md:pb-20 relative z-10 bg-gradient-to-b from-white via-gray-50/50 to-white">
        <div className="max-w-4xl mx-auto px-4 -mt-6">
          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10"
          >
          {/* Service Type Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mb-8"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => handleServiceChange('website')}
                className={`group relative flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  formData.serviceType === 'website'
                    ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/20'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                  formData.serviceType === 'website'
                    ? 'bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary-500/30'
                    : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <Globe className={`w-5 h-5 ${formData.serviceType === 'website' ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div className="text-left min-w-0">
                  <span className={`font-semibold block truncate ${formData.serviceType === 'website' ? 'text-primary-700' : 'text-gray-900'}`}>
                    Website
                  </span>
                  <span className="text-xs text-gray-500">Vanaf €96/mnd</span>
                </div>
                {formData.serviceType === 'website' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </button>

              <button
                onClick={() => handleServiceChange('webshop')}
                className={`group relative flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  formData.serviceType === 'webshop'
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                  formData.serviceType === 'webshop'
                    ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/30'
                    : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <ShoppingBag className={`w-5 h-5 ${formData.serviceType === 'webshop' ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div className="text-left min-w-0">
                  <span className={`font-semibold block truncate ${formData.serviceType === 'webshop' ? 'text-emerald-700' : 'text-gray-900'}`}>
                    Webshop
                  </span>
                  <span className="text-xs text-gray-500">Vanaf €301/mnd</span>
                </div>
                {formData.serviceType === 'webshop' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </button>

              <button
                onClick={() => handleServiceChange('drone')}
                className={`group relative flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  formData.serviceType === 'drone'
                    ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-500/20'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                  formData.serviceType === 'drone'
                    ? 'bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg shadow-orange-500/30'
                    : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <Camera className={`w-5 h-5 ${formData.serviceType === 'drone' ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div className="text-left min-w-0">
                  <span className={`font-semibold block truncate ${formData.serviceType === 'drone' ? 'text-orange-700' : 'text-gray-900'}`}>
                    Luchtfoto
                  </span>
                  <span className="text-xs text-gray-500">Vanaf €483</span>
                </div>
                {formData.serviceType === 'drone' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </button>

              <button
                onClick={() => handleServiceChange('logo')}
                className={`group relative flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  formData.serviceType === 'logo'
                    ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/20'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                  formData.serviceType === 'logo'
                    ? 'bg-gradient-to-br from-purple-400 to-violet-500 shadow-lg shadow-purple-500/30'
                    : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <Palette className={`w-5 h-5 ${formData.serviceType === 'logo' ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div className="text-left min-w-0">
                  <span className={`font-semibold block truncate ${formData.serviceType === 'logo' ? 'text-purple-700' : 'text-gray-900'}`}>
                    Logo
                  </span>
                  <span className="text-xs text-gray-500">Vanaf €182</span>
                </div>
                {formData.serviceType === 'logo' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </button>
            </div>
          </motion.div>

          {/* Progress bar - improved with milestones */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 md:mb-10"
          >
            {/* Step info header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white ${
                  formData.serviceType === 'drone' ? 'bg-gradient-to-br from-orange-500 to-amber-500'
                    : formData.serviceType === 'logo' ? 'bg-gradient-to-br from-purple-500 to-violet-500'
                      : formData.serviceType === 'webshop' ? 'bg-gradient-to-br from-emerald-500 to-green-500'
                        : 'bg-gradient-to-br from-primary-500 to-blue-500'
                }`}>
                  {currentStep}
                </span>
                <span className="text-sm font-semibold text-gray-900">{getStepTitle()}</span>
                <span className="text-xs text-gray-400">• Stap {currentStep} van {totalSteps}</span>
              </div>
              <span className={`text-sm font-bold ${
                formData.serviceType === 'drone' ? 'text-orange-600'
                  : formData.serviceType === 'logo' ? 'text-purple-600'
                    : formData.serviceType === 'webshop' ? 'text-emerald-600'
                      : 'text-primary-600'
              }`}>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            
            {/* Progress bar with milestone dots */}
            <div className="relative">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  key={`progress-${formData.serviceType}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    formData.serviceType === 'drone'
                      ? 'bg-gradient-to-r from-orange-400 to-amber-500'
                      : formData.serviceType === 'logo'
                        ? 'bg-gradient-to-r from-purple-400 to-violet-500'
                        : formData.serviceType === 'webshop'
                          ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                          : 'bg-gradient-to-r from-primary-500 to-blue-500'
                  }`}
                />
              </div>
              
              {/* Milestone dots */}
              <div className="absolute inset-0 flex items-center justify-between px-0">
                {Array.from({ length: totalSteps }).map((_, index) => {
                  const isCompleted = index + 1 < currentStep
                  const isCurrent = index + 1 === currentStep
                  return (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full border-2 transition-all ${
                        isCompleted
                          ? formData.serviceType === 'drone' ? 'bg-orange-500 border-orange-500'
                            : formData.serviceType === 'logo' ? 'bg-purple-500 border-purple-500'
                              : formData.serviceType === 'webshop' ? 'bg-emerald-500 border-emerald-500'
                                : 'bg-primary-500 border-primary-500'
                          : isCurrent
                            ? formData.serviceType === 'drone' ? 'bg-white border-orange-500 ring-4 ring-orange-100'
                              : formData.serviceType === 'logo' ? 'bg-white border-purple-500 ring-4 ring-purple-100'
                                : formData.serviceType === 'webshop' ? 'bg-white border-emerald-500 ring-4 ring-emerald-100'
                                  : 'bg-white border-primary-500 ring-4 ring-primary-100'
                            : 'bg-white border-gray-300'
                      }`}
                    />
                  )
                })}
              </div>
            </div>
            
            {/* Trust badges under progress */}
            <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                <Check className="w-3.5 h-3.5 text-green-500" />
                Geen verplichtingen
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                <Check className="w-3.5 h-3.5 text-green-500" />
                Vrijblijvende offerte
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                <Check className="w-3.5 h-3.5 text-green-500" />
                Reactie binnen 24u
              </span>
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div 
            ref={formRef} 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative bg-white rounded-2xl md:rounded-3xl border border-gray-200/60 shadow-xl p-5 md:p-8 lg:p-10 scroll-mt-24 overflow-hidden"
          >
            {/* Colored top border based on service */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${
              formData.serviceType === 'drone' ? 'bg-gradient-to-r from-orange-400 to-amber-500'
                : formData.serviceType === 'logo' ? 'bg-gradient-to-r from-purple-400 to-violet-500'
                  : formData.serviceType === 'webshop' ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                    : 'bg-gradient-to-r from-primary-500 to-blue-500'
            }`} />
            
            {/* Subtle gradient overlay on form */}
            <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
              formData.serviceType === 'drone' ? 'bg-gradient-to-br from-orange-50/20 via-transparent to-amber-50/20'
                : formData.serviceType === 'logo' ? 'bg-gradient-to-br from-purple-50/20 via-transparent to-violet-50/20'
                  : formData.serviceType === 'webshop' ? 'bg-gradient-to-br from-emerald-50/20 via-transparent to-green-50/20'
                    : 'bg-gradient-to-br from-primary-50/20 via-transparent to-blue-50/20'
            }`} />
            
            <div className="relative z-10">
            <AnimatePresence mode="wait">
              {/* ========== WEBSITE FLOW ========== */}
              {formData.serviceType === 'website' && (
                <>
                  {/* Step 1: Package */}
                  {currentStep === 1 && (
                    <motion.div
                      key="website-step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Kies je pakket</h2>
                      </div>
                      <p className="text-gray-600 mb-8 ml-13">Selecteer het pakket dat het beste bij je past</p>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        {packages.map((pkg) => (
                          <motion.button
                            key={pkg.id}
                            onClick={() => updateFormData('package', pkg.id as 'starter' | 'professional' | 'business')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                              formData.package === pkg.id
                                ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-blue-50 shadow-lg shadow-primary-500/20'
                                : 'border-gray-200 hover:border-primary-200 hover:shadow-md bg-white'
                            }`}
                          >
                            {pkg.popular && (
                              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-primary-500 to-blue-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-primary-500/30">
                            Populair
                          </span>
                        )}
                        <div className="mb-3">
                          <h3 className="font-bold text-gray-900">{pkg.name}</h3>
                        </div>
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-2xl font-bold text-primary-600">€{pkg.price}</span>
                          <span className="text-gray-500 text-sm">/maand</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Eenmalig €{pkg.setupFee}</p>
                        <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                        <ul className="space-y-2">
                          {pkg.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        {formData.package === pkg.id && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 w-7 h-7 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Website Type */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Wat voor website wil je?</h2>
                  <p className="text-gray-600 mb-8">Kies het type dat het beste past</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {websiteTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          // Redirect to webshop page if webshop is selected
                          if (type.id === 'webshop') {
                            navigate('/webshop')
                            return
                          }
                          updateFormData('websiteType', type.id)
                        }}
                        className={`p-6 rounded-xl border-2 text-center transition-all ${
                          formData.websiteType === type.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <type.icon className={`w-8 h-8 mx-auto mb-3 ${
                          formData.websiteType === type.id ? 'text-primary-600' : 'text-gray-400'
                        }`} />
                        <span className="font-medium text-gray-900">{type.label}</span>
                        {type.id === 'webshop' && (
                          <span className="block text-xs text-emerald-600 mt-1">→ Aparte pakketten</span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Industry */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">In welke branche ben je actief?</h2>
                  <p className="text-gray-600 mb-8">Dit helpt ons met het juiste design en content</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {industries.map((industry) => (
                      <button
                        key={industry.id}
                        onClick={() => updateFormData('industry', industry.id)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          formData.industry === industry.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <industry.icon className={`w-6 h-6 mx-auto mb-2 ${
                          formData.industry === industry.id ? 'text-primary-600' : 'text-gray-400'
                        }`} />
                        <span className="text-sm font-medium text-gray-900">{industry.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Domain */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Domeinnaam</h2>
                  <p className="text-gray-600 mb-8">Heb je al een domeinnaam of moeten we er een registreren?</p>
                  
                  <div className="space-y-4 mb-8">
                    {[
                      { id: 'new', label: 'Ik wil een nieuw domein registreren', icon: Globe },
                      { id: 'existing', label: 'Ik heb al een domeinnaam', icon: Link },
                      { id: 'help', label: 'Ik heb hulp nodig bij het kiezen', icon: Sparkles },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => updateFormData('domainOption', option.id as 'new' | 'existing' | 'help')}
                        className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${
                          formData.domainOption === option.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <option.icon className={`w-6 h-6 ${
                          formData.domainOption === option.id ? 'text-primary-600' : 'text-gray-400'
                        }`} />
                        <span className="font-medium text-gray-900">{option.label}</span>
                      </button>
                    ))}
                  </div>

                  {(formData.domainOption === 'new' || formData.domainOption === 'existing') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formData.domainOption === 'new' ? 'Gewenste domeinnaam' : 'Je huidige domeinnaam'}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.domainName}
                          onChange={(e) => updateFormData('domainName', e.target.value)}
                          placeholder="bijv. jouwbedrijf.nl"
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 5: Business Info */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Over je bedrijf</h2>
                  <p className="text-gray-600 mb-8">Vertel ons meer over je onderneming</p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bedrijfsnaam *
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => updateFormData('businessName', e.target.value)}
                        placeholder="Je bedrijfsnaam"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Korte beschrijving van je bedrijf
                      </label>
                      <textarea
                        value={formData.businessDescription}
                        onChange={(e) => updateFormData('businessDescription', e.target.value)}
                        rows={4}
                        placeholder="Wat doet je bedrijf? Wie zijn je klanten? Wat maakt je uniek?"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo URL (optioneel)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={formData.logoUrl}
                          onChange={(e) => updateFormData('logoUrl', e.target.value)}
                          placeholder="https://drive.google.com/... of link naar je logo"
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        />
                        <button className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                          <Upload className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Tip: Upload je logo naar Google Drive of WeTransfer en plak hier de link
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Design Preferences */}
              {currentStep === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Design voorkeuren</h2>
                  <p className="text-gray-600 mb-8">Help ons begrijpen wat jouw stijl is</p>
                  
                  <div className="space-y-8">
                    {/* Style selection */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Welke stijl past bij je merk?</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {designStyles.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => updateFormData('style', style.id)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              formData.style === style.id
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className="font-medium text-gray-900 block mb-1">{style.label}</span>
                            <span className="text-sm text-gray-500">{style.description}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color selection */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Kies je voorkeurskleuren (max 3)</h3>
                      <p className="text-sm text-gray-500 mb-4">Dit helpt ons bij het kleurenpalet</p>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-4">
                        {colorOptions.map((color) => (
                          <button
                            key={color.id}
                            onClick={() => toggleColor(color.id)}
                            className={`relative aspect-square rounded-xl transition-all ${
                              formData.colors.includes(color.id)
                                ? 'ring-2 ring-offset-2 ring-primary-500 scale-110'
                                : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: color.color }}
                            title={`${color.label}: ${color.description}`}
                          >
                            {formData.colors.includes(color.id) && (
                              <Check className="w-5 h-5 text-white absolute inset-0 m-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                      
                      {/* Custom color picker */}
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={formData.customColor || '#3B82F6'}
                            onChange={(e) => updateFormData('customColor', e.target.value)}
                            className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700 block">Eigen kleur</span>
                            <span className="text-xs text-gray-500">Kies je merkkleur</span>
                          </div>
                        </div>
                        {formData.customColor && (
                          <div className="ml-auto flex items-center gap-2">
                            <span className="text-sm font-mono text-gray-500">{formData.customColor.toUpperCase()}</span>
                            <button
                              onClick={() => updateFormData('customColor', '')}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Example sites */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Voorbeeldsites die je mooi vindt</h3>
                      <p className="text-sm text-gray-500 mb-4">Deel links naar websites die je inspireren</p>
                      
                      <div className="space-y-3 mb-4">
                        {formData.exampleSites.filter(s => s).map((site, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 truncate">
                              {site}
                            </div>
                            <button
                              onClick={() => removeExampleSite(index)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={newExampleSite}
                          onChange={(e) => setNewExampleSite(e.target.value)}
                          placeholder="https://voorbeeld.nl"
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExampleSite())}
                        />
                        <button
                          onClick={addExampleSite}
                          disabled={!newExampleSite}
                          className="px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50"
                        >
                          Toevoegen
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 7: Content & Pages */}
              {currentStep === 7 && (
                <motion.div
                  key="step7"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagina's & Content</h2>
                  <p className="text-gray-600 mb-8">Welke pagina's wil je op je website?</p>
                  
                  <div className="space-y-8">
                    {/* Page selection with limit indicator */}
                    <div>
                      {(() => {
                        const selectedPackage = packages.find(p => p.id === formData.package)
                        const maxPages = selectedPackage?.maxPages || 5
                        const isUnlimited = maxPages === Infinity
                        const remainingPages = isUnlimited ? Infinity : maxPages - formData.pages.length
                        
                        return (
                          <>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-medium text-gray-900">Selecteer je pagina's</h3>
                              <div className={`text-sm px-3 py-1 rounded-full ${
                                isUnlimited 
                                  ? 'bg-green-100 text-green-700' 
                                  : remainingPages > 0 
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'bg-amber-100 text-amber-700'
                              }`}>
                                {isUnlimited ? (
                                  <span className="flex items-center gap-1">
                                    <Sparkles className="w-4 h-4" />
                                    Onbeperkt pagina's
                                  </span>
                                ) : (
                                  <span>
                                    {formData.pages.length} / {maxPages} pagina's
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {!isUnlimited && remainingPages === 0 && (
                              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>Je hebt het maximum aantal pagina's voor je {selectedPackage?.name} pakket bereikt. Upgrade naar een hoger pakket voor meer pagina's.</span>
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-2">
                              {defaultPages.map((page) => {
                                const isSelected = formData.pages.includes(page)
                                const isDisabled = !isSelected && remainingPages === 0
                                
                                return (
                                  <button
                                    key={page}
                                    onClick={() => !isDisabled && togglePage(page)}
                                    disabled={isDisabled}
                                    className={`px-4 py-2 rounded-full border-2 transition-all ${
                                      isSelected
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : isDisabled
                                          ? 'border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
                                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                                  >
                                    {isSelected && (
                                      <Check className="w-4 h-4 inline mr-1" />
                                    )}
                                    {page}
                                  </button>
                                )
                              })}
                            </div>
                          </>
                        )
                      })()}
                    </div>

                    {/* Content availability */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Heb je al content (teksten, foto's)?</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <button
                          onClick={() => updateFormData('hasContent', true)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            formData.hasContent
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <FileText className={`w-6 h-6 mb-2 ${formData.hasContent ? 'text-primary-600' : 'text-gray-400'}`} />
                          <span className="font-medium text-gray-900 block">Ja, ik heb content</span>
                          <span className="text-sm text-gray-500">Ik lever teksten en foto's aan</span>
                        </button>
                        <button
                          onClick={() => updateFormData('hasContent', false)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            !formData.hasContent
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Palette className={`w-6 h-6 mb-2 ${!formData.hasContent ? 'text-primary-600' : 'text-gray-400'}`} />
                          <span className="font-medium text-gray-900 block">Nee, ik heb hulp nodig</span>
                          <span className="text-sm text-gray-500">Help me met teksten en stock foto's</span>
                        </button>
                      </div>
                    </div>

                    {/* Content notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opmerkingen over content
                      </label>
                      <textarea
                        value={formData.contentNotes}
                        onChange={(e) => updateFormData('contentNotes', e.target.value)}
                        rows={3}
                        placeholder="Bijv. 'Ik heb al een brochure die als basis kan dienen' of 'Ik heb professionele foto's'"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                      />
                    </div>

                    {/* Package-specific features - Professional & Business */}
                    {(formData.package === 'professional' || formData.package === 'business') && (
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary-500" />
                          Extra mogelijkheden voor {formData.package === 'professional' ? 'Professioneel' : 'Business'} pakket
                        </h3>
                        
                        <div className="space-y-4">
                          {/* Blog option */}
                          <div 
                            onClick={() => updateFormData('wantsBlog', !formData.wantsBlog)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.wantsBlog
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                formData.wantsBlog ? 'bg-primary-100' : 'bg-gray-100'
                              }`}>
                                <PenTool className={`w-5 h-5 ${formData.wantsBlog ? 'text-primary-600' : 'text-gray-400'}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-900">Blog / Nieuws sectie</span>
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                    formData.wantsBlog ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                                  }`}>
                                    {formData.wantsBlog && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500">Deel nieuws en artikelen met je bezoekers</span>
                              </div>
                            </div>
                            
                            {formData.wantsBlog && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-gray-200"
                              >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Welke onderwerpen wil je behandelen?
                                </label>
                                <input
                                  type="text"
                                  value={formData.blogTopics}
                                  onChange={(e) => updateFormData('blogTopics', e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  placeholder="Bijv. 'Tips, nieuws uit de sector, projecten'"
                                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500"
                                />
                              </motion.div>
                            )}
                          </div>

                          {/* Analytics option */}
                          <div 
                            onClick={() => updateFormData('wantsAnalytics', !formData.wantsAnalytics)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.wantsAnalytics
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                formData.wantsAnalytics ? 'bg-primary-100' : 'bg-gray-100'
                              }`}>
                                <BarChart3 className={`w-5 h-5 ${formData.wantsAnalytics ? 'text-primary-600' : 'text-gray-400'}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-900">Google Analytics integratie</span>
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                    formData.wantsAnalytics ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                                  }`}>
                                    {formData.wantsAnalytics && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500">Inzicht in bezoekersgedrag en statistieken</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Business-only features */}
                    {formData.package === 'business' && (
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <Rocket className="w-5 h-5 text-purple-500" />
                          Geavanceerde Business functies
                        </h3>
                        
                        <div className="space-y-4">
                          {/* Booking system */}
                          <div 
                            onClick={() => updateFormData('wantsBookingSystem', !formData.wantsBookingSystem)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.wantsBookingSystem
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                formData.wantsBookingSystem ? 'bg-purple-100' : 'bg-gray-100'
                              }`}>
                                <Calendar className={`w-5 h-5 ${formData.wantsBookingSystem ? 'text-purple-600' : 'text-gray-400'}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-900">Reserveringssysteem</span>
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                    formData.wantsBookingSystem ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                                  }`}>
                                    {formData.wantsBookingSystem && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500">Laat klanten online afspraken maken</span>
                              </div>
                            </div>
                            
                            {formData.wantsBookingSystem && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-gray-200"
                              >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Wat moet er geboekt kunnen worden?
                                </label>
                                <input
                                  type="text"
                                  value={formData.bookingDescription}
                                  onChange={(e) => updateFormData('bookingDescription', e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  placeholder="Bijv. 'Afspraken, lessen, behandelingen'"
                                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                />
                              </motion.div>
                            )}
                          </div>

                          {/* Multi-language */}
                          <div 
                            onClick={() => updateFormData('wantsMultiLanguage', !formData.wantsMultiLanguage)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.wantsMultiLanguage
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                formData.wantsMultiLanguage ? 'bg-purple-100' : 'bg-gray-100'
                              }`}>
                                <Languages className={`w-5 h-5 ${formData.wantsMultiLanguage ? 'text-purple-600' : 'text-gray-400'}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-900">Meertalige website</span>
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                    formData.wantsMultiLanguage ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                                  }`}>
                                    {formData.wantsMultiLanguage && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500">Bereik internationale klanten</span>
                              </div>
                            </div>
                            
                            {formData.wantsMultiLanguage && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-gray-200"
                              >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Welke talen naast Nederlands?
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {['Engels', 'Duits', 'Frans', 'Spaans'].map((lang) => (
                                    <button
                                      key={lang}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        if (formData.languages.includes(lang)) {
                                          updateFormData('languages', formData.languages.filter(l => l !== lang))
                                        } else {
                                          updateFormData('languages', [...formData.languages, lang])
                                        }
                                      }}
                                      className={`px-3 py-1.5 rounded-full border-2 text-sm transition-all ${
                                        formData.languages.includes(lang)
                                          ? 'border-purple-500 bg-purple-100 text-purple-700'
                                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                      }`}
                                    >
                                      {formData.languages.includes(lang) && <Check className="w-3 h-3 inline mr-1" />}
                                      {lang}
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </div>

                          {/* Newsletter */}
                          <div 
                            onClick={() => updateFormData('wantsNewsletter', !formData.wantsNewsletter)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.wantsNewsletter
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                formData.wantsNewsletter ? 'bg-purple-100' : 'bg-gray-100'
                              }`}>
                                <Mail className={`w-5 h-5 ${formData.wantsNewsletter ? 'text-purple-600' : 'text-gray-400'}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-900">Nieuwsbrief integratie</span>
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                    formData.wantsNewsletter ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                                  }`}>
                                    {formData.wantsNewsletter && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500">Verzamel e-mailadressen en stuur nieuwsbrieven</span>
                              </div>
                            </div>
                          </div>

                          {/* Estimated visitors */}
                          <div className="p-4 rounded-xl border-2 border-gray-200">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100">
                                <Users className="w-5 h-5 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <label className="font-medium text-gray-900 block mb-2">Verwacht aantal bezoekers per maand</label>
                                <select
                                  value={formData.estimatedVisitors}
                                  onChange={(e) => updateFormData('estimatedVisitors', e.target.value)}
                                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-purple-500"
                                >
                                  <option value="">Selecteer...</option>
                                  <option value="<500">Minder dan 500</option>
                                  <option value="500-2000">500 - 2.000</option>
                                  <option value="2000-10000">2.000 - 10.000</option>
                                  <option value=">10000">Meer dan 10.000</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 8: Call Scheduling */}
              {currentStep === 8 && (
                <motion.div
                  key="step8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">📞 Kennismakingsgesprek plannen</h2>
                  <p className="text-gray-600 mb-8">Plan een kort telefoongesprek in om je wensen te bespreken</p>
                  
                  <div className="space-y-6">
                    {/* Want a call toggle */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={() => updateFormData('wantsCall', true)}
                        className={`p-5 rounded-xl border-2 text-left transition-all ${
                          formData.wantsCall
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.wantsCall ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <Check className="w-5 h-5" />
                          </div>
                          <span className="font-semibold text-gray-900">Ja, plan een gesprek</span>
                        </div>
                        <p className="text-sm text-gray-500 ml-13">
                          15 minuten om je wensen te bespreken en vragen te beantwoorden
                        </p>
                      </button>
                      <button
                        onClick={() => {
                          updateFormData('wantsCall', false)
                          updateFormData('callDate', '')
                          updateFormData('callTime', '')
                        }}
                        className={`p-5 rounded-xl border-2 text-left transition-all ${
                          !formData.wantsCall
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!formData.wantsCall ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <X className="w-5 h-5" />
                          </div>
                          <span className="font-semibold text-gray-900">Nee, mail is prima</span>
                        </div>
                        <p className="text-sm text-gray-500 ml-13">
                          We nemen per email contact op om alles te regelen
                        </p>
                      </button>
                    </div>

                    {/* Call scheduling form - only show if wantsCall is true */}
                    {formData.wantsCall && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-6 pt-4 border-t border-gray-100"
                      >
                        {/* Phone number (required for call) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefoonnummer *
                          </label>
                          <input
                            type="tel"
                            value={formData.contactPhone}
                            onChange={(e) => updateFormData('contactPhone', e.target.value)}
                            placeholder="06 12345678"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">We bellen je op dit nummer</p>
                        </div>

                        {/* Date selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Kies een datum *
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {getAvailableDates().map((date) => {
                              const dateStr = date.toISOString().split('T')[0]
                              const isSelected = formData.callDate === dateStr
                              const dayName = date.toLocaleDateString('nl-NL', { weekday: 'short' })
                              const dayNum = date.getDate()
                              const monthName = date.toLocaleDateString('nl-NL', { month: 'short' })
                              
                              return (
                                <button
                                  key={dateStr}
                                  onClick={() => updateFormData('callDate', dateStr)}
                                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                                    isSelected
                                      ? 'border-primary-500 bg-primary-50'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <span className="block text-xs text-gray-500 capitalize">{dayName}</span>
                                  <span className={`block text-lg font-bold ${isSelected ? 'text-primary-600' : 'text-gray-900'}`}>{dayNum}</span>
                                  <span className="block text-xs text-gray-500">{monthName}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Time selection */}
                        {formData.callDate && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Kies een tijdstip *
                            </label>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                              {generateTimeSlots().map((time) => {
                                const isSelected = formData.callTime === time
                                return (
                                  <button
                                    key={time}
                                    onClick={() => updateFormData('callTime', time)}
                                    className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                      isSelected
                                        ? 'border-primary-500 bg-primary-500 text-white'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                                  >
                                    {time}
                                  </button>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}

                        {/* Call topics */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Waar wil je het over hebben? (optioneel)
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              'Mijn website wensen',
                              'Design & stijl',
                              'Prijzen & pakketten',
                              'Technische vragen',
                              'Planning & tijdlijn',
                              'Domein & hosting',
                            ].map((topic) => {
                              const isSelected = formData.callTopics.includes(topic)
                              return (
                                <button
                                  key={topic}
                                  onClick={() => {
                                    if (isSelected) {
                                      updateFormData('callTopics', formData.callTopics.filter(t => t !== topic))
                                    } else {
                                      updateFormData('callTopics', [...formData.callTopics, topic])
                                    }
                                  }}
                                  className={`px-4 py-2 rounded-full border-2 text-sm transition-all ${
                                    isSelected
                                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                                  {topic}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Summary */}
                        {formData.callDate && formData.callTime && (
                          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                            <p className="text-green-800 font-medium">
                              ✅ Gesprek gepland op {new Date(formData.callDate).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })} om {formData.callTime}
                            </p>
                            <p className="text-green-600 text-sm mt-1">
                              We bellen je op {formData.contactPhone || 'het opgegeven nummer'}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 9: Contact */}
              {currentStep === 9 && (
                <motion.div
                  key="step9"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Laatste stap! 🎉</h2>
                  <p className="text-gray-600 mb-8">Vul je gegevens in om je aanvraag af te ronden</p>
                  
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Naam *
                        </label>
                        <input
                          type="text"
                          value={formData.contactName}
                          onChange={(e) => updateFormData('contactName', e.target.value)}
                          placeholder="Je naam"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => updateFormData('contactEmail', e.target.value)}
                          placeholder="je@email.nl"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefoonnummer
                        </label>
                        <input
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) => updateFormData('contactPhone', e.target.value)}
                          placeholder="06 12345678"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Voorkeur voor contact
                        </label>
                        <div className="flex gap-2">
                          {[
                            { id: 'email', label: 'E-mail' },
                            { id: 'phone', label: 'Telefoon' },
                            { id: 'whatsapp', label: 'WhatsApp' },
                          ].map((option) => (
                            <button
                              key={option.id}
                              onClick={() => updateFormData('preferredContact', option.id as 'email' | 'phone' | 'whatsapp')}
                              className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                                formData.preferredContact === option.id
                                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wanneer wil je starten?
                      </label>
                      <select
                        value={formData.startDate}
                        onChange={(e) => updateFormData('startDate', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      >
                        <option value="">Selecteer...</option>
                        <option value="asap">Zo snel mogelijk</option>
                        <option value="this_week">Deze week</option>
                        <option value="this_month">Binnen een maand</option>
                        <option value="flexible">Flexibel</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nog iets dat we moeten weten?
                      </label>
                      <textarea
                        value={formData.additionalNotes}
                        onChange={(e) => updateFormData('additionalNotes', e.target.value)}
                        rows={4}
                        placeholder="Speciale wensen, deadlines, of andere informatie..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                      />
                    </div>

                    {/* Project Password */}
                    <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl border border-primary-200 p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center shadow-lg shadow-primary-500/25 flex-shrink-0">
                          <Lock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Project wachtwoord</h4>
                          <p className="text-sm text-gray-600">Kies een wachtwoord om je project te beveiligen. Je hebt dit nodig om je project status te bekijken.</p>
                        </div>
                      </div>
                      <input
                        type="password"
                        value={formData.projectPassword}
                        onChange={(e) => updateFormData('projectPassword', e.target.value)}
                        placeholder="Kies een wachtwoord (min. 4 tekens)"
                        className="w-full px-4 py-3 bg-white border border-primary-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      />
                      <p className="text-xs text-primary-600 mt-2">
                        💡 Bewaar dit wachtwoord goed! Samen met je project-ID heb je dit nodig om je project te volgen.
                      </p>
                    </div>

                    {/* Summary - Order Overview */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Jouw overzicht</h3>
                          <p className="text-sm text-gray-500">Controleer je keuzes voor je verder gaat</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        {/* Pakket */}
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3">
                            <Rocket className="w-5 h-5 text-primary-500" />
                            <span className="text-gray-600">Pakket</span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {packages.find(p => p.id === formData.package)?.name}
                          </span>
                        </div>
                        
                        {/* Website type */}
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-primary-500" />
                            <span className="text-gray-600">Type website</span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {websiteTypes.find(t => t.id === formData.websiteType)?.label}
                          </span>
                        </div>
                        
                        {/* Industry */}
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-primary-500" />
                            <span className="text-gray-600">Branche</span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {industries.find(i => i.id === formData.industry)?.label}
                          </span>
                        </div>
                        
                        {/* Business name */}
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3">
                            <Briefcase className="w-5 h-5 text-primary-500" />
                            <span className="text-gray-600">Bedrijf</span>
                          </div>
                          <span className="font-semibold text-gray-900">{formData.businessName}</span>
                        </div>
                        
                        {/* Pages count */}
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-primary-500" />
                            <span className="text-gray-600">Aantal pagina's</span>
                          </div>
                          <span className="font-semibold text-gray-900">{formData.pages.length} pagina's</span>
                        </div>
                        
                        {/* Style */}
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3">
                            <Palette className="w-5 h-5 text-primary-500" />
                            <span className="text-gray-600">Design stijl</span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {designStyles.find(s => s.id === formData.style)?.label}
                          </span>
                        </div>
                      </div>
                      
                      {/* Price breakdown */}
                      <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-5 border border-primary-100">
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-gray-700">
                            <span>Maandelijkse kosten (incl. BTW)</span>
                            <span className="font-semibold">€{packages.find(p => p.id === formData.package)?.price}/maand</span>
                          </div>
                          <div className="flex items-center justify-between text-gray-700">
                            <span>Eenmalige opstartkosten (incl. BTW)</span>
                            <span className="font-semibold">€{packages.find(p => p.id === formData.package)?.setupFee}</span>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-primary-200">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">Totaal eerste maand</span>
                            <span className="text-2xl font-bold text-primary-600">
                              €{Number(packages.find(p => p.id === formData.package)?.price || 0) + Number(packages.find(p => p.id === formData.package)?.setupFee || 0)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 text-right mt-1">
                            Daarna €{packages.find(p => p.id === formData.package)?.price}/maand • Maandelijks opzegbaar
                          </p>
                        </div>
                        {/* BTW terugkrijgen info */}
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800 text-xs font-medium flex items-center gap-2">
                            <span className="text-green-600">💡</span>
                            Als ondernemer krijg je 21% BTW terug via je belastingaangifte - een slimme investering in je bedrijf!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              </>
              )}
              
              {/* ========== DRONE FLOW ========== */}
              {formData.serviceType === 'drone' && (
                <>
                  {/* Drone Step 1: Package */}
                  {currentStep === 1 && (
                    <motion.div
                      key="drone-step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Kies je drone pakket</h2>
                      </div>
                      <p className="text-gray-600 mb-8 ml-13">Selecteer het pakket dat het beste past bij je project</p>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        {dronePackages.map((pkg) => (
                          <motion.button
                            key={pkg.id}
                            onClick={() => updateFormData('dronePackage', pkg.id as 'basis' | 'professional' | 'premium')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                              formData.dronePackage === pkg.id
                                ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg shadow-orange-500/20'
                                : 'border-gray-200 hover:border-orange-200 hover:shadow-md bg-white'
                            }`}
                          >
                            {pkg.popular && (
                              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-orange-500/30">
                                Populair
                              </span>
                            )}
                            <div className="mb-3">
                              <h3 className="font-bold text-gray-900">{pkg.name}</h3>
                            </div>
                            <div className="flex items-baseline gap-1 mb-2">
                              <span className="text-2xl font-bold text-orange-600">€{pkg.price}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                            <ul className="space-y-2">
                              {pkg.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                  <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            {formData.dronePackage === pkg.id && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-4 right-4 w-7 h-7 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg"
                              >
                                <Check className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Drone Step 2: Location */}
                  {currentStep === 2 && (
                    <motion.div
                      key="drone-step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Wat gaan we filmen?</h2>
                      <p className="text-gray-600 mb-8">Vertel ons over de locatie en het type opname</p>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-4">Type locatie</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {droneLocationTypes.map((type) => (
                              <button
                                key={type.id}
                                onClick={() => updateFormData('droneLocationType', type.id)}
                                className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                                  formData.droneLocationType === type.id
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <type.icon className={`w-5 h-5 ${formData.droneLocationType === type.id ? 'text-orange-600' : 'text-gray-400'}`} />
                                <span className={`font-medium ${formData.droneLocationType === type.id ? 'text-orange-700' : 'text-gray-700'}`}>
                                  {type.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Voorkeursdatum
                            </label>
                            <input
                              type="date"
                              value={formData.droneDate}
                              onChange={(e) => updateFormData('droneDate', e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tijdvoorkeur
                            </label>
                            <select
                              value={formData.droneTimePreference}
                              onChange={(e) => updateFormData('droneTimePreference', e.target.value)}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                            >
                              <option value="">Selecteer...</option>
                              <option value="ochtend">Ochtend (7:00 - 12:00)</option>
                              <option value="middag">Middag (12:00 - 17:00)</option>
                              <option value="golden-hour">Golden hour (rondom zonsopgang/-ondergang)</option>
                              <option value="flexibel">Flexibel</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Drone Step 3: Details */}
                  {currentStep === 3 && (
                    <motion.div
                      key="drone-step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Project details</h2>
                      <p className="text-gray-600 mb-8">Vertel ons meer over je project</p>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bedrijfsnaam / Projectnaam *
                          </label>
                          <input
                            type="text"
                            value={formData.businessName}
                            onChange={(e) => updateFormData('businessName', e.target.value)}
                            placeholder="Je bedrijf of project"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Beschrijf wat je wilt vastleggen *
                          </label>
                          <textarea
                            value={formData.droneDescription}
                            onChange={(e) => updateFormData('droneDescription', e.target.value)}
                            rows={4}
                            placeholder="Bijv. 'Luchtopnames van ons nieuwe kantoorpand, met nadruk op de architectuur en omgeving'"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Gewenste deliverables
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {['Foto\'s (JPEG)', 'RAW foto\'s', 'Video (MP4)', 'Video editing', '360° foto\'s'].map((item) => (
                              <button
                                key={item}
                                onClick={() => {
                                  if (formData.droneDeliverables.includes(item)) {
                                    updateFormData('droneDeliverables', formData.droneDeliverables.filter(d => d !== item))
                                  } else {
                                    updateFormData('droneDeliverables', [...formData.droneDeliverables, item])
                                  }
                                }}
                                className={`px-4 py-2 rounded-full border-2 transition-all ${
                                  formData.droneDeliverables.includes(item)
                                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                              >
                                {formData.droneDeliverables.includes(item) && (
                                  <Check className="w-4 h-4 inline mr-1" />
                                )}
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Drone Step 4: Call */}
                  {currentStep === 4 && (
                    <motion.div
                      key="drone-step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">📞 Korte afstemming</h2>
                      <p className="text-gray-600 mb-8">We bellen je kort om de details door te nemen</p>
                      
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <button
                            onClick={() => updateFormData('wantsCall', true)}
                            className={`p-5 rounded-xl border-2 text-left transition-all ${
                              formData.wantsCall
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className="font-medium text-gray-900 block">Ja, bel me</span>
                            <span className="text-sm text-gray-500">Om locatie en details te bespreken</span>
                          </button>
                          <button
                            onClick={() => updateFormData('wantsCall', false)}
                            className={`p-5 rounded-xl border-2 text-left transition-all ${
                              !formData.wantsCall
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className="font-medium text-gray-900 block">Liever niet</span>
                            <span className="text-sm text-gray-500">Ik ontvang liever een e-mail</span>
                          </button>
                        </div>

                        {formData.wantsCall && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4"
                          >
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Voorkeursdatum *
                                </label>
                                <input
                                  type="date"
                                  value={formData.callDate}
                                  onChange={(e) => updateFormData('callDate', e.target.value)}
                                  min={new Date().toISOString().split('T')[0]}
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Voorkeurstijd *
                                </label>
                                <select
                                  value={formData.callTime}
                                  onChange={(e) => updateFormData('callTime', e.target.value)}
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-500"
                                >
                                  <option value="">Selecteer...</option>
                                  <option value="09:00-10:00">09:00 - 10:00</option>
                                  <option value="10:00-11:00">10:00 - 11:00</option>
                                  <option value="11:00-12:00">11:00 - 12:00</option>
                                  <option value="14:00-15:00">14:00 - 15:00</option>
                                  <option value="15:00-16:00">15:00 - 16:00</option>
                                  <option value="16:00-17:00">16:00 - 17:00</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Telefoonnummer *
                              </label>
                              <input
                                type="tel"
                                value={formData.contactPhone}
                                onChange={(e) => updateFormData('contactPhone', e.target.value)}
                                placeholder="06 12345678"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                              />
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Drone Step 5: Contact */}
                  {currentStep === 5 && (
                    <motion.div
                      key="drone-step5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Laatste stap! 🎉</h2>
                      <p className="text-gray-600 mb-8">Vul je gegevens in om je aanvraag af te ronden</p>
                      
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Naam *</label>
                            <input
                              type="text"
                              value={formData.contactName}
                              onChange={(e) => updateFormData('contactName', e.target.value)}
                              placeholder="Je naam"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                            <input
                              type="email"
                              value={formData.contactEmail}
                              onChange={(e) => updateFormData('contactEmail', e.target.value)}
                              placeholder="je@email.nl"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nog iets dat we moeten weten?</label>
                          <textarea
                            value={formData.additionalNotes}
                            onChange={(e) => updateFormData('additionalNotes', e.target.value)}
                            rows={3}
                            placeholder="Speciale wensen, toegang tot locatie, etc."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 resize-none"
                          />
                        </div>

                        {/* Project Password */}
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-5">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25 flex-shrink-0">
                              <Lock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">Project wachtwoord</h4>
                              <p className="text-sm text-gray-600">Kies een wachtwoord om je project te beveiligen.</p>
                            </div>
                          </div>
                          <input
                            type="password"
                            value={formData.projectPassword}
                            onChange={(e) => updateFormData('projectPassword', e.target.value)}
                            placeholder="Kies een wachtwoord (min. 4 tekens)"
                            className="w-full px-4 py-3 bg-white border border-orange-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                          />
                          <p className="text-xs text-orange-600 mt-2">
                            💡 Bewaar dit wachtwoord goed! Samen met je project-ID heb je dit nodig om je project te volgen.
                          </p>
                        </div>

                        {/* Summary */}
                        <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                          <h3 className="font-semibold text-gray-900 mb-4">Samenvatting</h3>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Pakket:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {dronePackages.find(p => p.id === formData.dronePackage)?.name}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Locatie type:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {droneLocationTypes.find(t => t.id === formData.droneLocationType)?.label}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Project:</span>
                              <span className="ml-2 font-medium text-gray-900">{formData.businessName}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Datum:</span>
                              <span className="ml-2 font-medium text-gray-900">{formData.droneDate || 'Nog te bepalen'}</span>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-orange-200 flex items-center justify-between">
                            <span className="text-gray-600">Totaal</span>
                            <span className="text-2xl font-bold text-orange-600">
                              €{dronePackages.find(p => p.id === formData.dronePackage)?.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {/* ========== LOGO FLOW ========== */}
              {formData.serviceType === 'logo' && (
                <>
                  {/* Logo Step 1: Package */}
                  {currentStep === 1 && (
                    <motion.div
                      key="logo-step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                          <Palette className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Kies je logo pakket</h2>
                      </div>
                      <p className="text-gray-600 mb-8 ml-13">Selecteer het pakket dat het beste past bij je wensen</p>
                      
                      <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        {logoPackages.map((pkg) => (
                          <motion.button
                            key={pkg.id}
                            onClick={() => updateFormData('logoPackage', pkg.id as 'basis' | 'professional')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                              formData.logoPackage === pkg.id
                                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-violet-50 shadow-lg shadow-purple-500/20'
                                : 'border-gray-200 hover:border-purple-200 hover:shadow-md bg-white'
                            }`}
                          >
                            {pkg.popular && (
                              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-violet-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-purple-500/30">
                                Populair
                              </span>
                            )}
                            <div className="mb-3">
                              <h3 className="font-bold text-gray-900">{pkg.name}</h3>
                            </div>
                            <div className="flex items-baseline gap-1 mb-2">
                              <span className="text-2xl font-bold text-purple-600">€{pkg.price}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                            <ul className="space-y-2">
                              {pkg.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                  <Check className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            {formData.logoPackage === pkg.id && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-4 right-4 w-7 h-7 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center shadow-lg"
                              >
                                <Check className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Logo Step 2: Style */}
                  {currentStep === 2 && (
                    <motion.div
                      key="logo-step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welke stijl past bij jou?</h2>
                      <p className="text-gray-600 mb-8">Kies de stijl die het beste je merk vertegenwoordigt</p>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {logoStyles.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => updateFormData('logoStyle', style.id)}
                            className={`p-5 rounded-xl border-2 text-left transition-all ${
                              formData.logoStyle === style.id
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className={`font-semibold block mb-1 ${formData.logoStyle === style.id ? 'text-purple-700' : 'text-gray-900'}`}>
                              {style.label}
                            </span>
                            <span className="text-sm text-gray-500">{style.description}</span>
                          </button>
                        ))}
                      </div>

                      <div className="mt-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Inspiratie of voorbeelden (optioneel)
                        </label>
                        <textarea
                          value={formData.logoInspiration}
                          onChange={(e) => updateFormData('logoInspiration', e.target.value)}
                          rows={3}
                          placeholder="Links naar logo's die je aanspreken, of beschrijf wat je mooi vindt"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Logo Step 3: Details */}
                  {currentStep === 3 && (
                    <motion.div
                      key="logo-step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Over je bedrijf</h2>
                      <p className="text-gray-600 mb-8">Vertel ons meer zodat we een logo kunnen maken dat bij je past</p>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bedrijfsnaam *
                          </label>
                          <input
                            type="text"
                            value={formData.businessName}
                            onChange={(e) => updateFormData('businessName', e.target.value)}
                            placeholder="De naam die in het logo moet komen"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Wat doet je bedrijf? (optioneel)
                          </label>
                          <textarea
                            value={formData.businessDescription}
                            onChange={(e) => updateFormData('businessDescription', e.target.value)}
                            rows={2}
                            placeholder="Kort omschrijving van je diensten/producten"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Gewenste kleuren (kies 1-3) *
                          </label>
                          <div className="flex flex-wrap gap-3">
                            {colorOptions.map((color) => (
                              <button
                                key={color.id}
                                onClick={() => {
                                  if (formData.logoColors.includes(color.id)) {
                                    updateFormData('logoColors', formData.logoColors.filter(c => c !== color.id))
                                  } else if (formData.logoColors.length < 3) {
                                    updateFormData('logoColors', [...formData.logoColors, color.id])
                                  }
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                                  formData.logoColors.includes(color.id)
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: color.color }}
                                />
                                <span className="text-sm font-medium text-gray-700">{color.label}</span>
                                {formData.logoColors.includes(color.id) && (
                                  <Check className="w-4 h-4 text-purple-500" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Deadline (optioneel)
                          </label>
                          <input
                            type="date"
                            value={formData.logoDeadline}
                            onChange={(e) => updateFormData('logoDeadline', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Logo Step 4: Call */}
                  {currentStep === 4 && (
                    <motion.div
                      key="logo-step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">📞 Korte afstemming</h2>
                      <p className="text-gray-600 mb-8">We bellen je kort om je wensen te bespreken</p>
                      
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <button
                            onClick={() => updateFormData('wantsCall', true)}
                            className={`p-5 rounded-xl border-2 text-left transition-all ${
                              formData.wantsCall
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className="font-medium text-gray-900 block">Ja, bel me</span>
                            <span className="text-sm text-gray-500">Om je wensen te bespreken</span>
                          </button>
                          <button
                            onClick={() => updateFormData('wantsCall', false)}
                            className={`p-5 rounded-xl border-2 text-left transition-all ${
                              !formData.wantsCall
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className="font-medium text-gray-900 block">Liever niet</span>
                            <span className="text-sm text-gray-500">Ik ontvang liever een e-mail</span>
                          </button>
                        </div>

                        {formData.wantsCall && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4"
                          >
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Voorkeursdatum *</label>
                                <input
                                  type="date"
                                  value={formData.callDate}
                                  onChange={(e) => updateFormData('callDate', e.target.value)}
                                  min={new Date().toISOString().split('T')[0]}
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Voorkeurstijd *</label>
                                <select
                                  value={formData.callTime}
                                  onChange={(e) => updateFormData('callTime', e.target.value)}
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500"
                                >
                                  <option value="">Selecteer...</option>
                                  <option value="09:00-10:00">09:00 - 10:00</option>
                                  <option value="10:00-11:00">10:00 - 11:00</option>
                                  <option value="11:00-12:00">11:00 - 12:00</option>
                                  <option value="14:00-15:00">14:00 - 15:00</option>
                                  <option value="15:00-16:00">15:00 - 16:00</option>
                                  <option value="16:00-17:00">16:00 - 17:00</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Telefoonnummer *</label>
                              <input
                                type="tel"
                                value={formData.contactPhone}
                                onChange={(e) => updateFormData('contactPhone', e.target.value)}
                                placeholder="06 12345678"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500"
                              />
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Logo Step 5: Contact */}
                  {currentStep === 5 && (
                    <motion.div
                      key="logo-step5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Laatste stap! 🎉</h2>
                      <p className="text-gray-600 mb-8">Vul je gegevens in om je aanvraag af te ronden</p>
                      
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Naam *</label>
                            <input
                              type="text"
                              value={formData.contactName}
                              onChange={(e) => updateFormData('contactName', e.target.value)}
                              placeholder="Je naam"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                            <input
                              type="email"
                              value={formData.contactEmail}
                              onChange={(e) => updateFormData('contactEmail', e.target.value)}
                              placeholder="je@email.nl"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nog iets dat we moeten weten?</label>
                          <textarea
                            value={formData.additionalNotes}
                            onChange={(e) => updateFormData('additionalNotes', e.target.value)}
                            rows={3}
                            placeholder="Speciale wensen, elementen die in het logo moeten, etc."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                          />
                        </div>

                        {/* Project Password */}
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-200 p-5">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/25 flex-shrink-0">
                              <Lock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">Project wachtwoord</h4>
                              <p className="text-sm text-gray-600">Kies een wachtwoord om je project te beveiligen.</p>
                            </div>
                          </div>
                          <input
                            type="password"
                            value={formData.projectPassword}
                            onChange={(e) => updateFormData('projectPassword', e.target.value)}
                            placeholder="Kies een wachtwoord (min. 4 tekens)"
                            className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                          />
                          <p className="text-xs text-purple-600 mt-2">
                            💡 Bewaar dit wachtwoord goed! Samen met je project-ID heb je dit nodig om je project te volgen.
                          </p>
                        </div>

                        {/* Summary */}
                        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                          <h3 className="font-semibold text-gray-900 mb-4">Samenvatting</h3>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Pakket:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {logoPackages.find(p => p.id === formData.logoPackage)?.name}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Stijl:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {logoStyles.find(s => s.id === formData.logoStyle)?.label}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Bedrijf:</span>
                              <span className="ml-2 font-medium text-gray-900">{formData.businessName}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Kleuren:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {formData.logoColors.map(c => colorOptions.find(co => co.id === c)?.label).join(', ')}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-purple-200 flex items-center justify-between">
                            <span className="text-gray-600">Totaal</span>
                            <span className="text-2xl font-bold text-purple-600">
                              €{logoPackages.find(p => p.id === formData.logoPackage)?.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {/* ========== WEBSHOP FLOW ========== */}
              {formData.serviceType === 'webshop' && (
                <>
                  {/* Webshop Step 1: Package */}
                  {currentStep === 1 && (
                    <motion.div
                      key="webshop-step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Kies je webshop pakket</h2>
                      </div>
                      <p className="text-gray-600 mb-8 ml-13">Selecteer het pakket dat het beste bij je past</p>
                      
                      <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        {webshopPackages.map((pkg) => (
                          <motion.button
                            key={pkg.id}
                            onClick={() => {
                              updateFormData('webshopPackage', pkg.id as 'starter' | 'professional')
                              updateFormData('webshopProductCount', '') // Reset product count when changing package
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                              formData.webshopPackage === pkg.id
                                ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg shadow-emerald-500/20'
                                : 'border-gray-200 hover:border-emerald-200 hover:shadow-md bg-white'
                            }`}
                          >
                            {pkg.popular && (
                              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-emerald-500/30">
                                Populair
                              </span>
                            )}
                            <div className="mb-3">
                              <h3 className="font-bold text-gray-900">{pkg.name}</h3>
                            </div>
                            <div className="flex items-baseline gap-1 mb-1">
                              <span className="text-2xl font-bold text-emerald-600">€{pkg.price}</span>
                              <span className="text-gray-500 text-sm">/maand</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">+ €{pkg.setupFee} eenmalige opstartkosten</p>
                            <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                            <ul className="space-y-1">
                              {pkg.features.map((feature) => (
                                <li key={feature} className="text-sm text-gray-600 flex items-center gap-2">
                                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            {formData.webshopPackage === pkg.id && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-4 right-4 w-7 h-7 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg"
                              >
                                <Check className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Webshop Step 2: Products & Business */}
                  {currentStep === 2 && (
                    <motion.div
                      key="webshop-step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Over je webshop</h2>
                      <p className="text-gray-600 mb-8">Vertel ons meer over wat je wilt verkopen</p>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bedrijfsnaam *</label>
                          <input
                            type="text"
                            value={formData.businessName}
                            onChange={(e) => updateFormData('businessName', e.target.value)}
                            placeholder="De naam van je bedrijf of webshop"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Wat ga je verkopen?</label>
                          <textarea
                            value={formData.businessDescription}
                            onChange={(e) => updateFormData('businessDescription', e.target.value)}
                            rows={3}
                            placeholder="Beschrijf kort je producten of diensten"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Hoeveel producten wil je verkopen? *</label>
                          <div className={`grid gap-3 ${
                            (webshopPackages.find(p => p.id === formData.webshopPackage)?.productCountOptions?.length || 3) <= 3 
                              ? 'md:grid-cols-3' 
                              : 'md:grid-cols-4'
                          }`}>
                            {(webshopPackages.find(p => p.id === formData.webshopPackage)?.productCountOptions || ['1-25', '25-50']).map((count) => (
                              <button
                                key={count}
                                onClick={() => updateFormData('webshopProductCount', count)}
                                className={`p-4 rounded-xl border-2 text-center transition-all ${
                                  formData.webshopProductCount === count
                                    ? 'border-emerald-500 bg-emerald-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <span className={`font-semibold ${formData.webshopProductCount === count ? 'text-emerald-700' : 'text-gray-900'}`}>
                                  {count}
                                </span>
                                <span className="text-sm text-gray-500 block">producten</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Heb je al een webshop of is dit nieuw?</label>
                          <div className="grid md:grid-cols-2 gap-3">
                            <button
                              onClick={() => updateFormData('webshopPlatform', 'nieuw')}
                              className={`p-4 rounded-xl border-2 text-left transition-all ${
                                formData.webshopPlatform === 'nieuw'
                                  ? 'border-emerald-500 bg-emerald-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <span className={`font-semibold block ${formData.webshopPlatform === 'nieuw' ? 'text-emerald-700' : 'text-gray-900'}`}>
                                Nieuwe webshop
                              </span>
                              <span className="text-sm text-gray-500">Ik start helemaal opnieuw</span>
                            </button>
                            <button
                              onClick={() => updateFormData('webshopPlatform', 'migratie')}
                              className={`p-4 rounded-xl border-2 text-left transition-all ${
                                formData.webshopPlatform === 'migratie'
                                  ? 'border-emerald-500 bg-emerald-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <span className={`font-semibold block ${formData.webshopPlatform === 'migratie' ? 'text-emerald-700' : 'text-gray-900'}`}>
                                Migratie
                              </span>
                              <span className="text-sm text-gray-500">Ik heb al een webshop elders</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Webshop Step 3: Design Preferences */}
                  {currentStep === 3 && (
                    <motion.div
                      key="webshop-step3-design"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">🎨 Design voorkeuren</h2>
                      <p className="text-gray-600 mb-8">Hoe moet jouw webshop eruit zien?</p>
                      
                      <div className="space-y-8">
                        {/* Style preference */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-4">Welke stijl past bij je merk? *</label>
                          <div className="grid md:grid-cols-3 gap-3">
                            {[
                              { id: 'modern', label: 'Modern & Clean', desc: 'Strakke lijnen, veel witruimte' },
                              { id: 'bold', label: 'Bold & Opvallend', desc: 'Sterke kleuren, grote fonts' },
                              { id: 'elegant', label: 'Elegant & Premium', desc: 'Luxe uitstraling, subtiele details' },
                              { id: 'playful', label: 'Speels & Creatief', desc: 'Vrolijke kleuren, unieke vormen' },
                              { id: 'minimalist', label: 'Minimalistisch', desc: 'Eenvoud, focus op product' },
                              { id: 'traditional', label: 'Klassiek & Betrouwbaar', desc: 'Tijdloos, professioneel' },
                            ].map((style) => (
                              <button
                                key={style.id}
                                onClick={() => updateFormData('webshopStyle', style.id)}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${
                                  formData.webshopStyle === style.id
                                    ? 'border-emerald-500 bg-emerald-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <span className={`font-semibold block ${formData.webshopStyle === style.id ? 'text-emerald-700' : 'text-gray-900'}`}>
                                  {style.label}
                                </span>
                                <span className="text-sm text-gray-500">{style.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Colors */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-4">Welke kleuren passen bij je merk? (max. 3)</label>
                          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-4">
                            {[
                              { id: 'blue', color: '#3B82F6', label: 'Blauw' },
                              { id: 'green', color: '#10B981', label: 'Groen' },
                              { id: 'purple', color: '#8B5CF6', label: 'Paars' },
                              { id: 'red', color: '#EF4444', label: 'Rood' },
                              { id: 'orange', color: '#F97316', label: 'Oranje' },
                              { id: 'yellow', color: '#EAB308', label: 'Geel' },
                              { id: 'pink', color: '#EC4899', label: 'Roze' },
                              { id: 'teal', color: '#14B8A6', label: 'Teal' },
                              { id: 'black', color: '#1F2937', label: 'Zwart' },
                              { id: 'gray', color: '#6B7280', label: 'Grijs' },
                              { id: 'brown', color: '#92400E', label: 'Bruin' },
                              { id: 'gold', color: '#D4AF37', label: 'Goud' },
                            ].map((color) => (
                              <button
                                key={color.id}
                                onClick={() => {
                                  if (formData.webshopColors.includes(color.id)) {
                                    updateFormData('webshopColors', formData.webshopColors.filter(c => c !== color.id))
                                  } else if (formData.webshopColors.length < 3) {
                                    updateFormData('webshopColors', [...formData.webshopColors, color.id])
                                  }
                                }}
                                className={`aspect-square rounded-xl border-2 transition-all relative ${
                                  formData.webshopColors.includes(color.id)
                                    ? 'border-emerald-500 ring-2 ring-emerald-200'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                style={{ backgroundColor: color.color }}
                                title={color.label}
                              >
                                {formData.webshopColors.includes(color.id) && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-white drop-shadow-lg" />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-2">Of voer een custom kleurcode in (hex)</label>
                            <input
                              type="text"
                              value={formData.webshopCustomColor}
                              onChange={(e) => updateFormData('webshopCustomColor', e.target.value)}
                              placeholder="#FF5733"
                              className="w-full max-w-xs px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        {/* Example sites */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Voorbeeldwebsites (optioneel)</label>
                          <p className="text-sm text-gray-500 mb-4">Ken je webshops die je mooi vindt? Deel ze met ons!</p>
                          <div className="space-y-3">
                            {formData.webshopExampleSites.map((site, index) => (
                              <input
                                key={index}
                                type="url"
                                value={site}
                                onChange={(e) => {
                                  const newSites = [...formData.webshopExampleSites]
                                  newSites[index] = e.target.value
                                  updateFormData('webshopExampleSites', newSites)
                                }}
                                placeholder={`https://voorbeeld${index + 1}.nl`}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                              />
                            ))}
                          </div>
                        </div>

                        {/* Brand assets */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bestaande huisstijl of branding?</label>
                          <textarea
                            value={formData.webshopBrandAssets}
                            onChange={(e) => updateFormData('webshopBrandAssets', e.target.value)}
                            rows={3}
                            placeholder="Heb je al een logo, huisstijlgids of specifieke fonts? Beschrijf het hier of stuur ze later naar ons."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Webshop Step 4: Features & Payment */}
                  {currentStep === 4 && (
                    <motion.div
                      key="webshop-step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Functionaliteiten</h2>
                      <p className="text-gray-600 mb-8">Welke betaalmethodes en functies wil je?</p>
                      
                      <div className="space-y-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-4">Betaalmethodes *</label>
                          <div className="grid md:grid-cols-3 gap-3">
                            {['iDEAL', 'Creditcard', 'PayPal', 'Klarna', 'Bancontact', 'Apple Pay'].map((method) => (
                              <button
                                key={method}
                                onClick={() => {
                                  if (formData.webshopPaymentMethods.includes(method)) {
                                    updateFormData('webshopPaymentMethods', formData.webshopPaymentMethods.filter(m => m !== method))
                                  } else {
                                    updateFormData('webshopPaymentMethods', [...formData.webshopPaymentMethods, method])
                                  }
                                }}
                                className={`p-3 rounded-xl border-2 text-center transition-all ${
                                  formData.webshopPaymentMethods.includes(method)
                                    ? 'border-emerald-500 bg-emerald-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                {formData.webshopPaymentMethods.includes(method) && (
                                  <Check className="w-4 h-4 inline mr-1 text-emerald-600" />
                                )}
                                <span className={formData.webshopPaymentMethods.includes(method) ? 'text-emerald-700' : 'text-gray-700'}>
                                  {method}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-4">Extra functies (optioneel)</label>
                          <div className="grid md:grid-cols-2 gap-3">
                            {[
                              { id: 'voorraad', label: 'Voorraadbeheer', desc: 'Automatisch bijhouden' },
                              { id: 'kortingscodes', label: 'Kortingscodes', desc: 'Acties en promoties' },
                              { id: 'reviews', label: 'Productreviews', desc: 'Klantbeoordelingen' },
                              { id: 'nieuwsbrief', label: 'Nieuwsbrief', desc: 'E-mail marketing' },
                              { id: 'analytics', label: 'Analytics', desc: 'Verkoop statistieken' },
                              { id: 'multiValuta', label: 'Multi-valuta', desc: 'Internationale verkoop' },
                            ].map((feature) => (
                              <button
                                key={feature.id}
                                onClick={() => {
                                  if (formData.webshopFeatures.includes(feature.id)) {
                                    updateFormData('webshopFeatures', formData.webshopFeatures.filter(f => f !== feature.id))
                                  } else {
                                    updateFormData('webshopFeatures', [...formData.webshopFeatures, feature.id])
                                  }
                                }}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${
                                  formData.webshopFeatures.includes(feature.id)
                                    ? 'border-emerald-500 bg-emerald-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className={`font-semibold ${formData.webshopFeatures.includes(feature.id) ? 'text-emerald-700' : 'text-gray-900'}`}>
                                    {feature.label}
                                  </span>
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                    formData.webshopFeatures.includes(feature.id) ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                                  }`}>
                                    {formData.webshopFeatures.includes(feature.id) && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500">{feature.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Verzending</label>
                          <div className="grid md:grid-cols-3 gap-3">
                            {['Alleen NL', 'NL + BE', 'Heel Europa', 'Wereldwijd'].map((option) => (
                              <button
                                key={option}
                                onClick={() => updateFormData('webshopShipping', option)}
                                className={`p-3 rounded-xl border-2 text-center transition-all ${
                                  formData.webshopShipping === option
                                    ? 'border-emerald-500 bg-emerald-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <span className={formData.webshopShipping === option ? 'text-emerald-700 font-medium' : 'text-gray-700'}>
                                  {option}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Webshop Step 4: Call Scheduling (reuse pattern) */}
                  {currentStep === 5 && (
                    <motion.div
                      key="webshop-step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">📞 Kennismakingsgesprek</h2>
                      <p className="text-gray-600 mb-8">Wil je een kort gesprek plannen om je webshop te bespreken?</p>
                      
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <button
                            onClick={() => updateFormData('wantsCall', true)}
                            className={`p-5 rounded-xl border-2 text-left transition-all ${
                              formData.wantsCall
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className={`font-semibold block ${formData.wantsCall ? 'text-emerald-700' : 'text-gray-900'}`}>
                              Ja, graag!
                            </span>
                            <span className="text-sm text-gray-500">Plan een gratis gesprek in</span>
                          </button>
                          <button
                            onClick={() => updateFormData('wantsCall', false)}
                            className={`p-5 rounded-xl border-2 text-left transition-all ${
                              !formData.wantsCall
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className={`font-semibold block ${!formData.wantsCall ? 'text-emerald-700' : 'text-gray-900'}`}>
                              Nee, niet nodig
                            </span>
                            <span className="text-sm text-gray-500">Ga direct door naar contact</span>
                          </button>
                        </div>

                        {formData.wantsCall && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4 pt-4 border-t border-gray-200"
                          >
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Voorkeursdatum *</label>
                                <input
                                  type="date"
                                  value={formData.callDate}
                                  onChange={(e) => updateFormData('callDate', e.target.value)}
                                  min={new Date().toISOString().split('T')[0]}
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Voorkeurstijd *</label>
                                <select
                                  value={formData.callTime}
                                  onChange={(e) => updateFormData('callTime', e.target.value)}
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                                >
                                  <option value="">Selecteer een tijd</option>
                                  <option value="09:00">09:00</option>
                                  <option value="10:00">10:00</option>
                                  <option value="11:00">11:00</option>
                                  <option value="13:00">13:00</option>
                                  <option value="14:00">14:00</option>
                                  <option value="15:00">15:00</option>
                                  <option value="16:00">16:00</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Telefoonnummer *</label>
                              <input
                                type="tel"
                                value={formData.contactPhone}
                                onChange={(e) => updateFormData('contactPhone', e.target.value)}
                                placeholder="06 12345678"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Webshop Step 5: Contact & Summary */}
                  {currentStep === 6 && (
                    <motion.div
                      key="webshop-step5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Laatste stap! 🛒</h2>
                      <p className="text-gray-600 mb-8">Vul je gegevens in om je aanvraag af te ronden</p>
                      
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Naam *</label>
                            <input
                              type="text"
                              value={formData.contactName}
                              onChange={(e) => updateFormData('contactName', e.target.value)}
                              placeholder="Je naam"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                            <input
                              type="email"
                              value={formData.contactEmail}
                              onChange={(e) => updateFormData('contactEmail', e.target.value)}
                              placeholder="je@email.nl"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nog iets dat we moeten weten?</label>
                          <textarea
                            value={formData.additionalNotes}
                            onChange={(e) => updateFormData('additionalNotes', e.target.value)}
                            rows={3}
                            placeholder="Speciale wensen, integraties, etc."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        {/* Project Password */}
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 p-5">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 flex-shrink-0">
                              <Lock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">Project wachtwoord</h4>
                              <p className="text-sm text-gray-600">Kies een wachtwoord om je project te beveiligen.</p>
                            </div>
                          </div>
                          <input
                            type="password"
                            value={formData.projectPassword}
                            onChange={(e) => updateFormData('projectPassword', e.target.value)}
                            placeholder="Kies een wachtwoord (min. 4 tekens)"
                            className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          />
                          <p className="text-xs text-emerald-600 mt-2">
                            💡 Bewaar dit wachtwoord goed! Samen met je project-ID heb je dit nodig om je project te volgen.
                          </p>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200 p-6">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                              <ShoppingBag className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">Jouw webshop overzicht</h3>
                              <p className="text-sm text-gray-500">Controleer je keuzes</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-100">
                              <span className="text-gray-600">Pakket</span>
                              <span className="font-semibold text-gray-900">
                                {webshopPackages.find(p => p.id === formData.webshopPackage)?.name}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-100">
                              <span className="text-gray-600">Bedrijfsnaam</span>
                              <span className="font-semibold text-gray-900">{formData.businessName}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-100">
                              <span className="text-gray-600">Aantal producten</span>
                              <span className="font-semibold text-gray-900">{formData.webshopProductCount}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-100">
                              <span className="text-gray-600">Design stijl</span>
                              <span className="font-semibold text-gray-900">
                                {formData.webshopStyle === 'modern' && 'Modern & Clean'}
                                {formData.webshopStyle === 'bold' && 'Bold & Opvallend'}
                                {formData.webshopStyle === 'elegant' && 'Elegant & Premium'}
                                {formData.webshopStyle === 'playful' && 'Speels & Creatief'}
                                {formData.webshopStyle === 'minimalist' && 'Minimalistisch'}
                                {formData.webshopStyle === 'traditional' && 'Klassiek & Betrouwbaar'}
                              </span>
                            </div>
                            {formData.webshopColors.length > 0 && (
                              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-100">
                                <span className="text-gray-600">Kleuren</span>
                                <div className="flex gap-1">
                                  {formData.webshopColors.map(colorId => {
                                    const colorMap: Record<string, string> = {
                                      blue: '#3B82F6', green: '#10B981', purple: '#8B5CF6', red: '#EF4444',
                                      orange: '#F97316', yellow: '#EAB308', pink: '#EC4899', teal: '#14B8A6',
                                      black: '#1F2937', gray: '#6B7280', brown: '#92400E', gold: '#D4AF37'
                                    }
                                    return (
                                      <div
                                        key={colorId}
                                        className="w-6 h-6 rounded-full border border-gray-200"
                                        style={{ backgroundColor: colorMap[colorId] || colorId }}
                                      />
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-100">
                              <span className="text-gray-600">Betaalmethodes</span>
                              <span className="font-semibold text-gray-900">{formData.webshopPaymentMethods.length} geselecteerd</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-100">
                              <span className="text-gray-600">Extra features</span>
                              <span className="font-semibold text-gray-900">{formData.webshopFeatures.length} geselecteerd</span>
                            </div>
                          </div>
                          
                          {/* Price breakdown */}
                          <div className="bg-white rounded-xl p-5 border border-emerald-200">
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center justify-between text-gray-700">
                                <span>Maandelijkse kosten (incl. BTW)</span>
                                <span className="font-semibold">€{webshopPackages.find(p => p.id === formData.webshopPackage)?.price}/maand</span>
                              </div>
                              <div className="flex items-center justify-between text-gray-700">
                                <span>Eenmalige opstartkosten (incl. BTW)</span>
                                <span className="font-semibold">€{webshopPackages.find(p => p.id === formData.webshopPackage)?.setupFee}</span>
                              </div>
                            </div>
                            <div className="pt-4 border-t border-emerald-100">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">Totaal eerste maand</span>
                                <span className="text-2xl font-bold text-emerald-600">
                                  €{Number(webshopPackages.find(p => p.id === formData.webshopPackage)?.price || 0) + Number(webshopPackages.find(p => p.id === formData.webshopPackage)?.setupFee || 0)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 text-right mt-1">
                                Daarna €{webshopPackages.find(p => p.id === formData.webshopPackage)?.price}/maand • Maandelijks opzegbaar
                              </p>
                            </div>
                            {/* BTW terugkrijgen info */}
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-green-800 text-xs font-medium flex items-center gap-2">
                                <span className="text-green-600">💡</span>
                                Als ondernemer krijg je 21% BTW terug via je belastingaangifte - een slimme investering in je bedrijf!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="group flex items-center gap-2 px-5 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Vorige</span>
              </button>

              {currentStep < totalSteps ? (
                <motion.button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  whileHover={{ scale: canProceed() ? 1.02 : 1 }}
                  whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                  className={`group relative flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden ${
                    formData.serviceType === 'drone'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30'
                      : formData.serviceType === 'logo'
                        ? 'bg-gradient-to-r from-purple-500 to-violet-500 shadow-lg shadow-purple-500/30'
                        : formData.serviceType === 'webshop'
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30'
                          : 'bg-gradient-to-r from-primary-500 to-blue-500 shadow-lg shadow-primary-500/30'
                  }`}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative">Volgende stap</span>
                  <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  whileHover={{ scale: canProceed() && !isSubmitting ? 1.02 : 1 }}
                  whileTap={{ scale: canProceed() && !isSubmitting ? 0.98 : 1 }}
                  className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-500/30 overflow-hidden"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin relative" />
                      <span className="relative">Verzenden...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5 relative" />
                      <span className="relative">Verstuur aanvraag</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
          </motion.div>
        </div>
        
        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 mt-12"
        >
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Geen verplichtingen</p>
                <p className="text-sm text-gray-500">Vrijblijvende offerte</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Snel geleverd</p>
                <p className="text-sm text-gray-500">Binnen 7 dagen live</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">150+ klanten</p>
                <p className="text-sm text-gray-500">Tevreden ondernemers</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer ctaVariant="none" />
    </div>
  )
}
