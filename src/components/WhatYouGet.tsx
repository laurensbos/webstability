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
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react'

interface WhatYouGetProps {
  variant?: 'website' | 'webshop' | 'general'
  showComparison?: boolean
  className?: string
}

const features = [
  {
    icon: Paintbrush,
    title: 'Professioneel maatwerk design',
    description: 'Geen templates. Wij ontwerpen jouw website volledig op maat, passend bij jouw merk.',
    highlight: true,
  },
  {
    icon: Wrench,
    title: 'Volledig gebouwd door ons',
    description: 'Geen DIY gedoe. Wij bouwen alles, jij hoeft alleen feedback te geven.',
    highlight: true,
  },
  {
    icon: Server,
    title: 'Hosting inclusief',
    description: 'Snelle, veilige hosting op Nederlandse servers. Altijd online, altijd snel.',
  },
  {
    icon: Shield,
    title: 'SSL & beveiliging',
    description: 'Gratis SSL-certificaat, dagelijkse backups en continue security monitoring.',
  },
  {
    icon: RefreshCw,
    title: 'Updates & onderhoud',
    description: 'Wij houden alles up-to-date. Geen zorgen over techniek of updates.',
  },
  {
    icon: Headphones,
    title: 'Persoonlijke support',
    description: 'Direct contact via WhatsApp of telefoon. Geen ticketsystemen of wachttijden.',
  },
  {
    icon: Clock,
    title: 'Snelle oplevering',
    description: 'Je website is binnen 1-2 weken live. Inclusief revisierondes.',
  },
  {
    icon: Zap,
    title: 'Razendsnel & SEO-ready',
    description: 'Geoptimaliseerd voor snelheid en vindbaarheid in Google.',
  },
]

const comparisonData = [
  { feature: 'Professioneel design op maat', us: true, diy: false },
  { feature: 'Volledig gebouwd voor jou', us: true, diy: false },
  { feature: 'Hosting inclusief', us: true, diy: 'Extra kosten' },
  { feature: 'SSL-certificaat', us: true, diy: 'Extra kosten' },
  { feature: 'Dagelijkse backups', us: true, diy: false },
  { feature: 'Updates & onderhoud', us: true, diy: false },
  { feature: 'Persoonlijke support', us: true, diy: 'Alleen chat/email' },
  { feature: 'SEO-optimalisatie', us: true, diy: 'Zelf doen' },
  { feature: 'Technische kennis nodig', us: false, diy: true },
  { feature: 'Uren zelf klussen', us: false, diy: true },
]

export default function WhatYouGet({ variant = 'general', showComparison = true, className = '' }: WhatYouGetProps) {
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
            <span className={`text-sm font-medium ${accentColors[variant]}`}>Waarom wij anders zijn</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Geen gedoe.{' '}
            <span className={`bg-gradient-to-r ${gradientColors[variant]} bg-clip-text text-transparent`}>
              Wij regelen alles.
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Bij ons geen DIY website-bouwers of eindeloos zelf klussen. 
            Wij bouwen jouw professionele website, zodat jij kunt focussen op ondernemen.
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
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Webstability vs. Zelf doen
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Waarom een abonnement bij ons voordeliger is dan zelf klussen
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl">
              {/* Table Header */}
              <div className="grid grid-cols-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <div className="p-4 text-left">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Wat je krijgt</span>
                </div>
                <div className="p-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${gradientColors[variant]} text-white text-sm font-semibold`}>
                    <Sparkles className="w-3 h-3" />
                    Webstability
                  </span>
                </div>
                <div className="p-4 text-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">DIY Platforms</span>
                </div>
              </div>

              {/* Table Body */}
              {comparisonData.map((row, index) => (
                <div 
                  key={row.feature}
                  className={`grid grid-cols-3 ${index !== comparisonData.length - 1 ? 'border-b border-gray-100 dark:border-gray-700/50' : ''}`}
                >
                  <div className="p-3 sm:p-4 text-left">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{row.feature}</span>
                  </div>
                  <div className="p-3 sm:p-4 flex items-center justify-center">
                    {row.us === true ? (
                      <CheckCircle2 className={`w-5 h-5 ${accentColors[variant]}`} />
                    ) : row.us === false ? (
                      <X className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                    ) : (
                      <span className="text-xs text-gray-500">{row.us}</span>
                    )}
                  </div>
                  <div className="p-3 sm:p-4 flex items-center justify-center">
                    {row.diy === true ? (
                      <X className="w-5 h-5 text-red-400" />
                    ) : row.diy === false ? (
                      <X className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                    ) : (
                      <span className="text-xs text-gray-500 text-center">{row.diy}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Bespaar tijd en krijg een professioneel resultaat
              </p>
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${gradientColors[variant]} text-white font-semibold`}>
                <Clock className="w-5 h-5" />
                <span>Gemiddeld 40+ uur bespaard</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
