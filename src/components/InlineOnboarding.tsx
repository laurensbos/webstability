import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronRight,
  CheckCircle2, 
  Upload,
  ExternalLink,
  Loader2,
  Check,
  HelpCircle,
  Sparkles,
  Building2,
  Palette,
  FileText,
  LayoutGrid,
  ShoppingCart,
  Phone,
  Target,
  ArrowUpRight,
  Image,
  Camera,
  Share2,
  Rocket,
  Trophy,
  type LucideIcon
} from 'lucide-react'
import { 
  getSectionsForPackage,
  getCompletionPercentage,
  type OnboardingQuestion,
  type OnboardingSection 
} from '../config/onboardingQuestions'
import type { PackageType } from '../config/packages'
import { PACKAGES } from '../config/packages'
import StockPhotoSuggestions from './StockPhotoSuggestions'
import UpgradeModal from './UpgradeModal'
import { useHapticFeedback } from '../hooks/useHapticFeedback'

// Icon mapping for sections
const SECTION_ICONS: Record<string, LucideIcon> = {
  Building2,
  Palette,
  FileText,
  LayoutGrid,
  ShoppingCart,
  Phone,
  Target,
  Sparkles
}

// ===========================================
// TRANSLATION HELPERS
// ===========================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createTranslationHelpers = (t: any) => ({
  getQuestionText: (questionId: string, field: 'label' | 'description' | 'placeholder' | 'helpText' | 'uploadButtonText', fallback?: string) => {
    const key = `onboarding.questions.${questionId}.${field}`
    const translated = t(key, { defaultValue: '' })
    return translated && translated !== key ? translated : fallback || ''
  },
  getOptionText: (questionId: string, optionValue: string, field: 'label' | 'description', fallback?: string) => {
    const key = `onboarding.questions.${questionId}.options.${optionValue}.${field}`
    const translated = t(key, { defaultValue: '' })
    return translated && translated !== key ? translated : fallback || ''
  },
  getSectionText: (sectionId: string, field: 'title' | 'description', fallback: string) => {
    const key = `onboarding.sections.${sectionId}.${field}`
    const translated = t(key, { defaultValue: '' })
    return translated && translated !== key ? translated : fallback
  }
})

// ===========================================
// QUESTION COMPONENTS
// ===========================================

interface QuestionProps {
  question: OnboardingQuestion
  value: any
  onChange: (value: any) => void
  onAddExtra?: (key: string, value: any) => void
  answers?: Record<string, any>
  disabled?: boolean
  darkMode?: boolean
  googleDriveUrl?: string
}

// Text Input
function TextQuestion({ question, value, onChange, disabled, darkMode }: QuestionProps) {
  return (
    <div>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={question.placeholder}
        className={`w-full px-4 py-3 rounded-xl border transition-colors ${
          darkMode 
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-primary-500' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-500'
        } focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
      />
    </div>
  )
}

// Textarea
function TextareaQuestion({ question, value, onChange, disabled, darkMode }: QuestionProps) {
  return (
    <div>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={question.placeholder}
        rows={3}
        className={`w-full px-4 py-3 rounded-xl border transition-colors resize-none ${
          darkMode 
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-primary-500' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-500'
        } focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
      />
    </div>
  )
}

// Radio Group
function RadioQuestion({ question, value, onChange, onAddExtra, answers, disabled, darkMode }: QuestionProps) {
  const { t } = useTranslation()
  const { getOptionText } = createTranslationHelpers(t)
  
  // Check if this is the logo question and user wants a new logo
  const isLogoQuestion = question.id === 'hasLogo'
  const wantsNewLogo = isLogoQuestion && (value === 'no' || value === 'refresh')
  
  // Check if this is the main CTA question and user wants e-commerce
  const isMainCTAQuestion = question.id === 'mainCTA'
  const wantsEcommerce = isMainCTAQuestion && value === 'buy'
  
  // Check if this is the photos question - show drone upsell
  const isPhotosQuestion = question.id === 'hasPhotos'
  const showDroneUpsell = isPhotosQuestion && value
  const droneAlreadyAdded = answers?.wantsDronePhotography === true
  
  return (
    <div className="space-y-2">
      {question.options?.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          disabled={disabled}
          className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
            value === option.value
              ? darkMode
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-primary-500 bg-primary-50'
              : darkMode
                ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
            value === option.value
              ? 'border-primary-500 bg-primary-500'
              : darkMode ? 'border-gray-600' : 'border-gray-300'
          }`}>
            {value === option.value && <Check className="w-3 h-3 text-white" />}
          </div>
          <div className="flex-1">
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {getOptionText(question.id, option.value, 'label', option.label)}
            </span>
            {option.description && (
              <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {getOptionText(question.id, option.value, 'description', option.description)}
              </p>
            )}
          </div>
        </button>
      ))}
      
      {/* Logo design upsell */}
      {wantsNewLogo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl border ${
            darkMode 
              ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30' 
              : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
              <Sparkles className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('onboarding.logoDesignTitle', { defaultValue: 'Professioneel logo nodig?' })}
              </h4>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('onboarding.logoDesignDescription', { defaultValue: 'Onze designers maken een uniek logo dat perfect past bij jouw merk en uitstraling.' })}
              </p>
              <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
              }`}>
                {t('onboarding.logoDesignIncluded', { defaultValue: '✓ Inbegrepen bij je pakket' })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* E-commerce / Webshop upsell */}
      {wantsEcommerce && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl border ${
            darkMode 
              ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30' 
              : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'
            }`}>
              <ShoppingCart className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('onboarding.webshopUpsellTitle', { defaultValue: '🛒 Webshop nodig?' })}
              </h4>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('onboarding.webshopUpsellDescription', { defaultValue: 'Voor e-commerce heb je een webshop pakket nodig met productbeheer, winkelwagen, betaalsysteem en voorraadbeheer.' })}
              </p>
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <Check className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {t('onboarding.webshopFeature1', { defaultValue: 'Onbeperkt producten toevoegen' })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {t('onboarding.webshopFeature2', { defaultValue: 'iDEAL, creditcard & meer betaalmethodes' })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {t('onboarding.webshopFeature3', { defaultValue: 'Automatische verzendlabels & tracking' })}
                  </span>
                </div>
              </div>
              <div className={`mt-3 p-3 rounded-lg ${darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('onboarding.webshopStartingAt', { defaultValue: 'Webshop pakket vanaf' })}
                  </span>
                  <span className={`text-lg font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    €299/maand
                  </span>
                </div>
              </div>
              <p className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {t('onboarding.webshopContactUs', { defaultValue: 'Neem contact op via de chat om te upgraden naar een webshop pakket.' })}
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Drone Photography upsell */}
      {showDroneUpsell && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl border ${
            darkMode 
              ? 'bg-gradient-to-r from-sky-500/10 to-cyan-500/10 border-sky-500/30' 
              : 'bg-gradient-to-r from-sky-50 to-cyan-50 border-sky-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              darkMode ? 'bg-sky-500/20' : 'bg-sky-100'
            }`}>
              <Camera className={`w-5 h-5 ${darkMode ? 'text-sky-400' : 'text-sky-600'}`} />
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('onboarding.droneUpsellTitle', { defaultValue: 'Professionele drone fotografie' })}
              </h4>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('onboarding.droneUpsellDescription', { defaultValue: 'Maak indruk met spectaculaire luchtfoto\'s van je bedrijfspand, locatie of evenement.' })}
              </p>
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <Check className={`w-4 h-4 ${darkMode ? 'text-sky-400' : 'text-sky-600'}`} />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {t('onboarding.droneFeature1', { defaultValue: 'Professionele 4K beelden' })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className={`w-4 h-4 ${darkMode ? 'text-sky-400' : 'text-sky-600'}`} />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {t('onboarding.droneFeature2', { defaultValue: 'Gecertificeerde dronepiloot' })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className={`w-4 h-4 ${darkMode ? 'text-sky-400' : 'text-sky-600'}`} />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {t('onboarding.droneFeature3', { defaultValue: 'Direct te gebruiken op je website' })}
                  </span>
                </div>
              </div>
              
              {!droneAlreadyAdded ? (
                <>
                  <div className={`mt-3 p-3 rounded-lg ${darkMode ? 'bg-sky-500/10' : 'bg-sky-50'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`text-sm line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          €349
                        </span>
                        <span className={`text-sm ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {t('onboarding.droneWebsiteDiscount', { defaultValue: 'Website klant korting' })}
                        </span>
                      </div>
                      <span className={`text-lg font-bold ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>
                        €249
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onAddExtra) {
                        onAddExtra('wantsDronePhotography', true)
                        onAddExtra('dronePrice', 249)
                      }
                    }}
                    className={`mt-3 w-full py-2.5 px-4 rounded-lg font-medium transition-all ${
                      darkMode
                        ? 'bg-sky-500 hover:bg-sky-400 text-white'
                        : 'bg-sky-600 hover:bg-sky-500 text-white'
                    }`}
                  >
                    {t('onboarding.droneAddToOrder', { defaultValue: 'Ja, voeg toe aan mijn bestelling' })}
                  </button>
                </>
              ) : (
                <>
                  <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-green-500/20' : 'bg-green-50'}`}>
                    <Check className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                      {t('onboarding.droneAdded', { defaultValue: 'Toegevoegd aan je bestelling (+€249)' })}
                    </span>
                  </div>
                  
                  {/* Drone questions when added */}
                  <div className={`mt-4 pt-4 border-t space-y-4 ${darkMode ? 'border-sky-500/30' : 'border-sky-200'}`}>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('onboarding.droneLocationLabel', { defaultValue: 'Waar moet de drone opname plaatsvinden?' })}
                      </label>
                      <input
                        type="text"
                        value={answers?.droneLocation || ''}
                        onChange={(e) => onAddExtra?.('droneLocation', e.target.value)}
                        placeholder={t('onboarding.droneLocationPlaceholder', { defaultValue: 'Adres of locatiebeschrijving' })}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('onboarding.droneTypeLabel', { defaultValue: 'Wat wil je laten filmen?' })}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'building', label: t('onboarding.droneTypeBuilding', { defaultValue: 'Bedrijfspand' }) },
                          { value: 'property', label: t('onboarding.droneTypeProperty', { defaultValue: 'Terrein/grond' }) },
                          { value: 'event', label: t('onboarding.droneTypeEvent', { defaultValue: 'Evenement' }) },
                          { value: 'other', label: t('onboarding.droneTypeOther', { defaultValue: 'Anders' }) }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => onAddExtra?.('droneType', option.value)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              answers?.droneType === option.value
                                ? darkMode
                                  ? 'bg-sky-500 text-white'
                                  : 'bg-sky-600 text-white'
                                : darkMode
                                  ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('onboarding.dronePreferredDateLabel', { defaultValue: 'Voorkeursdatum (optioneel)' })}
                      </label>
                      <input
                        type="date"
                        value={answers?.dronePreferredDate || ''}
                        onChange={(e) => onAddExtra?.('dronePreferredDate', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('onboarding.droneNotesLabel', { defaultValue: 'Opmerkingen of wensen' })}
                      </label>
                      <textarea
                        value={answers?.droneNotes || ''}
                        onChange={(e) => onAddExtra?.('droneNotes', e.target.value)}
                        rows={2}
                        placeholder={t('onboarding.droneNotesPlaceholder', { defaultValue: 'Bijv. bepaalde hoeken, tijdstip, etc.' })}
                        className={`w-full px-3 py-2 rounded-lg border text-sm resize-none ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                        }`}
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (onAddExtra) {
                          onAddExtra('wantsDronePhotography', false)
                          onAddExtra('dronePrice', null)
                          onAddExtra('droneLocation', null)
                          onAddExtra('droneType', null)
                          onAddExtra('dronePreferredDate', null)
                          onAddExtra('droneNotes', null)
                        }
                      }}
                      className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'}`}
                    >
                      {t('onboarding.droneRemove', { defaultValue: 'Verwijderen uit bestelling' })}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Pages Selector with package limits
interface PagesSelectorProps extends QuestionProps {
  packageType?: PackageType
  onUpgradeClick?: () => void
}

function PagesSelector({ question, value, onChange, disabled, darkMode, packageType = 'starter', onUpgradeClick }: PagesSelectorProps) {
  const { t } = useTranslation()
  const { getOptionText } = createTranslationHelpers(t)
  const [customPageInput, setCustomPageInput] = useState('')
  const [showLegalUpsell, setShowLegalUpsell] = useState(false)
  
  // Separate standard pages from custom pages
  const allSelected = Array.isArray(value) ? value : []
  const standardOptions = question.options?.map(o => o.value) || []
  const selectedStandard = allSelected.filter(v => standardOptions.includes(v) && !v.startsWith('custom:'))
  const customPages = allSelected.filter(v => v.startsWith('custom:'))
  const selectedValues = [...selectedStandard, ...customPages]
  
  const packageLimit = question.packageLimits?.[packageType] || 5
  const isAtLimit = selectedValues.length >= packageLimit
  
  // Package hierarchy for checking requirements
  const packageOrder: PackageType[] = ['starter', 'professional', 'business', 'webshop']
  const currentPackageIndex = packageOrder.indexOf(packageType)
  
  const isOptionLocked = (option: { value: string; label: string; description?: string; requiresPackage?: PackageType }) => {
    if (!option.requiresPackage) return false
    const requiredIndex = packageOrder.indexOf(option.requiresPackage)
    // Webshop should also unlock business features
    if (packageType === 'webshop' && option.requiresPackage === 'business') return false
    return currentPackageIndex < requiredIndex
  }
  
  const toggleValue = (optionValue: string) => {
    if (selectedValues.includes(optionValue)) {
      onChange(selectedValues.filter((v: string) => v !== optionValue))
    } else if (!isAtLimit) {
      onChange([...selectedValues, optionValue])
    }
  }
  
  // Add custom page
  const addCustomPage = () => {
    if (customPageInput.trim() && !isAtLimit) {
      const customValue = `custom:${customPageInput.trim()}`
      if (!selectedValues.includes(customValue)) {
        onChange([...selectedValues, customValue])
        setCustomPageInput('')
      }
    }
  }
  
  // Check if legal documents are selected
  const hasPrivacy = selectedValues.includes('privacy')
  const hasTerms = selectedValues.includes('terms')
  const needsLegalDocs = !hasPrivacy || !hasTerms
  
  // Show upsell when legal pages are selected
  useEffect(() => {
    if (hasPrivacy || hasTerms) {
      setShowLegalUpsell(true)
    }
  }, [hasPrivacy, hasTerms])

  // Get next package for upgrade suggestion
  const getNextPackage = (): PackageType | null => {
    const order: PackageType[] = ['starter', 'professional', 'business']
    const currentIndex = order.indexOf(packageType)
    if (currentIndex < order.length - 1) {
      return order[currentIndex + 1]
    }
    return null
  }

  const nextPkg = getNextPackage()
  const nextPkgInfo = nextPkg ? PACKAGES[nextPkg] : null
  
  // Filter out the old "custom" option (described in opmerkingen)
  const filteredOptions = question.options?.filter(o => o.value !== 'custom') || []

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className={`flex items-center justify-between p-3 rounded-xl ${
        darkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="flex items-center gap-2">
          <LayoutGrid className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('onboarding.pagesSelected', { count: selectedValues.length, limit: packageLimit })}
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          isAtLimit 
            ? 'bg-amber-500/20 text-amber-500' 
            : 'bg-green-500/20 text-green-500'
        }`}>
          {isAtLimit ? t('onboarding.limitReached') : t('onboarding.remaining', { count: packageLimit - selectedValues.length })}
        </span>
      </div>
      
      {/* Page options - use filteredOptions to exclude old custom option */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {filteredOptions.map((option) => {
          const isLocked = isOptionLocked(option)
          const isSelected = selectedValues.includes(option.value) && !isLocked
          const isDisabled = disabled || isLocked || (!isSelected && isAtLimit)
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                if (isLocked && onUpgradeClick) {
                  onUpgradeClick()
                } else if (!isLocked) {
                  toggleValue(option.value)
                }
              }}
              disabled={disabled}
              className={`relative flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${
                isLocked
                  ? darkMode
                    ? 'border-gray-700 bg-gray-800/30 opacity-60'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                  : isSelected
                    ? darkMode
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-primary-500 bg-primary-50'
                    : isDisabled
                      ? darkMode
                        ? 'border-gray-700 bg-gray-800/30 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : darkMode
                        ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                isSelected
                  ? 'border-primary-500 bg-primary-500'
                  : darkMode ? 'border-gray-600' : 'border-gray-300'
              }`}>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1">
                <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {getOptionText(question.id, option.value, 'label', option.label)}
                </span>
                {option.description && (
                  <p className={`text-xs ${isLocked ? 'text-amber-500' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {getOptionText(question.id, option.value, 'description', option.description)}
                  </p>
                )}
              </div>
              {isLocked && (
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
              )}
            </button>
          )
        })}
        
        {/* Custom pages */}
        {customPages.map((customValue) => {
          const pageName = customValue.replace('custom:', '')
          return (
            <div
              key={customValue}
              className={`relative flex items-center gap-2 p-3 rounded-xl border transition-all ${
                darkMode
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-primary-500 bg-primary-50'
              }`}
            >
              <div className="w-5 h-5 rounded-md border-2 border-primary-500 bg-primary-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className={`flex-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {pageName}
              </span>
              <button
                type="button"
                onClick={() => toggleValue(customValue)}
                className="text-red-500 hover:text-red-400 text-lg leading-none"
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
      
      {/* Add custom page input */}
      {!isAtLimit && (
        <div className="flex gap-2">
          <input
            type="text"
            value={customPageInput}
            onChange={(e) => setCustomPageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomPage())}
            placeholder={t('onboarding.customPagePlaceholder', { defaultValue: 'Eigen pagina toevoegen...' })}
            className={`flex-1 px-4 py-2.5 rounded-xl border transition-colors ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
          />
          <button
            type="button"
            onClick={addCustomPage}
            disabled={!customPageInput.trim()}
            className={`px-4 py-2.5 rounded-xl font-medium transition flex items-center gap-1 ${
              customPageInput.trim()
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : darkMode
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            + {t('onboarding.addPage', { defaultValue: 'Toevoegen' })}
          </button>
        </div>
      )}
      
      {/* Legal documents upsell */}
      {showLegalUpsell && needsLegalDocs && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            darkMode 
              ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30' 
              : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              darkMode ? 'bg-amber-500/20' : 'bg-amber-100'
            }`}>
              <FileText className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('onboarding.legalDocsTitle', { defaultValue: 'Juridische documenten nodig?' })}
              </h4>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('onboarding.legalDocsDescription', { defaultValue: 'Algemene voorwaarden & privacybeleid moet je zelf aanleveren. Wij kunnen deze voor je bedrijf genereren voor €49,- (beide documenten).' })}
              </p>
              <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
              }`}>
                <Sparkles className="w-4 h-4" />
                €49,- {t('onboarding.forBothDocs', { defaultValue: 'voor beide documenten' })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Upgrade prompt when at limit */}
      {isAtLimit && nextPkgInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            darkMode 
              ? 'bg-gradient-to-r from-primary-500/10 to-purple-500/10 border-primary-500/30' 
              : 'bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              darkMode ? 'bg-primary-500/20' : 'bg-primary-100'
            }`}>
              <ArrowUpRight className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('onboarding.needMorePages')}
              </h4>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('onboarding.upgradeToPackage', { package: nextPkgInfo.name, limit: question.packageLimits?.[nextPkg!] })}
              </p>
              {onUpgradeClick && (
                <button
                  onClick={onUpgradeClick}
                  className="mt-2 text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  {t('onboarding.viewUpgradeOptions')}
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Checkbox Group
interface CheckboxQuestionProps extends QuestionProps {
  packageType?: PackageType
  onUpgradeClick?: () => void
  onAddExtra?: (key: string, value: any) => void
  allAnswers?: Record<string, any>
}

function CheckboxQuestion({ question, value, onChange, disabled, darkMode, packageType = 'starter', onUpgradeClick, onAddExtra, allAnswers }: CheckboxQuestionProps) {
  const { t } = useTranslation()
  const { getOptionText } = createTranslationHelpers(t)
  const selectedValues = Array.isArray(value) ? value : []
  
  // Check for social media upsell
  const isSocialMediaQuestion = question.id === 'socialMedia'
  const hasSocialMediaSelected = isSocialMediaQuestion && selectedValues.length > 0
  const socialMediaSetupAdded = allAnswers?.wantsSocialMediaSetup === true
  
  // Package hierarchy for checking requirements
  const packageOrder: PackageType[] = ['starter', 'professional', 'business', 'webshop']
  const currentPackageIndex = packageOrder.indexOf(packageType)
  
  const toggleValue = (optionValue: string) => {
    if (selectedValues.includes(optionValue)) {
      onChange(selectedValues.filter(v => v !== optionValue))
    } else {
      onChange([...selectedValues, optionValue])
    }
  }
  
  const isOptionLocked = (option: { value: string; label: string; description?: string; requiresPackage?: PackageType }) => {
    if (!option.requiresPackage) return false
    const requiredIndex = packageOrder.indexOf(option.requiresPackage)
    // Business is at index 2, webshop is at index 3 - webshop should also unlock business features
    if (packageType === 'webshop' && option.requiresPackage === 'business') return false
    return currentPackageIndex < requiredIndex
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {question.options?.map((option) => {
        const isLocked = isOptionLocked(option)
        const isSelected = selectedValues.includes(option.value) && !isLocked
        
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              if (isLocked && onUpgradeClick) {
                onUpgradeClick()
              } else if (!isLocked) {
                toggleValue(option.value)
              }
            }}
            disabled={disabled}
            className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
              isLocked
                ? darkMode
                  ? 'border-gray-700 bg-gray-800/30 opacity-60'
                  : 'border-gray-200 bg-gray-50 opacity-60'
                : isSelected
                  ? darkMode
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-primary-500 bg-primary-50'
                  : darkMode
                    ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
              isSelected
                ? 'border-primary-500 bg-primary-500'
                : darkMode ? 'border-gray-600' : 'border-gray-300'
            }`}>
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>
            <div className="flex-1">
              <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {getOptionText(question.id, option.value, 'label', option.label)}
              </span>
              {option.description && (
                <p className={`text-xs mt-0.5 ${
                  isLocked 
                    ? 'text-amber-500' 
                    : darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {getOptionText(question.id, option.value, 'description', option.description)}
                </p>
              )}
            </div>
            {isLocked && (
              <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
            )}
          </button>
        )
      })}
      
      {/* Social Media Setup Upsell */}
      {hasSocialMediaSelected && (
        <div className="col-span-1 sm:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-xl border ${
              darkMode 
                ? 'bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-pink-500/30' 
                : 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                darkMode ? 'bg-pink-500/20' : 'bg-pink-100'
              }`}>
                <Share2 className={`w-5 h-5 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('onboarding.socialSetupTitle', { defaultValue: 'Professionele social media setup' })}
                </h4>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('onboarding.socialSetupDescription', { defaultValue: 'Laat ons je social media profielen optimaliseren met consistente branding.' })}
                </p>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className={`w-4 h-4 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {t('onboarding.socialFeature1', { defaultValue: 'Profielfoto & banner in huisstijl' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className={`w-4 h-4 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {t('onboarding.socialFeature2', { defaultValue: 'Bio & beschrijvingen geoptimaliseerd' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className={`w-4 h-4 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {t('onboarding.socialFeature3', { defaultValue: '5 startposts templates' })}
                    </span>
                  </div>
                </div>
                
                {!socialMediaSetupAdded ? (
                  <>
                    <div className={`mt-3 p-3 rounded-lg ${darkMode ? 'bg-pink-500/10' : 'bg-pink-50'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`text-sm line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            €149
                          </span>
                          <span className={`text-sm ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {t('onboarding.socialWebsiteDiscount', { defaultValue: 'Website klant korting' })}
                          </span>
                        </div>
                        <span className={`text-lg font-bold ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                          €99
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onAddExtra) {
                          onAddExtra('wantsSocialMediaSetup', true)
                          onAddExtra('socialMediaSetupPrice', 99)
                        }
                      }}
                      className={`mt-3 w-full py-2.5 px-4 rounded-lg font-medium transition-all ${
                        darkMode
                          ? 'bg-pink-500 hover:bg-pink-400 text-white'
                          : 'bg-pink-600 hover:bg-pink-500 text-white'
                      }`}
                    >
                      {t('onboarding.socialAddToOrder', { defaultValue: 'Ja, voeg toe aan mijn bestelling' })}
                    </button>
                  </>
                ) : (
                  <>
                    <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-green-500/20' : 'bg-green-50'}`}>
                      <Check className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                        {t('onboarding.socialAdded', { defaultValue: 'Toegevoegd aan je bestelling (+€99)' })}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onAddExtra) {
                          onAddExtra('wantsSocialMediaSetup', false)
                          onAddExtra('socialMediaSetupPrice', null)
                        }
                      }}
                      className={`mt-2 text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'}`}
                    >
                      {t('onboarding.socialRemove', { defaultValue: 'Verwijderen uit bestelling' })}
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Single Color Picker (legacy)
function ColorQuestion({ value, onChange, darkMode }: Pick<QuestionProps, 'value' | 'onChange' | 'darkMode'>) {
  const { t } = useTranslation()
  const presetColors = [
    { value: '#10B981', labelKey: 'green' },
    { value: '#3B82F6', labelKey: 'blue' },
    { value: '#8B5CF6', labelKey: 'purple' },
    { value: '#F59E0B', labelKey: 'orange' },
    { value: '#EF4444', labelKey: 'red' },
    { value: '#EC4899', labelKey: 'pink' },
    { value: '#14B8A6', labelKey: 'teal' },
    { value: '#1F2937', labelKey: 'dark' },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {presetColors.map((color) => (
        <button
          key={color.value}
          type="button"
          onClick={() => onChange(color.value)}
          className={`w-12 h-12 rounded-xl border-2 transition-all ${
            value === color.value
              ? 'border-white ring-2 ring-primary-500 scale-110'
              : darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}
          style={{ backgroundColor: color.value }}
          title={t(`inlineOnboardingNew.colors.${color.labelKey}`)}
        />
      ))}
      <label className={`w-12 h-12 rounded-xl border-2 cursor-pointer flex items-center justify-center ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'
      }`}>
        <input
          type="color"
          value={value || '#10B981'}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        <span className="text-xs font-medium">+</span>
      </label>
    </div>
  )
}

// Multi Color Picker (max 4 colors)
function MultiColorQuestion({ value, onChange, darkMode }: Pick<QuestionProps, 'value' | 'onChange' | 'darkMode'>) {
  const { t } = useTranslation()
  const selectedColors: string[] = Array.isArray(value) ? value : []
  const MAX_COLORS = 4

  const presetColors = [
    { value: '#10B981', labelKey: 'green' },
    { value: '#3B82F6', labelKey: 'blue' },
    { value: '#8B5CF6', labelKey: 'purple' },
    { value: '#F59E0B', labelKey: 'orange' },
    { value: '#EF4444', labelKey: 'red' },
    { value: '#EC4899', labelKey: 'pink' },
    { value: '#14B8A6', labelKey: 'teal' },
    { value: '#6366F1', labelKey: 'indigo' },
    { value: '#F97316', labelKey: 'orange' },
    { value: '#84CC16', labelKey: 'lime' },
    { value: '#06B6D4', labelKey: 'cyan' },
    { value: '#1F2937', labelKey: 'darkGrey' },
    { value: '#111827', labelKey: 'black' },
    { value: '#F3F4F6', labelKey: 'lightGrey' },
  ]

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      onChange(selectedColors.filter(c => c !== color))
    } else if (selectedColors.length < MAX_COLORS) {
      onChange([...selectedColors, color])
    }
  }

  const addCustomColor = (color: string) => {
    if (!selectedColors.includes(color) && selectedColors.length < MAX_COLORS) {
      onChange([...selectedColors, color])
    }
  }

  return (
    <div className="space-y-4">
      {/* Selected colors preview */}
      {selectedColors.length > 0 && (
        <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('inlineOnboardingNew.selected', { count: selectedColors.length, max: MAX_COLORS })}
            </span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs text-red-500 hover:text-red-400"
            >
              {t('inlineOnboardingNew.clearAll')}
            </button>
          </div>
          <div className="flex gap-2">
            {selectedColors.map((color, index) => (
              <div key={index} className="relative group">
                <div
                  className="w-12 h-12 rounded-xl border-2 border-white shadow-lg"
                  style={{ backgroundColor: color }}
                />
                <button
                  type="button"
                  onClick={() => toggleColor(color)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                {index === 0 && (
                  <span className="absolute -bottom-5 left-0 right-0 text-center text-[10px] text-gray-500">
                    Hoofd
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Color palette */}
      <div className="flex flex-wrap gap-2">
        {presetColors.map((color) => {
          const isSelected = selectedColors.includes(color.value)
          const isDisabled = !isSelected && selectedColors.length >= MAX_COLORS
          
          return (
            <button
              key={color.value}
              type="button"
              onClick={() => toggleColor(color.value)}
              disabled={isDisabled}
              className={`w-10 h-10 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-white ring-2 ring-primary-500 scale-110'
                  : isDisabled
                    ? 'opacity-30 cursor-not-allowed border-transparent'
                    : darkMode 
                      ? 'border-gray-700 hover:scale-105' 
                      : 'border-gray-200 hover:scale-105'
              }`}
              style={{ backgroundColor: color.value }}
              title={t(`inlineOnboardingNew.colors.${color.labelKey}`)}
            />
          )
        })}
        
        {/* Custom color picker */}
        {selectedColors.length < MAX_COLORS && (
          <label className={`w-10 h-10 rounded-lg border-2 cursor-pointer flex items-center justify-center ${
            darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'
          }`} title={t('inlineOnboardingNew.chooseCustomColor')}>
            <input
              type="color"
              onChange={(e) => addCustomColor(e.target.value)}
              className="sr-only"
            />
            <span className="text-lg">+</span>
          </label>
        )}
      </div>

      {/* Designer note */}
      <p className={`text-xs italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        💡 Dit zijn voorkeuren. Onze designers gebruiken hun expertise om de perfecte kleurcombinatie te creëren die past bij je merk en doelgroep.
      </p>
    </div>
  )
}

// Font Selector with live preview
function FontQuestion({ value, onChange, darkMode }: Pick<QuestionProps, 'value' | 'onChange' | 'darkMode'>) {
  const { t } = useTranslation()
  const fonts = [
    { value: 'inter', label: 'Inter', styleKey: 'inter', family: "'Inter', sans-serif", googleFont: 'Inter:wght@400;600;700' },
    { value: 'poppins', label: 'Poppins', styleKey: 'poppins', family: "'Poppins', sans-serif", googleFont: 'Poppins:wght@400;600;700' },
    { value: 'playfair', label: 'Playfair Display', styleKey: 'playfair', family: "'Playfair Display', serif", googleFont: 'Playfair+Display:wght@400;600;700' },
    { value: 'montserrat', label: 'Montserrat', styleKey: 'montserrat', family: "'Montserrat', sans-serif", googleFont: 'Montserrat:wght@400;600;700' },
    { value: 'roboto', label: 'Roboto', styleKey: 'roboto', family: "'Roboto', sans-serif", googleFont: 'Roboto:wght@400;500;700' },
    { value: 'opensans', label: 'Open Sans', styleKey: 'opensans', family: "'Open Sans', sans-serif", googleFont: 'Open+Sans:wght@400;600;700' },
    { value: 'lato', label: 'Lato', styleKey: 'lato', family: "'Lato', sans-serif", googleFont: 'Lato:wght@400;700' },
    { value: 'raleway', label: 'Raleway', styleKey: 'raleway', family: "'Raleway', sans-serif", googleFont: 'Raleway:wght@400;600;700' },
    { value: 'merriweather', label: 'Merriweather', styleKey: 'merriweather', family: "'Merriweather', serif", googleFont: 'Merriweather:wght@400;700' },
    { value: 'nunito', label: 'Nunito', styleKey: 'nunito', family: "'Nunito', sans-serif", googleFont: 'Nunito:wght@400;600;700' },
    { value: 'sourcesans', label: 'Source Sans 3', styleKey: 'sourcesans', family: "'Source Sans 3', sans-serif", googleFont: 'Source+Sans+3:wght@400;600;700' },
    { value: 'dmserif', label: 'DM Serif Display', styleKey: 'dmserif', family: "'DM Serif Display', serif", googleFont: 'DM+Serif+Display:wght@400' },
  ]

  // Load Google Fonts
  useEffect(() => {
    const fontFamilies = fonts.map(f => f.googleFont).join('&family=')
    const link = document.createElement('link')
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`
    link.rel = 'stylesheet'
    link.id = 'google-fonts-onboarding'
    
    // Only add if not already present
    if (!document.getElementById('google-fonts-onboarding')) {
      document.head.appendChild(link)
    }
    
    return () => {
      // Cleanup on unmount
      const existingLink = document.getElementById('google-fonts-onboarding')
      if (existingLink) {
        document.head.removeChild(existingLink)
      }
    }
  }, [])

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {fonts.map((font) => (
          <button
            key={font.value}
            type="button"
            onClick={() => onChange(font.value)}
            className={`p-3 rounded-xl border-2 text-left transition-all ${
              value === font.value
                ? darkMode
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-primary-500 bg-primary-50'
                : darkMode
                  ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <span 
              className={`text-lg block mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}
              style={{ fontFamily: font.family }}
            >
              {font.label}
            </span>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t(`inlineOnboardingNew.fonts.${font.styleKey}.style`)}
            </span>
          </button>
        ))}
      </div>

      {/* Preview */}
      {value && (
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Preview:</span>
          <p 
            className={`text-2xl mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}
            style={{ fontFamily: fonts.find(f => f.value === value)?.family }}
          >
            Jouw website, jouw stijl
          </p>
          <p 
            className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            style={{ fontFamily: fonts.find(f => f.value === value)?.family }}
          >
            Dit is hoe je tekst eruit zou kunnen zien met dit lettertype.
          </p>
        </div>
      )}

      {/* Designer note */}
      <p className={`text-xs italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        💡 Dit is een voorkeur. Onze designers kunnen een alternatief adviseren als dat beter past bij je website.
      </p>
    </div>
  )
}

// Tags Input
function TagsQuestion({ question, value, onChange, disabled, darkMode }: QuestionProps) {
  const [input, setInput] = useState('')
  const tags = Array.isArray(value) ? value : []

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      onChange([...tags, input.trim()])
      setInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(t => t !== tagToRemove))
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          disabled={disabled}
          placeholder={question.placeholder}
          className={`flex-1 px-4 py-2 rounded-xl border transition-colors ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          } focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
        />
        <button
          type="button"
          onClick={addTag}
          disabled={disabled || !input.trim()}
          className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 transition-colors"
        >
          +
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// Upload Button (links to Google Drive)
function UploadQuestion({ question, googleDriveUrl, darkMode }: QuestionProps) {
  const { t } = useTranslation()
  if (!googleDriveUrl) return null
  
  return (
    <a
      href={googleDriveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition active:scale-[0.98] ${
        darkMode 
          ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30' 
          : 'bg-green-600 hover:bg-green-700 text-white'
      }`}
    >
      <Upload className="w-4 h-4" />
      {question.uploadButtonText || t('common.uploadFile')}
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  )
}

// ===========================================
// QUESTION RENDERER
// ===========================================

interface QuestionRendererProps extends QuestionProps {
  packageType?: PackageType
  onUpgradeClick?: () => void
  allAnswers?: Record<string, any>
  onAddExtraAnswer?: (key: string, value: any) => void
}

function QuestionRenderer({ question, value, onChange, disabled, darkMode, googleDriveUrl, packageType, onUpgradeClick, allAnswers, onAddExtraAnswer }: QuestionRendererProps) {
  const props = { question, value, onChange, disabled, darkMode, googleDriveUrl }
  
  switch (question.type) {
    case 'text':
      return <TextQuestion {...props} />
    case 'textarea':
      return <TextareaQuestion {...props} />
    case 'radio':
    case 'select':
      return <RadioQuestion {...props} onAddExtra={onAddExtraAnswer} answers={allAnswers} />
    case 'checkbox':
      return <CheckboxQuestion {...props} packageType={packageType} onUpgradeClick={onUpgradeClick} onAddExtra={onAddExtraAnswer} allAnswers={allAnswers} />
    case 'color':
      return <ColorQuestion value={value} onChange={onChange} darkMode={darkMode} />
    case 'multicolor':
      return <MultiColorQuestion value={value} onChange={onChange} darkMode={darkMode} />
    case 'font':
      return <FontQuestion value={value} onChange={onChange} darkMode={darkMode} />
    case 'tags':
      return <TagsQuestion {...props} />
    case 'upload':
      return <UploadQuestion {...props} />
    case 'pages-selector':
      return <PagesSelector {...props} packageType={packageType} onUpgradeClick={onUpgradeClick} />
    default:
      return <TextQuestion {...props} />
  }
}

// ===========================================
// SECTION COMPONENT - Next-Level Typeform/Wix Style
// ===========================================

interface SectionComponentProps {
  section: OnboardingSection
  answers: Record<string, any>
  onChange: (questionId: string, value: any) => void
  isExpanded: boolean
  onToggle: () => void
  onNext?: () => void
  isComplete: boolean
  darkMode?: boolean
  googleDriveUrl?: string
  sectionNumber: number
  totalSections: number
  packageType?: PackageType
  onUpgradeClick?: () => void
  // Stock photo props
  selectedStockPhotos?: string[]
  onSelectStockPhoto?: (url: string) => void
  onDeselectStockPhoto?: (url: string) => void
}

function SectionComponent({
  section,
  answers,
  onChange,
  isExpanded,
  onToggle,
  onNext,
  isComplete,
  darkMode = true,
  googleDriveUrl,
  sectionNumber,
  totalSections,
  packageType,
  onUpgradeClick,
  selectedStockPhotos = [],
  onSelectStockPhoto,
  onDeselectStockPhoto
}: SectionComponentProps) {
  const { t } = useTranslation()
  const { getQuestionText, getSectionText } = createTranslationHelpers(t)
  
  // Filter questions based on conditionalOn
  const visibleQuestions = section.questions.filter(q => {
    if (!q.conditionalOn) return true
    const dependentValue = answers[q.conditionalOn.questionId]
    return q.conditionalOn.values.includes(dependentValue)
  })

  const answeredCount = visibleQuestions.filter(q => {
    const answer = answers[q.id]
    if (Array.isArray(answer)) return answer.length > 0
    return answer !== undefined && answer !== '' && answer !== null
  }).length

  const progressPercentage = visibleQuestions.length > 0 
    ? Math.round((answeredCount / visibleQuestions.length) * 100) 
    : 0

  // Enhanced color system with gradients
  const colorClasses: Record<string, { 
    bg: string; 
    bgHover: string;
    bgExpanded: string;
    border: string; 
    borderExpanded: string;
    icon: string;
    iconBg: string;
    gradient: string;
    progressBar: string;
  }> = {
    blue: { 
      bg: 'bg-slate-800/40', 
      bgHover: 'hover:bg-slate-800/60',
      bgExpanded: 'bg-gradient-to-br from-blue-500/5 via-slate-800/60 to-indigo-500/5',
      border: 'border-slate-700/50', 
      borderExpanded: 'border-blue-500/40',
      icon: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
      gradient: 'from-blue-500 to-indigo-500',
      progressBar: 'bg-gradient-to-r from-blue-500 to-indigo-500'
    },
    purple: { 
      bg: 'bg-slate-800/40', 
      bgHover: 'hover:bg-slate-800/60',
      bgExpanded: 'bg-gradient-to-br from-purple-500/5 via-slate-800/60 to-pink-500/5',
      border: 'border-slate-700/50', 
      borderExpanded: 'border-purple-500/40',
      icon: 'text-purple-400',
      iconBg: 'bg-purple-500/15',
      gradient: 'from-purple-500 to-pink-500',
      progressBar: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    amber: { 
      bg: 'bg-slate-800/40', 
      bgHover: 'hover:bg-slate-800/60',
      bgExpanded: 'bg-gradient-to-br from-amber-500/5 via-slate-800/60 to-orange-500/5',
      border: 'border-slate-700/50', 
      borderExpanded: 'border-amber-500/40',
      icon: 'text-amber-400',
      iconBg: 'bg-amber-500/15',
      gradient: 'from-amber-500 to-orange-500',
      progressBar: 'bg-gradient-to-r from-amber-500 to-orange-500'
    },
    emerald: { 
      bg: 'bg-slate-800/40', 
      bgHover: 'hover:bg-slate-800/60',
      bgExpanded: 'bg-gradient-to-br from-emerald-500/5 via-slate-800/60 to-teal-500/5',
      border: 'border-slate-700/50', 
      borderExpanded: 'border-emerald-500/40',
      icon: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15',
      gradient: 'from-emerald-500 to-teal-500',
      progressBar: 'bg-gradient-to-r from-emerald-500 to-teal-500'
    },
    green: { 
      bg: 'bg-slate-800/40', 
      bgHover: 'hover:bg-slate-800/60',
      bgExpanded: 'bg-gradient-to-br from-green-500/5 via-slate-800/60 to-emerald-500/5',
      border: 'border-slate-700/50', 
      borderExpanded: 'border-green-500/40',
      icon: 'text-green-400',
      iconBg: 'bg-green-500/15',
      gradient: 'from-green-500 to-emerald-500',
      progressBar: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    pink: { 
      bg: 'bg-slate-800/40', 
      bgHover: 'hover:bg-slate-800/60',
      bgExpanded: 'bg-gradient-to-br from-pink-500/5 via-slate-800/60 to-rose-500/5',
      border: 'border-slate-700/50', 
      borderExpanded: 'border-pink-500/40',
      icon: 'text-pink-400',
      iconBg: 'bg-pink-500/15',
      gradient: 'from-pink-500 to-rose-500',
      progressBar: 'bg-gradient-to-r from-pink-500 to-rose-500'
    },
  }

  const colors = colorClasses[section.color] || colorClasses.blue

  // Section tips with enhanced styling
  const sectionTips: Record<string, { emoji: string; text: string; color: string }> = {
    bedrijf: { 
      emoji: '💡', 
      text: t('onboarding.sectionTip.bedrijf', { defaultValue: 'Hoe specifieker je bent, hoe beter we je website kunnen afstemmen op jouw doelgroep.' }),
      color: 'blue'
    },
    branding: { 
      emoji: '🎨', 
      text: t('onboarding.sectionTip.branding', { defaultValue: 'Geen huisstijl? Geen probleem! Onze designers maken op basis van je voorkeuren een passende stijl.' }),
      color: 'purple'
    },
    content: { 
      emoji: '📝', 
      text: t('onboarding.sectionTip.content', { defaultValue: 'Geen teksten of foto\'s? We regelen het! Selecteer de opties en we zorgen voor professionele content.' }),
      color: 'amber'
    },
    pages: { 
      emoji: '📄', 
      text: t('onboarding.sectionTip.pages', { defaultValue: 'Selecteer de pagina\'s die je nodig hebt. Je kunt later altijd nog pagina\'s toevoegen.' }),
      color: 'emerald'
    },
    contact: { 
      emoji: '📞', 
      text: t('onboarding.sectionTip.contact', { defaultValue: 'Zorg dat klanten je makkelijk kunnen bereiken. Vul alle contactgegevens in.' }),
      color: 'green'
    }
  }

  const currentTip = sectionTips[section.id]

  return (
    <motion.div
      id={`section-${section.id}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
        isExpanded
          ? `${colors.bgExpanded} ${colors.borderExpanded} shadow-lg shadow-black/20`
          : isComplete
            ? darkMode
              ? 'border-green-500/40 bg-gradient-to-br from-green-500/5 to-emerald-500/5 hover:from-green-500/10 hover:to-emerald-500/10'
              : 'border-green-500/40 bg-gradient-to-br from-green-50 to-emerald-50'
            : darkMode 
              ? `${colors.border} ${colors.bg} ${colors.bgHover} cursor-pointer` 
              : 'border-gray-200 bg-white hover:bg-gray-50 cursor-pointer'
      }`}
    >
      {/* Section Header - Card Style */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left group"
      >
        {/* Icon with gradient background */}
        <div className={`relative flex-shrink-0`}>
          {isComplete ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25"
            >
              <CheckCircle2 className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center transition-transform group-hover:scale-105`}>
              {(() => {
                const IconComponent = SECTION_ICONS[section.icon]
                return IconComponent ? (
                  <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                ) : (
                  <span className="text-2xl">{section.icon}</span>
                )
              })()}
            </div>
          )}
          {/* Step number badge */}
          {!isComplete && (
            <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-[10px] font-bold text-white shadow-lg`}>
              {sectionNumber}
            </div>
          )}
        </div>
        
        {/* Title and description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold text-lg truncate ${
              isComplete 
                ? 'text-green-400' 
                : darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {getSectionText(section.id, 'title', section.title)}
            </h3>
            {isComplete && (
              <span className="flex-shrink-0 text-xs font-medium text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                ✓ {t('onboarding.complete', { defaultValue: 'Klaar' })}
              </span>
            )}
          </div>
          <p className={`text-sm line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {getSectionText(section.id, 'description', section.description)}
          </p>
          
          {/* Progress indicator - only when not expanded */}
          {!isExpanded && !isComplete && (
            <div className="mt-3 flex items-center gap-3">
              <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full rounded-full ${colors.progressBar}`}
                />
              </div>
              <span className={`text-xs font-medium tabular-nums ${colors.icon}`}>
                {answeredCount}/{visibleQuestions.length}
              </span>
            </div>
          )}
        </div>

        {/* Expand/Collapse indicator */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
          isExpanded 
            ? `${colors.iconBg}` 
            : darkMode ? 'bg-slate-700/50 group-hover:bg-slate-700' : 'bg-gray-100 group-hover:bg-gray-200'
        }`}>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className={`w-5 h-5 ${isExpanded ? colors.icon : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </motion.div>
        </div>
      </button>

      {/* Section Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              {/* Divider with gradient */}
              <div className={`h-px mb-5 bg-gradient-to-r from-transparent via-${section.color}-500/30 to-transparent`} />
              
              {/* Section Tip - Enhanced card style */}
              {currentTip && !isComplete && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`mb-6 p-4 rounded-xl border ${
                    darkMode 
                      ? `bg-gradient-to-r from-${section.color}-500/10 to-transparent border-${section.color}-500/20` 
                      : `bg-${section.color}-50 border-${section.color}-200`
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{currentTip.emoji}</span>
                    <div>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${colors.icon}`}>
                        {t('onboarding.tip', { defaultValue: 'Tip' })}
                      </span>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {currentTip.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Questions Container */}
              <div className="space-y-6">
                {visibleQuestions.map((question, qIndex) => {
                  const hasAnswer = (() => {
                    const answer = answers[question.id]
                    if (Array.isArray(answer)) return answer.length > 0
                    return answer !== undefined && answer !== '' && answer !== null
                  })()
                  
                  return (
                    <motion.div 
                      key={question.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * qIndex }}
                      className={`relative p-4 rounded-xl border transition-all ${
                        hasAnswer
                          ? darkMode
                            ? 'bg-slate-800/50 border-green-500/30'
                            : 'bg-green-50/50 border-green-200'
                          : darkMode
                            ? 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Question answered indicator */}
                      {hasAnswer && (
                        <div className="absolute top-3 right-3">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {/* Question Label */}
                      <div className="mb-3">
                        <div className="flex items-start gap-2 pr-8">
                          <label className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {getQuestionText(question.id, 'label', question.label)}
                            {question.required && (
                              <span className="text-red-400 ml-1">*</span>
                            )}
                          </label>
                          {question.helpText && (
                            <div className="group relative flex-shrink-0">
                              <HelpCircle className={`w-4 h-4 cursor-help ${darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'}`} />
                              <div className="absolute left-0 top-6 w-56 p-3 rounded-xl bg-slate-900 text-white text-xs hidden group-hover:block z-20 shadow-xl border border-slate-700">
                                <div className="font-medium text-primary-400 mb-1">{t('onboarding.helpTitle', { defaultValue: 'Hulp' })}</div>
                                {getQuestionText(question.id, 'helpText', question.helpText)}
                              </div>
                            </div>
                          )}
                        </div>
                        {question.description && (
                          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {getQuestionText(question.id, 'description', question.description)}
                          </p>
                        )}
                      </div>

                      {/* Question Input */}
                      <QuestionRenderer
                        question={question}
                        value={answers[question.id]}
                        onChange={(value) => onChange(question.id, value)}
                        disabled={false}
                        darkMode={darkMode}
                        googleDriveUrl={googleDriveUrl}
                        packageType={packageType}
                        onUpgradeClick={onUpgradeClick}
                        allAnswers={answers}
                        onAddExtraAnswer={(key, value) => onChange(key, value)}
                      />

                      {/* Inline Upload Button */}
                      {question.showUploadButton && googleDriveUrl && question.type !== 'upload' && (
                        <a
                          href={googleDriveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            darkMode 
                              ? 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                          }`}
                        >
                          <Upload className="w-4 h-4" />
                          {question.uploadButtonText || 'Upload'}
                          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                        </a>
                      )}

                      {/* Stock Photo Suggestions */}
                      {question.id === 'hasPhotos' && (answers['hasPhotos'] === 'no' || answers['hasPhotos'] === 'some') && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-4 p-4 rounded-xl border ${
                            darkMode ? 'bg-slate-800/80 border-purple-500/30' : 'bg-purple-50 border-purple-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                              <Image className="w-4 h-4 text-purple-400" />
                            </div>
                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {t('inlineOnboardingNew.stockPhotos.title')}
                            </span>
                          </div>
                          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {t('inlineOnboardingNew.stockPhotos.description')}
                          </p>
                          <StockPhotoSuggestions
                            businessName={answers['companyName'] || ''}
                            businessDescription={answers['businessDescription'] || ''}
                            selectedPhotos={selectedStockPhotos}
                            onSelectPhoto={(url) => onSelectStockPhoto?.(url)}
                            onDeselectPhoto={(url) => onDeselectStockPhoto?.(url)}
                            maxSelections={10}
                            darkMode={darkMode}
                            compact={true}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Section Footer with Progress & Next Button */}
              <div className={`mt-6 pt-5 border-t ${darkMode ? 'border-slate-700/50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  {/* Progress summary */}
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1.5 text-sm ${
                      progressPercentage === 100 ? 'text-green-400' : darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {progressPercentage === 100 ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="font-medium">{t('onboarding.sectionComplete', { defaultValue: 'Sectie voltooid!' })}</span>
                        </>
                      ) : (
                        <>
                          <span>{answeredCount} van {visibleQuestions.length} {t('onboarding.questionsAnswered', { defaultValue: 'vragen beantwoord' })}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Next section button */}
                  {sectionNumber < totalSections && onNext && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={onNext}
                      className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                        progressPercentage === 100
                          ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg shadow-${section.color}-500/25 hover:shadow-${section.color}-500/40`
                          : darkMode
                            ? 'bg-slate-700 text-white hover:bg-slate-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t('onboarding.nextSection', { defaultValue: 'Volgende sectie' })}
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ===========================================
// MAIN COMPONENT
// ===========================================

interface InlineOnboardingProps {
  projectId: string
  packageType: PackageType
  darkMode?: boolean
  googleDriveUrl?: string
  onDataChange?: (data: Record<string, any>) => void
  initialData?: Record<string, any>
}

export default function InlineOnboarding({
  projectId,
  packageType,
  darkMode = true,
  googleDriveUrl,
  onDataChange,
  initialData = {}
}: InlineOnboardingProps) {
  const { t } = useTranslation()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [selectedStockPhotos, setSelectedStockPhotos] = useState<string[]>([])
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  
  // Haptic feedback for interactions
  const haptic = useHapticFeedback()

  // Get sections for this package
  const sections = getSectionsForPackage(packageType)
  const completionPercentage = getCompletionPercentage(packageType, answers)

  // Load saved data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`/api/client-onboarding?projectId=${projectId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.formData) {
            setAnswers(prev => ({ ...prev, ...data.formData }))
            // Load saved stock photos if they exist
            if (data.formData.selectedStockPhotos && Array.isArray(data.formData.selectedStockPhotos)) {
              setSelectedStockPhotos(data.formData.selectedStockPhotos)
            }
          }
        }
      } catch (error) {
        console.error('Error loading onboarding data:', error)
      }
    }
    loadData()
  }, [projectId])

  // Auto-save with debounce
  const saveData = useCallback(async () => {
    if (Object.keys(answers).length === 0) return
    
    setIsSaving(true)
    try {
      // Include selected stock photos in the form data
      const formDataWithPhotos = {
        ...answers,
        selectedStockPhotos: selectedStockPhotos.length > 0 ? selectedStockPhotos : undefined
      }
      
      await fetch('/api/client-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          formData: formDataWithPhotos,
          completionPercentage
        })
      })
      setLastSaved(new Date())
      onDataChange?.(answers)
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setIsSaving(false)
    }
  }, [answers, projectId, completionPercentage, onDataChange, selectedStockPhotos])

  useEffect(() => {
    const timer = setTimeout(saveData, 1500)
    return () => clearTimeout(timer)
  }, [answers, saveData, selectedStockPhotos])

  const handleChange = (questionId: string, value: any) => {
    haptic.light() // Haptic on input change
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const toggleSection = (sectionId: string) => {
    haptic.selection() // Haptic on section toggle
    // Store current scroll position before toggle
    const scrollY = window.scrollY
    setExpandedSection(prev => prev === sectionId ? null : sectionId)
    // Restore scroll position multiple times to combat animation-induced scroll
    // First immediately after state change
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollY, behavior: 'instant' })
    })
    // Then after animation starts (50ms)
    setTimeout(() => {
      window.scrollTo({ top: scrollY, behavior: 'instant' })
    }, 50)
    // And after animation completes (250ms, animation is 200ms)
    setTimeout(() => {
      window.scrollTo({ top: scrollY, behavior: 'instant' })
    }, 250)
  }

  const goToNextSection = (currentSectionId: string) => {
    haptic.selection()
    const currentIndex = sections.findIndex(s => s.id === currentSectionId)
    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1]
      setExpandedSection(nextSection.id)
      // Scroll to the next section smoothly after a brief delay for animation
      setTimeout(() => {
        const sectionElement = document.getElementById(`section-${nextSection.id}`)
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  const isSectionComplete = (section: OnboardingSection) => {
    // Filter questions based on conditionalOn (same logic as SectionComponent)
    const visibleQuestions = section.questions.filter(q => {
      if (!q.conditionalOn) return true
      const dependentValue = answers[q.conditionalOn.questionId]
      return q.conditionalOn.values.includes(dependentValue)
    })
    
    const requiredQuestions = visibleQuestions.filter(q => q.required)
    
    // Must have at least one required question answered to show as complete
    if (requiredQuestions.length === 0) {
      return false // No required questions = not complete (avoid false positives)
    }
    
    // Check if all required questions are answered
    const allRequiredAnswered = requiredQuestions.every(q => {
      const answer = answers[q.id]
      if (Array.isArray(answer)) return answer.length > 0
      if (typeof answer === 'string') return answer.trim() !== ''
      return answer !== undefined && answer !== null
    })
    
    if (!allRequiredAnswered) return false
    
    // Special handling for contact section - require all contact fields
    if (section.id === 'contact') {
      const hasEmail = answers['contactEmail'] && answers['contactEmail'].trim() !== ''
      const hasPhone = answers['contactPhone'] && answers['contactPhone'].trim() !== ''
      const hasAddress = answers['businessAddress'] && answers['businessAddress'].trim() !== ''
      
      // Must have email, phone AND address for complete contact info
      if (!hasEmail || !hasPhone || !hasAddress) return false
      
      // If social media channels are selected, URLs should be provided
      const socialMediaAnswer = answers['socialMedia']
      const socialMediaUrlsAnswer = answers['socialMediaUrls']
      if (Array.isArray(socialMediaAnswer) && socialMediaAnswer.length > 0) {
        if (!socialMediaUrlsAnswer || socialMediaUrlsAnswer.trim() === '') {
          return false
        }
      }
    }
    
    // Special handling for branding section
    if (section.id === 'branding') {
      const hasLogo = answers['hasLogo']
      const designStyle = answers['designStyle']
      // Must have answered logo question and design style
      if (!hasLogo || !designStyle) return false
    }
    
    // Special handling for pages section
    if (section.id === 'pages') {
      const pages = answers['pages']
      const contactMethods = answers['contactMethods']
      // Must have selected at least 1 page and 1 contact method
      if (!Array.isArray(pages) || pages.length === 0) return false
      if (!Array.isArray(contactMethods) || contactMethods.length === 0) return false
    }
    
    return true
  }

  // Auto-expand first incomplete section
  useEffect(() => {
    if (!expandedSection) {
      const firstIncomplete = sections.find(s => !isSectionComplete(s))
      if (firstIncomplete) {
        setExpandedSection(firstIncomplete.id)
      }
    }
  }, [sections])

  // Count completed sections
  const completedSections = sections.filter(s => isSectionComplete(s)).length

  // Calculate estimated time remaining (2 min per incomplete section)
  const estimatedMinutes = (sections.length - completedSections) * 2

  return (
    <div className="space-y-5">
      {/* Hero Welcome Card - Typeform/Notion style */}
      {completionPercentage < 25 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`relative overflow-hidden rounded-2xl border-2 ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-800 via-slate-800 to-indigo-900/30 border-indigo-500/30' 
              : 'bg-gradient-to-br from-white via-indigo-50 to-purple-50 border-indigo-200'
          }`}
        >
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/20 to-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {/* Animated icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex-shrink-0"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              
              <div className="flex-1">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {t('onboarding.welcomeTitle', { defaultValue: 'Laten we je website bouwen! �' })}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`text-base mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  {t('onboarding.welcomeDescription', { defaultValue: 'Beantwoord een paar vragen zodat we jouw perfecte website kunnen maken. Duurt ongeveer 5-10 minuten en je voortgang wordt automatisch opgeslagen.' })}
                </motion.p>
                
                {/* Section pills with stagger animation */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-2 mt-4"
                >
                  {sections.map((section, idx) => {
                    const IconComponent = SECTION_ICONS[section.icon]
                    const isComplete = isSectionComplete(section)
                    return (
                      <motion.button
                        key={section.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + idx * 0.05 }}
                        onClick={() => {
                          setExpandedSection(section.id)
                          setTimeout(() => {
                            document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }, 100)
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          isComplete
                            ? darkMode ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-green-100 text-green-700 border border-green-200'
                            : expandedSection === section.id
                              ? darkMode ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-primary-100 text-primary-700 border border-primary-200'
                              : darkMode ? 'bg-slate-700/50 text-gray-300 border border-slate-600 hover:bg-slate-700' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : IconComponent ? (
                          <IconComponent className="w-3.5 h-3.5" />
                        ) : null}
                        <span>{section.title}</span>
                      </motion.button>
                    )
                  })}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-5 rounded-2xl border-2 ${
          darkMode 
            ? 'bg-slate-800/60 border-slate-700/50' 
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            {/* Circular progress indicator */}
            <div className="relative w-14 h-14 flex-shrink-0">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className={darkMode ? 'text-slate-700' : 'text-gray-200'}
                />
                <motion.circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 150.8' }}
                  animate={{ strokeDasharray: `${completionPercentage * 1.508} 150.8` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={completionPercentage === 100 ? '#10B981' : '#6366F1'} />
                    <stop offset="100%" stopColor={completionPercentage === 100 ? '#34D399' : '#8B5CF6'} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-bold ${
                  completionPercentage === 100 ? 'text-green-400' : darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {completionPercentage}%
                </span>
              </div>
            </div>
            
            <div>
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {completionPercentage === 100 
                  ? t('onboarding.allDone', { defaultValue: 'Alles ingevuld! 🎉' })
                  : t('onboarding.progressTitle', { defaultValue: 'Je voortgang' })
                }
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {completedSections} van {sections.length} {t('onboarding.sectionsComplete', { defaultValue: 'secties voltooid' })}
                {estimatedMinutes > 0 && completionPercentage < 100 && (
                  <span className="ml-2 opacity-75">• ~{estimatedMinutes} min</span>
                )}
              </p>
            </div>
          </div>
          
          {/* Save status */}
          <div className="flex items-center gap-3">
            {isSaving ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('onboarding.saving', { defaultValue: 'Opslaan...' })}
              </motion.span>
            ) : lastSaved && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-sm text-green-500"
              >
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                {t('onboarding.saved', { defaultValue: 'Opgeslagen' })}
              </motion.span>
            )}
          </div>
        </div>
        
        {/* Section progress dots */}
        <div className="flex items-center gap-1.5">
          {sections.map((section) => {
            const isComplete = isSectionComplete(section)
            const isCurrent = expandedSection === section.id
            return (
              <motion.button
                key={section.id}
                onClick={() => {
                  setExpandedSection(section.id)
                  setTimeout(() => {
                    document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }, 100)
                }}
                className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
                  isComplete
                    ? 'bg-green-500'
                    : isCurrent
                      ? 'bg-gradient-to-r from-primary-500 to-indigo-500'
                      : darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                title={section.title}
                whileHover={{ scaleY: 1.5 }}
              />
            )
          })}
        </div>
        
        {/* Motivational message */}
        {completionPercentage > 0 && completionPercentage < 100 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm mt-4 flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            {completionPercentage < 30 && (
              <><Rocket className="w-4 h-4 text-primary-400" /> {t('onboarding.motivationStart', { defaultValue: 'Goed begin! Je bent op weg naar een mooie website.' })}</>
            )}
            {completionPercentage >= 30 && completionPercentage < 60 && (
              <><span className="text-lg">💪</span> {t('onboarding.motivationMid', { defaultValue: 'Lekker bezig! Je bent al halverwege.' })}</>
            )}
            {completionPercentage >= 60 && completionPercentage < 90 && (
              <><span className="text-lg">🎯</span> {t('onboarding.motivationAlmost', { defaultValue: 'Bijna klaar! Nog een paar vragen te gaan.' })}</>
            )}
            {completionPercentage >= 90 && (
              <><Trophy className="w-4 h-4 text-amber-400" /> {t('onboarding.motivationFinal', { defaultValue: 'Laatste stukje! Je bent er bijna.' })}</>
            )}
          </motion.p>
        )}
      </motion.div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <SectionComponent
            key={section.id}
            section={section}
            answers={answers}
            onChange={handleChange}
            isExpanded={expandedSection === section.id}
            onToggle={() => toggleSection(section.id)}
            onNext={index < sections.length - 1 ? () => goToNextSection(section.id) : undefined}
            isComplete={isSectionComplete(section)}
            darkMode={darkMode}
            googleDriveUrl={googleDriveUrl}
            sectionNumber={index + 1}
            totalSections={sections.length}
            packageType={packageType}
            selectedStockPhotos={selectedStockPhotos}
            onSelectStockPhoto={(url) => setSelectedStockPhotos(prev => [...prev, url])}
            onDeselectStockPhoto={(url) => setSelectedStockPhotos(prev => prev.filter(p => p !== url))}
            onUpgradeClick={() => setShowUpgradeModal(true)}
          />
        ))}
      </div>
      
      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPackage={packageType}
        projectId={projectId}
      />

      {/* Success Completion Card */}
      {completionPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className={`relative overflow-hidden p-6 rounded-2xl border-2 ${
            darkMode 
              ? 'bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border-green-500/40' 
              : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-300'
          }`}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-2xl" />
          
          <div className="relative flex items-start gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-xl shadow-green-500/30 flex-shrink-0"
            >
              <Trophy className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('onboarding.allComplete', { defaultValue: 'Geweldig! Alles is ingevuld 🎉' })}
              </h4>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('onboarding.allCompleteDescription', { defaultValue: 'Onze designers gaan nu aan de slag met jouw website. Je ontvangt binnenkort het eerste ontwerp!' })}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {sections.length} {t('onboarding.sectionsCompleted', { defaultValue: 'secties voltooid' })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
