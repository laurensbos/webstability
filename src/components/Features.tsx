import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Zap, 
  Shield, 
  Palette, 
  Headphones, 
  TrendingUp, 
  RefreshCw 
} from 'lucide-react'
import AutoScrollCarousel from './AutoScrollCarousel'

const featureKeys = [
  { key: 'fast', icon: Zap, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  { key: 'custom', icon: Palette, color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
  { key: 'secure', icon: Shield, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  { key: 'support', icon: Headphones, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { key: 'seo', icon: TrendingUp, color: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' },
  { key: 'updates', icon: RefreshCw, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
]

export default function Features() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = featureKeys.map(f => ({
    ...f,
    title: t(`features.items.${f.key}.title`),
    description: t(`features.items.${f.key}.description`),
  }))

  return (
    <section id="features" className="py-16 lg:py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-3 lg:mb-4"
          >
            {t('features.badge')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6"
          >
            {t('features.title')}{' '}
            <span className="text-primary-600">
              {t('features.titleHighlight')}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 text-base lg:text-lg"
          >
            {t('features.subtitle')}
          </motion.p>
        </div>

        {/* Mobile: Horizontal scroll carousel with auto-scroll */}
        <div className="lg:hidden">
          <AutoScrollCarousel className="flex gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex-shrink-0 w-[280px] snap-start bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm"
              >
                {/* Icon + Title row */}
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${feature.color}`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white font-semibold text-base">
                    {feature.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </AutoScrollCarousel>
          {/* Scroll indicator */}
          <div className="flex justify-center gap-1.5 mt-3">
            {features.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div ref={ref} className="hidden lg:grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-xl hover:shadow-gray-100 dark:hover:shadow-gray-900/20 transition-all duration-300"
            >
              {/* Icon + Title row */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`inline-flex p-3 rounded-xl ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-gray-900 dark:text-white font-semibold text-xl">
                  {feature.title}
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
