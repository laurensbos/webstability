// ===========================================
// ONBOARDING QUESTIONS PER PACKAGE
// Dynamische vragen op basis van gekozen pakket
// ===========================================

import type { PackageType } from './packages'

export type QuestionType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'color' | 'upload' | 'tags'

export interface OnboardingQuestion {
  id: string
  type: QuestionType
  label: string
  description?: string
  placeholder?: string
  options?: { value: string; label: string; description?: string }[]
  required: boolean
  showUploadButton?: boolean  // Toon upload knop naast de vraag
  uploadButtonText?: string   // Tekst voor upload knop
  helpText?: string           // Extra hulptekst
  packages: PackageType[]     // Voor welke pakketten tonen
  conditionalOn?: {           // Alleen tonen als andere vraag bepaalde waarde heeft
    questionId: string
    values: string[]
  }
}

export interface OnboardingSection {
  id: string
  title: string
  description: string
  icon: string
  color: string
  questions: OnboardingQuestion[]
}

// ===========================================
// SECTIE CONFIGURATIE
// ===========================================

export const ONBOARDING_SECTIONS: OnboardingSection[] = [
  // =========================================
  // 1. BEDRIJFSGEGEVENS
  // =========================================
  {
    id: 'bedrijf',
    title: 'Over je bedrijf',
    description: 'Vertel ons wie je bent',
    icon: '🏢',
    color: 'blue',
    questions: [
      {
        id: 'companyName',
        type: 'text',
        label: 'Bedrijfsnaam',
        placeholder: 'Jouw Bedrijf B.V.',
        required: true,
        packages: ['starter', 'professional', 'business', 'webshop']
      },
      {
        id: 'tagline',
        type: 'text',
        label: 'Slogan of tagline',
        description: 'Een korte zin die beschrijft wat je doet',
        placeholder: 'bijv. "De beste kapper van Amsterdam"',
        required: false,
        packages: ['starter', 'professional', 'business', 'webshop']
      },
      {
        id: 'businessDescription',
        type: 'textarea',
        label: 'Beschrijf je bedrijf',
        description: 'Wat doe je en voor wie? (2-3 zinnen)',
        placeholder: 'Wij zijn een...',
        required: true,
        helpText: 'Dit gebruiken we als basis voor je homepage tekst',
        packages: ['starter', 'professional', 'business', 'webshop']
      },
      {
        id: 'targetAudience',
        type: 'textarea',
        label: 'Wie is je doelgroep?',
        description: 'Beschrijf je ideale klant',
        placeholder: 'bijv. "Ondernemers tussen 25-45 jaar die..."',
        required: false,
        packages: ['professional', 'business', 'webshop']
      },
      {
        id: 'uniqueSellingPoints',
        type: 'tags',
        label: 'Wat maakt je uniek?',
        description: 'Noem 3-5 sterke punten (druk Enter per punt)',
        placeholder: 'bijv. "10 jaar ervaring"',
        required: false,
        packages: ['professional', 'business', 'webshop']
      }
    ]
  },

  // =========================================
  // 2. HUISSTIJL & BRANDING
  // =========================================
  {
    id: 'branding',
    title: 'Huisstijl & Design',
    description: 'Hoe moet je website eruitzien?',
    icon: '🎨',
    color: 'purple',
    questions: [
      {
        id: 'hasLogo',
        type: 'radio',
        label: 'Heb je al een logo?',
        required: true,
        options: [
          { value: 'yes', label: 'Ja, ik heb een logo', description: 'Upload hieronder' },
          { value: 'no', label: 'Nee, nog niet', description: 'We kunnen er één voor je maken' },
          { value: 'refresh', label: 'Ja, maar ik wil een nieuw logo', description: 'We ontwerpen een nieuw logo' }
        ],
        packages: ['starter', 'professional', 'business', 'webshop']
      },
      {
        id: 'logoUpload',
        type: 'upload',
        label: 'Upload je logo',
        description: 'PNG of SVG met transparante achtergrond werkt het beste',
        required: false,
        showUploadButton: true,
        uploadButtonText: 'Logo uploaden',
        conditionalOn: { questionId: 'hasLogo', values: ['yes'] },
        packages: ['starter', 'professional', 'business', 'webshop']
      },
      {
        id: 'primaryColor',
        type: 'color',
        label: 'Hoofdkleur',
        description: 'De belangrijkste kleur van je merk',
        required: false,
        helpText: 'Geen idee? We kiezen een passende kleur voor je',
        packages: ['starter', 'professional', 'business', 'webshop']
      },
      {
        id: 'designStyle',
        type: 'radio',
        label: 'Welke stijl past bij je?',
        required: true,
        options: [
          { value: 'modern', label: 'Modern & Minimalistisch', description: 'Strak, veel witruimte' },
          { value: 'professional', label: 'Zakelijk & Professioneel', description: 'Betrouwbaar, corporate' },
          { value: 'creative', label: 'Creatief & Speels', description: 'Kleurrijk, uniek' },
          { value: 'luxury', label: 'Luxe & Elegant', description: 'Premium uitstraling' }
        ],
        packages: ['starter', 'professional', 'business', 'webshop']
      },
      {
        id: 'inspirationUrls',
        type: 'tags',
        label: 'Inspiratie websites',
        description: 'Links naar websites die je mooi vindt',
        placeholder: 'https://...',
        required: false,
        packages: ['professional', 'business', 'webshop']
      }
    ]
  },

  // =========================================
  // 3. CONTENT & MEDIA
  // =========================================
  {
    id: 'content',
    title: 'Content & Media',
    description: 'Teksten en beeldmateriaal',
    icon: '📝',
    color: 'amber',
    questions: [
      {
        id: 'hasTexts',
        type: 'radio',
        label: 'Heb je al teksten voor je website?',
        required: true,
        options: [
          { value: 'yes', label: 'Ja, ik heb teksten klaar', description: 'Upload of plak ze hieronder' },
          { value: 'partial', label: 'Gedeeltelijk', description: 'Ik heb hulp nodig bij sommige pagina\'s' },
          { value: 'no', label: 'Nee, schrijf ze voor mij', description: 'We maken AI-teksten op basis van je input' }
        ],
        packages: ['starter', 'professional', 'business', 'webshop']
      },
      {
        id: 'textsUpload',
        type: 'upload',
        label: 'Upload je teksten',
        description: 'Word document of PDF met je content',
        required: false,
        showUploadButton: true,
        uploadButtonText: 'Teksten uploaden',
        conditionalOn: { questionId: 'hasTexts', values: ['yes', 'partial'] },
        packages: ['starter', 'professional', 'business', 'webshop']
      },
      {
        id: 'hasPhotos',
        type: 'radio',
        label: 'Heb je professionele foto\'s?',
        required: true,
        options: [
          { value: 'yes', label: 'Ja, ik heb goede foto\'s', description: 'Upload ze naar de Drive' },
          { value: 'some', label: 'Een paar, maar niet genoeg' },
          { value: 'no', label: 'Nee, gebruik stockfoto\'s', description: 'We zoeken passende foto\'s' }
        ],
        packages: ['starter', 'professional', 'business', 'webshop']
      },
      {
        id: 'photosUpload',
        type: 'upload',
        label: 'Upload je foto\'s',
        description: 'Hoge resolutie foto\'s (min. 1200px breed)',
        required: false,
        showUploadButton: true,
        uploadButtonText: 'Foto\'s uploaden',
        conditionalOn: { questionId: 'hasPhotos', values: ['yes', 'some'] },
        packages: ['starter', 'professional', 'business', 'webshop']
      },
      // Blog vragen - alleen voor Professional+
      {
        id: 'wantsBlog',
        type: 'radio',
        label: 'Wil je een blog op je website?',
        required: false,
        options: [
          { value: 'yes', label: 'Ja', description: 'We zetten de blog klaar' },
          { value: 'later', label: 'Misschien later' },
          { value: 'no', label: 'Nee' }
        ],
        packages: ['professional', 'business']
      }
    ]
  },

  // =========================================
  // 4. PAGINA'S & FUNCTIONALITEIT
  // =========================================
  {
    id: 'paginas',
    title: 'Pagina\'s & Functies',
    description: 'Wat moet je website kunnen?',
    icon: '📄',
    color: 'emerald',
    questions: [
      {
        id: 'pages',
        type: 'checkbox',
        label: 'Welke pagina\'s wil je?',
        required: true,
        options: [
          { value: 'home', label: 'Homepage' },
          { value: 'about', label: 'Over ons' },
          { value: 'services', label: 'Diensten/Producten' },
          { value: 'portfolio', label: 'Portfolio/Cases' },
          { value: 'contact', label: 'Contact' },
          { value: 'faq', label: 'Veelgestelde vragen' },
          { value: 'team', label: 'Team' },
          { value: 'blog', label: 'Blog' },
          { value: 'pricing', label: 'Prijzen' }
        ],
        packages: ['starter', 'professional', 'business', 'webshop']
      },
      {
        id: 'contactMethods',
        type: 'checkbox',
        label: 'Hoe kunnen klanten contact opnemen?',
        required: true,
        options: [
          { value: 'form', label: 'Contactformulier' },
          { value: 'whatsapp', label: 'WhatsApp knop' },
          { value: 'phone', label: 'Telefoonnummer' },
          { value: 'email', label: 'E-mail link' },
          { value: 'booking', label: 'Online afspraken', description: 'Alleen Business pakket' }
        ],
        packages: ['starter', 'professional', 'business', 'webshop']
      },
      // Meertalig - alleen Business
      {
        id: 'languages',
        type: 'checkbox',
        label: 'In welke talen moet je website?',
        required: false,
        options: [
          { value: 'nl', label: 'Nederlands' },
          { value: 'en', label: 'Engels' },
          { value: 'de', label: 'Duits' },
          { value: 'fr', label: 'Frans' }
        ],
        packages: ['business']
      },
      // Integraties - alleen Business
      {
        id: 'integrations',
        type: 'checkbox',
        label: 'Welke integraties wil je?',
        required: false,
        options: [
          { value: 'analytics', label: 'Google Analytics' },
          { value: 'newsletter', label: 'Nieuwsbrief (Mailchimp/ActiveCampaign)' },
          { value: 'crm', label: 'CRM koppeling' },
          { value: 'booking', label: 'Boekingssysteem' },
          { value: 'reviews', label: 'Reviews (Google/Trustpilot)' }
        ],
        packages: ['business']
      }
    ]
  },

  // =========================================
  // 5. WEBSHOP SPECIFIEK
  // =========================================
  {
    id: 'webshop',
    title: 'Webshop Details',
    description: 'Specifiek voor je webshop',
    icon: '🛒',
    color: 'green',
    questions: [
      {
        id: 'productCount',
        type: 'radio',
        label: 'Hoeveel producten heb je?',
        required: true,
        options: [
          { value: '1-10', label: '1-10 producten' },
          { value: '11-50', label: '11-50 producten' },
          { value: '51-100', label: '51-100 producten' },
          { value: '100+', label: 'Meer dan 100' }
        ],
        packages: ['webshop']
      },
      {
        id: 'productCatalog',
        type: 'upload',
        label: 'Upload je productcatalogus',
        description: 'Excel/CSV met productnamen, prijzen, beschrijvingen',
        required: false,
        showUploadButton: true,
        uploadButtonText: 'Catalogus uploaden',
        helpText: 'Download onze template voor het juiste formaat',
        packages: ['webshop']
      },
      {
        id: 'paymentMethods',
        type: 'checkbox',
        label: 'Welke betaalmethodes?',
        required: true,
        options: [
          { value: 'ideal', label: 'iDEAL' },
          { value: 'creditcard', label: 'Creditcard' },
          { value: 'paypal', label: 'PayPal' },
          { value: 'klarna', label: 'Klarna (achteraf betalen)' },
          { value: 'bancontact', label: 'Bancontact (België)' }
        ],
        packages: ['webshop']
      },
      {
        id: 'shippingOptions',
        type: 'checkbox',
        label: 'Verzendopties',
        required: true,
        options: [
          { value: 'postnl', label: 'PostNL' },
          { value: 'dhl', label: 'DHL' },
          { value: 'pickup', label: 'Afhalen' },
          { value: 'free', label: 'Gratis verzending (vanaf bedrag)' }
        ],
        packages: ['webshop']
      },
      {
        id: 'vatNumber',
        type: 'text',
        label: 'BTW-nummer',
        placeholder: 'NL123456789B01',
        required: true,
        packages: ['webshop']
      },
      {
        id: 'kvkNumber',
        type: 'text',
        label: 'KVK-nummer',
        placeholder: '12345678',
        required: true,
        packages: ['webshop']
      }
    ]
  },

  // =========================================
  // 6. EXTRA WENSEN
  // =========================================
  {
    id: 'extra',
    title: 'Extra wensen',
    description: 'Nog iets dat we moeten weten?',
    icon: '✨',
    color: 'pink',
    questions: [
      {
        id: 'deadline',
        type: 'radio',
        label: 'Wanneer moet je website live zijn?',
        required: false,
        options: [
          { value: 'asap', label: 'Zo snel mogelijk' },
          { value: '2weeks', label: 'Binnen 2 weken' },
          { value: 'month', label: 'Binnen een maand' },
          { value: 'flexible', label: 'Geen haast' }
        ],
        packages: ['starter', 'professional', 'business', 'webshop']
      },
      {
        id: 'additionalNotes',
        type: 'textarea',
        label: 'Overige opmerkingen',
        description: 'Is er nog iets dat we moeten weten?',
        placeholder: 'Speciale wensen, vragen, opmerkingen...',
        required: false,
        packages: ['starter', 'professional', 'business', 'webshop']
      }
    ]
  }
]

// ===========================================
// HELPER FUNCTIES
// ===========================================

/**
 * Get sections filtered for a specific package
 */
export function getSectionsForPackage(packageType: PackageType): OnboardingSection[] {
  return ONBOARDING_SECTIONS
    .map(section => ({
      ...section,
      questions: section.questions.filter(q => q.packages.includes(packageType))
    }))
    .filter(section => section.questions.length > 0)
}

/**
 * Get total question count for a package
 */
export function getQuestionCount(packageType: PackageType): number {
  return getSectionsForPackage(packageType)
    .reduce((total, section) => total + section.questions.length, 0)
}

/**
 * Get required questions for a package
 */
export function getRequiredQuestions(packageType: PackageType): OnboardingQuestion[] {
  return getSectionsForPackage(packageType)
    .flatMap(section => section.questions)
    .filter(q => q.required)
}

/**
 * Check if all required questions are answered
 */
export function isOnboardingComplete(
  packageType: PackageType, 
  answers: Record<string, any>
): boolean {
  const required = getRequiredQuestions(packageType)
  return required.every(q => {
    const answer = answers[q.id]
    if (Array.isArray(answer)) return answer.length > 0
    return answer !== undefined && answer !== '' && answer !== null
  })
}

/**
 * Calculate completion percentage
 */
export function getCompletionPercentage(
  packageType: PackageType,
  answers: Record<string, any>
): number {
  const sections = getSectionsForPackage(packageType)
  const allQuestions = sections.flatMap(s => s.questions)
  const answeredCount = allQuestions.filter(q => {
    const answer = answers[q.id]
    if (Array.isArray(answer)) return answer.length > 0
    return answer !== undefined && answer !== '' && answer !== null
  }).length
  
  return Math.round((answeredCount / allQuestions.length) * 100)
}
