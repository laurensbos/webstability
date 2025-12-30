import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  Palette, 
  Layers, 
  FileImage,
  CheckCircle,
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TrustpilotReviews from '../components/TrustpilotReviews'

// Floating particles - ONLY on desktop for performance
function FloatingParticles() {
  const particles = [
    { size: 4, x: '10%', y: '20%', delay: 0, duration: 4 },
    { size: 6, x: '20%', y: '60%', delay: 1, duration: 5 },
    { size: 3, x: '80%', y: '30%', delay: 0.5, duration: 4.5 },
    { size: 5, x: '70%', y: '70%', delay: 1.5, duration: 5.5 },
  ]

  return (
    <div className="hidden lg:block">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-purple-400 to-violet-500"
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
    </div>
  )
}

export default function LogoMaken() {
  const { t } = useTranslation()
  
  const features = [
    { icon: Palette, title: t('logoPage.features.0.title'), description: t('logoPage.features.0.description') },
    { icon: Layers, title: t('logoPage.features.1.title'), description: t('logoPage.features.1.description') },
    { icon: RefreshCw, title: t('logoPage.features.2.title'), description: t('logoPage.features.2.description') },
    { icon: FileImage, title: t('logoPage.features.3.title'), description: t('logoPage.features.3.description') },
  ]

  const included = t('logoPage.included.items', { returnObjects: true }) as string[]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <main>
        {/* Hero - Mobile optimized */}
        <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-white dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900 pt-20">
          {/* Background - simplified on mobile */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[400px] lg:w-[900px] h-[400px] lg:h-[900px] bg-gradient-to-br from-purple-200/60 via-violet-100/40 to-pink-100/30 dark:from-purple-800/30 dark:via-violet-900/20 dark:to-pink-900/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
            <FloatingParticles />
            {/* Decorative rings - desktop only */}
            <div className="hidden lg:block absolute top-20 right-20 w-32 h-32 border border-purple-200/30 dark:border-purple-700/30 rounded-full" />
            <div className="hidden lg:block absolute top-24 right-24 w-24 h-24 border border-purple-300/20 dark:border-purple-600/20 rounded-full" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border border-purple-200/50 dark:border-purple-700/50 rounded-full px-3 py-1.5 mb-4 lg:mb-6"
                >
                  <Palette className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs lg:text-sm font-medium text-purple-700 dark:text-purple-300">{t('logoPage.hero.badge')}</span>
                </motion.div>

                <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-6 leading-tight">
                  {t('logoPage.hero.title')}{' '}
                  <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">{t('logoPage.hero.titleHighlight')}</span>
                  {' '}{t('logoPage.hero.titleEnd')}
                </h1>

                <p className="text-sm sm:text-base lg:text-xl text-gray-600 dark:text-gray-300 mb-5 lg:mb-8 max-w-xl mx-auto">
                  {t('logoPage.hero.subtitle')}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/start?dienst=logo"
                    className="group inline-flex items-center justify-center gap-2 px-5 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25"
                  >
                    {t('logoPage.hero.cta')}
                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center px-5 py-3 lg:px-8 lg:py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 transition-all"
                  >
                    {t('logoPage.hero.whatYouGet')}
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* USP Bar - Mobile optimized */}
        <section className="py-8 lg:py-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 p-3 lg:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 hidden lg:block">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logo Showcase - Mockups */}
        <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-50/50 via-violet-50/30 to-pink-50/50 dark:from-purple-900/20 dark:via-violet-900/10 dark:to-pink-900/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-purple-600 dark:text-purple-400 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Mogelijkheden
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Jouw logo op{' '}
                <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                  elk platform
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto"
              >
                Je ontvangt alle varianten die je nodig hebt: van visitekaartjes tot billboards.
              </motion.p>
            </div>

            {/* Logo mockup grid - Mobile: horizontal scroll, Desktop: grid */}
            <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 mb-12 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {/* Business card mockup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800/50 dark:to-gray-900 rounded-2xl p-8 h-[220px] md:aspect-[4/3] md:h-auto flex items-center justify-center overflow-hidden border border-transparent dark:border-gray-700/50 min-w-[280px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 dark:from-purple-500/10 dark:to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  {/* Business card */}
                  <motion.div 
                    className="w-56 h-32 bg-white dark:bg-gray-800 rounded-lg shadow-xl flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">W</span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 font-semibold text-sm">Jouw Bedrijf</p>
                      <p className="text-gray-400 text-xs">www.jouwsite.nl</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="absolute -bottom-2 -right-2 w-56 h-32 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg shadow-lg -z-10"
                    style={{ transform: 'rotate(-3deg)' }}
                  />
                </div>
                <p className="absolute bottom-4 left-4 text-sm font-medium text-gray-500 dark:text-gray-400">Visitekaartje</p>
              </motion.div>

              {/* Website mockup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800/50 dark:to-gray-900 rounded-2xl p-8 h-[220px] md:aspect-[4/3] md:h-auto flex items-center justify-center overflow-hidden border border-transparent dark:border-gray-700/50 min-w-[280px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 dark:from-purple-500/10 dark:to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full max-w-[240px]">
                  {/* Browser window */}
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                    <div className="h-6 bg-gray-100 dark:bg-gray-600 flex items-center gap-1.5 px-3">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">W</span>
                        </div>
                        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded" />
                        <div className="flex gap-2">
                          <div className="w-8 h-2 bg-gray-100 dark:bg-gray-700 rounded" />
                          <div className="w-8 h-2 bg-gray-100 dark:bg-gray-700 rounded" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-16 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded" />
                        <div className="grid grid-cols-3 gap-2">
                          <div className="h-8 bg-gray-50 dark:bg-gray-700 rounded" />
                          <div className="h-8 bg-gray-50 dark:bg-gray-700 rounded" />
                          <div className="h-8 bg-gray-50 dark:bg-gray-700 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="absolute bottom-4 left-4 text-sm font-medium text-gray-500 dark:text-gray-400">Website</p>
              </motion.div>

              {/* Social media mockup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800/50 dark:to-gray-900 rounded-2xl p-8 h-[220px] md:aspect-[4/3] md:h-auto flex items-center justify-center overflow-hidden border border-transparent dark:border-gray-700/50 min-w-[280px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 dark:from-purple-500/10 dark:to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex gap-3">
                  {/* Instagram style */}
                  <motion.div 
                    className="w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">W</span>
                    </div>
                  </motion.div>
                  {/* Circular avatar */}
                  <motion.div 
                    className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">W</span>
                    </div>
                  </motion.div>
                </div>
                <p className="absolute bottom-4 left-4 text-sm font-medium text-gray-500 dark:text-gray-400">Social Media</p>
              </motion.div>
            </div>

            {/* File formats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-3"
            >
              {['PNG', 'SVG', 'PDF', 'JPG', 'AI', 'EPS'].map((format) => (
                <span 
                  key={format}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  .{format.toLowerCase()}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* What's included - simplified */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 via-purple-50/20 to-gray-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-100/40 to-violet-100/20 dark:from-purple-900/30 dark:to-violet-900/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-violet-100/30 to-purple-100/20 dark:from-violet-900/20 dark:to-purple-900/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-6 md:mb-12">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-purple-600 dark:text-purple-400 font-semibold text-xs md:text-sm tracking-wider uppercase mb-2 md:mb-3"
              >
                {t('logoPage.included.title')}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4"
              >
                {t('logoPage.price.title')}{' '}
                <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">€169</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-300 text-sm md:text-lg max-w-2xl mx-auto mb-3"
              >
                {t('logoPage.price.subtitle')}
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

            {/* Features grid - Mobile: horizontal scroll */}
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
                    <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
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
                  <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
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
                to="/start?dienst=logo"
                className="group inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 text-sm md:text-base"
              >
                {t('logoPage.price.cta')}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-3 md:mt-4">
                {t('logoPage.price.combineDiscount')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Trustpilot Reviews */}
        <TrustpilotReviews />

        {/* Features */}
        <section id="features" className="py-20 bg-gradient-to-b from-white via-purple-50/20 to-white dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-100/40 to-violet-100/20 dark:from-purple-900/30 dark:to-violet-900/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tl from-violet-100/30 to-purple-100/20 dark:from-violet-900/20 dark:to-purple-900/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-purple-600 dark:text-purple-400 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Ons proces
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Wat maakt een{' '}
                <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                  goed logo
                </span>
                ?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto"
              >
                Een sterk logo is herkenbaar, tijdloos en vertelt het verhaal van jouw merk
                in één oogopslag.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-700 hover:-translate-y-1 transition-all"
                >
                  {/* Icon + Title row */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform flex-shrink-0">
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
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border border-purple-200 dark:border-purple-700 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">{t('logoPage.cta.title')}</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('logoPage.cta.subtitle')}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                {t('logoPage.price.delivery')}
              </p>

              <Link
                to="/start?dienst=logo"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5"
              >
                {t('logoPage.cta.button')}
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
