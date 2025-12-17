import { motion } from 'framer-motion'
import { Check, X, AlertCircle, ArrowRight, Sparkles, Clock, Building2, Wrench } from 'lucide-react'

const comparisonOptions = [
  {
    id: 'webbureau',
    name: 'Webbureau',
    tagline: 'Freelancer of agency',
    highlight: false,
    icon: Building2,
    color: 'gray',
    pricing: {
      monthly: '€200-500/maand',
      setup: '€2.000-10.000+',
    },
    features: [
      { label: 'Professioneel design', value: 'Op maat gemaakt', positive: true },
      { label: 'Technisch onderhoud', value: 'Vaak extra kosten', positive: null },
      { label: 'Wijzigingen doorvoeren', value: '€50-150/uur', positive: false },
      { label: 'Support & hulp', value: 'Beperkt inbegrepen', positive: null },
      { label: 'Flexibiliteit', value: 'Je zit eraan vast', positive: false },
      { label: 'Jouw tijdsinvestering', value: '10-20 uur meetings', positive: false },
    ],
  },
  {
    id: 'zelf',
    name: 'Zelf maken',
    tagline: 'Wix, Squarespace, etc.',
    highlight: false,
    icon: Wrench,
    color: 'gray',
    pricing: {
      monthly: '€0-50/maand',
      setup: '€0-100',
    },
    features: [
      { label: 'Professioneel design', value: 'Templates', positive: false },
      { label: 'Technisch onderhoud', value: 'Zelf doen', positive: false },
      { label: 'Wijzigingen doorvoeren', value: 'Zelf leren', positive: false },
      { label: 'Support & hulp', value: 'Forums/documentatie', positive: false },
      { label: 'Flexibiliteit', value: 'Flexibel', positive: true },
      { label: 'Jouw tijdsinvestering', value: '50-200+ uur', positive: false },
    ],
  },
  {
    id: 'webstability',
    name: 'Webstability',
    tagline: 'Website abonnement',
    highlight: true,
    icon: Sparkles,
    color: 'primary',
    pricing: {
      monthly: '€99/maand',
      setup: '€149 eenmalig',
    },
    features: [
      { label: 'Professioneel design', value: 'Op maat gemaakt', positive: true },
      { label: 'Technisch onderhoud', value: 'Volledig verzorgd', positive: true },
      { label: 'Wijzigingen doorvoeren', value: 'Wij regelen het', positive: true },
      { label: 'Support & hulp', value: 'Persoonlijk contact', positive: true },
      { label: 'Flexibiliteit', value: 'Maandelijks opzegbaar', positive: true },
      { label: 'Jouw tijdsinvestering', value: '~2 uur intake', positive: true },
    ],
  },
]

function FeatureIcon({ positive }: { positive: boolean | null }) {
  if (positive === true) {
    return <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
  }
  if (positive === false) {
    return <X className="w-4 h-4 text-red-400 flex-shrink-0" />
  }
  return <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
}

export default function Comparison() {
  return (
    <section id="comparison" className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary-100/40 to-primary-200/20 dark:from-primary-900/30 dark:to-primary-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-blue-100/30 to-primary-100/20 dark:from-blue-900/20 dark:to-primary-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4"
          >
            <Clock className="w-4 h-4" />
            Vergelijk je opties
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Bespaar{' '}
            <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
              duizenden euro's
            </span>{' '}
            én tijd
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 text-lg"
          >
            Een traditioneel webbureau vraagt €3.000+ en weken werk. Zelf bouwen kost je eindeloos veel tijd.
          </motion.p>
        </div>

        {/* Mobile: Scrollable cards */}
        <div className="md:hidden space-y-4">
          {comparisonOptions.map((option, index) => {
            const Icon = option.icon
            const isHighlighted = option.highlight
            
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl p-5 bg-white dark:bg-gray-800 border shadow-md ${
                  isHighlighted
                    ? 'border-primary-500'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isHighlighted
                      ? 'bg-primary-100 dark:bg-primary-900/50'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Icon className={`w-5 h-5 ${isHighlighted ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white">{option.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{option.tagline}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${isHighlighted ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                      {option.pricing.monthly}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      + {option.pricing.setup}
                    </p>
                  </div>
                </div>

                {/* Features - compact grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {option.features.slice(0, 4).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {isHighlighted ? (
                        <Check className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 flex-shrink-0">
                          {feature.positive === true && <Check className="w-3.5 h-3.5 text-green-500" />}
                          {feature.positive === false && <X className="w-3.5 h-3.5 text-red-400" />}
                          {feature.positive === null && <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                        </span>
                      )}
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{feature.value}</span>
                    </div>
                  ))}
                </div>

                {/* CTA for highlighted */}
                {isHighlighted && (
                  <a
                    href="/start"
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors text-sm group"
                  >
                    Start je project
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Desktop: Comparison Cards */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {comparisonOptions.map((option, index) => {
            const Icon = option.icon
            const isHighlighted = option.highlight
            
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl p-6 lg:p-8 bg-white dark:bg-gray-800 border shadow-lg flex flex-col ${
                  isHighlighted
                    ? 'border-primary-500'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                    isHighlighted
                      ? 'bg-primary-100 dark:bg-primary-900/50'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Icon className={`w-6 h-6 ${isHighlighted ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
                    {option.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {option.tagline}
                  </p>
                </div>

                {/* Pricing */}
                <div className={`rounded-xl p-4 mb-6 ${
                  isHighlighted
                    ? 'bg-primary-50 dark:bg-primary-900/30'
                    : 'bg-gray-50 dark:bg-gray-700/50'
                }`}>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${isHighlighted ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                      {option.pricing.monthly}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Opstartkosten: {option.pricing.setup}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-grow">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {isHighlighted ? (
                        <Check className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <FeatureIcon positive={feature.positive} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {feature.label}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {feature.value}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* CTA for highlighted */}
                {isHighlighted && (
                  <a
                    href="/start"
                    className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors group"
                  >
                    Start je project
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}

                {/* Spacer for non-highlighted cards to align with CTA height */}
                {!isHighlighted && (
                  <div className="mt-6 h-[52px]" />
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Geen verplichtingen
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Maandelijks opzegbaar
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Niet-goed-geld-terug
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
