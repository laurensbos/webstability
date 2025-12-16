import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { 
  Globe, 
  ShoppingBag, 
  Plane,
  PenTool,
  ArrowRight,
  Check,
  Sparkles
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

// Lazy import the onboarding components
import WebsiteOnboarding from '../components/WebsiteOnboarding'
import WebshopOnboarding from '../components/WebshopOnboarding'
import DroneOnboarding from '../components/DroneOnboarding'
import LogoOnboarding from '../components/LogoOnboarding'

type ServiceType = 'website' | 'webshop' | 'drone' | 'logo' | null

interface ServiceOption {
  id: ServiceType
  name: string
  description: string
  icon: React.ElementType
  price: string
  priceNote: string
  color: string
  gradient: string
  features: string[]
  popular?: boolean
}

const services: ServiceOption[] = [
  {
    id: 'website',
    name: 'Website',
    description: 'Professionele website voor je bedrijf',
    icon: Globe,
    price: 'Vanaf €96',
    priceNote: 'per maand incl. btw',
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
    price: 'Vanaf €301',
    priceNote: 'per maand incl. btw',
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-600',
    features: ['Tot 500 producten', 'iDEAL & creditcard', 'Voorraadbeheer', 'Klantaccounts'],
  },
  {
    id: 'drone',
    name: 'Dronebeelden',
    description: "Professionele luchtfoto's en video's",
    icon: Plane,
    price: 'Vanaf €483',
    priceNote: 'eenmalig incl. btw',
    color: 'orange',
    gradient: 'from-orange-500 to-amber-600',
    features: ['Gecertificeerde piloot', 'Bewerkte foto\'s', 'Video content', 'Snelle levering'],
  },
  {
    id: 'logo',
    name: 'Logo Design',
    description: 'Uniek logo voor je merk',
    icon: PenTool,
    price: 'Vanaf €182',
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
  const [selectedService, setSelectedService] = useState<ServiceType>(null)

  // Check for pre-selected service from URL
  useEffect(() => {
    const dienst = searchParams.get('dienst') as ServiceType
    const service = searchParams.get('service') as ServiceType
    const preselected = dienst || service
    
    if (preselected && ['website', 'webshop', 'drone', 'logo'].includes(preselected)) {
      setSelectedService(preselected)
    }
  }, [searchParams])

  // Get initial package from URL
  const pakket = searchParams.get('pakket')

  // Handle back to service selection
  const handleBack = () => {
    setSelectedService(null)
  }

  // If a service is selected, show the appropriate onboarding
  if (selectedService === 'website') {
    return (
      <>
        <Header />
        <WebsiteOnboarding 
          initialPackage={(pakket as 'starter' | 'professional' | 'business') || 'professional'}
          onClose={handleBack}
          isFullPage={true}
        />
      </>
    )
  }

  if (selectedService === 'webshop') {
    return (
      <>
        <Header />
        <WebshopOnboarding 
          initialPackage={(pakket as 'starter' | 'professional') || 'professional'}
          onClose={handleBack}
          isFullPage={true}
        />
      </>
    )
  }

  if (selectedService === 'drone') {
    return (
      <>
        <Header />
        <DroneOnboarding 
          initialPackage={(pakket as 'basis' | 'professional' | 'premium') || 'professional'}
          onClose={handleBack}
          isFullPage={true}
        />
      </>
    )
  }

  if (selectedService === 'logo') {
    return (
      <>
        <Header />
        <LogoOnboarding 
          initialPackage={(pakket as 'basis' | 'uitgebreid') || 'uitgebreid'}
          onClose={handleBack}
          isFullPage={true}
        />
      </>
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
          </motion.div>

          {/* Service Cards - Mobile Carousel */}
          <div className="sm:hidden">
            {/* Swipe hint */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-3">
              <span>Swipe om te vergelijken</span>
              <ArrowRight className="w-3 h-3" />
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                    {/* Popular badge */}
                    {service.popular && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-gradient-to-r from-primary-500 to-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                          Populair
                        </span>
                      </div>
                    )}
                    
                    {/* Colored header with icon */}
                    <div className={`bg-gradient-to-br ${service.gradient} p-5 flex items-center gap-4 min-h-[100px]`}>
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-white flex-1 min-w-0">
                        <h3 className="font-bold text-xl">{service.name}</h3>
                        <p className="text-white/80 text-sm line-clamp-2">{service.description}</p>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      {/* Price */}
                      <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{service.price}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{service.priceNote}</span>
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
                  {/* Popular badge */}
                  {service.popular && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-gradient-to-r from-primary-500 to-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                        Populair
                      </span>
                    </div>
                  )}
                  
                  {/* Colored header with icon */}
                  <div className={`bg-gradient-to-br ${service.gradient} p-5 flex items-center gap-4 min-h-[100px]`}>
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-white flex-1 min-w-0">
                      <h3 className="font-bold text-xl">{service.name}</h3>
                      <p className="text-white/80 text-sm line-clamp-2">{service.description}</p>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    {/* Price */}
                    <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{service.price}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{service.priceNote}</span>
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
