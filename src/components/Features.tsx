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
  { key: 'fast', icon: Zap, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
  { key: 'custom', icon: Palette, gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400' },
  { key: 'secure', icon: Shield, gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400' },
  { key: 'support', icon: Headphones, gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
  { key: 'seo', icon: TrendingUp, gradient: 'from-primary-500 to-blue-500', bg: 'bg-primary-500/10', text: 'text-primary-600 dark:text-primary-400' },
  { key: 'updates', icon: RefreshCw, gradient: 'from-purple-500 to-violet-500', bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400' },
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
    <section id="features" className="py-20 lg:py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-50/30 via-blue-50/20 to-purple-50/30 dark:from-primary-900/10 dark:via-blue-900/5 dark:to-purple-900/10 rounded-full blur-3xl" />
        <div className="absolute top-20 -right-20 w-[300px] h-[300px] bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-[300px] h-[300px] bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header - Enhanced */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 border-2 border-primary-200/50 dark:border-primary-700/50 rounded-full px-5 py-2.5 mb-5 shadow-lg shadow-primary-100/50 dark:shadow-primary-900/20"
          >
            <span className="text-sm font-bold text-primary-700 dark:text-primary-300 tracking-wider uppercase">{t('features.badge')}</span>
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-5 lg:mb-6"
          >
            {t('features.title')}{' '}
            <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
              {t('features.titleHighlight')}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 text-lg lg:text-xl"
          >
            {t('features.subtitle')}
          </motion.p>
        </div>

        {/* Mobile: Horizontal scroll carousel with auto-scroll - Enhanced */}
        <div className="lg:hidden">
          <AutoScrollCarousel className="flex gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
                className="flex-shrink-0 w-[300px] snap-start bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-lg relative overflow-hidden"
              >
                {/* Gradient accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient}`} />
                
                {/* Icon + Title row */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white font-bold text-base">
                    {feature.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </AutoScrollCarousel>
          {/* Scroll indicator - Enhanced */}
          <div className="flex justify-center gap-2 mt-4">
            {features.map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout - Enhanced */}
        <div ref={ref} className="hidden lg:grid lg:grid-cols-3 gap-7">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-2xl p-8 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Gradient accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
              
              {/* Icon + Title row */}
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-gray-900 dark:text-white font-bold text-xl">
                  {feature.title}
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
