import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  CreditCard, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Truck,
  Package,
  Star,
  Zap,
  Users,
  HeartHandshake
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TrustpilotReviews from '../components/TrustpilotReviews'
import WhatYouGet from '../components/WhatYouGet'
import { webshopPackages } from '../data/packages'

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
          className="absolute rounded-full bg-gradient-to-br from-emerald-400 to-green-500"
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

// Use packages from central data with icons
const packagesWithIcons = webshopPackages.map((pkg, index) => ({
  ...pkg,
  icon: index === 0 ? Package : index === 1 ? Users : HeartHandshake,
}))

export default function Webshop() {
  const { t } = useTranslation()

  const stats = [
    { value: '50+', label: t('webshopPage.stats.webshops') },
    { value: '4.9', label: t('webshopPage.stats.rating'), icon: Star },
    { value: '14', label: t('webshopPage.stats.daysLive') },
  ]

  const features = [
    {
      icon: ShoppingCart,
      title: t('webshopPage.features.products.title'),
      description: t('webshopPage.features.products.description')
    },
    {
      icon: CreditCard,
      title: t('webshopPage.features.payments.title'),
      description: t('webshopPage.features.payments.description')
    },
    {
      icon: Truck,
      title: t('webshopPage.features.shipping.title'),
      description: t('webshopPage.features.shipping.description')
    },
    {
      icon: Shield,
      title: t('webshopPage.features.security.title'),
      description: t('webshopPage.features.security.description')
    },
  ]

  const included = [
    t('webshopPage.included.items.customDesign'),
    t('webshopPage.included.items.productManagement'),
    t('webshopPage.included.items.inventory'),
    t('webshopPage.included.items.payments'),
    t('webshopPage.included.items.notifications'),
    t('webshopPage.included.items.labels'),
    t('webshopPage.included.items.seo'),
    t('webshopPage.included.items.hosting'),
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <main>
        {/* Hero - Mobile optimized */}
        <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-900 pt-20">
          {/* Background - simplified on mobile */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[400px] lg:w-[900px] h-[400px] lg:h-[900px] bg-gradient-to-br from-emerald-200/60 via-green-100/40 to-teal-100/30 dark:from-emerald-800/30 dark:via-green-900/20 dark:to-teal-900/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
            <FloatingParticles />
            {/* Decorative rings - desktop only */}
            <div className="hidden lg:block absolute top-20 right-20 w-32 h-32 border border-emerald-200/30 dark:border-emerald-700/30 rounded-full" />
            <div className="hidden lg:block absolute top-24 right-24 w-24 h-24 border border-emerald-300/20 dark:border-emerald-600/20 rounded-full" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-200/50 dark:border-emerald-700/50 rounded-full px-3 py-1.5 mb-4 lg:mb-6"
                >
                  <ShoppingCart className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs lg:text-sm font-medium text-emerald-700 dark:text-emerald-300">{t('webshopPage.badge')}</span>
                </motion.div>

                <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-6 leading-tight">
                  {t('webshopPage.heroTitle')}{' '}
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{t('webshopPage.heroTitleHighlight')}</span>
                </h1>

                <p className="text-sm sm:text-base lg:text-xl text-gray-600 dark:text-gray-300 mb-5 lg:mb-8 max-w-xl mx-auto">
                  {t('webshopPage.heroSubtitle')}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/start?dienst=webshop"
                    className="group inline-flex items-center justify-center gap-2 px-5 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25"
                  >
                    {t('webshopPage.startWebshop')}
                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#pakketten"
                    className="inline-flex items-center justify-center px-5 py-3 lg:px-8 lg:py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 transition-all"
                  >
                    {t('webshopPage.viewPackages')}
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

        {/* USP Bar - Mobile optimized */}
        <section className="py-8 lg:py-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 p-3 lg:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
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
        <WhatYouGet variant="webshop" />

        {/* Packages */}
        <section id="pakketten" className="py-12 lg:py-20 bg-gradient-to-b from-gray-50 via-emerald-50/20 to-gray-50 dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-100/40 to-green-100/20 dark:from-emerald-900/30 dark:to-green-900/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-green-100/30 to-emerald-100/20 dark:from-green-900/20 dark:to-emerald-900/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-emerald-600 dark:text-emerald-400 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                {t('webshopPage.packages.title')}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                {t('webshopPage.packages.heading')}{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{t('webshopPage.packages.headingHighlight')}</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto"
              >
                {t('webshopPage.packages.subtitle')}
              </motion.p>
            </div>

            {/* Mobile: swipe to compare */}
            <div className="sm:hidden">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-3">
                <span>{t('webshopPage.packages.swipeHint')}</span>
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
                    className={`relative flex-shrink-0 w-[300px] p-6 bg-white dark:bg-gray-800 rounded-2xl border ${
                      pkg.popular ? 'border-emerald-300 dark:border-emerald-600 shadow-xl shadow-emerald-500/10' : 'border-gray-200 dark:border-gray-700'
                    } hover:shadow-xl hover:-translate-y-1 transition-all snap-center`}
                  >
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                        <pkg.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{pkg.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{pkg.tagline}</p>
                    </div>

                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">€{pkg.price}</span>
                        <span className="text-gray-500 dark:text-gray-400">{t('webshopPage.packages.perMonth')}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+ €{pkg.setupFee} {t('webshopPage.packages.setupFee')}</p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to={`/start?dienst=webshop&pakket=${pkg.id}`} className="block w-full text-center py-3 rounded-xl font-semibold transition-all bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white">
                      {t('webshopPage.packages.choose')} {pkg.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Dot indicators */}
              <div className="flex justify-center gap-2 mt-3">
                {packagesWithIcons.map((_, idx) => (
                  <div key={idx} className={`h-2 rounded-full transition-all ${idx === 0 ? 'bg-emerald-500 w-6' : 'bg-gray-300 dark:bg-gray-600 w-2'}`} />
                ))}
              </div>
            </div>

            {/* Desktop: grid */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-6">
              {packagesWithIcons.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-6 bg-white dark:bg-gray-800 rounded-2xl border ${
                    pkg.popular ? 'border-emerald-300 dark:border-emerald-600 shadow-xl shadow-emerald-500/10' : 'border-gray-200 dark:border-gray-700'
                  } hover:shadow-xl hover:-translate-y-1 transition-all`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {t('webshopPage.packages.mostChosen')}
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                      <pkg.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{pkg.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{pkg.tagline}</p>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">€{pkg.price}</span>
                      <span className="text-gray-500 dark:text-gray-400">{t('webshopPage.packages.perMonth')}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+ €{pkg.setupFee} {t('webshopPage.packages.setupFee')}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/start?dienst=webshop&pakket=${pkg.id}`}
                    className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                    }`}
                  >
                    {t('webshopPage.packages.choose')} {pkg.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-emerald-600 dark:text-emerald-400 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                {t('webshopPage.included.title')}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                {t('webshopPage.included.heading')}{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{t('webshopPage.included.headingHighlight')}</span>
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
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0" />
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
                to="/start?dienst=webshop"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
              >
                {t('webshopPage.startWebshop')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
                {t('webshopPage.cta.liveIn2Weeks')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Trustpilot Reviews */}
        <TrustpilotReviews />

        {/* Features */}
        <section id="features" className="py-20 bg-gradient-to-b from-white via-emerald-50/20 to-white dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-100/40 to-green-100/20 dark:from-emerald-900/30 dark:to-green-900/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tl from-green-100/30 to-emerald-100/20 dark:from-green-900/20 dark:to-emerald-900/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-emerald-600 dark:text-emerald-400 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                {t('webshopPage.benefits.title')}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                {t('webshopPage.benefits.heading')}{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  {t('webshopPage.benefits.headingHighlight')}
                </span>
                {t('webshopPage.benefits.headingEnd')}
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
                  className="group p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-700 hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform flex-shrink-0">
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
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-200 dark:border-emerald-700 rounded-full px-4 py-2 mb-6">
                <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{t('webshopPage.finalCta.badge')}</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('webshopPage.finalCta.heading')}{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  {t('webshopPage.finalCta.headingHighlight')}
                </span>
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                {t('webshopPage.finalCta.subtitle')}
              </p>

              <Link
                to="/start?dienst=webshop"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
              >
                {t('webshopPage.startWebshop')}
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
