import { motion } from 'framer-motion'
import {
  ShoppingBag,
  CreditCard,
  Package,
  Settings,
  Image,
  Check,
  Plus,
  X,
  ArrowUpRight,
  Sparkles,
  Lock,
  Building2,
  Palette
} from 'lucide-react'
import { useState } from 'react'

// ===========================================
// PACKAGE CONFIGURATION FOR WEBSHOP
// ===========================================

export type WebshopPackageId = 'webshopStarter' | 'webshopPro'

export interface WebshopPackageConfig {
  id: WebshopPackageId
  name: string
  price: string
  maxProducts: number
  features: {
    unlimitedProducts: boolean
    advancedFilters: boolean
    multiCurrency: boolean
    abandonedCart: boolean
    loyaltyProgram: boolean
    b2bPortal: boolean
    analytics: boolean
    blog: boolean
  }
}

export const WEBSHOP_PACKAGE_CONFIGS: Record<WebshopPackageId, WebshopPackageConfig> = {
  webshopStarter: {
    id: 'webshopStarter',
    name: 'Webshop Starter',
    price: '€349/maand',
    maxProducts: 100,
    features: {
      unlimitedProducts: false,
      advancedFilters: false,
      multiCurrency: false,
      abandonedCart: false,
      loyaltyProgram: false,
      b2bPortal: false,
      analytics: false,
      blog: false,
    }
  },
  webshopPro: {
    id: 'webshopPro',
    name: 'Webshop Pro',
    price: '€599/maand',
    maxProducts: 999999,
    features: {
      unlimitedProducts: true,
      advancedFilters: true,
      multiCurrency: true,
      abandonedCart: true,
      loyaltyProgram: true,
      b2bPortal: true,
      analytics: true,
      blog: true,
    }
  }
}

// Get the minimum package required for a feature
export function getMinWebshopPackageForFeature(feature: keyof WebshopPackageConfig['features']): WebshopPackageId {
  if (WEBSHOP_PACKAGE_CONFIGS.webshopStarter.features[feature]) return 'webshopStarter'
  return 'webshopPro'
}

// ===========================================
// UPGRADE PROMPT COMPONENT
// ===========================================

interface UpgradePromptProps {
  currentPackage: WebshopPackageId
  requiredPackage: WebshopPackageId
  featureName: string
  onUpgrade?: (packageId: WebshopPackageId) => void
}

export function WebshopUpgradePrompt({ currentPackage, requiredPackage, featureName, onUpgrade }: UpgradePromptProps) {
  const requiredConfig = WEBSHOP_PACKAGE_CONFIGS[requiredPackage]
  const currentConfig = WEBSHOP_PACKAGE_CONFIGS[currentPackage]
  
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="font-medium text-amber-800 dark:text-amber-300">
              {featureName} - {requiredConfig.name} vereist
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
// FORM STEP PROPS
// ===========================================

interface FormStepProps {
  data: Record<string, any>
  onChange: (name: string, value: any) => void
  disabled?: boolean
  packageId?: WebshopPackageId
  onUpgrade?: (packageId: WebshopPackageId) => void
}

// Import shared components from WebsiteFormSteps
// We'll create a shared file later, for now duplicate the essentials

// ===========================================
// SHARED FORM COMPONENTS (duplicated for now)
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
        className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition-all"
      />
    </label>
  )
}

function TextArea({ label, name, value, onChange, placeholder, required, disabled, hint, rows = 4 }: InputProps & { rows?: number }) {
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
        className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition-all resize-none"
      />
    </label>
  )
}

// Select component - exported for potential use
export function Select({ label, name, value, onChange, options, required, disabled, hint }: {
  label: string
  name: string
  value: string
  onChange: (name: string, value: string) => void
  options: { value: string; label: string }[]
  required?: boolean
  disabled?: boolean
  hint?: string
}) {
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
        className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition-all"
      >
        <option value="">Selecteer...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  )
}

function CheckboxGroup({ label, name, values, onChange, options, disabled, hint, columns = 2 }: {
  label: string
  name: string
  values: string[]
  onChange: (name: string, values: string[]) => void
  options: { value: string; label: string; icon?: React.ElementType }[]
  disabled?: boolean
  hint?: string
  columns?: number
}) {
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
      <div className="mt-3 grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
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
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300 dark:border-gray-500'}
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

function RadioGroup({ label, name, value, onChange, options, disabled, hint }: {
  label: string
  name: string
  value: string
  onChange: (name: string, value: string) => void
  options: { value: string; label: string; description?: string }[]
  disabled?: boolean
  hint?: string
}) {
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
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
              ${value === opt.value ? 'border-emerald-500' : 'border-gray-300 dark:border-gray-500'}
            `}>
              {value === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
            </div>
            <div>
              <span className={`text-sm font-medium ${value === opt.value ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'}`}>
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

function TagInput({ label, name, values, onChange, placeholder, disabled, hint }: {
  label: string
  name: string
  values: string[]
  onChange: (name: string, values: string[]) => void
  placeholder?: string
  disabled?: boolean
  hint?: string
}) {
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
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm"
            >
              {tag}
              <button onClick={() => removeTag(tag)} disabled={disabled} className="hover:text-red-500">
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
          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
        />
        <button
          type="button"
          onClick={addTag}
          disabled={disabled || !input.trim()}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// ===========================================
// WEBSHOP FORM STEPS
// ===========================================

// Step 1: Bedrijf (same as website, use shared)
export function WebshopBedrijfStep({ data, onChange, disabled }: FormStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Bedrijfsinformatie</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Vertel ons over je webshop</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Bedrijfsnaam / Webshopnaam"
          name="businessName"
          value={data.businessName || ''}
          onChange={onChange}
          placeholder="Bijv. Fashion Store"
          required
          disabled={disabled}
        />
        <TextInput
          label="Contactpersoon"
          name="contactName"
          value={data.contactName || ''}
          onChange={onChange}
          placeholder="Voornaam Achternaam"
          required
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="E-mailadres"
          name="contactEmail"
          value={data.contactEmail || ''}
          onChange={onChange}
          placeholder="email@bedrijf.nl"
          type="email"
          required
          disabled={disabled}
        />
        <TextInput
          label="Telefoonnummer"
          name="contactPhone"
          value={data.contactPhone || ''}
          onChange={onChange}
          placeholder="06-12345678"
          type="tel"
          disabled={disabled}
        />
      </div>

      <TextArea
        label="Wat verkoop je?"
        name="aboutBusiness"
        value={data.aboutBusiness || ''}
        onChange={onChange}
        placeholder="Beschrijf je producten of diensten..."
        required
        disabled={disabled}
      />

      <TextArea
        label="Doelgroep"
        name="targetAudience"
        value={data.targetAudience || ''}
        onChange={onChange}
        placeholder="Wie zijn je klanten? B2B of B2C?"
        disabled={disabled}
      />
    </motion.div>
  )
}

// Step 2: Branding
export function WebshopBrandingStep({ data, onChange, disabled }: FormStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <Image className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Branding & Stijl</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Het uiterlijk van je webshop</p>
        </div>
      </div>

      <RadioGroup
        label="Heb je al een logo?"
        name="hasLogo"
        value={data.hasLogo || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'yes', label: 'Ja, ik heb een logo' },
          { value: 'no', label: 'Nee, ik wil graag een logo laten maken' },
        ]}
      />

      <RadioGroup
        label="Welke stijl past bij je webshop?"
        name="webshopStyle"
        value={data.webshopStyle || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'minimal', label: 'Minimalistisch', description: 'Strak, veel witruimte, focus op producten' },
          { value: 'bold', label: 'Bold & Opvallend', description: 'Felle kleuren, grote typografie' },
          { value: 'luxury', label: 'Luxe & Premium', description: 'Elegant, donkere kleuren, exclusief gevoel' },
          { value: 'playful', label: 'Speels & Vrolijk', description: 'Kleurrijk, leuk, informeel' },
          { value: 'corporate', label: 'Zakelijk', description: 'Professioneel, vertrouwenwekkend, B2B' },
        ]}
      />

      <TagInput
        label="Voorbeeld webshops die je mooi vindt"
        name="exampleShops"
        values={data.exampleShops || []}
        onChange={onChange}
        placeholder="https://..."
        disabled={disabled}
        hint="Voeg URLs toe van webshops die je aanspreken"
      />
    </motion.div>
  )
}

// Step 3: Producten - with package-based limits
export function WebshopProductenStep({ data, onChange, disabled, packageId = 'webshopStarter', onUpgrade }: FormStepProps) {
  const currentPackage = WEBSHOP_PACKAGE_CONFIGS[packageId] || WEBSHOP_PACKAGE_CONFIGS.webshopStarter
  const isPro = packageId === 'webshopPro'
  
  // Check if user selected more products than their package allows
  const selectedProductCount = data.estimatedProductCount || ''
  const needsUpgrade = !isPro && (selectedProductCount === '200-500' || selectedProductCount === '500+')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Package className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Producten</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Informatie over je productassortiment
            <span className="ml-2 text-emerald-600 dark:text-emerald-400">
              (max {isPro ? 'onbeperkt' : currentPackage.maxProducts} producten)
            </span>
          </p>
        </div>
      </div>

      <TagInput
        label="Productcategorieën"
        name="productCategories"
        values={data.productCategories || []}
        onChange={onChange}
        placeholder="Bijv. Kleding, Schoenen, Accessoires..."
        disabled={disabled}
        hint="In welke categorieën zijn je producten ingedeeld?"
      />

      <RadioGroup
        label="Hoeveel producten ga je verkopen?"
        name="estimatedProductCount"
        value={data.estimatedProductCount || ''}
        onChange={onChange}
        disabled={disabled}
        options={isPro ? [
          { value: '1-50', label: '1 - 50 producten', description: 'Klein assortiment' },
          { value: '50-200', label: '50 - 200 producten', description: 'Gemiddeld assortiment' },
          { value: '200-500', label: '200 - 500 producten', description: 'Groot assortiment' },
          { value: '500+', label: '500+ producten', description: 'Zeer groot assortiment' },
        ] : [
          { value: '1-50', label: '1 - 50 producten', description: 'Klein assortiment' },
          { value: '50-100', label: '50 - 100 producten', description: 'Tot pakket limiet' },
        ]}
      />

      {needsUpgrade && (
        <WebshopUpgradePrompt
          currentPackage={packageId}
          requiredPackage="webshopPro"
          featureName="Meer dan 100 producten"
          onUpgrade={onUpgrade}
        />
      )}

      {!isPro && !needsUpgrade && (
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          💡 Meer producten nodig? Upgrade naar <strong>Webshop Pro</strong> voor onbeperkt producten.
        </div>
      )}

      <RadioGroup
        label="Productbeschrijvingen"
        name="productDescriptions"
        value={data.productDescriptions || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'customer_provides', label: 'Ik lever de teksten aan' },
          { value: 'needs_help', label: 'Ik heb hulp nodig bij het schrijven' },
          { value: 'ai_generated', label: 'Genereer teksten met AI', description: 'We maken professionele beschrijvingen voor je' },
        ]}
      />

      <RadioGroup
        label="Heb je professionele productfoto's?"
        name="hasProductPhotos"
        value={data.hasProductPhotos || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'yes', label: 'Ja, ik heb goede foto\'s' },
          { value: 'needs_editing', label: 'Ja, maar ze moeten bewerkt worden' },
          { value: 'needs_photography', label: 'Nee, ik heb productfotografie nodig' },
        ]}
      />
    </motion.div>
  )
}

// Step 4: Betaling & Verzending
export function WebshopBetalingStep({ data, onChange, disabled }: FormStepProps) {
  const paymentOptions = [
    { value: 'ideal', label: 'iDEAL' },
    { value: 'creditcard', label: 'Creditcard' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'klarna', label: 'Klarna' },
    { value: 'afterpay', label: 'Afterpay' },
    { value: 'bancontact', label: 'Bancontact' },
  ]

  const shippingOptions = [
    { value: 'postnl', label: 'PostNL' },
    { value: 'dhl', label: 'DHL' },
    { value: 'dpd', label: 'DPD' },
    { value: 'pickup', label: 'Afhalen' },
    { value: 'other', label: 'Anders' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Betaling & Verzending</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Hoe kunnen klanten betalen en ontvangen?</p>
        </div>
      </div>

      <CheckboxGroup
        label="Welke betaalmethoden wil je aanbieden?"
        name="paymentMethods"
        values={data.paymentMethods || ['ideal']}
        onChange={onChange}
        options={paymentOptions}
        disabled={disabled}
        columns={3}
      />

      <CheckboxGroup
        label="Verzendmethoden"
        name="shippingMethods"
        values={data.shippingMethods || []}
        onChange={onChange}
        options={shippingOptions}
        disabled={disabled}
        columns={3}
      />

      <TextArea
        label="Notities over verzending"
        name="shippingNotes"
        value={data.shippingNotes || ''}
        onChange={onChange}
        placeholder="Bijv. gratis verzending vanaf €50, alleen NL/BE, etc."
        disabled={disabled}
        rows={3}
      />
    </motion.div>
  )
}

// Step 5: Features - with package-based filtering
export function WebshopFeaturesStep({ data, onChange, disabled, packageId = 'webshopStarter', onUpgrade }: FormStepProps) {
  const currentPackage = WEBSHOP_PACKAGE_CONFIGS[packageId] || WEBSHOP_PACKAGE_CONFIGS.webshopStarter
  
  // Base features available for all packages
  const baseFeatureOptions = [
    { value: 'inventory', label: 'Voorraadbeheer', proOnly: false },
    { value: 'customerAccounts', label: 'Klantaccounts', proOnly: false },
    { value: 'discountCodes', label: 'Kortingscodes', proOnly: false },
    { value: 'giftCards', label: 'Cadeaubonnen', proOnly: false },
    { value: 'reviews', label: 'Productreviews', proOnly: false },
    { value: 'multipleImages', label: 'Meerdere productfoto\'s', proOnly: false },
  ]
  
  // Pro-only features
  const proFeatureOptions = [
    { value: 'newsletter', label: 'Nieuwsbrief integratie', proOnly: true },
    { value: 'wishlist', label: 'Verlanglijst', proOnly: true },
    { value: 'compareProducts', label: 'Producten vergelijken', proOnly: true },
    { value: 'filterSearch', label: 'Geavanceerde filters & zoeken', proOnly: true },
    { value: 'abandonedCart', label: 'Verlaten winkelwagen e-mails', proOnly: true },
    { value: 'loyaltyProgram', label: 'Loyaliteitsprogramma', proOnly: true },
  ]
  
  const isPro = packageId === 'webshopPro'
  const visibleProFeatures = isPro ? proFeatureOptions : []

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
          <h3 className="font-semibold text-gray-900 dark:text-white">Functionaliteiten</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welke features wil je in je webshop?
            <span className="ml-2 text-emerald-600 dark:text-emerald-400">
              ({currentPackage.name})
            </span>
          </p>
        </div>
      </div>

      {/* Package summary */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-medium text-emerald-800 dark:text-emerald-300">
            {currentPackage.name} - {currentPackage.price}
          </span>
        </div>
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          {isPro ? 'Onbeperkt producten + alle premium functies' : `Tot ${currentPackage.maxProducts} producten`}
        </p>
      </div>

      {/* Base features */}
      <div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
          Standaard functies (inbegrepen)
        </span>
        <CheckboxGroup
          label=""
          name="features"
          values={data.features || ['inventory', 'discountCodes']}
          onChange={onChange}
          options={baseFeatureOptions}
          disabled={disabled}
          columns={2}
        />
      </div>

      {/* Pro features */}
      {isPro ? (
        <div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            Pro functies
          </span>
          <CheckboxGroup
            label=""
            name="proFeatures"
            values={data.proFeatures || []}
            onChange={onChange}
            options={visibleProFeatures}
            disabled={disabled}
            columns={2}
          />
        </div>
      ) : (
        <WebshopUpgradePrompt
          currentPackage={packageId}
          requiredPackage="webshopPro"
          featureName="Premium functies (nieuwsbrief, verlanglijst, etc.)"
          onUpgrade={onUpgrade}
        />
      )}

      <TextInput
        label="Bestaand domein"
        name="existingDomain"
        value={data.existingDomain || ''}
        onChange={onChange}
        placeholder="www.jouwwebshop.nl"
        disabled={disabled}
        hint="Heb je al een domeinnaam?"
      />

      <TextArea
        label="Overige wensen"
        name="additionalNotes"
        value={data.additionalNotes || ''}
        onChange={onChange}
        placeholder="Zijn er nog andere dingen die we moeten weten?"
        disabled={disabled}
        rows={4}
      />
    </motion.div>
  )
}

// Step 6: Content
export function WebshopContentStep({ data, onChange, disabled }: FormStepProps) {
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
          <h3 className="font-semibold text-gray-900 dark:text-white">Content & Pagina's</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Extra pagina's naast de productpagina's</p>
        </div>
      </div>

      <CheckboxGroup
        label="Welke pagina's wil je?"
        name="additionalPages"
        values={data.additionalPages || ['home', 'contact']}
        onChange={onChange}
        options={[
          { value: 'home', label: 'Homepage' },
          { value: 'about', label: 'Over ons' },
          { value: 'contact', label: 'Contact' },
          { value: 'faq', label: 'FAQ' },
          { value: 'blog', label: 'Blog' },
          { value: 'size_guide', label: 'Maattabel' },
          { value: 'shipping', label: 'Verzending & Retour' },
          { value: 'terms', label: 'Algemene voorwaarden' },
        ]}
        disabled={disabled}
        columns={2}
      />

      <RadioGroup
        label="Wie levert de teksten?"
        name="contentProvider"
        value={data.contentProvider || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'customer', label: 'Ik lever alle teksten aan' },
          { value: 'help', label: 'Ik heb hulp nodig' },
          { value: 'generate', label: 'Genereer met AI' },
        ]}
      />

      <TagInput
        label="Concurrenten"
        name="competitors"
        values={data.competitors || []}
        onChange={onChange}
        placeholder="Website of bedrijfsnaam"
        disabled={disabled}
        hint="Webshops van concurrenten die we kunnen bekijken"
      />
    </motion.div>
  )
}

// ===========================================
// SAMENVATTING STEP
// ===========================================

interface SamenvattingStepProps extends FormStepProps {
  onGoToStep?: (stepIndex: number) => void
}

export function WebshopSamenvattingStep({ data, packageId, onUpgrade, onGoToStep }: SamenvattingStepProps) {
  const pkg = WEBSHOP_PACKAGE_CONFIGS[packageId as WebshopPackageId] || WEBSHOP_PACKAGE_CONFIGS.webshopStarter

  const SummaryItem = ({ label, value }: { label: string; value?: string | null }) => {
    if (!value) return null
    return (
      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
        <span className="text-gray-500 dark:text-gray-400">{label}:</span>
        <span className="font-medium text-gray-900 dark:text-white break-words sm:text-right sm:max-w-[60%]">{value}</span>
      </div>
    )
  }

  const EditButton = ({ step }: { step: number }) => {
    if (!onGoToStep) return null
    return (
      <button
        onClick={() => onGoToStep(step)}
        className="ml-auto text-xs px-2 py-1 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors flex items-center gap-1"
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
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm opacity-80">Gekozen pakket</span>
            <div className="text-xl font-bold">{pkg.name}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{pkg.price}</div>
            <span className="text-sm opacity-80">{pkg.id === 'webshopPro' ? 'Onbeperkt producten' : `Max ${pkg.maxProducts} producten`}</span>
          </div>
        </div>
        {pkg.id !== 'webshopPro' && onUpgrade && (
          <button
            onClick={() => onUpgrade('webshopPro')}
            className="mt-3 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
          >
            Upgrade naar Webshop Pro →
          </button>
        )}
      </div>

      {/* Bedrijfsgegevens */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="font-medium text-emerald-700 dark:text-emerald-300">Bedrijfsgegevens</span>
          <EditButton step={1} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label="Bedrijfsnaam" value={data.businessName} />
          <SummaryItem label="Contactpersoon" value={data.contactName} />
          <SummaryItem label="E-mail" value={data.contactEmail} />
          <SummaryItem label="Telefoon" value={data.contactPhone} />
          <SummaryItem label="Doelgroep" value={data.targetAudience} />
          {data.aboutBusiness && (
            <div className="pt-2 border-t border-emerald-200 dark:border-emerald-700">
              <span className="text-gray-500 dark:text-gray-400 block mb-1">Wat verkoop je:</span>
              <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">{data.aboutBusiness}</p>
            </div>
          )}
        </div>
      </div>

      {/* Branding */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium text-purple-700 dark:text-purple-300">Branding & Stijl</span>
          <EditButton step={2} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label="Logo" value={
            data.hasLogo === 'yes' ? 'Ja, ik heb een logo' :
            data.hasLogo === 'no' ? 'Wil logo laten maken' : undefined
          } />
          <SummaryItem label="Stijl" value={
            data.webshopStyle === 'minimal' ? 'Minimalistisch' :
            data.webshopStyle === 'bold' ? 'Bold & Opvallend' :
            data.webshopStyle === 'luxury' ? 'Luxe & Premium' :
            data.webshopStyle === 'playful' ? 'Speels & Vrolijk' :
            data.webshopStyle === 'corporate' ? 'Zakelijk' : undefined
          } />
          {data.exampleShops?.length > 0 && (
            <div>
              <span className="text-gray-500 dark:text-gray-400">Voorbeelden:</span>
              <span className="ml-2 text-purple-600 dark:text-purple-400">{data.exampleShops.length} webshop(s)</span>
            </div>
          )}
        </div>
      </div>

      {/* Producten */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="font-medium text-amber-700 dark:text-amber-300">Producten</span>
          <EditButton step={3} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label="Aantal producten" value={data.estimatedProductCount} />
          <SummaryItem label="Beschrijvingen" value={
            data.productDescriptions === 'customer_provides' ? 'Lever ik aan' :
            data.productDescriptions === 'needs_help' ? 'Hulp nodig' :
            data.productDescriptions === 'ai_generated' ? 'AI-gegenereerd' : undefined
          } />
          <SummaryItem label="Productfoto's" value={
            data.hasProductPhotos === 'yes' ? 'Ja, goede foto\'s' :
            data.hasProductPhotos === 'needs_editing' ? 'Moeten bewerkt worden' :
            data.hasProductPhotos === 'needs_photography' ? 'Fotografie nodig' : undefined
          } />
          {data.productCategories?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {data.productCategories.map((cat: string) => (
                <span key={cat} className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded text-xs">
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Betaling & Verzending */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-medium text-blue-700 dark:text-blue-300">Betaling & Verzending</span>
          <EditButton step={4} />
        </div>
        <div className="space-y-2 text-sm">
          {data.paymentMethods?.length > 0 && (
            <div>
              <span className="text-gray-500 dark:text-gray-400">Betaalmethoden:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.paymentMethods.map((method: string) => (
                  <span key={method} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs capitalize">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          )}
          {data.shippingMethods?.length > 0 && (
            <div>
              <span className="text-gray-500 dark:text-gray-400">Verzending:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.shippingMethods.map((method: string) => (
                  <span key={method} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs capitalize">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Settings className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <span className="font-medium text-violet-700 dark:text-violet-300">Functionaliteiten</span>
          <EditButton step={5} />
        </div>
        {data.features?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.features.map((feature: string) => (
              <span key={feature} className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded text-xs">
                {feature === 'inventory' ? 'Voorraadbeheer' :
                 feature === 'customerAccounts' ? 'Klantaccounts' :
                 feature === 'discountCodes' ? 'Kortingscodes' :
                 feature === 'giftCards' ? 'Cadeaubonnen' :
                 feature === 'reviews' ? 'Reviews' :
                 feature === 'newsletter' ? 'Nieuwsbrief' :
                 feature === 'wishlist' ? 'Verlanglijst' :
                 feature === 'abandonedCart' ? 'Verlaten winkelwagen' :
                 feature}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium">
          <Check className="w-5 h-5" />
          Klaar om te versturen!
        </div>
        <p className="text-sm text-green-600 dark:text-green-300 mt-2">
          Na het indienen:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-green-600 dark:text-green-300">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Je Google Drive link staat in je welkomst-email
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Bevestiging van je ontwerp-afspraak
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Toegang tot je persoonlijke klantportaal
          </li>
        </ul>
      </div>
    </motion.div>
  )
}

// ===========================================
// EXPORT
// ===========================================

export const WebshopSteps = {
  bedrijf: WebshopBedrijfStep,
  branding: WebshopBrandingStep,
  producten: WebshopProductenStep,
  betaling: WebshopBetalingStep,
  features: WebshopFeaturesStep,
  content: WebshopContentStep,
  samenvatting: WebshopSamenvattingStep,
}
