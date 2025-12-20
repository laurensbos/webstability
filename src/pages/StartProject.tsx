import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { 
  Globe, 
  ShoppingBag, 
  Plane,
  PenTool,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import QuickStartForm from '../components/QuickStartForm'

type ServiceType = 'website' | 'webshop' | 'drone' | 'logo'
type SelectedServiceType = ServiceType | null
type PackageType = 'starter' | 'professional' | 'business'

interface ServiceOption {
  id: ServiceType
  name: string
  description: string
  icon: React.ElementType
  price: string
  priceNote: string
  setupNote?: string
  color: string
  gradient: string
  features: string[]
  popular?: boolean
}

interface PackageOption {
  id: PackageType
  name: string
  price: number
  setupFee?: number
  priceNote: string
  features: string[]
}

// Packages per service type
const packagesByService: Record<ServiceType, PackageOption[]> = {
  website: [
    {
      id: 'starter',
      name: 'Starter',
      price: 99,
      setupFee: 99,
      priceNote: 'per maand incl. btw',
      features: ['1-5 pagina\'s', 'Mobiel-vriendelijk', 'Contactformulier', 'SSL certificaat'],
    },
    {
      id: 'professional',
      name: 'Professioneel',
      price: 149,
      setupFee: 179,
      priceNote: 'per maand incl. btw',
      features: ['5-10 pagina\'s', 'Blog functie', 'Google Analytics', 'Maandelijkse updates'],
    },
    {
      id: 'business',
      name: 'Business',
      price: 199,
      setupFee: 239,
      priceNote: 'per maand incl. btw',
      features: ['Onbeperkt pagina\'s', 'CMS systeem', 'Prioriteit support', 'Geavanceerde SEO'],
    },
  ],
  webshop: [
    {
      id: 'starter',
      name: 'Starter',
      price: 349,
      setupFee: 249,
      priceNote: 'per maand incl. btw',
      features: ['Tot 100 producten', 'iDEAL betaling', 'Voorraadbeheer', 'Basis analytics'],
    },
    {
      id: 'professional',
      name: 'Professioneel',
      price: 449,
      setupFee: 349,
      priceNote: 'per maand incl. btw',
      features: ['Tot 500 producten', 'Alle betaalmethodes', 'Kortingscodes', 'Klantaccounts'],
    },
    {
      id: 'business',
      name: 'Business',
      price: 599,
      setupFee: 449,
      priceNote: 'per maand incl. btw',
      features: ['Onbeperkt producten', 'Multi-valuta', 'API koppelingen', 'Dedicated support'],
    },
  ],
  drone: [
    {
      id: 'starter',
      name: 'Basis',
      price: 349,
      priceNote: 'eenmalig incl. btw',
      features: ['10 bewerkte foto\'s', '1 locatie', 'Digitale levering', 'Binnen 5 dagen'],
    },
    {
      id: 'professional',
      name: 'Professioneel',
      price: 549,
      priceNote: 'eenmalig incl. btw',
      features: ['25 bewerkte foto\'s', '1-2 locaties', '1 min video', 'Binnen 3 dagen'],
    },
    {
      id: 'business',
      name: 'Premium',
      price: 849,
      priceNote: 'eenmalig incl. btw',
      features: ['50+ foto\'s', 'Meerdere locaties', '3 min video', 'Spoedlevering'],
    },
  ],
  logo: [],  // No packages for logo - single service
}

const services: ServiceOption[] = [
  {
    id: 'website',
    name: 'Website',
    description: 'Professionele website voor je bedrijf',
    icon: Globe,
    price: 'Vanaf €99',
    priceNote: 'per maand incl. btw',
    setupNote: '+ eenmalige opstartkosten vanaf €99',
    color: 'primary',
    gradient: 'from-primary-500 to-blue-600',
    features: ['Mobiel-vriendelijk', 'SEO geoptimaliseerd', 'Contactformulier', 'Hosting inbegrepen'],
    popular: true,
  },
  {
    id: 'webshop',
    name: 'Webshop',
    description: 'Verkoop online met je eigen shop',
    icon: ShoppingBag,
    price: 'Vanaf €349',
    priceNote: 'per maand incl. btw',
    setupNote: '+ eenmalige opstartkosten vanaf €249',
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-600',
    features: ['Tot 500 producten', 'iDEAL & creditcard', 'Voorraadbeheer', 'Klantaccounts'],
  },
  {
    id: 'drone',
    name: 'Dronebeelden',
    description: "Professionele luchtfoto's en video's",
    icon: Plane,
    price: 'Vanaf €349',
    priceNote: 'eenmalig incl. btw',
    color: 'orange',
    gradient: 'from-orange-500 to-amber-600',
    features: ['Gecertificeerde piloot', 'Bewerkte foto\'s', 'Video content', 'Snelle levering'],
  },
  {
    id: 'logo',
    name: 'Logo Design',
    description: "Uniek logo ontwerp voor je merk of bedrijf",
    icon: PenTool,
    price: '€169',
    priceNote: 'eenmalig incl. btw',
    color: 'purple',
    gradient: 'from-purple-500 to-violet-600',
    features: ['Meerdere concepten', 'Revisierondes', 'Alle bestandsformaten', 'Kleurenpalet'],
  },
]

// Floating particles component
function FloatingParticles({ activeService }: { activeService: ServiceType }) {
  const getColors = () => {
    switch (activeService) {
      case 'webshop':
        return ['from-emerald-400 to-green-500', 'from-green-400 to-emerald-500', 'from-teal-400 to-green-500']
      case 'drone':
        return ['from-orange-400 to-amber-500', 'from-amber-400 to-orange-500', 'from-yellow-400 to-orange-500']
      case 'logo':
        return ['from-purple-400 to-violet-500', 'from-violet-400 to-purple-500', 'from-pink-400 to-purple-500']
      default:
        return ['from-primary-400 to-blue-500', 'from-blue-400 to-primary-500', 'from-purple-400 to-blue-500']
    }
  }

  const colors = getColors()
  const particles = [
    { size: 6, x: '8%', y: '15%', delay: 0, duration: 9 },
    { size: 8, x: '92%', y: '20%', delay: 1.5, duration: 11 },
    { size: 5, x: '15%', y: '75%', delay: 0.8, duration: 10 },
    { size: 7, x: '88%', y: '65%', delay: 2.2, duration: 12 },
    { size: 5, x: '5%', y: '45%', delay: 1, duration: 8 },
    { size: 4, x: '78%', y: '85%', delay: 0.5, duration: 9.5 },
    { size: 6, x: '45%', y: '8%', delay: 1.8, duration: 10.5 },
    { size: 5, x: '95%', y: '40%', delay: 2.5, duration: 11 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={`${activeService}-${i}`}
          className={`absolute rounded-full bg-gradient-to-br ${colors[i % colors.length]} opacity-60`}
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

export default function StartProject() {
  const [searchParams] = useSearchParams()
  const [selectedService, setSelectedService] = useState<SelectedServiceType>(null)
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null)

  // Check for pre-selected service and package from URL
  useEffect(() => {
    const dienst = searchParams.get('dienst') as ServiceType
    const service = searchParams.get('service') as ServiceType
    const preselected = dienst || service
    const pakketParam = searchParams.get('pakket') as PackageType
    
    if (preselected && ['website', 'webshop', 'drone', 'logo'].includes(preselected)) {
      setSelectedService(preselected)
      // If package is in URL, or service has no packages, skip package selection
      if (pakketParam && ['starter', 'professional', 'business'].includes(pakketParam)) {
        setSelectedPackage(pakketParam)
      } else if (preselected === 'drone' || preselected === 'logo') {
        setSelectedPackage('starter') // Default for services without packages
      }
    }
  }, [searchParams])

  // Get initial package from URL
  const pakket = searchParams.get('pakket')

  // Handle back to service selection
  const handleBack = () => {
    if (selectedPackage && packagesByService[selectedService!]?.length > 0) {
      setSelectedPackage(null)
    } else {
      setSelectedService(null)
      setSelectedPackage(null)
    }
  }

  // Get packages for selected service
  const availablePackages = selectedService ? packagesByService[selectedService] : []
  const hasPackages = availablePackages.length > 0

  // Gradient colors for each service
  const gradientColors: Record<ServiceType, string> = {
    website: 'from-gray-50 via-white to-primary-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900',
    webshop: 'from-gray-50 via-white to-emerald-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900',
    drone: 'from-gray-50 via-white to-orange-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900',
    logo: 'from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900'
  }

  // If service selected and (package selected OR no packages available), show form
  if (selectedService && (selectedPackage || !hasPackages)) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${gradientColors[selectedService]}`}>
        <Header />
        <main className="pt-20 pb-12">
          <QuickStartForm 
            serviceType={selectedService}
            initialPackage={selectedPackage || pakket || 'starter'}
            onBack={handleBack}
          />
        </main>
        <Footer />
      </div>
    )
  }

  // If service selected but needs package selection
  if (selectedService && hasPackages && !selectedPackage) {
    const serviceInfo = services.find(s => s.id === selectedService)!
    
    return (
      <div className={`min-h-screen bg-gradient-to-br ${gradientColors[selectedService]} relative overflow-hidden`}>
        <FloatingParticles activeService={selectedService} />
        <Header />
        
        <main className="relative z-10 pt-24 sm:pt-28 pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedService(null)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Terug naar diensten</span>
            </motion.button>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8 sm:mb-12"
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${serviceInfo.gradient} text-white text-sm font-medium mb-4`}>
                <serviceInfo.icon className="w-4 h-4" />
                {serviceInfo.name}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Kies je pakket
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                Selecteer het pakket dat het beste bij jouw wensen past
              </p>
            </motion.div>

            {/* Gratis design banner */}
            {(selectedService === 'website' || selectedService === 'webshop') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6 text-center"
              >
                <p className="text-emerald-800 dark:text-emerald-300 font-medium text-sm sm:text-base">
                  ✨ Geheel vrijblijvend gratis design — Betaal pas als je tevreden bent!
                </p>
              </motion.div>
            )}

            {/* Package cards - Horizontal scroll on mobile */}
            <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
              {/* Swipe hint for mobile */}
              <p className="text-center text-gray-400 dark:text-gray-500 text-xs mb-3 sm:hidden">
                ← Swipe om alle pakketten te zien →
              </p>
              
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 sm:pb-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible scrollbar-hide">
                {availablePackages.map((pkg, index) => (
                  <motion.button
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className="flex-shrink-0 w-[280px] sm:w-auto snap-center first:ml-0 last:mr-0 relative p-6 rounded-2xl text-left transition-all bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {pkg.name}
                    </h3>
                    
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">€{pkg.price}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                        {pkg.priceNote.includes('eenmalig') ? ' eenmalig' : '/maand'}
                      </span>
                      {pkg.setupFee && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          + €{pkg.setupFee} eenmalige opstartkosten
                        </p>
                      )}
                    </div>
                    
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="w-full py-3 rounded-xl font-semibold text-center transition-all bg-gradient-to-r from-primary-500 to-blue-600 text-white">
                      Kies {pkg.name}
                      <ArrowRight className="inline-block w-4 h-4 ml-2" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Info text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8"
            >
              {selectedService === 'drone' 
                ? 'Alle prijzen zijn inclusief BTW. Beelden worden digitaal geleverd.'
                : 'Alle pakketten zijn maandelijks opzegbaar na 3 maanden. Inclusief hosting en onderhoud.'
              }
            </motion.p>
          </div>
        </main>
        
        <Footer />
      </div>
    )
  }

  // Service selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden">
      <FloatingParticles activeService={selectedService || 'website'} />
      
      <Header />
      
      <main className="relative z-10 pt-24 sm:pt-28 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header - Compact on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 sm:mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="hidden sm:inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Start je project</span>
            </motion.div>
            
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
              Wat kunnen we voor je{' '}
              <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                maken?
              </span>
            </h1>
            
            <p className="text-sm sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              <span className="sm:hidden">Kies een dienst en start direct.</span>
              <span className="hidden sm:inline">Kies een dienst en doorloop onze slimme wizard. 
              Binnen 5 minuten heb je je project aangevraagd.</span>
            </p>
            
            {/* Payment after design approval badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium"
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">Betaling pas na goedkeuring design — start vrijblijvend</span>
              <span className="sm:hidden">Betaling na design goedkeuring</span>
            </motion.div>
          </motion.div>

          {/* Service Cards - Mobile Carousel */}
          <div className="sm:hidden">
            {/* Swipe hint */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-3">
              <span>Swipe om te vergelijken</span>
              <ArrowRight className="w-3 h-3" />
            </div>
            
            <div className="flex gap-4 overflow-x-auto overflow-y-visible pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {services.map((service, index) => {
                const Icon = service.icon
                
                return (
                  <motion.button
                    key={service.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => setSelectedService(service.id)}
                    className="relative flex-shrink-0 w-[300px] snap-center text-left bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-md active:scale-[0.98] transition-transform"
                  >
                    {/* Colored header with icon */}
                    <div className={`bg-gradient-to-br ${service.gradient} p-5 flex flex-col items-center justify-center gap-3 h-[150px] rounded-t-2xl`}>
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-white w-full text-center">
                        <h3 className="font-bold text-lg leading-tight mb-1">{service.name}</h3>
                        <p className="text-white/80 text-sm leading-snug">{service.description}</p>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      {/* Price */}
                      <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{service.price}</span>
                        <br />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{service.priceNote}</span>
                        {service.setupNote && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{service.setupNote}</p>
                        )}
                      </div>
                      
                      {/* Features - vertical list */}
                      <div className="space-y-2.5 mb-5">
                        {service.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* CTA */}
                      <div className={`flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r ${service.gradient} text-white font-semibold shadow-lg`}>
                        <span>Starten</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
            
            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-3">
              {services.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${index === 0 ? 'bg-primary-500 w-6' : 'bg-gray-300 dark:bg-gray-600 w-2'}`}
                />
              ))}
            </div>
          </div>

          {/* Service Cards - Desktop Grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map((service, index) => {
              const Icon = service.icon
              
              return (
                <motion.button
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  onClick={() => setSelectedService(service.id)}
                  className="relative group text-left bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-md hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Colored header with icon */}
                  <div className={`bg-gradient-to-br ${service.gradient} p-5 flex flex-col items-center justify-center gap-3 h-[150px] rounded-t-2xl`}>
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-white w-full text-center">
                      <h3 className="font-bold text-lg leading-tight mb-1">{service.name}</h3>
                      <p className="text-white/80 text-sm leading-snug">{service.description}</p>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    {/* Price */}
                    <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{service.price}</span>
                      <br />
                      <span className="text-sm text-gray-500 dark:text-gray-400">{service.priceNote}</span>
                      {service.setupNote && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{service.setupNote}</p>
                      )}
                    </div>
                    
                    {/* Features - vertical list */}
                    <div className="space-y-2.5 mb-5">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* CTA */}
                    <div className={`flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r ${service.gradient} text-white font-semibold shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <span>Starten</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 sm:mt-16"
          >
            {/* Mobile: Compact row */}
            <div className="sm:hidden flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                <span>Geen verplichtingen</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                <span>Reactie binnen 24 uur</span>
              </div>
            </div>
            <div className="sm:hidden flex items-center justify-center mt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Check className="w-4 h-4 text-green-500" />
                <span>150+ tevreden klanten</span>
              </div>
            </div>
            
            {/* Desktop: Full row */}
            <div className="hidden sm:flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Geen verplichtingen</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Reactie binnen 24 uur</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>150+ tevreden klanten</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
