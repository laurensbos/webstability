import { motion } from 'framer-motion'
import { 
  Zap, 
  Shield, 
  Palette, 
  Headphones, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  MessageSquare,
  Rocket,
  HeartHandshake,
  Users,
  Monitor,
  Smartphone,
  Sparkles,
  Check
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TrustpilotReviews from '../components/TrustpilotReviews'
import WhatYouGet from '../components/WhatYouGet'

// Floating particles component with blue accents
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
          className="absolute rounded-full bg-gradient-to-br from-primary-400 to-blue-500"
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

const stats = [
  { value: '250+', label: 'Websites gebouwd' },
  { value: '4.9', label: 'Gemiddelde beoordeling', icon: Star },
  { value: '48u', label: 'Gemiddelde reactietijd' },
  { value: '98%', label: 'Klanttevredenheid' },
]

const features = [
  {
    icon: Zap,
    title: 'Razendsnel',
    description: 'Websites die binnen 2 seconden laden. Goed voor bezoekers én Google.'
  },
  {
    icon: Shield,
    title: 'Veilig & betrouwbaar',
    description: 'SSL-certificaat, dagelijkse backups en 99.9% uptime gegarandeerd.'
  },
  {
    icon: Smartphone,
    title: 'Mobiel-vriendelijk',
    description: 'Perfect responsive op alle apparaten: telefoon, tablet en desktop.'
  },
  {
    icon: TrendingUp,
    title: 'SEO geoptimaliseerd',
    description: 'Technische SEO-basis zodat je gevonden wordt in Google.'
  },
  {
    icon: Palette,
    title: 'Op maat ontworpen',
    description: 'Uniek design dat past bij jouw huisstijl en merkidentiteit.'
  },
  {
    icon: Headphones,
    title: 'Persoonlijke support',
    description: 'Directe lijn met je developer. Geen callcenters of wachttijden.'
  },
]

const packages = [
  {
    id: 'starter',
    name: 'Starter',
    price: 99,
    priceExcl: 82,
    setupFee: 99,
    setupFeeExcl: 82,
    tagline: 'Perfect om te beginnen',
    description: 'Ideaal voor starters en kleine ondernemers',
    features: [
      'Tot 5 pagina\'s',
      'Responsive design',
      'Contactformulier',
      'Basis SEO',
      'SSL-certificaat',
      '48u support reactietijd',
    ],
    icon: Rocket,
  },
  {
    id: 'professional',
    name: 'Professioneel',
    price: 149,
    priceExcl: 123,
    setupFee: 179,
    setupFeeExcl: 148,
    tagline: 'Meest gekozen',
    description: 'Voor groeiende bedrijven',
    features: [
      'Tot 10 pagina\'s',
      'Premium design',
      'Blog functionaliteit',
      'Google Analytics',
      'Uitgebreide SEO',
      '24u support reactietijd',
    ],
    icon: Users,
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 199,
    priceExcl: 165,
    setupFee: 239,
    setupFeeExcl: 198,
    tagline: 'Alles wat je nodig hebt',
    description: 'Complete oplossing voor gevestigde bedrijven',
    features: [
      'Onbeperkt pagina\'s',
      'Custom functionaliteiten',
      'Meertalig mogelijk',
      'Geavanceerde integraties',
      'Prioriteit support',
      'Maandelijkse rapportage',
    ],
    icon: HeartHandshake,
  },
]

const included = [
  'Custom design',
  'Responsive layout',
  'Contactformulier',
  'SEO-basis',
  'SSL-certificaat',
  'Dagelijkse backups',
  'Maandelijkse updates',
  'Persoonlijke support',
]

const howItWorks = [
  {
    step: 1,
    icon: MessageSquare,
    title: 'Intake gesprek',
    description: 'We bespreken jouw wensen, doelgroep en huisstijl.',
  },
  {
    step: 2,
    icon: Palette,
    title: 'Ontwerp',
    description: 'Je ontvangt een design voorstel ter goedkeuring.',
  },
  {
    step: 3,
    icon: Monitor,
    title: 'Ontwikkeling',
    description: 'We bouwen je website met de nieuwste technologieën.',
  },
  {
    step: 4,
    icon: Rocket,
    title: 'Live!',
    description: 'Na goedkeuring gaat je website live.',
  },
]

export default function Websites() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-primary-50/30 to-white dark:from-gray-900 dark:via-primary-900/10 dark:to-gray-900 pt-20">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-br from-primary-200/60 via-blue-100/40 to-sky-100/30 dark:from-primary-800/30 dark:via-blue-900/20 dark:to-sky-900/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-blue-100/50 via-primary-100/40 to-transparent dark:from-blue-900/30 dark:via-primary-900/20 dark:to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
              animate={{ scale: [1, 1.08, 1], rotate: [0, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-sky-100/30 via-primary-100/20 to-blue-100/30 dark:from-sky-900/20 dark:via-primary-900/10 dark:to-blue-900/20 rounded-full blur-3xl" />
            
            <FloatingParticles />
            
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#dbeafe33_1px,transparent_1px),linear-gradient(to_bottom,#dbeafe33_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e3a8a33_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a33_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            
            <div className="absolute top-20 right-20 w-32 h-32 border border-primary-200/30 dark:border-primary-700/30 rounded-full" />
            <div className="absolute top-24 right-24 w-24 h-24 border border-primary-300/20 dark:border-primary-600/20 rounded-full" />
            <div className="absolute bottom-32 left-20 w-20 h-20 border border-blue-200/40 dark:border-blue-700/40 rounded-full" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 border border-primary-200/50 dark:border-primary-700/50 rounded-full px-4 py-2 mb-6"
                >
                  <Monitor className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Website laten maken</span>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  Een professionele{' '}
                  <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">website</span>
                  <br />zonder zorgen
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  Wij ontwerpen en bouwen jouw website. Jij focust op ondernemen, 
                  wij zorgen voor de techniek, updates en onderhoud.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/start?dienst=website"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
                  >
                    Start je project
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#pakketten"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg"
                  >
                    Bekijk pakketten
                  </a>
                </div>

                {/* Payment after design approval badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-2 mt-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium"
                >
                  <Check className="w-4 h-4" />
                  Betaling pas na goedkeuring design
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Website Showcase */}
        <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-50/50 via-blue-50/30 to-sky-50/50 dark:from-primary-900/20 dark:via-blue-900/10 dark:to-sky-900/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-primary-600 dark:text-primary-400 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Wat je krijgt
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Websites die{' '}
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                  resultaat leveren
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto"
              >
                Modern design, razendsnel en geoptimaliseerd voor conversie.
              </motion.p>
            </div>

            {/* Mobile swipe hint */}
            <div className="md:hidden flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-3">
              <span>← Swipe om te bekijken →</span>
            </div>

            {/* Mockup grid - Mobile: horizontal scroll, Desktop: grid */}
            <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 mb-12 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {/* Desktop mockup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 h-[220px] md:aspect-[4/3] md:h-auto flex items-center justify-center overflow-hidden border border-gray-200/50 dark:border-gray-700/50 min-w-[280px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-blue-500/5 dark:from-primary-500/10 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full max-w-[200px]">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <div className="h-5 bg-gray-100 dark:bg-gray-600 flex items-center gap-1.5 px-2">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-800">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-blue-600 rounded flex items-center justify-center">
                          <span className="text-white font-bold text-xs">W</span>
                        </div>
                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded" />
                      </div>
                      <div className="h-12 bg-gradient-to-r from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 rounded mb-2" />
                      <div className="grid grid-cols-3 gap-1">
                        <div className="h-6 bg-gray-50 dark:bg-gray-700 rounded" />
                        <div className="h-6 bg-gray-50 dark:bg-gray-700 rounded" />
                        <div className="h-6 bg-gray-50 dark:bg-gray-700 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="absolute bottom-4 left-4 text-sm font-medium text-gray-500 dark:text-gray-400">Desktop</p>
              </motion.div>

              {/* Tablet mockup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 h-[220px] md:aspect-[4/3] md:h-auto flex items-center justify-center overflow-hidden border border-gray-200/50 dark:border-gray-700/50 min-w-[280px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-blue-500/5 dark:from-primary-500/10 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-32 h-44 bg-gray-800 dark:bg-gray-700 rounded-xl p-1.5 shadow-xl">
                    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                      <div className="h-4 bg-gradient-to-r from-primary-500 to-blue-500" />
                      <div className="p-2">
                        <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded mb-2" />
                        <div className="space-y-1">
                          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-full" />
                          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="absolute bottom-4 left-4 text-sm font-medium text-gray-500 dark:text-gray-400">Tablet</p>
              </motion.div>

              {/* Mobile mockup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 h-[220px] md:aspect-[4/3] md:h-auto flex items-center justify-center overflow-hidden border border-gray-200/50 dark:border-gray-700/50 min-w-[280px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-blue-500/5 dark:from-primary-500/10 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-20 h-40 bg-gray-800 dark:bg-gray-700 rounded-2xl p-1 shadow-xl">
                    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                      <div className="h-3 bg-gradient-to-r from-primary-500 to-blue-500" />
                      <div className="p-1.5">
                        <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded mb-1.5" />
                        <div className="space-y-1">
                          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded" />
                          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded w-2/3" />
                        </div>
                        <div className="mt-2 h-4 bg-primary-500 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="absolute bottom-4 left-4 text-sm font-medium text-gray-500 dark:text-gray-400">Mobiel</p>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl border border-primary-100 dark:border-primary-800/50">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                    {stat.icon && <stat.icon className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-gradient-to-b from-gray-50 via-primary-50/20 to-gray-50 dark:from-gray-900 dark:via-primary-900/10 dark:to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary-100/40 to-blue-100/20 dark:from-primary-900/30 dark:to-blue-900/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-blue-100/30 to-primary-100/20 dark:from-blue-900/20 dark:to-primary-900/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-primary-600 dark:text-primary-400 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Het proces
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Zo werkt het
              </motion.h2>
            </div>

            {/* Mobile swipe hint */}
            <div className="md:hidden flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-3">
              <span>← Swipe om stappen te bekijken →</span>
            </div>

            {/* Mobile: horizontal scroll, Desktop: grid */}
            <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative text-center min-w-[200px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink bg-white dark:bg-gray-800 md:bg-transparent md:dark:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 border border-gray-100 dark:border-gray-700 md:border-0"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute top-7 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-200 to-blue-200 dark:from-primary-800 dark:to-blue-800 -z-10 hidden md:block last:hidden" style={{ display: index === howItWorks.length - 1 ? 'none' : undefined }} />
                  <span className="inline-block md:hidden text-xs font-semibold text-primary-500 mb-1">Stap {index + 1}</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get */}
        <WhatYouGet variant="website" />

        {/* Packages */}
        <section id="pakketten" className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-primary-600 dark:text-primary-400 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Pakketten
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Kies jouw{' '}
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">website pakket</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto"
              >
                Alle pakketten zijn maandelijks opzegbaar na 3 maanden. Inclusief hosting en onderhoud.
              </motion.p>
            </div>

            {/* Mobile: swipe to compare */}
            <div className="sm:hidden">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-3">
                <span>Swipe om te vergelijken</span>
                <ArrowRight className="w-3 h-3" />
              </div>

              <div className="flex gap-4 overflow-x-auto overflow-y-visible pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {packages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex-shrink-0 w-[300px] snap-center relative p-6 bg-white dark:bg-gray-800 rounded-2xl border ${
                      pkg.popular ? 'border-primary-300 dark:border-primary-600 shadow-xl shadow-primary-500/10' : 'border-gray-200 dark:border-gray-700'
                    } hover:shadow-xl hover:-translate-y-1 transition-all`}
                  >
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
                        <pkg.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{pkg.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{pkg.tagline}</p>
                    </div>

                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">€{pkg.price}</span>
                        <span className="text-gray-500 dark:text-gray-400">/maand</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+ €{pkg.setupFee} eenmalige opstartkosten</p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to={`/start?dienst=website&pakket=${pkg.id}`} className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${
                      pkg.popular ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}>Kies {pkg.name}</Link>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center gap-2 mt-3">
                {packages.map((_, idx) => (
                  <div key={idx} className={`h-2 rounded-full transition-all ${idx === 0 ? 'bg-primary-500 w-6' : 'bg-gray-300 dark:bg-gray-600 w-2'}`} />
                ))}
              </div>
            </div>

            {/* Desktop grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-6 bg-white dark:bg-gray-800 rounded-2xl border ${
                    pkg.popular 
                      ? 'border-primary-300 dark:border-primary-600 shadow-xl shadow-primary-500/10' 
                      : 'border-gray-200 dark:border-gray-700'
                  } hover:shadow-xl hover:-translate-y-1 transition-all`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-primary-500 to-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Meest gekozen
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
                      <pkg.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{pkg.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{pkg.tagline}</p>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">€{pkg.price}</span>
                      <span className="text-gray-500 dark:text-gray-400">/maand</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      + €{pkg.setupFee} eenmalige opstartkosten
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/start?dienst=website&pakket=${pkg.id}`}
                    className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/25'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                    }`}
                  >
                    Kies {pkg.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-primary-600 dark:text-primary-400 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Inbegrepen
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Standaard bij{' '}
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">elk pakket</span>
              </motion.h2>
            </div>

            {/* Mobile: horizontal scroll, Desktop: grid */}
            <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {included.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm min-w-[180px] sm:min-w-0 snap-center flex-shrink-0 sm:flex-shrink"
                >
                  <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm whitespace-nowrap sm:whitespace-normal">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link
                to="/start?dienst=website"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
              >
                Start je project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
                Binnen 2 weken live • Persoonlijke begeleiding
              </p>
            </motion.div>
          </div>
        </section>

        {/* Trustpilot Reviews */}
        <TrustpilotReviews />

        {/* Features */}
        <section id="features" className="py-20 bg-gradient-to-b from-white via-primary-50/20 to-white dark:from-gray-900 dark:via-primary-900/10 dark:to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-100/40 to-blue-100/20 dark:from-primary-900/30 dark:to-blue-900/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tl from-blue-100/30 to-primary-100/20 dark:from-blue-900/20 dark:to-primary-900/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-primary-600 dark:text-primary-400 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Voordelen
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Waarom kiezen voor{' '}
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                  onze websites
                </span>
                ?
              </motion.h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-700 hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform flex-shrink-0">
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

        {/* Final CTA */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 border border-primary-200 dark:border-primary-700 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Klaar om te starten?</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Laten we samen jouw{' '}
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                  website bouwen
                </span>
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Binnen 2 weken heb je een professionele website. 
                Wij begeleiden je bij elke stap.
              </p>

              <Link
                to="/start?dienst=website"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
              >
                Start je project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer ctaVariant="none" />
    </div>
  )
}
