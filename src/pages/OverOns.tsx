import { motion } from 'framer-motion'
import { 
  Heart, 
  Target, 
  Users, 
  Zap,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const values = [
  {
    icon: Heart,
    title: 'Eerlijk & Transparant',
    description: 'Geen verborgen kosten, geen kleine lettertjes. Wat je ziet is wat je krijgt.',
  },
  {
    icon: Zap,
    title: 'Snel & Efficiënt',
    description: 'Binnen 7 dagen een professionele website, zonder gedoe.',
  },
  {
    icon: Users,
    title: 'Persoonlijke Aanpak',
    description: 'Je bent geen nummer. We kennen je naam en onthouden je wensen.',
  },
  {
    icon: Target,
    title: 'Resultaatgericht',
    description: 'Websites die niet alleen mooi zijn, maar ook klanten opleveren.',
  },
]

const milestones = [
  { year: '2023', title: 'Webstability opgericht', description: 'Gestart vanuit de overtuiging dat websites simpeler kunnen.' },
  { year: '2024', title: '100+ websites live', description: 'Eerste honderd tevreden klanten bereikt.' },
  { year: '2025', title: 'Team uitgebreid', description: 'Meer capaciteit om nog meer ondernemers te helpen.' },
]

export default function OverOns() {
  return (
    <div className="min-h-screen bg-white">
      <Header urgencyBannerVisible={false} />
      
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-4"
            >
              Over Webstability
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
            >
              Websites bouwen voor{' '}
              <span className="text-primary-600">ondernemers</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 leading-relaxed"
            >
              We geloven dat elke ondernemer een professionele online aanwezigheid verdient. 
              Zonder gedoe, zonder technische kennis, zonder zorgen.
            </motion.p>
          </div>
        </section>

        {/* Story */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Waarom we Webstability startten
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Als ondernemer weet je hoe frustrerend het kan zijn om een website te regelen. 
                    Je wilt gewoon een mooie site die werkt, zonder maandenlange trajecten, 
                    technische gesprekken of verborgen kosten.
                  </p>
                  <p>
                    Daarom startten we Webstability. We zagen dat traditionele webdesign bureaus 
                    te complex, te duur en te traag waren voor de gemiddelde MKB'er of ZZP'er.
                  </p>
                  <p>
                    Onze oplossing? Een simpel abonnementsmodel. Eén vast bedrag per maand, 
                    alles inbegrepen. Hosting, updates, support, domein – je hoeft nergens meer 
                    over na te denken.
                  </p>
                  <p className="font-medium text-gray-900">
                    Zo kun jij focussen op wat je het beste doet: ondernemen.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Placeholder for founder image */}
                <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-primary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="w-16 h-16 text-primary-600" />
                    </div>
                    <p className="text-primary-600 font-medium">Het Webstability Team</p>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/10 rounded-2xl -z-10" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-500/5 rounded-2xl -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Onze waarden</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Dit zijn de principes waar we niet van afwijken. Ze zitten in alles wat we doen.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Onze reis</h2>
            </motion.div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold">{milestone.year}</span>
                    </div>
                  </div>
                  <div className="pt-3">
                    <h3 className="font-semibold text-gray-900 mb-1">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What we promise */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Onze belofte aan jou</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  'Binnen 7 dagen live',
                  'Geen verborgen kosten',
                  'Altijd bereikbaar via WhatsApp',
                  'Onbeperkte kleine aanpassingen',
                  '99.9% uptime garantie',
                  'Geen lange contracten',
                  'Gratis domein inbegrepen',
                  '14 dagen niet goed, geld terug',
                ].map((promise, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{promise}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Zullen we kennismaken?
              </h2>
              <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                We beantwoorden graag al je vragen. Geen verkooppraatjes, gewoon een eerlijk gesprek.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/start"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary-500/25"
                >
                  Start je project
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Neem contact op
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
                <a href="mailto:hallo@webstability.nl" className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                  <Mail className="w-4 h-4" />
                  hallo@webstability.nl
                </a>
                <a href="tel:+31644712573" className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                  <Phone className="w-4 h-4" />
                  06 44712573
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
