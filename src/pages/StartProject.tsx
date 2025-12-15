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
  Sparkles,
  ChevronLeft
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

// Lazy import the onboarding components
import WebsiteOnboarding from '../components/WebsiteOnboarding'
import WebshopOnboarding from '../components/WebshopOnboarding'
import DroneOnboarding from '../components/DroneOnboarding'

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
    description: 'Online verkopen met je eigen shop',
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
    description: 'Professionele luchtfoto\'s en video\'s',
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
  const [hoveredService, setHoveredService] = useState<ServiceType>(null)

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        <Header />
        <main className="pt-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Andere dienst kiezen</span>
            </button>
          </div>
          <WebsiteOnboarding 
            isStandalone={false}
            initialPackage={(pakket as 'starter' | 'professional' | 'business') || 'professional'}
          />
        </main>
        <Footer />
      </div>
    )
  }

  if (selectedService === 'webshop') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
        <Header />
        <main className="pt-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Andere dienst kiezen</span>
            </button>
          </div>
          <WebshopOnboarding 
            isStandalone={false}
          />
        </main>
        <Footer />
      </div>
    )
  }

  if (selectedService === 'drone') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
        <Header />
        <main className="pt-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Andere dienst kiezen</span>
            </button>
          </div>
          <DroneOnboarding 
            isStandalone={false}
            initialPackage={(pakket as 'basis' | 'professional' | 'premium') || 'professional'}
          />
        </main>
        <Footer />
      </div>
    )
  }

  if (selectedService === 'logo') {
    // TODO: Create LogoOnboarding component
    // For now, redirect to old flow or show message
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <Header />
        <main className="pt-4 min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20">
              <PenTool className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Logo Design</h2>
            <p className="text-gray-600 mb-6">
              Voor logo design neem direct contact met ons op. We bespreken graag je wensen en maken een uniek ontwerp voor je merk.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:info@webstability.nl?subject=Logo%20Design%20Aanvraag"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-violet-700 transition-all shadow-lg shadow-purple-500/20"
              >
                Contact opnemen
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={handleBack}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Terug
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Service selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 relative overflow-hidden">
      <FloatingParticles activeService={hoveredService || 'website'} />
      
      <Header />
      
      <main className="relative z-10 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Start je project</span>
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Wat kunnen we voor je{' '}
              <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                maken?
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Kies een dienst en doorloop onze slimme wizard. 
              Binnen 5 minuten heb je je project aangevraagd.
            </p>
          </motion.div>

          {/* Service Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map((service, index) => {
              const Icon = service.icon
              const isHovered = hoveredService === service.id
              
              return (
                <motion.button
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  onMouseEnter={() => setHoveredService(service.id)}
                  onMouseLeave={() => setHoveredService(null)}
                  onClick={() => setSelectedService(service.id)}
                  className={`relative group text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                    isHovered
                      ? `border-${service.color}-300 bg-gradient-to-br from-${service.color}-50 to-white shadow-xl shadow-${service.color}-500/10`
                      : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Popular badge */}
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-primary-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Populair
                      </span>
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{service.description}</p>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">{service.price}</span>
                    <span className="text-sm text-gray-500 ml-1">{service.priceNote}</span>
                  </div>
                  
                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className={`w-4 h-4 text-${service.color}-500 flex-shrink-0`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA */}
                  <div className={`flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-${service.color}-100 transition-colors`}>
                    <span className={`font-semibold text-${service.color}-600`}>Starten</span>
                    <ArrowRight className={`w-5 h-5 text-${service.color}-500 transition-transform group-hover:translate-x-1`} />
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
            className="mt-16 text-center"
          >
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-gray-500">
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
