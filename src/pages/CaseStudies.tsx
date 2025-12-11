import { motion } from 'framer-motion'
import { TrendingUp, Clock, ArrowRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const caseStudies = [
  {
    id: 'lissers-tuinontwerp',
    company: 'Lissers Tuinontwerp',
    industry: 'Hoveniersbedrijf',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop',
    logo: '🌿',
    challenge: 'Weinig online aanvragen, afhankelijk van mond-tot-mondreclame.',
    solution: 'Professionele website met portfolio, contactformulier en SEO-optimalisatie.',
    results: [
      { metric: '+156%', label: 'Meer aanvragen' },
      { metric: '€45K', label: 'Extra omzet/jaar' },
      { metric: '#1', label: 'Google lokaal' },
    ],
    quote: 'Binnen 3 maanden stond ik bovenaan in Google. De telefoon stond niet meer stil!',
    author: 'Peter Lissers',
    duration: '2 weken oplevering',
  },
  {
    id: 'studio-van-elk',
    company: 'Studio van Elk',
    industry: 'Interieurontwerp',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=500&fit=crop',
    logo: '🎨',
    challenge: 'Portfolio zat op Instagram, klanten konden projecten niet goed bekijken.',
    solution: 'Strakke portfolio website met projectgalerijen en contactmogelijkheid.',
    results: [
      { metric: '+89%', label: 'Meer leads' },
      { metric: '4.2 min', label: 'Gem. sessieduur' },
      { metric: '23', label: 'Nieuwe projecten' },
    ],
    quote: 'Eindelijk een plek waar ik mijn werk professioneel kan laten zien aan potentiële klanten.',
    author: 'Emma van Elk',
    duration: '10 dagen oplevering',
  },
  {
    id: 'bakkerij-de-ochtend',
    company: 'Bakkerij De Ochtend',
    industry: 'Bakkerij',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=500&fit=crop',
    logo: '🥐',
    challenge: 'Geen online zichtbaarheid, klanten wisten niet welke producten beschikbaar waren.',
    solution: 'Website met productcatalogus, openingstijden en online bestelformulier.',
    results: [
      { metric: '+340%', label: 'Website bezoekers' },
      { metric: '+25%', label: 'Omzet stijging' },
      { metric: '50+', label: 'Online bestellingen/week' },
    ],
    quote: 'Klanten bestellen nu online voor ophaal. Vooral de taarten gaan als warme broodjes!',
    author: 'Johan de Bakker',
    duration: '1 week oplevering',
  },
  {
    id: 'bouwbedrijf-kuiper',
    company: 'Bouwbedrijf Kuiper',
    industry: 'Bouw & Renovatie',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=500&fit=crop',
    logo: '🏗️',
    challenge: 'Verouderde website gaf geen professionele indruk, veel klanten haakten af.',
    solution: 'Moderne website met voor/na projecten, reviews en offerteaanvraag.',
    results: [
      { metric: '+67%', label: 'Meer offertes' },
      { metric: '€120K', label: 'Nieuwe projecten' },
      { metric: '-40%', label: 'Bounce rate' },
    ],
    quote: 'Onze nieuwe website straalt eindelijk de kwaliteit uit die we leveren.',
    author: 'Mark Kuiper',
    duration: '2 weken oplevering',
  },
]

export default function CaseStudies() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                <TrendingUp className="w-4 h-4" />
                Succesverhalen
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Echte resultaten van{' '}
                <span className="text-primary-600">echte ondernemers</span>
              </h1>
              <p className="text-xl text-gray-600">
                Ontdek hoe andere ondernemers hun bedrijf lieten groeien met een professionele website. 
                Geen vage beloftes, maar concrete resultaten.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12"
            >
              {[
                { value: '100+', label: 'Websites gebouwd' },
                { value: '€2M+', label: 'Extra omzet klanten' },
                { value: '4.9/5', label: 'Gemiddelde beoordeling' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-24">
              {caseStudies.map((study, index) => (
                <motion.article
                  key={study.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Image */}
                  <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src={study.image}
                        alt={study.company}
                        className="w-full h-[400px] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{study.logo}</span>
                          <div>
                            <h3 className="text-white font-bold text-xl">{study.company}</h3>
                            <p className="text-white/80 text-sm">{study.industry}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Results cards */}
                    <div className="absolute -bottom-8 left-8 right-8 grid grid-cols-3 gap-3">
                      {study.results.map((result, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center"
                        >
                          <div className="text-xl font-bold text-primary-600">{result.metric}</div>
                          <div className="text-xs text-gray-500">{result.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`${index % 2 === 1 ? 'lg:order-1' : ''} pt-8 lg:pt-0`}>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Clock className="w-4 h-4" />
                      {study.duration}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                      {study.company}
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">De uitdaging</h4>
                        <p className="text-gray-600">{study.challenge}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Onze oplossing</h4>
                        <p className="text-gray-600">{study.solution}</p>
                      </div>

                      {/* Quote */}
                      <blockquote className="bg-primary-50 rounded-xl p-6 border-l-4 border-primary-500">
                        <p className="text-gray-700 italic mb-3">"{study.quote}"</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="text-gray-600 text-sm">— {study.author}</span>
                        </div>
                      </blockquote>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Jouw succesverhaal begint hier
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Word de volgende ondernemer die groeit met een professionele website. 
              Start vandaag nog en zie het verschil binnen weken.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/start"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
              >
                Start je project
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors"
              >
                Vrijblijvend advies
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
