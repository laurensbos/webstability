import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Check, 
  X, 
  ArrowRight, 
  Shield, 
  Globe,
  Palette,
  Plane,
  Star,
  ChevronDown
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AutoScrollCarousel from '../components/AutoScrollCarousel'
import Comparison from '../components/Comparison'
import { useState } from 'react'

// Website pakketten
const websitePlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect voor ZZP\'ers en starters die online willen beginnen',
    price: '79',
    setupFee: '99',
    popular: false,
    features: [
      { text: 'Professionele one-page website', included: true },
      { text: 'Mobiel responsive design', included: true },
      { text: 'SSL-certificaat & hosting', included: true },
      { text: 'Basis SEO optimalisatie', included: true },
      { text: '1 wijziging per maand', included: true },
      { text: 'E-mail support', included: true },
      { text: 'Multi-page website', included: false },
      { text: 'Contactformulier', included: false },
      { text: 'Google Analytics', included: false },
    ],
    cta: 'Start met Starter',
    color: 'gray',
  },
  {
    id: 'professional',
    name: 'Professioneel',
    description: 'Voor ondernemers die willen groeien met een complete website',
    price: '149',
    setupFee: '199',
    popular: true,
    features: [
      { text: 'Uitgebreide multi-page website', included: true },
      { text: 'Mobiel responsive design', included: true },
      { text: 'SSL-certificaat & hosting', included: true },
      { text: 'Geavanceerde SEO optimalisatie', included: true },
      { text: 'Onbeperkte tekstaanpassingen', included: true },
      { text: 'Prioriteit support', included: true },
      { text: 'Contactformulier & integraties', included: true },
      { text: 'Google Analytics dashboard', included: true },
      { text: 'Social media koppeling', included: true },
    ],
    cta: 'Start met Professioneel',
    color: 'primary',
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Voor gevestigde bedrijven die het maximale willen',
    price: '249',
    setupFee: '399',
    popular: false,
    features: [
      { text: 'Alles uit Professioneel', included: true },
      { text: 'Blog of nieuws sectie', included: true },
      { text: 'Webshop integratie mogelijk', included: true },
      { text: 'Maandelijks prestatierapport', included: true },
      { text: 'A/B testing & optimalisatie', included: true },
      { text: 'Dedicated accountmanager', included: true },
      { text: '24/7 prioriteit support', included: true },
      { text: 'Geavanceerde analytics', included: true },
      { text: 'Custom integraties', included: true },
    ],
    cta: 'Start met Business',
    color: 'gray',
  },
]

// Extra diensten
const extraServices = [
  {
    id: 'webshop',
    name: 'Webshop',
    description: 'Verkoop producten online met een complete e-commerce oplossing',
    price: '249',
    setupFee: '299',
    icon: Globe,
    color: 'emerald',
    features: [
      'Volledig werkende webshop',
      'Productbeheer dashboard',
      'Veilige betalingen (iDEAL, etc.)',
      'Voorraad- en orderbeheer',
      'Automatische facturen',
      'Koppeling met bezorgdiensten',
    ],
    link: '/webshop',
  },
  {
    id: 'logo',
    name: 'Logo laten maken',
    description: 'Een uniek logo dat jouw merk perfect vertegenwoordigt',
    price: '150',
    priceType: 'eenmalig',
    icon: Palette,
    color: 'purple',
    features: [
      '3 unieke concepten',
      'Onbeperkte revisierondes',
      'Alle bestandsformaten',
      'Vectorbestanden (AI, EPS, SVG)',
      'Merkrichtlijnen document',
      'Binnen 5 werkdagen',
    ],
    link: '/logo',
  },
  {
    id: 'drone',
    name: 'Luchtfoto & Video',
    description: 'Professionele luchtfoto\'s en video\'s voor je bedrijf',
    price: '399',
    priceType: 'eenmalig',
    icon: Plane,
    color: 'sky',
    features: [
      '4K Ultra HD videokwaliteit',
      'Professionele nabewerking',
      'Gecertificeerde piloten (A1/A2)',
      'Verzekerd tot €1 miljoen',
      'Geschikt voor vastgoed, events, etc.',
      'Binnen 7 werkdagen geleverd',
    ],
    link: '/luchtvideografie',
  },
]

// FAQ items
const faqItems = [
  {
    question: 'Wat zit er in de eenmalige opstartkosten?',
    answer: 'De opstartkosten dekken het complete ontwerp- en ontwikkelproces: intake gesprek, design op maat, development, testen, en de lancering van je website. Dit is een eenmalige investering waarna je alleen de maandelijkse kosten betaalt.',
  },
  {
    question: 'Kan ik later upgraden naar een ander pakket?',
    answer: 'Ja, je kunt op elk moment upgraden naar een groter pakket. We rekenen dan het verschil in maandkosten. Upgraden kan direct, downgraden kan na je contractperiode.',
  },
  {
    question: 'Wat gebeurt er als ik wil opzeggen?',
    answer: 'Na de eerste 3 maanden kun je maandelijks opzeggen met een opzegtermijn van 1 maand. Je behoudt alle content (teksten, foto\'s) en we helpen je graag met de overdracht naar een ander platform als je dat wilt.',
  },
  {
    question: 'Zijn er verborgen kosten?',
    answer: 'Nee, absoluut niet. De prijs die je ziet is wat je betaalt. Hosting, SSL, onderhoud, en kleine wijzigingen zitten allemaal inbegrepen. Alleen bij grote wijzigingen of extra features bespreken we vooraf de kosten.',
  },
  {
    question: 'Hoe zit het met de domeinnaam?',
    answer: 'Een domeinnaam (.nl, .com, etc.) kost ongeveer €10-15 per jaar en regel je zelf of wij kunnen dit voor je regelen. Dit is de enige extra kostenpost die niet in ons pakket zit.',
  },
  {
    question: 'Wat als ik niet tevreden ben?',
    answer: 'We hebben een 14 dagen niet-goed-geld-terug garantie. Als je binnen 14 dagen na lancering niet tevreden bent, krijg je je opstartkosten volledig terug.',
  },
]

export default function Prijzen() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-4">
              Transparante prijzen
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Eerlijke prijzen,<br />
              <span className="text-primary-600">geen verrassingen</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Alles wat je nodig hebt voor een professionele online aanwezigheid.
              Één vaste prijs per maand, alles inbegrepen.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>Hosting inbegrepen</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>Onderhoud inbegrepen</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>Support inbegrepen</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Website Pakketten */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Website Pakketten
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Kies het pakket dat past bij jouw ambities. Upgrade wanneer je wilt.
            </p>
          </div>

          {/* Mobile: Horizontal scroll carousel */}
          <div className="lg:hidden">
            <AutoScrollCarousel className="flex gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory" speed={20}>
              {websitePlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex-shrink-0 w-[300px] snap-start rounded-2xl ${
                    plan.popular
                      ? 'bg-white border-2 border-primary-500 shadow-lg shadow-primary-500/10'
                      : 'bg-white border border-gray-200 shadow-md'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Meest gekozen
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-gray-500 text-sm mb-4">{plan.description}</p>

                    <div className="flex items-baseline gap-0.5 mb-0.5">
                      <span className="text-gray-400 text-sm">€</span>
                      <span className="text-gray-900 font-bold text-4xl">{plan.price}</span>
                      <span className="text-gray-400 text-sm">/maand</span>
                    </div>
                    <p className="text-primary-600 text-xs font-medium mb-4">+ €{plan.setupFee} eenmalige opstart</p>

                    <ul className="space-y-2 mb-6">
                      {plan.features.slice(0, 5).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          {feature.included ? (
                            <div className="flex-shrink-0 w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                              <Check className="w-2.5 h-2.5 text-green-600" />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                              <X className="w-2.5 h-2.5 text-gray-400" />
                            </div>
                          )}
                          <span className={`text-xs ${feature.included ? 'text-gray-600' : 'text-gray-400'}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                      {plan.features.length > 5 && (
                        <li className="text-gray-400 text-xs pl-6">
                          +{plan.features.length - 5} meer...
                        </li>
                      )}
                    </ul>

                    <Link
                      to={`/start?pakket=${plan.id}`}
                      className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm ${
                        plan.popular
                          ? 'bg-primary-500 hover:bg-primary-600 text-white'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    >
                      {plan.cta.replace('Start met ', '')}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AutoScrollCarousel>
            {/* Scroll indicator */}
            <div className="flex justify-center gap-1.5 mt-4">
              {websitePlans.map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-gray-300" />
              ))}
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {websitePlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl ${
                  plan.popular
                    ? 'bg-white border-2 border-primary-500 shadow-xl shadow-primary-500/10 lg:scale-105'
                    : 'bg-white border border-gray-200 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg shadow-primary-500/25 flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Meest gekozen
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-gray-400 text-lg">€</span>
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-400">/maand</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">excl. BTW</p>
                  <p className="text-primary-600 text-sm font-medium mb-6">
                    + €{plan.setupFee} eenmalige opstartkosten
                  </p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        {feature.included ? (
                          <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                            <X className="w-3 h-3 text-gray-400" />
                          </div>
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/start?pakket=${plan.id}`}
                    className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 group ${
                      plan.popular
                        ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Guarantee badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-50 border border-green-200 rounded-full">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">14 dagen niet-goed-geld-terug garantie</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Waarom Webstability - direct na pricing */}
      <Comparison />

      {/* Extra Diensten */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Extra Diensten
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Breid je online aanwezigheid uit met onze aanvullende services
            </p>
          </div>

          {/* Mobile: Horizontal scroll carousel */}
          <div className="md:hidden">
            <AutoScrollCarousel className="flex gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory" speed={15}>
              {extraServices.map((service, index) => {
                const Icon = service.icon
                const colorClasses = {
                  emerald: 'bg-emerald-100 text-emerald-600',
                  purple: 'bg-purple-100 text-purple-600',
                  sky: 'bg-sky-100 text-sky-600',
                }
                const bgColor = colorClasses[service.color as keyof typeof colorClasses]
                
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-[280px] snap-start bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden"
                  >
                    <div className="p-5">
                      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{service.name}</h3>
                      <p className="text-gray-500 text-xs mb-4">{service.description}</p>

                      <div className="flex items-baseline gap-0.5 mb-1">
                        <span className="text-gray-400 text-sm">€</span>
                        <span className="text-3xl font-bold text-gray-900">{service.price}</span>
                        {service.priceType === 'eenmalig' ? (
                          <span className="text-gray-400 text-xs">eenmalig</span>
                        ) : (
                          <span className="text-gray-400 text-xs">/maand</span>
                        )}
                      </div>
                      {service.setupFee && (
                        <p className="text-primary-600 text-xs font-medium mb-4">
                          + €{service.setupFee} eenmalige opstart
                        </p>
                      )}

                      <ul className="space-y-2 mb-4">
                        {service.features.slice(0, 4).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600 text-xs">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        to={service.link}
                        className="w-full py-2.5 px-4 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        Meer info
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </AutoScrollCarousel>
            {/* Scroll indicator */}
            <div className="flex justify-center gap-1.5 mt-4">
              {extraServices.map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-gray-300" />
              ))}
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {extraServices.map((service, index) => {
              const Icon = service.icon
              const colorClasses = {
                emerald: 'bg-emerald-100 text-emerald-600',
                purple: 'bg-purple-100 text-purple-600',
                sky: 'bg-sky-100 text-sky-600',
              }
              const bgColor = colorClasses[service.color as keyof typeof colorClasses]
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
                >
                  <div className="p-8">
                    <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center mb-6`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-500 text-sm mb-6">{service.description}</p>

                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-gray-400 text-lg">€</span>
                      <span className="text-4xl font-bold text-gray-900">{service.price}</span>
                      {service.priceType === 'eenmalig' ? (
                        <span className="text-gray-400">eenmalig</span>
                      ) : (
                        <span className="text-gray-400">/maand</span>
                      )}
                    </div>
                    {service.setupFee && (
                      <p className="text-primary-600 text-sm font-medium mb-6">
                        + €{service.setupFee} eenmalige opstartkosten
                      </p>
                    )}
                    {!service.setupFee && <p className="text-gray-400 text-sm mb-6">excl. BTW</p>}

                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={service.link}
                      className="w-full py-3 px-6 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors flex items-center justify-center gap-2 group"
                    >
                      Meer informatie
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Veelgestelde vragen
            </h2>
            <p className="text-gray-600 text-lg">
              Alles wat je wilt weten over onze prijzen en pakketten
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{item.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                    openFaq === index ? 'rotate-180' : ''
                  }`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
