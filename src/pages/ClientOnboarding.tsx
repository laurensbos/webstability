import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
  Settings
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
        { id: 'extra', title: 'Extra', icon: Settings },
      ]
    case 'webshop':
      return [
        ...baseSteps,
        { id: 'producten', title: 'Producten', icon: ShoppingBag },
        { id: 'betaling', title: 'Betaling', icon: Target },
        { id: 'features', title: 'Features', icon: Settings },
        { id: 'content', title: 'Content', icon: Image },
      ]
    case 'drone':
      return [
        { id: 'project', title: 'Project', icon: Target },
        { id: 'locatie', title: 'Locatie', icon: Building2 },
        { id: 'planning', title: 'Planning', icon: Clock },
        { id: 'levering', title: 'Levering', icon: FileText },
      ]
    case 'logo':
      return [
        ...baseSteps,
        { id: 'stijl', title: 'Stijl', icon: Palette },
        { id: 'inspiratie', title: 'Inspiratie', icon: Image },
        { id: 'gebruik', title: 'Gebruik', icon: Settings },
      ]
    default:
      return baseSteps
  }
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

  // Get steps for current service
  const steps = getStepsForService(serviceType)
  const totalSteps = steps.length
  const currentStepConfig = steps[currentStep - 1]
  const serviceConfig = SERVICE_CONFIG[serviceType]

  // Initialize
  useEffect(() => {
    const service = searchParams.get('service') as ServiceType
    if (service && SERVICE_CONFIG[service]) {
      setServiceType(service)
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

  // Load project data
  const loadProjectData = async (id: string) => {
    setLoading(true)
    try {
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
        setSuccess('Voortgang opgeslagen!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        throw new Error('Failed to save')
      }
    } catch (err) {
      setError('Kon niet opslaan. Probeer opnieuw.')
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
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
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

  // Render the appropriate form step based on service type and current step
  const renderFormStep = () => {
    const stepId = currentStepConfig?.id
    if (!stepId) return null

    const formProps = {
      data: formData,
      onChange: updateField,
      disabled: !canEdit
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
        setSuccess('Onboarding ingediend! We nemen snel contact op.')
        setCanEdit(false)
      } else {
        throw new Error('Failed to submit')
      }
    } catch (err) {
      setError('Kon niet indienen. Probeer opnieuw.')
    } finally {
      setSaving(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Project laden...</p>
        </div>
      </div>
    )
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            
            <div className="flex items-center gap-4">
              {/* Edit indicator */}
              {!canEdit && (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline">Design fase gestart</span>
                </div>
              )}
              
              {/* Save button */}
              {canEdit && (
                <button
                  onClick={saveProgress}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit3 className="w-4 h-4" />}
                  Opslaan
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Service type badge */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${serviceConfig.gradient} flex items-center justify-center`}>
              <ServiceIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">{serviceConfig.name} Onboarding</h1>
              <p className="text-sm text-gray-400">Vul alle informatie in voor je project</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step indicator */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Stap {currentStep} van {totalSteps}
                  </p>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentStepConfig?.title}
                  </h2>
                </div>
                
                {canEdit && (
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full">
                    Bewerkbaar
                  </span>
                )}
              </div>

              {/* Step dots */}
              <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
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
                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                        ${isActive 
                          ? `bg-gradient-to-r ${serviceConfig.gradient} text-white shadow-lg` 
                          : isCompleted
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}
                        ${canEdit ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
                      `}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <StepIcon className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">{step.title}</span>
                    </button>
                  )
                })}
              </div>

              {/* Form content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="min-h-[300px]"
                >
                  {renderFormStep()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-6 border-t dark:border-gray-700">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Vorige
                </button>

                {currentStep === totalSteps ? (
                  <button
                    onClick={submitOnboarding}
                    disabled={saving || !canEdit}
                    className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${serviceConfig.gradient} text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50`}
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    Indienen
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${serviceConfig.gradient} text-white rounded-xl font-medium hover:shadow-lg transition-all`}
                  >
                    Volgende
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Success/Error messages */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {success}
                </motion.div>
              )}
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            {timeline.length > 0 && (
              <ProjectTimeline steps={timeline} currentPhase={currentPhase} />
            )}

            {/* Chat */}
            <ChatSection 
              messages={messages}
              onSendMessage={sendMessage}
              loading={saving}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
