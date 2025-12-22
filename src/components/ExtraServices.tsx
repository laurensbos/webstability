import { motion } from 'framer-motion'
import { 
  Palette, 
  Plane, 
  ArrowRight, 
  CheckCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'

const extraServices = [
  {
    id: 'logo',
    icon: Palette,
    title: 'Logo laten maken',
    description: 'Professioneel logo ontwerp inclusief 3 concepten en 2 revisierondes.',
    price: '169',
    features: ['3 unieke concepten', '2 revisierondes', 'Alle bestandsformaten', 'Binnen 2 weken klaar'],
    link: '/logo'
  },
  {
    id: 'drone',
    icon: Plane,
    title: 'Luchtvideografie',
    description: 'Spectaculaire luchtopnames van je bedrijf door een gecertificeerde piloot.',
    price: '349',
    features: ['4K video opnames', '10-15 bewerkte foto\'s', 'Gecertificeerd piloot', 'Heel Nederland'],
    link: '/luchtvideografie'
  }
]

export default function ExtraServices() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section divider with label */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
            Eenmalige diensten
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
        </div>

        {/* Mobile: Compact horizontal cards */}
        <div className="sm:hidden flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {extraServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[280px] snap-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">€{service.price}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs block">eenmalig incl. btw</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{service.title}</h3>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{service.description}</p>

                {/* Compact features */}
                <div className="space-y-1.5 mb-4">
                  {service.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <Link
                    to={`/start?dienst=${service.id}`}
                    className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Aanvragen
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={service.link}
                    className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium rounded-lg text-sm transition-colors"
                  >
                    Info
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: Clean cards */}
        <div className="hidden sm:grid sm:grid-cols-2 gap-6">
          {extraServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="p-6">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{service.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Eenmalig</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">€{service.price}</span>
                    <span className="text-gray-400 dark:text-gray-500 text-xs block">incl. btw</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-5">{service.description}</p>

                {/* Features grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Link
                    to={`/start?dienst=${service.id}`}
                    className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    Direct aanvragen
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to={service.link}
                    className="px-5 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold rounded-xl transition-colors"
                  >
                    Meer info
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
