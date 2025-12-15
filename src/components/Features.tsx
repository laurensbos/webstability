import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Zap, 
  Shield, 
  Palette, 
  Headphones, 
  TrendingUp, 
  RefreshCw 
} from 'lucide-react'
import AutoScrollCarousel from './AutoScrollCarousel'

const features = [
  {
    icon: Zap,
    title: 'Razendsnel online',
    description: 'Je website is binnen 7 werkdagen live. Wij regelen alles: hosting, domein en SSL.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: Palette,
    title: 'Op maat gemaakt',
    description: 'Geen standaard templates. Jouw website wordt volledig afgestemd op jouw merk en doelen.',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    icon: Shield,
    title: 'Veilig & betrouwbaar',
    description: 'SSL-certificaat, dagelijkse backups en 99.9% uptime garantie zijn standaard inbegrepen.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Headphones,
    title: 'Persoonlijke support',
    description: 'Direct contact met je eigen websitebeheerder. Geen ticketsystemen of wachtrijen.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: TrendingUp,
    title: 'SEO geoptimaliseerd',
    description: 'Gevonden worden in Google? Elke website wordt gebouwd met SEO best practices.',
    color: 'bg-primary-100 text-primary-600',
  },
  {
    icon: RefreshCw,
    title: 'Maandelijkse updates',
    description: 'Tekst wijzigen? Nieuwe foto\'s? Wij voeren elke maand gratis aanpassingen door.',
    color: 'bg-purple-100 text-purple-600',
  },
]

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" className="py-16 lg:py-32 bg-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-3 lg:mb-4"
          >
            Waarom Webstability
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6"
          >
            Alles wat je nodig hebt,{' '}
            <span className="text-primary-600">
              niets wat je niet nodig hebt
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-base lg:text-lg"
          >
            Geen verborgen kosten, geen technisch gedoe. 
            Focus op je bedrijf terwijl wij zorgen voor je online aanwezigheid.
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
                className="flex-shrink-0 w-[280px] snap-start bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
              >
                {/* Icon + Title row */}
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${feature.color}`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-gray-900 font-semibold text-base">
                    {feature.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </AutoScrollCarousel>
          {/* Scroll indicator */}
          <div className="flex justify-center gap-1.5 mt-3">
            {features.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300" />
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
              className="group relative bg-white border border-gray-100 rounded-2xl p-8 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300"
            >
              {/* Icon + Title row */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`inline-flex p-3 rounded-xl ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-gray-900 font-semibold text-xl">
                  {feature.title}
                </h3>
              </div>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
