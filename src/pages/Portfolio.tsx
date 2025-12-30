import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Play, Plane, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface Project {
  id: string
  title: string
  category: string
  image: string
  description: string
  url?: string
  result?: string
}

const portfolioVideos = [
  { id: '1124571038', titleKey: 'portfolioPage.videos.locationOverview' },
  { id: '1124569000', titleKey: 'portfolioPage.videos.aerialFootage' },
  { id: '1124567381', titleKey: 'portfolioPage.videos.photoVideo' },
]

// Projects data with translation keys
const getProjects = (t: (key: string) => string): Project[] => [
  {
    id: '1',
    title: 'Lissers',
    category: t('portfolioPage.categories.business'),
    image: 'https://api.microlink.io/?url=https://lissers.nl&screenshot=true&meta=false&embed=screenshot.url&waitForTimeout=3000',
    description: t('portfolioPage.projects.lissers.description'),
    url: 'https://lissers.nl',
    result: t('portfolioPage.projects.lissers.result')
  },
  {
    id: '2',
    title: 'Hoogduin Onderhoud',
    category: t('portfolioPage.categories.services'),
    image: 'https://api.microlink.io/?url=https://hoogduinonderhoud.nl&screenshot=true&meta=false&embed=screenshot.url&waitForTimeout=3000',
    description: t('portfolioPage.projects.hoogduin.description'),
    url: 'https://hoogduinonderhoud.nl',
    result: t('portfolioPage.projects.hoogduin.result')
  },
  {
    id: '3',
    title: 'Rietveld Hoveniers',
    category: t('portfolioPage.categories.services'),
    image: 'https://api.microlink.io/?url=https://rietveld-hoveniers.nl&screenshot=true&meta=false&embed=screenshot.url&waitForTimeout=3000',
    description: t('portfolioPage.projects.rietveld.description'),
    url: 'https://rietveld-hoveniers.nl',
    result: t('portfolioPage.projects.rietveld.result')
  },
]

export default function Portfolio() {
  const { t } = useTranslation()
  const projects = getProjects(t)
  const [activeCategory, setActiveCategory] = useState(t('portfolioPage.categories.all'))
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const categories = [
    t('portfolioPage.categories.all'),
    t('portfolioPage.categories.services'),
    t('portfolioPage.categories.business'),
    t('portfolioPage.categories.hospitality'),
    t('portfolioPage.categories.creative')
  ]

  const filteredProjects = activeCategory === t('portfolioPage.categories.all') 
    ? projects 
    : projects.filter(p => p.category === activeCategory)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <main>
        {/* Hero - Clean & Simple */}
        <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {t('portfolioPage.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {t('portfolioPage.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Pills */}
        <section className="py-4 border-b border-gray-100 dark:border-gray-800 sticky top-16 bg-white dark:bg-gray-900 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide lg:justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === category
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects - Carousel on Mobile, Grid on Tablet/Desktop */}
        <section className="py-8 sm:py-12 lg:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Carousel - visible only on small screens */}
            <div className="md:hidden relative">
              {/* Scroll buttons */}
              <button
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                aria-label="Vorige"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                aria-label="Volgende"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Carousel container */}
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 pb-4"
                style={{ scrollPaddingLeft: '1rem' }}
              >
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} className="w-[85vw] max-w-[320px] flex-shrink-0 snap-start" />
                ))}
              </div>

              {/* Scroll indicator dots */}
              <div className="flex justify-center gap-2 mt-4">
                {filteredProjects.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"
                  />
                ))}
              </div>
            </div>

            {/* Desktop Grid - md:2 cols, lg:3 cols */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>

            {/* Empty state */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-16 px-4">
                <p className="text-gray-500 dark:text-gray-400">{t('portfolioPage.noProjects')}</p>
                <button
                  onClick={() => setActiveCategory(t('portfolioPage.categories.all'))}
                  className="mt-3 text-primary-600 font-medium hover:underline"
                >
                  {t('portfolioPage.viewAllProjects')}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Drone Section */}
        <section className="py-16 lg:py-24 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium mb-4">
                <Plane className="w-4 h-4" />
                {t('portfolioPage.droneSection.badge')}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {t('portfolioPage.droneSection.title')}
              </h2>
            </div>

            {/* Videos - Carousel on Mobile */}
            <div className="lg:hidden">
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 -mx-4">
                {portfolioVideos.map((video) => (
                  <div
                    key={video.id}
                    className="w-[85vw] max-w-[400px] flex-shrink-0 snap-start aspect-video rounded-xl overflow-hidden"
                  >
                    <iframe
                      src={`https://player.vimeo.com/video/${video.id}?background=1&autoplay=1&loop=1&muted=1`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen"
                      title={t(video.titleKey)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Videos - Grid on Desktop */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
              {portfolioVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative aspect-video rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-orange-500/50 transition-all"
                >
                  <iframe
                    src={`https://player.vimeo.com/video/${video.id}?background=1&autoplay=1&loop=1&muted=1`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    title={t(video.titleKey)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                      <Play className="w-4 h-4" />
                      <span className="font-medium">{t(video.titleKey)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-10">
              <Link
                to="/luchtvideografie"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
              >
                {t('portfolioPage.aerialCta')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

// Project Card Component
function ProjectCard({ project, className = '' }: { project: Project; className?: string }) {
  const { t } = useTranslation()
  return (
    <div className={`group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${className}`}>
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Result badge */}
        {project.result && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
              {project.result}
            </span>
          </div>
        )}

        {/* External link */}
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-700"
            aria-label={`${t('portfolioPage.viewWebsite')} ${project.title}`}
          >
            <ExternalLink className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </a>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <span className="inline-block px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full mb-3">
          {project.category}
        </span>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {project.description}
        </p>
        
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400 text-sm font-medium hover:gap-2.5 transition-all"
          >
            {t('portfolioPage.viewWebsite')}
            <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  )
}
