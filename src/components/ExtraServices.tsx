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
    price: '150',
    color: 'purple',
    features: ['3 unieke concepten', '2 revisierondes', 'Alle bestandsformaten', 'Binnen 2 weken klaar'],
    link: '/logo'
  },
  {
    id: 'drone',
    icon: Plane,
    title: 'Luchtvideografie',
    description: 'Spectaculaire luchtopnames van je bedrijf door een gecertificeerde piloot.',
    price: '399',
    color: 'sky',
    features: ['4K video opnames', '10-15 bewerkte foto\'s', 'Gecertificeerd piloot', 'Heel Nederland'],
    link: '/luchtvideografie'
  }
]

export default function ExtraServices() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-600 dark:text-primary-400 font-semibold mb-2"
          >
              Aanvullende diensten
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
            >
              Alles voor een sterke online aanwezigheid
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {extraServices.map((service, index) => {
              const colorClasses = service.color === 'purple'
                ? { bg: 'bg-purple-500', gradient: 'from-purple-500 to-purple-600', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200/50', hover: 'hover:border-purple-300', shadow: 'hover:shadow-purple-100' }
                : { bg: 'bg-sky-500', gradient: 'from-sky-500 to-sky-600', light: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200/50', hover: 'hover:border-sky-300', shadow: 'hover:shadow-sky-100' }

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group bg-white dark:bg-gray-800 rounded-2xl border ${colorClasses.border} dark:border-gray-700 ${colorClasses.hover} overflow-hidden transition-all duration-300 hover:shadow-xl ${colorClasses.shadow} dark:hover:shadow-gray-900/50`}
                >
                  {/* Visual header - different style per service */}
                  <div className="relative h-44 overflow-hidden">
                    {service.id === 'drone' ? (
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-sky-50 to-cyan-50 dark:from-sky-900/30 dark:via-sky-900/20 dark:to-cyan-900/20 flex items-center justify-center">
                        {/* Animated clouds */}
                        <motion.div 
                          className="absolute top-6 left-8 w-16 h-6 bg-white/60 dark:bg-gray-600/40 rounded-full blur-sm"
                          animate={{ x: [0, 20, 0] }}
                          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div 
                          className="absolute top-10 right-12 w-12 h-4 bg-white/50 dark:bg-gray-600/30 rounded-full blur-sm"
                          animate={{ x: [0, -15, 0] }}
                          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div 
                          className="absolute bottom-16 left-16 w-10 h-3 bg-white/40 dark:bg-gray-600/20 rounded-full blur-sm"
                          animate={{ x: [0, 10, 0] }}
                          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        
                        {/* Drone with animation */}
                        <div className="relative">
                          {/* Drone shadow on ground */}
                          <motion.div 
                            className="absolute top-20 left-1/2 -translate-x-1/2 w-12 h-3 bg-sky-200/50 dark:bg-sky-700/30 rounded-full blur-md"
                            animate={{ scale: [1, 0.9, 1], opacity: [0.5, 0.3, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          />
                          
                          {/* Floating abstract shapes around drone */}
                          <motion.div 
                            className="absolute -top-10 -left-10 w-16 h-16 bg-gradient-to-br from-sky-300/40 to-cyan-300/40 dark:from-sky-500/30 dark:to-cyan-500/30 rounded-2xl rotate-12"
                            animate={{ rotate: [12, 18, 12], y: [0, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                          />
                          <motion.div 
                            className="absolute -bottom-8 -right-8 w-14 h-14 bg-gradient-to-br from-cyan-300/40 to-sky-300/40 dark:from-cyan-500/30 dark:to-sky-500/30 rounded-full"
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          />
                          
                          {/* Main drone body - static */}
                          <div className="relative w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-200 dark:shadow-sky-900/50">
                            <Plane className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 dark:from-purple-900/30 dark:via-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                        {/* Abstract logo design elements */}
                        <div className="relative">
                          <motion.div 
                            className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-300/50 to-pink-300/50 dark:from-purple-500/30 dark:to-pink-500/30 rounded-2xl rotate-12"
                            animate={{ rotate: [12, 18, 12] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                          />
                          <motion.div 
                            className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-pink-300/50 to-purple-300/50 dark:from-pink-500/30 dark:to-purple-500/30 rounded-full"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          />
                          <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 dark:shadow-purple-900/50">
                            <Palette className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Gradient overlay for smooth transition */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white dark:from-gray-800 to-transparent" />
                  </div>

                  <div className="p-6 pt-2">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{service.title}</h3>
                        <p className={`text-lg font-bold ${colorClasses.text}`}>
                          €{service.price} <span className="text-gray-400 dark:text-gray-500 font-normal text-sm">excl. btw</span>
                        </p>
                      </div>
                      <div className={`p-2.5 ${colorClasses.light} dark:bg-opacity-20 rounded-xl`}>
                        <service.icon className={`w-5 h-5 ${colorClasses.text}`} />
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-5">{service.description}</p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className={`w-4 h-4 ${colorClasses.text} flex-shrink-0`} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to={`/start?dienst=${service.id}`}
                        className={`flex-1 py-3 bg-gradient-to-r ${colorClasses.gradient} text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2`}
                      >
                        Direct aanvragen
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        to={service.link}
                        className={`px-5 py-3 ${colorClasses.light} dark:bg-gray-700 ${colorClasses.text} dark:text-gray-300 font-semibold rounded-xl transition hover:opacity-80`}
                      >
                        Meer info
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
  )
}
