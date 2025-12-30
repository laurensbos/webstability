import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectStatusSkeleton } from '../components/LoadingSkeletons'
import {
  CheckCircle2,
  Globe,
  Clock,
  Loader2,
  AlertCircle,
  FileText,
  Palette,
  Rocket,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageSquare,
  Send,
  FolderOpen,
  Mail,
  Shield,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Timer,
  CreditCard,
  X,
  RefreshCw,
  MoreVertical,
  HelpCircle,
  Moon,
  Sun,
  Languages,
  User
} from 'lucide-react'
import Logo from '../components/Logo'
import AccountSection from '../components/AccountSection'
import DesignPreviewModal from '../components/DesignPreviewModal'
import PreLiveChecklist from '../components/PreLiveChecklist'
import DeveloperUpdates from '../components/DeveloperUpdates'
import PackagePhaseCard from '../components/PackagePhaseCard'
import InlineOnboarding from '../components/InlineOnboarding'
import HelpCenter from '../components/HelpCenter'
import NotificationBell, { generateProjectNotifications } from '../components/NotificationBell'
import OnboardingTour, { useOnboardingTour } from '../components/OnboardingTour'
import MilestoneCelebration, { useMilestoneCelebration } from '../components/MilestoneCelebration'
import SatisfactionSurveyModal from '../components/SatisfactionSurveyModal'
import { ReferralWidget } from '../components/GrowthTools'
import MobileBottomNav from '../components/MobileBottomNav'
import QuickActions from '../components/QuickActions'
import Footer from '../components/Footer'
import { useKeyboardShortcuts, KeyboardShortcutsModal, KeyboardShortcutHint } from '../hooks/useKeyboardShortcuts'
import PWAInstallPrompt from '../components/PWAInstallPrompt'
import { PushNotificationPrompt } from '../components/PushNotificationToggle'
import { RevisionPhaseCard, PaymentPhaseCard, DomainPhaseCard, LivePhaseCard } from '../components/phases'
import CustomerDashboardExtras from '../components/CustomerDashboardExtras'
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

// Phase configuration - Visual stepper phases (labels are translation keys)
// Flow: Onboarding → Design → Feedback → Revisie → Betaling → Domain → Live
const PHASES: { key: ProjectPhase; labelKey: string; icon: typeof FileText }[] = [
  { key: 'onboarding', labelKey: 'projectStatus.phases.onboarding', icon: FileText },
  { key: 'design', labelKey: 'projectStatus.phases.design', icon: Palette },
  { key: 'feedback', labelKey: 'projectStatus.phases.feedback', icon: MessageSquare },
  { key: 'revisie', labelKey: 'projectStatus.phases.revisie', icon: RefreshCw },
  { key: 'payment', labelKey: 'projectStatus.phases.payment', icon: CreditCard },
  { key: 'domain', labelKey: 'projectStatus.phases.domain', icon: Globe },
  { key: 'live', labelKey: 'projectStatus.phases.live', icon: Rocket }
]

// Fallback phase info (used when translations are not available)
const PHASE_INFO_FALLBACK: Record<ProjectPhase, { title: string; description: string }> = {
  onboarding: { title: 'Onboarding', description: 'Complete your onboarding.' },
  design: { title: 'Design', description: 'We are designing your website.' },
  feedback: { title: 'Feedback', description: 'Review your design preview.' },
  revisie: { title: 'Revision', description: 'Processing your feedback.' },
  payment: { title: 'Payment', description: 'Complete payment to go live.' },
  domain: { title: 'Domain', description: 'Configuring your domain.' },
  live: { title: 'Live', description: 'Your website is live!' }
}

// Get dynamic phase info based on package - with translation support
const getDynamicPhaseInfo = (phase: ProjectPhase, packageType?: string, t?: (key: string, options?: Record<string, unknown>) => string): { title: string; description: string } => {
  // If we have a valid package, use the package-specific info
  if (packageType && ['starter', 'professional', 'business', 'webshop'].includes(packageType)) {
    const pkgPhaseInfo = getPackagePhaseInfo(packageType as PackageType, phase)
    const pkg = PACKAGES[packageType as PackageType]
    
    // Use translations if available, otherwise fallback to package info
    const getTranslatedPhaseInfo = () => {
      if (t) {
        return {
          title: t(`projectStatus.phaseInfo.${phase}.title`),
          description: t(`projectStatus.phaseInfo.${phase}.description`)
        }
      }
      return pkgPhaseInfo
    }
    
    // Add package-specific details to descriptions
    if (phase === 'feedback' && pkg.revisions > 1) {
      const baseInfo = getTranslatedPhaseInfo()
      return {
        title: baseInfo.title,
        description: t 
          ? `${baseInfo.description} ${t('projectStatus.revisionsIncluded', { count: pkg.revisions })}`
          : `${pkgPhaseInfo.description} Je hebt ${pkg.revisions} revisierondes inclusief.`
      }
    }
    
    if (phase === 'payment') {
      const baseInfo = getTranslatedPhaseInfo()
      return {
        title: baseInfo.title,
        description: t
          ? t('projectStatus.paymentDescription', { price: pkg.price })
          : `Je design is goedgekeurd! Rond de betaling van €${pkg.price}/maand af om live te gaan.`
      }
    }
    
    return getTranslatedPhaseInfo()
  }
  
  // Fallback to static translations if t is provided
  if (t) {
    return {
      title: t(`projectStatus.phaseInfo.${phase}.title`),
      description: t(`projectStatus.phaseInfo.${phase}.description`)
    }
  }
  
  // Fallback to static info (only when t is not available)
  return PHASE_INFO_FALLBACK[phase]
}

// Get phase color scheme
const getPhaseColors = (phase: ProjectPhase) => {
  const colors: Record<ProjectPhase, { bg: string; gradient: string; text: string }> = {
    onboarding: { bg: 'bg-blue-500', gradient: 'from-blue-600 to-indigo-600', text: 'text-blue-400' },
    design: { bg: 'bg-amber-500', gradient: 'from-amber-500 to-orange-500', text: 'text-amber-400' },
    feedback: { bg: 'bg-indigo-500', gradient: 'from-indigo-500 to-purple-500', text: 'text-indigo-400' },
    revisie: { bg: 'bg-cyan-500', gradient: 'from-cyan-500 to-blue-500', text: 'text-cyan-400' },
    payment: { bg: 'bg-purple-500', gradient: 'from-purple-600 to-indigo-500', text: 'text-purple-400' },
    domain: { bg: 'bg-pink-500', gradient: 'from-pink-500 to-rose-500', text: 'text-pink-400' },
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

export default function ProjectStatus() {
  const { t, i18n } = useTranslation()
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
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const settingsMenuRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prevMessageCountRef = useRef<number>(0)
  
  // Onboarding state
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)
  // Default collapsed on mobile (we'll check window width)
  const [onboardingExpanded, setOnboardingExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 640 // sm breakpoint
    }
    return true
  })
  
  // Success banner for just completed onboarding
  const [showOnboardingSuccess, setShowOnboardingSuccess] = useState(false)
  
  // Ready for design confirmation
  const [confirmingReadyForDesign, setConfirmingReadyForDesign] = useState(false)
  const [readyForDesignLoading, setReadyForDesignLoading] = useState(false)
  
  // Account - supports inline view
  const [activeView, setActiveView] = useState<'dashboard' | 'account'>('dashboard')
  
  // Design preview modal state
  const [showDesignPreview, setShowDesignPreview] = useState(false)
  
  // Help center state
  const [showHelpCenter, setShowHelpCenter] = useState(false)
  
  // Satisfaction survey state - shows after livegang
  const [showSatisfactionSurvey, setShowSatisfactionSurvey] = useState(false)
  
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
  
  const phaseColors = project ? getPhaseColors(project.status) : getPhaseColors('onboarding')
  
  // SEO - Set page title and description
  useSEO({
    title: project 
      ? `${project.businessName} - ${t('projectStatus.myProject')}` 
      : t('projectStatus.myProject'),
    description: project 
      ? t('projectStatus.seoDescription', { businessName: project.businessName, phase: t(`projectStatus.phases.${project.status}`) })
      : t('projectStatus.seoDescriptionDefault'),
    noindex: true // Klantenpagina's moeten niet geïndexeerd worden
  })
  
  // Calculate deadline for current phase
  const currentDeadline = project?.phaseDeadlines?.[project.status as keyof typeof project.phaseDeadlines]
  const countdown = useDeadlineCountdown(currentDeadline)

  // Close settings menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  // Show satisfaction survey after project goes live
  // Check localStorage to avoid showing multiple times
  useEffect(() => {
    if (!project || project.status !== 'live' || !projectId) return
    
    const surveyKey = `satisfaction_survey_shown_${projectId}`
    const hasShownSurvey = localStorage.getItem(surveyKey)
    
    if (hasShownSurvey) return
    
    // Show survey after 5 seconds on live page
    const timer = setTimeout(() => {
      setShowSatisfactionSurvey(true)
      localStorage.setItem(surveyKey, new Date().toISOString())
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [project?.status, projectId, project])

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (!showChat || !projectId) return
    
    // Check if there are unread developer messages
    const hasUnread = messages.some(m => !m.read && m.from === 'developer')
    if (!hasUnread) return
    
    // Update local state immediately
    setMessages(prev => prev.map(m => 
      m.from === 'developer' ? { ...m, read: true } : m
    ))
    // Persist to backend
    fetch(`/api/project/${projectId}/messages/read`, { method: 'POST' })
      .catch(err => console.error('Failed to mark messages as read:', err))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showChat, projectId])

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
        setVerifyError(t('projectStatus.login.failed'))
      }
    } catch {
      setVerifyError(t('projectStatus.error.somethingWentWrong'))
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
                <h1 className="text-xl font-bold text-white mb-1">{t('projectStatus.login.title')}</h1>
                <p className="text-sm text-gray-400">{t('projectStatus.login.subtitle')}</p>
              </div>

              {projectId && projectId !== ':projectId' && (
                <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-xs text-gray-500">{t('projectStatus.login.project')}</p>
                  <p className="font-mono text-sm text-white">{projectId}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                {(!projectId || projectId === ':projectId') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('projectStatus.login.email')}</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder={t('projectStatus.login.emailPlaceholder')}
                        className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('projectStatus.login.password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder={t('projectStatus.login.passwordPlaceholder')}
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
                    <>{t('projectStatus.login.submit')} <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <Link to="/wachtwoord-vergeten" className="text-sm text-blue-400 hover:text-blue-300">
                  {t('projectStatus.login.forgotPassword')}
                </Link>
              </div>
            </motion.div>

            {/* Trust badges */}
            <div className="mt-6 flex justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-green-500" />
                {t('projectStatus.login.sslSecure')}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-500" />
                {t('projectStatus.login.alwaysAccess')}
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
          <h1 className="text-xl font-bold text-white mb-2">{t('projectStatus.couldNotLoad')}</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <Link to="/status" className="text-blue-400 hover:text-blue-300">
            {t('projectStatus.tryAgain')}
          </Link>
        </div>
      </div>
    )
  }

  // MAIN DASHBOARD
  const progress = getProgressPercentage(project.status)
  const unreadMessages = messages.filter(m => !m.read && m.from === 'developer').length

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Header - Clean & Simple */}
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
              {/* Notifications - always visible */}
              <div data-tour="notifications" className="relative">
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
              {/* Chat - always visible */}
              <button
                onClick={() => setShowChat(!showChat)}
                className={`relative p-2 transition rounded-lg ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </button>
              {/* Settings Menu - dropdown with all other options */}
              <div ref={settingsMenuRef} className="relative">
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className={`p-2 transition rounded-lg ${
                    darkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label="Menu"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {showSettingsMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border overflow-hidden z-50 ${
                        darkMode 
                          ? 'bg-gray-900 border-gray-700' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      {/* Dark Mode Toggle */}
                      <button
                        onClick={() => {
                          toggleDarkMode()
                          setShowSettingsMenu(false)
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          darkMode 
                            ? 'hover:bg-gray-800 text-gray-200' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        <span className="flex-1">{darkMode ? t('settings.lightMode', 'Lichte modus') : t('settings.darkMode', 'Donkere modus')}</span>
                      </button>
                      
                      {/* Language */}
                      <div className={`px-4 py-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <div className={`flex items-center gap-3 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Languages className="w-5 h-5" />
                          <span className="text-sm">{t('settings.language', 'Taal')}</span>
                        </div>
                        <div className="flex gap-2 ml-8">
                          <button
                            onClick={() => {
                              i18n.changeLanguage('nl')
                              localStorage.setItem('language', 'nl')
                            }}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                              i18n.language.startsWith('nl')
                                ? 'bg-primary-500 text-white'
                                : darkMode 
                                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            🇳🇱 NL
                          </button>
                          <button
                            onClick={() => {
                              i18n.changeLanguage('en')
                              localStorage.setItem('language', 'en')
                            }}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                              i18n.language.startsWith('en')
                                ? 'bg-primary-500 text-white'
                                : darkMode 
                                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            🇬🇧 EN
                          </button>
                        </div>
                      </div>

                      <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        {/* Help */}
                        <button
                          data-tour="help"
                          onClick={() => {
                            setShowHelpCenter(true)
                            setShowSettingsMenu(false)
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            darkMode 
                              ? 'hover:bg-gray-800 text-gray-200' 
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <HelpCircle className="w-5 h-5" />
                          <span>{t('settings.help', 'Hulp & FAQ')}</span>
                        </button>
                        
                        {/* Account */}
                        <button
                          onClick={() => {
                            setActiveView('account')
                            setShowSettingsMenu(false)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            darkMode 
                              ? 'hover:bg-gray-800 text-gray-200' 
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <User className="w-5 h-5" />
                          <span>{t('projectStatus.myAccount', 'Mijn account')}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          {/* Business name bar - hidden on mobile as info is in bottom nav context */}
          <div className={`hidden sm:flex items-center justify-between mt-2 pt-2 border-t ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <span className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.businessName}</span>
              <span className="text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-mono">{projectId}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${phaseColors.bg}`} />
              <span className="text-xs text-gray-500">
                {t(`projectStatus.phases.${project.status}`)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5 pb-24">
        {/* View Tabs - Dashboard / Account */}
        <div className={`flex rounded-xl p-1 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeView === 'dashboard'
                ? darkMode
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'bg-white text-gray-900 shadow-sm'
                : darkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>{t('projectStatus.myProject')}</span>
          </button>
          <button
            onClick={() => setActiveView('account')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeView === 'account'
                ? darkMode
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'bg-white text-gray-900 shadow-sm'
                : darkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>{t('projectStatus.myDetails')}</span>
          </button>
        </div>

        {/* Account View */}
        {activeView === 'account' && (
          <>
            <AccountSection
              project={project}
              onUpdateProject={updateProject}
            />
            
            {/* Trust badges for account view */}
            <div className={`flex justify-center gap-6 py-6 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-green-500" />
                Beveiligd
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-500" />
                Privacy
              </div>
            </div>
          </>
        )}

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
        <>
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
                  <h3 className="font-semibold text-green-400 mb-1">{t('projectStatus.onboardingCompleted')}</h3>
                  <p className="text-sm text-gray-300">
                    {t('projectStatus.onboardingSection.completedMessage')}
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
          {/* Progress header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('projectStatus.projectProgress')}
            </h3>
            <span className={`text-2xl font-bold bg-gradient-to-r ${phaseColors.gradient} bg-clip-text text-transparent`}>
              {progress}%
            </span>
          </div>

          {/* Large progress bar */}
          <div className={`h-3 rounded-full overflow-hidden mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full bg-gradient-to-r ${phaseColors.gradient} relative`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
            </motion.div>
          </div>

          {/* Desktop: full width spread, Mobile: horizontal scroll */}
          <div className="relative">
            {/* Mobile scroll indicator */}
            <div className="sm:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900/80 to-transparent pointer-events-none z-10 rounded-r-xl" />
            
            <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none gap-1 sm:gap-0 min-w-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {PHASES.map((phase, index) => {
                const status = getPhaseStatus(phase.key)
                const Icon = phase.icon
                const isLast = index === PHASES.length - 1
                
                return (
                  <div key={phase.key} className="flex items-center flex-shrink-0 sm:flex-shrink sm:flex-1">
                    <div className="flex flex-col items-center min-w-[48px] sm:min-w-0">
                      <motion.div 
                        layout
                        initial={false}
                        animate={{
                          scale: status === 'current' ? 1.1 : 1,
                          boxShadow: status === 'current' ? '0 0 20px rgba(99, 102, 241, 0.5)' : 'none'
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                          status === 'completed' ? 'bg-green-500/20 border-2 border-green-500/50' :
                          status === 'current' ? `bg-gradient-to-br ${phaseColors.gradient} ring-2 ring-white/30` :
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
                      {t(`projectStatus.phases.${phase.key}`)}
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
                <h2 className="font-bold text-lg sm:text-xl mb-1">{getDynamicPhaseInfo(project.status, project.package, t)?.title}</h2>
                <p className="text-sm text-white/80 leading-relaxed">{getDynamicPhaseInfo(project.status, project.package, t)?.description}</p>
              </div>
            </div>

            {/* Feedback received timestamp - show in revisie phase */}
            {project.status === 'revisie' && project.feedbackReceivedAt && (
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-300" />
                <span className="text-sm text-white/70">
                  {t('projectStatus.feedbackReceivedAt')} <span className="font-medium text-white">{new Date(project.feedbackReceivedAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                </span>
              </div>
            )}

            {/* Countdown timer */}
            {countdown && project.status !== 'live' && project.status !== 'revisie' && (
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2">
                <Timer className="w-4 h-4 text-white/70" />
                <span className="text-sm text-white/70">
                  {t('projectStatus.estimatedDeadline')}: <span className="font-semibold text-white">{countdown.days}d {countdown.hours}u</span>
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions - Context-aware shortcuts */}
        <QuickActions
          phase={project.status as 'onboarding' | 'design' | 'feedback' | 'revisie' | 'payment' | 'domain' | 'live'}
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

        {/* Package-specific Phase Card - Shows tasks and tips per package */}
        {project.package && project.status !== 'live' && (
          <div data-tour="status">
            {/* Inline Onboarding for onboarding phase */}
            {project.status === 'onboarding' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border overflow-hidden ${
                  darkMode ? 'bg-gray-900 border-blue-500/30' : 'bg-white border-blue-200 shadow-sm'
                }`}
              >
                {/* Collapsible Header */}
                <button
                  onClick={() => setOnboardingExpanded(!onboardingExpanded)}
                  className={`w-full p-4 flex items-center justify-between transition-colors ${
                    onboardingExpanded 
                      ? darkMode ? 'border-b border-gray-800' : 'border-b border-gray-100'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${darkMode ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
                      <FileText className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {t('projectStatus.onboardingSection.fillYourDetails')}
                        </h3>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {onboardingExpanded ? t('projectStatus.onboardingSection.clickToCollapse') : t('projectStatus.onboardingSection.clickToStart')} • {t('projectStatus.onboardingSection.minutes')}
                      </p>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                  }`}>
                    {onboardingExpanded ? (
                      <ChevronUp className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </div>
                </button>

                {/* Collapsible Content */}
                <AnimatePresence>
                  {onboardingExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4">
                        <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {t('projectStatus.onboardingSection.whatYouNeed')}
                        </h4>
                        <ul className={`text-sm mb-4 space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <li>✓ {t('projectStatus.onboardingSection.needBusinessName')}</li>
                          <li>✓ {t('projectStatus.onboardingSection.needLogo')}</li>
                          <li>✓ {t('projectStatus.onboardingSection.needColors')}</li>
                          <li>✓ {t('projectStatus.onboardingSection.needContact')}</li>
                        </ul>

                        {/* Inline Onboarding Component */}
                        <InlineOnboarding
                          projectId={project.projectId}
                          packageType={project.package as 'starter' | 'professional' | 'business' | 'webshop'}
                          darkMode={darkMode}
                          googleDriveUrl={project.googleDriveUrl}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <PackagePhaseCard
                packageType={project.package as 'starter' | 'professional' | 'business' | 'webshop'}
                currentPhase={project.status as 'onboarding' | 'design' | 'feedback' | 'revisie' | 'payment' | 'domain' | 'live'}
                usedRevisions={project.revisionsUsed || 0}
                darkMode={darkMode}
                projectId={project.projectId}
                googleDriveUrl={project.googleDriveUrl}
              />
            )}
          </div>
        )}

        {/* Special Revisie Status Card - shown when feedback is being processed */}
        {project.status === 'revisie' && (
          <RevisionPhaseCard
            revisionsUsed={project.revisionsUsed || 1}
            revisionsTotal={project.revisionsTotal}
            feedbackReceivedAt={project.feedbackReceivedAt}
            designPreviewUrl={project.designPreviewUrl}
            darkMode={darkMode}
            onViewPreview={() => setShowDesignPreview(true)}
            onSendMessage={() => setShowChat(true)}
          />
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
                    <h3 className="font-semibold text-white text-lg mb-1">{t('projectStatus.designInProgress')}</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      {t('projectStatus.designerWorking')}
                    </p>
                    
                    {/* Progress Steps */}
                    <div className="space-y-2">
                      {[
                        { label: t('projectStatus.designSteps.materialsReceived'), done: true },
                        { label: t('projectStatus.designSteps.wireframeSketch'), done: true },
                        { label: t('projectStatus.designSteps.visualDesign'), done: false, current: true },
                        { label: t('projectStatus.designSteps.preparePreview'), done: false },
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
              <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">{t('projectStatus.whatToExpect')}</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">→</span>
                  <span>{t('projectStatus.expectEmail')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">→</span>
                  <span>{t('projectStatus.expectFeedback')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">→</span>
                  <span>{t('projectStatus.expectBuild')}</span>
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
                  <h3 className="font-semibold text-white text-lg mb-1">{t('projectStatus.onboardingSection.readyForDesign')}</h3>
                  <p className="text-sm text-gray-300">
                    {t('projectStatus.onboardingSection.readyDescription')}
                  </p>
                </div>
              </div>

              {!confirmingReadyForDesign ? (
                <button
                  onClick={() => setConfirmingReadyForDesign(true)}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  {t('projectStatus.onboardingSection.startDesign')}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <p className="text-sm text-amber-300">
                      <strong>{t('projectStatus.onboardingSection.warning')}</strong> {t('projectStatus.onboardingSection.warningMessage')}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmingReadyForDesign(false)}
                      className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition"
                    >
                      {t('projectStatus.onboardingSection.cancel')}
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
                          {t('projectStatus.onboardingSection.yesStartDesign')}
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
                <h3 className="font-bold text-white text-lg">{t('projectStatus.designPreviewReady')}</h3>
                <p className="text-sm text-gray-400">{t('projectStatus.viewAndFeedback')}</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowDesignPreview(true)}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-400 hover:to-pink-400 transition flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/25"
            >
              <Eye className="w-5 h-5" />
              {t('projectStatus.viewAndReviewDesign')}
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
                {t('projectStatus.openInNewTab')}
              </a>
            </div>
          </motion.div>
        )}

        {/* Live Dashboard - Full featured dashboard for live projects */}
        {project.status === 'live' && (
          <LivePhaseCard
            businessName={project.businessName}
            packageName={project.package || 'starter'}
            liveUrl={project.liveUrl}
            liveDate={project.liveDate}
            googleDriveUrl={project.googleDriveUrl}
            analyticsUrl={project.analyticsUrl}
            changeRequests={project.changeRequests}
            changesThisMonth={project.changesThisMonth}
            changesLimit={PACKAGES[project.package as keyof typeof PACKAGES]?.features?.includes('Onbeperkt wijzigingen') ? undefined : 5}
            darkMode={darkMode}
            onSubmitChangeRequest={async (description) => {
              await handleChangeRequest({ 
                description,
                priority: 'normal',
                category: 'other'
              })
            }}
            onRequestChange={() => setShowChat(true)}
            onContactSupport={() => setShowChat(true)}
            onViewAnalytics={() => project.analyticsUrl && window.open(project.analyticsUrl, '_blank')}
          />
        )}

        {/* Customer Dashboard Extras - Only for live projects */}
        {project.status === 'live' && (
          <CustomerDashboardExtras
            projectId={project.projectId}
            darkMode={darkMode}
            invoices={project.invoices}
            packageType={project.package}
            monthlyPrice={PACKAGES[project.package as keyof typeof PACKAGES]?.price || 119}
            liveDate={project.liveDate}
            liveUrl={project.liveUrl}
            googleDriveUrl={project.googleDriveUrl}
            analyticsUrl={project.analyticsUrl}
          />
        )}

        {/* Payment Section */}
        {project.status === 'payment' && (
          <PaymentPhaseCard
            businessName={project.businessName}
            packageName={project.package || 'starter'}
            monthlyPrice={PACKAGES[project.package as keyof typeof PACKAGES]?.price || 119}
            setupFee={PACKAGES[project.package as keyof typeof PACKAGES]?.setupFee || 149}
            paymentUrl={project.paymentUrl}
            paymentStatus={project.paymentStatus === 'paid' ? 'paid' : project.paymentStatus === 'overdue' ? 'overdue' : 'pending'}
            invoices={project.invoices}
            darkMode={darkMode}
            onPayNow={() => project.paymentUrl && window.open(project.paymentUrl, '_blank')}
            onContactSupport={() => setShowChat(true)}
          />
        )}

        {/* Pre-Live Checklist - Show after payment is received */}
        {project.paymentStatus === 'paid' && project.status !== 'live' && project.status !== 'domain' && (
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

        {/* Domain Configuration - Domain transfer and setup before going live */}
        {project.status === 'domain' && (
          <DomainPhaseCard
            businessName={project.businessName}
            domainInfo={project.domainInfo as any}
            emailInfo={project.emailInfo as any}
            darkMode={darkMode}
            onSaveConfig={async (data) => {
              try {
                const response = await fetch(`/api/projects?id=${project.projectId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    domainInfo: data.domainInfo,
                    emailInfo: data.emailInfo
                  })
                })
                if (response.ok) {
                  const result = await response.json()
                  setProject(prev => prev ? {
                    ...prev,
                    domainInfo: result.domainInfo,
                    emailInfo: result.emailInfo
                  } : null)
                }
              } catch (error) {
                console.error('Error saving domain config:', error)
                throw error
              }
            }}
            onContactSupport={() => setShowChat(true)}
          />
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
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('projectStatus.invoices')}</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {t('projectStatus.invoicesOverview')}
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
                            · {t('projectStatus.dueDate')}: {new Date(invoice.dueDate).toLocaleDateString('nl-NL', { 
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
                        {invoice.status === 'paid' ? `✓ ${t('projectStatus.paid')}` :
                         invoice.status === 'overdue' ? `⚠ ${t('projectStatus.overdue')}` :
                         invoice.status === 'sent' ? t('projectStatus.pending') : t('projectStatus.draft')}
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
                        {t('projectStatus.pay')}
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
                      {t('projectStatus.invoicesPaidCount', { paid: project.invoices.filter(i => i.status === 'paid').length, total: project.invoices.length })}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    {project.invoices.some(i => i.status !== 'paid' && i.status !== 'cancelled') && (
                      <div className="text-right">
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{t('projectStatus.outstanding')}</p>
                        <p className="font-semibold text-amber-500">
                          €{project.invoices
                            .filter(i => i.status !== 'paid' && i.status !== 'cancelled')
                            .reduce((sum, i) => sum + i.amount, 0)
                            .toFixed(2)}
                        </p>
                      </div>
                    )}
                    <div className="text-right">
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{t('projectStatus.totalPaid')}</p>
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

        {/* Developer Updates - What developers have done on the project (only shown when live) */}
        {project.status === 'live' && (
          <DeveloperUpdates 
            projectId={project.projectId}
            darkMode={darkMode}
          />
        )}

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
        </>
        )}
      </main>

      {/* Footer */}
      <div className="pb-20 sm:pb-0">
        <Footer />
      </div>

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
                      <p className="text-sm">{t('projectStatus.chat.empty')}</p>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{t('chat.placeholder')}</p>
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
          className={`fixed bottom-24 md:bottom-6 right-4 md:right-6 w-14 h-14 bg-gradient-to-r ${phaseColors.gradient} rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-110 transition`}
        >
          <MessageSquare className="w-6 h-6 text-white" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadMessages}
            </span>
          )}
        </motion.button>
      )}

      {/* Design Preview Modal */}
      {project && project.designPreviewUrl && (
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
      )}

      {/* Help Center Slide-over */}
      <HelpCenter
        isOpen={showHelpCenter}
        onClose={() => setShowHelpCenter(false)}
        currentPhase={project?.status as 'onboarding' | 'design' | 'feedback' | 'revisie' | 'payment' | 'domain' | 'live' || 'onboarding'}
        darkMode={darkMode}
        onRestartTour={resetTour}
      />

      {/* Onboarding Tour for new users */}
      <OnboardingTour
        isOpen={shouldShowTour && !loading && !error}
        onClose={dismissTour}
        onComplete={dismissTour}
        projectName={project?.businessName}
      />

      {/* Milestone Celebrations */}
      <MilestoneCelebration
        milestone={currentMilestone}
        onClose={closeCelebration}
      />

      {/* Satisfaction Survey - shows after livegang */}
      {project && (
        <SatisfactionSurveyModal
          isOpen={showSatisfactionSurvey}
          onClose={() => setShowSatisfactionSurvey(false)}
          projectId={project.projectId}
          businessName={project.businessName}
          contactName={project.contactName}
          darkMode={darkMode}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        darkMode={darkMode}
        unreadMessages={unreadMessages}
        activeTab={activeView === 'account' ? 'account' : 'home'}
        onHome={() => {
          setActiveView('dashboard')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onChat={() => setShowChat(true)}
        onDocs={() => {
          if (project?.googleDriveUrl) {
            window.open(project.googleDriveUrl, '_blank')
          }
        }}
        onHelp={() => setShowHelpCenter(true)}
        onAccount={() => {
          setActiveView('account')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
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

      {/* Push Notification Prompt - shows after 15 seconds */}
      {isVerified && project && (
        <PushNotificationPrompt 
          projectId={project.projectId} 
          darkMode={darkMode} 
          delay={15000} 
        />
      )}
    </div>
  )
}
