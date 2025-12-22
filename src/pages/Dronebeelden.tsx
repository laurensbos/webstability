import { motion } from 'framer-motion'
import { 
  Plane, 
  Video, 
  Camera,
  Check,
  ArrowRight,
  Shield,
  MapPin,
  Clock,
  Play,
  Award,
  Sparkles,
  Zap
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TrustpilotReviews from '../components/TrustpilotReviews'

// Drone packages - centralized
const dronePackages = [
  {
    id: 'starter',
    name: 'Basis',
    price: 349,
    description: 'Perfect voor kleine projecten',
    features: ["10 bewerkte foto's", '1 locatie', 'Digitale levering', 'Binnen 5 werkdagen'],
    icon: Camera,
  },
  {
    id: 'professional',
    name: 'Professioneel',
    price: 549,
    popular: true,
    description: "Foto's + video voor maximale impact",
    features: ["25 bewerkte foto's", '1-2 locaties', '1 min bewerkte video', 'Binnen 3 werkdagen', 'Ruwe bestanden'],
    icon: Video,
  },
  {
    id: 'business',
    name: 'Premium',
    price: 849,
    description: 'Complete coverage voor grote projecten',
    features: ["50+ foto's", 'Meerdere locaties', '3 min video', 'Spoedlevering', 'Ruwe bestanden', 'Revisies'],
    icon: Zap,
  },
]

// Portfolio videos
const portfolioVideos = [
  { id: '1124571038', title: 'Locatie overview' },
  { id: '1124569000', title: 'Luchtopname' },
  { id: '1124567381', title: 'Luchtfoto & video' },
]

// Quick USPs for hero
const heroUSPs = [
  { icon: Shield, text: 'EU-gecertificeerd' },
  { icon: MapPin, text: 'Heel Nederland' },
  { icon: Clock, text: 'Binnen 5 dagen' },
]

// What's included - compact
const included = [
  'Voorbespreking & planning',
  'Vliegvergunning aanvragen',
  'Tot 2 uur op locatie',
  'Professionele nabewerking',
  'Commercieel gebruiksrecht',
  'Reiskosten inbegrepen',
]

export default function Luchtvideografie() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activePkgIndex, setActivePkgIndex] = useState(1)

  const handlePkgScroll = () => {
    if (!scrollRef.current) return
    const cardWidth = 300 + 16
    const index = Math.round(scrollRef.current.scrollLeft / cardWidth)
    setActivePkgIndex(Math.min(index, dronePackages.length - 1))
  }

  const getVimeoUrl = (videoId: string, background = true) => {
    if (background) {
      return `https://player.vimeo.com/video/${videoId}?background=1&autoplay=1&loop=1&muted=1`
    }
    return `https://player.vimeo.com/video/${videoId}?autoplay=1&quality=1080p`
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <main>
        {/* Hero - Simplified with single video */}
        <section className="relative min-h-[85vh] lg:min-h-[80vh] flex items-center overflow-hidden bg-gray-900 pt-20">
          {/* Single video background - full width cover */}
          <div className="absolute inset-0 z-0">
            <iframe
              src="https://player.vimeo.com/video/1124571038?background=1&autoplay=1&loop=1&muted=1&quality=720p"
              className="absolute w-[300%] h-[300%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full"
              style={{ aspectRatio: '16/9' }}
              frameBorder="0"
              allow="autoplay; fullscreen"
              title="Luchtopname achtergrond"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/80 to-gray-900" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <Plane className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-orange-300">Luchtfoto & Videografie</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6 leading-tight">
                  Professionele{' '}
                  <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">luchtopnames</span>
                  {' '}voor jouw bedrijf
                </h1>

                <p className="text-lg lg:text-xl text-gray-300 mb-6 lg:mb-8 max-w-xl">
                  Maak indruk met spectaculaire drone foto's en video's. 
                  Eenmalig vanaf <span className="text-white font-semibold">€349</span>.
                </p>

                {/* Quick USPs */}
                <div className="flex flex-wrap gap-3 lg:gap-4 mb-8">
                  {heroUSPs.map((usp, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <usp.icon className="w-3.5 h-3.5 text-orange-400" />
                      </div>
                      <span>{usp.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/start?dienst=drone"
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 lg:px-8 lg:py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25"
                  >
                    Vraag offerte aan
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#portfolio"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 lg:px-8 lg:py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
                  >
                    <Play className="w-4 h-4" />
                    Bekijk voorbeelden
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Compact USP Bar */}
        <section className="py-8 lg:py-12 bg-gradient-to-r from-orange-500 to-amber-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {[
                { icon: Shield, title: 'EU-gecertificeerd', desc: 'A1/A2/A3 dronebewijs' },
                { icon: Video, title: '4K Video', desc: 'Kristalheldere kwaliteit' },
                { icon: Clock, title: 'Snelle levering', desc: 'Binnen 5 werkdagen' },
                { icon: Award, title: 'Verzekerd', desc: 'Volledige dekking' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm lg:text-base">{item.title}</div>
                    <div className="text-white/70 text-xs lg:text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio - Video showcase */}
        <section id="portfolio" className="py-16 lg:py-24 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-10 lg:mb-12">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 rounded-full text-sm font-medium mb-4"
              >
                <Play className="w-4 h-4" />
                Ons werk
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
              >
                Bekijk onze luchtopnames
              </motion.h2>
            </div>

            {/* Video Grid - Desktop */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
              {portfolioVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 hover:ring-orange-500/40 transition-all cursor-pointer"
                  onClick={() => setActiveVideo(video.id)}
                >
                  <iframe
                    src={getVimeoUrl(video.id)}
                    className="absolute inset-0 w-full h-full scale-105"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    title={video.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-gray-900 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-medium">{video.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Video Carousel - Mobile */}
            <div className="lg:hidden">
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                {portfolioVideos.map((video) => (
                  <div
                    key={video.id}
                    className="flex-shrink-0 w-[85vw] aspect-video rounded-xl overflow-hidden snap-center"
                    onClick={() => setActiveVideo(video.id)}
                  >
                    <iframe
                      src={getVimeoUrl(video.id)}
                      className="w-full h-full scale-105"
                      frameBorder="0"
                      allow="autoplay"
                      title={video.title}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section id="pakketten" className="py-16 lg:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-50/50 via-amber-50/30 to-transparent dark:from-orange-900/10 dark:via-amber-900/5 dark:to-transparent rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <div className="text-center mb-10 lg:mb-12">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block text-orange-600 dark:text-orange-400 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Pakketten
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Kies je luchtfoto pakket
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto"
              >
                Eenmalige investering, inclusief alles. BTW aftrekbaar voor zakelijk gebruik.
              </motion.p>
            </div>

            {/* Mobile: Carousel */}
            <div className="lg:hidden">
              <div className="text-center text-xs text-gray-400 mb-3">← Swipe voor meer →</div>
              <div
                ref={scrollRef}
                onScroll={handlePkgScroll}
                className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
              >
                {dronePackages.map((pkg, index) => {
                  const IconComponent = pkg.icon
                  return (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex-shrink-0 w-[300px] p-6 bg-white dark:bg-gray-800 rounded-2xl snap-center relative ${
                        pkg.popular 
                          ? 'border-2 border-orange-500 shadow-lg shadow-orange-500/10' 
                          : 'border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Meest gekozen
                          </span>
                        </div>
                      )}

                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{pkg.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{pkg.description}</p>
                      </div>

                      <div className="text-center mb-5">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">€{pkg.price}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">eenmalig incl. btw</p>
                      </div>

                      <ul className="space-y-2 mb-5">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Link 
                        to={`/start?dienst=drone&pakket=${pkg.id}`}
                        className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${
                          pkg.popular
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200'
                        }`}
                      >
                        Kies {pkg.name}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Dot indicators */}
              <div className="flex justify-center gap-2 mt-3">
                {dronePackages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!scrollRef.current) return
                      const cardWidth = 300 + 16
                      scrollRef.current.scrollTo({ left: cardWidth * idx, behavior: 'smooth' })
                    }}
                    className={`h-2 rounded-full transition-all ${
                      idx === activePkgIndex ? 'bg-orange-500 w-6' : 'bg-gray-300 dark:bg-gray-600 w-2'
                    }`}
                    aria-label={`Ga naar pakket ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop: Grid */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
              {dronePackages.map((pkg, index) => {
                const IconComponent = pkg.icon
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-6 bg-white dark:bg-gray-800 rounded-2xl ${
                      pkg.popular 
                        ? 'border-2 border-orange-500 shadow-xl shadow-orange-500/10 scale-105' 
                        : 'border border-gray-200 dark:border-gray-700'
                    } hover:shadow-xl transition-all`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          Meest gekozen
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{pkg.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{pkg.description}</p>
                    </div>

                    <div className="text-center mb-6">
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">€{pkg.price}</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">eenmalig incl. btw</p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={`/start?dienst=drone&pakket=${pkg.id}`}
                      className={`block w-full text-center py-3.5 rounded-xl font-semibold transition-all ${
                        pkg.popular
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                      }`}
                    >
                      Kies {pkg.name}
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* What's included - compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 p-6 lg:p-8 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-100 dark:border-orange-800/30 rounded-2xl"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white text-center mb-4">
                Bij elk pakket inbegrepen
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {included.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trustpilot Reviews */}
        <TrustpilotReviews className="bg-gray-50 dark:bg-gray-800/50" />

        {/* Final CTA - Compact */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-900 via-gray-900 to-orange-900/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-orange-300">Klaar om te starten?</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                Vraag vandaag nog een{' '}
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  offerte
                </span>{' '}aan
              </h2>
              
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Professionele luchtfoto's en video's binnen 5 werkdagen. 
                Vrijblijvend advies, geen verplichtingen.
              </p>

              <Link
                to="/start?dienst=drone"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25"
              >
                Start je luchtfoto project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer ctaVariant="drone" />

      {/* Video Modal */}
      {activeVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={() => setActiveVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={getVimeoUrl(activeVideo, false)}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen"
              title="Video"
            />
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
