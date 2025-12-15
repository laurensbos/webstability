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
    description: 'Professionele website voor een innovatief bedrijf',
    category: 'Zakelijk',
    gradient: 'from-blue-500 to-purple-600',
    screenshot: 'https://api.microlink.io/?url=https://lissers.nl&screenshot=true&meta=false&embed=screenshot.url&waitForTimeout=3000',
  },
  {
    id: 2,
    name: 'Hoogduin Onderhoud',
    url: 'https://hoogduinonderhoud.nl',
    description: 'Moderne website voor onderhoudsbedrijf',
    category: 'Dienstverlening',
    gradient: 'from-green-500 to-teal-600',
    screenshot: 'https://api.microlink.io/?url=https://hoogduinonderhoud.nl&screenshot=true&meta=false&embed=screenshot.url&waitForTimeout=3000',
  },
  {
    id: 3,
    name: 'Rietveld Hoveniers',
    url: 'https://rietveld-hoveniers.nl',
    description: 'Stijlvolle website voor hoveniersbedrijf',
    category: 'Dienstverlening',
    gradient: 'from-orange-500 to-red-600',
    screenshot: 'https://api.microlink.io/?url=https://rietveld-hoveniers.nl&screenshot=true&meta=false&embed=screenshot.url&waitForTimeout=3000',
  },
]

export default function Portfolio() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())

  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => new Set(prev).add(id))
  }

  const handleImageError = (id: number) => {
    setFailedImages(prev => new Set(prev).add(id))
  }

  return (
    <section id="portfolio" className="py-16 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-bl from-primary-100/30 to-blue-100/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-100/20 to-primary-100/20 rounded-full blur-3xl" />
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
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-2 mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-primary-700 font-medium text-sm">Ons werk</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
            Websites die we hebben{' '}
            <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">gebouwd</span>
          </h2>
          <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">
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
                <div className="relative bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-200/80 hover:shadow-xl hover:border-primary-200/50 transition-all">
                  {/* Screenshot Container */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* Gradient Fallback */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                      {!loadedImages.has(item.id) && !failedImages.has(item.id) && (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      )}
                      {failedImages.has(item.id) && (
                        <div className="text-white text-center">
                          <div className="text-2xl font-bold">{item.name.charAt(0)}</div>
                        </div>
                      )}
                    </div>
                    
                    <img
                      src={item.screenshot}
                      alt={`Screenshot van ${item.name}`}
                      className={`relative w-full h-full object-cover object-top transition-opacity duration-500 ${
                        loadedImages.has(item.id) ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading="lazy"
                      onLoad={() => handleImageLoad(item.id)}
                      onError={() => handleImageError(item.id)}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <span className="text-[10px] font-semibold text-primary-600 bg-gradient-to-r from-primary-50 to-blue-50 px-2.5 py-1 rounded-full border border-primary-100/50">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-2 mb-1">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-primary-600 font-semibold text-xs">
                      <span>Bekijk</span>
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
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300" />
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
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 border border-gray-200/80 hover:border-primary-200/50 hover:-translate-y-1">
                {/* Screenshot Container */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* Browser Chrome */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center px-3 gap-1.5 z-10 border-b border-gray-200/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-sm" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-sm" />
                    <div className="flex-1 mx-3">
                      <div className="bg-white/80 backdrop-blur-sm rounded-md px-3 py-1 text-xs text-gray-500 truncate border border-gray-200/50">
                        {item.url.replace('https://', '')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Screenshot with gradient fallback */}
                  <div className="pt-8 h-full relative">
                    {/* Gradient Fallback (always visible behind image) */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                      {!loadedImages.has(item.id) && !failedImages.has(item.id) && (
                        <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      )}
                      {failedImages.has(item.id) && (
                        <div className="text-white text-center">
                          <div className="text-4xl font-bold mb-2">{item.name.charAt(0)}</div>
                          <div className="text-sm opacity-75">{item.url.replace('https://', '')}</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Actual Screenshot */}
                    <img
                      src={item.screenshot}
                      alt={`Screenshot van ${item.name}`}
                      className={`relative w-full h-full object-cover object-top transition-opacity duration-500 ${
                        loadedImages.has(item.id) ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading="lazy"
                      onLoad={() => handleImageLoad(item.id)}
                      onError={() => handleImageError(item.id)}
                    />
                  </div>

                  {/* Hover Overlay */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: hoveredItem === item.id ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent flex items-end justify-center pb-8 pointer-events-none"
                  >
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <ExternalLink className="w-5 h-5" />
                      <span>Bekijk live website</span>
                    </div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-primary-600 bg-gradient-to-r from-primary-50 to-blue-50 px-3 py-1.5 rounded-full border border-primary-100/50">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {item.description}
                  </p>
                  
                  {/* Button */}
                  <div className="flex items-center gap-2 text-primary-600 font-semibold text-sm group-hover:gap-3 transition-all">
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
