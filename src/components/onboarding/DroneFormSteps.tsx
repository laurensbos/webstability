import { motion } from 'framer-motion'
import {
  Plane,
  MapPin,
  Calendar,
  Package,
  Camera,
  Check,
  ArrowUpRight
} from 'lucide-react'

// ===========================================
// DRONE SERVICE INFO
// ===========================================

export const DRONE_SERVICE_INFO = {
  name: 'Drone Opnames',
  price: '€299',
  priceType: 'eenmalig' as const,
  includes: [
    'Professionele 4K video opnames',
    'Hoge resolutie foto\'s',
    'Tot 2 uur op locatie',
    'Nabewerking & kleurcorrectie',
    'Gecertificeerd drone piloot (A1/A2)',
    'Verzekerd tot €1 miljoen',
    'Ruwe bestanden inbegrepen',
    'Levering binnen 5 werkdagen',
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
        className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 transition-all"
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
        className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 transition-all resize-none"
      />
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
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                ${isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300 dark:border-gray-500'}
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
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
              ${value === opt.value ? 'border-orange-500' : 'border-gray-300 dark:border-gray-500'}
            `}>
              {value === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
            </div>
            <div>
              <span className={`text-sm font-medium ${value === opt.value ? 'text-orange-700 dark:text-orange-300' : 'text-gray-700 dark:text-gray-300'}`}>
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

// ===========================================
// FORM STEP PROPS
// ===========================================

interface FormStepProps {
  data: Record<string, any>
  onChange: (field: string, value: any) => void
  disabled?: boolean
}

// ===========================================
// DRONE FORM STEPS
// ===========================================

// Step 1: Project Type
export function DroneProjectStep({ data, onChange, disabled }: FormStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
          <Plane className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Project Type</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Wat voor dronebeelden heb je nodig?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Contactpersoon"
          name="contactName"
          value={data.contactName || ''}
          onChange={onChange}
          placeholder="Voornaam Achternaam"
          required
          disabled={disabled}
        />
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
      </div>

      <TextInput
        label="Telefoonnummer"
        name="contactPhone"
        value={data.contactPhone || ''}
        onChange={onChange}
        placeholder="06-12345678"
        type="tel"
        disabled={disabled}
      />

      <RadioGroup
        label="Type project"
        name="projectType"
        value={data.projectType || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'real_estate', label: 'Vastgoed / Makelaardij', description: 'Woningen, bedrijfspanden, bouwprojecten' },
          { value: 'event', label: 'Evenement', description: 'Festival, bruiloft, bedrijfsevent' },
          { value: 'construction', label: 'Bouw / Inspectie', description: 'Bouwvoortgang, dakinsecties, monitoring' },
          { value: 'nature', label: 'Natuur / Landschap', description: 'Landgoederen, parken, recreatie' },
          { value: 'commercial', label: 'Commercieel / Reclame', description: 'Bedrijfsfilm, promotievideo' },
          { value: 'other', label: 'Anders' },
        ]}
      />

      {data.projectType === 'other' && (
        <TextInput
          label="Beschrijf je project"
          name="projectTypeOther"
          value={data.projectTypeOther || ''}
          onChange={onChange}
          placeholder="Wat voor opnames heb je nodig?"
          disabled={disabled}
        />
      )}
    </motion.div>
  )
}

// Step 2: Locatie
export function DroneLocatieStep({ data, onChange, disabled }: FormStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Locatie</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Waar moeten de opnames gemaakt worden?</p>
        </div>
      </div>

      <TextInput
        label="Adres"
        name="locationAddress"
        value={data.locationAddress || ''}
        onChange={onChange}
        placeholder="Straatnaam + huisnummer"
        required
        disabled={disabled}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Postcode"
          name="locationPostcode"
          value={data.locationPostcode || ''}
          onChange={onChange}
          placeholder="1234 AB"
          required
          disabled={disabled}
        />
        <TextInput
          label="Plaats"
          name="locationCity"
          value={data.locationCity || ''}
          onChange={onChange}
          placeholder="Amsterdam"
          required
          disabled={disabled}
        />
      </div>

      <TextArea
        label="Extra locatie-informatie"
        name="locationNotes"
        value={data.locationNotes || ''}
        onChange={onChange}
        placeholder="Bijv. parkeren, toegang, specifieke gebouwen..."
        disabled={disabled}
        rows={3}
      />

      <RadioGroup
        label="Is dit een binnenlocatie?"
        name="isIndoor"
        value={data.isIndoor || 'no'}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'no', label: 'Nee, buitenopnames' },
          { value: 'yes', label: 'Ja, binnenopnames (FPV drone)', description: 'Kleine drone voor binnen' },
          { value: 'both', label: 'Beide, binnen en buiten' },
        ]}
      />

      <RadioGroup
        label="Zijn er benodigde vergunningen?"
        name="hasPermissions"
        value={data.hasPermissions || ''}
        onChange={onChange}
        disabled={disabled}
        hint="Sommige locaties vereisen toestemming (bijv. nabij vliegvelden, evenementen)"
        options={[
          { value: 'not_needed', label: 'Niet nodig voor deze locatie' },
          { value: 'have_permission', label: 'Ja, ik heb toestemming geregeld' },
          { value: 'need_help', label: 'Ik weet het niet / heb hulp nodig' },
        ]}
      />
    </motion.div>
  )
}

// Step 3: Planning
export function DronePlanningStep({ data, onChange, disabled }: FormStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Planning</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Wanneer wil je de opnames maken?</p>
        </div>
      </div>

      <TextInput
        label="Gewenste datum"
        name="preferredDate"
        value={data.preferredDate || ''}
        onChange={onChange}
        type="date"
        required
        disabled={disabled}
        hint="We plannen in overleg, afhankelijk van weer en beschikbaarheid"
      />

      <RadioGroup
        label="Voorkeur tijdstip"
        name="preferredTimeOfDay"
        value={data.preferredTimeOfDay || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'morning', label: 'Ochtend (6:00 - 10:00)', description: 'Rustig, zacht licht' },
          { value: 'midday', label: 'Middag (10:00 - 16:00)', description: 'Helder, goed voor details' },
          { value: 'evening', label: 'Avond (16:00 - 20:00)', description: 'Warm licht, sfeervolle beelden' },
          { value: 'golden_hour', label: 'Golden hour', description: 'Rond zonsopkomst of zonsondergang' },
          { value: 'flexible', label: 'Flexibel', description: 'Wanneer het weer het beste is' },
        ]}
      />

      <RadioGroup
        label="Ben je flexibel met de datum?"
        name="isFlexibleDate"
        value={data.isFlexibleDate || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'yes', label: 'Ja, ik ben flexibel', description: 'We kiezen de beste weerdag' },
          { value: 'somewhat', label: 'Enigszins, binnen een week' },
          { value: 'no', label: 'Nee, deze datum is belangrijk', description: 'Bijv. evenement' },
        ]}
      />

      <TextInput
        label="Deadline voor levering"
        name="deadlineDate"
        value={data.deadlineDate || ''}
        onChange={onChange}
        type="date"
        disabled={disabled}
        hint="Wanneer heb je de beelden uiterlijk nodig?"
      />
    </motion.div>
  )
}

// Step 4: Levering
export function DroneLeveringStep({ data, onChange, disabled }: FormStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Levering & Bewerking</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Wat wil je ontvangen?</p>
        </div>
      </div>

      <CheckboxGroup
        label="Welk type content wil je?"
        name="contentNeeded"
        values={data.contentNeeded || ['photos']}
        onChange={onChange}
        options={[
          { value: 'photos', label: 'Foto\'s', icon: Camera },
          { value: 'video', label: 'Video', icon: Plane },
          { value: '360_panorama', label: '360° Panorama' },
          { value: 'timelapse', label: 'Timelapse' },
        ]}
        disabled={disabled}
        columns={2}
      />

      <RadioGroup
        label="Bewerking gewenst?"
        name="needsEditing"
        value={data.needsEditing || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'yes', label: 'Ja, volledig bewerkt', description: 'Kleurcorrectie, muziek, editing' },
          { value: 'basic', label: 'Basis bewerking', description: 'Kleurcorrectie en selectie beste shots' },
          { value: 'no', label: 'Nee, alleen ruwe bestanden' },
        ]}
      />

      {(data.needsEditing === 'yes' || data.needsEditing === 'basic') && (
        <RadioGroup
          label="Gewenste stijl"
          name="editingStyle"
          value={data.editingStyle || ''}
          onChange={onChange}
          disabled={disabled}
          options={[
            { value: 'natural', label: 'Natuurlijk', description: 'Realistische kleuren' },
            { value: 'cinematic', label: 'Cinematic', description: 'Filmische look, dramatisch' },
            { value: 'corporate', label: 'Corporate', description: 'Professioneel, zakelijk' },
            { value: 'bright', label: 'Bright & Airy', description: 'Licht en fris' },
          ]}
        />
      )}

      <RadioGroup
        label="Hoe wil je de bestanden ontvangen?"
        name="deliveryFormat"
        value={data.deliveryFormat || ''}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'digital_download', label: 'Digitale download', description: 'Via WeTransfer of Google Drive' },
          { value: 'usb', label: 'USB-stick', description: 'Fysieke levering' },
          { value: 'both', label: 'Beide' },
        ]}
      />

      <CheckboxGroup
        label="Waarvoor ga je de beelden gebruiken?"
        name="usagePurpose"
        values={data.usagePurpose || []}
        onChange={onChange}
        options={[
          { value: 'website', label: 'Website' },
          { value: 'social_media', label: 'Social media' },
          { value: 'print', label: 'Print / Brochures' },
          { value: 'video_production', label: 'Videoproductie' },
          { value: 'advertising', label: 'Advertenties' },
          { value: 'internal', label: 'Intern gebruik' },
        ]}
        disabled={disabled}
        columns={2}
      />

      <TextArea
        label="Overige wensen of opmerkingen"
        name="additionalNotes"
        value={data.additionalNotes || ''}
        onChange={onChange}
        placeholder="Zijn er specifieke shots die je wilt? Andere wensen?"
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

export function DroneSamenvattingStep({ data, onGoToStep }: SamenvattingStepProps) {
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
        className="ml-auto text-xs px-2 py-1 text-gray-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors flex items-center gap-1"
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
          <p className="text-sm text-gray-500 dark:text-gray-400">Alles correct? Dan nemen we contact op!</p>
        </div>
      </div>

      {/* Service info */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm opacity-80">Dienst</span>
            <div className="text-xl font-bold">{DRONE_SERVICE_INFO.name}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{DRONE_SERVICE_INFO.price}</div>
            <span className="text-sm opacity-80">{DRONE_SERVICE_INFO.priceType}</span>
          </div>
        </div>
      </div>

      {/* Project info */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <Plane className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </div>
          <span className="font-medium text-orange-700 dark:text-orange-300">Project</span>
          <EditButton step={1} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label="Contactpersoon" value={data.contactName} />
          <SummaryItem label="E-mail" value={data.contactEmail} />
          <SummaryItem label="Telefoon" value={data.contactPhone} />
          <SummaryItem label="Type" value={
            data.projectType === 'real_estate' ? 'Vastgoed / Makelaardij' :
            data.projectType === 'event' ? 'Evenement' :
            data.projectType === 'construction' ? 'Bouw / Inspectie' :
            data.projectType === 'nature' ? 'Natuur / Landschap' :
            data.projectType === 'commercial' ? 'Commercieel / Reclame' :
            data.projectType === 'other' ? data.projectTypeOther : undefined
          } />
        </div>
      </div>

      {/* Locatie */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-medium text-blue-700 dark:text-blue-300">Locatie</span>
          <EditButton step={2} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label="Adres" value={data.locationAddress} />
          <SummaryItem label="Postcode" value={data.locationPostcode} />
          <SummaryItem label="Plaats" value={data.locationCity} />
          <SummaryItem label="Binnen/buiten" value={
            data.isIndoor === 'yes' ? 'Binnenopnames (FPV)' :
            data.isIndoor === 'both' ? 'Binnen en buiten' :
            data.isIndoor === 'no' ? 'Buitenopnames' : undefined
          } />
          <SummaryItem label="Vergunningen" value={
            data.hasPermissions === 'not_needed' ? 'Niet nodig' :
            data.hasPermissions === 'have_permission' ? 'Geregeld' :
            data.hasPermissions === 'need_help' ? 'Hulp nodig' : undefined
          } />
          {data.locationNotes && (
            <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
              <span className="text-gray-500 dark:text-gray-400 block mb-1">Extra info:</span>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{data.locationNotes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Planning */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium text-purple-700 dark:text-purple-300">Planning</span>
          <EditButton step={3} />
        </div>
        <div className="space-y-2 text-sm">
          <SummaryItem label="Gewenste datum" value={data.preferredDate} />
          <SummaryItem label="Tijdstip" value={
            data.preferredTimeOfDay === 'morning' ? 'Ochtend' :
            data.preferredTimeOfDay === 'midday' ? 'Middag' :
            data.preferredTimeOfDay === 'evening' ? 'Avond' :
            data.preferredTimeOfDay === 'golden_hour' ? 'Golden hour' :
            data.preferredTimeOfDay === 'flexible' ? 'Flexibel' : undefined
          } />
          <SummaryItem label="Flexibel" value={
            data.isFlexibleDate === 'yes' ? 'Ja, flexibel' :
            data.isFlexibleDate === 'somewhat' ? 'Enigszins' :
            data.isFlexibleDate === 'no' ? 'Vaste datum' : undefined
          } />
          <SummaryItem label="Deadline" value={data.deadlineDate} />
        </div>
      </div>

      {/* Levering */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="font-medium text-emerald-700 dark:text-emerald-300">Levering</span>
          <EditButton step={4} />
        </div>
        <div className="space-y-2 text-sm">
          {data.contentNeeded?.length > 0 && (
            <div>
              <span className="text-gray-500 dark:text-gray-400">Content:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.contentNeeded.map((type: string) => (
                  <span key={type} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs">
                    {type === 'photos' ? 'Foto\'s' :
                     type === 'video' ? 'Video' :
                     type === '360_panorama' ? '360° Panorama' :
                     type === 'timelapse' ? 'Timelapse' : type}
                  </span>
                ))}
              </div>
            </div>
          )}
          <SummaryItem label="Bewerking" value={
            data.needsEditing === 'yes' ? 'Volledig bewerkt' :
            data.needsEditing === 'basic' ? 'Basis bewerking' :
            data.needsEditing === 'no' ? 'Alleen ruwe bestanden' : undefined
          } />
          <SummaryItem label="Stijl" value={
            data.editingStyle === 'natural' ? 'Natuurlijk' :
            data.editingStyle === 'cinematic' ? 'Cinematic' :
            data.editingStyle === 'corporate' ? 'Corporate' :
            data.editingStyle === 'bright' ? 'Bright & Airy' : undefined
          } />
          <SummaryItem label="Levering via" value={
            data.deliveryFormat === 'digital_download' ? 'Digitale download' :
            data.deliveryFormat === 'usb' ? 'USB-stick' :
            data.deliveryFormat === 'both' ? 'Beide' : undefined
          } />
          {data.usagePurpose?.length > 0 && (
            <div>
              <span className="text-gray-500 dark:text-gray-400">Gebruik:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.usagePurpose.map((purpose: string) => (
                  <span key={purpose} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs">
                    {purpose === 'website' ? 'Website' :
                     purpose === 'social_media' ? 'Social media' :
                     purpose === 'print' ? 'Print' :
                     purpose === 'video_production' ? 'Video' :
                     purpose === 'advertising' ? 'Advertenties' :
                     purpose === 'internal' ? 'Intern' : purpose}
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
          Na het indienen nemen we snel contact op voor:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-green-600 dark:text-green-300">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Bevestiging van de datum
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Locatie check en vergunningen
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Offerte en planning
          </li>
        </ul>
      </div>
    </motion.div>
  )
}

// ===========================================
// EXPORT
// ===========================================

export const DroneSteps = {
  project: DroneProjectStep,
  locatie: DroneLocatieStep,
  planning: DronePlanningStep,
  levering: DroneLeveringStep,
  samenvatting: DroneSamenvattingStep,
}
