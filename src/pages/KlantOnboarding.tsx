import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  FileText,
  Image,
  Palette,
  Globe,
  Building2,
  Send,
  Loader2,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Edit3,
  Sparkles,
  Shield,
  Clock
} from 'lucide-react'
import Logo from '../components/Logo'

interface OnboardingData {
  projectId: string
  businessName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  aboutText: string
  services: string
  uniqueSellingPoints: string
  hasLogo: string
  logoDescription: string
  brandColors: string
  brandFonts: string
  photos: string
  socialMedia: string
  competitors: string
  extraWishes: string
}

interface ExistingOnboarding {
  submittedAt: string
  [key: string]: string
}

// Floating particles component
function FloatingParticles() {
  const particles = [
    { size: 4, x: '10%', y: '20%', delay: 0, duration: 4 },
    { size: 6, x: '20%', y: '60%', delay: 1, duration: 5 },
    { size: 3, x: '80%', y: '30%', delay: 0.5, duration: 4.5 },
    { size: 5, x: '70%', y: '70%', delay: 1.5, duration: 5.5 },
    { size: 4, x: '90%', y: '50%', delay: 2, duration: 4 },
    { size: 7, x: '15%', y: '80%', delay: 0.8, duration: 6 },
  ]

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-primary-400 to-blue-500"
          style={{ 
            width: p.size, 
            height: p.size, 
            left: p.x, 
            top: p.y,
            opacity: 0.4 + (p.size / 20)
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  )
}

const STEP_CONFIG = [
  { key: 1, label: 'Bedrijf', icon: Building2, color: 'from-primary-500 to-blue-500' },
  { key: 2, label: 'Branding', icon: Palette, color: 'from-purple-500 to-violet-500' },
  { key: 3, label: 'Media', icon: Image, color: 'from-emerald-500 to-green-500' },
  { key: 4, label: 'Extra', icon: Globe, color: 'from-orange-500 to-amber-500' },
]

export default function KlantOnboarding() {
  const { projectId } = useParams<{ projectId: string }>()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [projectFound, setProjectFound] = useState<boolean | null>(null)
  const [, setProjectInfo] = useState<any>(null)
  const [existingOnboarding, setExistingOnboarding] = useState<ExistingOnboarding | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [formData, setFormData] = useState<OnboardingData>({
    projectId: projectId || '',
    businessName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    aboutText: '',
    services: '',
    uniqueSellingPoints: '',
    hasLogo: '',
    logoDescription: '',
    brandColors: '',
    brandFonts: '',
    photos: '',
    socialMedia: '',
    competitors: '',
    extraWishes: ''
  })

  useEffect(() => {
    if (projectId) {
      verifyProject(projectId)
      checkExistingOnboarding(projectId)
    }
  }, [projectId])

  const checkExistingOnboarding = async (id: string) => {
    try {
      const response = await fetch(`/api/onboarding/${id}`)
      if (response.ok) {
        const data = await response.json()
        if (data && data.submittedAt) {
          setExistingOnboarding(data)
          setFormData(prev => ({ ...prev, ...data }))
        }
      }
    } catch {
      // No existing onboarding found
    }
  }

  const verifyProject = async (id: string) => {
    try {
      const response = await fetch(`/api/project/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProjectFound(true)
        setProjectInfo(data)
        
        const prefillData: Partial<OnboardingData> = {
          projectId: id,
          businessName: data.businessName || '',
          contactName: data.contactName || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || ''
        }
        
        if (data.intakeData) {
          const intake = data.intakeData
          if (intake.websiteGoal) prefillData.aboutText = intake.websiteGoal
          if (intake.colorPreference || intake.customColors?.length) {
            const colors = [intake.colorPreference, ...(intake.customColors || [])].filter(Boolean)
            prefillData.brandColors = colors.join(', ')
          }
          if (intake.hasLogo !== undefined) prefillData.hasLogo = intake.hasLogo ? 'ja' : 'nee'
          if (intake.logoDescription) prefillData.logoDescription = intake.logoDescription
          if (intake.contentNotes) prefillData.services = intake.contentNotes
          if (intake.inspirationUrls?.length) prefillData.competitors = intake.inspirationUrls.join('\n')
          if (intake.additionalNotes) prefillData.extraWishes = intake.additionalNotes
          if (intake.hasPhotos !== undefined && intake.photoNotes) {
            prefillData.photos = intake.hasPhotos ? `Ja - ${intake.photoNotes}` : 'Nee'
          }
        }
        
        setFormData(prev => ({ ...prev, ...prefillData }))
      } else {
        setProjectFound(true)
        setFormData(prev => ({ ...prev, projectId: id }))
      }
    } catch {
      setProjectFound(true)
      setFormData(prev => ({ ...prev, projectId: id }))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isUpdate: !!existingOnboarding })
      })

      if (!response.ok) throw new Error('Verzenden mislukt')
      setSubmitted(true)
      setEditMode(false)
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw of neem contact met ons op.')
    } finally {
      setLoading(false)
    }
  }

  const totalSteps = 4

  // No project ID - show lookup form
  if (!projectId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-white">
        {/* Hero background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary-200/60 via-blue-100/40 to-cyan-100/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <FloatingParticles />
        </div>

        <header className="relative z-10 border-b bg-white/80 backdrop-blur-sm sticky top-0">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/"><Logo /></Link>
          </div>
        </header>

        <main className="relative z-10 max-w-xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30"
              >
                <FileText className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Onboarding Checklist</h1>
              <p className="text-gray-600 dark:text-gray-400">Vul je Project ID in om te beginnen</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              const id = (e.target as any).projectId.value
              if (id) window.location.href = `/onboarding/${id}`
            }}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project ID</label>
                <input
                  type="text"
                  name="projectId"
                  placeholder="Bijv. WS-MJ1G8LH1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-900 dark:bg-gray-900"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Je vindt je Project ID in de welkomstmail die je hebt ontvangen.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 flex items-center justify-center gap-2"
              >
                Verder <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </main>
      </div>
    )
  }

  // Project not found
  if (projectFound === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-red-200/40 via-red-100/30 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        </div>

        <header className="relative z-10 border-b bg-white/80 backdrop-blur-sm sticky top-0">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link to="/"><Logo /></Link>
          </div>
        </header>

        <main className="relative z-10 max-w-xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Project niet gevonden</h1>
            <p className="text-gray-600 mb-6">
              We konden geen project vinden met ID: <strong>{projectId}</strong>
            </p>
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              Probeer een ander Project ID
            </Link>
          </motion.div>
        </main>
      </div>
    )
  }

  // Loading state
  if (projectFound === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  // Already submitted
  if (existingOnboarding && !editMode && !submitted) {
    const nextSteps = [
      {
        icon: FileText,
        title: 'Drive link klaarzetten',
        description: 'Wij sturen je een Google Drive link waar je je logo, foto\'s en andere bestanden kunt uploaden.',
        time: 'Binnen 24 uur',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
      },
      {
        icon: Palette,
        title: 'Eerste ontwerp',
        description: 'We gaan aan de slag met je website en sturen je binnen 5-7 werkdagen het eerste ontwerp.',
        time: '5-7 werkdagen',
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
      },
      {
        icon: CheckCircle2,
        title: 'Feedback & live!',
        description: 'Na jouw goedkeuring maken we de laatste aanpassingen en gaat je website live.',
        time: 'Na goedkeuring',
        color: 'from-emerald-500 to-emerald-600',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600',
      },
    ]

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-emerald-200/60 via-green-100/40 to-teal-100/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/40 via-primary-100/30 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <header className="relative z-10 border-b bg-white/80 backdrop-blur-sm sticky top-0">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/"><Logo /></Link>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Project: {projectId}</span>
          </div>
        </header>

        <main className="relative z-10 max-w-2xl mx-auto px-4 py-8 md:py-12">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 md:p-8 text-center mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30"
            >
              <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-white" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-5 h-5 text-emerald-500" />
              </motion.div>
            </motion.div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Onboarding voltooid! 🎉</h1>
            <p className="text-gray-600 text-sm md:text-base">
              Ingevuld op{' '}
              <strong>{new Date(existingOnboarding.submittedAt).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</strong>
            </p>
          </motion.div>

          {/* What to expect - Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 md:p-8 mb-6"
          >
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-500" />
              Wat kun je nu verwachten?
            </h2>

            <div className="space-y-4">
              {nextSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="relative flex gap-4"
                >
                  {/* Timeline line */}
                  {index < nextSteps.length - 1 && (
                    <div className="absolute left-5 top-12 w-0.5 h-[calc(100%-1rem)] bg-gradient-to-b from-gray-200 to-gray-100" />
                  )}
                  
                  {/* Icon */}
                  <div className={`relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-5 h-5 text-white" />
                    <span className="absolute -top-1 -left-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shadow">
                      {index + 1}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${step.bgColor} ${step.textColor} font-medium`}>
                        {step.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Summary of submitted data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 md:p-8 mb-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-500" />
              Jouw ingevulde gegevens
            </h2>

            <div className="space-y-4">
              {/* Bedrijfsinfo */}
              {(formData.aboutText || formData.services) && (
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Bedrijfsinformatie</h3>
                  {formData.aboutText && (
                    <div className="mb-2">
                      <span className="text-xs text-gray-400">Over je bedrijf</span>
                      <p className="text-gray-700 text-sm">{formData.aboutText}</p>
                    </div>
                  )}
                  {formData.services && (
                    <div>
                      <span className="text-xs text-gray-400">Diensten/Producten</span>
                      <p className="text-gray-700 text-sm">{formData.services}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Branding */}
              {(formData.hasLogo || formData.brandColors) && (
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Huisstijl</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {formData.hasLogo && (
                      <div>
                        <span className="text-xs text-gray-400">Logo</span>
                        <p className="text-gray-700">{formData.hasLogo === 'ja_vector' ? 'Ja (vector)' : formData.hasLogo === 'ja_afbeelding' ? 'Ja (afbeelding)' : formData.hasLogo === 'nee_nodig' ? 'Logo nodig' : 'Alleen tekst'}</p>
                      </div>
                    )}
                    {formData.brandColors && (
                      <div>
                        <span className="text-xs text-gray-400">Kleuren</span>
                        <p className="text-gray-700">{formData.brandColors}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Media */}
              {(formData.photos || formData.socialMedia) && (
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Media</h3>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {formData.photos && (
                      <div>
                        <span className="text-xs text-gray-400">Foto's</span>
                        <p className="text-gray-700 break-all">{formData.photos}</p>
                      </div>
                    )}
                    {formData.socialMedia && (
                      <div>
                        <span className="text-xs text-gray-400">Social Media</span>
                        <p className="text-gray-700 break-all">{formData.socialMedia}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Extra */}
              {(formData.competitors || formData.extraWishes) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Extra</h3>
                  {formData.competitors && (
                    <div className="mb-2">
                      <span className="text-xs text-gray-400">Inspiratie</span>
                      <p className="text-gray-700 text-sm break-all">{formData.competitors}</p>
                    </div>
                  )}
                  {formData.extraWishes && (
                    <div>
                      <span className="text-xs text-gray-400">Extra wensen</span>
                      <p className="text-gray-700 text-sm">{formData.extraWishes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary-500 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition"
            >
              <Edit3 className="w-5 h-5" />
              Gegevens wijzigen
            </button>
            <Link
              to={`/status/${projectId}`}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition shadow-lg shadow-primary-500/25"
            >
              Bekijk project status <ExternalLink className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Gegevens veilig opgeslagen</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-500" />
              <span>Altijd te wijzigen</span>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  // Submitted successfully - Enhanced thank you screen
  if (submitted) {
    const nextSteps = [
      {
        icon: FileText,
        title: 'Drive link klaarzetten',
        description: 'Wij sturen je een Google Drive link waar je je logo, foto\'s en andere bestanden kunt uploaden.',
        time: 'Binnen 24 uur',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
      },
      {
        icon: Palette,
        title: 'Eerste ontwerp',
        description: 'We gaan aan de slag met je website en sturen je binnen 5-7 werkdagen het eerste ontwerp.',
        time: '5-7 werkdagen',
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
      },
      {
        icon: CheckCircle2,
        title: 'Feedback & live!',
        description: 'Na jouw goedkeuring maken we de laatste aanpassingen en gaat je website live.',
        time: 'Na goedkeuring',
        color: 'from-emerald-500 to-emerald-600',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600',
      },
    ]

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-emerald-200/60 via-green-100/40 to-teal-100/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/40 via-primary-100/30 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <header className="relative z-10 border-b bg-white/80 backdrop-blur-sm sticky top-0">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/"><Logo /></Link>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Project: {projectId}</span>
          </div>
        </header>

        <main className="relative z-10 max-w-2xl mx-auto px-4 py-8 md:py-12">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 md:p-8 text-center mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-6 h-6 text-emerald-500" />
              </motion.div>
            </motion.div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Bedankt voor het invullen! 🎉
            </h1>
            <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto">
              We hebben al je informatie ontvangen en gaan direct aan de slag met je website.
            </p>
          </motion.div>

          {/* What to expect - Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 md:p-8 mb-6"
          >
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-500" />
              Wat kun je nu verwachten?
            </h2>

            <div className="space-y-4">
              {nextSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="relative flex gap-4"
                >
                  {/* Timeline line */}
                  {index < nextSteps.length - 1 && (
                    <div className="absolute left-5 top-12 w-0.5 h-[calc(100%-1rem)] bg-gradient-to-b from-gray-200 to-gray-100" />
                  )}
                  
                  {/* Icon */}
                  <div className={`relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-5 h-5 text-white" />
                    <span className="absolute -top-1 -left-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shadow">
                      {index + 1}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${step.bgColor} ${step.textColor} font-medium`}>
                        {step.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tip box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6"
          >
            <p className="text-amber-800 text-sm">
              <strong>💡 Tip:</strong> Onze e-mails kunnen soms in je spam/ongewenste map terechtkomen. 
              Voeg <span className="font-medium">info@webstability.nl</span> toe aan je contacten zodat je niks mist!
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              onClick={() => {
                setSubmitted(false)
                setStep(1)
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary-500 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition"
            >
              <Edit3 className="w-5 h-5" />
              Antwoorden bekijken/wijzigen
            </button>
            <Link
              to={`/status/${projectId}`}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition shadow-lg shadow-primary-500/25"
            >
              Bekijk project status <ExternalLink className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Gegevens veilig opgeslagen</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-500" />
              <span>Altijd te wijzigen</span>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  // Main form
  const currentStepConfig = STEP_CONFIG[step - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-white">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary-200/50 via-blue-100/30 to-cyan-100/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/40 via-primary-100/30 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <FloatingParticles />
      </div>

      <header className="relative z-10 border-b bg-white/80 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/"><Logo /></Link>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Project: {projectId}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Prefilled notice */}
        {formData.aboutText && step === 1 && !existingOnboarding && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
          >
            <p className="text-sm text-emerald-800">
              <strong>✨ Goed nieuws!</strong> We hebben een aantal velden al voor je ingevuld. 
              Controleer de informatie en vul aan waar nodig.
            </p>
          </motion.div>
        )}

        {/* Progress Steps - Compact on mobile */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            {STEP_CONFIG.map((s, index) => (
              <div key={s.key} className="flex items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: step === s.key ? 1.1 : 1,
                    opacity: step >= s.key ? 1 : 0.5
                  }}
                  className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                    step >= s.key 
                      ? `bg-gradient-to-br ${s.color} shadow-lg` 
                      : 'bg-gray-200'
                  }`}
                >
                  <s.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${step >= s.key ? 'text-white' : 'text-gray-400'}`} />
                  {step > s.key && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </motion.div>
                  )}
                </motion.div>
                {index < STEP_CONFIG.length - 1 && (
                  <div className={`w-6 sm:w-12 md:w-16 h-1 mx-0.5 sm:mx-1 rounded-full transition-colors ${
                    step > s.key ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">Stap {step} van {totalSteps}: {currentStepConfig.label}</span>
            <span className="text-primary-600 font-medium">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden"
        >
          {/* Colored top border */}
          <div className={`h-1 bg-gradient-to-r ${currentStepConfig.color}`} />
          
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Business Info */}
              {step === 1 && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${currentStepConfig.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bedrijfsinformatie</h2>
                      <p className="text-gray-600 text-sm">Vertel ons meer over je bedrijf</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Over je bedrijf *</label>
                      <textarea
                        name="aboutText"
                        value={formData.aboutText}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Beschrijf je bedrijf in een paar zinnen..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diensten/Producten *</label>
                      <textarea
                        name="services"
                        value={formData.services}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Som je belangrijkste diensten of producten op"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unique Selling Points</label>
                      <textarea
                        name="uniqueSellingPoints"
                        value={formData.uniqueSellingPoints}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Wat onderscheidt je van de concurrentie?"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Branding */}
              {step === 2 && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${currentStepConfig.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Huisstijl & Branding</h2>
                      <p className="text-gray-600 text-sm">Je visuele identiteit</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-4 mb-6">
                    <p className="text-sm text-purple-900">
                      <strong>✨ Goed om te weten:</strong> Wij ontwerpen je website op basis van je voorkeuren, 
                      maar combineren dit met onze expertise. Je ontvangt altijd een preview ter goedkeuring!
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heb je al een logo? *</label>
                      <select
                        name="hasLogo"
                        value={formData.hasLogo}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-900 dark:bg-gray-900"
                        required
                      >
                        <option value="">Selecteer...</option>
                        <option value="ja_vector">Ja, in vectorformaat (AI/EPS/SVG)</option>
                        <option value="ja_afbeelding">Ja, als afbeelding (PNG/JPG)</option>
                        <option value="nee_nodig">Nee, ik heb een logo nodig</option>
                        <option value="nee_niet_nodig">Nee, alleen tekst gebruiken</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logo omschrijving/link</label>
                      <textarea
                        name="logoDescription"
                        value={formData.logoDescription}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Beschrijf je logo of plak een link naar het bestand"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Merkleuren</label>
                      <input
                        type="text"
                        name="brandColors"
                        value={formData.brandColors}
                        onChange={handleChange}
                        placeholder="Bijv. Blauw (#2563EB), Wit, Donkergrijs"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lettertype voorkeur</label>
                      <input
                        type="text"
                        name="brandFonts"
                        value={formData.brandFonts}
                        onChange={handleChange}
                        placeholder="Bijv. Modern en strak, of klassiek en elegant"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Media */}
              {step === 3 && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${currentStepConfig.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Image className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Foto's & Media</h2>
                      <p className="text-gray-600 text-sm">Visuele content voor je website</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Foto's & Afbeeldingen</label>
                      <textarea
                        name="photos"
                        value={formData.photos}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Deel een link naar een map met foto's (Google Drive, Dropbox, WeTransfer)"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Tip: Gebruik hoge kwaliteit foto's (minimaal 1920px breed)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Social Media & Online profielen</label>
                      <textarea
                        name="socialMedia"
                        value={formData.socialMedia}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Links naar je Instagram, Facebook, LinkedIn, etc."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 4: Extra */}
              {step === 4 && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${currentStepConfig.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Laatste details</h2>
                      <p className="text-gray-600 text-sm">Nog een paar vragen</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Inspiratie websites</label>
                      <textarea
                        name="competitors"
                        value={formData.competitors}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Welke websites vind je mooi of inspirerend? (met links)"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Extra wensen</label>
                      <textarea
                        name="extraWishes"
                        value={formData.extraWishes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Is er nog iets dat we moeten weten?"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50"
                      />
                    </div>

                    {/* Contact summary */}
                    <div className="bg-gray-50 rounded-xl p-4 mt-6 border border-gray-100 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary-500" />
                        Contactgegevens
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p><strong>Bedrijf:</strong> {formData.businessName}</p>
                        <p><strong>Naam:</strong> {formData.contactName}</p>
                        <p><strong>Email:</strong> {formData.contactEmail}</p>
                        <p><strong>Telefoon:</strong> {formData.contactPhone}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Terms - last step only */}
              {step === totalSteps && !existingOnboarding && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 dark:border-gray-700">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      required
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Ik ga akkoord met de{' '}
                      <Link to="/voorwaarden" target="_blank" className="text-primary-600 hover:underline">
                        algemene voorwaarden
                      </Link>{' '}
                      en het{' '}
                      <Link to="/privacy" target="_blank" className="text-primary-600 hover:underline">
                        privacybeleid
                      </Link>. *
                    </span>
                  </label>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition"
                  >
                    ← Vorige
                  </button>
                ) : (
                  <div />
                )}

                {step < totalSteps ? (
                  <motion.button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`bg-gradient-to-r ${currentStepConfig.color} text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2`}
                  >
                    Volgende <ChevronRight className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={loading || (!existingOnboarding && !acceptedTerms)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Verzenden...</>
                    ) : (
                      <><Send className="w-5 h-5" /> Versturen</>
                    )}
                  </motion.button>
                )}
              </div>
            </form>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Veilig & privé</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-500" />
            <span>5 min invultijd</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
            <span>Direct verwerkt</span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
