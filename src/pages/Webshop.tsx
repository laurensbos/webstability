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
  Star
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TrustpilotReviews from '../components/TrustpilotReviews'

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
    price: '301',
    priceExcl: '249',
    setupFee: '362',
    setupFeeExcl: '299',
    description: 'Perfect om te beginnen met online verkopen',
    features: [
      'Tot 50 producten',
      'iDEAL & creditcard',
      'Basis verzendopties',
      'Mobiel-vriendelijk design',
      'Order management',
      'E-mail notificaties',
      'SSL certificaat',
      'Hosting inbegrepen',
    ],
  },
  {
    id: 'professional',
    name: 'Professioneel',
    price: '422',
    priceExcl: '349',
    setupFee: '362',
    setupFeeExcl: '299',
    description: 'Voor serieuze webshops die willen groeien',
    features: [
      'Tot 500 producten',
      'Alle betaalmethodes',
      'Geavanceerde verzending',
      'Koppeling met boekhouden',
      'Kortingscodes systeem',
      'Klantaccounts',
      'Automatische facturen',
      'Prioriteit support',
    ],
    popular: true,
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
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:bg-gray-900">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white pt-20">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-br from-emerald-200/60 via-green-100/40 to-teal-100/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-green-100/50 via-emerald-100/40 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
              animate={{ scale: [1, 1.08, 1], rotate: [0, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <FloatingParticles />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#d1fae533_1px,transparent_1px),linear-gradient(to_bottom,#d1fae533_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            <div className="absolute top-20 right-20 w-32 h-32 border border-emerald-200/30 rounded-full" />
            <div className="absolute top-24 right-24 w-24 h-24 border border-emerald-300/20 rounded-full" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50 rounded-full px-4 py-2 mb-6"
                >
                  <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">Webshop laten maken</span>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Verkoop online met een{' '}
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    professionele webshop
                  </span>
                </h1>

                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Wij bouwen jouw complete webshop met betalingen, verzending en voorraadbeheer. 
                  Jij focust op verkopen, wij regelen de techniek.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/webshop-starten"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                  >
                    Start je webshop
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#pakketten"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-gray-900 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-all hover:shadow-lg"
                  >
                    Bekijk pakketten
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="py-8 bg-gradient-to-r from-emerald-600 to-green-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-3xl md:text-4xl font-bold text-white">{stat.value}</span>
                    {stat.icon && <stat.icon className="w-5 h-5 text-yellow-300 fill-yellow-300" />}
                  </div>
                  <p className="text-emerald-100 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Webshop Showcase - Mockups */}
        <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-50/50 via-green-50/30 to-teal-50/50 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-emerald-600 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Wat je krijgt
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
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
                className="text-gray-600 text-lg max-w-2xl mx-auto"
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
                className="group relative bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-6 aspect-[4/3] flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full max-w-[200px]">
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                    <div className="h-24 bg-gradient-to-br from-emerald-100 to-green-50 flex items-center justify-center">
                      <Package className="w-10 h-10 text-emerald-400" />
                    </div>
                    <div className="p-3">
                      <div className="h-2 bg-gray-200 rounded w-3/4 mb-2" />
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
                className="group relative bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-6 aspect-[4/3] flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full max-w-[200px]">
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4">
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg" />
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded w-full mb-1" />
                        <div className="h-2 bg-gray-100 rounded w-2/3" />
                      </div>
                      <div className="text-emerald-600 font-bold text-sm">€29</div>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg" />
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded w-full mb-1" />
                        <div className="h-2 bg-gray-100 rounded w-1/2" />
                      </div>
                      <div className="text-emerald-600 font-bold text-sm">€49</div>
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
                className="group relative bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-6 aspect-[4/3] flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full max-w-[200px]">
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4">
                    <div className="text-center mb-3">
                      <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                      <div className="h-2 bg-gray-200 rounded w-2/3 mx-auto" />
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div className="w-6 h-4 bg-orange-500 rounded text-white text-[6px] flex items-center justify-center font-bold">iDEAL</div>
                        <div className="h-2 bg-gray-200 rounded flex-1" />
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <div className="h-2 bg-gray-200 rounded flex-1" />
                      </div>
                    </div>
                    <div className="h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">Betalen</span>
                    </div>
                  </div>
                </div>
                <p className="absolute bottom-4 left-4 text-sm font-medium text-gray-500 dark:text-gray-400">Veilige checkout</p>
              </motion.div>
            </div>

            {/* Payment methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-3"
            >
              {['iDEAL', 'Visa', 'Mastercard', 'PayPal', 'Klarna', 'Bancontact'].map((method) => (
                <span 
                  key={method}
                  className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
                >
                  {method}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Packages */}
        <section id="pakketten" className="py-20 bg-gradient-to-b from-gray-50 via-emerald-50/20 to-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-100/40 to-green-100/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-green-100/30 to-emerald-100/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-emerald-600 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Kies je pakket
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Transparante prijzen,{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  geen verrassingen
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 text-lg max-w-2xl mx-auto"
              >
                Alles inbegrepen: hosting, onderhoud, updates en support. Maandelijks opzegbaar.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white dark:bg-gray-900 rounded-2xl border-2 p-8 transition-all hover:shadow-xl ${
                    pkg.popular 
                      ? 'border-emerald-500 shadow-lg shadow-emerald-100' 
                      : 'border-gray-200 hover:border-emerald-200'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-semibold rounded-full shadow-lg">
                        Meest gekozen
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <div className="flex items-baseline justify-center gap-1 mb-1">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">€{pkg.price}</span>
                      <span className="text-gray-500 dark:text-gray-400">/maand</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">+ €{pkg.setupFee} eenmalige opstartkosten</p>
                    <p className="text-xs text-emerald-600 font-medium mt-1">
                      Prijzen incl. BTW • BTW aftrekbaar als zakelijke investering
                    </p>
                    <p className="text-gray-600 mt-2">{pkg.description}</p>
                  </div>

                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/webshop-starten?pakket=${pkg.id}`}
                    className={`block w-full py-4 text-center font-semibold rounded-xl transition-all ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    Kies {pkg.name} →
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-gray-500 mt-8"
            >
              Alle prijzen zijn inclusief 21% BTW • Als ondernemer krijg je de BTW terug via je aangifte
            </motion.p>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-gradient-to-b from-white via-emerald-50/20 to-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-100/40 to-green-100/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tl from-green-100/30 to-emerald-100/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-emerald-600 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Functionaliteiten
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Alles wat je nodig hebt om te{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  verkopen
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 text-lg max-w-2xl mx-auto"
              >
                Een complete e-commerce oplossing zonder technische kennis. Wij regelen alles.
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
                  className="group p-6 bg-white dark:bg-gray-900 border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What's included - simplified */}
        <section className="py-20 bg-gradient-to-b from-gray-50 via-emerald-50/20 to-gray-50 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-emerald-600 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Inbegrepen
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Geen verborgen kosten
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 text-lg max-w-2xl mx-auto"
              >
                Alles wat je nodig hebt zit in je maandelijkse abonnement.
              </motion.p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {included.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 shadow-sm"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{item}</span>
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
                to="/webshop-starten"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
              >
                Start je webshop
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-gray-500 text-sm mt-4">
                Binnen 2 weken live • Persoonlijke begeleiding
              </p>
            </motion.div>
          </div>
        </section>

        {/* Trustpilot Reviews */}
        <TrustpilotReviews className="bg-white dark:bg-gray-900 dark:bg-gray-900" />
      </main>

      <Footer ctaVariant="webshop" />
    </div>
  )
}
