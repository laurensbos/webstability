import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Voorwaarden() {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Algemene Voorwaarden</h1>
            <p className="text-gray-500 mb-8">Laatst bijgewerkt: 10 december 2025</p>

            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Artikel 1 – Definities</h2>
                <ul className="text-gray-600 space-y-2 list-disc list-inside">
                  <li><strong>Webstability:</strong> De eenmanszaak Webstability, ingeschreven bij de KVK onder nummer 91186307, gevestigd in Nederland.</li>
                  <li><strong>Opdrachtgever:</strong> De natuurlijke of rechtspersoon die een overeenkomst aangaat met Webstability.</li>
                  <li><strong>Diensten:</strong> Alle werkzaamheden die Webstability verricht, waaronder webdesign, webdevelopment, hosting en onderhoud.</li>
                  <li><strong>Website:</strong> De door Webstability ontwikkelde of te ontwikkelen website voor de Opdrachtgever.</li>
                  <li><strong>Abonnement:</strong> De maandelijkse dienstverlening inclusief hosting, onderhoud en support.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Artikel 2 – Toepasselijkheid</h2>
                <ol className="text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, offertes en overeenkomsten tussen Webstability en Opdrachtgever.</li>
                  <li>Afwijkingen van deze voorwaarden zijn alleen geldig indien schriftelijk overeengekomen.</li>
                  <li>De toepasselijkheid van eventuele voorwaarden van Opdrachtgever wordt uitdrukkelijk van de hand gewezen.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Artikel 3 – Offertes en overeenkomsten</h2>
                <ol className="text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Alle offertes zijn vrijblijvend en geldig gedurende 30 dagen, tenzij anders aangegeven.</li>
                  <li>Een overeenkomst komt tot stand na schriftelijke acceptatie door Opdrachtgever of na aanvang van de werkzaamheden.</li>
                  <li>Wijzigingen in de opdracht dienen schriftelijk te worden overeengekomen en kunnen leiden tot prijsaanpassingen.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Artikel 4 – Prijzen en betaling</h2>
                <ol className="text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Alle prijzen zijn exclusief BTW, tenzij anders vermeld.</li>
                  <li>Eenmalige opstartkosten dienen vooraf te worden voldaan.</li>
                  <li>Abonnementskosten worden maandelijks vooraf gefactureerd.</li>
                  <li>Betaling dient te geschieden binnen 14 dagen na factuurdatum.</li>
                  <li>Bij niet-tijdige betaling is Opdrachtgever van rechtswege in verzuim en is Webstability gerechtigd de wettelijke rente en incassokosten in rekening te brengen.</li>
                  <li>Webstability behoudt zich het recht voor om diensten op te schorten bij betalingsachterstand.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Artikel 5 – Uitvoering van de opdracht</h2>
                <ol className="text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Webstability zal de opdracht naar beste inzicht en vermogen uitvoeren.</li>
                  <li>Opdrachtgever zorgt tijdig voor alle benodigde content (teksten, afbeeldingen, logo's).</li>
                  <li>Indien Opdrachtgever niet tijdig content aanlevert, kan de levertijd worden verlengd.</li>
                  <li>De geschatte levertijd van 7 werkdagen geldt onder voorbehoud van tijdige aanlevering van content.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Artikel 6 – Abonnement en opzegging</h2>
                <ol className="text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Het abonnement heeft een minimale looptijd van 3 maanden.</li>
                  <li>Na de minimale looptijd is het abonnement maandelijks opzegbaar met een opzegtermijn van 1 maand.</li>
                  <li>Opzegging dient schriftelijk te geschieden via e-mail naar info@webstability.nl.</li>
                  <li>Bij opzegging wordt de website offline gehaald, tenzij anders overeengekomen.</li>
                  <li>Opdrachtgever kan verzoeken om de websitebestanden te ontvangen tegen een eenmalige vergoeding.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Artikel 7 – Wijzigingen en meerwerk</h2>
                <ol className="text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Kleine tekstuele aanpassingen zijn inbegrepen conform het gekozen pakket.</li>
                  <li>Grotere wijzigingen of nieuwe functionaliteiten worden beschouwd als meerwerk.</li>
                  <li>Meerwerk wordt vooraf besproken en gefactureerd op basis van een uurtarief van €75 excl. BTW.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Artikel 8 – Intellectueel eigendom</h2>
                <ol className="text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Het intellectueel eigendom van de website gaat over op Opdrachtgever na volledige betaling.</li>
                  <li>Webstability behoudt het recht om de website te gebruiken voor eigen promotiedoeleinden, tenzij schriftelijk anders overeengekomen.</li>
                  <li>Opdrachtgever garandeert dat aangeleverde content geen inbreuk maakt op rechten van derden.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Artikel 9 – Hosting en beschikbaarheid</h2>
                <ol className="text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Webstability streeft naar een uptime van 99,9% maar garandeert dit niet.</li>
                  <li>Gepland onderhoud wordt vooraf aangekondigd.</li>
                  <li>Webstability is niet aansprakelijk voor schade als gevolg van onbeschikbaarheid van de website.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Artikel 10 – Aansprakelijkheid</h2>
                <ol className="text-gray-600 space-y-2 list-decimal list-inside">
                  <li>De aansprakelijkheid van Webstability is beperkt tot het bedrag dat in de betreffende zaak onder de aansprakelijkheidsverzekering wordt uitgekeerd.</li>
                  <li>Indien geen uitkering plaatsvindt, is de aansprakelijkheid beperkt tot maximaal het factuurbedrag van de laatste 3 maanden.</li>
                  <li>Webstability is niet aansprakelijk voor indirecte schade, waaronder gevolgschade, gederfde winst of gemiste omzet.</li>
                  <li>Opdrachtgever vrijwaart Webstability voor aanspraken van derden.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Artikel 11 – Niet-goed-geld-terug garantie</h2>
                <ol className="text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Opdrachtgever heeft recht op volledige restitutie van de opstartkosten indien binnen 14 dagen na oplevering schriftelijk wordt aangegeven dat de website niet voldoet.</li>
                  <li>Deze garantie geldt alleen voor nieuwe klanten en bij eerste oplevering.</li>
                  <li>Bij gebruikmaking van de garantie worden alle geleverde materialen verwijderd.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Artikel 12 – Overmacht</h2>
                <p className="text-gray-600 mb-4">
                  In geval van overmacht (waaronder storingen bij derden, internetstoring, stroomuitval, overheidsmaatregelen) is Webstability niet gehouden tot nakoming van enige verplichting.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Artikel 13 – Vertrouwelijkheid</h2>
                <p className="text-gray-600">
                  Beide partijen zijn verplicht tot geheimhouding van alle vertrouwelijke informatie die zij in het kader van de overeenkomst van elkaar ontvangen.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Artikel 14 – Toepasselijk recht en geschillen</h2>
                <ol className="text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Op alle overeenkomsten is Nederlands recht van toepassing.</li>
                  <li>Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement waar Webstability is gevestigd.</li>
                  <li>Partijen zullen eerst proberen geschillen in onderling overleg op te lossen.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Artikel 15 – Contact</h2>
                <p className="text-gray-600 mb-4">
                  Voor vragen over deze algemene voorwaarden kun je contact opnemen via:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li><strong>E-mail:</strong> <a href="mailto:info@webstability.nl" className="text-primary-600 hover:underline">info@webstability.nl</a></li>
                  <li><strong>Telefoon:</strong> 06 44712573</li>
                  <li><strong>KVK:</strong> 91186307</li>
                  <li><strong>BTW:</strong> NL004875371B72</li>
                </ul>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
