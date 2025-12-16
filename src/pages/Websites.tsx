import { motion } from 'framer-motion'
import { 
  Globe, 
  Zap, 
  Shield, 
  Palette, 
  Headphones, 
  TrendingUp,
  RefreshCw,
  CheckCircle,
  ArrowRight,
  Star,
  MessageSquare,
  Rocket,
  HeartHandshake,
  Users,
  FileText,
  Calendar,
  Sparkles,
  Monitor,
  Smartphone
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TrustpilotReviews from '../components/TrustpilotReviews'
import { includedFeatures } from '../data/packages'

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
  { value: '150+', label: 'Websites gebouwd' },
  { value: '7', label: 'Dagen levertijd' },
  { value: '4.9', label: 'Gemiddelde beoordeling', icon: Star },
  { value: '99.9%', label: 'Uptime garantie' },
]

const features = [
  {
    icon: Zap,
    title: 'Razendsnel online',
    description: 'Je website is binnen 7 werkdagen live. Wij regelen alles: hosting, domein en SSL.'
  },
  {
    icon: Palette,
    title: 'Op maat gemaakt',
    description: 'Geen standaard templates. Jouw website wordt volledig afgestemd op jouw merk en doelen.'
  },
  {
    icon: Shield,
    title: 'Veilig & betrouwbaar',
    description: 'SSL-certificaat, dagelijkse backups en 99.9% uptime garantie zijn standaard inbegrepen.'
  },
  {
    icon: Headphones,
    title: 'Persoonlijke support',
    description: 'Direct contact met je eigen websitebeheerder. Geen ticketsystemen of wachtrijen.'
  },
  {
    icon: TrendingUp,
    title: 'SEO geoptimaliseerd',
    description: 'Gevonden worden in Google? Elke website wordt gebouwd met SEO best practices.'
  },
  {
    icon: RefreshCw,
    title: 'Maandelijkse updates',
    description: "Tekst wijzigen? Nieuwe foto's? Wij voeren elke maand gratis aanpassingen door."
  },
]

const howItWorks = [
  {
    icon: MessageSquare,
    step: '01',
    title: 'Klik op "Start nu"',
    description: 'Deel je gegevens en wensen via ons simpele formulier. Binnen 24 uur nemen we contact met je op.'
  },
  {
    icon: Palette,
    step: '02',
    title: 'Design binnen 5 dagen',
    description: 'Je ontvangt een volledig uitgewerkt ontwerp. Niet tevreden? We passen aan tot het perfect is.'
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Live binnen 7 dagen',
    description: 'Na jouw goedkeuring gaat de website direct online. Inclusief hosting, SSL en domein.'
  },
  {
    icon: HeartHandshake,
    step: '04',
    title: 'Doorlopende support',
    description: 'Wij blijven je partner. Aanpassingen, vragen of nieuwe ideeën? Wij staan altijd voor je klaar.'
  },
]

// Extended package info with explanations - prijzen incl. 21% BTW
const packageDetails = [
  {
    id: 'starter',
    name: 'Starter',
    price: 96,
    priceExcl: 79,
    setupFee: 120,
    setupFeeExcl: 99,
    tagline: 'Ideaal om te beginnen',
    description: 'Perfect voor ZZP\'ers en kleine ondernemers die een professionele online aanwezigheid willen. Een mooie visitekaartje website met alle basis informatie.',
    idealFor: 'ZZP\'ers, freelancers, lokale dienstverleners',
    features: [
      { text: 'Tot 5 pagina\'s', explanation: 'Home, Over, Diensten, Contact + 1 extra' },
      { text: 'Responsive design', explanation: 'Perfect op mobiel, tablet én desktop' },
      { text: 'Contactformulier', explanation: 'Bezoekers kunnen direct contact opnemen' },
      { text: 'Google Maps integratie', explanation: 'Toon je locatie op de kaart' },
    ],
    icon: FileText,
  },
  {
    id: 'professional',
    name: 'Professioneel',
    price: 180,
    priceExcl: 149,
    setupFee: 180,
    setupFeeExcl: 149,
    tagline: 'Meest gekozen',
    description: 'Voor ondernemers die meer willen dan een visitekaartje. Met blog en analytics kun je groeien en je bezoekers beter begrijpen.',
    idealFor: 'Coaches, consultants, mkb-bedrijven',
    features: [
      { text: 'Tot 10 pagina\'s', explanation: 'Meer ruimte voor diensten, portfolio, team' },
      { text: 'Alles van Starter +', explanation: 'Alle functies van het Starter pakket' },
      { text: 'Blog functionaliteit', explanation: 'Deel kennis en verbeter je SEO' },
      { text: 'Social media integratie', explanation: 'Koppeling met Instagram, Facebook, etc.' },
      { text: 'Google Analytics', explanation: 'Inzicht in bezoekersaantallen en gedrag' },
    ],
    icon: Users,
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 301,
    priceExcl: 249,
    setupFee: 241,
    setupFeeExcl: 199,
    tagline: 'Voor groeiende bedrijven',
    description: 'Alle tools om je bedrijf online te laten groeien. Boekingssysteem, nieuwsbrieven en meertalige ondersteuning voor een professionele uitstraling.',
    idealFor: 'Salons, praktijken, restaurants, groeiende MKB',
    features: [
      { text: 'Tot 20 pagina\'s', explanation: 'Uitgebreide website met veel content' },
      { text: 'Alles van Professioneel +', explanation: 'Alle functies van vorige pakketten' },
      { text: 'Online boekingssysteem', explanation: 'Laat klanten direct afspraken maken' },
      { text: 'Nieuwsbrief integratie', explanation: 'Bouw een mailinglijst met Mailchimp/Brevo' },
      { text: 'Meerdere talen', explanation: 'NL + EN of andere talen naar keuze' },
    ],
    icon: Calendar,
  },
]

export default function Websites() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:bg-gray-900">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-white pt-20">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-br from-primary-200/60 via-blue-100/40 to-cyan-100/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-primary-100/50 via-blue-100/40 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
              animate={{ scale: [1, 1.08, 1], rotate: [0, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <FloatingParticles />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#dbeafe33_1px,transparent_1px),linear-gradient(to_bottom,#dbeafe33_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            <div className="absolute top-20 right-20 w-32 h-32 border border-primary-200/30 rounded-full" />
            <div className="absolute top-24 right-24 w-24 h-24 border border-primary-300/20 rounded-full" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200/50 rounded-full px-4 py-2 mb-6"
                >
                  <Globe className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-primary-700">Website laten maken</span>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Jouw professionele{' '}
                  <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                    website
                  </span>
                  {' '}zonder gedoe
                </h1>

                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Een professionele website voor een vast bedrag per maand. 
                  Inclusief hosting, onderhoud en aanpassingen. Live binnen 7 dagen.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/website-starten"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
                  >
                    Start je project
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
        <section className="py-8 bg-gradient-to-r from-primary-600 to-blue-600">
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
                  <p className="text-primary-100 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Website Showcase - Device Mockups */}
        <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-50/50 via-blue-50/30 to-cyan-50/50 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Wat je krijgt
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Websites die{' '}
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                  resultaat
                </span>
                {' '}opleveren
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 text-lg max-w-2xl mx-auto"
              >
                Responsive, snel en geoptimaliseerd voor conversie. Op elk apparaat perfect.
              </motion.p>
            </div>

            {/* Device mockups grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Desktop mockup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-6 aspect-[4/3] flex items-center justify-center overflow-hidden md:col-span-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full max-w-[400px]">
                  {/* Browser window */}
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                    <div className="h-6 bg-gray-100 flex items-center gap-1.5 px-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      <div className="flex-1 mx-4">
                        <div className="h-3 bg-gray-200 rounded-full w-full" />
                      </div>
                    </div>
                    <div className="p-4">
                      {/* Hero section mockup */}
                      <div className="h-20 bg-gradient-to-r from-primary-100 to-blue-50 rounded-lg mb-3 flex items-center justify-center">
                        <div className="text-center">
                          <div className="h-3 bg-primary-300 rounded w-32 mx-auto mb-2" />
                          <div className="h-2 bg-gray-200 rounded w-24 mx-auto" />
                        </div>
                      </div>
                      {/* Content */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-12 bg-gray-100 rounded" />
                        <div className="h-12 bg-gray-100 rounded" />
                        <div className="h-12 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-gray-400" />
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Desktop weergave</p>
                </div>
              </motion.div>

              {/* Mobile mockup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group relative bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-6 aspect-[4/3] flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  {/* Phone frame */}
                  <div className="w-28 bg-gray-800 rounded-2xl p-1.5 shadow-xl">
                    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
                      {/* Status bar */}
                      <div className="h-4 bg-gray-100 flex items-center justify-center">
                        <div className="w-8 h-1.5 bg-gray-800 rounded-full" />
                      </div>
                      {/* Content */}
                      <div className="p-2">
                        <div className="h-10 bg-gradient-to-r from-primary-100 to-blue-50 rounded mb-2" />
                        <div className="space-y-1.5">
                          <div className="h-1.5 bg-gray-200 rounded w-full" />
                          <div className="h-1.5 bg-gray-200 rounded w-4/5" />
                          <div className="h-1.5 bg-gray-200 rounded w-3/5" />
                        </div>
                        <div className="h-5 bg-primary-500 rounded mt-3" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-gray-400" />
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mobiel responsive</p>
                </div>
              </motion.div>
            </div>

            {/* What's always included */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-3"
            >
              {includedFeatures.map((feature) => (
                <span 
                  key={feature}
                  className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
                >
                  ✓ {feature}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Packages - Detailed */}
        <section id="pakketten" className="py-20 bg-gradient-to-b from-gray-50 via-primary-50/20 to-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary-100/40 to-blue-100/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-blue-100/30 to-primary-100/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-3"
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
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
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
                Elk pakket inclusief hosting, onderhoud, updates en support. Maandelijks opzegbaar.
              </motion.p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {packageDetails.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white dark:bg-gray-900 rounded-2xl border-2 p-8 transition-all hover:shadow-xl ${
                    pkg.popular 
                      ? 'border-primary-500 shadow-lg shadow-primary-100' 
                      : 'border-gray-200 hover:border-primary-200'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 bg-gradient-to-r from-primary-500 to-blue-500 text-white text-sm font-semibold rounded-full shadow-lg">
                        Meest gekozen
                      </span>
                    </div>
                  )}

                  {/* Icon & Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      pkg.popular 
                        ? 'bg-gradient-to-br from-primary-500 to-blue-600 shadow-lg shadow-primary-500/20' 
                        : 'bg-primary-100'
                    }`}>
                      <pkg.icon className={`w-6 h-6 ${pkg.popular ? 'text-white' : 'text-primary-600'}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{pkg.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{pkg.tagline}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">€{pkg.price}</span>
                      <span className="text-gray-500 dark:text-gray-400">/maand</span>
                      <span className="ml-2 text-xs text-gray-400">(incl. BTW)</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">+ €{pkg.setupFee} eenmalige opstartkosten</p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Ideal for */}
                  <div className="bg-primary-50/50 rounded-lg p-3 mb-6">
                    <p className="text-xs font-medium text-primary-700">
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      Ideaal voor: {pkg.idealFor}
                    </p>
                  </div>

                  {/* Features with explanations */}
                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="group">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-gray-900 font-medium text-sm">{feature.text}</span>
                            <p className="text-xs text-gray-500 mt-0.5">{feature.explanation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/website-starten?pakket=${pkg.id}`}
                    className={`block w-full py-4 text-center font-semibold rounded-xl transition-all ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40'
                        : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                    }`}
                  >
                    Kies {pkg.name} →
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* BTW info badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 flex justify-center"
            >
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
                <span className="text-emerald-600 text-sm font-medium">💼 Zakelijke investering</span>
                <span className="text-emerald-600 text-sm">•</span>
                <span className="text-emerald-600 text-sm">21% BTW kun je terugvragen bij je aangifte</span>
              </div>
            </motion.div>

            {/* Webshop upsell */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 text-center"
            >
              <p className="text-gray-700 mb-3">
                <span className="font-semibold">Producten verkopen?</span> Bekijk onze webshop pakketten vanaf €301/maand (incl. BTW)
              </p>
              <Link
                to="/webshop"
                className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-800 transition-colors"
              >
                Bekijk webshop pakketten
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-gray-500 mt-8"
            >
              Alle prijzen zijn exclusief BTW • Geen langlopende contracten • 14 dagen geld-terug garantie
            </motion.p>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-gradient-to-b from-white via-primary-50/20 to-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-100/40 to-blue-100/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tl from-blue-100/30 to-primary-100/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Waarom Webstability
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Alles voor een{' '}
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                  succesvolle
                </span>
                {' '}website
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 text-lg max-w-2xl mx-auto"
              >
                Geen technische kennis nodig. Wij regelen alles zodat jij kunt ondernemen.
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
                  className="group p-6 bg-white dark:bg-gray-900 border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary-200 hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform flex-shrink-0">
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

        {/* How it works */}
        <section className="py-20 bg-gradient-to-b from-gray-50 via-primary-50/20 to-gray-50 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                Hoe het werkt
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                In 4 stappen{' '}
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                  online
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 text-lg max-w-2xl mx-auto"
              >
                Van idee tot live website in slechts 7 dagen. Wij doen het zware werk.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all"
                >
                  {/* Step number */}
                  <div className="absolute -top-3 left-6">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-500 text-white text-sm font-bold rounded-full">
                      {step.step}
                    </span>
                  </div>
                  
                  <div className="pt-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                      <step.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                  
                  {/* Connector line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary-200" />
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                to="/website-starten"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
              >
                Start je project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-gray-500 text-sm mt-4">
                Binnen 24 uur een reactie • Gratis adviesgesprek
              </p>
            </motion.div>
          </div>
        </section>

        {/* Trustpilot Reviews */}
        <TrustpilotReviews className="bg-white dark:bg-gray-900 dark:bg-gray-900" />
      </main>

      <Footer ctaVariant="default" />
    </div>
  )
}
