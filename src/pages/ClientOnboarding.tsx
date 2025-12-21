import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ClientOnboardingSkeleton } from '../components/LoadingSkeletons'
import {
  Globe,
  ShoppingBag,
  Plane,
  PenTool,
  ChevronLeft,
  ChevronRight,
  Check,
  MessageSquare,
  Clock,
  Edit3,
  Lock,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Building2,
  Palette,
  Target,
  FileText,
  Image,
  Settings,
  Sparkles,
  ExternalLink,
  Shield,
  Mail,
  FolderOpen,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import Logo from '../components/Logo'
import type { 
  ServiceType, 
  OnboardingPhase,
  OnboardingMessage,
  TimelineStep
} from '../types/onboarding'

// Import form steps for each service
import { WebsiteSteps } from '../components/onboarding/WebsiteFormSteps'
import { WebshopSteps } from '../components/onboarding/WebshopFormSteps'
import { DroneSteps } from '../components/onboarding/DroneFormSteps'
import { LogoSteps } from '../components/onboarding/LogoFormSteps'

// ===========================================
// CONSTANTS
// ===========================================

const SERVICE_CONFIG: Record<ServiceType, {
  name: string
  icon: React.ElementType
  gradient: string
  color: string
}> = {
  website: {
    name: 'Website',
    icon: Globe,
    gradient: 'from-primary-500 to-blue-600',
    color: 'primary'
  },
  webshop: {
    name: 'Webshop',
    icon: ShoppingBag,
    gradient: 'from-emerald-500 to-green-600',
    color: 'emerald'
  },
  drone: {
    name: 'Dronebeelden',
    icon: Plane,
    gradient: 'from-orange-500 to-amber-600',
    color: 'orange'
  },
  logo: {
    name: 'Logo Design',
    icon: PenTool,
    gradient: 'from-purple-500 to-violet-600',
    color: 'purple'
  }
}

// ===========================================
// STEP CONFIGURATIONS PER SERVICE
// ===========================================

interface StepConfig {
  id: string
  title: string
  icon: React.ElementType
}

const getStepsForService = (service: ServiceType): StepConfig[] => {
  const baseSteps: StepConfig[] = [
    { id: 'bedrijf', title: 'Bedrijf', icon: Building2 },
    { id: 'branding', title: 'Branding', icon: Palette },
  ]

  switch (service) {
    case 'website':
      return [
        ...baseSteps,
        { id: 'doelen', title: 'Doelen', icon: Target },
        { id: 'paginas', title: "Pagina's", icon: FileText },
        { id: 'content', title: 'Content', icon: Image },
        { id: 'extra', title: 'Planning', icon: Settings },
        { id: 'samenvatting', title: 'Controle', icon: CheckCircle2 },
      ]
    case 'webshop':
      return [
        ...baseSteps,
        { id: 'producten', title: 'Producten', icon: ShoppingBag },
        { id: 'betaling', title: 'Betaling', icon: Target },
        { id: 'features', title: 'Features', icon: Settings },
        { id: 'content', title: 'Content', icon: Image },
        { id: 'samenvatting', title: 'Controle', icon: CheckCircle2 },
      ]
    case 'drone':
      return [
        { id: 'project', title: 'Project', icon: Target },
        { id: 'locatie', title: 'Locatie', icon: Building2 },
        { id: 'planning', title: 'Planning', icon: Clock },
        { id: 'levering', title: 'Levering', icon: FileText },
        { id: 'samenvatting', title: 'Controle', icon: CheckCircle2 },
      ]
    case 'logo':
      return [
        ...baseSteps,
        { id: 'stijl', title: 'Stijl', icon: Palette },
        { id: 'inspiratie', title: 'Inspiratie', icon: Image },
        { id: 'gebruik', title: 'Gebruik', icon: Settings },
        { id: 'samenvatting', title: 'Controle', icon: CheckCircle2 },
      ]
    default:
      return baseSteps
  }
}

// ===========================================
// VALIDATION CONFIGURATION
// ===========================================

type ValidationRule = {
  required?: string[] // Field names that are required
  minLength?: { field: string; min: number; label: string }[]
}

const VALIDATION_RULES: Record<ServiceType, Record<string, ValidationRule>> = {
  website: {
    bedrijf: { 
      required: ['businessName', 'contactEmail'],
      minLength: [{ field: 'businessName', min: 2, label: 'Bedrijfsnaam' }]
    },
    branding: {},
    doelen: {},
    paginas: {},
    content: {},
    extra: {},
    samenvatting: {}
  },
  webshop: {
    bedrijf: { 
      required: ['businessName', 'contactEmail', 'aboutBusiness'],
      minLength: [{ field: 'businessName', min: 2, label: 'Bedrijfsnaam' }]
    },
    branding: {},
    producten: {},
    betaling: {},
    features: {},
    content: {},
    samenvatting: {}
  },
  drone: {
    project: { 
      required: ['contactName', 'contactEmail', 'projectType']
    },
    locatie: { 
      required: ['locationAddress', 'locationCity']
    },
    planning: { 
      required: ['preferredDate']
    },
    levering: {},
    samenvatting: {}
  },
  logo: {
    bedrijf: { 
      required: ['businessName', 'contactEmail', 'aboutBusiness'],
      minLength: [{ field: 'businessName', min: 2, label: 'Bedrijfsnaam' }]
    },
    branding: {},
    stijl: {},
    inspiratie: {},
    gebruik: {},
    samenvatting: {}
  }
}

// Helper to validate step
const validateStep = (service: ServiceType, stepId: string, data: Record<string, any>): string[] => {
  const rules = VALIDATION_RULES[service]?.[stepId]
  if (!rules) return []
  
  const errors: string[] = []
  
  // Check required fields
  if (rules.required) {
    for (const field of rules.required) {
      const value = data[field]
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        const fieldLabels: Record<string, string> = {
          businessName: 'Bedrijfsnaam',
          contactEmail: 'E-mailadres',
          contactName: 'Contactpersoon',
          aboutBusiness: 'Bedrijfsbeschrijving',
          projectType: 'Type project',
          locationAddress: 'Adres',
          locationCity: 'Plaats',
          preferredDate: 'Gewenste datum'
        }
        errors.push(`${fieldLabels[field] || field} is verplicht`)
      }
    }
  }
  
  // Check email format
  if (data.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
    errors.push('Vul een geldig e-mailadres in')
  }
  
  // Check min length
  if (rules.minLength) {
    for (const { field, min, label } of rules.minLength) {
      if (data[field] && data[field].length < min) {
        errors.push(`${label} moet minimaal ${min} karakters zijn`)
      }
    }
  }
  
  return errors
}

// ===========================================
// AUTO-SAVE HOOK
// ===========================================

const AUTOSAVE_DELAY = 2000 // 2 seconds debounce
const LOCAL_STORAGE_KEY = 'onboarding_draft'

interface EmailInUseError {
  existingProjectId: string
  statusUrl: string
}

function useAutoSave(
  projectId: string | undefined,
  serviceType: ServiceType,
  formData: Record<string, any>,
  currentStep: number,
  canEdit: boolean
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'email_in_use'>('idle')
  const [emailInUseError, setEmailInUseError] = useState<EmailInUseError | null>(null)
  const lastSavedRef = useRef<string>('')

  // Save to localStorage immediately
  const saveToLocal = useCallback(() => {
    try {
      const key = projectId ? `${LOCAL_STORAGE_KEY}_${projectId}` : `${LOCAL_STORAGE_KEY}_new_${serviceType}`
      localStorage.setItem(key, JSON.stringify({
        serviceType,
        formData,
        currentStep,
        savedAt: new Date().toISOString()
      }))
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }, [projectId, serviceType, formData, currentStep])

  // Save to server with debounce
  const saveToServer = useCallback(async () => {
    if (!canEdit) return
    
    const dataHash = JSON.stringify(formData)
    if (dataHash === lastSavedRef.current) return // No changes
    
    setAutoSaveStatus('saving')
    setEmailInUseError(null)
    try {
      const response = await fetch(`/api/client-onboarding?projectId=${projectId || 'new'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType,
          formData,
          currentStep,
          isAutoSave: true
        })
      })
      
      if (response.ok) {
        lastSavedRef.current = dataHash
        setAutoSaveStatus('saved')
        setTimeout(() => setAutoSaveStatus('idle'), 2000)
      } else if (response.status === 409) {
        // Email already in use
        const data = await response.json()
        setEmailInUseError({
          existingProjectId: data.existingProjectId,
          statusUrl: data.statusUrl
        })
        setAutoSaveStatus('email_in_use')
      } else {
        setAutoSaveStatus('error')
      }
    } catch (e) {
      console.error('Auto-save failed:', e)
      setAutoSaveStatus('error')
    }
  }, [projectId, serviceType, formData, currentStep, canEdit])

  // Debounced auto-save on data change
  useEffect(() => {
    if (!canEdit) return
    
    // Save to localStorage immediately
    saveToLocal()
    
    // Debounce server save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      saveToServer()
    }, AUTOSAVE_DELAY)
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [formData, saveToLocal, saveToServer, canEdit])

  // Load from localStorage on mount
  const loadFromLocal = useCallback((): Record<string, any> | null => {
    try {
      const key = projectId ? `${LOCAL_STORAGE_KEY}_${projectId}` : `${LOCAL_STORAGE_KEY}_new_${serviceType}`
      const saved = localStorage.getItem(key)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e)
    }
    return null
  }, [projectId, serviceType])

  // Clear local storage draft
  const clearLocalDraft = useCallback(() => {
    try {
      const key = projectId ? `${LOCAL_STORAGE_KEY}_${projectId}` : `${LOCAL_STORAGE_KEY}_new_${serviceType}`
      localStorage.removeItem(key)
    } catch (e) {
      console.error('Failed to clear localStorage:', e)
    }
  }, [projectId, serviceType])

  return { autoSaveStatus, emailInUseError, loadFromLocal, clearLocalDraft }
}

// ===========================================
// TIMELINE COMPONENT
// ===========================================

function ProjectTimeline({ 
  steps, 
  currentPhase 
}: { 
  steps: TimelineStep[]
  currentPhase: OnboardingPhase 
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary-500" />
        Project Timeline
      </h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = step.id === currentPhase
          const isCompleted = step.status === 'completed'
          
          return (
            <div key={step.id} className="flex items-start gap-3">
              {/* Connector line */}
              <div className="flex flex-col items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isActive 
                      ? 'bg-primary-500 text-white animate-pulse' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}
                `}>
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-0.5 h-8 ${isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                )}
              </div>
              
              {/* Step content */}
              <div className="flex-1 pb-4">
                <div className={`font-medium ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                  {step.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {step.description}
                </div>
                {isActive && (
                  <div className="mt-1 text-xs text-primary-500 font-medium">
                    ⏱ Geschat: {step.estimatedDays} {step.estimatedDays === 1 ? 'dag' : 'dagen'}
                  </div>
                )}
                {step.completedAt && (
                  <div className="mt-1 text-xs text-green-500">
                    ✓ Voltooid op {new Date(step.completedAt).toLocaleDateString('nl-NL')}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ===========================================
// CHAT COMPONENT  
// ===========================================

function ChatSection({
  messages,
  onSendMessage,
  loading
}: {
  messages: OnboardingMessage[]
  onSendMessage: (msg: string) => Promise<void>
  loading: boolean
}) {
  const [newMessage, setNewMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || loading) return
    
    await onSendMessage(newMessage.trim())
    setNewMessage('')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-500 to-blue-600 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Chat met Developer</h3>
            <p className="text-sm text-white/80">Stel je vragen direct</p>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <MessageSquare className="w-8 h-8 mb-2" />
            <p className="text-sm">Nog geen berichten</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === 'client' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[80%] rounded-2xl px-4 py-2 text-sm
                ${msg.from === 'client' 
                  ? 'bg-primary-500 text-white rounded-br-sm' 
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm shadow'}
              `}>
                {msg.message}
                <div className={`text-xs mt-1 ${msg.from === 'client' ? 'text-white/70' : 'text-gray-400'}`}>
                  {new Date(msg.date).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Typ je bericht..."
            className="flex-1 px-4 py-2 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  )
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function ClientOnboarding() {
  const { projectId } = useParams<{ projectId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  // State
  const [serviceType, setServiceType] = useState<ServiceType>('website')
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [messages, setMessages] = useState<OnboardingMessage[]>([])
  const [timeline, setTimeline] = useState<TimelineStep[]>([])
  const [currentPhase, setCurrentPhase] = useState<OnboardingPhase>('intake')
  const [canEdit, setCanEdit] = useState(true)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [projectFound, setProjectFound] = useState<boolean | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [driveUrl, setDriveUrl] = useState<string>('')

  // Auto-save hook
  const { autoSaveStatus, emailInUseError, loadFromLocal, clearLocalDraft } = useAutoSave(
    projectId,
    serviceType,
    formData,
    currentStep,
    canEdit
  )

  // Get steps for current service
  const steps = getStepsForService(serviceType)
  const totalSteps = steps.length
  const currentStepConfig = steps[currentStep - 1]
  const serviceConfig = SERVICE_CONFIG[serviceType]

  // Validate current step
  const validateCurrentStep = (): boolean => {
    const errors = validateStep(serviceType, currentStepConfig?.id || '', formData)
    setValidationErrors(errors)
    return errors.length === 0
  }

  // Initialize
  useEffect(() => {
    const service = searchParams.get('service') as ServiceType
    if (service && SERVICE_CONFIG[service]) {
      setServiceType(service)
    }

    // Try to load draft from localStorage first
    const localDraft = loadFromLocal()
    if (localDraft && !projectId) {
      // Show restore prompt for new projects
      const savedAt = new Date(localDraft.savedAt).toLocaleString('nl-NL')
      if (confirm(`Er is een concept gevonden van ${savedAt}. Wil je verder gaan waar je gebleven was?`)) {
        setFormData(localDraft.formData || {})
        setCurrentStep(localDraft.currentStep || 1)
        if (localDraft.serviceType) {
          setServiceType(localDraft.serviceType)
        }
      } else {
        clearLocalDraft()
      }
    }

    if (projectId) {
      loadProjectData(projectId)
    } else {
      // Initialize empty timeline
      import('../types/onboarding').then(({ getDefaultTimeline }) => {
        setTimeline(getDefaultTimeline(serviceType))
      })
    }
  }, [projectId, searchParams])

  // Load project data from /api/projects OR /api/client-onboarding
  const loadProjectData = async (id: string) => {
    setLoading(true)
    try {
      // First try to load from projects API (data from /start)
      const projectResponse = await fetch(`/api/projects?id=${id}`)
      if (projectResponse.ok) {
        const projectResult = await projectResponse.json()
        const project = projectResult.project
        
        if (project) {
          // Map project data to form data format
          const mappedData: Record<string, any> = {
            // Pre-fill from project customer data
            businessName: project.customer?.companyName || '',
            contactName: project.customer?.name || '',
            contactEmail: project.customer?.email || '',
            contactPhone: project.customer?.phone || '',
            
            // Pre-fill from onboarding data (from /start)
            ...project.onboardingData,
            
            // Map field names that differ between /start and /intake
            aboutBusiness: project.onboardingData?.uniqueFeatures || '',
            targetAudience: project.onboardingData?.targetAudience || '',
            brandColors: project.onboardingData?.colorPreferences || [],
            designStyle: project.onboardingData?.designStyle || '',
            mainGoal: project.onboardingData?.goal || '',
            selectedPages: project.onboardingData?.pages || [],
          }
          
          setFormData(mappedData)
          setServiceType(project.type || 'website')
          setCurrentPhase(project.status || 'intake')
          setCanEdit(project.status === 'intake' || project.status === 'onboarding')
          setProjectFound(true)
          // Get Drive URL from project
          setDriveUrl(project.googleDriveUrl || project.onboardingData?.driveFolderLink || '')
          
          // Initialize timeline
          import('../types/onboarding').then(({ getDefaultTimeline }) => {
            const defaultTimeline = getDefaultTimeline(project.type || 'website')
            // Mark intake as active or completed based on status
            const updatedTimeline = defaultTimeline.map(step => {
              if (step.id === 'intake') {
                return { ...step, status: project.status === 'intake' ? 'active' as const : 'completed' as const }
              }
              if (step.id === 'design' && (project.status === 'design' || project.status === 'development')) {
                return { ...step, status: 'active' as const }
              }
              return step
            })
            setTimeline(updatedTimeline)
          })
          
          setLoading(false)
          return
        }
      }
      
      // Fallback: Try client-onboarding API
      const response = await fetch(`/api/client-onboarding?projectId=${id}`)
      if (response.ok) {
        const data = await response.json()
        setFormData(data.formData || {})
        setMessages(data.messages || [])
        setTimeline(data.timeline || [])
        setCurrentPhase(data.currentPhase || 'intake')
        setCanEdit(data.canEdit ?? true)
        setServiceType(data.serviceType || 'website')
        setProjectFound(true)
      } else {
        setProjectFound(false)
      }
    } catch (err) {
      console.error('Failed to load project:', err)
      setProjectFound(false)
    } finally {
      setLoading(false)
    }
  }

  // Update form data
  const updateField = (field: string, value: any) => {
    if (!canEdit) return
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Save progress
  const saveProgress = async () => {
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`/api/client-onboarding?projectId=${projectId || 'new'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType,
          formData,
          currentStep,
          currentPhase
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        // If we got a new projectId, update the URL
        if (data.projectId && !projectId) {
          window.history.replaceState({}, '', `/intake/${serviceType}/${data.projectId}`)
        }
        setSuccess('Voortgang opgeslagen!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to save')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kon niet opslaan. Probeer opnieuw.'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  // Send message
  const sendMessage = async (message: string) => {
    const newMsg: OnboardingMessage = {
      id: Date.now().toString(),
      projectId: projectId || 'new',
      date: new Date().toISOString(),
      from: 'client',
      message,
      read: false
    }
    
    setMessages(prev => [...prev, newMsg])
    
    // Save to API
    try {
      await fetch(`/api/onboarding/${projectId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  // Navigate steps
  const nextStep = () => {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      return // Don't proceed if validation fails
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      setValidationErrors([]) // Clear errors when moving to next step
      saveProgress()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    if (canEdit && step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
    }
  }

  // Handle package upgrade - direct upgrade, no confirmation needed
  const handleUpgradeRequest = (newPackageId: string) => {
    const packageNames: Record<string, string> = {
      'starter': 'Starter',
      'professional': 'Professioneel',
      'business': 'Business',
      'webshopStarter': 'Webshop Starter',
      'webshopPro': 'Webshop Pro'
    }

    const packagePrices: Record<string, string> = {
      'starter': '€99/maand',
      'professional': '€149/maand',
      'business': '€199/maand',
      'webshopStarter': '€349/maand',
      'webshopPro': '€449/maand'
    }
    
    // Directly upgrade the package
    setFormData(prev => ({
      ...prev,
      package: newPackageId,
      packageType: newPackageId,
      previousPackage: prev.package || prev.packageType,
      upgradedAt: new Date().toISOString()
    }))
    
    setSuccess(`✨ Geüpgraded naar ${packageNames[newPackageId] || newPackageId} (${packagePrices[newPackageId] || ''})`)
    setTimeout(() => setSuccess(''), 4000)
    
    // Auto-save after upgrade
    setTimeout(() => {
      saveProgress()
    }, 500)
  }

  // Render the appropriate form step based on service type and current step
  const renderFormStep = () => {
    const stepId = currentStepConfig?.id
    if (!stepId) return null

    // Get current package from formData
    const currentPackage = formData.package || formData.packageType || 'starter'

    const formProps = {
      data: formData,
      onChange: updateField,
      disabled: !canEdit,
      packageId: currentPackage,
      onUpgrade: handleUpgradeRequest,
      onGoToStep: goToStep
    }

    // Get the step component based on service type
    switch (serviceType) {
      case 'website': {
        const StepComponent = WebsiteSteps[stepId as keyof typeof WebsiteSteps]
        return StepComponent ? <StepComponent {...formProps} /> : null
      }
      case 'webshop': {
        const StepComponent = WebshopSteps[stepId as keyof typeof WebshopSteps]
        return StepComponent ? <StepComponent {...formProps} /> : null
      }
      case 'drone': {
        const StepComponent = DroneSteps[stepId as keyof typeof DroneSteps]
        return StepComponent ? <StepComponent {...formProps} /> : null
      }
      case 'logo': {
        const StepComponent = LogoSteps[stepId as keyof typeof LogoSteps]
        return StepComponent ? <StepComponent {...formProps} /> : null
      }
      default:
        return <div className="text-center py-12 text-gray-400">Onbekend servicetype</div>
    }
  }

  // Submit final
  const submitOnboarding = async () => {
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`/api/client-onboarding-submit?projectId=${projectId || 'new'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType,
          formData
        })
      })
      
      if (response.ok) {
        // Navigate back to dashboard with success message
        navigate(`/status/${projectId}?onboarding=complete`)
      } else {
        throw new Error('Failed to submit')
      }
    } catch (err) {
      setError('Kon niet indienen. Probeer opnieuw.')
    } finally {
      setSaving(false)
    }
  }

  // Get service-specific link for status page
  const statusUrl = `/status/${projectId}`

  // Submitted successfully - Enhanced thank you screen
  if (submitted) {
    const nextSteps = [
      {
        icon: FolderOpen,
        title: 'Google Drive map',
        description: driveUrl 
          ? 'Je persoonlijke Google Drive map is klaar! Upload hier je logo, foto\'s en andere bestanden.'
          : 'Je ontvangt een e-mail met een Google Drive link waar je je logo, foto\'s en andere bestanden kunt uploaden.',
        time: driveUrl ? 'Nu beschikbaar' : 'In je mail',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-600 dark:text-blue-400',
        link: driveUrl || undefined,
      },
      {
        icon: Mail,
        title: 'Bevestiging via e-mail',
        description: 'Je krijgt een bevestigingsmail met alle informatie en een link naar je project dashboard.',
        time: 'Direct',
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        textColor: 'text-purple-600 dark:text-purple-400',
      },
      {
        icon: Palette,
        title: 'Eerste ontwerp',
        description: 'Zodra je bestanden zijn geüpload, gaan we aan de slag. Binnen 5-7 werkdagen ontvang je het eerste ontwerp.',
        time: '5-7 werkdagen',
        color: 'from-amber-500 to-amber-600',
        bgColor: 'bg-amber-50 dark:bg-amber-900/20',
        textColor: 'text-amber-600 dark:text-amber-400',
      },
      {
        icon: CheckCircle2,
        title: 'Feedback & live!',
        description: 'Na jouw goedkeuring maken we de laatste aanpassingen en gaat je website live. Alles volg je in je project dashboard.',
        time: 'Na goedkeuring',
        color: 'from-emerald-500 to-emerald-600',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
        textColor: 'text-emerald-600 dark:text-emerald-400',
      },
    ]

    const ServiceIcon = serviceConfig.icon

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-white dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-emerald-200/60 via-green-100/40 to-teal-100/30 dark:from-emerald-900/30 dark:via-green-900/20 dark:to-teal-900/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/40 via-primary-100/30 to-transparent dark:from-blue-900/20 dark:via-primary-900/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <header className="relative z-10 border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Logo />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${serviceConfig.gradient} flex items-center justify-center`}>
                <ServiceIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                {projectId}
              </span>
            </div>
          </div>
        </header>

        <main className="relative z-10 max-w-2xl mx-auto px-4 py-8 md:py-12">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 dark:border-gray-700 p-6 md:p-8 text-center mb-6"
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
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Bedankt voor het invullen! 🎉
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-md mx-auto">
              We hebben al je informatie ontvangen. Je ontvangt zo een bevestigingsmail met verdere instructies.
            </p>
          </motion.div>

          {/* What to expect - Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 dark:border-gray-700 p-6 md:p-8 mb-6"
          >
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
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
                    <div className="absolute left-5 top-12 w-0.5 h-[calc(100%-1rem)] bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800" />
                  )}
                  
                  {/* Icon */}
                  <div className={`relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-5 h-5 text-white" />
                    <span className="absolute -top-1 -left-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 shadow">
                      {index + 1}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${step.bgColor} ${step.textColor} font-medium`}>
                        {step.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                    {step.link && (
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        <FolderOpen className="w-4 h-4" />
                        Open Google Drive
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Drive link info box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                {driveUrl ? (
                  <>
                    <p className="text-blue-800 dark:text-blue-300 font-medium text-sm mb-2">
                      📁 Je Google Drive map is klaar!
                    </p>
                    <p className="text-blue-700 dark:text-blue-400 text-sm mb-3">
                      Upload hier je logo, foto's, teksten en andere bestanden. Zodra je dit hebt gedaan, starten we met je ontwerp!
                    </p>
                    <a
                      href={driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors shadow-lg shadow-blue-600/25"
                    >
                      <FolderOpen className="w-4 h-4" />
                      Open Google Drive map
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </>
                ) : (
                  <>
                    <p className="text-blue-800 dark:text-blue-300 font-medium text-sm mb-1">
                      Over de Drive link
                    </p>
                    <p className="text-blue-700 dark:text-blue-400 text-sm">
                      Je vindt de Google Drive link in je welkomst-email of op je project status pagina. Hier kun je al je bestanden uploaden: logo, foto's, teksten, etc. Zodra je dit hebt gedaan, starten we met je ontwerp!
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Tip box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6"
          >
            <p className="text-amber-800 dark:text-amber-300 text-sm">
              <strong>💡 Tip:</strong> Onze e-mails kunnen soms in je spam/ongewenste map terechtkomen. 
              Voeg <span className="font-medium">info@webstability.nl</span> toe aan je contacten zodat je niks mist!
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              onClick={() => {
                setSubmitted(false)
                setCanEdit(true)
                setCurrentStep(1)
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary-500 text-primary-600 dark:text-primary-400 rounded-xl font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition"
            >
              <Edit3 className="w-5 h-5" />
              Antwoorden bekijken/wijzigen
            </button>
            <a
              href={statusUrl}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition shadow-lg shadow-primary-500/25"
            >
              Bekijk project dashboard <ExternalLink className="w-5 h-5" />
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-500 dark:text-gray-400"
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

  // Loading state with skeleton
  if (loading) {
    return <ClientOnboardingSkeleton />
  }

  // Not found state
  if (projectFound === false) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Project niet gevonden
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Controleer de link of neem contact met ons op.
          </p>
        </div>
      </div>
    )
  }

  const ServiceIcon = serviceConfig.icon

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header - matching dashboard style */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link 
            to={projectId ? `/status/${projectId}` : '/'}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          
          <div className="flex items-center gap-3">
            {/* Auto-save indicator */}
            {autoSaveStatus === 'saving' && (
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Opslaan...</span>
              </div>
            )}
            {autoSaveStatus === 'saved' && (
              <div className="flex items-center gap-1.5 text-emerald-500 text-xs">
                <Check className="w-3 h-3" />
                <span>Opgeslagen</span>
              </div>
            )}
            
            {/* Edit status */}
            {!canEdit && (
              <div className="flex items-center gap-1.5 text-amber-500 text-xs bg-amber-500/10 px-2 py-1 rounded">
                <Lock className="w-3 h-3" />
                <span>Alleen lezen</span>
              </div>
            )}
            
            {projectId && (
              <span className="px-2.5 py-1 bg-gray-800 rounded-lg text-xs font-mono text-gray-400">
                {projectId}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Hero section with service info */}
      <div className={`bg-gradient-to-br ${serviceConfig.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <ServiceIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{serviceConfig.name} Onboarding</h1>
              <p className="text-white/80 text-sm">Vul alle informatie in voor je project</p>
            </div>
          </div>
          
          {/* Progress bar in hero */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-white/80 text-sm mb-2">
              <span className="font-medium">Stap {currentStep} van {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                className="h-full bg-white rounded-full shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-6 pb-32">
        {/* Step tabs - horizontal scroll on mobile */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isActive = index + 1 === currentStep
            const isCompleted = index + 1 < currentStep
            
            return (
              <button
                key={step.id}
                onClick={() => goToStep(index + 1)}
                disabled={!canEdit}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0
                  ${isActive 
                    ? 'bg-white text-gray-900 shadow-lg' 
                    : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-gray-800/50 text-gray-500 hover:bg-gray-800 border border-gray-700/50'}
                  ${canEdit ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
                {step.title}
              </button>
            )
          })}
        </div>

        {/* Current step title */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-white">{currentStepConfig?.title}</h2>
          <p className="text-gray-500 text-sm mt-1">Vul de onderstaande velden in</p>
        </div>

        {/* Form content */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-5"
            >
              {renderFormStep()}
            </motion.div>
          </AnimatePresence>

          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-gray-700 bg-red-500/10 px-5 py-4"
            >
              <div className="flex items-center gap-2 text-red-400 font-medium text-sm mb-2">
                <AlertCircle className="w-4 h-4" />
                Vul de verplichte velden in:
              </div>
              <ul className="text-red-400/80 text-sm space-y-1 ml-6">
                {validationErrors.map((error, i) => (
                  <li key={i}>• {error}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Email already in use error */}
          {emailInUseError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-gray-700 bg-amber-500/10 px-5 py-4"
            >
              <div className="flex items-center gap-2 text-amber-400 font-medium text-sm mb-2">
                <AlertCircle className="w-4 h-4" />
                Dit e-mailadres is al in gebruik
              </div>
              <p className="text-amber-400/80 text-sm mb-3">
                Er bestaat al een project met dit e-mailadres.
              </p>
              <a
                href={emailInUseError.statusUrl}
                className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300"
              >
                Bekijk je bestaande project
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          )}
        </div>

        {/* Success/Error toasts */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              {success}
            </motion.div>
          )}
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline - Collapsible on mobile */}
        {timeline.length > 0 && (
          <div className="mt-8">
            <ProjectTimeline steps={timeline} currentPhase={currentPhase} />
          </div>
        )}

        {/* Chat section - collapsible */}
        <div className="mt-8">
          <ChatSection 
            messages={messages}
            onSendMessage={sendMessage}
            loading={saving}
          />
        </div>
      </main>

      {/* Fixed bottom navigation - improved styling */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-xl hover:bg-gray-800"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Vorige</span>
          </button>

          {currentStep === totalSteps ? (
            <button
              onClick={submitOnboarding}
              disabled={saving || !canEdit || !!emailInUseError}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r ${serviceConfig.gradient} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50`}
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              Indienen
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!!emailInUseError}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r ${serviceConfig.gradient} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50`}
            >
              Volgende
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
