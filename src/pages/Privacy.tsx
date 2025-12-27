import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useTranslation } from 'react-i18next'

// Privacy content per language
const privacyContent = {
  nl: {
    backLink: 'Terug naar home',
    title: 'Privacybeleid',
    lastUpdated: 'Laatst bijgewerkt: 10 december 2025',
    sections: [
      {
        title: '1. Wie zijn wij?',
        content: 'Webstability is een webdevelopmentbedrijf gevestigd in Nederland.',
        list: [
          { label: 'Bedrijfsnaam', value: 'Webstability' },
          { label: 'KVK-nummer', value: '91186307' },
          { label: 'BTW-nummer', value: 'NL004875371B72' },
          { label: 'E-mail', value: 'info@webstability.nl' },
          { label: 'Telefoon', value: '06 44712573' }
        ]
      },
      {
        title: '2. Welke gegevens verzamelen wij?',
        content: 'Wij verzamelen alleen gegevens die nodig zijn om onze diensten te leveren:',
        bullets: [
          'Contactgegevens: Naam, e-mailadres, telefoonnummer',
          'Bedrijfsgegevens: Bedrijfsnaam, KVK-nummer (indien van toepassing)',
          'Projectgegevens: Informatie die je deelt via ons intakeformulier',
          'Communicatie: E-mails en berichten die je ons stuurt',
          'Websitegebruik: Geanonimiseerde analytische gegevens'
        ]
      },
      {
        title: '3. Waarvoor gebruiken wij deze gegevens?',
        bullets: [
          'Het leveren van onze webdevelopment diensten',
          'Communicatie over je project',
          'Facturatie en administratie',
          'Het verbeteren van onze website en dienstverlening',
          'Het nakomen van wettelijke verplichtingen'
        ]
      },
      {
        title: '4. Delen van gegevens',
        content: 'Wij verkopen je gegevens nooit aan derden. Wij delen gegevens alleen met:',
        bullets: [
          'Hostingproviders: Voor het hosten van websites',
          'Betalingsverwerkers: Voor het verwerken van betalingen',
          'Boekhoudkundige diensten: Voor onze administratie',
          'Overheidsinstanties: Indien wettelijk verplicht'
        ]
      },
      {
        title: '5. Bewaartermijnen',
        content: 'Wij bewaren je gegevens niet langer dan noodzakelijk:',
        bullets: [
          'Klantgegevens: Gedurende de samenwerking + 7 jaar (fiscale bewaarplicht)',
          'Offertes: 1 jaar na versturen',
          'Website analytics: Maximaal 26 maanden'
        ]
      },
      {
        title: '6. Jouw rechten',
        content: 'Onder de AVG heb je de volgende rechten:',
        bullets: [
          'Inzage: Je mag opvragen welke gegevens wij van je hebben',
          'Correctie: Je mag onjuiste gegevens laten aanpassen',
          'Verwijdering: Je mag verzoeken om je gegevens te verwijderen',
          'Bezwaar: Je mag bezwaar maken tegen verwerking van je gegevens',
          'Overdracht: Je mag je gegevens opvragen in een gangbaar formaat'
        ],
        footer: 'Neem contact met ons op via info@webstability.nl om gebruik te maken van deze rechten.'
      },
      {
        title: '7. Cookies',
        content: 'Onze website maakt gebruik van:',
        bullets: [
          'Functionele cookies: Noodzakelijk voor de werking van de website',
          'Analytische cookies: Om websitegebruik te analyseren (geanonimiseerd)'
        ],
        footer: 'Wij gebruiken geen tracking cookies voor advertentiedoeleinden.'
      },
      {
        title: '8. Beveiliging',
        content: 'Wij nemen passende technische en organisatorische maatregelen om je gegevens te beschermen tegen ongeautoriseerde toegang, verlies of diefstal. Onze website maakt gebruik van SSL-encryptie.'
      },
      {
        title: '9. Klachten',
        content: 'Heb je een klacht over hoe wij met je gegevens omgaan? Neem dan contact met ons op. Je hebt ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens.'
      },
      {
        title: '10. Wijzigingen',
        content: 'Wij kunnen dit privacybeleid wijzigen. De meest actuele versie is altijd beschikbaar op onze website. Bij belangrijke wijzigingen informeren wij je via e-mail.'
      }
    ]
  },
  en: {
    backLink: 'Back to home',
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: December 10, 2025',
    sections: [
      {
        title: '1. Who are we?',
        content: 'Webstability is a web development company based in the Netherlands.',
        list: [
          { label: 'Company name', value: 'Webstability' },
          { label: 'Chamber of Commerce', value: '91186307' },
          { label: 'VAT number', value: 'NL004875371B72' },
          { label: 'Email', value: 'info@webstability.nl' },
          { label: 'Phone', value: '+31 6 44712573' }
        ]
      },
      {
        title: '2. What data do we collect?',
        content: 'We only collect data necessary to provide our services:',
        bullets: [
          'Contact details: Name, email address, phone number',
          'Business information: Company name, Chamber of Commerce number (if applicable)',
          'Project data: Information you share via our intake form',
          'Communication: Emails and messages you send us',
          'Website usage: Anonymized analytical data'
        ]
      },
      {
        title: '3. How do we use this data?',
        bullets: [
          'Providing our web development services',
          'Communication about your project',
          'Invoicing and administration',
          'Improving our website and services',
          'Complying with legal obligations'
        ]
      },
      {
        title: '4. Sharing data',
        content: 'We never sell your data to third parties. We only share data with:',
        bullets: [
          'Hosting providers: For website hosting',
          'Payment processors: For processing payments',
          'Accounting services: For our administration',
          'Government authorities: If legally required'
        ]
      },
      {
        title: '5. Retention periods',
        content: 'We do not keep your data longer than necessary:',
        bullets: [
          'Customer data: During collaboration + 7 years (fiscal retention requirement)',
          'Quotes: 1 year after sending',
          'Website analytics: Maximum 26 months'
        ]
      },
      {
        title: '6. Your rights',
        content: 'Under GDPR you have the following rights:',
        bullets: [
          'Access: You may request what data we have about you',
          'Correction: You may have incorrect data corrected',
          'Deletion: You may request deletion of your data',
          'Objection: You may object to processing of your data',
          'Portability: You may request your data in a common format'
        ],
        footer: 'Contact us at info@webstability.nl to exercise these rights.'
      },
      {
        title: '7. Cookies',
        content: 'Our website uses:',
        bullets: [
          'Functional cookies: Necessary for website functionality',
          'Analytical cookies: To analyze website usage (anonymized)'
        ],
        footer: 'We do not use tracking cookies for advertising purposes.'
      },
      {
        title: '8. Security',
        content: 'We take appropriate technical and organizational measures to protect your data against unauthorized access, loss or theft. Our website uses SSL encryption.'
      },
      {
        title: '9. Complaints',
        content: 'Do you have a complaint about how we handle your data? Please contact us. You also have the right to file a complaint with the Dutch Data Protection Authority.'
      },
      {
        title: '10. Changes',
        content: 'We may change this privacy policy. The most current version is always available on our website. For important changes, we will inform you by email.'
      }
    ]
  }
}

export default function Privacy() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'nl'
  const content = privacyContent[lang]

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
            <p className="text-gray-500 mb-8">{content.lastUpdated}</p>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              {content.sections.map((section, index) => (
                <section key={index} className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h2>
                  {section.content && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{section.content}</p>
                  )}
                  {section.list && (
                    <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                      {section.list.map((item, i) => (
                        <li key={i}><strong>{item.label}:</strong> {item.value}</li>
                      ))}
                    </ul>
                  )}
                  {section.bullets && (
                    <ul className="text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                      {section.bullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                  {section.footer && (
                    <p className="text-gray-600 dark:text-gray-300 mt-4">{section.footer}</p>
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
