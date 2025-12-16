import { motion } from 'framer-motion'
import { 
  Plane, 
  Video, 
  Camera,
  CheckCircle,
  ArrowRight,
  Shield,
  MapPin,
  Clock,
  Play,
  Award,
  FileCheck,
  BadgeCheck
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TrustpilotReviews from '../components/TrustpilotReviews'

// Floating particles component with orange accents
function FloatingParticles() {
  const particles = [
    { size: 4, x: '10%', y: '20%', delay: 0, duration: 4 },
    { size: 6, x: '20%', y: '60%', delay: 1, duration: 5 },
    { size: 3, x: '80%', y: '30%', delay: 0.5, duration: 4.5 },
    { size: 5, x: '70%', y: '70%', delay: 1.5, duration: 5.5 },
    { size: 4, x: '90%', y: '50%', delay: 2, duration: 4 },
    { size: 7, x: '15%', y: '80%', delay: 0.8, duration: 6 },
    { size: 3, x: '60%', y: '15%', delay: 1.2, duration: 4.2 },
    { size: 5, x: '40%', y: '85%', delay: 0.3, duration: 5.3 },
  ]

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-orange-400 to-amber-500"
          style={{ 
            width: p.size, 
            height: p.size, 
            left: p.x, 
            top: p.y,
            opacity: 0.4 + (p.size / 20)
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  )
}

const features = [
  {
    icon: Shield,
    title: 'Gecertificeerde piloten',
    description: 'Al onze piloten zijn EU-gecertificeerd met A1/A2 en A3 dronebewijzen conform EASA-regelgeving.'
  },
  {
    icon: Video,
    title: '4K video opnames',
    description: 'Kristalheldere beelden in 4K resolutie voor maximale impact en professionaliteit.'
  },
  {
    icon: Camera,
    title: 'Hoge resolutie foto\'s',
    description: 'Scherpe luchtfoto\'s perfect voor je website, social media of drukwerk.'
  },
  {
    icon: MapPin,
    title: 'Op locatie in heel Nederland',
    description: 'We komen naar jouw bedrijf, project of locatie toe. Reiskosten inbegrepen.'
  },
  {
    icon: Clock,
    title: 'Snelle levering',
    description: 'Bewerkte beelden binnen 5 werkdagen opgeleverd, inclusief kleurcorrectie.'
  },
  {
    icon: Plane,
    title: 'Professionele apparatuur',
    description: 'DJI Mavic 3 Pro met Hasselblad camera voor de beste beeldkwaliteit.'
  },
]

const included = [
  'Voorbespreking & planning',
  'Vliegvergunning aanvragen',
  'Tot 2 uur op locatie',
  '10-15 bewerkte foto\'s',
  '1-2 minuten editted video',
  'Ruwe bestanden inbegrepen',
  'Commercieel gebruiksrecht',
  'Reiskosten heel Nederland',
]

const useCases = [
  'Bedrijfspanden & kantoren',
  'Bouwprojecten & vastgoed',
  'Evenementen & festivals',
  'Agrarische bedrijven',
  'Hotels & accommodaties',
  'Restaurants met terras',
  'Sport- & recreatieparken',
  'Jachthavens & campings',
]

const portfolioVideos = [
  { id: '1124571038', title: 'Locatie overview' },
  { id: '1124569000', title: 'Luchtopname' },
  { id: '1124567381', title: 'Luchtfoto & video' },
]

export default function Luchtvideografie() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <main>
        {/* Hero - with drone footage background */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gray-900 pt-20">
          {/* Video background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 grid grid-cols-3 gap-1 opacity-40">
              {portfolioVideos.map((video) => (
                <div key={video.id} className="relative h-full overflow-hidden">
                  <iframe
                    src={`https://player.vimeo.com/video/${video.id}?background=1&autoplay=1&loop=1&muted=1&quality=720p`}
                    className="absolute inset-0 w-full h-full scale-150 object-cover"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    title={video.title}
                  />
                </div>
              ))}
            </div>
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-gray-900" />
          </div>

          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            {/* Gradient blobs - animated */}
            <motion.div 
              className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
              animate={{ 
                scale: [1, 1.08, 1],
                rotate: [0, -5, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Floating particles */}
            <FloatingParticles />
            
            {/* Decorative rings */}
            <div className="absolute top-20 right-20 w-32 h-32 border border-orange-400/20 rounded-full" />
            <div className="absolute top-24 right-24 w-24 h-24 border border-orange-500/10 rounded-full" />
            <div className="absolute bottom-32 left-20 w-20 h-20 border border-amber-400/20 rounded-full" />
          </div>

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-400/30 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
                >
                  <Plane className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-orange-300">Luchtfoto & Videografie</span>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Til je content naar een{' '}
                  <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">hoger niveau</span>
                </h1>

                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Professionele luchtfoto's en video's van jouw bedrijf. 
                  Maak indruk op je klanten met spectaculaire beelden vanuit de lucht.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5"
                  >
                    Vraag luchtopnames aan
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#portfolio"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Bekijk voorbeelden
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-white/50 rounded-full" />
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-gradient-to-b from-white via-orange-50/20 to-white dark:from-gray-900 dark:via-orange-900/10 dark:to-gray-900 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-100/40 to-amber-100/20 dark:from-orange-900/30 dark:to-amber-900/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tl from-amber-100/30 to-orange-100/20 dark:from-amber-900/20 dark:to-orange-900/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-orange-600 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Waarom luchtopnames
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Een uniek{' '}
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  perspectief
                </span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto"
              >
                Luchtfoto's en video's geven een uniek perspectief dat je met geen andere techniek 
                kunt bereiken. Laat je bedrijf zien zoals nooit tevoren.
              </motion.p>
            </div>

            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-xl hover:border-orange-200 dark:hover:border-orange-700 hover:-translate-y-1 transition-all min-w-[280px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink"
                >
                  {/* Icon + Title row */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Certification Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-orange-400/30 text-orange-300 rounded-full text-sm font-medium mb-4"
              >
                <Shield className="w-4 h-4" />
                100% Gecertificeerd
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-white mb-4"
              >
                Alle piloten{' '}
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  EU-gecertificeerd
                </span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 text-lg max-w-2xl mx-auto"
              >
                Wij werken uitsluitend met professionele operators die voldoen aan alle 
                Europese regelgeving voor veilige en legale vluchten.
              </motion.p>
            </div>

            <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {[
                {
                  icon: Award,
                  title: 'A1/A2 Dronebewijs',
                  description: 'EU-erkend certificaat voor vliegen in bewoonde gebieden en nabij mensen. Inclusief theoretisch en praktisch examen.',
                  badge: 'EASA Certified'
                },
                {
                  icon: FileCheck,
                  title: 'A3 Open Categorie',
                  description: 'Certificering voor grotere projecten en vluchten in onbewoond gebied. Maximale flexibiliteit voor elk type opdracht.',
                  badge: 'RDW Registered'
                },
                {
                  icon: BadgeCheck,
                  title: 'Verzekerd & Geregistreerd',
                  description: 'Volledige aansprakelijkheidsverzekering en RDW-registratie. Alle vluchten zijn volledig gedekt en legaal.',
                  badge: 'Fully Insured'
                }
              ].map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all min-w-[280px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink"
                >
                  <div className="absolute -top-3 right-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold rounded-full shadow-lg">
                      {cert.badge}
                    </span>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-2xl flex items-center justify-center mb-5">
                    <cert.icon className="w-7 h-7 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{cert.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{cert.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 p-6 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-400/20 rounded-2xl text-center"
            >
              <p className="text-gray-300 text-lg">
                <span className="text-white font-semibold">Belangrijke garantie:</span>{' '}
                Al onze operators zijn getraind volgens de nieuwste EASA-richtlijnen en 
                houden zich strikt aan de Nederlandse regelgeving voor onbemande luchtvaartuigen.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Use cases */}
        <section className="py-20 bg-gradient-to-b from-white via-orange-50/30 to-white dark:from-gray-900 dark:via-orange-900/10 dark:to-gray-900 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-100/30 via-amber-100/20 to-transparent dark:from-orange-900/20 dark:via-amber-900/10 dark:to-transparent rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-orange-600 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Toepassingen
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Perfect voor{' '}
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  elk bedrijf
                </span>
              </motion.h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide sm:flex-wrap sm:justify-center">
              {useCases.map((useCase, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex-shrink-0 snap-start px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 text-sm font-medium shadow-sm hover:border-orange-300 dark:hover:border-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 dark:hover:from-orange-900/20 dark:hover:to-amber-900/20 hover:shadow-md transition-all cursor-default"
                >
                  {useCase}
                </motion.span>
              ))}
            </div>
          </div>
        </section>

        {/* Video Portfolio */}
        <section id="portfolio" className="py-24 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
            {/* Subtle grid */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-orange-400/30 text-orange-300 rounded-full text-sm font-medium mb-4"
              >
                <Play className="w-4 h-4" />
                Ons werk
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-white mb-4"
              >
                Bekijk onze{' '}
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  luchtopnames
                </span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 text-lg max-w-2xl mx-auto"
              >
                Een greep uit onze recente projecten. Dit soort beelden kunnen wij ook voor jouw bedrijf maken.
              </motion.p>
            </div>

            <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {portfolioVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-orange-500/20 hover:ring-orange-500/40 transition-all hover:-translate-y-1 min-w-[280px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink"
                >
                  {/* Video iframe - background mode, autoplay, muted, loop */}
                  <iframe
                    src={`https://player.vimeo.com/video/${video.id}?background=1&autoplay=1&loop=1&muted=1&quality=1080p`}
                    className="absolute inset-0 w-full h-full scale-105"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    title={video.title}
                  />
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Title on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-medium">{video.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                to="/start?dienst=drone"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5"
              >
                Start je luchtfoto project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* What's included */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-white via-orange-50/20 to-white dark:from-gray-900 dark:via-orange-900/10 dark:to-gray-900 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-100/40 to-amber-100/20 dark:from-orange-900/30 dark:to-amber-900/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-amber-100/30 to-orange-100/20 dark:from-amber-900/20 dark:to-orange-900/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-6 md:mb-12">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-orange-600 font-semibold text-xs md:text-sm tracking-wider uppercase mb-2 md:mb-3"
              >
                Wat je krijgt
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4"
              >
                Complete luchtopnames{' '}
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">€349</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-300 text-sm md:text-lg max-w-2xl mx-auto mb-3"
              >
                Eenmalige investering inclusief voorbereiding, shoot en nabewerking.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-xl sm:rounded-full px-3 py-2 sm:px-4"
              >
                <span className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-medium">💼 Zakelijke investering</span>
                <span className="hidden sm:inline text-emerald-600 dark:text-emerald-400 text-sm">•</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">BTW aftrekbaar</span>
              </motion.div>
            </div>

            {/* Features - Mobile: horizontal scroll */}
            <div className="md:hidden">
              <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                {included.map((item, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex-shrink-0 flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm snap-start"
                  >
                    <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-xs whitespace-nowrap">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Desktop: Grid */}
            <div className="hidden md:grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {included.map((item, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
                >
                  <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-6 md:mt-0"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 text-sm md:text-base"
              >
                Plan je luchtopnames
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-3 md:mt-4">
                Combineer met een website voor korting
              </p>
            </motion.div>
          </div>
        </section>

        {/* Trustpilot Reviews */}
        <TrustpilotReviews className="bg-gray-50 dark:bg-gray-800" />
      </main>

      <Footer ctaVariant="drone" />
    </div>
  )
}
