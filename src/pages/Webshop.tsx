import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  CreditCard, 
  Shield, 
  Smartphone,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Truck,
  Package,
  Star,
  Zap,
  Users
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TrustpilotReviews from '../components/TrustpilotReviews'
import WhatYouGet from '../components/WhatYouGet'

// Floating particles component with green accents
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
    </>
  )
}

const stats = [
  { value: '50+', label: 'Webshops gebouwd' },
  { value: '€2M+', label: 'Omzet via onze shops' },
  { value: '4.9', label: 'Gemiddelde beoordeling', icon: Star },
  { value: '24u', label: 'Support reactietijd' },
]

const features = [
  {
    icon: ShoppingCart,
    title: 'Producten toevoegen',
    description: 'Eenvoudig producten beheren met foto\'s, varianten, prijzen en voorraad.'
  },
  {
    icon: CreditCard,
    title: 'Veilig betalen',
    description: 'iDEAL, creditcard, PayPal, Klarna en meer. Alles direct inbegrepen.'
  },
  {
    icon: Truck,
    title: 'Verzendopties',
    description: 'PostNL, DHL, DPD integraties. Automatische tracking voor je klanten.'
  },
  {
    icon: BarChart3,
    title: 'Sales dashboard',
    description: 'Real-time inzicht in omzet, orders en bestverkopende producten.'
  },
  {
    icon: Smartphone,
    title: 'Mobiel geoptimaliseerd',
    description: '70% van je klanten koopt via mobiel. Perfecte checkout ervaring.'
  },
  {
    icon: Shield,
    title: 'SSL & beveiliging',
    description: 'Veilige checkout, GDPR-compliant en dagelijkse backups.'
  },
]

const packages = [
  {
    id: 'starter',
    name: 'Starter',
    price: 349,
    priceExcl: 289,
    setupFee: 349,
    setupFeeExcl: 289,
    tagline: 'Perfect om te beginnen',
    popular: false,
    description: 'Perfect om te beginnen met online verkopen',
    features: [
      'Tot 50 producten',
      'iDEAL & creditcard',
      'Basis verzendopties',
      'Mobiel-vriendelijk design',
      'Order management',
      'E-mail notificaties',
    ],
    icon: Package,
  },
  {
    id: 'professional',
    name: 'Professioneel',
    price: 599,
    priceExcl: 495,
    setupFee: 499,
    setupFeeExcl: 413,
    popular: true,
    description: 'Voor serieuze webshops die willen groeien',
    features: [
      'Tot 500 producten',
      'Alle betaalmethodes',
      'Geavanceerde verzending',
      'Koppeling met boekhouden',
      'Kortingscodes systeem',
      'Klantaccounts',
    ],
    icon: Users,
  },
]

const included = [
  'Custom webshop design',
  'Product management',
  'Voorraad beheer',
  'iDEAL, creditcard, PayPal',
  'Order notificaties',
  'Verzendlabels',
  'SEO geoptimaliseerd',
  'Hosting & SSL',
]

export default function Webshop() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-900 pt-20">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-br from-emerald-200/60 via-green-100/40 to-teal-100/30 dark:from-emerald-800/30 dark:via-green-900/20 dark:to-teal-900/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-green-100/50 via-emerald-100/40 to-transparent dark:from-green-900/30 dark:via-emerald-900/20 dark:to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
              animate={{ scale: [1, 1.08, 1], rotate: [0, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-teal-100/30 via-emerald-100/20 to-green-100/30 dark:from-teal-900/20 dark:via-emerald-900/10 dark:to-green-900/20 rounded-full blur-3xl" />
            
            <FloatingParticles />
            
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#d1fae533_1px,transparent_1px),linear-gradient(to_bottom,#d1fae533_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#06554033_1px,transparent_1px),linear-gradient(to_bottom,#06554033_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            
            <div className="absolute top-20 right-20 w-32 h-32 border border-emerald-200/30 dark:border-emerald-700/30 rounded-full" />
            <div className="absolute top-24 right-24 w-24 h-24 border border-emerald-300/20 dark:border-emerald-600/20 rounded-full" />
            <div className="absolute bottom-32 left-20 w-20 h-20 border border-green-200/40 dark:border-green-700/40 rounded-full" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-200/50 dark:border-emerald-700/50 rounded-full px-4 py-2 mb-6"
                >
                  <ShoppingCart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Webshop laten maken</span>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  Verkoop online met een{' '}
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">professionele webshop</span>
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  Wij bouwen jouw complete webshop met betalingen, verzending en voorraadbeheer. 
                  Jij focust op verkopen, wij regelen de techniek.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/start?dienst=webshop"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                  >
                    Start je webshop
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#pakketten"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg"
                  >
                    Bekijk pakketten
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Webshop Showcase */}
        <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-50/50 via-green-50/30 to-teal-50/50 dark:from-emerald-900/20 dark:via-green-900/10 dark:to-teal-900/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-emerald-600 dark:text-emerald-400 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Wat je krijgt
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Een complete{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  webshop ervaring
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto"
              >
                Van productpagina tot checkout - alles is geoptimaliseerd voor conversie.
              </motion.p>
            </div>

            {/* Mockup grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Product page mockup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 aspect-[4/3] flex items-center justify-center overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 dark:from-emerald-500/10 dark:to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full max-w-[200px]">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <div className="h-24 bg-gradient-to-br from-emerald-100 to-green-50 dark:from-emerald-900/50 dark:to-green-900/30 flex items-center justify-center">
                      <Package className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div className="p-3">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-emerald-500 rounded w-1/3 mb-3" />
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="absolute bottom-4 left-4 text-sm font-medium text-gray-500 dark:text-gray-400">Productpagina</p>
              </motion.div>

              {/* Cart mockup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 aspect-[4/3] flex items-center justify-center overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 dark:from-emerald-500/10 dark:to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full max-w-[200px]">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4">
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg" />
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1" />
                        <div className="h-2 bg-gray-100 dark:bg-gray-600 rounded w-2/3" />
                      </div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">€29</div>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg" />
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1" />
                        <div className="h-2 bg-gray-100 dark:bg-gray-600 rounded w-1/2" />
                      </div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">€49</div>
                    </div>
                    <div className="h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">Afrekenen</span>
                    </div>
                  </div>
                </div>
                <p className="absolute bottom-4 left-4 text-sm font-medium text-gray-500 dark:text-gray-400">Winkelwagen</p>
              </motion.div>

              {/* Checkout mockup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 aspect-[4/3] flex items-center justify-center overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 dark:from-emerald-500/10 dark:to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full max-w-[200px]">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-emerald-500" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Veilig afrekenen</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-8 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600" />
                      <div className="h-8 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600" />
                    </div>
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1 h-6 bg-blue-50 dark:bg-blue-900/30 rounded flex items-center justify-center">
                        <span className="text-[8px] text-blue-600 dark:text-blue-400 font-bold">iDEAL</span>
                      </div>
                      <div className="flex-1 h-6 bg-orange-50 dark:bg-orange-900/30 rounded flex items-center justify-center">
                        <CreditCard className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                    <div className="h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">Bestelling plaatsen</span>
                    </div>
                  </div>
                </div>
                <p className="absolute bottom-4 left-4 text-sm font-medium text-gray-500 dark:text-gray-400">Checkout</p>
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
                <div key={index} className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
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

        {/* What You Get */}
        <WhatYouGet variant="webshop" />

        {/* Packages */}
        <section id="pakketten" className="py-20 bg-gradient-to-b from-gray-50 via-emerald-50/20 to-gray-50 dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-100/40 to-green-100/20 dark:from-emerald-900/30 dark:to-green-900/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-green-100/30 to-emerald-100/20 dark:from-green-900/20 dark:to-emerald-900/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-emerald-600 dark:text-emerald-400 font-semibold text-sm tracking-wider uppercase mb-3"
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
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">webshop pakket</span>
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
                        <span className="text-gray-500 dark:text-gray-400">/maand</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+ €{pkg.setupFee} eenmalige opstartkosten</p>
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
                      Kies {pkg.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Dot indicators */}
              <div className="flex justify-center gap-2 mt-3">
                {packages.map((_, idx) => (
                  <div key={idx} className={`h-2 rounded-full transition-all ${idx === 0 ? 'bg-emerald-500 w-6' : 'bg-gray-300 dark:bg-gray-600 w-2'}`} />
                ))}
              </div>
            </div>

            {/* Desktop: grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {packages.map((pkg, index) => (
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
                        Meest gekozen
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
                      <span className="text-gray-500 dark:text-gray-400">/maand</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+ €{pkg.setupFee} eenmalige opstartkosten</p>
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
                    Kies {pkg.name}
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
                Inbegrepen
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Standaard bij{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">elk pakket</span>
              </motion.h2>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {included.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
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
                Start je webshop
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
                Functionaliteiten
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Alles voor een{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  succesvolle webshop
                </span>
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
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Klaar om te starten?</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Start vandaag nog met{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  online verkopen
                </span>
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Binnen 2 weken heb je een volledig werkende webshop. 
                Wij begeleiden je bij elke stap.
              </p>

              <Link
                to="/start?dienst=webshop"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
              >
                Start je webshop
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer ctaVariant="webshop" />
    </div>
  )
}
