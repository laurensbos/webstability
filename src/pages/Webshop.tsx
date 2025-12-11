import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  CreditCard, 
  Shield, 
  Smartphone,
  CheckCircle,
  ArrowRight,
  Star,
  BarChart3,
  Truck
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const features = [
  {
    icon: ShoppingCart,
    title: 'Onbeperkt producten',
    description: 'Voeg zoveel producten toe als je wilt, zonder extra kosten.'
  },
  {
    icon: CreditCard,
    title: 'Veilig betalen',
    description: 'iDEAL, creditcard, PayPal, Klarna en meer. Alles inbegrepen.'
  },
  {
    icon: Truck,
    title: 'Verzendopties',
    description: 'PostNL, DHL, DPD integraties. Automatische tracking voor klanten.'
  },
  {
    icon: BarChart3,
    title: 'Analytics dashboard',
    description: 'Inzicht in verkopen, bezoekers en conversies. Real-time data.'
  },
  {
    icon: Smartphone,
    title: 'Mobiel geoptimaliseerd',
    description: '70% van je klanten koopt via mobiel. Wij zorgen voor perfecte UX.'
  },
  {
    icon: Shield,
    title: 'SSL & beveiliging',
    description: 'Veilige checkout, GDPR-compliant en automatische backups.'
  },
]

const included = [
  'Custom webshop design',
  'Product management systeem',
  'Voorraad beheer',
  'iDEAL, creditcard, PayPal',
  'Automatische facturen',
  'Klantaccounts',
  'Kortingscodes systeem',
  'Verzendkosten calculator',
  'Order management',
  'E-mail notificaties',
  'SEO geoptimaliseerd',
  'GDPR & cookie consent',
  'SSL certificaat',
  'Dagelijkse backups',
  'Hosting inbegrepen',
  'Onderhoud & updates',
]

const testimonials = [
  {
    name: 'Sophie de Vries',
    company: 'Handgemaakte Sieraden',
    quote: 'Binnen een week had ik een prachtige webshop. De eerste maand al 47 bestellingen!',
    rating: 5,
  },
  {
    name: 'Martijn Bakker',
    company: 'Lokale Delicatessen',
    quote: 'Eindelijk een webshop die er professioneel uitziet én makkelijk te beheren is.',
    rating: 5,
  },
]

export default function Webshop() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-primary-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary-100/50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                  <ShoppingCart className="w-4 h-4" />
                  Webshop laten maken
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Start je eigen{' '}
                  <span className="text-primary-600">webshop</span>
                  <br />zonder gedoe
                </h1>

                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Een professionele webshop met alle functionaliteit die je nodig hebt. 
                  Wij bouwen, jij verkoopt. Vanaf €249/maand.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/start?pakket=business"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary-500/25"
                  >
                    Start je webshop
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-colors"
                  >
                    Bekijk mogelijkheden
                  </a>
                </div>

                {/* Quick stats */}
                <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-gray-200">
                  {[
                    { value: '50+', label: 'Webshops gebouwd' },
                    { value: '€2M+', label: 'Omzet klanten' },
                    { value: '4.9/5', label: 'Klanttevredenheid' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Alles wat je nodig hebt om te verkopen
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Een complete webshop met betalingen, verzending, voorraadbeheer en meer. 
                Alles inbegrepen, geen verborgen kosten.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white border border-gray-100 rounded-2xl hover:border-primary-200 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  Alles inbegrepen voor{' '}
                  <span className="text-primary-600">€249/maand</span>
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Geen verborgen kosten, geen verrassingen. Eenmalige opstartkosten van €299 
                  voor je custom design en setup. Daarna betaal je alleen het maandelijks abonnement.
                </p>

                <div className="grid sm:grid-cols-2 gap-3">
                  {included.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link
                    to="/start?pakket=business"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
                  >
                    Start je webshop
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Pricing card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xl">
                <div className="text-center mb-8">
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-4">
                    Webshop pakket
                  </span>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-gray-900">€249</span>
                    <span className="text-gray-500">/maand</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">excl. BTW • €299 eenmalige setup</p>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    'Professioneel custom design',
                    'Onbeperkt producten',
                    'Alle betaalmethoden',
                    'Verzendintegraties',
                    'Order management',
                    'Hosting & onderhoud',
                    'Persoonlijke support',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/start?pakket=business"
                  className="block w-full py-4 bg-primary-500 hover:bg-primary-600 text-white text-center font-semibold rounded-xl transition-colors"
                >
                  Start nu →
                </Link>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Geen langlopende contracten • Maandelijks opzegbaar
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ondernemers die ons voorgingen
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-100 rounded-2xl p-8"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg mb-6">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.company}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Klaar om te gaan verkopen?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Start vandaag nog met je eigen webshop. Wij regelen alles, 
              jij focust op je producten en klanten.
            </p>
            <Link
              to="/start?pakket=business"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
            >
              Start je webshop
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
