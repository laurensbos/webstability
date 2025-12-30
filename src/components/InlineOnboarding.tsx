import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronUp, 
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
function RadioQuestion({ question, value, onChange, disabled, darkMode }: QuestionProps) {
  const { t } = useTranslation()
  const { getOptionText } = createTranslationHelpers(t)
  
  // Check if this is the logo question and user wants a new logo
  const isLogoQuestion = question.id === 'hasLogo'
  const wantsNewLogo = isLogoQuestion && (value === 'no' || value === 'refresh')
  
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
}

function CheckboxQuestion({ question, value, onChange, disabled, darkMode, packageType = 'starter', onUpgradeClick }: CheckboxQuestionProps) {
  const { t } = useTranslation()
  const { getOptionText } = createTranslationHelpers(t)
  const selectedValues = Array.isArray(value) ? value : []
  
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
}

function QuestionRenderer({ question, value, onChange, disabled, darkMode, googleDriveUrl, packageType, onUpgradeClick }: QuestionRendererProps) {
  const props = { question, value, onChange, disabled, darkMode, googleDriveUrl }
  
  switch (question.type) {
    case 'text':
      return <TextQuestion {...props} />
    case 'textarea':
      return <TextareaQuestion {...props} />
    case 'radio':
    case 'select':
      return <RadioQuestion {...props} />
    case 'checkbox':
      return <CheckboxQuestion {...props} packageType={packageType} onUpgradeClick={onUpgradeClick} />
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
// SECTION COMPONENT
// ===========================================

interface SectionComponentProps {
  section: OnboardingSection
  answers: Record<string, any>
  onChange: (questionId: string, value: any) => void
  isExpanded: boolean
  onToggle: () => void
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

  const colorClasses: Record<string, { bg: string; border: string; icon: string }> = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'text-blue-400' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: 'text-purple-400' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: 'text-amber-400' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: 'text-emerald-400' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', icon: 'text-green-400' },
    pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', icon: 'text-pink-400' },
  }

  const colors = colorClasses[section.color] || colorClasses.blue

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border overflow-hidden transition-colors ${
        isExpanded
          ? `${colors.border} ${colors.bg}`
          : isComplete
            ? darkMode
              ? 'border-green-500/30 bg-green-500/5'
              : 'border-green-500/30 bg-green-50'
            : darkMode 
              ? 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50' 
              : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
    >
      {/* Section Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        {/* Completion indicator */}
        {isComplete ? (
          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
        ) : (
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold ${
            isExpanded 
              ? `${colors.border} ${colors.icon}` 
              : darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'
          }`}>
            {sectionNumber}
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {(() => {
              const IconComponent = SECTION_ICONS[section.icon]
              return IconComponent ? (
                <IconComponent className={`w-5 h-5 ${
                  isComplete 
                    ? 'text-green-500' 
                    : isExpanded 
                      ? colors.icon 
                      : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              ) : (
                <span className="text-lg">{section.icon}</span>
              )
            })()}
            <span className={`font-semibold ${
              isComplete 
                ? 'text-green-500' 
                : darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {getSectionText(section.id, 'title', section.title)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {getSectionText(section.id, 'description', section.description)}
            </p>
            {!isExpanded && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                {answeredCount}/{visibleQuestions.length}
              </span>
            )}
          </div>
        </div>

        {isExpanded ? (
          <ChevronUp className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        ) : (
          <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        )}
      </button>

      {/* Section Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`p-4 pt-0 space-y-6`}>
              {visibleQuestions.map((question) => (
                <div key={question.id} className="space-y-2">
                  {/* Question Label */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <label className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {getQuestionText(question.id, 'label', question.label)}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {question.description && (
                        <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {getQuestionText(question.id, 'description', question.description)}
                        </p>
                      )}
                    </div>
                    {question.helpText && (
                      <div className="group relative">
                        <HelpCircle className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <div className="absolute right-0 top-6 w-48 p-2 rounded-lg bg-gray-900 text-white text-xs hidden group-hover:block z-10">
                          {getQuestionText(question.id, 'helpText', question.helpText)}
                        </div>
                      </div>
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
                  />

                  {/* Inline Upload Button */}
                  {question.showUploadButton && googleDriveUrl && question.type !== 'upload' && (
                    <a
                      href={googleDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      {question.uploadButtonText || 'Upload'}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {/* Stock Photo Suggestions - show after hasPhotos question when user needs stock photos */}
                  {question.id === 'hasPhotos' && (answers['hasPhotos'] === 'no' || answers['hasPhotos'] === 'some') && (
                    <div className={`mt-4 p-4 rounded-xl border ${
                      darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Image className="w-5 h-5 text-purple-500" />
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
                    </div>
                  )}
                </div>
              ))}

              {/* Next Section Button */}
              {sectionNumber < totalSections && (
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={onToggle}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {t('onboarding.next')} →
                  </button>
                </div>
              )}
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
    // Restore scroll position after render
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollY, behavior: 'instant' })
    })
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
    
    // Special handling for contact section - require more than just email
    // A contact section should have email + at least phone OR address
    if (section.id === 'contact') {
      const hasEmail = answers['contactEmail'] && answers['contactEmail'].trim() !== ''
      const hasPhone = answers['contactPhone'] && answers['contactPhone'].trim() !== ''
      const hasAddress = answers['businessAddress'] && answers['businessAddress'].trim() !== ''
      
      // Must have email and at least one other contact method
      if (!hasEmail) return false
      if (!hasPhone && !hasAddress) return false
      
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

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Voortgang
          </span>
          <div className="flex items-center gap-2">
            {isSaving ? (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Loader2 className="w-3 h-3 animate-spin" />
                Opslaan...
              </span>
            ) : lastSaved && (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <Check className="w-3 h-3" />
                Opgeslagen
              </span>
            )}
            <span className={`text-sm font-bold ${
              completionPercentage === 100 ? 'text-green-500' : darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {completionPercentage}%
            </span>
          </div>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            className={`h-full rounded-full ${
              completionPercentage === 100 
                ? 'bg-green-500' 
                : 'bg-gradient-to-r from-primary-500 to-primary-400'
            }`}
          />
        </div>
      </div>

      {/* Sections */}
      {sections.map((section, index) => (
        <SectionComponent
          key={section.id}
          section={section}
          answers={answers}
          onChange={handleChange}
          isExpanded={expandedSection === section.id}
          onToggle={() => toggleSection(section.id)}
          isComplete={isSectionComplete(section)}
          darkMode={darkMode}
          googleDriveUrl={googleDriveUrl}
          sectionNumber={index + 1}
          totalSections={sections.length}
          packageType={packageType}
          selectedStockPhotos={selectedStockPhotos}
          onSelectStockPhoto={(url) => setSelectedStockPhotos(prev => [...prev, url])}
          onDeselectStockPhoto={(url) => setSelectedStockPhotos(prev => prev.filter(p => p !== url))}
        />
      ))}

      {/* Completion Message */}
      {completionPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            darkMode 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-green-50 border-green-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('onboarding.allComplete')} 🎉
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('onboarding.allCompleteDescription')}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
