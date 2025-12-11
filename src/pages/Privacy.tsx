import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Header urgencyBannerVisible={false} />
      
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacybeleid</h1>
            <p className="text-gray-500 mb-8">Laatst bijgewerkt: 10 december 2025</p>

            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Wie zijn wij?</h2>
                <p className="text-gray-600 mb-4">
                  Webstability is een webdevelopmentbedrijf gevestigd in Nederland.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li><strong>Bedrijfsnaam:</strong> Webstability</li>
                  <li><strong>KVK-nummer:</strong> 91186307</li>
                  <li><strong>BTW-nummer:</strong> NL004875371B72</li>
                  <li><strong>E-mail:</strong> info@webstability.nl</li>
                  <li><strong>Telefoon:</strong> 06 44712573</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Welke gegevens verzamelen wij?</h2>
                <p className="text-gray-600 mb-4">
                  Wij verzamelen alleen gegevens die nodig zijn om onze diensten te leveren:
                </p>
                <ul className="text-gray-600 space-y-2 list-disc list-inside">
                  <li><strong>Contactgegevens:</strong> Naam, e-mailadres, telefoonnummer</li>
                  <li><strong>Bedrijfsgegevens:</strong> Bedrijfsnaam, KVK-nummer (indien van toepassing)</li>
                  <li><strong>Projectgegevens:</strong> Informatie die je deelt via ons intakeformulier</li>
                  <li><strong>Communicatie:</strong> E-mails en berichten die je ons stuurt</li>
                  <li><strong>Websitegebruik:</strong> Geanonimiseerde analytische gegevens</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Waarvoor gebruiken wij deze gegevens?</h2>
                <ul className="text-gray-600 space-y-2 list-disc list-inside">
                  <li>Het leveren van onze webdevelopment diensten</li>
                  <li>Communicatie over je project</li>
                  <li>Facturatie en administratie</li>
                  <li>Het verbeteren van onze website en dienstverlening</li>
                  <li>Het nakomen van wettelijke verplichtingen</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Delen van gegevens</h2>
                <p className="text-gray-600 mb-4">
                  Wij verkopen je gegevens nooit aan derden. Wij delen gegevens alleen met:
                </p>
                <ul className="text-gray-600 space-y-2 list-disc list-inside">
                  <li><strong>Hostingproviders:</strong> Voor het hosten van websites</li>
                  <li><strong>Betalingsverwerkers:</strong> Voor het verwerken van betalingen</li>
                  <li><strong>Boekhoudkundige diensten:</strong> Voor onze administratie</li>
                  <li><strong>Overheidsinstanties:</strong> Indien wettelijk verplicht</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Bewaartermijnen</h2>
                <p className="text-gray-600 mb-4">
                  Wij bewaren je gegevens niet langer dan noodzakelijk:
                </p>
                <ul className="text-gray-600 space-y-2 list-disc list-inside">
                  <li><strong>Klantgegevens:</strong> Gedurende de samenwerking + 7 jaar (fiscale bewaarplicht)</li>
                  <li><strong>Offertes:</strong> 1 jaar na versturen</li>
                  <li><strong>Website analytics:</strong> Maximaal 26 maanden</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Jouw rechten</h2>
                <p className="text-gray-600 mb-4">
                  Onder de AVG heb je de volgende rechten:
                </p>
                <ul className="text-gray-600 space-y-2 list-disc list-inside">
                  <li><strong>Inzage:</strong> Je mag opvragen welke gegevens wij van je hebben</li>
                  <li><strong>Correctie:</strong> Je mag onjuiste gegevens laten aanpassen</li>
                  <li><strong>Verwijdering:</strong> Je mag verzoeken om je gegevens te verwijderen</li>
                  <li><strong>Bezwaar:</strong> Je mag bezwaar maken tegen verwerking van je gegevens</li>
                  <li><strong>Overdracht:</strong> Je mag je gegevens opvragen in een gangbaar formaat</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Neem contact met ons op via <a href="mailto:info@webstability.nl" className="text-primary-600 hover:underline">info@webstability.nl</a> om gebruik te maken van deze rechten.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Cookies</h2>
                <p className="text-gray-600 mb-4">
                  Onze website maakt gebruik van:
                </p>
                <ul className="text-gray-600 space-y-2 list-disc list-inside">
                  <li><strong>Functionele cookies:</strong> Noodzakelijk voor de werking van de website</li>
                  <li><strong>Analytische cookies:</strong> Om websitegebruik te analyseren (geanonimiseerd)</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Wij gebruiken geen tracking cookies voor advertentiedoeleinden.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Beveiliging</h2>
                <p className="text-gray-600">
                  Wij nemen passende technische en organisatorische maatregelen om je gegevens te beschermen tegen ongeautoriseerde toegang, verlies of diefstal. Onze website maakt gebruik van SSL-encryptie.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Klachten</h2>
                <p className="text-gray-600">
                  Heb je een klacht over hoe wij met je gegevens omgaan? Neem dan contact met ons op. Je hebt ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens: <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">autoriteitpersoonsgegevens.nl</a>
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Wijzigingen</h2>
                <p className="text-gray-600">
                  Wij kunnen dit privacybeleid wijzigen. De meest actuele versie is altijd beschikbaar op onze website. Bij belangrijke wijzigingen informeren wij je via e-mail.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
