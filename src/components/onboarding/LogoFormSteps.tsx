import { motion } from 'framer-motion'
import {
  PenTool,
  Palette,
  Image,
  Settings,
  Check,
  Plus,
  X,
  ArrowUpRight,
  Building2
} from 'lucide-react'
import { useState } from 'react'

// ===========================================
// LOGO SERVICE INFO
// ===========================================

export const LOGO_SERVICE_INFO = {
  name: 'Logo Ontwerp',
  price: '€199',
  priceType: 'eenmalig' as const,
  includes: [
    'Intake gesprek',
    'Moodboard met stijlrichtingen',
    '3 unieke concepten',
    '2 revisierondes',
    'Alle bestandsformaten (PNG, SVG, PDF)',
    'Kleur- en zwart-wit versie',
    'Favicon voor website',
    'Stijlgids met kleurcodes',
    'Vectorbestanden (AI, EPS)',
  ]
}

// ===========================================
// SHARED FORM COMPONENTS
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
        className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-all"
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
        className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-all resize-none"
      />
    </label>
  )
}

function CheckboxGroup({ label, name, values, onChange, options, disabled, hint, columns = 2 }: {
  label: string
  name: string
  values: string[]
  onChange: (name: string, values: string[]) => void
  options: { value: string; label: string; description?: string }[]
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
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleValue(opt.value)}
              disabled={disabled}
              className={`
                flex items-start gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all
                ${isSelected 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                ${isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300 dark:border-gray-500'}
              `}>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                <span className="text-sm font-medium">{opt.label}</span>
                {opt.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opt.description}</p>
                )}
              </div>
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
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
              ${value === opt.value ? 'border-purple-500' : 'border-gray-300 dark:border-gray-500'}
            `}>
              {value === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />}
            </div>
            <div>
              <span className={`text-sm font-medium ${value === opt.value ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>
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
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm"
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
          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
        />
        <button
          type="button"
          onClick={addTag}
          disabled={disabled || !input.trim()}
          className="px-4 py-2 rounded-xl bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
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

function ColorPicker({ label, name, values, onChange, disabled, hint }: {
  label: string
  name: string
  values: string[]
  onChange: (name: string, values: string[]) => void
  disabled?: boolean
  hint?: string
}) {
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
              ${values.includes(color.hex) ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-gray-800' : 'hover:scale-110'}
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
// LOGO FORM STEPS
// ===========================================

// Step 1: Bedrijf
export function LogoBedrijfStep({ data, onChange, disabled }: FormStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <PenTool className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Bedrijfsinformatie</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Vertel ons over je merk</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Bedrijfsnaam / Merknaam"
          name="businessName"
          value={data.businessName || ''}
          onChange={onChange}
          placeholder="De naam voor in je logo"
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

      <TextInput
        label="Branche / Industrie"
        name="industry"
        value={data.industry || ''}
        onChange={onChange}
        placeholder="Bijv. Horeca, IT, Mode, Bouw..."
        required
        disabled={disabled}
      />

      <TextArea
        label="Beschrijf je bedrijf in een paar zinnen"
        name="aboutBusiness"
        value={data.aboutBusiness || ''}
        onChange={onChange}
        placeholder="Wat doe je? Wat maakt je uniek?"
        required
        disabled={disabled}
      />

      <TagInput
        label="Kernwaarden van je merk"
        name="values"
        values={data.values || []}
        onChange={onChange}
        placeholder="Bijv. betrouwbaar, innovatief, duurzaam..."
        disabled={disabled}
        hint="Welke waarden wil je uitstralen?"
      />
    </motion.div>
  )
}

// Step 2: Branding / Kleuren
export function LogoBrandingStep({ data, onChange, disabled }: FormStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
          <Palette className="w-5 h-5 text-pink-600 dark:text-pink-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Kleuren & Stijl</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Visuele voorkeuren voor je logo</p>
        </div>
      </div>

      <RadioGroup
        label="Heb je al een kleurenpalet?"
        name="colorPreferences"
        value={data.colorPreferences || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'has_colors', label: 'Ja, ik heb specifieke kleuren', description: 'Selecteer hieronder' },
          { value: 'suggest', label: 'Nee, doe een voorstel', description: 'We kiezen passende kleuren voor je' },
        ]}
      />

      {data.colorPreferences === 'has_colors' && (
        <ColorPicker
          label="Selecteer je kleuren"
          name="brandColors"
          values={data.brandColors || []}
          onChange={onChange}
          disabled={disabled}
        />
      )}

      <ColorPicker
        label="Kleuren die je NIET wilt"
        name="avoidColors"
        values={data.avoidColors || []}
        onChange={onChange}
        disabled={disabled}
        hint="Zijn er kleuren die absoluut niet passen bij je merk?"
      />

      <CheckboxGroup
        label="Welke stijl past bij je merk?"
        name="stylePreferences"
        values={data.stylePreferences || []}
        onChange={onChange}
        options={[
          { value: 'modern', label: 'Modern', description: 'Strak en actueel' },
          { value: 'classic', label: 'Klassiek', description: 'Tijdloos en traditioneel' },
          { value: 'minimalist', label: 'Minimalistisch', description: 'Eenvoudig en clean' },
          { value: 'playful', label: 'Speels', description: 'Vriendelijk en informeel' },
          { value: 'bold', label: 'Bold', description: 'Opvallend en gedurfd' },
          { value: 'elegant', label: 'Elegant', description: 'Luxe en verfijnd' },
        ]}
        disabled={disabled}
        columns={2}
        hint="Je kunt meerdere selecteren"
      />
    </motion.div>
  )
}

// Step 3: Logo Type & Stijl
export function LogoStijlStep({ data, onChange, disabled }: FormStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
          <PenTool className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Logo Type</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Wat voor soort logo wil je?</p>
        </div>
      </div>

      <RadioGroup
        label="Type logo"
        name="logoType"
        value={data.logoType || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'wordmark', label: 'Woordmerk', description: 'Alleen tekst, bijv. Google, Coca-Cola' },
          { value: 'lettermark', label: 'Lettermerk', description: 'Initialen, bijv. IBM, HBO' },
          { value: 'icon', label: 'Symbool / Pictogram', description: 'Alleen icoon, bijv. Apple, Nike' },
          { value: 'combination', label: 'Combinatie', description: 'Tekst + icoon, bijv. Adidas, Burger King' },
          { value: 'emblem', label: 'Embleem', description: 'Tekst in een vorm, bijv. Starbucks, Harley-Davidson' },
          { value: 'flexible', label: 'Flexibel', description: 'Ik sta open voor suggesties' },
        ]}
      />

      <RadioGroup
        label="Heb je al een bestaand logo?"
        name="hasExistingLogo"
        value={data.hasExistingLogo || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'no', label: 'Nee, dit is een nieuw logo' },
          { value: 'yes_refresh', label: 'Ja, maar ik wil een nieuw design', description: 'Volledig nieuw ontwerp' },
          { value: 'yes_update', label: 'Ja, ik wil het huidige logo moderniseren', description: 'Herkenbaar houden maar verbeteren' },
        ]}
      />

      {(data.hasExistingLogo === 'yes_refresh' || data.hasExistingLogo === 'yes_update') && (
        <TextArea
          label="Wat vind je van je huidige logo?"
          name="existingLogoFeedback"
          value={data.existingLogoFeedback || ''}
          onChange={onChange}
          placeholder="Wat werkt wel/niet? Wat wil je behouden?"
          disabled={disabled}
          rows={3}
        />
      )}
    </motion.div>
  )
}

// Step 4: Inspiratie
export function LogoInspiratieStep({ data, onChange, disabled }: FormStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Image className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Inspiratie</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Voorbeelden die je aanspreken</p>
        </div>
      </div>

      <TagInput
        label="Logo's die je mooi vindt"
        name="likedLogos"
        values={data.likedLogos || []}
        onChange={onChange}
        placeholder="Merknaam of URL..."
        disabled={disabled}
        hint="Noem merken of deel links naar logo's die je inspireren"
      />

      <TagInput
        label="Logo's die je NIET mooi vindt"
        name="dislikedLogos"
        values={data.dislikedLogos || []}
        onChange={onChange}
        placeholder="Merknaam of URL..."
        disabled={disabled}
        hint="Dit helpt ons begrijpen wat je niet wilt"
      />

      <TagInput
        label="Logo's van concurrenten"
        name="competitorLogos"
        values={data.competitorLogos || []}
        onChange={onChange}
        placeholder="Concurrent merknaam..."
        disabled={disabled}
        hint="We zorgen dat je logo uniek is"
      />

      <TextArea
        label="Overige inspiratie of ideeën"
        name="inspirationNotes"
        value={data.inspirationNotes || ''}
        onChange={onChange}
        placeholder="Heb je specifieke ideeën of wensen? Bijv. een symbool dat terug moet komen?"
        disabled={disabled}
        rows={4}
      />
    </motion.div>
  )
}

// Step 5: Gebruik & Levering
export function LogoGebruikStep({ data, onChange, disabled }: FormStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Gebruik & Levering</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Waar ga je het logo gebruiken?</p>
        </div>
      </div>

      <CheckboxGroup
        label="Waar ga je het logo gebruiken?"
        name="primaryUsage"
        values={data.primaryUsage || []}
        onChange={onChange}
        options={[
          { value: 'website', label: 'Website' },
          { value: 'social_media', label: 'Social media' },
          { value: 'print', label: 'Print (visitekaartjes, flyers)' },
          { value: 'signage', label: 'Signing (gevel, auto)' },
          { value: 'merchandise', label: 'Merchandise (kleding, producten)' },
          { value: 'packaging', label: 'Verpakkingen' },
        ]}
        disabled={disabled}
        columns={2}
      />

      <CheckboxGroup
        label="Welke bestandsformaten heb je nodig?"
        name="neededFormats"
        values={data.neededFormats || ['svg', 'png']}
        onChange={onChange}
        options={[
          { value: 'svg', label: 'SVG (vectorbestand)' },
          { value: 'png', label: 'PNG (transparante achtergrond)' },
          { value: 'jpg', label: 'JPG' },
          { value: 'pdf', label: 'PDF' },
          { value: 'ai', label: 'AI (Adobe Illustrator)' },
          { value: 'eps', label: 'EPS' },
        ]}
        disabled={disabled}
        columns={3}
      />

      <CheckboxGroup
        label="Extra's"
        name="extras"
        values={data.extras || []}
        onChange={onChange}
        options={[
          { value: 'variations', label: 'Logo variaties', description: 'Horizontaal, verticaal, compact' },
          { value: 'colorPalette', label: 'Kleurenpalet', description: 'Met alle kleurcodes' },
          { value: 'brandGuidelines', label: 'Huisstijl document', description: 'Basisregels voor gebruik' },
          { value: 'favicon', label: 'Favicon', description: 'Voor in browser tab' },
          { value: 'socialCovers', label: 'Social media covers', description: 'Facebook, LinkedIn headers' },
        ]}
        disabled={disabled}
        columns={1}
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
    </motion.div>
  )
}

// ===========================================
// SAMENVATTING STEP
// ===========================================

interface SamenvattingStepProps extends FormStepProps {
  onGoToStep?: (stepIndex: number) => void
}

export function LogoSamenvattingStep({ data, onGoToStep }: SamenvattingStepProps) {
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
        className="ml-auto text-xs px-2 py-1 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors flex items-center gap-1"
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
          <p className="text-sm text-gray-500 dark:text-gray-400">Alles correct? Dan gaan we aan de slag!</p>
        </div>
      </div>

      {/* Service info */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm opacity-80">Dienst</span>
            <div className="text-xl font-bold">{LOGO_SERVICE_INFO.name}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{LOGO_SERVICE_INFO.price}</div>
            <span className="text-sm opacity-80">{LOGO_SERVICE_INFO.priceType}</span>
          </div>
        </div>
      </div>

      {/* Bedrijfsgegevens */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium text-purple-700 dark:text-purple-300">Bedrijfsgegevens</span>
          <EditButton step={1} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label="Bedrijfsnaam" value={data.businessName} />
          <SummaryItem label="Contactpersoon" value={data.contactName} />
          <SummaryItem label="E-mail" value={data.contactEmail} />
          <SummaryItem label="Telefoon" value={data.contactPhone} />
          <SummaryItem label="Branche" value={data.industry} />
          {data.values?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {data.values.map((value: string) => (
                <span key={value} className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">
                  {value}
                </span>
              ))}
            </div>
          )}
          {data.aboutBusiness && (
            <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
              <span className="text-gray-500 dark:text-gray-400 block mb-1">Over het bedrijf:</span>
              <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">{data.aboutBusiness}</p>
            </div>
          )}
        </div>
      </div>

      {/* Kleuren & Stijl */}
      <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
            <Palette className="w-4 h-4 text-pink-600 dark:text-pink-400" />
          </div>
          <span className="font-medium text-pink-700 dark:text-pink-300">Kleuren & Stijl</span>
          <EditButton step={2} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label="Kleurvoorkeur" value={
            data.colorPreferences === 'has_colors' ? 'Specifieke kleuren' :
            data.colorPreferences === 'suggest' ? 'Doe een voorstel' : undefined
          } />
          {data.brandColors?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-500 dark:text-gray-400">Kleuren:</span>
              {data.brandColors.map((color: string) => (
                <span 
                  key={color} 
                  className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-600"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
          {data.stylePreferences?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {data.stylePreferences.map((style: string) => (
                <span key={style} className="px-2 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded text-xs capitalize">
                  {style}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Logo Type */}
      <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <PenTool className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <span className="font-medium text-violet-700 dark:text-violet-300">Logo Type</span>
          <EditButton step={3} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label="Type" value={
            data.logoType === 'wordmark' ? 'Woordmerk' :
            data.logoType === 'lettermark' ? 'Lettermerk' :
            data.logoType === 'icon' ? 'Symbool / Pictogram' :
            data.logoType === 'combination' ? 'Combinatie' :
            data.logoType === 'emblem' ? 'Embleem' :
            data.logoType === 'flexible' ? 'Flexibel' : undefined
          } />
          <SummaryItem label="Bestaand logo" value={
            data.hasExistingLogo === 'no' ? 'Nee, nieuw logo' :
            data.hasExistingLogo === 'yes_refresh' ? 'Ja, wil nieuw design' :
            data.hasExistingLogo === 'yes_update' ? 'Ja, wil moderniseren' : undefined
          } />
        </div>
      </div>

      {/* Inspiratie */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Image className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="font-medium text-amber-700 dark:text-amber-300">Inspiratie</span>
          <EditButton step={4} />
        </div>
        <div className="space-y-2 text-sm">
          {data.likedLogos?.length > 0 && (
            <div>
              <span className="text-gray-500 dark:text-gray-400">Mooie logo's:</span>
              <span className="ml-2 text-amber-600 dark:text-amber-400">{data.likedLogos.length} voorbeelden</span>
            </div>
          )}
          {data.dislikedLogos?.length > 0 && (
            <div>
              <span className="text-gray-500 dark:text-gray-400">Niet mooi:</span>
              <span className="ml-2 text-amber-600 dark:text-amber-400">{data.dislikedLogos.length} voorbeelden</span>
            </div>
          )}
          {data.competitorLogos?.length > 0 && (
            <div>
              <span className="text-gray-500 dark:text-gray-400">Concurrenten:</span>
              <span className="ml-2 text-amber-600 dark:text-amber-400">{data.competitorLogos.length} merken</span>
            </div>
          )}
        </div>
      </div>

      {/* Gebruik */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Settings className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="font-medium text-emerald-700 dark:text-emerald-300">Gebruik & Levering</span>
          <EditButton step={5} />
        </div>
        <div className="space-y-2 text-sm">
          {data.primaryUsage?.length > 0 && (
            <div>
              <span className="text-gray-500 dark:text-gray-400">Gebruik:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.primaryUsage.map((usage: string) => (
                  <span key={usage} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs">
                    {usage === 'website' ? 'Website' :
                     usage === 'social_media' ? 'Social media' :
                     usage === 'print' ? 'Print' :
                     usage === 'signage' ? 'Signing' :
                     usage === 'merchandise' ? 'Merchandise' :
                     usage === 'packaging' ? 'Verpakkingen' : usage}
                  </span>
                ))}
              </div>
            </div>
          )}
          {data.neededFormats?.length > 0 && (
            <div>
              <span className="text-gray-500 dark:text-gray-400">Formaten:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.neededFormats.map((format: string) => (
                  <span key={format} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs uppercase">
                    {format}
                  </span>
                ))}
              </div>
            </div>
          )}
          {data.extras?.length > 0 && (
            <div>
              <span className="text-gray-500 dark:text-gray-400">Extra's:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.extras.map((extra: string) => (
                  <span key={extra} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs">
                    {extra === 'variations' ? 'Variaties' :
                     extra === 'colorPalette' ? 'Kleurenpalet' :
                     extra === 'brandGuidelines' ? 'Huisstijl' :
                     extra === 'favicon' ? 'Favicon' :
                     extra === 'socialCovers' ? 'Social covers' : extra}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
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
            Direct bevestiging van ontvangst
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Planning voor intake gesprek
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Moodboard met eerste concepten
          </li>
        </ul>
      </div>
    </motion.div>
  )
}

// ===========================================
// EXPORT
// ===========================================

export const LogoSteps = {
  bedrijf: LogoBedrijfStep,
  branding: LogoBrandingStep,
  stijl: LogoStijlStep,
  inspiratie: LogoInspiratieStep,
  gebruik: LogoGebruikStep,
  samenvatting: LogoSamenvattingStep,
}
