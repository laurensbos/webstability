import { motion } from 'framer-motion'
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin,
  Target,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Star,
  Rocket,
  Building2,
  Heart,
  BarChart3,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

// Floating particles component
function FloatingParticles() {
  const particles = [
    { size: 4, x: '10%', y: '20%', delay: 0, duration: 4 },
    { size: 6, x: '20%', y: '60%', delay: 1, duration: 5 },
    { size: 3, x: '80%', y: '30%', delay: 0.5, duration: 4.5 },
    { size: 5, x: '70%', y: '70%', delay: 1.5, duration: 5.5 },
    { size: 4, x: '90%', y: '50%', delay: 2, duration: 4 },
  ]

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-emerald-400 to-teal-500"
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
  { value: '500+', label: 'Bedrijven benaderd' },
  { value: '35%', label: 'Gemiddelde respons' },
  { value: '150+', label: 'Nieuwe klanten' },
  { value: '4.9', label: 'Klanttevredenheid', icon: Star },
]

const features = [
  {
    icon: MapPin,
    title: 'Lokale focus',
    description: 'Wij benaderen bedrijven in jouw regio. Persoonlijk contact, geen koude calls naar het buitenland.'
  },
  {
    icon: Mail,
    title: 'Professionele outreach',
    description: 'Doordachte email templates die aansluiten bij jouw doelgroep. Geen spam, maar relevante berichten.'
  },
  {
    icon: Target,
    title: 'Gerichte benadering',
    description: 'We selecteren bedrijven die écht baat hebben bij een website. Kwaliteit boven kwantiteit.'
  },
  {
    icon: Users,
    title: 'Persoonlijk contact',
    description: 'Elke lead wordt persoonlijk opgevolgd. Van eerste contact tot getekende offerte.'
  },
  {
    icon: BarChart3,
    title: 'Resultaat tracking',
    description: 'Je ziet precies hoeveel bedrijven we benaderen, wie reageert en wat het oplevert.'
  },
  {
    icon: Heart,
    title: 'Lange termijn relaties',
    description: 'Niet alleen nieuwe klanten werven, maar ook bestaande relaties onderhouden.'
  },
]

const howItWorks = [
  {
    icon: Building2,
    step: '01',
    title: 'Bedrijven identificeren',
    description: 'We zoeken lokale ondernemers die nog geen website hebben of toe zijn aan een upgrade.'
  },
  {
    icon: MessageSquare,
    step: '02',
    title: 'Persoonlijke benadering',
    description: 'Elk bedrijf krijgt een op maat gemaakte email. Geen standaard templates, maar persoonlijke aandacht.'
  },
  {
    icon: Phone,
    step: '03',
    title: 'Follow-up gesprek',
    description: 'Bij interesse bellen we voor een vrijblijvend kennismakingsgesprek.'
  },
  {
    icon: Rocket,
    step: '04',
    title: 'Offerte & start',
    description: 'Akkoord? Dan start direct het onboarding proces en gaan we aan de slag.'
  },
]

const benefits = [
  'Geen advertentiekosten - alleen outbound',
  'Lokale bedrijven in jouw regio',
  'Professionele email templates',
  'Persoonlijke follow-up',
  'Transparante rapportages',
  'Geen lange contracten'
]

export default function Marketing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-br from-emerald-200/60 via-teal-100/40 to-cyan-100/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-emerald-100/50 via-teal-100/40 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
              animate={{ scale: [1, 1.08, 1], rotate: [0, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <FloatingParticles />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#d1fae533_1px,transparent_1px),linear-gradient(to_bottom,#d1fae533_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            <div className="absolute top-20 right-20 w-32 h-32 border border-emerald-200/30 rounded-full" />
            <div className="absolute top-24 right-24 w-24 h-24 border border-emerald-300/20 rounded-full" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Content */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-full px-4 py-2 mb-6"
                >
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">Lokale klanten werven</span>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Meer klanten uit{' '}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      jouw regio
                    </span>
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-3 bg-emerald-200/50 -z-10 rounded"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    />
                  </span>
                </h1>

                <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-xl">
                  Wij benaderen lokale ondernemers die nog geen website hebben. 
                  Persoonlijk, professioneel en resultaatgericht. Zonder advertentiekosten.
                </p>

                {/* Benefits list */}
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {benefits.slice(0, 4).map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:scale-[1.02]"
                  >
                    Gratis adviesgesprek
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/portfolio"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-emerald-300 hover:text-emerald-700 transition-all"
                  >
                    Bekijk resultaten
                  </Link>
                </div>
              </motion.div>

              {/* Right: Stats */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-emerald-900/10 border border-emerald-100">
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="text-center p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50"
                      >
                        <div className="flex items-center justify-center gap-1 mb-1">
                          {stat.icon && <stat.icon className="w-5 h-5 text-emerald-500" />}
                          <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                        </div>
                        <span className="text-sm text-gray-600">{stat.label}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Mini testimonial */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-white/90 mb-1">
                          "Binnen 2 weken hadden we al 3 nieuwe klanten via hun benadering."
                        </p>
                        <p className="text-xs text-white/70">— Partner bedrijf</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Onze aanpak
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Waarom onze marketing werkt
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Geen dure advertenties of koude acquisitie. Wij bouwen relaties met lokale ondernemers.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 hover:shadow-xl hover:shadow-emerald-100/50 border border-gray-100 hover:border-emerald-200 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-4">
                <Rocket className="w-4 h-4" />
                Proces
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Hoe we nieuwe klanten werven
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Van identificatie tot deal - wij regelen het hele traject.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Connector line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-emerald-200 to-transparent" />
                  )}
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-emerald-200 transition-all relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-4xl font-bold text-emerald-100">{step.step}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Klaar om te groeien?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Laten we bespreken hoe we lokale ondernemers voor jou kunnen benaderen. 
                Eerste gesprek is altijd vrijblijvend.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-xl"
                >
                  Plan een gesprek
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="tel:+31612345678"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Bel direct
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
