import { motion } from 'framer-motion'
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
// PACKAGE CONFIGURATION
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

export const PACKAGE_CONFIGS: Record<PackageId, PackageConfig> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: '€99/maand',
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
    name: 'Professioneel',
    price: '€149/maand',
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
    name: 'Business',
    price: '€199/maand',
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

// Get the minimum package required for a feature
export function getMinPackageForFeature(feature: keyof PackageConfig['features']): PackageId {
  if (PACKAGE_CONFIGS.starter.features[feature]) return 'starter'
  if (PACKAGE_CONFIGS.professional.features[feature]) return 'professional'
  return 'business'
}

// Helper to format max pages (show "Onbeperkt" for high values)
function formatMaxPages(maxPages: number): string {
  return maxPages >= 100 ? 'Onbeperkt pagina\'s' : `Max ${maxPages} pagina's`
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

// Exported for use in other components
export function UpgradePrompt({ currentPackage, requiredPackage, featureName, onUpgrade }: UpgradePromptProps) {
  const requiredConfig = PACKAGE_CONFIGS[requiredPackage]
  const currentConfig = PACKAGE_CONFIGS[currentPackage]
  
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
              {featureName} - {requiredConfig.name} pakket vereist
            </span>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
            Je huidige pakket ({currentConfig.name}) bevat deze functie niet.
          </p>
          {onUpgrade && (
            <button
              onClick={() => onUpgrade(requiredPackage)}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium text-sm hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              Upgrade naar {requiredConfig.name}
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ===========================================
// SHARED COMPONENTS
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

// Select component - exported for potential use in other form steps
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
        <option value="">Selecteer...</option>
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

// Exported for use in other components
export function CheckboxGroup({ label, name, values, onChange, options, disabled, hint, columns = 2 }: CheckboxGroupProps) {
  const toggleValue = (val: string) => {
    if (disabled) return
    const newValues = values.includes(val) 
      ? values.filter(v => v !== val)
      : [...values, val]
    onChange(name, newValues)
  }

  return (
    <div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      {hint && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{hint}</p>}
      <div className={`mt-3 grid grid-cols-${columns} gap-3`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
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

// ColorPicker component - kept for potential future use
interface ColorPickerProps {
  label: string
  name: string
  values: string[]
  onChange: (name: string, values: string[]) => void
  disabled?: boolean
  hint?: string
}

const COLOR_OPTIONS = [
  { name: 'Blauw', hex: '#3B82F6' },
  { name: 'Groen', hex: '#22C55E' },
  { name: 'Rood', hex: '#EF4444' },
  { name: 'Oranje', hex: '#F97316' },
  { name: 'Paars', hex: '#A855F7' },
  { name: 'Roze', hex: '#EC4899' },
  { name: 'Teal', hex: '#14B8A6' },
  { name: 'Geel', hex: '#EAB308' },
  { name: 'Zwart', hex: '#1F2937' },
  { name: 'Wit', hex: '#F9FAFB' },
]

// Exported for potential use in other form steps
export function ColorPicker({ label, name, values, onChange, disabled, hint }: ColorPickerProps) {
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
        
        {/* Custom color input */}
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
      
      {/* Selected custom colors */}
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
// WEBSITE FORM STEPS
// ===========================================
// NOTE: These steps are for ADDITIONAL information only.
// Basic info like companyName, designStyle, goal, pages, etc.
// is already collected during /start onboarding.
// Questions are filtered based on the selected package.

interface FormStepProps {
  data: Record<string, any>
  onChange: (field: string, value: any) => void
  disabled?: boolean
  packageId?: PackageId // Current package from /start
  onUpgrade?: (packageId: PackageId) => void // Callback for upgrade
  approvedForDesign?: boolean // For samenvatting step
  onApprovalChange?: (approved: boolean) => void // For samenvatting step
}

// Helper to get package config safely
function getPackageConfig(packageId?: string): PackageConfig {
  if (packageId && packageId in PACKAGE_CONFIGS) {
    return PACKAGE_CONFIGS[packageId as PackageId]
  }
  return PACKAGE_CONFIGS.starter // Default to starter
}

// Step 1: Samenvatting & aanvullende bedrijfsinfo
export function WebsiteBedrijfStep({ data, onChange, disabled }: FormStepProps) {
  // Show pre-filled data from /start as read-only summary
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
          <h3 className="font-semibold text-gray-900 dark:text-white">Bedrijfsgegevens</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Controleer en vul aan</p>
        </div>
      </div>

      {/* Show pre-filled summary from /start */}
      {hasPrefilledData && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium mb-2">
            <Check className="w-4 h-4" />
            Gegevens overgenomen van je aanmelding
          </div>
          <div className="space-y-1 text-sm text-green-600 dark:text-green-300">
            {(data.businessName || data.companyName) && (
              <div>Bedrijf: <strong>{data.businessName || data.companyName}</strong></div>
            )}
            {data.contactEmail && (
              <div className="break-all">Email: <strong>{data.contactEmail}</strong></div>
            )}
            {data.industry && (
              <div>Branche: <strong>{data.industry}</strong></div>
            )}
          </div>
        </div>
      )}

      {/* Only ask for ADDITIONAL info not collected at /start */}
      <TextArea
        label="Beschrijf je bedrijf uitgebreider"
        name="aboutBusiness"
        value={data.aboutBusiness || data.uniqueFeatures || ''}
        onChange={onChange}
        placeholder="Vertel ons meer over wat je bedrijf uniek maakt, je diensten/producten, en je verhaal..."
        required
        disabled={disabled}
        hint="Dit helpt ons de juiste toon en stijl te vinden voor je website"
        rows={4}
      />

      <TextArea
        label="Meer over je doelgroep"
        name="targetAudienceDetails"
        value={data.targetAudienceDetails || ''}
        onChange={onChange}
        placeholder="Wie zijn je ideale klanten? Leeftijd, interesses, problemen die je oplost..."
        disabled={disabled}
        hint="Hoe beter we je doelgroep kennen, hoe effectiever de website"
      />

      <TextInput
        label="Gewenste domeinnaam (optioneel)"
        name="preferredDomain"
        value={data.preferredDomain || data.existingDomain || ''}
        onChange={onChange}
        placeholder="bijv. www.jouwbedrijf.nl"
        disabled={disabled}
        hint="Heb je al een domeinnaam of een voorkeur? Laat het leeg als je hulp wilt"
      />

      <RadioGroup
        label="Heb je een zakelijk e-mailadres nodig?"
        name="needsBusinessEmail"
        value={data.needsBusinessEmail || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'yes', label: 'Ja, ik wil een zakelijk e-mail', description: 'Bijv. info@jouwbedrijf.nl' },
          { value: 'already', label: 'Ik heb al een zakelijk e-mailadres' },
          { value: 'no', label: 'Nee, niet nodig' },
        ]}
      />
    </motion.div>
  )
}

// ===========================================
// BRANDING CONSTANTS
// ===========================================

// Curated color palettes for easy selection
const COLOR_PALETTES = [
  { name: 'Modern Blue', colors: ['#3B82F6', '#1E40AF', '#60A5FA', '#DBEAFE'] },
  { name: 'Fresh Green', colors: ['#10B981', '#047857', '#34D399', '#D1FAE5'] },
  { name: 'Warm Orange', colors: ['#F97316', '#C2410C', '#FB923C', '#FFEDD5'] },
  { name: 'Royal Purple', colors: ['#8B5CF6', '#5B21B6', '#A78BFA', '#EDE9FE'] },
  { name: 'Elegant Rose', colors: ['#EC4899', '#BE185D', '#F472B6', '#FCE7F3'] },
  { name: 'Ocean Teal', colors: ['#14B8A6', '#0F766E', '#2DD4BF', '#CCFBF1'] },
  { name: 'Sunset Coral', colors: ['#F43F5E', '#BE123C', '#FB7185', '#FFE4E6'] },
  { name: 'Business Gray', colors: ['#475569', '#1E293B', '#64748B', '#F1F5F9'] },
]

// Font combinations with real previews
const FONT_COMBINATIONS = [
  { 
    id: 'modern',
    name: 'Modern & Clean',
    heading: 'Inter',
    body: 'Inter',
    style: 'font-sans',
    description: 'Strak en professioneel',
    preview: 'Welkom bij uw bedrijf'
  },
  { 
    id: 'elegant',
    name: 'Elegant & Classy',
    heading: 'Playfair Display',
    body: 'Lato',
    style: 'font-serif',
    description: 'Tijdloos en luxueus',
    preview: 'Welkom bij uw bedrijf'
  },
  { 
    id: 'bold',
    name: 'Bold & Impactful',
    heading: 'Montserrat',
    body: 'Open Sans',
    style: 'font-sans font-bold',
    description: 'Sterk en opvallend',
    preview: 'WELKOM BIJ UW BEDRIJF'
  },
  { 
    id: 'friendly',
    name: 'Friendly & Warm',
    heading: 'Poppins',
    body: 'Nunito',
    style: 'font-sans',
    description: 'Toegankelijk en warm',
    preview: 'Welkom bij uw bedrijf'
  },
  { 
    id: 'creative',
    name: 'Creative & Unique',
    heading: 'Space Grotesk',
    body: 'DM Sans',
    style: 'font-sans',
    description: 'Creatief en uniek',
    preview: 'Welkom bij uw bedrijf'
  },
  { 
    id: 'funky',
    name: 'Funky & Bold',
    heading: 'Bebas Neue',
    body: 'Quicksand',
    style: 'font-sans',
    description: 'Opvallend en speels',
    preview: 'WELKOM BIJ UW BEDRIJF'
  },
  { 
    id: 'retro',
    name: 'Retro Vibes',
    heading: 'Righteous',
    body: 'Josefin Sans',
    style: 'font-sans',
    description: 'Vintage met een twist',
    preview: 'Welkom bij uw bedrijf'
  },
  { 
    id: 'tech',
    name: 'Tech & Startup',
    heading: 'Outfit',
    body: 'IBM Plex Sans',
    style: 'font-sans',
    description: 'Modern en technisch',
    preview: 'Welkom bij uw bedrijf'
  },
  { 
    id: 'luxury',
    name: 'Luxury & Premium',
    heading: 'Cormorant Garamond',
    body: 'Raleway',
    style: 'font-serif',
    description: 'Exclusief en verfijnd',
    preview: 'Welkom bij uw bedrijf'
  },
  { 
    id: 'playful',
    name: 'Playful & Fun',
    heading: 'Fredoka',
    body: 'Nunito Sans',
    style: 'font-sans',
    description: 'Vrolijk en energiek',
    preview: 'Welkom bij uw bedrijf'
  },
]

// Design styles with visual examples
const DESIGN_STYLES = [
  { 
    id: 'minimalist',
    name: 'Minimalistisch',
    description: 'Veel witruimte, focus op inhoud',
    visual: '▢ ▢ ▢',
    gradient: 'from-gray-100 to-white',
    accent: 'border-gray-300'
  },
  { 
    id: 'modern',
    name: 'Modern & Strak',
    description: 'Scherpe lijnen, gestroomlijnd',
    visual: '◢ ◣',
    gradient: 'from-blue-50 to-indigo-50',
    accent: 'border-blue-400'
  },
  { 
    id: 'creative',
    name: 'Creatief & Speels',
    description: 'Gedurfd, kleurrijk, uniek',
    visual: '◯ △ ◇',
    gradient: 'from-purple-50 to-pink-50',
    accent: 'border-purple-400'
  },
  { 
    id: 'professional',
    name: 'Corporate & Zakelijk',
    description: 'Betrouwbaar, serieus',
    visual: '▣ ▣ ▣',
    gradient: 'from-slate-50 to-gray-100',
    accent: 'border-slate-400'
  },
  { 
    id: 'warm',
    name: 'Warm & Uitnodigend',
    description: 'Gezellig, persoonlijk',
    visual: '◠ ◡ ◠',
    gradient: 'from-orange-50 to-amber-50',
    accent: 'border-orange-400'
  },
  { 
    id: 'bold',
    name: 'Bold & Gedurfd',
    description: 'Grote statements, impact',
    visual: '■ ■',
    gradient: 'from-red-50 to-rose-50',
    accent: 'border-red-400'
  },
  { 
    id: 'organic',
    name: 'Organisch & Natuurlijk',
    description: 'Zachte vormen, aards',
    visual: '◠ ⌒ ◠',
    gradient: 'from-green-50 to-emerald-50',
    accent: 'border-green-400'
  },
  { 
    id: 'luxury',
    name: 'Luxe & Elegant',
    description: 'Premium uitstraling, verfijnd',
    visual: '◇ ◆ ◇',
    gradient: 'from-amber-50 to-yellow-50',
    accent: 'border-amber-400'
  },
]

// Step 2: Logo & Huisstijl - Enhanced with visual pickers
export function WebsiteBrandingStep({ data, onChange, disabled }: FormStepProps) {
  const [activeColorPicker, setActiveColorPicker] = useState<number | null>(null)
  const [customColor, setCustomColor] = useState('')
  const [fontsLoaded, setFontsLoaded] = useState(false)
  
  // Load Google Fonts for preview
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
  
  // Prevent unused variable warning
  void fontsLoaded
  
  // Get selected colors (support both field names)
  const selectedColors: string[] = data.brandColors || data.colorPreferences || []
  const selectedFont = data.fontStyle || ''
  const selectedStyle = data.designStyle || ''
  
  // Add a color to selection
  const addColor = (color: string) => {
    if (selectedColors.length >= 4) return
    if (!selectedColors.includes(color)) {
      onChange('brandColors', [...selectedColors, color])
    }
  }
  
  // Remove a color
  const removeColor = (color: string) => {
    onChange('brandColors', selectedColors.filter(c => c !== color))
  }
  
  // Add custom color
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
          <h3 className="font-bold text-lg text-white">Branding & Huisstijl</h3>
          <p className="text-sm text-gray-400">Maak je website uniek</p>
        </div>
      </div>

      {/* ===== COLOR SELECTION ===== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500" />
              Kleuren
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">Kies tot 4 kleuren voor je website</p>
          </div>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
            {selectedColors.length}/4 gekozen
          </span>
        </div>

        {/* Selected colors preview */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm text-gray-400">Jouw kleuren:</span>
            {selectedColors.length === 0 && (
              <span className="text-xs text-gray-500 italic">Klik op een kleur hieronder</span>
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
                
                {/* Custom color picker */}
                {activeColorPicker === -1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-14 left-0 z-10 bg-gray-800 border border-gray-700 rounded-xl p-3 shadow-xl"
                  >
                    {/* Close button */}
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

        {/* Color palettes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {COLOR_PALETTES.map((palette, i) => (
            <motion.button
              key={palette.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => {
                if (disabled) return
                // Add the primary color of this palette
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

      {/* ===== FONT SELECTION ===== */}
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-white flex items-center gap-2">
            <span className="text-xl">Aa</span>
            Lettertype
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">Kies een stijl die bij je past</p>
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
                
                {/* Font preview */}
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

      {/* ===== DESIGN STYLE ===== */}
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Design Stijl
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">Welke sfeer past bij jou?</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {DESIGN_STYLES.map((style, i) => {
            const isSelected = selectedStyle === style.id
            
            return (
              <motion.button
                key={style.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => !disabled && onChange('designStyle', style.id)}
                disabled={disabled}
                className={`
                  relative text-left p-4 rounded-xl border-2 transition-all overflow-hidden
                  ${isSelected 
                    ? `border-primary-500 bg-gradient-to-br ${style.gradient}` 
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'}
                `}
              >
                {/* Visual indicator */}
                <div className={`text-3xl mb-2 ${isSelected ? 'text-gray-800' : 'text-gray-500'}`}>
                  {style.visual}
                </div>
                
                <div className={`font-semibold ${isSelected ? 'text-gray-900' : 'text-white'}`}>
                  {style.name}
                </div>
                <div className={`text-xs mt-0.5 ${isSelected ? 'text-gray-700' : 'text-gray-500'}`}>
                  {style.description}
                </div>
                
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* ===== SELECTION SUMMARY ===== */}
      {(selectedColors.length > 0 || selectedFont || selectedStyle) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-4 border border-gray-700"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white">Jouw selectie</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {/* Colors */}
            {selectedColors.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs text-gray-500">Kleuren</span>
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
            
            {/* Font */}
            {selectedFont && (
              <div className="space-y-1.5">
                <span className="text-xs text-gray-500">Lettertype</span>
                <span className="text-sm text-white font-medium">
                  {FONT_COMBINATIONS.find(f => f.id === selectedFont)?.name || selectedFont}
                </span>
              </div>
            )}
            
            {/* Style */}
            {selectedStyle && (
              <div className="space-y-1.5">
                <span className="text-xs text-gray-500">Stijl</span>
                <span className="text-sm text-white font-medium">
                  {DESIGN_STYLES.find(s => s.id === selectedStyle)?.name || selectedStyle}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ===== LOGO SECTION ===== */}
      <div className="space-y-4 pt-4 border-t border-gray-800">
        <RadioGroup
          label="Heb je al een logo?"
          name="hasLogo"
          value={data.hasLogo || ''}
          onChange={onChange}
          disabled={disabled}
          options={[
            { value: 'yes', label: 'Ja, ik heb een logo', description: 'Upload via de Drive link die we klaarzetten' },
            { value: 'no', label: 'Nee, nog niet', description: 'We kunnen een logo voor je ontwerpen' },
            { value: 'need_refresh', label: 'Ja, maar ik wil een nieuw logo' },
          ]}
        />

        {data.hasLogo === 'yes' && (
          <TextArea
            label="Beschrijf je logo"
            name="logoDescription"
            value={data.logoDescription || ''}
            onChange={onChange}
            placeholder="Beschrijf je logo kort (kleuren, vorm, stijl)"
            disabled={disabled}
            rows={2}
            hint="Upload je logobestanden via de Drive link die we voor je klaarzetten"
          />
        )}

        {/* Logo upsell for no logo or need refresh */}
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
                  {data.hasLogo === 'need_refresh' ? 'Nieuw logo nodig?' : 'Logo laten ontwerpen?'}
                </h4>
                <p className="text-sm text-gray-400 mb-3">
                  Een professioneel logo is de basis van je merk. We ontwerpen een uniek logo dat perfect bij je bedrijf past.
                </p>
                <div className="flex items-center gap-3">
                  <a 
                    href="/diensten/logo" 
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    <Palette className="w-4 h-4" />
                    Bekijk logo pakket
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <span className="text-xs text-gray-500">Vanaf €149,-</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ===== INSPIRATION ===== */}
      <div className="space-y-4">
        <TagInput
          label="Inspiratie websites"
          name="inspirationUrls"
          values={data.inspirationUrls || []}
          onChange={onChange}
          placeholder="https://..."
          disabled={disabled}
          hint="Websites die je mooi vindt qua design (druk Enter)"
        />

        <TextArea
          label="Extra wensen voor het design"
          name="designNotes"
          value={data.designNotes || ''}
          onChange={onChange}
          placeholder="Zijn er specifieke elementen die je wilt? Of juist dingen die je wilt vermijden?"
          disabled={disabled}
          rows={3}
        />
      </div>
    </motion.div>
  )
}

// Step 3: Doelen - alleen aanvullende details, pakket-afhankelijk
export function WebsiteDoelenStep({ data, onChange, disabled, packageId, onUpgrade }: FormStepProps) {
  // Check for pre-filled goal from /start
  const hasPrefilledGoal = data.goal || data.mainGoal
  const pkg = getPackageConfig(packageId || data.package || data.packageType)

  // Filter contact options based on package
  const contactOptions = [
    { value: 'form', label: 'Contactformulier', available: true },
    { value: 'email', label: 'E-mail link', available: true },
    { value: 'phone', label: 'Telefoonnummer', available: true },
    { value: 'whatsapp', label: 'WhatsApp knop', available: true },
    { value: 'booking', label: 'Online afspraak maken', available: pkg.features.booking, requiredPkg: 'business' as PackageId },
    { value: 'chat', label: 'Live chat', available: pkg.features.chat, requiredPkg: 'business' as PackageId },
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
          <h3 className="font-semibold text-gray-900 dark:text-white">Doelen & Conversie</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Hoe kunnen we je website laten werken?</p>
        </div>
      </div>

      {/* Show pre-filled goal */}
      {hasPrefilledGoal && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
            <Check className="w-4 h-4" />
            Hoofddoel: <strong>{data.goal || data.mainGoal}</strong>
          </div>
        </div>
      )}

      {/* Aanvullende vragen over conversie */}
      <TextArea
        label="Wat moet een bezoeker doen op je website?"
        name="callToAction"
        value={data.callToAction || ''}
        onChange={onChange}
        placeholder="Bijv. contact opnemen, offerte aanvragen, direct bellen, producten bekijken..."
        required
        disabled={disabled}
        hint="De belangrijkste actie die je bezoekers wilt laten nemen"
      />

      <RadioGroup
        label="Hoe snel wil je dat bezoekers actie ondernemen?"
        name="conversionSpeed"
        value={data.conversionSpeed || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'direct', label: 'Direct contact', description: 'Telefoon/WhatsApp prominent zichtbaar' },
          { value: 'considered', label: 'Na informeren', description: 'Eerst lezen over diensten, dan contact' },
          { value: 'long', label: 'Langere oriëntatie', description: 'Blog, cases, reviews eerst bekijken' },
        ]}
      />

      {/* Contact methods - filtered by package */}
      <div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Welke contactmogelijkheden wil je aanbieden?
        </span>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Beschikbaar in je {pkg.name} pakket
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
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
        
        {/* Upgrade hint for locked features */}
        {!pkg.features.booking && (
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <Sparkles className="w-3 h-3 inline mr-1" />
              Online afspraken & Live chat beschikbaar vanaf het <strong>Business</strong> pakket.
              {onUpgrade && (
                <button 
                  onClick={() => onUpgrade('business')}
                  className="ml-1 underline hover:no-underline font-medium"
                >
                  Upgrade nu →
                </button>
              )}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Step 4: Pagina's - details over gekozen pagina's, met pakket limiet
export function WebsitePaginasStep({ data, onChange, disabled, packageId, onUpgrade }: FormStepProps) {
  // Show pre-filled pages from /start
  const prefilledPages = data.pages || data.selectedPages || []
  const customPages = data.customPages || []
  const pkg = getPackageConfig(packageId || data.package || data.packageType)
  
  const totalPages = prefilledPages.length + customPages.length
  const pagesRemaining = pkg.maxPages - totalPages
  const isAtLimit = pagesRemaining <= 0

  // Determine next upgrade package
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
          <h3 className="font-semibold text-gray-900 dark:text-white">Pagina Details</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Meer info over je pagina's</p>
        </div>
      </div>

      {/* Package page limit indicator */}
      <div className={`rounded-xl p-4 border ${
        isAtLimit 
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <span className={`font-medium ${isAtLimit ? 'text-red-700 dark:text-red-400' : 'text-blue-700 dark:text-blue-400'}`}>
              {pkg.maxPages >= 100 ? `${totalPages} pagina's` : `${totalPages} / ${pkg.maxPages} pagina's`}
            </span>
            <p className={`text-xs mt-0.5 ${isAtLimit ? 'text-red-600 dark:text-red-300' : 'text-blue-600 dark:text-blue-300'}`}>
              {isAtLimit 
                ? `Je ${pkg.name} pakket zit vol` 
                : pkg.maxPages >= 100 
                  ? `Onbeperkt pagina's in ${pkg.name}`
                  : `Nog ${pagesRemaining} pagina${pagesRemaining === 1 ? '' : "'s"} beschikbaar in ${pkg.name}`
              }
            </p>
          </div>
          {isAtLimit && getNextPackage() && onUpgrade && (
            <button
              onClick={() => onUpgrade(getNextPackage()!)}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Meer pagina's
            </button>
          )}
        </div>
      </div>

      {/* Show pre-selected pages */}
      {prefilledPages.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium mb-2">
            <Check className="w-4 h-4" />
            Geselecteerde pagina's ({prefilledPages.length})
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

      {/* Extra pagina's toevoegen - met limiet check */}
      <TagInput
        label="Extra pagina's toevoegen"
        name="customPages"
        values={customPages}
        onChange={(name, values) => {
          // Check if adding would exceed limit
          if (values.length > customPages.length && prefilledPages.length + values.length > pkg.maxPages) {
            // Would exceed limit - show upgrade prompt instead
            if (onUpgrade && getNextPackage()) {
              onUpgrade(getNextPackage()!)
            }
            return
          }
          onChange(name, values)
        }}
        placeholder={isAtLimit ? "Upgrade voor meer pagina's" : "Bijv. Vacatures, Partners, Projecten..."}
        disabled={disabled || isAtLimit}
        hint={isAtLimit ? undefined : "Mis je een pagina in de lijst hierboven? Voeg hem hier toe"}
      />

      {/* Per-page details for important pages */}
      <div className="space-y-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Details per pagina (optioneel)
        </span>
        
        {(prefilledPages.includes('Home') || prefilledPages.includes('home')) && (
          <TextArea
            label="Wat moet op de homepage staan?"
            name="homePageDetails"
            value={data.homePageDetails || ''}
            onChange={onChange}
            placeholder="Belangrijkste boodschap, USP's, featured content..."
            disabled={disabled}
            rows={2}
          />
        )}

        {(prefilledPages.includes('Diensten') || prefilledPages.includes('services') || prefilledPages.includes('Services')) && (
          <TextArea
            label="Welke diensten wil je tonen?"
            name="servicesDetails"
            value={data.servicesDetails || ''}
            onChange={onChange}
            placeholder="Lijst van diensten, prijzen, pakketten..."
            disabled={disabled}
            rows={2}
          />
        )}

        {(prefilledPages.includes('Over ons') || prefilledPages.includes('about') || prefilledPages.includes('About')) && (
          <TextArea
            label="Wat moet op 'Over ons' komen?"
            name="aboutPageDetails"
            value={data.aboutPageDetails || ''}
            onChange={onChange}
            placeholder="Team foto's, geschiedenis, missie/visie..."
            disabled={disabled}
            rows={2}
          />
        )}
      </div>
    </motion.div>
  )
}

// Step 5: Content - teksten en foto's, pakket-specifiek
export function WebsiteContentStep({ data, onChange, disabled, packageId, onUpgrade }: FormStepProps) {
  const pkg = getPackageConfig(packageId || data.package || data.packageType)

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
          <h3 className="font-semibold text-gray-900 dark:text-white">Content & Media</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Teksten en beeldmateriaal</p>
        </div>
      </div>

      <RadioGroup
        label="Heb je al teksten voor je website?"
        name="hasContent"
        value={data.hasContent || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'yes', label: 'Ja, ik lever de teksten aan', description: 'Upload via de Drive link die we klaarzetten' },
          { value: 'partial', label: 'Gedeeltelijk, ik heb hulp nodig' },
          { value: 'no', label: 'Nee, ik wil hulp bij het schrijven', description: 'We maken AI-gegenereerde teksten (gratis inbegrepen)' },
        ]}
      />

      <RadioGroup
        label="Heb je professionele foto's?"
        name="hasPhotos"
        value={data.hasPhotos || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'yes', label: 'Ja, ik heb goede foto\'s', description: 'Upload via de Drive link die we voor je klaarzetten' },
          { value: 'some', label: 'Een paar, maar niet genoeg' },
          { value: 'no', label: 'Nee, gebruik stockfoto\'s', description: 'We zoeken passende stockfoto\'s uit' },
        ]}
      />

      {/* Blog content - only for Professional and Business */}
      {pkg.features.blog ? (
        <RadioGroup
          label="Wil je blog artikelen op je website?"
          name="wantsBlog"
          value={data.wantsBlog || ''}
          onChange={onChange}
          disabled={disabled}
          options={[
            { value: 'yes', label: 'Ja, ik wil een blog', description: 'We helpen met de opzet en eerste artikelen' },
            { value: 'later', label: 'Misschien later', description: 'We bereiden de functie voor' },
            { value: 'no', label: 'Nee, geen blog nodig' },
          ]}
        />
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 opacity-60">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Lock className="w-4 h-4" />
            <span className="font-medium">Blog functionaliteit</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Beschikbaar vanaf het Professioneel pakket.
            {onUpgrade && (
              <button 
                onClick={() => onUpgrade('professional')}
                className="ml-1 text-primary-500 underline hover:no-underline"
              >
                Upgrade →
              </button>
            )}
          </p>
        </div>
      )}

      <TextArea
        label="Specifieke content wensen"
        name="contentNotes"
        value={data.contentNotes || ''}
        onChange={onChange}
        placeholder="Heb je speciale wensen voor teksten, foto's of video's?"
        disabled={disabled}
        rows={3}
      />

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 <strong>Tip:</strong> Na je aanmelding ontvang je van ons een Google Drive link waar je al je bestanden (teksten, logo, foto's) kunt uploaden.
        </p>
      </div>
    </motion.div>
  )
}

// Step 6: Planning & Extra - deadline en aanvullingen, pakket samenvatting
export function WebsiteExtraStep({ data, onChange, disabled, packageId, onUpgrade }: FormStepProps) {
  const pkg = getPackageConfig(packageId || data.package || data.packageType)

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
          <h3 className="font-semibold text-gray-900 dark:text-white">Planning & Afronding</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Laatste details voor je project</p>
        </div>
      </div>

      {/* Package summary */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold text-primary-700 dark:text-primary-300">{pkg.name} pakket</span>
            <span className="text-sm text-primary-600 dark:text-primary-400 ml-2">{pkg.price}</span>
          </div>
          {pkg.id !== 'business' && onUpgrade && (
            <button
              onClick={() => onUpgrade(pkg.id === 'starter' ? 'professional' : 'business')}
              className="text-xs px-3 py-1 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
            >
              Upgrade
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
            {formatMaxPages(pkg.maxPages)}
          </span>
          {pkg.features.blog && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-green-700 dark:text-green-400">
              ✓ Blog
            </span>
          )}
          {pkg.features.booking && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-green-700 dark:text-green-400">
              ✓ Boekingen
            </span>
          )}
          {pkg.features.newsletter && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-green-700 dark:text-green-400">
              ✓ Nieuwsbrief
            </span>
          )}
          {pkg.features.multilang && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-green-700 dark:text-green-400">
              ✓ Meerdere talen
            </span>
          )}
        </div>
      </div>

      {/* Deadline */}
      <RadioGroup
        label="Wanneer wil je de website live hebben?"
        name="deadline"
        value={data.deadline || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'asap', label: 'Zo snel mogelijk', description: 'Binnen 1-2 weken' },
          { value: 'month', label: 'Binnen een maand' },
          { value: 'quarter', label: 'Binnen 3 maanden' },
          { value: 'flexible', label: 'Geen haast', description: 'Kwaliteit boven snelheid' },
          { value: 'specific', label: 'Specifieke datum' },
        ]}
      />

      {data.deadline === 'specific' && (
        <TextInput
          label="Gewenste lanceerdatum"
          name="specificDeadline"
          value={data.specificDeadline || ''}
          onChange={onChange}
          placeholder="Bijv. 1 februari 2025"
          disabled={disabled}
        />
      )}

      {/* Multilang - only for Business */}
      {pkg.features.multilang && (
        <RadioGroup
          label="Wil je de website in meerdere talen?"
          name="wantsMultilang"
          value={data.wantsMultilang || ''}
          onChange={onChange}
          disabled={disabled}
          options={[
            { value: 'no', label: 'Nee, alleen Nederlands' },
            { value: 'en', label: 'Nederlands + Engels' },
            { value: 'multi', label: 'Meerdere talen', description: 'Specificeer hieronder' },
          ]}
        />
      )}

      {data.wantsMultilang === 'multi' && (
        <TextInput
          label="Welke talen?"
          name="languages"
          value={data.languages || ''}
          onChange={onChange}
          placeholder="Bijv. Nederlands, Engels, Duits, Frans"
          disabled={disabled}
        />
      )}

      {/* Social media links */}
      <div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Social media links (optioneel)</span>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Links die je op de website wilt tonen</p>
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
            label="Overige"
            name="socialOther"
            value={data.socialOther || ''}
            onChange={onChange}
            placeholder="TikTok, YouTube, etc."
            disabled={disabled}
          />
        </div>
      </div>

      {/* Final notes */}
      <TextArea
        label="Overige wensen of opmerkingen"
        name="additionalNotes"
        value={data.additionalNotes || data.extraFeatures || ''}
        onChange={onChange}
        placeholder="Is er nog iets dat we moeten weten? Speciale wensen, vragen, of andere opmerkingen..."
        disabled={disabled}
        rows={4}
      />

    </motion.div>
  )
}

// Step 7: Samenvatting - overzicht van alle ingevulde gegevens
interface SamenvattingStepProps extends FormStepProps {
  onGoToStep?: (stepIndex: number) => void
}

export function WebsiteSamenvattingStep({ data, packageId, onUpgrade, onGoToStep, approvedForDesign, onApprovalChange }: SamenvattingStepProps) {
  const pkg = getPackageConfig(packageId || data.package || data.packageType)
  const prefilledPages = data.pages || data.selectedPages || []
  const customPages = data.customPages || []
  const allPages = [...prefilledPages, ...customPages]

  const SummaryItem = ({ label, value }: { label: string; value?: string | null }) => {
    if (!value) return null
    return (
      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
        <span className="text-gray-500 dark:text-gray-400">{label}:</span>
        <span className="font-medium text-gray-900 dark:text-white break-words sm:text-right sm:max-w-[60%]">{value}</span>
      </div>
    )
  }

  // Edit button component
  const EditButton = ({ step }: { step: number }) => {
    if (!onGoToStep) return null
    return (
      <button
        onClick={() => onGoToStep(step)}
        className="ml-auto text-xs px-2 py-1 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors flex items-center gap-1"
      >
        <ArrowUpRight className="w-3 h-3" />
        Wijzig
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
          <h3 className="font-semibold text-gray-900 dark:text-white">Controleer je gegevens</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Alles correct? Dan kunnen we beginnen!</p>
        </div>
      </div>

      {/* Package info */}
      <div className="bg-gradient-to-r from-primary-500 to-blue-500 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm opacity-80">Gekozen pakket</span>
            <div className="text-xl font-bold">{pkg.name}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{pkg.price}</div>
            <span className="text-sm opacity-80">{formatMaxPages(pkg.maxPages)}</span>
          </div>
        </div>
        {pkg.id !== 'business' && onUpgrade && (
          <button
            onClick={() => onUpgrade(pkg.id === 'starter' ? 'professional' : 'business')}
            className="mt-3 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
          >
            Upgrade naar {pkg.id === 'starter' ? 'Professioneel' : 'Business'} →
          </button>
        )}
      </div>

      {/* Bedrijfsgegevens */}
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <span className="font-medium text-primary-700 dark:text-primary-300">Bedrijfsgegevens</span>
          <EditButton step={1} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label="Bedrijfsnaam" value={data.businessName || data.companyName} />
          <SummaryItem label="E-mail" value={data.contactEmail} />
          <SummaryItem label="Branche" value={data.industry} />
          <SummaryItem label="Domein" value={data.preferredDomain || data.existingDomain} />
          <SummaryItem label="Zakelijk e-mail" value={
            data.needsBusinessEmail === 'yes' ? 'Ja, nodig' :
            data.needsBusinessEmail === 'already' ? 'Heb ik al' :
            data.needsBusinessEmail === 'no' ? 'Niet nodig' : undefined
          } />
          {data.aboutBusiness && (
            <div className="pt-2 border-t border-primary-200 dark:border-primary-700">
              <span className="text-gray-500 dark:text-gray-400 block mb-1">Over het bedrijf:</span>
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
          <span className="font-medium text-purple-700 dark:text-purple-300">Logo & Huisstijl</span>
          <EditButton step={2} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label="Design stijl" value={data.designStyle} />
          <SummaryItem label="Logo" value={
            data.hasLogo === 'yes' ? 'Ja, ik heb een logo' :
            data.hasLogo === 'no' ? 'Nee, nog niet' :
            data.hasLogo === 'need_refresh' ? 'Wil nieuw logo' : undefined
          } />
          {(data.brandColors || data.colorPreferences)?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-500 dark:text-gray-400">Kleuren:</span>
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
              <span className="text-gray-500 dark:text-gray-400">Inspiratie:</span>
              <span className="ml-2 text-purple-600 dark:text-purple-400">{data.inspirationUrls.length} website(s)</span>
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
          <span className="font-medium text-emerald-700 dark:text-emerald-300">Doelen & Conversie</span>
          <EditButton step={3} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label="Hoofddoel" value={data.goal || data.mainGoal} />
          <SummaryItem label="Call-to-action" value={data.callToAction} />
          <SummaryItem label="Conversie" value={
            data.conversionSpeed === 'direct' ? 'Direct contact' :
            data.conversionSpeed === 'considered' ? 'Na informeren' :
            data.conversionSpeed === 'long' ? 'Langere oriëntatie' : undefined
          } />
          {data.contactMethods?.length > 0 && (
            <div>
              <span className="text-gray-500 dark:text-gray-400">Contactmethodes:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.contactMethods.map((method: string) => (
                  <span key={method} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs">
                    {method === 'form' ? 'Formulier' :
                     method === 'email' ? 'E-mail' :
                     method === 'phone' ? 'Telefoon' :
                     method === 'whatsapp' ? 'WhatsApp' :
                     method === 'booking' ? 'Afspraken' :
                     method === 'chat' ? 'Live chat' : method}
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
          <span className="font-medium text-amber-700 dark:text-amber-300">Pagina's ({allPages.length})</span>
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
          <span className="font-medium text-cyan-700 dark:text-cyan-300">Content & Media</span>
          <EditButton step={5} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label="Teksten" value={
            data.hasContent === 'yes' ? 'Lever ik aan' :
            data.hasContent === 'partial' ? 'Gedeeltelijk hulp nodig' :
            data.hasContent === 'no' ? 'AI-gegenereerd' : undefined
          } />
          <SummaryItem label="Foto's" value={
            data.hasPhotos === 'yes' ? 'Eigen foto\'s' :
            data.hasPhotos === 'some' ? 'Gedeeltelijk' :
            data.hasPhotos === 'no' ? 'Stockfoto\'s' : undefined
          } />
          {pkg.features.blog && (
            <SummaryItem label="Blog" value={
              data.wantsBlog === 'yes' ? 'Ja' :
              data.wantsBlog === 'later' ? 'Later' :
              data.wantsBlog === 'no' ? 'Nee' : undefined
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
          <span className="font-medium text-violet-700 dark:text-violet-300">Planning</span>
          <EditButton step={6} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label="Deadline" value={
            data.deadline === 'asap' ? 'Zo snel mogelijk' :
            data.deadline === 'month' ? 'Binnen een maand' :
            data.deadline === 'quarter' ? 'Binnen 3 maanden' :
            data.deadline === 'flexible' ? 'Geen haast' :
            data.deadline === 'specific' ? data.specificDeadline : undefined
          } />
          {pkg.features.multilang && data.wantsMultilang && data.wantsMultilang !== 'no' && (
            <SummaryItem label="Talen" value={
              data.wantsMultilang === 'en' ? 'Nederlands + Engels' :
              data.wantsMultilang === 'multi' ? data.languages : undefined
            } />
          )}
        </div>
      </div>

      {/* Confirmation with Approval Checkbox */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium mb-3">
          <Check className="w-5 h-5" />
          Klaar om te versturen!
        </div>
        <p className="text-sm text-green-600 dark:text-green-300 mb-4">
          Na het indienen:
        </p>
        <ul className="mb-4 space-y-1 text-sm text-green-600 dark:text-green-300">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Je project gaat naar de design fase
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            De designers gaan aan de slag met jouw website
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Je ontvangt binnenkort het eerste ontwerp
          </li>
        </ul>

        {/* Approval Checkbox */}
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
                Ik geef akkoord om te starten met het design
              </span>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Door akkoord te geven, bevestig je dat de ingevulde gegevens correct zijn en we kunnen starten met het ontwerp van je website.
              </p>
            </div>
          </label>
        </div>
      </div>
    </motion.div>
  )
}

// ===========================================
// EXPORT ALL WEBSITE STEPS
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
