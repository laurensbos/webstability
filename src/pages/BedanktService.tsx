import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useSearchParams, Link } from 'react-router-dom'
import { 
  CheckCircle2, 
  Calendar, 
  Mail, 
  Phone, 
  ArrowRight,
  Camera,
  Palette,
  Sparkles
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const serviceIcons = {
  drone: Camera,
  logo: Palette
}

const serviceColors = {
  drone: 'from-blue-500 to-cyan-500',
  logo: 'from-purple-500 to-pink-500'
}

export default function BedanktService() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const serviceType = searchParams.get('type') as 'drone' | 'logo'
  const requestId = searchParams.get('id')
  
  const ServiceIcon = serviceIcons[serviceType] || serviceIcons.drone
  const color = serviceColors[serviceType] || serviceColors.drone
  const serviceTitle = t(`thankYouService.services.${serviceType}.title`)
  const nextSteps = [
    t(`thankYouService.services.${serviceType}.steps.1`),
    t(`thankYouService.services.${serviceType}.steps.2`),
    t(`thankYouService.services.${serviceType}.steps.3`),
    t(`thankYouService.services.${serviceType}.steps.4`)
  ]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/50 via-white to-blue-50/50">
      <Header />
      
      <main className="pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="max-w-2xl mx-auto px-4 text-center">
          {/* Success animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className={`w-24 h-24 bg-gradient-to-br ${color} rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {t('thankYouService.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-8"
          >
            {t('thankYouService.description', { service: serviceTitle.toLowerCase() })}
          </motion.p>

          {/* Request ID */}
          {requestId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`inline-flex items-center gap-3 bg-gradient-to-r ${color} text-white rounded-2xl px-6 py-4 mb-10`}
            >
              <ServiceIcon className="w-6 h-6" />
              <div className="text-left">
                <p className="text-sm opacity-80">{t('thankYouService.requestId')}</p>
                <p className="font-bold text-xl font-mono">{requestId}</p>
              </div>
            </motion.div>
          )}

          {/* Next steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8 mb-8 text-left"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              {t('thankYouService.whatsNext')}
            </h2>
            
            <div className="space-y-4">
              {nextSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('thankYouService.questions')} {t('thankYouService.contactUs')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a 
                href="mailto:info@webstability.nl"
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <Mail className="w-4 h-4" />
                info@webstability.nl
              </a>
              <a 
                href="tel:+31644712573"
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <Phone className="w-4 h-4" />
                06 44712573
              </a>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-blue-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-blue-600 transition-all shadow-lg"
            >
              <span>{t('thankYouService.backToHome')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            {serviceType === 'drone' && (
              <Link
                to="/luchtvideografie"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Bekijk voorbeelden</span>
              </Link>
            )}
            
            {serviceType === 'logo' && (
              <Link
                to="/logo-laten-maken"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
              >
                <Palette className="w-4 h-4" />
                <span>Bekijk portfolio</span>
              </Link>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
