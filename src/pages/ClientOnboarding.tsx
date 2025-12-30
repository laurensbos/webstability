import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ClientOnboardingSkeleton } from '../components/LoadingSkeletons'
import {
  Globe,
  ShoppingBag,
  Plane,
  PenTool,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Building2,
  Palette,
  Target,
  FileText,
  Image,
  Settings,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import type { 
  ServiceType
} from '../types/onboarding'

// Import form steps for each service
import { WebsiteSteps } from '../components/onboarding/WebsiteFormSteps'
import { WebshopSteps } from '../components/onboarding/WebshopFormSteps'
import { DroneSteps } from '../components/onboarding/DroneFormSteps'
import { LogoSteps } from '../components/onboarding/LogoFormSteps'

// ===========================================
// CONSTANTS
// ===========================================

interface ServiceConfigData {
  icon: React.ElementType
  gradient: string
  color: string
}

const SERVICE_CONFIG_BASE: Record<ServiceType, ServiceConfigData> = {
  website: {
    icon: Globe,
    gradient: 'from-primary-500 to-blue-600',
    color: 'primary'
  },
  webshop: {
    icon: ShoppingBag,
    gradient: 'from-emerald-500 to-green-600',
    color: 'emerald'
  },
  drone: {
    icon: Plane,
    gradient: 'from-orange-500 to-amber-600',
    color: 'orange'
  },
  logo: {
    icon: PenTool,
    gradient: 'from-purple-500 to-violet-600',
    color: 'purple'
  }
}

// Hook to get translated service config
function useServiceConfig(): Record<ServiceType, ServiceConfigData & { name: string }> {
  const { t } = useTranslation()
  return {
    website: { ...SERVICE_CONFIG_BASE.website, name: t('clientOnboarding.services.website') },
    webshop: { ...SERVICE_CONFIG_BASE.webshop, name: t('clientOnboarding.services.webshop') },
    drone: { ...SERVICE_CONFIG_BASE.drone, name: t('clientOnboarding.services.drone') },
    logo: { ...SERVICE_CONFIG_BASE.logo, name: t('clientOnboarding.services.logo') }
  }
}

// ===========================================
// STEP CONFIGURATIONS PER SERVICE
// ===========================================

interface StepConfig {
  id: string
  titleKey: string
  icon: React.ElementType
}

const getStepsForServiceBase = (service: ServiceType): StepConfig[] => {
  const baseSteps: StepConfig[] = [
    { id: 'bedrijf', titleKey: 'clientOnboarding.steps.bedrijf', icon: Building2 },
    { id: 'branding', titleKey: 'clientOnboarding.steps.branding', icon: Palette },
  ]

  switch (service) {
    case 'website':
      return [
        ...baseSteps,
        { id: 'doelen', titleKey: 'clientOnboarding.steps.doelen', icon: Target },
        { id: 'paginas', titleKey: 'clientOnboarding.steps.paginas', icon: FileText },
        { id: 'content', titleKey: 'clientOnboarding.steps.content', icon: Image },
        { id: 'extra', titleKey: 'clientOnboarding.steps.planning', icon: Settings },
        { id: 'samenvatting', titleKey: 'clientOnboarding.steps.controle', icon: CheckCircle2 },
      ]
    case 'webshop':
      return [
        ...baseSteps,
        { id: 'producten', titleKey: 'clientOnboarding.steps.producten', icon: ShoppingBag },
        { id: 'betaling', titleKey: 'clientOnboarding.steps.betaling', icon: Target },
        { id: 'features', titleKey: 'clientOnboarding.steps.features', icon: Settings },
        { id: 'content', titleKey: 'clientOnboarding.steps.content', icon: Image },
        { id: 'samenvatting', titleKey: 'clientOnboarding.steps.controle', icon: CheckCircle2 },
      ]
    case 'drone':
      return [
        { id: 'project', titleKey: 'clientOnboarding.steps.project', icon: Target },
        { id: 'locatie', titleKey: 'clientOnboarding.steps.locatie', icon: Building2 },
        { id: 'planning', titleKey: 'clientOnboarding.steps.planning', icon: Clock },
        { id: 'levering', titleKey: 'clientOnboarding.steps.levering', icon: FileText },
        { id: 'samenvatting', titleKey: 'clientOnboarding.steps.controle', icon: CheckCircle2 },
      ]
    case 'logo':
      return [
        ...baseSteps,
        { id: 'stijl', titleKey: 'clientOnboarding.steps.stijl', icon: Palette },
        { id: 'inspiratie', titleKey: 'clientOnboarding.steps.inspiratie', icon: Image },
        { id: 'gebruik', titleKey: 'clientOnboarding.steps.gebruik', icon: Settings },
        { id: 'samenvatting', titleKey: 'clientOnboarding.steps.controle', icon: CheckCircle2 },
      ]
    default:
      return baseSteps
  }
}

// Hook to get translated steps
function useStepsForService(service: ServiceType): Array<StepConfig & { title: string }> {
  const { t } = useTranslation()
  const baseSteps = getStepsForServiceBase(service)
  return baseSteps.map(step => ({
    ...step,
    title: t(step.titleKey)
  }))
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

// Helper to validate step - now returns translation keys
const validateStep = (service: ServiceType, stepId: string, data: Record<string, any>): string[] => {
  const rules = VALIDATION_RULES[service]?.[stepId]
  if (!rules) return []
  
  const errors: string[] = []
  
  // Check required fields - return field IDs for translation
  if (rules.required) {
    for (const field of rules.required) {
      const value = data[field]
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors.push(`field:${field}`)
      }
    }
  }
  
  // Check email format
  if (data.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
    errors.push('error:invalidEmail')
  }
  
  // Check min length
  if (rules.minLength) {
    for (const { field, min } of rules.minLength) {
      if (data[field] && data[field].length < min) {
        errors.push(`minLength:${field}:${min}`)
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
// MAIN COMPONENT
// ===========================================

export default function ClientOnboarding() {
  const { projectId } = useParams<{ projectId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  
  // State
  const [serviceType, setServiceType] = useState<ServiceType>('website')
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [canEdit, setCanEdit] = useState(true)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [projectFound, setProjectFound] = useState<boolean | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [approvedForDesign, setApprovedForDesign] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  
  // Suppress unused variable warnings (used for future reference)
  void submitted
  void setSubmitted

  // Auto-save hook
  const { autoSaveStatus, emailInUseError, loadFromLocal, clearLocalDraft } = useAutoSave(
    projectId,
    serviceType,
    formData,
    currentStep,
    canEdit
  )

  // Translated hooks
  const allServiceConfigs = useServiceConfig()
  const steps = useStepsForService(serviceType)
  const totalSteps = steps.length
  const currentStepConfig = steps[currentStep - 1]
  const serviceConfig = allServiceConfigs[serviceType]

  // Validate current step
  const validateCurrentStep = (): boolean => {
    const errors = validateStep(serviceType, currentStepConfig?.id || '', formData)
    setValidationErrors(errors)
    return errors.length === 0
  }

  // Initialize
  useEffect(() => {
    const service = searchParams.get('service') as ServiceType
    if (service && SERVICE_CONFIG_BASE[service]) {
      setServiceType(service)
    }

    // Try to load draft from localStorage first
    const localDraft = loadFromLocal()
    if (localDraft && !projectId) {
      // Show restore prompt for new projects
      const locale = i18n.language === 'nl' ? 'nl-NL' : 'en-US'
      const savedAt = new Date(localDraft.savedAt).toLocaleString(locale)
      if (confirm(t('clientOnboarding.draftFound', { savedAt }))) {
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
            aboutBusiness: project.onboardingData?.uniqueFeatures || project.onboardingData?.aboutBusiness || '',
            targetAudience: project.onboardingData?.targetAudience || '',
            brandColors: project.onboardingData?.colorPreferences || project.onboardingData?.brandColors || [],
            designStyle: project.onboardingData?.designStyle || '',
            mainGoal: project.onboardingData?.goal || project.onboardingData?.mainGoal || '',
            // Keep pages as both 'pages' and 'selectedPages' for compatibility
            pages: project.onboardingData?.pages || project.onboardingData?.selectedPages || [],
            selectedPages: project.onboardingData?.selectedPages || project.onboardingData?.pages || [],
          }
          
          setFormData(mappedData)
          setServiceType(project.type || 'website')
          setCanEdit(project.status === 'intake' || project.status === 'onboarding')
          
          // Restore current step from saved data
          if (project.onboardingData?.currentStep && typeof project.onboardingData.currentStep === 'number') {
            setCurrentStep(project.onboardingData.currentStep)
          }
          setProjectFound(true)
          // Get unread messages count
          const unread = project.messages?.filter((m: { read: boolean; from: string }) => !m.read && m.from === 'developer')?.length || 0
          setUnreadCount(unread)
          
          setLoading(false)
          return
        }
      }
      
      // Fallback: Try client-onboarding API
      const response = await fetch(`/api/client-onboarding?projectId=${id}`)
      if (response.ok) {
        const data = await response.json()
        setFormData(data.formData || {})
        setCanEdit(data.canEdit ?? true)
        setServiceType(data.serviceType || 'website')
        setProjectFound(true)
        
        // Restore current step from saved data
        if (data.formData?.currentStep && typeof data.formData.currentStep === 'number') {
          setCurrentStep(data.formData.currentStep)
        }
        
        // Get unread messages count
        const unread = data.messages?.filter((m: { read: boolean; from: string }) => !m.read && m.from === 'developer')?.length || 0
        setUnreadCount(unread)
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
          currentStep
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        // If we got a new projectId, update the URL
        if (data.projectId && !projectId) {
          window.history.replaceState({}, '', `/intake/${serviceType}/${data.projectId}`)
        }
        setSuccess(t('clientOnboarding.progressSaved'))
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to save')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('clientOnboarding.saveError')
      setError(message)
    } finally {
      setSaving(false)
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
      'professional': t('clientOnboarding.packages.professional'),
      'business': 'Business',
      'webshopStarter': 'Webshop Starter',
      'webshopPro': 'Webshop Pro'
    }

    const packagePrices: Record<string, string> = {
      'starter': t('clientOnboarding.prices.starter'),
      'professional': t('clientOnboarding.prices.professional'),
      'business': t('clientOnboarding.prices.business'),
      'webshopStarter': t('clientOnboarding.prices.webshopStarter'),
      'webshopPro': t('clientOnboarding.prices.webshopPro')
    }
    
    // Directly upgrade the package
    setFormData(prev => ({
      ...prev,
      package: newPackageId,
      packageType: newPackageId,
      previousPackage: prev.package || prev.packageType,
      upgradedAt: new Date().toISOString()
    }))
    
    setSuccess(t('clientOnboarding.upgradedTo', { package: packageNames[newPackageId] || newPackageId, price: packagePrices[newPackageId] || '' }))
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
      onGoToStep: goToStep,
      approvedForDesign: approvedForDesign,
      onApprovalChange: setApprovedForDesign
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
        return <div className="text-center py-12 text-gray-400">{t('clientOnboarding.unknownService')}</div>
    }
  }

  // Submit final
  const submitOnboarding = async () => {
    if (!approvedForDesign) {
      setError(t('clientOnboarding.approvalRequired'))
      return
    }
    
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`/api/client-onboarding-submit?projectId=${projectId || 'new'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType,
          formData,
          approvedForDesign: true // Client explicitly approved
        })
      })
      
      if (response.ok) {
        await response.json()
        // Clear local draft
        clearLocalDraft()
        // Redirect to client dashboard with success message
        navigate(`/status/${projectId}?onboarding=complete`)
      } else {
        throw new Error('Failed to submit')
      }
    } catch (err) {
      setError(t('clientOnboarding.submitError'))
    } finally {
      setSaving(false)
    }
  }

  // Loading state with skeleton
  // Also show skeleton when we have a projectId but haven't determined if it exists yet
  if (loading || (projectId && projectFound === null)) {
    return <ClientOnboardingSkeleton />
  }

  // Not found state - only show when we've actually checked and confirmed not found
  if (projectFound === false) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('clientOnboarding.projectNotFound')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('clientOnboarding.checkLinkOrContact')}
          </p>
        </div>
      </div>
    )
  }

  const ServiceIcon = serviceConfig.icon

  // Helper to translate validation errors
  const translateValidationError = (error: string): string => {
    if (error.startsWith('field:')) {
      const field = error.replace('field:', '')
      return t('clientOnboarding.validation.fieldRequired', { field: t(`clientOnboarding.fields.${field}`) })
    }
    if (error === 'error:invalidEmail') {
      return t('clientOnboarding.validation.invalidEmail')
    }
    if (error.startsWith('minLength:')) {
      const [, field, min] = error.split(':')
      return t('clientOnboarding.validation.minLength', { field: t(`clientOnboarding.fields.${field}`), min })
    }
    return error
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header - matching dashboard style */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link 
            to={projectId ? `/status/${projectId}` : '/'}
            className="relative flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">{t('clientOnboarding.dashboard')}</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
          
          <div className="flex items-center gap-3">
            {/* Auto-save indicator */}
            {autoSaveStatus === 'saving' && (
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="hidden sm:inline">{t('clientOnboarding.saving')}</span>
              </div>
            )}
            {autoSaveStatus === 'saved' && (
              <div className="flex items-center gap-1.5 text-emerald-500 text-xs">
                <Check className="w-3 h-3" />
                <span className="hidden sm:inline">{t('clientOnboarding.saved')}</span>
              </div>
            )}
            
            {/* Edit status */}
            {!canEdit && (
              <div className="flex items-center gap-1.5 text-amber-500 text-xs bg-amber-500/10 px-2 py-1 rounded">
                <Lock className="w-3 h-3" />
                <span className="hidden sm:inline">{t('clientOnboarding.readOnly')}</span>
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

      {/* Hero section with service info and horizontal progress */}
      <div className={`bg-gradient-to-br ${serviceConfig.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative max-w-3xl mx-auto px-4 py-5">
          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <ServiceIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{serviceConfig.name} {t('clientOnboarding.onboarding')}</h1>
                <p className="text-white/70 text-xs">{t('clientOnboarding.stepOf', { current: currentStep, total: totalSteps })}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{Math.round((currentStep / totalSteps) * 100)}%</div>
              <div className="text-white/60 text-xs">{t('clientOnboarding.completed')}</div>
            </div>
          </div>
          
          {/* Horizontal step indicator */}
          <div className="flex items-center gap-1">
            {steps.map((step, index) => {
              const isActive = index + 1 === currentStep
              const isCompleted = index + 1 < currentStep
              
              return (
                <div key={step.id} className="flex-1 flex items-center">
                  {/* Step dot/bar */}
                  <button
                    onClick={() => goToStep(index + 1)}
                    disabled={!canEdit}
                    className={`
                      relative flex-1 h-2 rounded-full transition-all duration-300
                      ${isCompleted 
                        ? 'bg-white' 
                        : isActive 
                          ? 'bg-white/80' 
                          : 'bg-white/30'}
                      ${canEdit ? 'cursor-pointer hover:bg-white/90' : 'cursor-default'}
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeStep"
                        className="absolute inset-0 bg-white rounded-full shadow-lg shadow-white/50"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
          
          {/* Step labels - visible on larger screens */}
          <div className="hidden sm:flex items-center gap-1 mt-2">
            {steps.map((step, index) => {
              const isActive = index + 1 === currentStep
              const isCompleted = index + 1 < currentStep
              
              return (
                <div key={`label-${step.id}`} className="flex-1 text-center">
                  <span className={`text-xs ${isActive ? 'text-white font-medium' : isCompleted ? 'text-white/80' : 'text-white/50'}`}>
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-6 pb-32">
        {/* Current step title with icon */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${serviceConfig.gradient} flex items-center justify-center shadow-lg`}>
            {currentStepConfig && (() => {
              const StepIcon = currentStepConfig.icon
              return <StepIcon className="w-5 h-5 text-white" />
            })()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{currentStepConfig?.title}</h2>
            <p className="text-gray-500 text-sm">{t('clientOnboarding.fillInFields')}</p>
          </div>
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
                {t('clientOnboarding.fillRequiredFields')}
              </div>
              <ul className="text-red-400/80 text-sm space-y-1 ml-6">
                {validationErrors.map((error, i) => (
                  <li key={i}>• {translateValidationError(error)}</li>
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
                {t('clientOnboarding.emailInUse')}
              </div>
              <p className="text-amber-400/80 text-sm mb-3">
                {t('clientOnboarding.projectExistsWithEmail')}
              </p>
              <a
                href={emailInUseError.statusUrl}
                className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300"
              >
                {t('clientOnboarding.viewExistingProject')}
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
            <span className="hidden sm:inline">{t('clientOnboarding.previous')}</span>
          </button>

          {currentStep === totalSteps ? (
            <button
              onClick={submitOnboarding}
              disabled={saving || !canEdit || !!emailInUseError || !approvedForDesign}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 ${
                approvedForDesign 
                  ? `bg-gradient-to-r ${serviceConfig.gradient}` 
                  : 'bg-gray-600'
              } text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              {approvedForDesign ? t('clientOnboarding.approveAndSubmit') : t('clientOnboarding.approveFirst')}
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!!emailInUseError}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r ${serviceConfig.gradient} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50`}
            >
              {t('clientOnboarding.next')}
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
