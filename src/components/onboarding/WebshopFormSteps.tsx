import { motion } from 'framer-motion'
import {
  ShoppingBag,
  CreditCard,
  Package,
  Settings,
  Image,
  Check,
  Plus,
  X
} from 'lucide-react'
import { useState } from 'react'

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
// FORM STEP PROPS
// ===========================================

interface FormStepProps {
  data: Record<string, any>
  onChange: (field: string, value: any) => void
  disabled?: boolean
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

// Step 3: Producten
export function WebshopProductenStep({ data, onChange, disabled }: FormStepProps) {
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
          <p className="text-sm text-gray-500 dark:text-gray-400">Informatie over je productassortiment</p>
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
        options={[
          { value: '1-50', label: '1 - 50 producten', description: 'Klein assortiment' },
          { value: '50-200', label: '50 - 200 producten', description: 'Gemiddeld assortiment' },
          { value: '200-500', label: '200 - 500 producten', description: 'Groot assortiment' },
          { value: '500+', label: '500+ producten', description: 'Zeer groot assortiment' },
        ]}
      />

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

// Step 5: Features
export function WebshopFeaturesStep({ data, onChange, disabled }: FormStepProps) {
  const featureOptions = [
    { value: 'inventory', label: 'Voorraadbeheer' },
    { value: 'customerAccounts', label: 'Klantaccounts' },
    { value: 'discountCodes', label: 'Kortingscodes' },
    { value: 'giftCards', label: 'Cadeaubonnen' },
    { value: 'reviews', label: 'Productreviews' },
    { value: 'newsletter', label: 'Nieuwsbrief' },
    { value: 'wishlist', label: 'Verlanglijst' },
    { value: 'compareProducts', label: 'Producten vergelijken' },
    { value: 'filterSearch', label: 'Uitgebreide filters' },
    { value: 'multipleImages', label: 'Meerdere productfoto\'s' },
  ]

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
          <p className="text-sm text-gray-500 dark:text-gray-400">Welke features wil je in je webshop?</p>
        </div>
      </div>

      <CheckboxGroup
        label="Selecteer de functies die je nodig hebt"
        name="features"
        values={data.features || ['inventory', 'discountCodes']}
        onChange={onChange}
        options={featureOptions}
        disabled={disabled}
        columns={2}
      />

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
// EXPORT
// ===========================================

export const WebshopSteps = {
  bedrijf: WebshopBedrijfStep,
  branding: WebshopBrandingStep,
  producten: WebshopProductenStep,
  betaling: WebshopBetalingStep,
  features: WebshopFeaturesStep,
  content: WebshopContentStep,
}
