import { motion } from 'framer-motion'
import { 
  Zap, 
  Shield, 
  Smartphone, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Rocket,
  HeartHandshake,
  Users,
  Monitor,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TrustpilotReviews from '../components/TrustpilotReviews'
import WhatYouGet from '../components/WhatYouGet'
import { usePackages } from '../hooks/usePackages'

// Floating particles component - ONLY on desktop for performance
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
    </div>
  )
}

export default function Websites() {
  const { t } = useTranslation()
  const { packages: websitePackages } = usePackages()

  // Use packages from central data with icons
  const packagesWithIcons = websitePackages.map((pkg, index) => ({
    ...pkg,
    icon: index === 0 ? Rocket : index === 1 ? Users : HeartHandshake,
  }))
  
  const stats = [
    { value: '250+', label: t('websitesPage.stats.websites') },
    { value: '4.9', label: t('websitesPage.stats.rating'), icon: Star },
    { value: '7', label: t('websitesPage.stats.daysLive') },
  ]

  const features = [
    {
      icon: Zap,
      title: t('websitesPage.features.fast.title'),
      description: t('websitesPage.features.fast.description')
    },
    {
      icon: Shield,
      title: t('websitesPage.features.secure.title'),
      description: t('websitesPage.features.secure.description')
    },
    {
      icon: Smartphone,
      title: t('websitesPage.features.mobile.title'),
      description: t('websitesPage.features.mobile.description')
    },
    {
      icon: TrendingUp,
      title: t('websitesPage.features.seo.title'),
      description: t('websitesPage.features.seo.description')
    },
  ]

  const included = [
    t('websitesPage.included.items.customDesign'),
    t('websitesPage.included.items.responsiveLayout'),
    t('websitesPage.included.items.contactForm'),
    t('websitesPage.included.items.seoBasics'),
    t('websitesPage.included.items.ssl'),
    t('websitesPage.included.items.backups'),
    t('websitesPage.included.items.updates'),
    t('websitesPage.included.items.support'),
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <main>
        {/* Hero - Mobile optimized */}
        <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-primary-50/30 to-white dark:from-gray-900 dark:via-primary-900/10 dark:to-gray-900 pt-20">
          {/* Background - simplified on mobile */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[400px] lg:w-[900px] h-[400px] lg:h-[900px] bg-gradient-to-br from-primary-200/60 via-blue-100/40 to-sky-100/30 dark:from-primary-800/30 dark:via-blue-900/20 dark:to-sky-900/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
            <FloatingParticles />
            {/* Decorative rings - desktop only */}
            <div className="hidden lg:block absolute top-20 right-20 w-32 h-32 border border-primary-200/30 dark:border-primary-700/30 rounded-full" />
            <div className="hidden lg:block absolute top-24 right-24 w-24 h-24 border border-primary-300/20 dark:border-primary-600/20 rounded-full" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 border border-primary-200/50 dark:border-primary-700/50 rounded-full px-3 py-1.5 mb-4 lg:mb-6"
                >
                  <Monitor className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-xs lg:text-sm font-medium text-primary-700 dark:text-primary-300">{t('websitesPage.badge')}</span>
                </motion.div>

                <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-6 leading-tight">
                  {t('websitesPage.heroTitle')}{' '}
                  <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">{t('websitesPage.heroTitleHighlight')}</span>
                  {' '}{t('websitesPage.heroTitleEnd')}
                </h1>

                <p className="text-sm sm:text-base lg:text-xl text-gray-600 dark:text-gray-300 mb-5 lg:mb-8 max-w-xl mx-auto">
                  {t('websitesPage.heroSubtitle')}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/start?dienst=website"
                    className="group inline-flex items-center justify-center gap-2 px-5 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25"
                  >
                    {t('websitesPage.startProject')}
                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#pakketten"
                    className="inline-flex items-center justify-center px-5 py-3 lg:px-8 lg:py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 transition-all"
                  >
                    {t('websitesPage.viewPackages')}
                  </a>
                </div>

                {/* Quick stats on mobile */}
                <div className="flex justify-center gap-4 mt-6 lg:hidden">
                  {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</span>
                        {stat.icon && <stat.icon className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                      </div>
                      <span className="text-xs text-gray-500">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* USP Bar - Mobile optimized, replaces showcase + stats */}
        <section className="py-8 lg:py-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 p-3 lg:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
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
                {t('websitesPage.packages.title')}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                {t('websitesPage.packages.heading')}{' '}
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">{t('websitesPage.packages.headingHighlight')}</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto"
              >
                {t('websitesPage.packages.subtitle')}
              </motion.p>
            </div>

            {/* Mobile: swipe to compare */}
            <div className="sm:hidden">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-3">
                <span>{t('websitesPage.packages.swipeHint')}</span>
                <ArrowRight className="w-3 h-3" />
              </div>

              <div className="flex gap-4 overflow-x-auto overflow-y-visible pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {packagesWithIcons.map((pkg, index) => (
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
                        <span className="text-gray-500 dark:text-gray-400">{t('websitesPage.packages.perMonth')}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+ €{pkg.setupFee} {t('websitesPage.packages.setupFee')}</p>
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
                    }`}>{t('websitesPage.packages.choose')} {pkg.name}</Link>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center gap-2 mt-3">
                {packagesWithIcons.map((_, idx) => (
                  <div key={idx} className={`h-2 rounded-full transition-all ${idx === 0 ? 'bg-primary-500 w-6' : 'bg-gray-300 dark:bg-gray-600 w-2'}`} />
                ))}
              </div>
            </div>

            {/* Desktop grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-8">
              {packagesWithIcons.map((pkg, index) => (
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
                        {t('websitesPage.packages.mostChosen')}
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
                      <span className="text-gray-500 dark:text-gray-400">{t('websitesPage.packages.perMonth')}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      + €{pkg.setupFee} {t('websitesPage.packages.setupFee')}
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
                    {t('websitesPage.packages.choose')} {pkg.name}
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
                {t('websitesPage.included.title')}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                {t('websitesPage.included.heading')}{' '}
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">{t('websitesPage.included.headingHighlight')}</span>
              </motion.h2>
            </div>

            {/* Mobile: 2x2 grid, Desktop: 4 columns grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              {included.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
                >
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-tight">{item}</span>
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
                {t('websitesPage.startProject')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
                {t('websitesPage.cta.liveIn2Weeks')}
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
                {t('websitesPage.benefits.title')}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                {t('websitesPage.benefits.heading')}{' '}
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                  {t('websitesPage.benefits.headingHighlight')}
                </span>
                {t('websitesPage.benefits.headingEnd')}
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
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">{t('websitesPage.finalCta.badge')}</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('websitesPage.finalCta.heading')}{' '}
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                  {t('websitesPage.finalCta.headingHighlight')}
                </span>
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                {t('websitesPage.finalCta.subtitle')}
              </p>

              <Link
                to="/start?dienst=website"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
              >
                {t('websitesPage.startProject')}
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
