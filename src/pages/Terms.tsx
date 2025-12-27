import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useTranslation } from 'react-i18next'

// Terms content per language
const termsContent = {
  nl: {
    backLink: 'Terug naar home',
    title: 'Algemene Voorwaarden',
    lastUpdated: 'Laatst bijgewerkt: 10 december 2025',
    sections: [
      {
        title: 'Artikel 1 – Definities',
        bullets: [
          'Webstability: De eenmanszaak Webstability, ingeschreven bij de KVK onder nummer 91186307, gevestigd in Nederland.',
          'Opdrachtgever: De natuurlijke of rechtspersoon die een overeenkomst aangaat met Webstability.',
          'Diensten: Alle werkzaamheden die Webstability verricht, waaronder webdesign, webdevelopment, hosting en onderhoud.',
          'Website: De door Webstability ontwikkelde of te ontwikkelen website voor de Opdrachtgever.',
          'Abonnement: De maandelijkse dienstverlening inclusief hosting, onderhoud en support.'
        ]
      },
      {
        title: 'Artikel 2 – Toepasselijkheid',
        numbered: [
          'Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, offertes en overeenkomsten tussen Webstability en Opdrachtgever.',
          'Afwijkingen van deze voorwaarden zijn alleen geldig indien schriftelijk overeengekomen.',
          'De toepasselijkheid van eventuele voorwaarden van Opdrachtgever wordt uitdrukkelijk van de hand gewezen.'
        ]
      },
      {
        title: 'Artikel 3 – Offertes en overeenkomsten',
        numbered: [
          'Alle offertes zijn vrijblijvend en geldig gedurende 30 dagen, tenzij anders aangegeven.',
          'Een overeenkomst komt tot stand na schriftelijke acceptatie door Opdrachtgever of na aanvang van de werkzaamheden.',
          'Wijzigingen in de opdracht dienen schriftelijk te worden overeengekomen en kunnen leiden tot prijsaanpassingen.'
        ]
      },
      {
        title: 'Artikel 4 – Prijzen en betaling',
        numbered: [
          'Alle prijzen zijn exclusief BTW, tenzij anders vermeld.',
          'Eenmalige opstartkosten dienen vooraf te worden voldaan.',
          'Abonnementskosten worden maandelijks vooraf gefactureerd.',
          'Betaling dient te geschieden binnen 14 dagen na factuurdatum.',
          'Bij niet-tijdige betaling is Opdrachtgever van rechtswege in verzuim en is Webstability gerechtigd de wettelijke rente en incassokosten in rekening te brengen.',
          'Webstability behoudt zich het recht voor om diensten op te schorten bij betalingsachterstand.'
        ]
      },
      {
        title: 'Artikel 5 – Uitvoering van de opdracht',
        numbered: [
          'Webstability zal de opdracht naar beste inzicht en vermogen uitvoeren.',
          'Opdrachtgever zorgt tijdig voor alle benodigde content (teksten, afbeeldingen, logo\'s).',
          'Indien Opdrachtgever niet tijdig content aanlevert, kan de levertijd worden verlengd.',
          'De geschatte levertijd van 7 werkdagen geldt onder voorbehoud van tijdige aanlevering van content.'
        ]
      },
      {
        title: 'Artikel 6 – Abonnement en opzegging',
        numbered: [
          'Het abonnement heeft een minimale looptijd van 3 maanden.',
          'Na de minimale looptijd is het abonnement maandelijks opzegbaar met een opzegtermijn van 1 maand.',
          'Opzegging dient schriftelijk te geschieden via e-mail naar info@webstability.nl.',
          'Bij opzegging wordt de website offline gehaald, tenzij anders overeengekomen.',
          'Opdrachtgever kan verzoeken om de websitebestanden te ontvangen tegen een eenmalige vergoeding.'
        ]
      },
      {
        title: 'Artikel 7 – Wijzigingen en meerwerk',
        numbered: [
          'Kleine tekstuele aanpassingen zijn inbegrepen conform het gekozen pakket.',
          'Grotere wijzigingen of nieuwe functionaliteiten worden beschouwd als meerwerk.',
          'Meerwerk wordt vooraf besproken en gefactureerd op basis van een uurtarief van €75 excl. BTW.'
        ]
      },
      {
        title: 'Artikel 8 – Intellectueel eigendom',
        numbered: [
          'Het intellectueel eigendom van de website gaat over op Opdrachtgever na volledige betaling.',
          'Webstability behoudt het recht om de website te gebruiken voor eigen promotiedoeleinden, tenzij schriftelijk anders overeengekomen.',
          'Opdrachtgever garandeert dat aangeleverde content geen inbreuk maakt op rechten van derden.'
        ]
      },
      {
        title: 'Artikel 9 – Hosting en beschikbaarheid',
        numbered: [
          'Webstability streeft naar een uptime van 99,9% maar garandeert dit niet.',
          'Gepland onderhoud wordt vooraf aangekondigd.',
          'Webstability is niet aansprakelijk voor schade als gevolg van onbeschikbaarheid van de website.'
        ]
      },
      {
        title: 'Artikel 10 – Aansprakelijkheid',
        numbered: [
          'De aansprakelijkheid van Webstability is beperkt tot het bedrag dat in de betreffende zaak onder de aansprakelijkheidsverzekering wordt uitgekeerd.',
          'Indien geen uitkering plaatsvindt, is de aansprakelijkheid beperkt tot maximaal het factuurbedrag van de laatste 3 maanden.',
          'Webstability is niet aansprakelijk voor indirecte schade, waaronder gevolgschade, gederfde winst of gemiste omzet.',
          'Opdrachtgever vrijwaart Webstability voor aanspraken van derden.'
        ]
      },
      {
        title: 'Artikel 11 – Niet-goed-geld-terug garantie',
        numbered: [
          'Opdrachtgever heeft recht op volledige restitutie van de opstartkosten indien binnen 14 dagen na oplevering schriftelijk wordt aangegeven dat de website niet voldoet.',
          'Deze garantie geldt alleen voor nieuwe klanten en bij eerste oplevering.',
          'Bij gebruikmaking van de garantie worden alle geleverde materialen verwijderd.'
        ]
      },
      {
        title: 'Artikel 12 – Overmacht',
        content: 'In geval van overmacht (waaronder storingen bij derden, internetstoring, stroomuitval, overheidsmaatregelen) is Webstability niet gehouden tot nakoming van enige verplichting.'
      },
      {
        title: 'Artikel 13 – Vertrouwelijkheid',
        content: 'Beide partijen zijn verplicht tot geheimhouding van alle vertrouwelijke informatie die zij in het kader van de overeenkomst van elkaar ontvangen.'
      },
      {
        title: 'Artikel 14 – Toepasselijk recht en geschillen',
        numbered: [
          'Op alle overeenkomsten is Nederlands recht van toepassing.',
          'Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement waar Webstability is gevestigd.',
          'Partijen zullen eerst proberen geschillen in onderling overleg op te lossen.'
        ]
      },
      {
        title: 'Artikel 15 – Contact',
        content: 'Voor vragen over deze algemene voorwaarden kun je contact opnemen via:',
        list: [
          { label: 'E-mail', value: 'info@webstability.nl' },
          { label: 'Telefoon', value: '06 44712573' },
          { label: 'KVK', value: '91186307' },
          { label: 'BTW', value: 'NL004875371B72' }
        ]
      }
    ]
  },
  en: {
    backLink: 'Back to home',
    title: 'Terms & Conditions',
    lastUpdated: 'Last updated: December 10, 2025',
    sections: [
      {
        title: 'Article 1 – Definitions',
        bullets: [
          'Webstability: The sole proprietorship Webstability, registered with the Chamber of Commerce under number 91186307, based in the Netherlands.',
          'Client: The natural or legal person entering into an agreement with Webstability.',
          'Services: All activities performed by Webstability, including web design, web development, hosting and maintenance.',
          'Website: The website developed or to be developed by Webstability for the Client.',
          'Subscription: The monthly service including hosting, maintenance and support.'
        ]
      },
      {
        title: 'Article 2 – Applicability',
        numbered: [
          'These general terms and conditions apply to all offers, quotations and agreements between Webstability and Client.',
          'Deviations from these conditions are only valid if agreed in writing.',
          'The applicability of any conditions of the Client is expressly rejected.'
        ]
      },
      {
        title: 'Article 3 – Quotations and agreements',
        numbered: [
          'All quotations are non-binding and valid for 30 days, unless otherwise stated.',
          'An agreement is concluded after written acceptance by the Client or after commencement of work.',
          'Changes to the assignment must be agreed in writing and may lead to price adjustments.'
        ]
      },
      {
        title: 'Article 4 – Prices and payment',
        numbered: [
          'All prices are exclusive of VAT, unless otherwise stated.',
          'One-time startup costs must be paid in advance.',
          'Subscription costs are invoiced monthly in advance.',
          'Payment must be made within 14 days of the invoice date.',
          'In case of late payment, the Client is in default by operation of law and Webstability is entitled to charge statutory interest and collection costs.',
          'Webstability reserves the right to suspend services in case of payment arrears.'
        ]
      },
      {
        title: 'Article 5 – Execution of the assignment',
        numbered: [
          'Webstability will execute the assignment to the best of its insight and ability.',
          'Client provides all required content (texts, images, logos) in a timely manner.',
          'If Client does not deliver content on time, the delivery time may be extended.',
          'The estimated delivery time of 7 business days is subject to timely delivery of content.'
        ]
      },
      {
        title: 'Article 6 – Subscription and cancellation',
        numbered: [
          'The subscription has a minimum term of 3 months.',
          'After the minimum term, the subscription can be cancelled monthly with a notice period of 1 month.',
          'Cancellation must be done in writing via email to info@webstability.nl.',
          'Upon cancellation, the website will be taken offline, unless otherwise agreed.',
          'Client may request to receive the website files for a one-time fee.'
        ]
      },
      {
        title: 'Article 7 – Changes and additional work',
        numbered: [
          'Small textual changes are included according to the chosen package.',
          'Larger changes or new functionalities are considered additional work.',
          'Additional work is discussed in advance and invoiced at an hourly rate of €75 excl. VAT.'
        ]
      },
      {
        title: 'Article 8 – Intellectual property',
        numbered: [
          'Intellectual property of the website transfers to Client after full payment.',
          'Webstability retains the right to use the website for its own promotional purposes, unless otherwise agreed in writing.',
          'Client guarantees that supplied content does not infringe on third party rights.'
        ]
      },
      {
        title: 'Article 9 – Hosting and availability',
        numbered: [
          'Webstability strives for an uptime of 99.9% but does not guarantee this.',
          'Scheduled maintenance will be announced in advance.',
          'Webstability is not liable for damage resulting from unavailability of the website.'
        ]
      },
      {
        title: 'Article 10 – Liability',
        numbered: [
          'The liability of Webstability is limited to the amount paid out under the liability insurance in the relevant case.',
          'If no payment is made, liability is limited to a maximum of the invoice amount of the last 3 months.',
          'Webstability is not liable for indirect damage, including consequential damage, lost profits or missed turnover.',
          'Client indemnifies Webstability against claims from third parties.'
        ]
      },
      {
        title: 'Article 11 – Money-back guarantee',
        numbered: [
          'Client is entitled to a full refund of startup costs if it is indicated in writing within 14 days of delivery that the website does not meet requirements.',
          'This guarantee only applies to new customers and first delivery.',
          'When using the guarantee, all delivered materials will be removed.'
        ]
      },
      {
        title: 'Article 12 – Force majeure',
        content: 'In case of force majeure (including disruptions at third parties, internet failure, power failure, government measures) Webstability is not obliged to fulfill any obligation.'
      },
      {
        title: 'Article 13 – Confidentiality',
        content: 'Both parties are obliged to keep confidential all confidential information they receive from each other in the context of the agreement.'
      },
      {
        title: 'Article 14 – Applicable law and disputes',
        numbered: [
          'Dutch law applies to all agreements.',
          'Disputes will be submitted to the competent court in the district where Webstability is located.',
          'Parties will first try to resolve disputes through mutual consultation.'
        ]
      },
      {
        title: 'Article 15 – Contact',
        content: 'For questions about these general terms and conditions, you can contact us via:',
        list: [
          { label: 'Email', value: 'info@webstability.nl' },
          { label: 'Phone', value: '+31 6 44712573' },
          { label: 'Chamber of Commerce', value: '91186307' },
          { label: 'VAT', value: 'NL004875371B72' }
        ]
      }
    ]
  }
}

interface TermsSection {
  title: string
  content?: string
  bullets?: string[]
  numbered?: string[]
  list?: { label: string; value: string }[]
}

export default function Terms() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'nl'
  const content = termsContent[lang]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header urgencyBannerVisible={false} />
      
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {content.backLink}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{content.title}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{content.lastUpdated}</p>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              {content.sections.map((section: TermsSection, index: number) => (
                <section key={index} className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h2>
                  
                  {section.content && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{section.content}</p>
                  )}
                  
                  {section.bullets && (
                    <ul className="text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                      {section.bullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                  
                  {section.numbered && (
                    <ol className="text-gray-600 dark:text-gray-300 space-y-2 list-decimal list-inside">
                      {section.numbered.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ol>
                  )}
                  
                  {section.list && (
                    <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                      {section.list.map((item, i) => (
                        <li key={i}>
                          <strong>{item.label}:</strong>{' '}
                          {item.label.toLowerCase().includes('email') ? (
                            <a href={`mailto:${item.value}`} className="text-primary-600 hover:underline">{item.value}</a>
                          ) : (
                            item.value
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
