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
  Loader2
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

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
interface FormData {
  // Step 1: Package
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
  exampleSites: string[]
  
  // Step 7: Content
  pages: string[]
  hasContent: boolean
  contentNotes: string
  
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
}

const initialFormData: FormData = {
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
  exampleSites: ['', '', ''],
  pages: ['Home', 'Over ons', 'Contact'],
  hasContent: false,
  contentNotes: '',
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
}

const packages = [
  {
    id: 'starter',
    name: 'Starter',
    price: '79',
    setupFee: '99',
    description: 'Perfect voor ZZP\'ers en starters',
    features: ['5 pagina\'s', 'Mobiel-vriendelijk', 'Contactformulier', 'SEO basis'],
  },
  {
    id: 'professional',
    name: 'Professioneel',
    price: '149',
    setupFee: '149',
    description: 'Voor groeiende bedrijven',
    features: ['10 pagina\'s', 'Blog/nieuws', 'Google Analytics', 'Premium support'],
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '249',
    setupFee: '199',
    description: 'Volledige zakelijke website',
    features: ['Onbeperkt pagina\'s', 'Webshop ready', 'Geavanceerde SEO', 'Prioriteit support'],
  },
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
  
  const [currentStep, setCurrentStep] = useState(hasPreselectedPackage ? 2 : 1)
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    package: hasPreselectedPackage ? preselectedPackage : null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newExampleSite, setNewExampleSite] = useState('')

  // Scroll to form on page load
  useEffect(() => {
    // Wait for page to render, then scroll to form
    const timer = setTimeout(() => {
      if (formRef.current) {
        const yOffset = -80 // Account for fixed header
        const element = formRef.current
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }, 150)
    return () => clearTimeout(timer)
  }, [])

  const totalSteps = 9

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return formData.package !== null
      case 2: return formData.websiteType !== ''
      case 3: return formData.industry !== ''
      case 4: return formData.domainOption !== 'new' || formData.domainName !== ''
      case 5: return formData.businessName !== ''
      case 6: return formData.style !== ''
      case 7: return formData.pages.length > 0
      case 8: return !formData.wantsCall || (formData.callDate !== '' && formData.callTime !== '' && formData.contactPhone !== '')
      case 9: return formData.contactName !== '' && formData.contactEmail !== ''
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

    // Build email content
    const selectedPackage = packages.find(p => p.id === formData.package)
    
    // Generate project ID
    const projectId = `WS-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    
    // Format call date if scheduled
    const formattedCallDate = formData.callDate 
      ? new Date(formData.callDate).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      : ''
    
    const emailContent = `
NIEUW PROJECT AANVRAAG - ${formData.businessName}
================================================
PROJECT ID: ${projectId}

📦 PAKKET
---------
${selectedPackage?.name} - €${selectedPackage?.price}/maand
Opstartkosten: €${selectedPackage?.setupFee}

📞 GEPLAND GESPREK
------------------
Gesprek gewenst: ${formData.wantsCall ? 'Ja' : 'Nee'}
${formData.wantsCall ? `Datum: ${formattedCallDate}
Tijd: ${formData.callTime}
Onderwerpen: ${formData.callTopics.join(', ') || 'Algemeen kennismakingsgesprek'}` : ''}

🌐 WEBSITE TYPE
---------------
Type: ${websiteTypes.find(t => t.id === formData.websiteType)?.label}
Branche: ${industries.find(i => i.id === formData.industry)?.label}

🔗 DOMEIN
---------
Optie: ${formData.domainOption === 'new' ? 'Nieuw domein registreren' : formData.domainOption === 'existing' ? 'Bestaand domein' : 'Hulp nodig'}
Domeinnaam: ${formData.domainName || 'Nog niet bekend'}

🏢 BEDRIJFSGEGEVENS
-------------------
Bedrijfsnaam: ${formData.businessName}
Beschrijving: ${formData.businessDescription || 'Niet ingevuld'}
Logo: ${formData.logoUrl || 'Niet geüpload'}

🎨 DESIGN VOORKEUREN
--------------------
Stijl: ${designStyles.find(s => s.id === formData.style)?.label}
Kleuren: ${formData.colors.map(c => colorOptions.find(co => co.id === c)?.label).join(', ') || 'Geen voorkeur'}
Voorbeeldsites: ${formData.exampleSites.filter(s => s).join(', ') || 'Geen opgegeven'}

📄 PAGINA'S
-----------
${formData.pages.join(', ')}
Eigen content: ${formData.hasContent ? 'Ja' : 'Nee, hulp nodig'}
Content notities: ${formData.contentNotes || 'Geen'}

👤 CONTACTGEGEVENS
------------------
Naam: ${formData.contactName}
Email: ${formData.contactEmail}
Telefoon: ${formData.contactPhone || 'Niet opgegeven'}
Voorkeur contact: ${formData.preferredContact === 'email' ? 'E-mail' : formData.preferredContact === 'phone' ? 'Telefoon' : 'WhatsApp'}
Gewenste startdatum: ${formData.startDate || 'Zo snel mogelijk'}

📝 EXTRA OPMERKINGEN
--------------------
${formData.additionalNotes || 'Geen'}
    `

    try {
      // Send notification email to Webstability
      await fetch('https://formsubmit.co/ajax/hallo@webstability.nl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `🚀 Nieuw project: ${formData.businessName} - ${selectedPackage?.name}${formData.wantsCall ? ` 📞 GESPREK: ${formattedCallDate} ${formData.callTime}` : ''}`,
          message: emailContent,
          businessName: formData.businessName,
          package: selectedPackage?.name,
          email: formData.contactEmail,
          phone: formData.contactPhone,
          projectId: projectId,
          callScheduled: formData.wantsCall,
          callDate: formData.callDate,
          callTime: formData.callTime,
        }),
      })

      // Send welcome email to customer using Formspree (with auto-response)
      // Using a separate form for customer confirmation
      await fetch('https://formsubmit.co/ajax/' + formData.contactEmail, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `Welkom bij Webstability! 🎉 Je project ${projectId}`,
          _template: 'box',
          name: formData.contactName,
          message: `
Hoi ${formData.contactName.split(' ')[0]}!

Bedankt voor je aanvraag bij Webstability! We hebben alles ontvangen en gaan direct voor je aan de slag.

📋 JOUW PROJECT
---------------
Project ID: ${projectId}
Pakket: ${selectedPackage?.name} (€${selectedPackage?.price}/maand)
Bedrijf: ${formData.businessName}

${formData.wantsCall ? `📞 GEPLAND TELEFOONGESPREK
--------------------------
Datum: ${formattedCallDate}
Tijd: ${formData.callTime}

We bellen je op het nummer: ${formData.contactPhone}
Zorg dat je bereikbaar bent!` : ''}

🚀 VOLGENDE STAPPEN
-------------------
1. ${formData.wantsCall ? 'We bellen je op het afgesproken moment' : 'We nemen binnen 24 uur contact met je op'}
2. Verzamel alvast je materialen: https://webstability.nl/klant-onboarding
3. Bekijk je projectstatus: https://webstability.nl/project-status

Vragen? Reply op deze email of WhatsApp ons: 06 44712573

Met vriendelijke groet,
Het Webstability Team
          `,
        }),
      }).catch(() => {
        // Silent fail for customer email - main submission still succeeded
        console.log('Customer confirmation email failed, but main submission succeeded')
      })

      // Save to localStorage for dashboard
      const submission = {
        id: projectId,
        timestamp: new Date().toISOString(),
        package: formData.package,
        websiteType: websiteTypes.find(t => t.id === formData.websiteType)?.label || formData.websiteType,
        industry: industries.find(i => i.id === formData.industry)?.label || formData.industry,
        domain: formData.domainName,
        domainStatus: formData.domainOption,
        businessName: formData.businessName,
        tagline: '',
        description: formData.businessDescription,
        primaryColor: formData.colors[0] ? colorOptions.find(c => c.id === formData.colors[0])?.color || '' : '',
        style: designStyles.find(s => s.id === formData.style)?.label || formData.style,
        exampleSites: formData.exampleSites.filter(s => s).join(', '),
        pages: formData.pages,
        content: formData.contentNotes,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        remarks: formData.additionalNotes,
        // New call scheduling fields
        callScheduled: formData.wantsCall,
        callDate: formData.callDate,
        callTime: formData.callTime,
        callTopics: formData.callTopics,
      }
      
      const existingSubmissions = JSON.parse(localStorage.getItem('webstability_submissions') || '[]')
      existingSubmissions.push(submission)
      localStorage.setItem('webstability_submissions', JSON.stringify(existingSubmissions))

      // Redirect to thank you page
      navigate('/bedankt')
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
    if (formData.pages.includes(page)) {
      updateFormData('pages', formData.pages.filter(p => p !== page))
    } else {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            >
              Start je project
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-lg"
            >
              Beantwoord een paar vragen zodat we direct aan de slag kunnen
            </motion.p>
          </div>

          {/* Progress bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Stap {currentStep} van {totalSteps}</span>
              <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}% voltooid</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
              />
            </div>
          </div>

          {/* Steps */}
          <div ref={formRef} className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 md:p-12 scroll-mt-24">
            <AnimatePresence mode="wait">
              {/* Step 1: Package */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Kies je pakket</h2>
                  <p className="text-gray-600 mb-8">Selecteer het pakket dat het beste bij je past</p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => updateFormData('package', pkg.id as 'starter' | 'professional' | 'business')}
                        className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                          formData.package === pkg.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {pkg.popular && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full">
                            Populair
                          </span>
                        )}
                        <h3 className="font-bold text-gray-900 mb-1">{pkg.name}</h3>
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-2xl font-bold text-primary-600">€{pkg.price}</span>
                          <span className="text-gray-500 text-sm">/maand</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Eenmalig €{pkg.setupFee}</p>
                        <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                        <ul className="space-y-2">
                          {pkg.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="w-4 h-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        {formData.package === pkg.id && (
                          <div className="absolute top-4 right-4 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
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
                        onClick={() => updateFormData('websiteType', type.id)}
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
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
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
                    {/* Page selection */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Selecteer je pagina's</h3>
                      <div className="flex flex-wrap gap-2">
                        {defaultPages.map((page) => (
                          <button
                            key={page}
                            onClick={() => togglePage(page)}
                            className={`px-4 py-2 rounded-full border-2 transition-all ${
                              formData.pages.includes(page)
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {formData.pages.includes(page) && (
                              <Check className="w-4 h-4 inline mr-1" />
                            )}
                            {page}
                          </button>
                        ))}
                      </div>
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

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Samenvatting</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Pakket:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {packages.find(p => p.id === formData.package)?.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {websiteTypes.find(t => t.id === formData.websiteType)?.label}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Bedrijf:</span>
                          <span className="ml-2 font-medium text-gray-900">{formData.businessName}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Pagina's:</span>
                          <span className="ml-2 font-medium text-gray-900">{formData.pages.length} pagina's</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-gray-600">Totaal per maand</span>
                        <span className="text-2xl font-bold text-primary-600">
                          €{packages.find(p => p.id === formData.package)?.price}/maand
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        + eenmalig €{packages.find(p => p.id === formData.package)?.setupFee} opstartkosten
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Vorige</span>
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-8 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/25"
                >
                  <span>Volgende</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-500/25"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verzenden...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      <span>Verstuur aanvraag</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
