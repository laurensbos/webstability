import { motion } from 'framer-motion'
import { ExternalLink, Sparkles } from 'lucide-react'
import { useState } from 'react'
import AutoScrollCarousel from './AutoScrollCarousel'

// Floating particles for visual appeal
function FloatingParticles() {
  const particles = [
    { size: 4, x: '8%', y: '15%', delay: 0, duration: 9 },
    { size: 5, x: '92%', y: '20%', delay: 1.2, duration: 11 },
    { size: 3, x: '15%', y: '75%', delay: 0.6, duration: 8 },
    { size: 6, x: '88%', y: '65%', delay: 2, duration: 10 },
    { size: 4, x: '50%', y: '8%', delay: 1.5, duration: 9.5 },
    { size: 3, x: '75%', y: '85%', delay: 0.8, duration: 8.5 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-primary-400 to-blue-500"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

const portfolioItems = [
  {
    id: 1,
    name: 'Lissers',
    url: 'https://lissers.nl',
    description: 'Moderne website voor een professioneel bedrijf in de Bollenstreek.',
    category: 'Zakelijk',
    gradient: 'from-blue-600 to-indigo-700',
    icon: '🏢',
    result: 'Website binnen 5 dagen live',
  },
  {
    id: 2,
    name: 'Hoogduin Onderhoud',
    url: 'https://hoogduinonderhoud.nl',
    description: 'Professionele website voor onderhoud en renovatie in de Bollenstreek.',
    category: 'Dienstverlening',
    gradient: 'from-emerald-600 to-teal-700',
    icon: '🏡',
    result: 'Meer offerteaanvragen via website',
  },
  {
    id: 3,
    name: 'Rietveld Hoveniers',
    url: 'https://rietveld-hoveniers.nl',
    description: 'Stijlvolle website voor hoveniersbedrijf met portfolio van projecten.',
    category: 'Dienstverlening',
    gradient: 'from-orange-500 to-amber-600',
    icon: '🌿',
    result: 'Professionele online uitstraling',
  },
]

export default function Portfolio() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  return (
    <section id="portfolio" className="py-16 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-bl from-primary-100/30 to-blue-100/20 dark:from-primary-900/20 dark:to-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-100/20 to-primary-100/20 dark:from-purple-900/10 dark:to-primary-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-primary-200 dark:border-primary-800 rounded-full px-4 py-2 mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-primary-700 dark:text-primary-400 font-medium text-sm">Ons werk</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">
            Websites die we hebben{' '}
            <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">gebouwd</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg max-w-2xl mx-auto">
            Bekijk een selectie van websites die we voor onze klanten hebben gemaakt. 
          </p>
        </motion.div>

        {/* Mobile: Horizontal scroll carousel with auto-scroll */}
        <div className="lg:hidden">
          <AutoScrollCarousel className="flex gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory" speed={25}>
            {portfolioItems.map((item, index) => (
              <motion.a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[280px] snap-start group block"
              >
                <div className="relative bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-700 transition-all">
                  {/* Gradient Header with Icon */}
                  <div className={`relative bg-gradient-to-br ${item.gradient} p-6 text-center`}>
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <div className="text-white/80 text-xs font-medium tracking-wider uppercase">
                      {item.url.replace('https://', '')}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 bg-white dark:bg-gray-800">
                    <span className="text-[10px] font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 rounded-full border border-primary-100 dark:border-primary-800">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      {item.description}
                    </p>
                    {/* Result badge */}
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                      <span>✓</span>
                      <span>{item.result}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-semibold text-xs mt-3">
                      <span>Bekijk website</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </AutoScrollCarousel>
          {/* Scroll indicator */}
          <div className="flex justify-center gap-1.5 mt-2">
            {portfolioItems.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <motion.a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="group block"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:-translate-y-1">
                {/* Gradient Header */}
                <div className={`relative bg-gradient-to-br ${item.gradient} p-8`}>
                  {/* Browser Chrome Dots */}
                  <div className="absolute top-4 left-4 flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                  </div>
                  
                  {/* Icon and URL */}
                  <div className="text-center pt-4">
                    <motion.div 
                      className="text-5xl mb-3"
                      animate={{ 
                        scale: hoveredItem === item.id ? 1.1 : 1,
                        rotate: hoveredItem === item.id ? [0, -5, 5, 0] : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-white/90 text-sm font-medium">
                        {item.url.replace('https://', '')}
                      </span>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: hoveredItem === item.id ? 1 : 0 }}
                    className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none"
                  >
                    <div className="flex items-center gap-2 text-white font-semibold bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>Bekijk live</span>
                    </div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-full border border-primary-100 dark:border-primary-800">
                      {item.category}
                    </span>
                    {/* Result badge */}
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span>✓</span>
                      <span className="hidden sm:inline">{item.result}</span>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {item.description}
                  </p>
                  
                  {/* Button */}
                  <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Bekijk website</span>
                    <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
