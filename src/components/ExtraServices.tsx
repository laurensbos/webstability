import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Palette, 
  Plane, 
  ArrowRight, 
  CheckCircle,
  X,
  Loader2,
  Mail,
  Phone,
  User,
  Building2
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

interface RequestModalProps {
  service: typeof extraServices[0] | null
  onClose: () => void
}

function RequestModal({ service, onClose }: RequestModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    remarks: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!service) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: service.id,
          serviceName: service.title,
          price: service.price,
          ...formData
        })
      })

      if (response.ok) {
        setIsSuccess(true)
      } else {
        throw new Error('Request failed')
      }
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('Er ging iets mis. Probeer het opnieuw of mail naar info@webstability.nl')
    } finally {
      setIsSubmitting(false)
    }
  }

  const colorClasses = service.color === 'purple' 
    ? { bg: 'bg-purple-500', hover: 'hover:bg-purple-600', light: 'bg-purple-50', text: 'text-purple-600' }
    : { bg: 'bg-sky-500', hover: 'hover:bg-sky-600', light: 'bg-sky-50', text: 'text-sky-600' }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {!isSuccess ? (
          <>
            <div className={`${colorClasses.light} p-6 border-b`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${colorClasses.bg} rounded-xl`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                    <p className={`${colorClasses.text} font-semibold`}>€{service.price} excl. btw</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-lg transition">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" /> Naam *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Je naam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" /> Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="je@email.nl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" /> Telefoon
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="06 12345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building2 className="w-4 h-4 inline mr-1" /> Bedrijfsnaam
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Je bedrijfsnaam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Extra informatie
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  placeholder="Vertel ons meer over wat je zoekt..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 ${colorClasses.bg} ${colorClasses.hover} text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verzenden...
                  </>
                ) : (
                  <>
                    Aanvragen
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className={`w-16 h-16 ${colorClasses.light} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <CheckCircle className={`w-8 h-8 ${colorClasses.text}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aanvraag ontvangen!</h3>
            <p className="text-gray-600 mb-6">
              We nemen zo snel mogelijk contact met je op om de details te bespreken.
            </p>
            <button
              onClick={onClose}
              className={`px-6 py-3 ${colorClasses.bg} ${colorClasses.hover} text-white font-semibold rounded-xl transition`}
            >
              Sluiten
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function ExtraServices() {
  const [selectedService, setSelectedService] = useState<typeof extraServices[0] | null>(null)

  return (
    <>
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary-600 font-semibold mb-2"
            >
              Aanvullende diensten
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900"
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
                  className={`group bg-white rounded-2xl border ${colorClasses.border} ${colorClasses.hover} overflow-hidden transition-all duration-300 hover:shadow-xl ${colorClasses.shadow}`}
                >
                  {/* Visual header - different style per service */}
                  <div className="relative h-44 overflow-hidden">
                    {service.id === 'drone' ? (
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-sky-50 to-cyan-50 flex items-center justify-center">
                        {/* Animated clouds */}
                        <motion.div 
                          className="absolute top-6 left-8 w-16 h-6 bg-white/60 rounded-full blur-sm"
                          animate={{ x: [0, 20, 0] }}
                          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div 
                          className="absolute top-10 right-12 w-12 h-4 bg-white/50 rounded-full blur-sm"
                          animate={{ x: [0, -15, 0] }}
                          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div 
                          className="absolute bottom-16 left-16 w-10 h-3 bg-white/40 rounded-full blur-sm"
                          animate={{ x: [0, 10, 0] }}
                          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        
                        {/* Drone with animation */}
                        <div className="relative">
                          {/* Drone shadow on ground */}
                          <motion.div 
                            className="absolute top-20 left-1/2 -translate-x-1/2 w-12 h-3 bg-sky-200/50 rounded-full blur-md"
                            animate={{ scale: [1, 0.9, 1], opacity: [0.5, 0.3, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          />
                          
                          {/* Floating abstract shapes around drone */}
                          <motion.div 
                            className="absolute -top-10 -left-10 w-16 h-16 bg-gradient-to-br from-sky-300/40 to-cyan-300/40 rounded-2xl rotate-12"
                            animate={{ rotate: [12, 18, 12], y: [0, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                          />
                          <motion.div 
                            className="absolute -bottom-8 -right-8 w-14 h-14 bg-gradient-to-br from-cyan-300/40 to-sky-300/40 rounded-full"
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          />
                          
                          {/* Main drone body - static */}
                          <div className="relative w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-200">
                            <Plane className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 flex items-center justify-center">
                        {/* Abstract logo design elements */}
                        <div className="relative">
                          <motion.div 
                            className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-300/50 to-pink-300/50 rounded-2xl rotate-12"
                            animate={{ rotate: [12, 18, 12] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                          />
                          <motion.div 
                            className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-pink-300/50 to-purple-300/50 rounded-full"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          />
                          <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
                            <Palette className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Gradient overlay for smooth transition */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                  </div>

                  <div className="p-6 pt-2">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                        <p className={`text-lg font-bold ${colorClasses.text}`}>
                          €{service.price} <span className="text-gray-400 font-normal text-sm">excl. btw</span>
                        </p>
                      </div>
                      <div className={`p-2.5 ${colorClasses.light} rounded-xl`}>
                        <service.icon className={`w-5 h-5 ${colorClasses.text}`} />
                      </div>
                    </div>

                    <p className="text-gray-600 mb-5">{service.description}</p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className={`w-4 h-4 ${colorClasses.text} flex-shrink-0`} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedService(service)}
                        className={`flex-1 py-3 bg-gradient-to-r ${colorClasses.gradient} text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2`}
                      >
                        Direct aanvragen
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <Link
                        to={service.link}
                        className={`px-5 py-3 ${colorClasses.light} ${colorClasses.text} font-semibold rounded-xl transition hover:opacity-80`}
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

      <AnimatePresence>
        {selectedService && (
          <RequestModal 
            service={selectedService} 
            onClose={() => setSelectedService(null)} 
          />
        )}
      </AnimatePresence>
    </>
  )
}
