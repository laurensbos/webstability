import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  Image, 
  MessageSquare, 
  CheckCircle,
  Circle,
  Send,
  Building2,
  Palette,
  Globe,
  ArrowRight,
  Phone
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface ChecklistItem {
  id: string
  icon: React.ElementType
  title: string
  description: string
  details: string[]
  required: boolean
}

const checklistItems: ChecklistItem[] = [
  {
    id: 'business',
    icon: Building2,
    title: 'Bedrijfsinformatie',
    description: 'Alle gegevens over je bedrijf',
    details: [
      'Officiële bedrijfsnaam',
      'KvK-nummer',
      'BTW-nummer (indien van toepassing)',
      'Vestigingsadres',
      'Contactgegevens (telefoon, email)',
    ],
    required: true,
  },
  {
    id: 'branding',
    icon: Palette,
    title: 'Logo & Huisstijl',
    description: 'Visuele identiteit van je merk',
    details: [
      'Logo in hoge resolutie (PNG of SVG)',
      'Logo variaties (wit, zwart, kleur)',
      'Merk kleuren (hex codes indien bekend)',
      'Lettertype (indien specifiek)',
    ],
    required: true,
  },
  {
    id: 'content',
    icon: MessageSquare,
    title: 'Teksten & Content',
    description: 'Alle tekst voor je website',
    details: [
      'Over ons / bedrijfsomschrijving',
      'Diensten of producten beschrijving',
      'Unique selling points (USPs)',
      'Contactpagina tekst',
      'Veelgestelde vragen (FAQ) indien gewenst',
    ],
    required: true,
  },
  {
    id: 'photos',
    icon: Image,
    title: "Foto's & Beeldmateriaal",
    description: 'Visuele content voor je website',
    details: [
      'Teamfoto\'s of portretfoto\'s',
      'Productfoto\'s (indien van toepassing)',
      'Sfeerbeelden van je werk/locatie',
      'Minimaal 5-10 foto\'s aanbevolen',
      'Hoge resolutie (minimaal 1920px breed)',
    ],
    required: false,
  },
  {
    id: 'domain',
    icon: Globe,
    title: 'Domein & Technisch',
    description: 'Website adres en toegang',
    details: [
      'Gewenste domeinnaam (bijv. jouwbedrijf.nl)',
      'Of: bestaand domein + inloggegevens',
      'Toegang tot huidige hosting (indien migratie)',
      'Bestaande email adressen behouden?',
    ],
    required: true,
  },
  {
    id: 'extras',
    icon: FileText,
    title: 'Extra Wensen',
    description: 'Aanvullende functionaliteit',
    details: [
      'Social media links',
      'Google Maps locatie',
      'Contactformulier velden',
      'Integraties (boekingssysteem, etc.)',
      'Specifieke pagina\'s of functies',
    ],
    required: false,
  },
]

export default function KlantOnboarding() {
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const toggleItem = (id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const progress = Math.round((checkedItems.length / checklistItems.length) * 100)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-4">
              Welkom bij Webstability
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Onboarding Checklist 🎉
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Om snel van start te gaan met jouw website, hebben we onderstaande informatie van je nodig. 
              Verzamel alles op je gemak!
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Je voortgang</span>
              <span className="text-sm font-semibold text-primary-600">{progress}% compleet</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
              />
            </div>
          </motion.div>

          {/* Checklist Items */}
          <div className="space-y-4 mb-12">
            {checklistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`bg-white rounded-2xl border-2 transition-all ${
                  checkedItems.includes(item.id) 
                    ? 'border-green-500 shadow-lg shadow-green-500/10' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleItem(item.id)
                      }}
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        checkedItems.includes(item.id)
                          ? 'bg-green-500 text-white'
                          : 'border-2 border-gray-300 hover:border-primary-500'
                      }`}
                    >
                      {checkedItems.includes(item.id) ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5 text-transparent" />
                      )}
                    </button>

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      checkedItems.includes(item.id)
                        ? 'bg-green-100'
                        : 'bg-primary-100'
                    }`}>
                      <item.icon className={`w-6 h-6 ${
                        checkedItems.includes(item.id)
                          ? 'text-green-600'
                          : 'text-primary-600'
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold text-lg ${
                          checkedItems.includes(item.id)
                            ? 'text-green-700'
                            : 'text-gray-900'
                        }`}>
                          {item.title}
                        </h3>
                        {item.required ? (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                            Verplicht
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                            Optioneel
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>

                    {/* Expand indicator */}
                    <ArrowRight className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                      expandedItem === item.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6 pt-0"
                  >
                    <div className="ml-11 pl-8 border-l-2 border-gray-100">
                      <p className="text-sm font-medium text-gray-700 mb-3">Wat we nodig hebben:</p>
                      <ul className="space-y-2">
                        {item.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 text-white mb-8"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Materialen Versturen</h2>
                <p className="text-primary-100">
                  Heb je alles verzameld? Stuur je bestanden naar ons via WeTransfer, 
                  Google Drive, of mail ze direct naar ons.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="mailto:content@webstability.nl?subject=Onboarding materialen - [Jouw bedrijfsnaam]"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
              >
                <Send className="w-5 h-5" />
                Mail materialen
              </a>
              <a
                href="https://wa.me/31644712573?text=Hoi!%20Ik%20heb%20mijn%20onboarding%20materialen%20klaar!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors"
              >
                <Phone className="w-5 h-5" />
                WhatsApp ons
              </a>
            </div>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-6"
          >
            <h3 className="font-semibold text-amber-900 mb-3">💡 Tips voor snelle levering</h3>
            <ul className="space-y-2 text-amber-800 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>Lever foto's in hoge resolutie aan (geen screenshots)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>Stuur je logo als PNG of SVG bestand, niet in een Word document</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>Hoe completer je aanlevering, hoe sneller we je website kunnen opleveren!</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
