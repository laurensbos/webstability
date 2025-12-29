import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  Paintbrush, 
  Wrench, 
  Shield, 
  Headphones, 
  RefreshCw,
  Server,
  Clock,
  Zap,
  Sparkles
} from 'lucide-react'

interface WhatYouGetProps {
  variant?: 'website' | 'webshop' | 'general'
  showComparison?: boolean
  className?: string
}

export default function WhatYouGet({ variant = 'general', showComparison = true, className = '' }: WhatYouGetProps) {
  const { t } = useTranslation()

  const features = [
    {
      icon: Paintbrush,
      title: t('whatYouGet.features.customDesign.title'),
      description: t('whatYouGet.features.customDesign.description'),
      highlight: true,
    },
    {
      icon: Wrench,
      title: t('whatYouGet.features.builtByUs.title'),
      description: t('whatYouGet.features.builtByUs.description'),
      highlight: true,
    },
    {
      icon: Server,
      title: t('whatYouGet.features.hosting.title'),
      description: t('whatYouGet.features.hosting.description'),
    },
    {
      icon: Shield,
      title: t('whatYouGet.features.security.title'),
      description: t('whatYouGet.features.security.description'),
    },
    {
      icon: RefreshCw,
      title: t('whatYouGet.features.updates.title'),
      description: t('whatYouGet.features.updates.description'),
    },
    {
      icon: Headphones,
      title: t('whatYouGet.features.support.title'),
      description: t('whatYouGet.features.support.description'),
    },
    {
      icon: Clock,
      title: t('whatYouGet.features.fastDelivery.title'),
      description: t('whatYouGet.features.fastDelivery.description'),
    },
    {
      icon: Zap,
      title: t('whatYouGet.features.seoReady.title'),
      description: t('whatYouGet.features.seoReady.description'),
    },
  ]

  const comparisonData = [
    { feature: t('whatYouGet.comparison.setupCosts'), us: t('whatYouGet.comparison.fromPrice'), traditional: '€3.000 - €10.000+' },
    { feature: t('whatYouGet.comparison.timeline'), us: t('whatYouGet.comparison.sevenDays'), traditional: t('whatYouGet.comparison.fourToTwelveWeeks') },
    { feature: t('whatYouGet.comparison.maintenance'), us: t('whatYouGet.comparison.included'), traditional: t('whatYouGet.comparison.extraPerYear') },
    { feature: t('whatYouGet.comparison.changes'), us: t('whatYouGet.comparison.unlimited'), traditional: t('whatYouGet.comparison.perHour') },
    { feature: t('whatYouGet.comparison.flexibility'), us: t('whatYouGet.comparison.monthlyCancellable'), traditional: t('whatYouGet.comparison.fixedContract') },
  ]
  const gradientColors = {
    website: 'from-primary-500 to-blue-500',
    webshop: 'from-emerald-500 to-teal-500',
    general: 'from-primary-500 to-blue-500',
  }

  const accentColors = {
    website: 'text-primary-500',
    webshop: 'text-emerald-500',
    general: 'text-primary-500',
  }

  const bgColors = {
    website: 'bg-primary-50 dark:bg-primary-900/20',
    webshop: 'bg-emerald-50 dark:bg-emerald-900/20',
    general: 'bg-primary-50 dark:bg-primary-900/20',
  }

  const borderColors = {
    website: 'border-primary-200 dark:border-primary-800',
    webshop: 'border-emerald-200 dark:border-emerald-800',
    general: 'border-primary-200 dark:border-primary-800',
  }

  return (
    <section className={`py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 ${bgColors[variant]} border ${borderColors[variant]} rounded-full px-4 py-2 mb-4`}
          >
            <Sparkles className={`w-4 h-4 ${accentColors[variant]}`} />
            <span className={`text-sm font-medium ${accentColors[variant]}`}>{t('whatYouGet.badge')}</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {t('whatYouGet.title.part1')}{' '}
            <span className={`bg-gradient-to-r ${gradientColors[variant]} bg-clip-text text-transparent`}>
              {t('whatYouGet.title.part2')}
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            {t('whatYouGet.description')}
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`relative p-5 sm:p-6 rounded-2xl border transition-all hover:shadow-lg ${
                feature.highlight 
                  ? `${bgColors[variant]} ${borderColors[variant]} hover:shadow-xl` 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              {feature.highlight && (
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r ${gradientColors[variant]} flex items-center justify-center`}>
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              )}
              <feature.icon className={`w-8 h-8 ${feature.highlight ? accentColors[variant] : 'text-gray-600 dark:text-gray-400'} mb-3`} />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                <span className={`bg-gradient-to-r ${gradientColors[variant]} bg-clip-text text-transparent`}>{t('whatYouGet.comparisonTitle.traditional')}</span>
                {' '}
                <span className="font-display tracking-tight text-gray-900 dark:text-white">webstability</span>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('whatYouGet.comparisonSubtitle')}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl">
              {/* Table Header */}
              <div className="grid grid-cols-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <div className="p-3 sm:p-4 text-left">
                  <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400"></span>
                </div>
                <div className="p-3 sm:p-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r ${gradientColors[variant]} text-white text-xs sm:text-sm font-semibold`}>
                    <Sparkles className="w-3 h-3 hidden sm:block" />
                    Webstability
                  </span>
                </div>
                <div className="p-3 sm:p-4 text-center">
                  <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{t('whatYouGet.comparison.traditional')}</span>
                </div>
              </div>

              {/* Table Body */}
              {comparisonData.map((row, index) => (
                <div 
                  key={row.feature}
                  className={`grid grid-cols-3 ${index !== comparisonData.length - 1 ? 'border-b border-gray-100 dark:border-gray-700/50' : ''}`}
                >
                  <div className="p-3 sm:p-4 text-left">
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{row.feature}</span>
                  </div>
                  <div className="p-3 sm:p-4 flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400 text-center">{row.us}</span>
                  </div>
                  <div className="p-3 sm:p-4 flex items-center justify-center">
                    <span className="text-xs sm:text-sm text-red-500 text-center">{row.traditional}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-6"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('whatYouGet.comparisonSubtitle')}
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
