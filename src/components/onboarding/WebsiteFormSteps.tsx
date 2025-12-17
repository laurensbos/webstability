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
  X
} from 'lucide-react'
import { useState } from 'react'

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

function Select({ label, name, value, onChange, options, required, disabled, hint }: SelectProps) {
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

function CheckboxGroup({ label, name, values, onChange, options, disabled, hint, columns = 2 }: CheckboxGroupProps) {
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

function ColorPicker({ label, name, values, onChange, disabled, hint }: ColorPickerProps) {
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

interface FormStepProps {
  data: Record<string, any>
  onChange: (field: string, value: any) => void
  disabled?: boolean
}

// Step 1: Bedrijf
export function WebsiteBedrijfStep({ data, onChange, disabled }: FormStepProps) {
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
          <h3 className="font-semibold text-gray-900 dark:text-white">Bedrijfsinformatie</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Vertel ons over je bedrijf</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Bedrijfsnaam"
          name="businessName"
          value={data.businessName || ''}
          onChange={onChange}
          placeholder="Bijv. Jansen & Zn"
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
        label="Beschrijf je bedrijf"
        name="aboutBusiness"
        value={data.aboutBusiness || ''}
        onChange={onChange}
        placeholder="Wat doet je bedrijf? Welke producten/diensten bied je aan?"
        required
        disabled={disabled}
        hint="Dit helpt ons de juiste tone-of-voice te vinden"
      />

      <TextArea
        label="Doelgroep"
        name="targetAudience"
        value={data.targetAudience || ''}
        onChange={onChange}
        placeholder="Wie zijn je klanten? B2B of B2C? Leeftijd, interesses, etc."
        disabled={disabled}
        hint="Hoe beter we je doelgroep kennen, hoe beter het design"
      />
    </motion.div>
  )
}

// Step 2: Branding
export function WebsiteBrandingStep({ data, onChange, disabled }: FormStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Branding & Huisstijl</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Je visuele identiteit</p>
        </div>
      </div>

      <RadioGroup
        label="Heb je al een logo?"
        name="hasLogo"
        value={data.hasLogo || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'yes', label: 'Ja, ik heb een logo', description: 'Upload je logo in de volgende stap' },
          { value: 'no', label: 'Nee, nog niet', description: 'We kunnen een logo voor je ontwerpen (apart te bestellen)' },
          { value: 'need_refresh', label: 'Ja, maar ik wil een nieuw logo', description: 'We bespreken de mogelijkheden' },
        ]}
      />

      {data.hasLogo === 'yes' && (
        <TextArea
          label="Beschrijf je logo"
          name="logoDescription"
          value={data.logoDescription || ''}
          onChange={onChange}
          placeholder="Beschrijf je logo kort of stuur het per e-mail"
          disabled={disabled}
          rows={2}
        />
      )}

      <ColorPicker
        label="Welke kleuren passen bij je merk?"
        name="brandColors"
        values={data.brandColors || []}
        onChange={onChange}
        disabled={disabled}
        hint="Selecteer 1-3 kleuren die je merk vertegenwoordigen"
      />

      <Select
        label="Welke stijl past bij je bedrijf?"
        name="designStyle"
        value={data.designStyle || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'modern', label: 'Modern & Minimalistisch' },
          { value: 'classic', label: 'Klassiek & Tijdloos' },
          { value: 'bold', label: 'Bold & Opvallend' },
          { value: 'playful', label: 'Speels & Vriendelijk' },
          { value: 'luxury', label: 'Luxe & Exclusief' },
          { value: 'corporate', label: 'Zakelijk & Professioneel' },
        ]}
      />

      <TagInput
        label="Inspiratie websites"
        name="inspirationUrls"
        values={data.inspirationUrls || []}
        onChange={onChange}
        placeholder="https://..."
        disabled={disabled}
        hint="Voeg websites toe die je mooi vindt (druk Enter om toe te voegen)"
      />
    </motion.div>
  )
}

// Step 3: Doelen
export function WebsiteDoelenStep({ data, onChange, disabled }: FormStepProps) {
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
          <h3 className="font-semibold text-gray-900 dark:text-white">Doelen & Doel</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Wat wil je bereiken met je website?</p>
        </div>
      </div>

      <RadioGroup
        label="Wat is het hoofddoel van je website?"
        name="mainGoal"
        value={data.mainGoal || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'leads', label: 'Meer klanten & leads genereren', description: 'Bezoekers omzetten naar contactaanvragen' },
          { value: 'information', label: 'Informeren over mijn bedrijf', description: 'Digitaal visitekaartje met alle info' },
          { value: 'brand', label: 'Merkbekendheid vergroten', description: 'Professionele uitstraling en zichtbaarheid' },
          { value: 'sales', label: 'Online verkopen', description: 'Producten of diensten direct verkopen' },
          { value: 'other', label: 'Anders', description: 'Vul hieronder in' },
        ]}
      />

      {data.mainGoal === 'other' && (
        <TextInput
          label="Beschrijf je doel"
          name="mainGoalOther"
          value={data.mainGoalOther || ''}
          onChange={onChange}
          placeholder="Wat wil je bereiken?"
          disabled={disabled}
        />
      )}

      <Select
        label="Type website"
        name="websiteType"
        value={data.websiteType || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'business', label: 'Bedrijfswebsite' },
          { value: 'portfolio', label: 'Portfolio / Showcase' },
          { value: 'blog', label: 'Blog / Kennisplatform' },
          { value: 'landing', label: 'Landingspagina' },
          { value: 'other', label: 'Anders' },
        ]}
      />

      <TagInput
        label="Concurrenten"
        name="competitors"
        values={data.competitors || []}
        onChange={onChange}
        placeholder="Website of bedrijfsnaam"
        disabled={disabled}
        hint="Ken je concurrenten met een goede website? Voeg ze toe"
      />
    </motion.div>
  )
}

// Step 4: Pagina's
export function WebsitePaginasStep({ data, onChange, disabled }: FormStepProps) {
  const pageOptions = [
    { value: 'home', label: 'Home' },
    { value: 'about', label: 'Over ons' },
    { value: 'services', label: 'Diensten' },
    { value: 'products', label: 'Producten' },
    { value: 'portfolio', label: 'Portfolio / Cases' },
    { value: 'team', label: 'Team' },
    { value: 'contact', label: 'Contact' },
    { value: 'blog', label: 'Blog / Nieuws' },
    { value: 'faq', label: 'FAQ' },
    { value: 'pricing', label: 'Prijzen' },
    { value: 'vacatures', label: 'Vacatures / Werken bij' },
  ]

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
          <h3 className="font-semibold text-gray-900 dark:text-white">Pagina's</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welke pagina's wil je op je website?</p>
        </div>
      </div>

      <CheckboxGroup
        label="Selecteer de pagina's die je nodig hebt"
        name="selectedPages"
        values={data.selectedPages || ['home', 'contact']}
        onChange={onChange}
        options={pageOptions}
        disabled={disabled}
        columns={2}
      />

      <TagInput
        label="Extra pagina's"
        name="customPages"
        values={data.customPages || []}
        onChange={onChange}
        placeholder="Eigen pagina toevoegen..."
        disabled={disabled}
        hint="Mis je een pagina? Voeg hem hier toe"
      />
    </motion.div>
  )
}

// Step 5: Content
export function WebsiteContentStep({ data, onChange, disabled }: FormStepProps) {
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
          { value: 'yes', label: 'Ja, ik lever de teksten aan' },
          { value: 'partial', label: 'Gedeeltelijk, ik heb hulp nodig' },
          { value: 'no', label: 'Nee, ik wil hulp bij het schrijven', description: 'We kunnen AI-gegenereerde teksten maken (gratis inbegrepen)' },
        ]}
      />

      <RadioGroup
        label="Heb je professionele foto's?"
        name="hasPhotos"
        value={data.hasPhotos || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'yes', label: 'Ja, ik heb goede foto\'s' },
          { value: 'some', label: 'Een paar, maar niet genoeg' },
          { value: 'no', label: 'Nee, ik gebruik liever stockfoto\'s' },
          { value: 'need_shoot', label: 'Nee, ik wil een fotoshoot', description: 'We kunnen dit voor je regelen' },
        ]}
      />

      <TextArea
        label="Notities over content"
        name="contentNotes"
        value={data.contentNotes || ''}
        onChange={onChange}
        placeholder="Speciale wensen voor teksten of foto's?"
        disabled={disabled}
        rows={3}
      />
    </motion.div>
  )
}

// Step 6: Extra features
export function WebsiteExtraStep({ data, onChange, disabled }: FormStepProps) {
  const featureOptions = [
    { value: 'contactForm', label: 'Contactformulier' },
    { value: 'blog', label: 'Blog functionaliteit' },
    { value: 'booking', label: 'Online boekingssysteem' },
    { value: 'newsletter', label: 'Nieuwsbrief aanmelding' },
    { value: 'googleMaps', label: 'Google Maps integratie' },
    { value: 'reviews', label: 'Reviews / Testimonials' },
    { value: 'chat', label: 'Live chat widget' },
    { value: 'multilang', label: 'Meerdere talen' },
    { value: 'analytics', label: 'Google Analytics' },
    { value: 'social', label: 'Social media feeds' },
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
          <h3 className="font-semibold text-gray-900 dark:text-white">Extra Features</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Functionaliteiten voor je website</p>
        </div>
      </div>

      <CheckboxGroup
        label="Welke functies wil je op je website?"
        name="features"
        values={data.features || ['contactForm']}
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
        placeholder="www.jouwbedrijf.nl"
        disabled={disabled}
        hint="Heb je al een domeinnaam? Zo niet, dan helpen we je kiezen"
      />

      <TextArea
        label="Overige wensen of opmerkingen"
        name="additionalNotes"
        value={data.additionalNotes || ''}
        onChange={onChange}
        placeholder="Is er nog iets dat we moeten weten?"
        disabled={disabled}
        rows={4}
      />

      {/* Social media links */}
      <div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Social media links</span>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Vul de links in die je wilt tonen</p>
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
            label="Twitter/X"
            name="socialTwitter"
            value={data.socialTwitter || ''}
            onChange={onChange}
            placeholder="https://x.com/..."
            disabled={disabled}
          />
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
}
