import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
import { usePackages } from '../hooks/usePackages'

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
  deliveryDays?: number
  supportResponseTime?: string
  revisionsPerMonth?: number | 'unlimited'
}

// Helper function to get service-specific styling
function getServiceColors(serviceId: ServiceType) {
  switch (serviceId) {
    case 'website':
      return {
        iconBg: 'bg-primary-100 dark:bg-primary-900/30',
        iconColor: 'text-primary-600 dark:text-primary-400',
        checkColor: 'text-primary-500',
        buttonBg: 'bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700',
        borderHover: 'hover:border-primary-300 dark:hover:border-primary-600',
        shadow: 'shadow-primary-500/20',
      }
    case 'webshop':
      return {
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        checkColor: 'text-emerald-500',
        buttonBg: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700',
        borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-600',
        shadow: 'shadow-emerald-500/20',
      }
    case 'drone':
      return {
        iconBg: 'bg-orange-100 dark:bg-orange-900/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
        checkColor: 'text-orange-500',
        buttonBg: 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700',
        borderHover: 'hover:border-orange-300 dark:hover:border-orange-600',
        shadow: 'shadow-orange-500/20',
      }
    case 'logo':
      return {
        iconBg: 'bg-purple-100 dark:bg-purple-900/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        checkColor: 'text-purple-500',
        buttonBg: 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700',
        borderHover: 'hover:border-purple-300 dark:hover:border-purple-600',
        shadow: 'shadow-purple-500/20',
      }
    default:
      return {
        iconBg: 'bg-gray-100 dark:bg-gray-700',
        iconColor: 'text-gray-600 dark:text-gray-400',
        checkColor: 'text-gray-500',
        buttonBg: 'bg-gray-800 hover:bg-gray-700',
        borderHover: 'hover:border-gray-400',
        shadow: '',
      }
  }
}

export default function StartProject() {
  const { t } = useTranslation()
  const { packages: websitePackages, webshopPackages } = usePackages()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedService, setSelectedService] = useState<SelectedServiceType>(null)
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null)
  
  // Capture referral code from URL on this page too
  useEffect(() => {
    const refCode = searchParams.get('ref')
    if (refCode) {
      // Import dynamically to avoid circular deps
      import('../hooks/useReferralCapture').then(({ captureReferral }) => {
        captureReferral(refCode)
        // Remove ref param from URL
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('ref')
        setSearchParams(newParams, { replace: true })
      })
    }
  }, [searchParams, setSearchParams])

  // Translated services
  const services: ServiceOption[] = [
    {
      id: 'website',
      name: t('startProject.services.website.name'),
      description: t('startProject.services.website.description'),
      icon: Globe,
      price: t('startProject.services.website.price'),
      priceNote: t('startProject.services.website.priceNote'),
      setupNote: t('startProject.services.website.setupNote'),
      color: 'primary',
      gradient: 'from-primary-500 to-blue-600',
      features: t('startProject.services.website.features', { returnObjects: true }) as string[],
      popular: true,
    },
    {
      id: 'webshop',
      name: t('startProject.services.webshop.name'),
      description: t('startProject.services.webshop.description'),
      icon: ShoppingBag,
      price: t('startProject.services.webshop.price'),
      priceNote: t('startProject.services.webshop.priceNote'),
      setupNote: t('startProject.services.webshop.setupNote'),
      color: 'emerald',
      gradient: 'from-emerald-500 to-green-600',
      features: t('startProject.services.webshop.features', { returnObjects: true }) as string[],
    },
    {
      id: 'drone',
      name: t('startProject.services.drone.name'),
      description: t('startProject.services.drone.description'),
      icon: Plane,
      price: t('startProject.services.drone.price'),
      priceNote: t('startProject.services.drone.priceNote'),
      color: 'orange',
      gradient: 'from-orange-500 to-amber-600',
      features: t('startProject.services.drone.features', { returnObjects: true }) as string[],
    },
    {
      id: 'logo',
      name: t('startProject.services.logo.name'),
      description: t('startProject.services.logo.description'),
      icon: PenTool,
      price: t('startProject.services.logo.price'),
      priceNote: t('startProject.services.logo.priceNote'),
      color: 'purple',
      gradient: 'from-purple-500 to-violet-600',
      features: t('startProject.services.logo.features', { returnObjects: true }) as string[],
    },
  ]

  // Packages per service type with translations
  const packagesByService = useMemo((): Record<ServiceType, PackageOption[]> => ({
    website: websitePackages.map(pkg => ({
      id: pkg.id as PackageType,
      name: pkg.name,
      price: pkg.price,
      setupFee: pkg.setupFee,
      priceNote: t('startProject.priceNote.monthly'),
      features: pkg.features.slice(0, 4),
      deliveryDays: pkg.deliveryDays,
      supportResponseTime: pkg.supportResponseTime,
      revisionsPerMonth: pkg.revisionsPerMonth,
    })),
    webshop: webshopPackages.map(pkg => ({
      id: pkg.id.replace('webshop-', '') as PackageType,
      name: pkg.name,
      price: pkg.price,
      setupFee: pkg.setupFee,
      priceNote: t('startProject.priceNote.monthly'),
      features: pkg.features.slice(0, 4),
      deliveryDays: pkg.deliveryDays,
      supportResponseTime: pkg.supportResponseTime,
      revisionsPerMonth: pkg.revisionsPerMonth,
    })),
    drone: [
      {
        id: 'starter' as PackageType,
        name: t('startProject.drone.starter.name'),
        price: 349,
        priceNote: t('startProject.priceNote.oneTime'),
        features: t('startProject.drone.starter.features', { returnObjects: true }) as string[],
        deliveryDays: 5,
      },
      {
        id: 'professional' as PackageType,
        name: t('startProject.drone.professional.name'),
        price: 549,
        priceNote: t('startProject.priceNote.oneTime'),
        features: t('startProject.drone.professional.features', { returnObjects: true }) as string[],
        deliveryDays: 3,
      },
      {
        id: 'business' as PackageType,
        name: t('startProject.drone.business.name'),
        price: 849,
        priceNote: t('startProject.priceNote.oneTime'),
        features: t('startProject.drone.business.features', { returnObjects: true }) as string[],
        deliveryDays: 2,
      },
    ],
    logo: [],  // No packages for logo - single service
  }), [websitePackages, webshopPackages, t])

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
        <Header />
        
        <main className="relative z-10 pt-20 sm:pt-28 pb-8 sm:pb-16 lg:pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back button - styled nicely */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedService(null)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded-full text-sm font-medium transition-all shadow-sm border border-gray-200/50 dark:border-gray-700/50 mb-4 sm:mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('startProject.back')}</span>
            </motion.button>

            {/* Header - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4 sm:mb-8"
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r ${serviceInfo.gradient} text-white text-xs sm:text-sm font-medium mb-3 sm:mb-4`}>
                <serviceInfo.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {serviceInfo.name}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                {t('startProject.choosePackage')}
              </h1>
              
              {/* Trustpilot badge - compact */}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="#00b67a">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">4.9 {t('startProject.trustpilot')}</span>
              </div>
            </motion.div>

            {/* Gratis design banner */}
            {(selectedService === 'website' || selectedService === 'webshop') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-3 mb-4 sm:mb-6 text-center"
              >
                <p className="text-emerald-700 dark:text-emerald-400 font-medium text-sm">
                  ✨ {t('startProject.freeDesign')}
                </p>
              </motion.div>
            )}

            {/* Package cards - Horizontal scroll on mobile */}
            <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 sm:pb-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {availablePackages.map((pkg, index) => (
                  <motion.button
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className="flex-shrink-0 w-[300px] sm:w-auto snap-center relative p-5 rounded-xl text-left transition-all bg-white dark:bg-gray-800 shadow-md hover:shadow-lg active:scale-[0.98] border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {pkg.name}
                    </h3>
                    
                    <div className="mt-2 mb-4">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">€{pkg.price}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                        {pkg.priceNote.includes('eenmalig') || pkg.priceNote.includes('one-time') ? t('startProject.oneTime') : t('startProject.monthly')}
                      </span>
                      {pkg.setupFee && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          + €{pkg.setupFee} {t('startProject.setupCosts')}
                        </p>
                      )}
                    </div>
                    
                    <ul className="space-y-2 mb-4">
                      {pkg.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Check className="w-4 h-4 text-green-500 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="w-full py-3 rounded-lg font-semibold text-center text-base transition-all bg-primary-500 hover:bg-primary-600 text-white">
                      {t('startProject.choose')} {pkg.name} →
                    </div>
                  </motion.button>
                ))}
              </div>
              
              {/* Scroll indicator dots - mobile only */}
              <div className="flex justify-center gap-1.5 mt-3 sm:hidden">
                {availablePackages.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                ))}
              </div>
            </div>

            {/* Info text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-gray-400 dark:text-gray-500 text-sm mt-5 sm:mt-6"
            >
              {selectedService === 'drone' 
                ? t('startProject.info.drone')
                : t('startProject.info.subscription')
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
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">{t('startProject.badge')}</span>
            </motion.div>
            
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
              {t('startProject.title')}{' '}
              <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                {t('startProject.titleHighlight')}
              </span>
            </h1>
            
            <p className="text-sm sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto hidden sm:block">
              {t('startProject.subtitle')}
            </p>
            
            {/* Payment after design approval badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium"
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">{t('startProject.paymentNote')}</span>
              <span className="sm:hidden">{t('startProject.paymentNoteMobile')}</span>
            </motion.div>
            
            {/* Trustpilot badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-1.5 mt-3"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill="#00b67a">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">4.9 {t('startProject.trustpilot')}</span>
            </motion.div>
          </motion.div>

          {/* Service Cards - Mobile Carousel */}
          <div className="sm:hidden space-y-8">
            {/* Maandelijkse abonnementen */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{t('startProject.categories.monthly')}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
              </div>
              
              <div className="flex gap-4 overflow-x-auto overflow-y-visible pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {services.filter(s => s.id === 'website' || s.id === 'webshop').map((service, index) => {
                  const colors = getServiceColors(service.id)
                  return (
                    <motion.button
                      key={service.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      onClick={() => setSelectedService(service.id)}
                      className={`relative flex-shrink-0 w-[280px] snap-center text-left rounded-2xl shadow-lg active:scale-[0.98] transition-all overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${colors.shadow}`}
                    >
                      <div className="p-5">
                        {/* Icon & Title */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center`}>
                            <service.icon className={`w-6 h-6 ${colors.iconColor}`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{service.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{service.description}</p>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">{service.price}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{service.priceNote}</span>
                          {service.setupNote && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{service.setupNote}</p>
                          )}
                        </div>
                        
                        {/* Features */}
                        <div className="space-y-2 mb-5">
                          {service.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Check className={`w-4 h-4 ${colors.checkColor} flex-shrink-0`} />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* CTA */}
                        <div className={`flex items-center justify-center gap-2 py-3 rounded-xl ${colors.buttonBg} text-white font-semibold transition-all`}>
                          <span>{t('startProject.start')}</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
              {/* Scroll indicator dots */}
              <div className="flex justify-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-primary-500" />
                <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>
            </div>

            {/* Eenmalige diensten */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{t('startProject.categories.oneTime')}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
              </div>
              
              <div className="flex gap-4 overflow-x-auto overflow-y-visible pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {services.filter(s => s.id === 'drone' || s.id === 'logo').map((service, index) => {
                  const colors = getServiceColors(service.id)
                  return (
                    <motion.button
                      key={service.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      onClick={() => setSelectedService(service.id)}
                      className={`relative flex-shrink-0 w-[280px] snap-center text-left rounded-2xl shadow-lg active:scale-[0.98] transition-all overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${colors.shadow}`}
                    >
                      <div className="p-5">
                        {/* Icon & Title */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center`}>
                            <service.icon className={`w-6 h-6 ${colors.iconColor}`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{service.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{service.description}</p>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">{service.price}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{service.priceNote}</span>
                        </div>
                        
                        {/* Features */}
                        <div className="space-y-2 mb-5">
                          {service.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Check className={`w-4 h-4 ${colors.checkColor} flex-shrink-0`} />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* CTA */}
                        <div className={`flex items-center justify-center gap-2 py-3 rounded-xl ${colors.buttonBg} text-white font-semibold transition-all`}>
                          <span>{t('startProject.start')}</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
              {/* Scroll indicator dots */}
              <div className="flex justify-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>
            </div>
          </div>

          {/* Service Cards - Desktop Grid with grouping */}
          <div className="hidden sm:block space-y-10">
            {/* Maandelijkse abonnementen */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{t('startProject.categories.monthlyFull')}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {services.filter(s => s.id === 'website' || s.id === 'webshop').map((service, index) => {
                  const colors = getServiceColors(service.id)
                  return (
                    <motion.button
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      onClick={() => setSelectedService(service.id)}
                      className={`relative group text-left rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${colors.borderHover} ${colors.shadow}`}
                    >
                      <div className="p-6">
                        {/* Icon & Title */}
                        <div className="flex items-start gap-4 mb-5">
                          <div className={`w-14 h-14 ${colors.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <service.icon className={`w-7 h-7 ${colors.iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{service.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{service.description}</p>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">{service.price}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{service.priceNote}</span>
                          {service.setupNote && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{service.setupNote}</p>
                          )}
                        </div>
                        
                        {/* Features */}
                        <div className="grid grid-cols-2 gap-2 mb-6">
                          {service.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Check className={`w-4 h-4 ${colors.checkColor} flex-shrink-0`} />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* CTA */}
                        <div className={`flex items-center justify-center gap-2 py-3.5 rounded-xl ${colors.buttonBg} text-white font-semibold transition-all`}>
                          <span>{t('startProject.start')}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Eenmalige diensten */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{t('startProject.categories.oneTimeFull')}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {services.filter(s => s.id === 'drone' || s.id === 'logo').map((service, index) => {
                  const colors = getServiceColors(service.id)
                  return (
                    <motion.button
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      onClick={() => setSelectedService(service.id)}
                      className={`relative group text-left rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${colors.borderHover} ${colors.shadow}`}
                    >
                      <div className="p-6">
                        {/* Icon & Title */}
                        <div className="flex items-start gap-4 mb-5">
                          <div className={`w-14 h-14 ${colors.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <service.icon className={`w-7 h-7 ${colors.iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{service.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{service.description}</p>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">{service.price}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{service.priceNote}</span>
                        </div>
                        
                        {/* Features */}
                        <div className="grid grid-cols-2 gap-2 mb-6">
                          {service.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Check className={`w-4 h-4 ${colors.checkColor} flex-shrink-0`} />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* CTA */}
                        <div className={`flex items-center justify-center gap-2 py-3.5 rounded-xl ${colors.buttonBg} text-white font-semibold transition-all`}>
                          <span>{t('startProject.start')}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
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
                <span>{t('startProject.trust.noObligations')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                <span>{t('startProject.trust.response24h')}</span>
              </div>
            </div>
            <div className="sm:hidden flex items-center justify-center mt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Check className="w-4 h-4 text-green-500" />
                <span>{t('startProject.trust.happyCustomers')}</span>
              </div>
            </div>
            
            {/* Desktop: Full row */}
            <div className="hidden sm:flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>{t('startProject.trust.noObligations')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>{t('startProject.trust.response24h')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>{t('startProject.trust.happyCustomers')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
