import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectStatusSkeleton } from '../components/LoadingSkeletons'
import {
  CheckCircle2,
  CheckCircle,
  Circle,
  Clock,
  Loader2,
  AlertCircle,
  FileText,
  Palette,
  Rocket,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Send,
  FolderOpen,
  Mail,
  Shield,
  Star,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Timer,
  CreditCard,
  X,
  RefreshCw
} from 'lucide-react'
import Logo from '../components/Logo'
import ClientAccountModal from '../components/ClientAccountModal'
import DesignPreviewModal from '../components/DesignPreviewModalNew'
import PreLiveChecklist from '../components/PreLiveChecklist'
import PreLiveApproval from '../components/PreLiveApproval'
import ClientLiveDashboard from '../components/ClientLiveDashboard'
import DeveloperUpdates from '../components/DeveloperUpdates'
import PackagePhaseCard from '../components/PackagePhaseCard'
import CustomerTaskChecklist from '../components/CustomerTaskChecklist'
import HelpCenter from '../components/HelpCenter'
import NotificationBell, { generateProjectNotifications } from '../components/NotificationBell'
import OnboardingTour, { useOnboardingTour } from '../components/OnboardingTour'
import ProjectTimeline from '../components/ProjectTimeline'
import MilestoneCelebration, { useMilestoneCelebration } from '../components/MilestoneCelebration'
import { ReferralWidget } from '../components/GrowthTools'
import MobileBottomNav from '../components/MobileBottomNav'
import QuickActions from '../components/QuickActions'
import { DarkModeButton } from '../components/DarkModeToggle'
import { useKeyboardShortcuts, KeyboardShortcutsModal, KeyboardShortcutHint } from '../hooks/useKeyboardShortcuts'
import PWAInstallPrompt from '../components/PWAInstallPrompt'
import type { Notification } from '../components/NotificationBell'
import { useDarkMode } from '../contexts/DarkModeContext'
import { useSEO } from '../hooks/useSEO'
import { getPhaseInfo as getPackagePhaseInfo, PACKAGES } from '../config/packages'
import type { PackageType } from '../config/packages'
import type { Project, ProjectPhase, ProjectMessage } from '../types/project'
import { getProgressPercentage } from '../types/project'

// Helper function to ensure URL has protocol
const ensureAbsoluteUrl = (url: string | undefined): string => {
  if (!url) return ''
  const trimmed = url.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  return `https://${trimmed}`
}

// Phase configuration - Visual stepper phases
// Flow: Onboarding → Design → Feedback → Revisie → Betaling → Goedkeuring → Live
const PHASES: { key: ProjectPhase; label: string; icon: typeof FileText }[] = [
  { key: 'onboarding', label: 'Onboarding', icon: FileText },
  { key: 'design', label: 'Design', icon: Palette },
  { key: 'feedback', label: 'Feedback', icon: MessageSquare },
  { key: 'revisie', label: 'Revisie', icon: RefreshCw },
  { key: 'payment', label: 'Betaling', icon: CreditCard },
  { key: 'approval', label: 'Goedkeuring', icon: CheckCircle },
  { key: 'live', label: 'Live', icon: Rocket }
]

// Client actions per phase
const PHASE_ACTIONS: Record<ProjectPhase, { 
  title: string
  description: string
  buttonText: string
  buttonLink?: string
  type: 'link' | 'action' | 'none' | 'whatsapp'
  urgent?: boolean
}[]> = {
  onboarding: [
    { 
      title: 'Onboarding invullen', 
      description: 'Vul je bedrijfsgegevens in',
      buttonText: 'Onboarding',
      buttonLink: '/intake/:projectId',
      type: 'link',
      urgent: true
    },
    { 
      title: 'Direct contact via Chat', 
      description: 'Stel je vraag via de chat',
      buttonText: 'Chat',
      type: 'action'
    }
  ],
  design: [
    { 
      title: 'WhatsApp ons', 
      description: 'Heb je een vraag? Stuur ons een berichtje',
      buttonText: 'WhatsApp',
      type: 'whatsapp'
    }
  ],
  feedback: [
    { 
      title: 'Bekijk je design', 
      description: 'Bekijk de preview en geef feedback',
      buttonText: 'Design bekijken',
      type: 'action',
      urgent: true
    }
  ],
  revisie: [
    { 
      title: 'WhatsApp ons', 
      description: 'Heb je een vraag? Stuur ons een berichtje',
      buttonText: 'WhatsApp',
      type: 'whatsapp'
    }
  ],
  payment: [
    { 
      title: 'Betaling afronden', 
      description: 'Rond de betaling af om live te gaan',
      buttonText: 'Betalen',
      type: 'action',
      urgent: true
    }
  ],
  approval: [
    { 
      title: 'Goedkeuring geven', 
      description: 'Controleer alles en geef je akkoord',
      buttonText: 'Goedkeuren',
      type: 'action',
      urgent: true
    }
  ],
  live: []
}

// Phase expectations text - now dynamically based on package
const PHASE_INFO: Record<ProjectPhase, { title: string; description: string }> = {
  onboarding: {
    title: 'We verzamelen je informatie',
    description: 'Vul de onboarding in zodat we je bedrijf goed begrijpen. Upload vervolgens media via de projectbestanden knop. Klaar? Klik op de groene knop en we gaan aan de slag met je design.'
  },
  design: {
    title: 'Je design wordt gemaakt',
    description: 'We werken aan het ontwerp van jouw website. Je ontvangt binnenkort een preview om te bekijken.'
  },
  feedback: {
    title: 'Bekijk je design preview',
    description: 'Je design is klaar! Bekijk de preview en geef je feedback. Na goedkeuring ontvang je de betaallink.'
  },
  revisie: {
    title: 'Je feedback wordt verwerkt ✨',
    description: 'Bedankt voor je feedback! We zijn de aanpassingen aan het verwerken. Je ontvangt binnenkort een nieuwe preview.'
  },
  payment: {
    title: 'Wachten op betaling',
    description: 'Je design is goedgekeurd! Na de betaling zetten we je website live.'
  },
  approval: {
    title: 'Laatste check voor livegang',
    description: 'Je betaling is ontvangen! Controleer nog even of alles klopt en geef je goedkeuring. Dan zetten we je site live!'
  },
  live: {
    title: 'Gefeliciteerd! 🎉',
    description: 'Je website is live en bereikbaar voor de wereld. Welkom!'
  }
}

// Get dynamic phase info based on package
const getDynamicPhaseInfo = (phase: ProjectPhase, packageType?: string): { title: string; description: string } => {
  // If we have a valid package, use the package-specific info
  if (packageType && ['starter', 'professional', 'business', 'webshop'].includes(packageType)) {
    const pkgPhaseInfo = getPackagePhaseInfo(packageType as PackageType, phase)
    const pkg = PACKAGES[packageType as PackageType]
    
    // Add package-specific details to descriptions
    if (phase === 'feedback' && pkg.revisions > 1) {
      return {
        title: pkgPhaseInfo.title,
        description: `${pkgPhaseInfo.description} Je hebt ${pkg.revisions} revisierondes inclusief.`
      }
    }
    
    if (phase === 'payment') {
      return {
        title: pkgPhaseInfo.title,
        description: `Je design is goedgekeurd! Rond de betaling van €${pkg.price}/maand af om live te gaan.`
      }
    }
    
    return {
      title: pkgPhaseInfo.title,
      description: pkgPhaseInfo.description
    }
  }
  
  // Fallback to static info
  return PHASE_INFO[phase]
}

// Get phase color scheme
const getPhaseColors = (phase: ProjectPhase) => {
  const colors: Record<ProjectPhase, { bg: string; gradient: string; text: string }> = {
    onboarding: { bg: 'bg-blue-500', gradient: 'from-blue-600 to-indigo-600', text: 'text-blue-400' },
    design: { bg: 'bg-amber-500', gradient: 'from-amber-500 to-orange-500', text: 'text-amber-400' },
    feedback: { bg: 'bg-indigo-500', gradient: 'from-indigo-500 to-purple-500', text: 'text-indigo-400' },
    revisie: { bg: 'bg-cyan-500', gradient: 'from-cyan-500 to-blue-500', text: 'text-cyan-400' },
    payment: { bg: 'bg-purple-500', gradient: 'from-purple-600 to-indigo-500', text: 'text-purple-400' },
    approval: { bg: 'bg-pink-500', gradient: 'from-pink-500 to-rose-500', text: 'text-pink-400' },
    live: { bg: 'bg-green-500', gradient: 'from-green-500 to-emerald-500', text: 'text-green-400' }
  }
  return colors[phase] || colors.onboarding
}

// Calculate deadline countdown
const useDeadlineCountdown = (deadline?: string) => {
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number } | null>(null)
  
  useEffect(() => {
    if (!deadline) return
    
    const calculate = () => {
      const now = new Date()
      const target = new Date(deadline)
      const diff = target.getTime() - now.getTime()
      
      if (diff < 0) return setCountdown({ days: 0, hours: 0, minutes: 0 })
      
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      })
    }
    
    calculate()
    const interval = setInterval(calculate, 60000)
    return () => clearInterval(interval)
  }, [deadline])
  
  return countdown
}

import { getWhatsAppLink, WHATSAPP_MESSAGES } from '../lib/constants'

export default function ProjectStatusNew() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { darkMode, toggleDarkMode } = useDarkMode()
  
  // State
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  
  // Chat state
  const [messages, setMessages] = useState<ProjectMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [messageLoading, setMessageLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatExpanded, setChatExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prevMessageCountRef = useRef<number>(0)
  
  // Onboarding state
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)
  
  // Success banner for just completed onboarding
  const [showOnboardingSuccess, setShowOnboardingSuccess] = useState(false)
  
  // Ready for design confirmation
  const [confirmingReadyForDesign, setConfirmingReadyForDesign] = useState(false)
  const [readyForDesignLoading, setReadyForDesignLoading] = useState(false)
  
  // Account modal state
  const [showAccountModal, setShowAccountModal] = useState(false)
  
  // Design preview modal state
  const [showDesignPreview, setShowDesignPreview] = useState(false)
  
  // Help center state
  const [showHelpCenter, setShowHelpCenter] = useState(false)
  
  // Onboarding tour
  const { shouldShowTour, dismissTour, resetTour } = useOnboardingTour()
  
  // Milestone celebrations
  const { currentMilestone, celebrate, closeCelebration } = useMilestoneCelebration(projectId || '')
  
  // Keyboard shortcuts
  const { showShortcutsModal, setShowShortcutsModal, shortcuts } = useKeyboardShortcuts({
    enabled: isVerified,
    onOpenChat: () => setShowChat(true),
    onOpenDrive: () => project?.googleDriveUrl && window.open(project.googleDriveUrl, '_blank'),
    onOpenHelp: () => setShowHelpCenter(true),
    onToggleDarkMode: toggleDarkMode,
    onScrollToTop: () => window.scrollTo({ top: 0, behavior: 'smooth' })
  })
  
  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  // Task completion state
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  
  const phaseColors = project ? getPhaseColors(project.status) : getPhaseColors('onboarding')
  
  // SEO - Set page title and description
  useSEO({
    title: project 
      ? `${project.businessName} - Project Status` 
      : 'Project Status',
    description: project 
      ? `Bekijk de voortgang van het project voor ${project.businessName}. Huidige fase: ${PHASES.find(p => p.key === project.status)?.label || project.status}.`
      : 'Bekijk de voortgang van je website project bij Webstability.',
    noindex: true // Klantenpagina's moeten niet geïndexeerd worden
  })
  
  // Calculate deadline for current phase
  const currentDeadline = project?.phaseDeadlines?.[project.status as keyof typeof project.phaseDeadlines]
  const countdown = useDeadlineCountdown(currentDeadline)

  // Check for existing session
  useEffect(() => {
    if (!projectId) return
    
    const normalizedId = projectId.toUpperCase()
    const hasSession = sessionStorage.getItem(`project_auth_${normalizedId}`) === 'true'
    const pwd = searchParams.get('pwd')
    const magicSession = searchParams.get('magic_session')
    
    // Always remove sensitive params from URL immediately
    if (pwd || magicSession) {
      window.history.replaceState({}, '', `/status/${projectId}`)
    }
    
    if (hasSession) {
      setIsVerified(true)
      // Eerst project laden, loading blijft true totdat fetch klaar is
      fetchProject(projectId).finally(() => setLoading(false))
      fetchMessages(projectId)
      fetchOnboardingStatus(projectId)
    } else if (magicSession) {
      verifyMagicSession(projectId, magicSession)
    } else if (pwd) {
      verifyPassword(projectId, pwd)
    } else {
      setLoading(false)
    }
  }, [projectId, searchParams])

  // Check for onboarding complete query param
  useEffect(() => {
    if (searchParams.get('onboarding') === 'complete') {
      setShowOnboardingSuccess(true)
      // Remove the query param from URL without reload
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => setShowOnboardingSuccess(false), 10000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  // Polling for updates - every 5 seconds for fast chat
  useEffect(() => {
    if (!isVerified || !projectId) return
    const interval = setInterval(() => {
      fetchProject(projectId)
      fetchMessages(projectId)
    }, 5000)
    return () => clearInterval(interval)
  }, [isVerified, projectId])

  // Generate notifications when project loads
  useEffect(() => {
    if (project) {
      const generatedNotifications = generateProjectNotifications({
        status: project.status,
        businessName: project.businessName,
        designPreviewUrl: project.designPreviewUrl,
        paymentStatus: project.paymentStatus,
        createdAt: project.createdAt
      })
      setNotifications(generatedNotifications)
    }
  }, [project?.status, project?.businessName])

  // Trigger milestone celebrations based on project status
  useEffect(() => {
    if (!project?.status) return
    
    // Map project status to milestone type
    const statusToMilestone: Record<string, 'design_ready' | 'website_live'> = {
      'feedback': 'design_ready',  // Design is ready when entering feedback phase
      'live': 'website_live'       // Website is live
    }
    
    const milestone = statusToMilestone[project.status]
    if (milestone) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        celebrate(milestone)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [project?.status, celebrate])

  // Load completed tasks from localStorage
  useEffect(() => {
    if (project?.projectId && project?.status) {
      const stored = localStorage.getItem(`tasks-${project.projectId}-${project.status}`)
      if (stored) {
        setCompletedTasks(JSON.parse(stored))
      } else {
        setCompletedTasks([])
      }
    }
  }, [project?.projectId, project?.status])

  const verifyMagicSession = async (id: string, sessionToken: string) => {
    setVerifyLoading(true)
    try {
      const response = await fetch('/api/verify-magic-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: id, sessionToken })
      })
      const data = await response.json()
      
      if (data.success) {
        sessionStorage.setItem(`project_auth_${id.toUpperCase()}`, 'true')
        setIsVerified(true)
        await fetchProject(id)
        fetchMessages(id)
        fetchOnboardingStatus(id)
        // Remove magic_session from URL for security
        window.history.replaceState({}, '', `/status/${id}`)
      } else {
        setVerifyError('Ongeldige of verlopen link.')
        setLoading(false)
      }
    } catch {
      setVerifyError('Er ging iets mis.')
      setLoading(false)
    } finally {
      setVerifyLoading(false)
    }
  }

  const verifyPassword = async (id: string, password: string) => {
    setVerifyLoading(true)
    setVerifyError('')
    
    try {
      const response = await fetch('/api/verify-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: id, password })
      })
      const data = await response.json()
      
      if (data.success) {
        sessionStorage.setItem(`project_auth_${id.toUpperCase()}`, 'true')
        setIsVerified(true)
        await fetchProject(id)
        fetchMessages(id)
        fetchOnboardingStatus(id)
        // Remove password from URL for security
        window.history.replaceState({}, '', `/status/${id}`)
      } else {
        setVerifyError(data.message || 'Onjuist wachtwoord.')
        setLoading(false)
      }
    } catch {
      setVerifyError('Er ging iets mis.')
      setLoading(false)
    } finally {
      setVerifyLoading(false)
    }
  }

  const loginWithEmailPassword = async (email: string, password: string) => {
    setVerifyLoading(true)
    setVerifyError('')
    
    try {
      const response = await fetch('/api/login-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      
      if (data.success && data.projects?.length > 0) {
        const proj = data.projects[0]
        sessionStorage.setItem(`project_auth_${proj.projectId.toUpperCase()}`, 'true')
        navigate(`/status/${proj.projectId}`, { replace: true })
      } else {
        setVerifyError('Inloggen mislukt.')
      }
    } catch {
      setVerifyError('Er ging iets mis.')
    } finally {
      setVerifyLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (projectId && projectId !== ':projectId' && passwordInput.trim()) {
      verifyPassword(projectId, passwordInput)
    } else if (emailInput.trim() && passwordInput.trim()) {
      loginWithEmailPassword(emailInput, passwordInput)
    }
  }

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects?id=${encodeURIComponent(id)}`)
      if (response.ok) {
        const data = await response.json()
        const apiProject = data.project || data
        
        // Transform API response to frontend Project format
        const transformedProject: Project = {
          projectId: apiProject.id || apiProject.projectId || id,
          businessName: apiProject.customer?.companyName || apiProject.businessName || apiProject.customer?.name || 'Mijn project',
          contactName: apiProject.customer?.name || apiProject.contactName,
          contactEmail: apiProject.customer?.email || apiProject.contactEmail,
          contactPhone: apiProject.customer?.phone || apiProject.contactPhone,
          serviceType: apiProject.type || apiProject.serviceType || 'website',
          package: apiProject.packageType || apiProject.package || 'starter',
          status: apiProject.status || 'onboarding',
          statusMessage: apiProject.statusMessage || '',
          estimatedCompletion: apiProject.estimatedCompletion || '',
          updates: apiProject.updates || [],
          createdAt: apiProject.createdAt || new Date().toISOString(),
          designPreviewUrl: apiProject.designPreviewUrl,
          liveUrl: apiProject.liveUrl,
          paymentStatus: apiProject.paymentStatus,
          paymentUrl: apiProject.paymentUrl,
          paymentCompletedAt: apiProject.paymentCompletedAt,
          designApprovedAt: apiProject.designApprovedAt,
          messages: apiProject.messages || [],
          changeRequests: apiProject.changeRequests || [],
          feedback: apiProject.feedback || [],
          tasks: apiProject.tasks || [],
          invoices: apiProject.invoices || [],
          revisionsUsed: apiProject.revisionsUsed,
          revisionsTotal: apiProject.revisionsTotal,
          googleDriveUrl: apiProject.googleDriveUrl || apiProject.onboardingData?.driveFolderLink,
          liveDate: apiProject.liveDate,
          phaseDeadlines: apiProject.phaseDeadlines,
          referralCode: apiProject.referralCode,
          referredBy: apiProject.referredBy,
          referralDiscount: apiProject.referralDiscount,
          referralsCount: apiProject.referralsCount,
          referralRewards: apiProject.referralRewards,
          // Feedback questions - use developer-set questions or fall back to package-specific questions
          feedbackQuestions: apiProject.feedbackQuestions?.length > 0 
            ? apiProject.feedbackQuestions 
            : (PACKAGES[apiProject.package?.toLowerCase() as PackageType]?.feedbackQuestionIds || []),
          customQuestions: apiProject.customQuestions || [],
        }
        
        console.log('[ProjectStatusNew] Loaded project with questions:', {
          feedbackQuestions: transformedProject.feedbackQuestions,
          customQuestions: transformedProject.customQuestions,
          packageType: apiProject.package
        })
        
        setProject(transformedProject)
        setError('')
      } else if (response.status === 404) {
        // Project bestaat niet - toon geen error, gewoon placeholder
        setProject({
          projectId: id,
          businessName: 'Je project',
          package: '',
          status: 'onboarding',
          statusMessage: 'Project wordt geladen...',
          estimatedCompletion: '',
          updates: [],
          createdAt: new Date().toISOString()
        })
        setError('')
      } else {
        // Andere server errors
        console.error('Project fetch failed:', response.status)
        setError('')
      }
    } catch (err) {
      // Network error - alleen loggen, geen error tonen aan gebruiker
      console.error('Network error fetching project:', err)
      // Geen error state zetten, polling zal het opnieuw proberen
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (id: string) => {
    try {
      const response = await fetch(`/api/project/${id}/messages`)
      if (response.ok) {
        const data = await response.json()
        const newMessages = data.success ? data.messages || [] : data || []
        
        // Check if there are new messages from developer
        const developerMessages = newMessages.filter((m: ProjectMessage) => m.from === 'developer')
        const prevDeveloperMessages = messages.filter(m => m.from === 'developer')
        
        if (developerMessages.length > prevDeveloperMessages.length && prevMessageCountRef.current > 0) {
          // New message received - no notification to avoid sounds
        }
        
        prevMessageCountRef.current = newMessages.length
        setMessages(newMessages)
      }
    } catch {
      // Ignore
    }
  }

  const fetchOnboardingStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/onboarding/${id}`)
      if (response.ok) {
        const data = await response.json()
        if (data?.submittedAt) setOnboardingCompleted(true)
      }
    } catch {
      // Ignore
    }
  }

  const sendMessage = async () => {
    if (!projectId || !newMessage.trim()) return
    setMessageLoading(true)
    try {
      const response = await fetch(`/api/project/${projectId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: newMessage, 
          from: 'client',
          senderName: project?.contactName || 'Klant'
        })
      })
      const data = await response.json()
      if (data.success) {
        setMessages(prev => [...prev, data.message])
        setNewMessage('')
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    } catch {
      // Ignore
    }
    setMessageLoading(false)
  }

  // Update project data (for account modal)
  const updateProject = async (updates: Partial<Project>) => {
    if (!projectId) throw new Error('No project ID')
    const response = await fetch(`/api/projects?id=${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!response.ok) {
      throw new Error('Failed to update project')
    }
    // Update local state
    setProject(prev => prev ? { ...prev, ...updates } : null)
  }

  // Mark project as ready for design phase
  const confirmReadyForDesign = async () => {
    if (!projectId) return
    setReadyForDesignLoading(true)
    try {
      const response = await fetch(`/api/project/${projectId}/ready-for-design`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      if (data.success) {
        // Immediately update local state to show animation
        setProject(prev => prev ? { ...prev, status: 'design' as ProjectPhase } : null)
        setConfirmingReadyForDesign(false)
        // Also refresh from server to get full updated data
        setTimeout(() => fetchProject(projectId), 500)
      }
    } catch {
      // Ignore
    }
    setReadyForDesignLoading(false)
  }

  // Handle change request submission (for live projects)
  const handleChangeRequest = async (request: {
    title?: string
    description: string
    priority: 'low' | 'normal' | 'urgent'
    category: 'text' | 'design' | 'images' | 'functionality' | 'other'
    status?: string
    createdAt?: string
  }) => {
    if (!projectId || !project) throw new Error('No project')
    
    const newRequest = {
      id: `cr_${Date.now()}`,
      ...request,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    }
    
    const updatedChangeRequests = [...(project.changeRequests || []), newRequest]
    const updatedChangesThisMonth = (project.changesThisMonth || 0) + 1
    
    const response = await fetch(`/api/projects?id=${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        changeRequests: updatedChangeRequests,
        changesThisMonth: updatedChangesThisMonth
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit change request')
    }
    
    // Update local state
    setProject(prev => prev ? {
      ...prev,
      changeRequests: updatedChangeRequests,
      changesThisMonth: updatedChangesThisMonth
    } : null)
  }

  // Get phase status for stepper visualization
  const getPhaseStatus = (phaseKey: ProjectPhase) => {
    if (!project) return 'pending'
    
    // Flow: Onboarding → Design → Feedback → Betaling → Live
    const currentPhaseKey = project.status
    
    const currentIndex = PHASES.findIndex(p => p.key === currentPhaseKey)
    const phaseIndex = PHASES.findIndex(p => p.key === phaseKey)
    
    if (phaseIndex < currentIndex) return 'completed'
    if (phaseIndex === currentIndex) return 'current'
    return 'pending'
  }

  // Get client actions for current phase
  const getClientActions = () => {
    if (!project) return []
    const actions = PHASE_ACTIONS[project.status] || []
    
    return actions.map(action => {
      // Special handling for Media uploaden - use Drive URL
      if (action.title === 'Media uploaden') {
        return {
          ...action,
          completed: false, // Can always upload more
          link: project.googleDriveUrl || '',
          isExternal: true
        }
      }
      
      // Special handling for Teksten aanleveren - also use Drive URL
      if (action.title === 'Teksten aanleveren') {
        return {
          ...action,
          completed: false,
          link: project.googleDriveUrl || '',
          isExternal: true
        }
      }
      
      // Special handling for Chat - opens chat panel
      if (action.title === 'Direct contact via Chat') {
        return {
          ...action,
          completed: false,
          link: '#',
          isExternal: false,
          isChat: true
        }
      }
      
      return {
        ...action,
        completed: action.title === 'Onboarding invullen' && onboardingCompleted,
        link: action.buttonLink?.replace(':projectId', projectId || ''),
        isExternal: false
      }
    })
  }

  // LOGIN SCREEN
  if (!isVerified && projectId) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        {/* Header */}
        <header className="border-b border-white/10 bg-gray-900/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="hover:opacity-80 transition">
              <Logo variant="white" />
            </Link>
            <span className="px-3 py-1.5 bg-blue-500/10 rounded-full text-blue-400 text-xs border border-blue-500/20 font-medium flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Beveiligd
            </span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm">
            {/* Login Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-2xl border border-gray-800 p-6"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white mb-1">Inloggen</h1>
                <p className="text-sm text-gray-400">Voer je wachtwoord in om door te gaan</p>
              </div>

              {projectId && projectId !== ':projectId' && (
                <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-xs text-gray-500">Project</p>
                  <p className="font-mono text-sm text-white">{projectId}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                {(!projectId || projectId === ':projectId') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">E-mailadres</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="jouw@email.nl"
                        className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Wachtwoord</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Je wachtwoord"
                      className="w-full pl-11 pr-11 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                      autoFocus={!!projectId && projectId !== ':projectId'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {verifyError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <p className="text-sm text-red-400">{verifyError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={verifyLoading || !passwordInput.trim()}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-indigo-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {verifyLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Inloggen <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <Link to="/wachtwoord-vergeten" className="text-sm text-blue-400 hover:text-blue-300">
                  Wachtwoord vergeten?
                </Link>
              </div>
            </motion.div>

            {/* Trust badges */}
            <div className="mt-6 flex justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-green-500" />
                SSL beveiligd
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-500" />
                24/7 toegang
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // LOADING
  if (loading) return <ProjectStatusSkeleton />

  // ERROR
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Kon project niet laden</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <Link to="/status" className="text-blue-400 hover:text-blue-300">
            Opnieuw inloggen
          </Link>
        </div>
      </div>
    )
  }

  // MAIN DASHBOARD
  const clientActions = getClientActions()
  const progress = getProgressPercentage(project.status)
  const pendingActions = clientActions.filter(a => !a.completed)
  const unreadMessages = messages.filter(m => !m.read && m.from === 'developer').length

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Header - Improved with business name and quick actions */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
        darkMode 
          ? 'border-white/10 bg-gray-950/80' 
          : 'border-gray-200 bg-white/80'
      }`}>
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="hover:opacity-80 transition">
              <Logo variant="white" size="sm" />
            </Link>
            <div className="flex items-center gap-1">
              {/* Dark mode toggle */}
              <DarkModeButton
                darkMode={darkMode}
                onToggle={toggleDarkMode}
                size="md"
              />
              {/* WhatsApp quick action */}
              <a
                href={getWhatsAppLink(WHATSAPP_MESSAGES.PROJECT(projectId || ''))}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-green-400 transition rounded-lg hover:bg-green-500/10"
                title="WhatsApp"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              {/* Chat */}
              <button
                onClick={() => setShowChat(!showChat)}
                className="relative p-2 text-gray-400 hover:text-white transition rounded-lg hover:bg-gray-800"
              >
                <MessageSquare className="w-5 h-5" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </button>
              {/* Notifications */}
              <div data-tour="notifications">
                <NotificationBell
                  notifications={notifications}
                  onMarkAsRead={(id) => {
                    setNotifications(prev => 
                      prev.map(n => n.id === id ? { ...n, read: true } : n)
                    )
                  }}
                  onMarkAllAsRead={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
                  }}
                  darkMode={darkMode}
                />
              </div>
              {/* Help */}
              <button
                data-tour="help"
                onClick={() => setShowHelpCenter(true)}
                className={`p-2 transition rounded-lg ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Hulp & FAQ"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              {/* Account */}
              <button
                onClick={() => setShowAccountModal(true)}
                className={`p-2 transition rounded-lg ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Mijn Account"
              >
                <FolderOpen className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Business name bar */}
          <div className={`flex items-center justify-between mt-2 pt-2 border-t ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <span className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.businessName}</span>
              <span className="text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-mono">{projectId}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${phaseColors.bg}`} />
              <span className="text-xs text-gray-500">
                {PHASES.find(p => p.key === project.status)?.label || project.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Onboarding Success Banner */}
        <AnimatePresence>
          {showOnboardingSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-4 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_70%)]" />
              <div className="relative flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-green-400 mb-1">Onboarding voltooid! 🎉</h3>
                  <p className="text-sm text-gray-300">
                    Bedankt voor het invullen. We gaan direct voor je aan de slag. Je kunt je voortgang hier volgen.
                  </p>
                </div>
                <button
                  onClick={() => setShowOnboardingSuccess(false)}
                  className="p-1 text-gray-400 hover:text-white transition rounded"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Stepper - Clean horizontal timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-4 sm:p-6 ${
            darkMode 
              ? 'bg-gray-900/50 border-gray-800' 
              : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            {PHASES.map((phase, index) => {
              const status = getPhaseStatus(phase.key)
              const Icon = phase.icon
              const isLast = index === PHASES.length - 1
              
              return (
                <div key={phase.key} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <motion.div 
                      layout
                      initial={false}
                      animate={{
                        scale: status === 'current' ? 1.05 : 1,
                        boxShadow: status === 'current' ? '0 0 20px rgba(99, 102, 241, 0.4)' : 'none'
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                        status === 'completed' ? 'bg-green-500/20 border-2 border-green-500/50' :
                        status === 'current' ? `bg-gradient-to-br ${phaseColors.gradient}` :
                        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {status === 'completed' ? (
                          <motion.div
                            key="completed"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          >
                            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="icon"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                              status === 'current' ? 'text-white' : darkMode ? 'text-gray-500' : 'text-gray-400'
                            }`} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <motion.span 
                      initial={false}
                      animate={{ 
                        color: status === 'completed' ? '#4ade80' : 
                               status === 'current' ? (darkMode ? '#ffffff' : '#1f2937') : 
                               (darkMode ? '#6b7280' : '#9ca3af')
                      }}
                      transition={{ duration: 0.5 }}
                      className="text-[10px] sm:text-xs mt-2 font-medium text-center"
                    >
                      {phase.label}
                    </motion.span>
                  </div>
                  {!isLast && (
                    <div className={`flex-1 h-0.5 mx-2 sm:mx-3 overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: status === 'completed' ? '100%' : '0%' }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                        className="h-full bg-green-500/70"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Progress percentage */}
          <div className="flex items-center gap-3">
            <div className={`flex-1 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${phaseColors.gradient}`}
              />
            </div>
            <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{progress}%</span>
          </div>
        </motion.div>

        {/* Hero Card - Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`bg-gradient-to-br ${phaseColors.gradient} rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden`}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative">
            {/* Phase info - simplified since business name is in header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                {project.status === 'live' ? (
                  <span className="text-2xl">🎉</span>
                ) : project.status === 'revisie' ? (
                  <span className="text-2xl">✨</span>
                ) : (() => {
                  const currentPhase = PHASES.find(p => p.key === project.status) || PHASES[0]
                  const PhaseIcon = currentPhase?.icon || FileText
                  return <PhaseIcon className="w-6 h-6 text-white" />
                })()}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg sm:text-xl mb-1">{getDynamicPhaseInfo(project.status, project.package)?.title}</h2>
                <p className="text-sm text-white/80 leading-relaxed">{getDynamicPhaseInfo(project.status, project.package)?.description}</p>
              </div>
            </div>

            {/* Feedback received timestamp - show in revisie phase */}
            {project.status === 'revisie' && project.feedbackReceivedAt && (
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-300" />
                <span className="text-sm text-white/70">
                  Feedback ontvangen op <span className="font-medium text-white">{new Date(project.feedbackReceivedAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                </span>
              </div>
            )}

            {/* Countdown timer */}
            {countdown && project.status !== 'live' && project.status !== 'revisie' && (
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2">
                <Timer className="w-4 h-4 text-white/70" />
                <span className="text-sm text-white/70">
                  Geschatte deadline: <span className="font-semibold text-white">{countdown.days}d {countdown.hours}u</span>
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Package-specific Phase Card - Shows tasks and tips per package */}
        {project.package && project.status !== 'live' && (
          <div data-tour="status">
            <PackagePhaseCard
              packageType={project.package as 'starter' | 'professional' | 'business' | 'webshop'}
              currentPhase={project.status as 'onboarding' | 'design' | 'feedback' | 'revisie' | 'payment' | 'approval' | 'live'}
              usedRevisions={project.revisionsUsed || 0}
              darkMode={darkMode}
            />
          </div>
        )}

        {/* Quick Actions - Context-aware shortcuts */}
        <QuickActions
          phase={project.status as 'onboarding' | 'design' | 'feedback' | 'revisie' | 'payment' | 'approval' | 'live'}
          onViewDesign={() => setShowDesignPreview(true)}
          onSendMessage={() => setShowChat(true)}
          onApprove={() => setShowDesignPreview(true)}
          onRequestChanges={() => setShowDesignPreview(true)}
          onLeaveReview={() => window.open('https://g.page/r/review', '_blank')}
          hasDesignPreview={!!project.designPreviewUrl}
          hasUnpaidInvoice={project.paymentStatus !== 'paid'}
          paymentUrl={project.paymentUrl}
          liveUrl={project.liveUrl}
          googleDriveUrl={project.googleDriveUrl}
          darkMode={darkMode}
        />

        {/* Customer Task Checklist - Interactive tasks for current phase */}
        {project.status !== 'live' && (
          <div data-tour="tasks">
            <CustomerTaskChecklist
              projectId={project.projectId}
              currentPhase={project.status as 'onboarding' | 'design' | 'feedback' | 'revisie' | 'payment' | 'approval' | 'live'}
              completedTasks={completedTasks}
              onTaskComplete={async (taskId, completed) => {
                if (completed) {
                  setCompletedTasks(prev => [...prev, taskId])
                } else {
                  setCompletedTasks(prev => prev.filter(id => id !== taskId))
                }
              }}
              darkMode={darkMode}
            />
          </div>
        )}

        {/* Project Timeline - Visual progress overview */}
        {project.status !== 'live' && (
          <ProjectTimeline
            currentPhase={project.status as 'onboarding' | 'design' | 'feedback' | 'revisie' | 'payment' | 'approval' | 'live'}
            startDate={project.createdAt ? new Date(project.createdAt) : new Date()}
            darkMode={darkMode}
            compact={true}
          />
        )}

        {/* Special Revisie Status Card - shown when feedback is being processed */}
        {project.status === 'revisie' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-2xl p-5 border border-cyan-500/30 ${
              darkMode ? 'bg-gray-900' : 'bg-white shadow-sm'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-6 h-6 text-cyan-400" />
                </motion.div>
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>We verwerken je feedback</h3>
                <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Ons team is druk bezig met het doorvoeren van je aanpassingen. Je ontvangt binnenkort een nieuwe preview.
                </p>
                
                {/* Revision counter */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Revisieronde: <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.revisionsUsed || 1}</span>
                      {project.revisionsTotal && <span className="text-gray-500">/{project.revisionsTotal}</span>}
                    </span>
                  </div>
                  {project.feedbackReceivedAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-500">
                        {new Date(project.feedbackReceivedAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Cards - What the client needs to do */}
        {pendingActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h2 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              Jouw actiepunten
            </h2>
            
            {pendingActions.map((action, index) => {
              const ActionWrapper = action.isExternal ? 'a' : Link
              const linkProps = action.isExternal 
                ? { href: action.link || '#', target: '_blank', rel: 'noopener noreferrer' }
                : { to: action.link || '#' }
              
              // Determine styling based on action type
              const isChat = (action as any).isChat
              const isWhatsApp = (action as any).isWhatsApp || action.type === 'whatsapp'
              const bgClass = isChat || isWhatsApp
                ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50'
                : action.urgent 
                  ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50' 
                  : 'bg-gray-900 border-gray-800 hover:border-gray-700'
              
              const iconBgClass = isChat || isWhatsApp
                ? 'bg-green-500/20'
                : action.urgent ? 'bg-amber-500/20' : 'bg-gray-800'
              
              const textClass = isChat || isWhatsApp
                ? 'text-green-400'
                : action.urgent ? 'text-amber-400' : 'text-white'
              
              const arrowClass = isChat || isWhatsApp
                ? 'text-green-500'
                : action.urgent ? 'text-amber-500' : 'text-gray-600'
              
              // For chat actions, use a button that opens the chat
              if (isChat) {
                return (
                  <button
                    key={index}
                    onClick={() => setShowChat(true)}
                    className={`block w-full text-left p-4 rounded-xl border transition group ${bgClass}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgClass}`}>
                        <MessageSquare className={`w-5 h-5 ${textClass}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${textClass}`}>
                          {action.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{action.description}</p>
                      </div>
                      <ArrowRight className={`w-5 h-5 transition group-hover:translate-x-1 ${arrowClass}`} />
                    </div>
                  </button>
                )
              }
              
              return (
                <ActionWrapper
                  key={index}
                  {...linkProps as any}
                  className={`block p-4 rounded-xl border transition group ${bgClass}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgClass}`}>
                      {isWhatsApp ? (
                        <svg className={`w-5 h-5 ${textClass}`} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      ) : (
                        <Circle className={`w-5 h-5 ${action.urgent ? 'text-amber-400' : 'text-gray-500'}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${textClass}`}>
                        {action.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{action.description}</p>
                    </div>
                    {action.isExternal ? (
                      <ArrowRight className={`w-5 h-5 transition group-hover:translate-x-1 ${arrowClass}`} />
                    ) : (
                      <ChevronRight className={`w-5 h-5 transition group-hover:translate-x-1 ${arrowClass}`} />
                    )}
                  </div>
                </ActionWrapper>
              )
            })}
          </motion.div>
        )}

        {/* Completed actions */}
        {clientActions.some(a => a.completed) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {clientActions.filter(a => a.completed).map((action, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-green-500/10 border border-green-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-green-400">{action.title}</p>
                    <p className="text-sm text-gray-500">Afgerond</p>
                  </div>
                  {action.link && (
                    <Link
                      to={action.link}
                      className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <span>Wijzig</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Project Files Section - Only show in onboarding phase when we have a drive URL */}
        {project.status === 'onboarding' && project.googleDriveUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className={`rounded-2xl border overflow-hidden ${
              darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            <div className={`p-4 sm:p-5 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}>
                    <FolderOpen className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Projectbestanden</h3>
                    <p className="text-xs text-gray-500">Upload hier je logo, foto's en teksten</p>
                  </div>
                </div>
                <a
                  href={project.googleDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition ${
                    darkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10' : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {/* File type indicators */}
            <div className="p-4 sm:p-5">
              <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Wat moet je uploaden?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: '🖼️', label: 'Logo (PNG/SVG)', desc: 'Je bedrijfslogo' },
                  { icon: '📸', label: "Foto's", desc: 'Product/team foto\'s' },
                  { icon: '📄', label: 'Teksten', desc: 'Website content' },
                  { icon: '🎨', label: 'Huisstijl', desc: 'Kleuren/fonts' },
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded-xl border ${
                      darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <span className="text-lg mb-1 block">{item.icon}</span>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
              
              <a
                href={project.googleDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 font-medium rounded-xl transition flex items-center justify-center gap-2"
              >
                <FolderOpen className="w-4 h-4" />
                Open Google Drive
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}

        {/* Design Phase - Progress & Preview Section */}
        {project.status === 'design' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4"
          >
            {/* Design Progress Card */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Palette className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-1">Design in ontwikkeling</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      Onze designer werkt aan jouw unieke ontwerp. Je ontvangt een melding zodra de preview klaar is.
                    </p>
                    
                    {/* Progress Steps */}
                    <div className="space-y-2">
                      {[
                        { label: 'Materialen ontvangen', done: true },
                        { label: 'Wireframe schetsen', done: true },
                        { label: 'Visueel ontwerp', done: false, current: true },
                        { label: 'Preview klaarzetten', done: false },
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            step.done ? 'bg-green-500/20 border border-green-500/50' :
                            step.current ? 'bg-amber-500/20 border-2 border-amber-500 animate-pulse' :
                            'bg-gray-800 border border-gray-700'
                          }`}>
                            {step.done && <CheckCircle2 className="w-3 h-3 text-green-400" />}
                            {step.current && <div className="w-2 h-2 bg-amber-400 rounded-full" />}
                          </div>
                          <span className={`text-sm ${
                            step.done ? 'text-gray-400' : step.current ? 'text-white font-medium' : 'text-gray-500'
                          }`}>{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What to expect */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Wat kun je verwachten?</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">→</span>
                  <span>Je ontvangt een <strong className="text-white">email</strong> zodra de preview klaar is om te bekijken</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">→</span>
                  <span>Bekijk het ontwerp en geef feedback via de <strong className="text-white">feedback knop</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">→</span>
                  <span>Na goedkeuring starten we met <strong className="text-white">bouwen</strong></span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Ready for Design CTA - Only show when onboarding is complete but still in onboarding phase */}
        {project.status === 'onboarding' && onboardingCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl p-5 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_70%)]" />
            <div className="relative">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg mb-1">Klaar om te starten?</h3>
                  <p className="text-sm text-gray-300">
                    Heb je alle bestanden geüpload en ben je klaar? Klik dan op de knop hieronder om de design fase te starten.
                  </p>
                </div>
              </div>

              {!confirmingReadyForDesign ? (
                <button
                  onClick={() => setConfirmingReadyForDesign(true)}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Start met design
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <p className="text-sm text-amber-300">
                      <strong>Let op:</strong> Na bevestiging kunnen we direct beginnen met het ontwerp. Zorg dat al je bestanden (logo, foto's, teksten) zijn geüpload naar Google Drive.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmingReadyForDesign(false)}
                      className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition"
                    >
                      Annuleren
                    </button>
                    <button
                      onClick={confirmReadyForDesign}
                      disabled={readyForDesignLoading}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {readyForDesignLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Ja, start design
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Design Preview Link - Show during feedback phase only */}
        {project.designPreviewUrl && project.status === 'feedback' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30"
            data-tour="design"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">Design Preview Klaar! ✨</h3>
                <p className="text-sm text-gray-400">Bekijk je design en geef direct feedback</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowDesignPreview(true)}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-400 hover:to-pink-400 transition flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/25"
            >
              <Eye className="w-5 h-5" />
              Bekijk & Beoordeel Design
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <div className="flex items-center justify-center gap-4 mt-3">
              <a
                href={ensureAbsoluteUrl(project.designPreviewUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-purple-400 transition flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                Open in nieuw tabblad
              </a>
            </div>
          </motion.div>
        )}

        {/* Live Dashboard - Full featured dashboard for live projects */}
        {project.status === 'live' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ClientLiveDashboard
              businessName={project.businessName}
              projectPackage={project.package}
              liveUrl={project.liveUrl}
              liveDate={project.liveDate}
              googleDriveUrl={project.googleDriveUrl}
              analyticsUrl={project.analyticsUrl}
              changeRequests={project.changeRequests}
              changesThisMonth={project.changesThisMonth}
              onRequestChange={handleChangeRequest}
              onContactDeveloper={() => setShowChat(true)}
            />
          </motion.div>
        )}

        {/* Payment Section */}
        {project.status === 'payment' && project.paymentStatus !== 'paid' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-5 rounded-xl bg-indigo-500/10 border border-indigo-500/30"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Betaling afronden</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Je design is goedgekeurd! Rond de betaling af zodat we je website kunnen bouwen.
                </p>
                {project.paymentUrl ? (
                  <a
                    href={project.paymentUrl}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg hover:from-indigo-400 hover:to-purple-400 transition"
                  >
                    <CreditCard className="w-4 h-4" />
                    Naar betaling
                  </a>
                ) : (
                  <p className="text-sm text-indigo-400">Betaallink wordt binnenkort verzonden</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Pre-Live Checklist - Show after payment is received */}
        {project.paymentStatus === 'paid' && project.status !== 'live' && project.status !== 'approval' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <PreLiveChecklist
              projectId={project.projectId}
              projectData={{
                businessName: project.businessName,
                domainInfo: project.domainInfo as any,
                emailInfo: project.emailInfo as any,
                legalInfo: project.legalInfo as any,
                businessInfo: project.businessInfo as any,
                preLiveChecklist: project.preLiveChecklist as any
              }}
              onUpdate={async (data) => {
                try {
                  const response = await fetch(`/api/project/${project.projectId}/prelive`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                  })
                  if (response.ok) {
                    // Refresh project data
                    const result = await response.json()
                    setProject(prev => prev ? {
                      ...prev,
                      domainInfo: result.domainInfo,
                      emailInfo: result.emailInfo,
                      legalInfo: result.legalInfo,
                      businessInfo: result.businessInfo,
                      preLiveChecklist: result.preLiveChecklist
                    } : null)
                  }
                } catch (error) {
                  console.error('Error updating pre-live data:', error)
                }
              }}
            />
          </motion.div>
        )}

        {/* Pre-Live Approval - Final approval before going live */}
        {project.status === 'approval' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <PreLiveApproval
              businessName={project.businessName}
              projectPackage={project.package || 'starter'}
              designPreviewUrl={project.designPreviewUrl}
              liveUrl={project.liveUrl}
              domainInfo={project.domainInfo}
              preLiveChecklist={project.preLiveChecklist}
              monthlyAmount={49}
              onApprove={async (checklist) => {
                try {
                  const response = await fetch(`/api/projects?id=${project.projectId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      preLiveChecklist: {
                        ...project.preLiveChecklist,
                        ...checklist,
                        approvedAt: new Date().toISOString()
                      }
                    })
                  })
                  if (response.ok) {
                    // Refresh project data
                    const result = await response.json()
                    setProject(prev => prev ? {
                      ...prev,
                      preLiveChecklist: result.preLiveChecklist
                    } : null)
                  }
                } catch (error) {
                  console.error('Error submitting approval:', error)
                  throw error
                }
              }}
            />
          </motion.div>
        )}

        {/* Invoices Section */}
        {project.invoices && project.invoices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.27 }}
            className={`rounded-2xl border overflow-hidden ${
              darkMode 
                ? 'bg-gray-900 border-gray-800' 
                : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}>
                  <CreditCard className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Facturen</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Overzicht van al je facturen
                  </p>
                </div>
              </div>
            </div>
            <div className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-200'}`}>
              {project.invoices.map((invoice) => (
                <div 
                  key={invoice.id} 
                  className={`p-4 flex items-center justify-between ${
                    darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                  } transition`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      invoice.status === 'paid' 
                        ? 'bg-green-500/20' 
                        : invoice.status === 'overdue' 
                          ? 'bg-red-500/20' 
                          : darkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      {invoice.status === 'paid' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : invoice.status === 'overdue' ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <Clock className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {invoice.description}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {new Date(invoice.date).toLocaleDateString('nl-NL', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                        {invoice.dueDate && invoice.status !== 'paid' && (
                          <span className="ml-2">
                            · Vervaldatum: {new Date(invoice.dueDate).toLocaleDateString('nl-NL', { 
                              day: 'numeric', 
                              month: 'short' 
                            })}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        €{invoice.amount.toFixed(2)}
                      </p>
                      <p className={`text-xs font-medium ${
                        invoice.status === 'paid' 
                          ? 'text-green-500' 
                          : invoice.status === 'overdue' 
                            ? 'text-red-500' 
                            : invoice.status === 'sent' 
                              ? 'text-amber-500' 
                              : darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {invoice.status === 'paid' ? '✓ Betaald' :
                         invoice.status === 'overdue' ? '⚠ Vervallen' :
                         invoice.status === 'sent' ? 'Openstaand' : 'Concept'}
                      </p>
                      {invoice.paidAt && invoice.status === 'paid' && (
                        <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                          {new Date(invoice.paidAt).toLocaleDateString('nl-NL', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </p>
                      )}
                    </div>
                    {invoice.paymentUrl && invoice.status !== 'paid' && (
                      <a
                        href={invoice.paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-4 py-2 font-medium text-sm rounded-xl transition flex items-center gap-2 ${
                          invoice.status === 'overdue'
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        Betalen
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Summary footer */}
            {project.invoices.length > 1 && (
              <div className={`p-4 border-t ${
                darkMode ? 'border-gray-800 bg-gray-800/30' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {project.invoices.filter(i => i.status === 'paid').length} van {project.invoices.length} facturen betaald
                    </p>
                  </div>
                  <div className="flex gap-4">
                    {project.invoices.some(i => i.status !== 'paid' && i.status !== 'cancelled') && (
                      <div className="text-right">
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Openstaand</p>
                        <p className="font-semibold text-amber-500">
                          €{project.invoices
                            .filter(i => i.status !== 'paid' && i.status !== 'cancelled')
                            .reduce((sum, i) => sum + i.amount, 0)
                            .toFixed(2)}
                        </p>
                      </div>
                    )}
                    <div className="text-right">
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Totaal betaald</p>
                      <p className="font-semibold text-green-500">
                        €{project.invoices
                          .filter(i => i.status === 'paid')
                          .reduce((sum, i) => sum + i.amount, 0)
                          .toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Developer Updates - What developers have done on the project */}
        <DeveloperUpdates 
          projectId={project.projectId}
          darkMode={darkMode}
        />

        {/* Referral Widget - Earn rewards by sharing */}
        {project.referralCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ReferralWidget
              referralCode={project.referralCode}
              referralUrl={`${window.location.origin}/?ref=${project.referralCode}`}
              referralsCount={project.referralsCount || 0}
              totalEarned={project.referralRewards || 0}
              onCopyCode={() => {
                console.log('Referral code copied')
              }}
              onShare={() => {
                console.log('Referral shared')
              }}
            />
          </motion.div>
        )}

        {/* Trust badges - simplified footer */}
        <div className={`flex justify-center gap-6 py-6 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-green-500" />
            Beveiligd
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Real-time
          </div>
        </div>
      </main>

      {/* Floating Chat - Right Side Panel */}
      <AnimatePresence>
        {showChat && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChat(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Chat Panel - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`fixed top-0 right-0 h-full z-50 flex flex-col ${
                chatExpanded ? 'w-full md:w-[600px]' : 'w-full md:w-[400px]'
              } transition-all duration-300`}
            >
              <div className={`flex flex-col h-full shadow-2xl border-l ${
                darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
              }`}>
                {/* Chat header */}
                <div className={`bg-gradient-to-r ${phaseColors.gradient} p-4 flex-shrink-0`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Chat</p>
                        <p className="text-xs text-white/70">Reactie binnen 4 uur</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Expand/Collapse button - only on desktop */}
                      <button
                        onClick={() => setChatExpanded(!chatExpanded)}
                        className="hidden md:flex p-2 hover:bg-white/10 rounded-lg transition items-center justify-center"
                        title={chatExpanded ? 'Kleiner maken' : 'Groter maken'}
                      >
                        {chatExpanded ? (
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                          </svg>
                        )}
                      </button>
                      {/* Close button */}
                      <button
                        onClick={() => setShowChat(false)}
                        className="p-2 hover:bg-white/10 rounded-lg transition"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
                      <p className="text-sm">Nog geen berichten</p>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Start een gesprek met ons</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.from === 'client' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-2xl p-3 ${
                          msg.from === 'client'
                            ? `bg-gradient-to-r ${phaseColors.gradient} text-white rounded-br-md`
                            : darkMode ? 'bg-gray-800 text-white rounded-bl-md' : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
                        }`}>
                          {/* Sender name */}
                          <p className={`text-xs font-medium mb-1 ${
                            msg.from === 'client' ? 'text-white/70' : 'text-blue-500'
                          }`}>
                            {msg.senderName || (msg.from === 'developer' ? 'Webstability Team' : project?.contactName || 'Jij')}
                          </p>
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${
                            msg.from === 'client' ? 'text-white/60' : (darkMode ? 'text-gray-500' : 'text-gray-400')
                          }`}>
                            {new Date(msg.date).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className={`p-4 border-t flex-shrink-0 ${
                  darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Typ je bericht..."
                      className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                      }`}
                      onKeyPress={(e) => e.key === 'Enter' && !messageLoading && sendMessage()}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={messageLoading || !newMessage.trim()}
                      className={`px-4 bg-gradient-to-r ${phaseColors.gradient} text-white rounded-xl disabled:opacity-50 transition`}
                    >
                      {messageLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Chat Button - when chat is closed */}
      {!showChat && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setShowChat(true)}
          className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r ${phaseColors.gradient} rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-110 transition`}
        >
          <MessageSquare className="w-6 h-6 text-white" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadMessages}
            </span>
          )}
        </motion.button>
      )}

      {/* Client Account Modal */}
      {project && (
        <ClientAccountModal
          isOpen={showAccountModal}
          onClose={() => setShowAccountModal(false)}
          project={project}
          onUpdateProject={updateProject}
        />
      )}

      {/* Design Preview Modal */}
      {project && project.designPreviewUrl && (
        <>
        {console.log('[ProjectStatusNew] Passing to DesignPreviewModal:', {
          feedbackQuestions: project.feedbackQuestions,
          customQuestions: project.customQuestions
        })}
        <DesignPreviewModal
          isOpen={showDesignPreview}
          onClose={() => setShowDesignPreview(false)}
          projectId={project.projectId}
          designPreviewUrl={ensureAbsoluteUrl(project.designPreviewUrl)}
          feedbackQuestionIds={project.feedbackQuestions}
          customQuestions={project.customQuestions?.map(q => ({ id: `custom-${q}`, category: 'custom' as const, question: q }))}
          onApprove={async () => {
            // Design approved - move to payment phase
            setProject(prev => prev ? { 
              ...prev, 
              designApprovedAt: new Date().toISOString(),
              status: 'payment' as ProjectPhase 
            } : null)
          }}
          onFeedbackSubmit={async () => {
            // Feedback given - move back to design phase
            setProject(prev => prev ? { 
              ...prev, 
              status: 'design' as ProjectPhase 
            } : null)
          }}
        />
        </>
      )}

      {/* Help Center Slide-over */}
      <HelpCenter
        isOpen={showHelpCenter}
        onClose={() => setShowHelpCenter(false)}
        currentPhase={project?.status as 'onboarding' | 'design' | 'feedback' | 'revisie' | 'payment' | 'approval' | 'live' || 'onboarding'}
        darkMode={darkMode}
        onRestartTour={resetTour}
      />

      {/* Onboarding Tour for new users */}
      <OnboardingTour
        isOpen={shouldShowTour && !loading && !error}
        onClose={dismissTour}
        onComplete={() => {
          dismissTour()
          // Celebrate onboarding complete
          celebrate('onboarding_complete')
        }}
        projectName={project?.businessName}
      />

      {/* Milestone Celebrations */}
      <MilestoneCelebration
        milestone={currentMilestone}
        onClose={closeCelebration}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        darkMode={darkMode}
        unreadMessages={unreadMessages}
        activeTab="home"
        onHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onChat={() => setShowChat(true)}
        onDocs={() => {
          if (project?.googleDriveUrl) {
            window.open(project.googleDriveUrl, '_blank')
          }
        }}
        onHelp={() => setShowHelpCenter(true)}
        onAccount={() => setShowAccountModal(true)}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
        shortcuts={shortcuts}
        darkMode={darkMode}
      />

      {/* Keyboard Shortcut Hint - shows after 2 seconds for new users */}
      {isVerified && !shouldShowTour && (
        <KeyboardShortcutHint darkMode={darkMode} />
      )}

      {/* PWA Install Prompt - shows after 30 seconds */}
      {isVerified && (
        <PWAInstallPrompt darkMode={darkMode} delay={30000} />
      )}
    </div>
  )
}
