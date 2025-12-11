import { motion } from 'framer-motion'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { useState } from 'react'

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
    <section id="portfolio" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-4">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Websites die we hebben{' '}
            <span className="text-primary-600">gebouwd</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Bekijk een selectie van websites die we voor onze klanten hebben gemaakt. 
            Elke website is uniek ontworpen en geoptimaliseerd voor resultaat.
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                {/* Screenshot Container */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* Browser Chrome */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-gray-200 flex items-center px-3 gap-1.5 z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <div className="flex-1 mx-3">
                      <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-500 truncate">
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
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
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
                  <div className="flex items-center gap-2 text-primary-600 font-medium text-sm group-hover:gap-3 transition-all">
                    <span>Bekijk website</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Wil jij ook zo'n mooie website?
          </p>
          <a
            href="/start"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25"
          >
            <span>Start jouw project</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
