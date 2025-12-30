import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Building2,
  Palette,
  Target,
  FileText,
  Image,
  Settings,
  Check,
  Plus,
  X,
  ArrowUpRight,
  Sparkles,
  Lock
} from 'lucide-react'
import { useState, useEffect } from 'react'

// ===========================================
// PAKKET CONFIGURATIE
// ===========================================

export type PackageId = 'starter' | 'professional' | 'business'

export interface PackageConfig {
  id: PackageId
  name: string
  price: string
  maxPages: number
  features: {
    blog: boolean
    booking: boolean
    newsletter: boolean
    multilang: boolean
    analytics: boolean
    socialFeed: boolean
    chat: boolean
    reviews: boolean
  }
}

// Base package configs zonder vertaalbare teksten
const PACKAGE_CONFIGS_BASE: Record<PackageId, Omit<PackageConfig, 'name' | 'price'>> = {
  starter: {
    id: 'starter',
    maxPages: 5,
    features: {
      blog: false,
      booking: false,
      newsletter: false,
      multilang: false,
      analytics: false,
      socialFeed: false,
      chat: false,
      reviews: true,
    }
  },
  professional: {
    id: 'professional',
    maxPages: 10,
    features: {
      blog: true,
      booking: false,
      newsletter: false,
      multilang: false,
      analytics: true,
      socialFeed: true,
      chat: false,
      reviews: true,
    }
  },
  business: {
    id: 'business',
    maxPages: 999, // Unlimited
    features: {
      blog: true,
      booking: true,
      newsletter: true,
      multilang: true,
      analytics: true,
      socialFeed: true,
      chat: true,
      reviews: true,
    }
  }
}

// Hook om vertaalde package configs te krijgen
export function usePackageConfigs(): Record<PackageId, PackageConfig> {
  const { t } = useTranslation()
  return {
    starter: {
      ...PACKAGE_CONFIGS_BASE.starter,
      name: t('onboarding.formSteps.packageConfig.starter.name'),
      price: t('onboarding.formSteps.packageConfig.starter.price'),
    },
    professional: {
      ...PACKAGE_CONFIGS_BASE.professional,
      name: t('onboarding.formSteps.packageConfig.professional.name'),
      price: t('onboarding.formSteps.packageConfig.professional.price'),
    },
    business: {
      ...PACKAGE_CONFIGS_BASE.business,
      name: t('onboarding.formSteps.packageConfig.business.name'),
      price: t('onboarding.formSteps.packageConfig.business.price'),
    }
  }
}

// @deprecated - Use usePackageConfigs() hook instead for translated values
// Legacy export for backwards compatibility (uses Dutch as fallback)
export const PACKAGE_CONFIGS: Record<PackageId, PackageConfig> = {
  starter: { ...PACKAGE_CONFIGS_BASE.starter, name: 'Starter', price: '€119/month' },
  professional: { ...PACKAGE_CONFIGS_BASE.professional, name: 'Professional', price: '€149/month' },
  business: { ...PACKAGE_CONFIGS_BASE.business, name: 'Business', price: '€199/month' },
}

// Verkrijg het minimale pakket vereist voor een feature
export function getMinPackageForFeature(feature: keyof PackageConfig['features']): PackageId {
  if (PACKAGE_CONFIGS_BASE.starter.features[feature]) return 'starter'
  if (PACKAGE_CONFIGS_BASE.professional.features[feature]) return 'professional'
  return 'business'
}

// =========================================== 
// UPGRADE PROMPT COMPONENT
// ===========================================

interface UpgradePromptProps {
  currentPackage: PackageId
  requiredPackage: PackageId
  featureName: string
  onUpgrade?: (packageId: PackageId) => void
}

// Geëxporteerd voor gebruik in andere componenten
export function UpgradePrompt({ currentPackage, requiredPackage, featureName, onUpgrade }: UpgradePromptProps) {
  const { t } = useTranslation()
  const packageConfigs = usePackageConfigs()
  const requiredConfig = packageConfigs[requiredPackage]
  const currentConfig = packageConfigs[currentPackage]
  
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="font-medium text-amber-800 dark:text-amber-300">
              {t('onboarding.formSteps.upgradePrompt.packageRequired', { feature: featureName, package: requiredConfig.name })}
            </span>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
            {t('onboarding.formSteps.upgradePrompt.currentPackageNoFeature', { package: currentConfig.name })}
          </p>
          {onUpgrade && (
            <button
              onClick={() => onUpgrade(requiredPackage)}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium text-sm hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              {t('onboarding.formSteps.upgradePrompt.upgradeToPackage', { package: requiredConfig.name })}
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ===========================================
// GEDEELDE COMPONENTEN
// ===========================================

interface InputProps {
  label: string
  name: string
  value: string
  onChange: (name: string, value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  disabled?: boolean
  hint?: string
}

function TextInput({ label, name, value, onChange, placeholder, type = 'text', required, disabled, hint }: InputProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {hint && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{hint}</p>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      />
    </label>
  )
}

interface TextAreaProps extends Omit<InputProps, 'type'> {
  rows?: number
}

function TextArea({ label, name, value, onChange, placeholder, required, disabled, hint, rows = 4 }: TextAreaProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {hint && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none"
      />
    </label>
  )
}

// Select component - geëxporteerd voor gebruik in andere formulier stappen
interface SelectProps {
  label: string
  name: string
  value: string
  onChange: (name: string, value: string) => void
  options: { value: string; label: string }[]
  required?: boolean
  disabled?: boolean
  hint?: string
}

export function Select({ label, name, value, onChange, options, required, disabled, hint }: SelectProps) {
  const { t } = useTranslation()
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {hint && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{hint}</p>}
      <select
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        required={required}
        disabled={disabled}
        className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <option value="">{t('common.select')}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  )
}

interface CheckboxGroupProps {
  label: string
  name: string
  values: string[]
  onChange: (name: string, values: string[]) => void
  options: { value: string; label: string; icon?: React.ElementType }[]
  disabled?: boolean
  hint?: string
  columns?: number
}

// Geëxporteerd voor gebruik in andere componenten
export function CheckboxGroup({ label, name, values, onChange, options, disabled, hint, columns = 2 }: CheckboxGroupProps) {
  const toggleValue = (val: string) => {
    if (disabled) return
    const newValues = values.includes(val) 
      ? values.filter(v => v !== val)
      : [...values, val]
    onChange(name, newValues)
  }

  // Responsive grid - 1 kolom op mobiel, gevraagde kolommen op desktop
  const gridClass = columns === 3 
    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
    : columns === 4
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    : 'grid-cols-1 sm:grid-cols-2'

  return (
    <div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      {hint && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{hint}</p>}
      <div className={`mt-3 grid ${gridClass} gap-3`}>
        {options.map(opt => {
          const isSelected = values.includes(opt.value)
          const Icon = opt.icon
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleValue(opt.value)}
              disabled={disabled}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all
                ${isSelected 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                ${isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-300 dark:border-gray-500'}
              `}>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
              <span className="text-sm font-medium">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface RadioGroupProps {
  label: string
  name: string
  value: string
  onChange: (name: string, value: string) => void
  options: { value: string; label: string; description?: string }[]
  disabled?: boolean
  hint?: string
}

function RadioGroup({ label, name, value, onChange, options, disabled, hint }: RadioGroupProps) {
  return (
    <div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      {hint && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{hint}</p>}
      <div className="mt-3 space-y-3">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => !disabled && onChange(name, opt.value)}
            disabled={disabled}
            className={`
              w-full flex items-start gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all
              ${value === opt.value 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
              ${value === opt.value ? 'border-primary-500' : 'border-gray-300 dark:border-gray-500'}
            `}>
              {value === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
            </div>
            <div>
              <span className={`text-sm font-medium ${value === opt.value ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>
                {opt.label}
              </span>
              {opt.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opt.description}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ColorPicker component - bewaard voor toekomstig gebruik
interface ColorPickerProps {
  label: string
  name: string
  values: string[]
  onChange: (name: string, values: string[]) => void
  disabled?: boolean
  hint?: string
}

// Kleur ID's voor vertaling
type ColorId = 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'pink' | 'teal' | 'yellow' | 'black' | 'white'

const COLOR_OPTIONS_BASE: { id: ColorId; hex: string }[] = [
  { id: 'blue', hex: '#3B82F6' },
  { id: 'green', hex: '#22C55E' },
  { id: 'red', hex: '#EF4444' },
  { id: 'orange', hex: '#F97316' },
  { id: 'purple', hex: '#A855F7' },
  { id: 'pink', hex: '#EC4899' },
  { id: 'teal', hex: '#14B8A6' },
  { id: 'yellow', hex: '#EAB308' },
  { id: 'black', hex: '#1F2937' },
  { id: 'white', hex: '#F9FAFB' },
]

// Hook voor vertaalde kleuropties
function useColorOptions() {
  const { t } = useTranslation()
  return COLOR_OPTIONS_BASE.map(color => ({
    ...color,
    name: t(`onboarding.formSteps.colorPicker.colors.${color.id}`)
  }))
}

// Geëxporteerd voor gebruik in andere formulier stappen
export function ColorPicker({ label, name, values, onChange, disabled, hint }: ColorPickerProps) {
  const COLOR_OPTIONS = useColorOptions()
  const [customColor, setCustomColor] = useState('')

  const toggleColor = (hex: string) => {
    if (disabled) return
    const newValues = values.includes(hex) 
      ? values.filter(v => v !== hex)
      : [...values, hex]
    onChange(name, newValues)
  }

  const addCustomColor = () => {
    if (customColor && !values.includes(customColor)) {
      onChange(name, [...values, customColor])
      setCustomColor('')
    }
  }

  return (
    <div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      {hint && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{hint}</p>}
      <div className="mt-3 flex flex-wrap gap-3">
        {COLOR_OPTIONS.map(color => (
          <button
            key={color.hex}
            type="button"
            onClick={() => toggleColor(color.hex)}
            disabled={disabled}
            className={`
              w-10 h-10 rounded-xl border-2 transition-all relative
              ${values.includes(color.hex) ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-800' : 'hover:scale-110'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          >
            {values.includes(color.hex) && (
              <Check className={`w-4 h-4 absolute inset-0 m-auto ${color.hex === '#F9FAFB' ? 'text-gray-800' : 'text-white'}`} />
            )}
          </button>
        ))}
        
    {/* Aangepaste kleuren invoer */}
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={customColor || '#6366F1'}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-10 h-10 rounded-xl cursor-pointer"
            disabled={disabled}
          />
          <button
            type="button"
            onClick={addCustomColor}
            disabled={disabled || !customColor}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Geselecteerde aangepaste kleuren */}
      {values.filter(v => !COLOR_OPTIONS.find(c => c.hex === v)).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {values.filter(v => !COLOR_OPTIONS.find(c => c.hex === v)).map(hex => (
            <div 
              key={hex} 
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700"
            >
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: hex }} />
              <span className="text-xs text-gray-600 dark:text-gray-300">{hex}</span>
              <button onClick={() => toggleColor(hex)} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface TagInputProps {
  label: string
  name: string
  values: string[]
  onChange: (name: string, values: string[]) => void
  placeholder?: string
  disabled?: boolean
  hint?: string
}

function TagInput({ label, name, values, onChange, placeholder, disabled, hint }: TagInputProps) {
  const [input, setInput] = useState('')

  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !values.includes(trimmed)) {
      onChange(name, [...values, trimmed])
      setInput('')
    }
  }

  const removeTag = (tag: string) => {
    onChange(name, values.filter(v => v !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      {hint && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{hint}</p>}
      
      {values.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {values.map(tag => (
            <span 
              key={tag} 
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm"
            >
              {tag}
              <button 
                onClick={() => removeTag(tag)} 
                disabled={disabled}
                className="hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
        />
        <button
          type="button"
          onClick={addTag}
          disabled={disabled || !input.trim()}
          className="px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// ===========================================
// WEBSITE FORMULIER STAPPEN
// ===========================================
// OPMERKING: Deze stappen zijn alleen voor AANVULLENDE informatie.
// Basisinformatie zoals companyName, designStyle, goal, pages, etc.
// is al verzameld tijdens /start onboarding.
// Vragen worden gefilterd op basis van het geselecteerde pakket.

interface FormStepProps {
  data: Record<string, any>
  onChange: (field: string, value: any) => void
  disabled?: boolean
  packageId?: PackageId // Huidig pakket van /start
  onUpgrade?: (packageId: PackageId) => void // Callback voor upgrade
  approvedForDesign?: boolean // Voor samenvatting stap
  onApprovalChange?: (approved: boolean) => void // Voor samenvatting stap
}

// Hook om vertaalde pakket config veilig op te halen
function usePackageConfig(packageId?: string): PackageConfig {
  const packageConfigs = usePackageConfigs()
  if (packageId && packageId in packageConfigs) {
    return packageConfigs[packageId as PackageId]
  }
  return packageConfigs.starter // Standaard naar starter
}

// Stap 1: Samenvatting & aanvullende bedrijfsinfo
export function WebsiteBedrijfStep({ data, onChange, disabled }: FormStepProps) {
  const { t } = useTranslation()
  // Toon vooraf ingevulde data van /start als alleen-lezen samenvatting
  const hasPrefilledData = data.businessName || data.companyName || data.contactEmail

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{t('onboarding.sections.bedrijf.title')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('onboarding.sections.bedrijf.description')}</p>
        </div>
      </div>

      {/* Toon vooraf ingevulde samenvatting van /start */}
      {hasPrefilledData && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium mb-2">
            <Check className="w-4 h-4" />
            {t('onboarding.prefilled.title')}
          </div>
          <div className="space-y-1 text-sm text-green-600 dark:text-green-300">
            {(data.businessName || data.companyName) && (
              <div>{t('onboarding.prefilled.company')}: <strong>{data.businessName || data.companyName}</strong></div>
            )}
            {data.contactEmail && (
              <div className="break-all">{t('onboarding.prefilled.email')}: <strong>{data.contactEmail}</strong></div>
            )}
            {data.industry && (
              <div>{t('onboarding.prefilled.industry')}: <strong>{data.industry}</strong></div>
            )}
          </div>
        </div>
      )}

      {/* Vraag alleen naar AANVULLENDE info die niet verzameld is bij /start */}
      <TextArea
        label={t('onboarding.questions.businessDescription.label')}
        name="aboutBusiness"
        value={data.aboutBusiness || data.uniqueFeatures || ''}
        onChange={onChange}
        placeholder={t('onboarding.questions.businessDescription.placeholder')}
        required
        disabled={disabled}
        hint={t('onboarding.questions.businessDescription.helpText')}
        rows={4}
      />

      <TextArea
        label={t('onboarding.questions.targetAudience.label')}
        name="targetAudienceDetails"
        value={data.targetAudienceDetails || ''}
        onChange={onChange}
        placeholder={t('onboarding.questions.targetAudience.placeholder')}
        disabled={disabled}
        hint={t('onboarding.questions.targetAudience.description')}
      />

      <TextInput
        label={t('onboarding.questions.preferredDomain.label')}
        name="preferredDomain"
        value={data.preferredDomain || data.existingDomain || ''}
        onChange={onChange}
        placeholder={t('onboarding.questions.preferredDomain.placeholder')}
        disabled={disabled}
        hint={t('onboarding.questions.preferredDomain.hint')}
      />

      <RadioGroup
        label={t('onboarding.questions.needsBusinessEmail.label')}
        name="needsBusinessEmail"
        value={data.needsBusinessEmail || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'yes', label: t('onboarding.questions.needsBusinessEmail.options.yes.label'), description: t('onboarding.questions.needsBusinessEmail.options.yes.description') },
          { value: 'already', label: t('onboarding.questions.needsBusinessEmail.options.already.label') },
          { value: 'no', label: t('onboarding.questions.needsBusinessEmail.options.no.label') },
        ]}
      />
    </motion.div>
  )
}

// ===========================================
// BRANDING CONSTANTEN
// ===========================================

// Kleurpalet IDs voor vertaling
type ColorPaletteId = 'modernBlue' | 'freshGreen' | 'warmOrange' | 'royalPurple' | 'elegantPink' | 'oceanTeal' | 'sunsetCoral' | 'businessGrey'

// Base kleurpaletten met IDs
const COLOR_PALETTES_BASE: { id: ColorPaletteId; colors: string[] }[] = [
  { id: 'modernBlue', colors: ['#3B82F6', '#1E40AF', '#60A5FA', '#DBEAFE'] },
  { id: 'freshGreen', colors: ['#10B981', '#047857', '#34D399', '#D1FAE5'] },
  { id: 'warmOrange', colors: ['#F97316', '#C2410C', '#FB923C', '#FFEDD5'] },
  { id: 'royalPurple', colors: ['#8B5CF6', '#5B21B6', '#A78BFA', '#EDE9FE'] },
  { id: 'elegantPink', colors: ['#EC4899', '#BE185D', '#F472B6', '#FCE7F3'] },
  { id: 'oceanTeal', colors: ['#14B8A6', '#0F766E', '#2DD4BF', '#CCFBF1'] },
  { id: 'sunsetCoral', colors: ['#F43F5E', '#BE123C', '#FB7185', '#FFE4E6'] },
  { id: 'businessGrey', colors: ['#475569', '#1E293B', '#64748B', '#F1F5F9'] },
]

// Hook voor vertaalde kleurpaletten
function useColorPalettes() {
  const { t } = useTranslation()
  return COLOR_PALETTES_BASE.map(palette => ({
    ...palette,
    name: t(`onboarding.formSteps.colorPalettes.${palette.id}`)
  }))
}

// Font combination IDs
type FontCombinationId = 'modern' | 'elegant' | 'bold' | 'friendly' | 'creative' | 'funky' | 'retro' | 'tech' | 'luxury' | 'playful'

// Base font combinations
const FONT_COMBINATIONS_BASE: { id: FontCombinationId; heading: string; body: string; style: string; uppercase?: boolean }[] = [
  { id: 'modern', heading: 'Inter', body: 'Inter', style: 'font-sans' },
  { id: 'elegant', heading: 'Playfair Display', body: 'Lato', style: 'font-serif' },
  { id: 'bold', heading: 'Montserrat', body: 'Open Sans', style: 'font-sans font-bold', uppercase: true },
  { id: 'friendly', heading: 'Poppins', body: 'Nunito', style: 'font-sans' },
  { id: 'creative', heading: 'Space Grotesk', body: 'DM Sans', style: 'font-sans' },
  { id: 'funky', heading: 'Bebas Neue', body: 'Quicksand', style: 'font-sans', uppercase: true },
  { id: 'retro', heading: 'Righteous', body: 'Josefin Sans', style: 'font-sans' },
  { id: 'tech', heading: 'Outfit', body: 'IBM Plex Sans', style: 'font-sans' },
  { id: 'luxury', heading: 'Cormorant Garamond', body: 'Raleway', style: 'font-serif' },
  { id: 'playful', heading: 'Fredoka', body: 'Nunito Sans', style: 'font-sans' },
]

// Hook voor vertaalde font combinations
function useFontCombinations() {
  const { t } = useTranslation()
  return FONT_COMBINATIONS_BASE.map(font => ({
    ...font,
    name: t(`onboarding.formSteps.fontCombinations.${font.id}.name`),
    description: t(`onboarding.formSteps.fontCombinations.${font.id}.description`),
    preview: font.uppercase 
      ? t('onboarding.formSteps.fontCombinations.preview').toUpperCase()
      : t('onboarding.formSteps.fontCombinations.preview')
  }))
}

// Design style IDs
type DesignStyleId = 'minimalist' | 'modern' | 'creative' | 'warm' | 'luxury'

// Base design styles
const DESIGN_STYLES_BASE: { id: DesignStyleId; visual: string; gradient: string; accent: string }[] = [
  { id: 'minimalist', visual: '▢ ▢ ▢', gradient: 'from-gray-100 to-white', accent: 'border-gray-300' },
  { id: 'modern', visual: '◢ ◣', gradient: 'from-blue-50 to-indigo-50', accent: 'border-blue-400' },
  { id: 'creative', visual: '◯ △ ◇', gradient: 'from-purple-50 to-pink-50', accent: 'border-purple-400' },
  { id: 'warm', visual: '◠ ◡ ◠', gradient: 'from-orange-50 to-amber-50', accent: 'border-orange-400' },
  { id: 'luxury', visual: '◇ ◆ ◇', gradient: 'from-amber-50 to-yellow-50', accent: 'border-amber-400' },
]

// Hook voor vertaalde design styles
function useDesignStyles() {
  const { t } = useTranslation()
  return DESIGN_STYLES_BASE.map(style => ({
    ...style,
    name: t(`onboarding.formSteps.designStyles.${style.id}.name`),
    description: t(`onboarding.formSteps.designStyles.${style.id}.description`)
  }))
}

// Stap 2: Logo & Huisstijl - Verbeterd met visuele pickers
export function WebsiteBrandingStep({ data, onChange, disabled }: FormStepProps) {
  const { t } = useTranslation()
  const [activeColorPicker, setActiveColorPicker] = useState<number | null>(null)
  const [customColor, setCustomColor] = useState('')
  const [fontsLoaded, setFontsLoaded] = useState(false)
  
  // Gebruik vertaalde constanten
  const COLOR_PALETTES = useColorPalettes()
  const FONT_COMBINATIONS = useFontCombinations()
  const DESIGN_STYLES = useDesignStyles()
  
  // Laad Google Fonts voor preview
  useEffect(() => {
    const fontFamilies = [
      'Inter:wght@400;700',
      'Playfair+Display:wght@400;700',
      'Lato:wght@400;700',
      'Montserrat:wght@400;700;900',
      'Open+Sans:wght@400;700',
      'Poppins:wght@400;700',
      'Nunito:wght@400;700',
      'Space+Grotesk:wght@400;700',
      'DM+Sans:wght@400;700',
      'Bebas+Neue:wght@400',
      'Quicksand:wght@400;700',
      'Righteous:wght@400',
      'Josefin+Sans:wght@400;700',
      'Outfit:wght@400;700',
      'IBM+Plex+Sans:wght@400;700',
      'Cormorant+Garamond:wght@400;700',
      'Raleway:wght@400;700',
      'Fredoka:wght@400;700',
      'Nunito+Sans:wght@400;700'
    ]
    
    const link = document.createElement('link')
    link.href = `https://fonts.googleapis.com/css2?${fontFamilies.map(f => `family=${f}`).join('&')}&display=swap`
    link.rel = 'stylesheet'
    link.onload = () => setFontsLoaded(true)
    document.head.appendChild(link)
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [])
  
  // Voorkom unused variable waarschuwing
  void fontsLoaded
  
  // Haal geselecteerde kleuren op (ondersteuning voor beide veldnamen)
  const selectedColors: string[] = data.brandColors || data.colorPreferences || []
  const selectedFont = data.fontStyle || ''
  const selectedStyle = data.designStyle || ''
  
  // Voeg een kleur toe aan selectie
  const addColor = (color: string) => {
    if (selectedColors.length >= 4) return
    if (!selectedColors.includes(color)) {
      onChange('brandColors', [...selectedColors, color])
    }
  }
  
  // Verwijder een kleur
  const removeColor = (color: string) => {
    onChange('brandColors', selectedColors.filter(c => c !== color))
  }
  
  // Voeg aangepaste kleur toe
  const addCustomColor = () => {
    if (customColor && /^#[0-9A-Fa-f]{6}$/.test(customColor)) {
      addColor(customColor)
      setCustomColor('')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <motion.div 
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Palette className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h3 className="font-bold text-lg text-white">{t('onboarding.formSteps.branding.title')}</h3>
          <p className="text-sm text-gray-400">{t('onboarding.formSteps.branding.subtitle')}</p>
        </div>
      </div>

      {/* ===== KLEUR SELECTIE ===== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500" />
              {t('onboarding.formSteps.branding.colors.title')}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">{t('onboarding.formSteps.branding.colors.hint')}</p>
          </div>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
            {t('onboarding.formSteps.branding.colors.selected', { count: selectedColors.length })}
          </span>
        </div>

        {/* Geselecteerde kleuren preview */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm text-gray-400">{t('onboarding.formSteps.branding.colors.yourColors')}</span>
            {selectedColors.length === 0 && (
              <span className="text-xs text-gray-500 italic">{t('onboarding.formSteps.branding.colors.clickColor')}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 flex-wrap min-h-[48px]">
            {selectedColors.map((color) => (
              <motion.button
                key={color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={() => !disabled && removeColor(color)}
                className="relative group"
                disabled={disabled}
              >
                <div 
                  className="w-12 h-12 rounded-xl shadow-lg border-2 border-white/20 transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                />
                <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <X className="w-4 h-4 text-white" />
                </div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-mono">
                  {color}
                </span>
              </motion.button>
            ))}
            
            {selectedColors.length < 4 && (
              <div className="relative">
                <button
                  onClick={() => setActiveColorPicker(activeColorPicker === -1 ? null : -1)}
                  disabled={disabled}
                  className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-600 hover:border-gray-400 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-5 h-5 text-gray-500" />
                </button>
                
                {/* Aangepaste kleurenkiezer */}
                {activeColorPicker === -1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-14 left-0 z-10 bg-gray-800 border border-gray-700 rounded-xl p-3 shadow-xl"
                  >
                    {/* Sluit knop */}
                    <button
                      onClick={() => setActiveColorPicker(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-3 h-3 text-gray-300" />
                    </button>
                    <input
                      type="color"
                      value={customColor || '#3B82F6'}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-24 h-24 rounded-lg cursor-pointer"
                    />
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-white font-mono"
                      />
                      <button
                        onClick={addCustomColor}
                        className="px-2 py-1 bg-primary-500 text-white rounded text-xs"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Kleurpaletten */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {COLOR_PALETTES.map((palette, i) => (
            <motion.button
              key={palette.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => {
                if (disabled) return
                  // Voeg de primaire kleur van dit palet toe
                addColor(palette.colors[0])
              }}
              disabled={disabled}
              className="group relative bg-gray-800/50 border border-gray-700 rounded-xl p-3 hover:border-gray-500 transition-all hover:scale-[1.02]"
            >
              <div className="flex gap-1 mb-2">
                {palette.colors.map((color, j) => (
                  <motion.div
                    key={j}
                    className="flex-1 h-8 rounded-md first:rounded-l-lg last:rounded-r-lg"
                    style={{ backgroundColor: color }}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!disabled) addColor(color)
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
                {palette.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ===== LETTERTYPE SELECTIE ===== */}
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-white flex items-center gap-2">
            <span className="text-xl">Aa</span>
            {t('onboarding.formSteps.branding.fonts.title')}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">{t('onboarding.formSteps.branding.fonts.hint')}</p>
        </div>

        <div className="grid gap-3">
          {FONT_COMBINATIONS.map((font, i) => {
            const isSelected = selectedFont === font.id
            
            return (
              <motion.button
                key={font.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => !disabled && onChange('fontStyle', font.id)}
                disabled={disabled}
                className={`
                  relative text-left p-4 rounded-xl border-2 transition-all
                  ${isSelected 
                    ? 'border-primary-500 bg-primary-500/10' 
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{font.name}</span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
                
                {/* Lettertype preview */}
                <div 
                  className={`text-2xl text-white mb-1 ${font.id === 'bold' ? 'font-bold' : ''}`}
                  style={{ fontFamily: `'${font.heading}', sans-serif` }}
                >
                  {font.preview}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{font.heading}</span>
                  <span>+</span>
                  <span>{font.body}</span>
                  <span className="text-gray-600">•</span>
                  <span>{font.description}</span>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* ===== DESIGN STIJL ===== */}
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            {t('onboarding.formSteps.branding.designStyle.title')}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">{t('onboarding.formSteps.branding.designStyle.hint')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {DESIGN_STYLES.map((style, i) => {
            const isSelected = selectedStyle === style.id
            
            return (
              <motion.button
                key={style.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => !disabled && onChange('designStyle', style.id)}
                disabled={disabled}
                className={`
                  relative text-left p-4 rounded-xl border transition-all group
                  ${isSelected 
                    ? 'border-primary-500 bg-primary-500/10 ring-1 ring-primary-500/30' 
                    : 'border-gray-700 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'}
                `}
              >
                {/* Visuele indicator - kleiner en strakker */}
                <div className={`text-xl mb-3 transition-colors ${isSelected ? 'text-primary-400' : 'text-gray-500 group-hover:text-gray-400'}`}>
                  {style.visual}
                </div>
                
                <div className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {style.name}
                </div>
                <div className={`text-xs mt-0.5 ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>
                  {style.description}
                </div>
                
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* ===== SELECTIE SAMENVATTING ===== */}
      {(selectedColors.length > 0 || selectedFont || selectedStyle) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-4 border border-gray-700"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white">{t('onboarding.formSteps.branding.selection.title')}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Kleuren */}
            {selectedColors.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs text-gray-500">{t('onboarding.formSteps.branding.selection.colors')}</span>
                <div className="flex gap-1">
                  {selectedColors.map((color: string) => (
                    <div 
                      key={color}
                      className="w-6 h-6 rounded-md border border-white/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Lettertype */}
            {selectedFont && (
              <div className="space-y-1.5">
                <span className="text-xs text-gray-500">{t('onboarding.formSteps.branding.selection.font')}</span>
                <span className="text-sm text-white font-medium">
                  {FONT_COMBINATIONS.find(f => f.id === selectedFont)?.name || selectedFont}
                </span>
              </div>
            )}
            
            {/* Stijl */}
            {selectedStyle && (
              <div className="space-y-1.5">
                <span className="text-xs text-gray-500">{t('onboarding.formSteps.branding.selection.style')}</span>
                <span className="text-sm text-white font-medium">
                  {DESIGN_STYLES.find(s => s.id === selectedStyle)?.name || selectedStyle}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ===== LOGO SECTIE ===== */}
      <div className="space-y-4 pt-4 border-t border-gray-800">
        <RadioGroup
          label={t('onboarding.formSteps.branding.logo.label')}
          name="hasLogo"
          value={data.hasLogo || ''}
          onChange={onChange}
          disabled={disabled}
          options={[
            { value: 'yes', label: t('onboarding.formSteps.branding.logo.options.yes.label'), description: t('onboarding.formSteps.branding.logo.options.yes.description') },
            { value: 'no', label: t('onboarding.formSteps.branding.logo.options.no.label'), description: t('onboarding.formSteps.branding.logo.options.no.description') },
            { value: 'need_refresh', label: t('onboarding.formSteps.branding.logo.options.needRefresh.label') },
          ]}
        />

        {data.hasLogo === 'yes' && (
          <TextArea
            label={t('onboarding.formSteps.branding.logo.describe')}
            name="logoDescription"
            value={data.logoDescription || ''}
            onChange={onChange}
            placeholder={t('onboarding.formSteps.branding.logo.describePlaceholder')}
            disabled={disabled}
            rows={2}
            hint={t('onboarding.formSteps.branding.logo.describeHint')}
          />
        )}

        {/* Logo upsell voor geen logo of vernieuwen */}
        {(data.hasLogo === 'no' || data.hasLogo === 'need_refresh') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">
                  {data.hasLogo === 'need_refresh' ? t('onboarding.formSteps.branding.logo.upsell.titleNew') : t('onboarding.formSteps.branding.logo.upsell.titleNo')}
                </h4>
                <p className="text-sm text-gray-400 mb-3">
                  {t('onboarding.formSteps.branding.logo.upsell.description')}
                </p>
                <div className="flex items-center gap-3">
                  <a 
                    href="/diensten/logo" 
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    <Palette className="w-4 h-4" />
                    {t('onboarding.formSteps.branding.logo.upsell.cta')}
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <span className="text-xs text-gray-500">{t('onboarding.formSteps.branding.logo.upsell.price')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ===== INSPIRATIE ===== */}
      <div className="space-y-4">
        <TagInput
          label={t('onboarding.formSteps.branding.inspiration.label')}
          name="inspirationUrls"
          values={data.inspirationUrls || []}
          onChange={onChange}
          placeholder={t('onboarding.formSteps.branding.inspiration.placeholder')}
          disabled={disabled}
          hint={t('onboarding.formSteps.branding.inspiration.hint')}
        />

        <TextArea
          label={t('onboarding.formSteps.branding.designNotes.label')}
          name="designNotes"
          value={data.designNotes || ''}
          onChange={onChange}
          placeholder={t('onboarding.formSteps.branding.designNotes.placeholder')}
          disabled={disabled}
          rows={3}
        />
      </div>
    </motion.div>
  )
}

// Stap 3: Doelen - alleen aanvullende details, pakket-afhankelijk
export function WebsiteDoelenStep({ data, onChange, disabled, packageId, onUpgrade }: FormStepProps) {
  const { t } = useTranslation()
  // Controleer op vooraf ingevuld doel van /start
  const hasPrefilledGoal = data.goal || data.mainGoal
  const pkg = usePackageConfig(packageId || data.package || data.packageType)

  // Filter contactopties op basis van pakket
  const contactOptions = [
    { value: 'form', label: t('onboarding.formSteps.goals.contactMethods.options.form'), available: true },
    { value: 'email', label: t('onboarding.formSteps.goals.contactMethods.options.email'), available: true },
    { value: 'phone', label: t('onboarding.formSteps.goals.contactMethods.options.phone'), available: true },
    { value: 'whatsapp', label: t('onboarding.formSteps.goals.contactMethods.options.whatsapp'), available: true },
    { value: 'booking', label: t('onboarding.formSteps.goals.contactMethods.options.booking'), available: pkg.features.booking, requiredPkg: 'business' as PackageId },
    { value: 'chat', label: t('onboarding.formSteps.goals.contactMethods.options.chat'), available: pkg.features.chat, requiredPkg: 'business' as PackageId },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{t('onboarding.formSteps.goals.title')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('onboarding.formSteps.goals.subtitle')}</p>
        </div>
      </div>

      {/* Toon vooraf ingevuld doel */}
      {hasPrefilledGoal && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
            <Check className="w-4 h-4" />
            {t('onboarding.formSteps.goals.prefilledGoal.title')}: <strong>{data.goal || data.mainGoal}</strong>
          </div>
        </div>
      )}

      {/* Aanvullende vragen over conversie */}
      <TextArea
        label={t('onboarding.formSteps.goals.callToAction.label')}
        name="callToAction"
        value={data.callToAction || ''}
        onChange={onChange}
        placeholder={t('onboarding.formSteps.goals.callToAction.placeholder')}
        required
        disabled={disabled}
        hint={t('onboarding.formSteps.goals.callToAction.hint')}
      />

      <RadioGroup
        label={t('onboarding.formSteps.goals.conversionSpeed.label')}
        name="conversionSpeed"
        value={data.conversionSpeed || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'direct', label: t('onboarding.formSteps.goals.conversionSpeed.options.direct.label'), description: t('onboarding.formSteps.goals.conversionSpeed.options.direct.description') },
          { value: 'considered', label: t('onboarding.formSteps.goals.conversionSpeed.options.considered.label'), description: t('onboarding.formSteps.goals.conversionSpeed.options.considered.description') },
          { value: 'long', label: t('onboarding.formSteps.goals.conversionSpeed.options.long.label'), description: t('onboarding.formSteps.goals.conversionSpeed.options.long.description') },
        ]}
      />

      {/* Contactmethodes - gefilterd op pakket */}
      <div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('onboarding.formSteps.goals.contactMethods.label')}
        </span>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {t('onboarding.formSteps.goals.contactMethods.hint', { package: pkg.name })}
        </p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {contactOptions.map(opt => {
            const isSelected = (data.contactMethods || ['form', 'email']).includes(opt.value)
            const isLocked = !opt.available
            
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  if (isLocked && onUpgrade && opt.requiredPkg) {
                    onUpgrade(opt.requiredPkg)
                    return
                  }
                  if (disabled || isLocked) return
                  const current = data.contactMethods || ['form', 'email']
                  const newValues = current.includes(opt.value)
                    ? current.filter((v: string) => v !== opt.value)
                    : [...current, opt.value]
                  onChange('contactMethods', newValues)
                }}
                disabled={disabled}
                className={`
                  flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-left transition-all relative min-w-0
                  ${isLocked 
                    ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60'
                    : isSelected 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'}
                  ${disabled ? 'cursor-not-allowed' : isLocked ? 'cursor-pointer' : 'cursor-pointer'}
                `}
              >
                {isLocked && (
                  <Lock className="w-4 h-4 text-gray-400 absolute top-2 right-2" />
                )}
                <div className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                  ${isLocked ? 'border-gray-300 dark:border-gray-600' : isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300 dark:border-gray-500'}
                `}>
                  {isSelected && !isLocked && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm font-medium truncate">{opt.label}</span>
              </button>
            )
          })}
        </div>
        
        {/* Upgrade hint voor vergrendelde features */}
        {!pkg.features.booking && (
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <Sparkles className="w-3 h-3 inline mr-1" />
              <span dangerouslySetInnerHTML={{ __html: t('onboarding.formSteps.goals.contactMethods.upgradeHint') }} />
              {onUpgrade && (
                <button 
                  onClick={() => onUpgrade('business')}
                  className="ml-1 underline hover:no-underline font-medium"
                >
                  {t('onboarding.formSteps.goals.contactMethods.upgradeNow')}
                </button>
              )}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Stap 4: Pagina's - details over gekozen pagina's, met pakket limiet
export function WebsitePaginasStep({ data, onChange, disabled, packageId, onUpgrade }: FormStepProps) {
  const { t } = useTranslation()
  // Toon vooraf ingevulde pagina's van /start
  const prefilledPages = data.pages || data.selectedPages || []
  const customPages = data.customPages || []
  const pkg = usePackageConfig(packageId || data.package || data.packageType)
  
  // Bereken totaal inclusief geselecteerde pagina's
  const allSelectedPages = data.selectedPages || data.pages || []
  const totalPages = allSelectedPages.length + customPages.length
  const pagesRemaining = pkg.maxPages - totalPages
  const isAtLimit = pagesRemaining <= 0

  // Bepaal volgende upgrade pakket
  const getNextPackage = (): PackageId | null => {
    if (pkg.id === 'starter') return 'professional'
    if (pkg.id === 'professional') return 'business'
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{t('onboarding.formSteps.pages.title')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('onboarding.formSteps.pages.subtitle')}</p>
        </div>
      </div>

      {/* Pakket pagina limiet indicator */}
      <div className={`rounded-xl p-4 border ${
        isAtLimit 
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <span className={`font-medium ${isAtLimit ? 'text-red-700 dark:text-red-400' : 'text-blue-700 dark:text-blue-400'}`}>
              {pkg.maxPages >= 100 ? t('onboarding.formSteps.pages.pagesCount', { count: totalPages }) : t('onboarding.formSteps.pages.pagesUsed', { current: totalPages, max: pkg.maxPages })}
            </span>
            <p className={`text-xs mt-0.5 ${isAtLimit ? 'text-red-600 dark:text-red-300' : 'text-blue-600 dark:text-blue-300'}`}>
              {isAtLimit 
                ? t('onboarding.formSteps.pages.packageFull', { package: pkg.name })
                : pkg.maxPages >= 100 
                  ? t('onboarding.formSteps.pages.unlimited', { package: pkg.name })
                  : t('onboarding.formSteps.pages.pagesRemaining', { count: pagesRemaining, package: pkg.name })
              }
            </p>
          </div>
          {isAtLimit && getNextPackage() && onUpgrade && (
            <button
              onClick={() => onUpgrade(getNextPackage()!)}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              {t('onboarding.formSteps.pages.morePages')}
            </button>
          )}
        </div>
      </div>

      {/* Pagina selectie - toon wanneer geen pagina's vooraf geselecteerd zijn */}
      {prefilledPages.length === 0 && (
        <div className="space-y-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('onboarding.formSteps.pages.whichPages')}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(['home', 'about', 'services', 'contact', 'portfolio', 'blog', 'faq', 'pricing', 'team'] as const).map((pageKey) => {
              const page = t(`onboarding.formSteps.pages.pageOptions.${pageKey}`)
              const selectedPages = data.selectedPages || []
              const isSelected = selectedPages.includes(page)
              const wouldExceedLimit = !isSelected && selectedPages.length >= pkg.maxPages
              
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => {
                    if (disabled) return
                    if (wouldExceedLimit) {
                      if (onUpgrade && getNextPackage()) onUpgrade(getNextPackage()!)
                      return
                    }
                    const newPages = isSelected 
                      ? selectedPages.filter((p: string) => p !== page)
                      : [...selectedPages, page]
                    onChange('selectedPages', newPages)
                    onChange('pages', newPages)
                  }}
                  disabled={disabled}
                  className={`
                    p-3 rounded-xl border text-left transition-all flex items-center gap-2
                    ${isSelected 
                      ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300' 
                      : wouldExceedLimit
                        ? 'border-gray-600 bg-gray-800/30 text-gray-500 cursor-not-allowed'
                        : 'border-gray-700 bg-gray-800/30 text-gray-300 hover:border-gray-600'}
                  `}
                >
                  <div className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                    ${isSelected ? 'border-amber-500 bg-amber-500' : 'border-gray-500'}
                  `}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm font-medium">{page}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Toon vooraf geselecteerde pagina's */}
      {prefilledPages.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium mb-2">
            <Check className="w-4 h-4" />
            {t('onboarding.formSteps.pages.prefilledPages.title')} ({prefilledPages.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {prefilledPages.map((page: string) => (
              <span key={page} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded text-sm">
                {page}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Extra pagina's toevoegen - met limiet controle */}
      <TagInput
        label={t('onboarding.formSteps.pages.customPages.label')}
        name="customPages"
        values={customPages}
        onChange={(name, values) => {
          // Controleer of toevoegen limiet zou overschrijden
          if (values.length > customPages.length && allSelectedPages.length + values.length > pkg.maxPages) {
            // Zou limiet overschrijden - toon upgrade prompt
            if (onUpgrade && getNextPackage()) {
              onUpgrade(getNextPackage()!)
            }
            return
          }
          onChange(name, values)
        }}
        placeholder={isAtLimit ? t('onboarding.formSteps.pages.upgradeHint', { package: getNextPackage() || 'Business' }) : t('onboarding.formSteps.pages.customPages.placeholder')}
        disabled={disabled || isAtLimit}
        hint={isAtLimit ? undefined : t('onboarding.formSteps.pages.customPages.hint')}
      />

      {/* Per-pagina details voor belangrijke pagina's */}
      <div className="space-y-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('onboarding.formSteps.pages.pageDetails.title')}
        </span>
        
        {(prefilledPages.includes('Home') || prefilledPages.includes('home')) && (
          <TextArea
            label={t('onboarding.formSteps.pages.pageDetails.home.label')}
            name="homePageDetails"
            value={data.homePageDetails || ''}
            onChange={onChange}
            placeholder={t('onboarding.formSteps.pages.pageDetails.home.placeholder')}
            disabled={disabled}
            rows={2}
          />
        )}

        {(prefilledPages.includes('Diensten') || prefilledPages.includes('services') || prefilledPages.includes('Services')) && (
          <TextArea
            label={t('onboarding.formSteps.pages.pageDetails.services.label')}
            name="servicesDetails"
            value={data.servicesDetails || ''}
            onChange={onChange}
            placeholder={t('onboarding.formSteps.pages.pageDetails.services.placeholder')}
            disabled={disabled}
            rows={2}
          />
        )}

        {(prefilledPages.includes('Over ons') || prefilledPages.includes('about') || prefilledPages.includes('About')) && (
          <TextArea
            label={t('onboarding.formSteps.pages.pageDetails.about.label')}
            name="aboutPageDetails"
            value={data.aboutPageDetails || ''}
            onChange={onChange}
            placeholder={t('onboarding.formSteps.pages.pageDetails.about.placeholder')}
            disabled={disabled}
            rows={2}
          />
        )}
      </div>
    </motion.div>
  )
}

// Stap 5: Content - teksten en foto's, pakket-specifiek
export function WebsiteContentStep({ data, onChange, disabled, packageId, onUpgrade }: FormStepProps) {
  const { t } = useTranslation()
  const pkg = usePackageConfig(packageId || data.package || data.packageType)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
          <Image className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{t('onboarding.formSteps.content.title')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('onboarding.formSteps.content.subtitle')}</p>
        </div>
      </div>

      <RadioGroup
        label={t('onboarding.formSteps.content.hasTexts.label')}
        name="hasContent"
        value={data.hasContent || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'yes', label: t('onboarding.formSteps.content.hasTexts.options.yes.label'), description: t('onboarding.formSteps.content.hasTexts.options.yes.description') },
          { value: 'partial', label: t('onboarding.formSteps.content.hasTexts.options.partial.label') },
          { value: 'no', label: t('onboarding.formSteps.content.hasTexts.options.no.label'), description: t('onboarding.formSteps.content.hasTexts.options.no.description') },
        ]}
      />

      <RadioGroup
        label={t('onboarding.formSteps.content.hasPhotos.label')}
        name="hasPhotos"
        value={data.hasPhotos || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'yes', label: t('onboarding.formSteps.content.hasPhotos.options.yes.label'), description: t('onboarding.formSteps.content.hasPhotos.options.yes.description') },
          { value: 'some', label: t('onboarding.formSteps.content.hasPhotos.options.some.label') },
          { value: 'no', label: t('onboarding.formSteps.content.hasPhotos.options.no.label'), description: t('onboarding.formSteps.content.hasPhotos.options.no.description') },
        ]}
      />

      {/* Foto/Drone upsell voor geen of gedeeltelijke foto's */}
      {(data.hasPhotos === 'some' || data.hasPhotos === 'no') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-sky-500/10 to-blue-500/10 border border-sky-500/30 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <Image className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">
                {t('onboarding.formSteps.content.photoUpsell.title')}
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                {t('onboarding.formSteps.content.photoUpsell.description')}
              </p>
              <a 
                href="/diensten/fotografie" 
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-sky-600 hover:to-blue-600 transition-all"
              >
                <Image className="w-4 h-4" />
                {t('onboarding.formSteps.content.photoUpsell.cta')}
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* Blog content - alleen voor Professional en Business */}
      {pkg.features.blog ? (
        <RadioGroup
          label={t('onboarding.formSteps.content.blog.label')}
          name="wantsBlog"
          value={data.wantsBlog || ''}
          onChange={onChange}
          disabled={disabled}
          options={[
            { value: 'yes', label: t('onboarding.formSteps.content.blog.options.yes.label'), description: t('onboarding.formSteps.content.blog.options.yes.description') },
            { value: 'later', label: t('onboarding.formSteps.content.blog.options.later.label'), description: t('onboarding.formSteps.content.blog.options.later.description') },
            { value: 'no', label: t('onboarding.formSteps.content.blog.options.no.label') },
          ]}
        />
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 opacity-60">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Lock className="w-4 h-4" />
            <span className="font-medium">{t('onboarding.formSteps.content.blog.locked.title')}</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {t('onboarding.formSteps.content.blog.locked.description')}
            {onUpgrade && (
              <button 
                onClick={() => onUpgrade('professional')}
                className="ml-1 text-primary-500 underline hover:no-underline"
              >
                {t('onboarding.formSteps.content.blog.locked.upgrade')}
              </button>
            )}
          </p>
        </div>
      )}

      <TextArea
        label={t('onboarding.formSteps.content.contentNotes.label')}
        name="contentNotes"
        value={data.contentNotes || ''}
        onChange={onChange}
        placeholder={t('onboarding.formSteps.content.contentNotes.placeholder')}
        disabled={disabled}
        rows={3}
      />

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 <span dangerouslySetInnerHTML={{ __html: t('onboarding.formSteps.content.tip') }} />
        </p>
      </div>
    </motion.div>
  )
}

// Stap 6: Planning & Extra - deadline en aanvullingen, pakket samenvatting
export function WebsiteExtraStep({ data, onChange, disabled, packageId, onUpgrade }: FormStepProps) {
  const { t } = useTranslation()
  const pkg = usePackageConfig(packageId || data.package || data.packageType)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
          <Settings className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{t('onboarding.formSteps.extra.title')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('onboarding.formSteps.extra.subtitle')}</p>
        </div>
      </div>

      {/* Pakket samenvatting */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-primary-700 dark:text-primary-300">{t('onboarding.formSteps.extra.packageSummary.package', { name: pkg.name })}</span>
            <span className="text-sm text-primary-600 dark:text-primary-400 ml-2">{pkg.price}</span>
          </div>
          {pkg.id !== 'business' && onUpgrade && (
            <button
              onClick={() => onUpgrade(pkg.id === 'starter' ? 'professional' : 'business')}
              className="text-xs px-3 py-1 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
            >
              {t('onboarding.formSteps.extra.packageSummary.upgrade')}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
            {pkg.maxPages >= 100 ? t('onboarding.formSteps.extra.packageSummary.unlimited') : t('onboarding.formSteps.extra.packageSummary.maxPages', { count: pkg.maxPages })}
          </span>
          {pkg.features.blog && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-green-700 dark:text-green-400">
              ✓ {t('onboarding.formSteps.extra.packageSummary.features.blog')}
            </span>
          )}
          {pkg.features.booking && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-green-700 dark:text-green-400">
              ✓ {t('onboarding.formSteps.extra.packageSummary.features.booking')}
            </span>
          )}
          {pkg.features.newsletter && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-green-700 dark:text-green-400">
              ✓ {t('onboarding.formSteps.extra.packageSummary.features.newsletter')}
            </span>
          )}
          {pkg.features.multilang && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-green-700 dark:text-green-400">
              ✓ {t('onboarding.formSteps.extra.packageSummary.features.multilang')}
            </span>
          )}
        </div>
      </div>

      {/* Deadline */}
      <RadioGroup
        label={t('onboarding.formSteps.extra.deadline.label')}
        name="deadline"
        value={data.deadline || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'asap', label: t('onboarding.formSteps.extra.deadline.options.asap.label'), description: t('onboarding.formSteps.extra.deadline.options.asap.description') },
          { value: 'month', label: t('onboarding.formSteps.extra.deadline.options.month.label') },
          { value: 'quarter', label: t('onboarding.formSteps.extra.deadline.options.quarter.label') },
          { value: 'flexible', label: t('onboarding.formSteps.extra.deadline.options.flexible.label'), description: t('onboarding.formSteps.extra.deadline.options.flexible.description') },
          { value: 'specific', label: t('onboarding.formSteps.extra.deadline.options.specific.label') },
        ]}
      />

      {data.deadline === 'specific' && (
        <TextInput
          label={t('onboarding.formSteps.extra.specificDeadline.label')}
          name="specificDeadline"
          value={data.specificDeadline || ''}
          onChange={onChange}
          placeholder={t('onboarding.formSteps.extra.specificDeadline.placeholder')}
          disabled={disabled}
        />
      )}

      {/* Meertalig - alleen voor Business */}
      {pkg.features.multilang && (
        <RadioGroup
          label={t('onboarding.formSteps.extra.multilang.label')}
          name="wantsMultilang"
          value={data.wantsMultilang || ''}
          onChange={onChange}
          disabled={disabled}
          options={[
            { value: 'no', label: t('onboarding.formSteps.extra.multilang.options.no.label') },
            { value: 'en', label: t('onboarding.formSteps.extra.multilang.options.en.label') },
            { value: 'multi', label: t('onboarding.formSteps.extra.multilang.options.multi.label'), description: t('onboarding.formSteps.extra.multilang.options.multi.description') },
          ]}
        />
      )}

      {data.wantsMultilang === 'multi' && (
        <TextInput
          label={t('onboarding.formSteps.extra.multilang.languages.label')}
          name="languages"
          value={data.languages || ''}
          onChange={onChange}
          placeholder={t('onboarding.formSteps.extra.multilang.languages.placeholder')}
          disabled={disabled}
        />
      )}

      {/* Social media links */}
      <div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('onboarding.formSteps.extra.socialMedia.title')}</span>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('onboarding.formSteps.extra.socialMedia.hint')}</p>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextInput
            label="Facebook"
            name="socialFacebook"
            value={data.socialFacebook || ''}
            onChange={onChange}
            placeholder="https://facebook.com/..."
            disabled={disabled}
          />
          <TextInput
            label="Instagram"
            name="socialInstagram"
            value={data.socialInstagram || ''}
            onChange={onChange}
            placeholder="https://instagram.com/..."
            disabled={disabled}
          />
          <TextInput
            label="LinkedIn"
            name="socialLinkedIn"
            value={data.socialLinkedIn || ''}
            onChange={onChange}
            placeholder="https://linkedin.com/..."
            disabled={disabled}
          />
          <TextInput
            label={t('onboarding.formSteps.extra.socialMedia.other')}
            name="socialOther"
            value={data.socialOther || ''}
            onChange={onChange}
            placeholder="TikTok, YouTube, etc."
            disabled={disabled}
          />
        </div>
      </div>

      {/* Laatste opmerkingen */}
      <TextArea
        label={t('onboarding.formSteps.extra.additionalNotes.label')}
        name="additionalNotes"
        value={data.additionalNotes || data.extraFeatures || ''}
        onChange={onChange}
        placeholder={t('onboarding.formSteps.extra.additionalNotes.placeholder')}
        disabled={disabled}
        rows={4}
      />

    </motion.div>
  )
}

// Stap 7: Samenvatting - overzicht van alle ingevulde gegevens
interface SamenvattingStepProps extends FormStepProps {
  onGoToStep?: (stepIndex: number) => void
}

export function WebsiteSamenvattingStep({ data, packageId, onUpgrade, onGoToStep, approvedForDesign, onApprovalChange }: SamenvattingStepProps) {
  const { t } = useTranslation()
  const packageConfigs = usePackageConfigs()
  const pkg = usePackageConfig(packageId || data.package || data.packageType)
  const prefilledPages = data.pages || data.selectedPages || []
  const customPages = data.customPages || []
  const allPages = [...prefilledPages, ...customPages]
  
  // Verkrijg de naam van het volgende pakket voor upgrade hint
  const nextPackageName = pkg.id === 'starter' ? packageConfigs.professional.name : packageConfigs.business.name

  const SummaryItem = ({ label, value }: { label: string; value?: string | null }) => {
    if (!value) return null
    return (
      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
        <span className="text-gray-500 dark:text-gray-400">{label}:</span>
        <span className="font-medium text-gray-900 dark:text-white break-words sm:text-right sm:max-w-[60%]">{value}</span>
      </div>
    )
  }

  // Wijzig knop component
  const EditButton = ({ step }: { step: number }) => {
    if (!onGoToStep) return null
    return (
      <button
        onClick={() => onGoToStep(step)}
        className="ml-auto text-xs px-2 py-1 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors flex items-center gap-1"
      >
        <ArrowUpRight className="w-3 h-3" />
        {t('onboarding.formSteps.summary.edit')}
      </button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{t('onboarding.formSteps.summary.title')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('onboarding.formSteps.summary.subtitle')}</p>
        </div>
      </div>

      {/* Pakket info */}
      <div className="bg-gradient-to-r from-primary-500 to-blue-500 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm opacity-80">{t('onboarding.formSteps.summary.packageInfo.label')}</span>
            <div className="text-xl font-bold">{pkg.name}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{pkg.price}</div>
            <span className="text-sm opacity-80">{pkg.maxPages >= 100 ? t('onboarding.formSteps.extra.packageSummary.unlimited') : t('onboarding.formSteps.extra.packageSummary.maxPages', { count: pkg.maxPages })}</span>
          </div>
        </div>
        {pkg.id !== 'business' && onUpgrade && (
          <button
            onClick={() => onUpgrade(pkg.id === 'starter' ? 'professional' : 'business')}
            className="mt-3 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
          >
            {t('onboarding.formSteps.summary.packageInfo.upgradeHint', { package: nextPackageName })}
          </button>
        )}
      </div>

      {/* Bedrijfsgegevens */}
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <span className="font-medium text-primary-700 dark:text-primary-300">{t('onboarding.formSteps.summary.sections.business.title')}</span>
          <EditButton step={1} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label={t('onboarding.formSteps.summary.sections.business.company')} value={data.businessName || data.companyName} />
          <SummaryItem label={t('onboarding.formSteps.summary.sections.business.email')} value={data.contactEmail} />
          <SummaryItem label={t('onboarding.formSteps.summary.sections.business.industry')} value={data.industry} />
          <SummaryItem label={t('onboarding.formSteps.summary.sections.business.domain')} value={data.preferredDomain || data.existingDomain} />
          <SummaryItem label={t('onboarding.business.email.business.label')} value={
            data.needsBusinessEmail === 'yes' ? t('onboarding.business.email.business.options.yes') :
            data.needsBusinessEmail === 'already' ? t('onboarding.business.email.business.options.already') :
            data.needsBusinessEmail === 'no' ? t('onboarding.business.email.business.options.no') : undefined
          } />
          {data.aboutBusiness && (
            <div className="pt-2 border-t border-primary-200 dark:border-primary-700">
              <span className="text-gray-500 dark:text-gray-400 block mb-1">{t('onboarding.formSteps.summary.sections.business.description')}:</span>
              <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">{data.aboutBusiness}</p>
            </div>
          )}
        </div>
      </div>

      {/* Logo & Huisstijl */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium text-purple-700 dark:text-purple-300">{t('onboarding.formSteps.summary.sections.branding.title')}</span>
          <EditButton step={2} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label={t('onboarding.formSteps.summary.sections.branding.style')} value={data.designStyle} />
          <SummaryItem label={t('onboarding.formSteps.summary.sections.branding.logo')} value={
            data.hasLogo === 'yes' ? t('onboarding.formSteps.branding.logo.options.yes.label') :
            data.hasLogo === 'no' ? t('onboarding.formSteps.branding.logo.options.no.label') :
            data.hasLogo === 'need_refresh' ? t('onboarding.formSteps.branding.logo.options.needRefresh.label') : undefined
          } />
          {(data.brandColors || data.colorPreferences)?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-500 dark:text-gray-400">{t('onboarding.formSteps.summary.sections.branding.colors')}:</span>
              {(data.brandColors || data.colorPreferences)?.map((color: string) => (
                <span 
                  key={color} 
                  className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-600"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
          {data.inspirationUrls?.length > 0 && (
            <div>
              <span className="text-gray-500 dark:text-gray-400">{t('onboarding.formSteps.summary.sections.branding.inspiration')}:</span>
              <span className="ml-2 text-purple-600 dark:text-purple-400">{t('onboarding.formSteps.summary.websiteCount', { count: data.inspirationUrls.length })}</span>
            </div>
          )}
        </div>
      </div>

      {/* Doelen */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="font-medium text-emerald-700 dark:text-emerald-300">{t('onboarding.formSteps.summary.sections.goals.title')}</span>
          <EditButton step={3} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label={t('onboarding.formSteps.summary.sections.goals.mainGoal')} value={data.goal || data.mainGoal} />
          <SummaryItem label={t('onboarding.formSteps.summary.sections.goals.callToAction')} value={data.callToAction} />
          <SummaryItem label={t('onboarding.formSteps.goals.conversionSpeed.label')} value={
            data.conversionSpeed === 'direct' ? t('onboarding.formSteps.goals.conversionSpeed.options.direct.label') :
            data.conversionSpeed === 'considered' ? t('onboarding.formSteps.goals.conversionSpeed.options.considered.label') :
            data.conversionSpeed === 'long' ? t('onboarding.formSteps.goals.conversionSpeed.options.long.label') : undefined
          } />
          {data.contactMethods?.length > 0 && (
            <div>
              <span className="text-gray-500 dark:text-gray-400">{t('onboarding.formSteps.summary.sections.goals.contactMethods')}:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.contactMethods.map((method: string) => (
                  <span key={method} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs">
                    {t(`onboarding.formSteps.goals.contactMethods.options.${method}`)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagina's */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="font-medium text-amber-700 dark:text-amber-300">{t('onboarding.formSteps.summary.sections.pages.title')} ({allPages.length})</span>
          <EditButton step={4} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {allPages.map((page: string) => (
            <span key={page} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded text-xs font-medium">
              {page}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
            <Image className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <span className="font-medium text-cyan-700 dark:text-cyan-300">{t('onboarding.formSteps.summary.sections.content.title')}</span>
          <EditButton step={5} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label={t('onboarding.formSteps.summary.sections.content.texts')} value={
            data.hasContent === 'yes' ? t('onboarding.formSteps.content.texts.options.yes') :
            data.hasContent === 'partial' ? t('onboarding.formSteps.content.texts.options.partial') :
            data.hasContent === 'no' ? t('onboarding.formSteps.content.texts.options.no') : undefined
          } />
          <SummaryItem label={t('onboarding.formSteps.summary.sections.content.photos')} value={
            data.hasPhotos === 'yes' ? t('onboarding.formSteps.content.photos.options.yes') :
            data.hasPhotos === 'some' ? t('onboarding.formSteps.content.photos.options.some') :
            data.hasPhotos === 'no' ? t('onboarding.formSteps.content.photos.options.no') : undefined
          } />
          {pkg.features.blog && (
            <SummaryItem label={t('onboarding.formSteps.summary.sections.content.blog')} value={
              data.wantsBlog === 'yes' ? t('common.yes') :
              data.wantsBlog === 'later' ? t('common.later') :
              data.wantsBlog === 'no' ? t('common.no') : undefined
            } />
          )}
        </div>
      </div>

      {/* Planning */}
      <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Settings className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <span className="font-medium text-violet-700 dark:text-violet-300">{t('onboarding.formSteps.summary.sections.planning.title')}</span>
          <EditButton step={6} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label={t('onboarding.formSteps.summary.sections.planning.deadline')} value={
            data.deadline === 'asap' ? t('onboarding.formSteps.extra.deadline.options.asap') :
            data.deadline === 'month' ? t('onboarding.formSteps.extra.deadline.options.month') :
            data.deadline === 'quarter' ? t('onboarding.formSteps.extra.deadline.options.quarter') :
            data.deadline === 'flexible' ? t('onboarding.formSteps.extra.deadline.options.flexible') :
            data.deadline === 'specific' ? data.specificDeadline : undefined
          } />
          {pkg.features.multilang && data.wantsMultilang && data.wantsMultilang !== 'no' && (
            <SummaryItem label={t('onboarding.formSteps.summary.sections.planning.languages')} value={
              data.wantsMultilang === 'en' ? t('onboarding.formSteps.extra.multilang.options.en') :
              data.wantsMultilang === 'multi' ? data.languages : undefined
            } />
          )}
        </div>
      </div>

      {/* Bevestiging met goedkeuring checkbox */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium mb-3">
          <Check className="w-5 h-5" />
          {t('onboarding.formSteps.summary.approval.readyTitle')}
        </div>
        <p className="text-sm text-green-600 dark:text-green-300 mb-4">
          {t('onboarding.formSteps.summary.approval.afterSubmit')}
        </p>
        <ul className="mb-4 space-y-1 text-sm text-green-600 dark:text-green-300">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {t('onboarding.formSteps.summary.approval.steps.driveFolder')}
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {t('onboarding.formSteps.summary.approval.steps.uploadContent')}
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {t('onboarding.formSteps.summary.approval.steps.designersStart')}
          </li>
        </ul>

        {/* Goedkeuring checkbox */}
        <div className="border-t border-green-200 dark:border-green-700 pt-4 mt-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={approvedForDesign || false}
                onChange={(e) => onApprovalChange?.(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-6 h-6 border-2 border-green-400 rounded-lg peer-checked:bg-green-500 peer-checked:border-green-500 transition-all flex items-center justify-center">
                {approvedForDesign && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
            <div>
              <span className="font-medium text-green-700 dark:text-green-300 group-hover:text-green-800 dark:group-hover:text-green-200 transition-colors">
                {t('onboarding.formSteps.summary.approval.confirmLabel')}
              </span>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {t('onboarding.formSteps.summary.approval.confirmDescription')}
              </p>
            </div>
          </label>
        </div>
      </div>
    </motion.div>
  )
}

// ===========================================
// EXPORTEER ALLE WEBSITE STAPPEN
// ===========================================

export const WebsiteSteps = {
  bedrijf: WebsiteBedrijfStep,
  branding: WebsiteBrandingStep,
  doelen: WebsiteDoelenStep,
  paginas: WebsitePaginasStep,
  content: WebsiteContentStep,
  extra: WebsiteExtraStep,
  samenvatting: WebsiteSamenvattingStep,
}
