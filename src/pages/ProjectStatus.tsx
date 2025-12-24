import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectStatusSkeleton } from '../components/LoadingSkeletons'
import {
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  AlertCircle,
  FileText,
  Palette,
  Code,
  Rocket,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  MessageSquare,
  Send,
  Phone,
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
  ThumbsUp,
  Upload,
  Image,
  File,
  Edit3,
  User,
  Sun,
  Moon
} from 'lucide-react'
import Logo from '../components/Logo'
import DesignFeedback from '../components/DesignFeedback'
import LiveApprovalSection from '../components/LiveApprovalSection'
import LogoProjectSection from '../components/LogoProjectSection'
import ClientAccountModal from '../components/ClientAccountModal'
import type { Project, ProjectPhase, ProjectMessage, ChangeRequest, LogoProject, LogoDeliverable } from '../types/project'
import { getProgressPercentage } from '../types/project'
import { getWhatsAppLink, WHATSAPP_MESSAGES } from '../lib/constants'

// Phase configuration
const PHASES: { key: ProjectPhase; label: string; icon: typeof FileText }[] = [
  { key: 'onboarding', label: 'Onboarding', icon: FileText },
  { key: 'design', label: 'Design', icon: Palette },
  { key: 'payment', label: 'Development', icon: Code },
  { key: 'payment', label: 'Review', icon: MessageSquare },
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
    }
  ],
  design: [
    { 
      title: 'Design reviewen', 
      description: 'Bekijk het design en geef feedback',
      buttonText: 'Design',
      type: 'link',
      urgent: true
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

// Phase expectations text - base for websites
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

// Service-specific phase info overrides
const SERVICE_PHASE_INFO: Record<string, Partial<Record<ProjectPhase, { title: string; description: string }>>> = {
  webshop: {
    onboarding: {
      title: 'We verzamelen je webshop informatie',
      description: 'Vul de onboarding in met je producten, categorieën en betaalinstellingen.'
    },
    payment: {
      title: 'Je webshop wordt gebouwd',
      description: 'We bouwen je webshop met alle producten, betaalmethodes en verzendopties.'
    },
    live: {
      title: 'Je webshop is live! 🛒',
      description: 'Klanten kunnen nu bestellen. Succes met verkopen!'
    }
  },
  logo: {
    onboarding: {
      title: 'We verzamelen je huisstijl wensen',
      description: 'Deel je voorkeuren voor kleuren, stijl en wat je logo moet uitstralen.'
    },
    design: {
      title: 'Je logo wordt ontworpen',
      description: 'We maken meerdere logo concepten. Je ontvangt binnenkort de eerste ontwerpen.'
    },
    payment: {
      title: 'Logo concepten klaar',
      description: 'Bekijk de ontwerpen en geef feedback. We passen aan tot je 100% tevreden bent.'
    },
    live: {
      title: 'Je logo is klaar! 🎨',
      description: 'Download je logo in alle formaten (PNG, SVG, PDF).'
    }
  },
  drone: {
    onboarding: {
      title: 'We plannen je opname',
      description: 'Geef aan waar en wanneer de drone-opnames moeten plaatsvinden.'
    },
    design: {
      title: 'Opnames worden gepland',
      description: 'We checken het weer en vluchtregels. Je ontvangt binnenkort de opnamedatum.'
    },
    payment: {
      title: 'Beelden worden bewerkt',
      description: 'We editen de beelden met kleurcorrectie, stabilisatie en muziek.'
    },
    live: {
      title: 'Je dronebeelden zijn klaar! 🚁',
      description: 'Download je beelden in 4K kwaliteit.'
    }
  }
}

// Get phase info based on service type
const getPhaseInfo = (phase: ProjectPhase, serviceType?: string) => {
  if (serviceType && SERVICE_PHASE_INFO[serviceType]?.[phase]) {
    return SERVICE_PHASE_INFO[serviceType][phase]!
  }
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

export default function ProjectStatusNew() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Notifications state
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'info' | 'success' | 'warning'
    title: string
    message: string
    date: string
  }>>([])
  const [showNotifications, setShowNotifications] = useState(false)
  
  // Onboarding state
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)
  const [uploadsCompleted, setUploadsCompleted] = useState(false)
  const [confirmingUploads, setConfirmingUploads] = useState(false)
  const [showUploadConfirm, setShowUploadConfirm] = useState(false)
  const [showDesignTransition, setShowDesignTransition] = useState(false)
  
  // Account modal state
  const [showAccountModal, setShowAccountModal] = useState(false)
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('projectPortalDarkMode')
      return saved !== null ? JSON.parse(saved) : true // Default to dark
    }
    return true
  })
  
  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('projectPortalDarkMode', JSON.stringify(darkMode))
  }, [darkMode])
  
  // Design approval state
  const [approvingDesign, setApprovingDesign] = useState(false)
  const [showApprovalConfirm, setShowApprovalConfirm] = useState(false)
  
  // Logo project data
  const [logoData, setLogoData] = useState<LogoProject | null>(null)
  
  // Handle uploads complete confirmation
  const handleConfirmUploadsComplete = async () => {
    if (!projectId || !project) return
    setConfirmingUploads(true)
    try {
      const response = await fetch('/api/uploads-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      })
      if (response.ok) {
        const data = await response.json()
        setUploadsCompleted(true)
        setShowUploadConfirm(false)
        
        // Show design transition animation
        if (data.movedToDesign) {
          setShowDesignTransition(true)
          
          // Update local project state immediately to show design phase
          setProject(prev => prev ? { 
            ...prev, 
            status: 'design',
            uploadsConfirmed: true,
            uploadsConfirmedAt: new Date().toISOString()
          } : null)
          
          // Hide transition after 4 seconds
          setTimeout(() => {
            setShowDesignTransition(false)
          }, 4000)
        }
        
        // Show success notification
        setNotifications(prev => [{
          id: 'design-started-' + Date.now(),
          type: 'success',
          title: '🎨 Design fase gestart!',
          message: 'Je project gaat nu naar de design fase. We gaan aan de slag!',
          date: new Date().toISOString()
        }, ...prev])
        setShowNotifications(true)
        
        // Refresh project data
        fetchProject(projectId)
      }
    } catch (err) {
      console.error('Failed to confirm uploads:', err)
    } finally {
      setConfirmingUploads(false)
    }
  }
  
  // Review approval handlers
  const handleReviewApprove = async () => {
    if (!projectId || !project) return
    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'live',
          reviewApproved: true,
          reviewApprovedAt: new Date().toISOString()
        })
      })
      if (response.ok) {
        setProject(prev => prev ? { 
          ...prev, 
          status: 'live',
          reviewApproved: true,
          reviewApprovedAt: new Date().toISOString()
        } : null)
      }
    } catch (err) {
      console.error('Failed to approve payment:', err)
    }
  }

  const handleReviewFeedback = async (feedback: string) => {
    if (!projectId || !project) return
    try {
      await fetch(`/api/project-feedback?projectId=${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'payment',
          feedback,
          date: new Date().toISOString()
        })
      })
      // Notify success
      setNotifications(prev => [...prev, {
        id: 'feedback-sent-' + Date.now(),
        type: 'success',
        title: 'Feedback verstuurd',
        message: 'We gaan aan de slag met je aanpassingen.',
        date: new Date().toISOString()
      }])
      setShowNotifications(true)
    } catch (err) {
      console.error('Failed to send feedback:', err)
    }
  }

  const handleChangeRequest = async (request: ChangeRequest) => {
    if (!projectId || !project) return
    try {
      await fetch(`/api/project/${projectId}/change-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })
      // Refresh project to get updated changes
      fetchProject(projectId)
    } catch (err) {
      console.error('Failed to submit change request:', err)
    }
  }

  // Logo project handlers
  const fetchLogoData = async (id: string) => {
    try {
      const response = await fetch(`/api/project/${id}/logo`)
      if (response.ok) {
        const data = await response.json()
        setLogoData(data.logoData)
      }
    } catch (err) {
      console.error('Failed to fetch logo data:', err)
    }
  }

  const handleLogoSelectConcept = async (conceptId: string) => {
    if (!projectId) return
    try {
      await fetch(`/api/project/${projectId}/logo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'select_concept', conceptId })
      })
      fetchLogoData(projectId)
    } catch (err) {
      console.error('Failed to select concept:', err)
    }
  }

  const handleLogoSubmitFeedback = async (revision: { conceptId: string; feedback: string; round: number }) => {
    if (!projectId) return
    try {
      await fetch(`/api/project/${projectId}/logo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_feedback', ...revision })
      })
      fetchLogoData(projectId)
    } catch (err) {
      console.error('Failed to submit feedback:', err)
    }
  }

  const handleLogoApproveFinal = async () => {
    if (!projectId) return
    try {
      await fetch(`/api/project/${projectId}/logo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve_final' })
      })
      fetchLogoData(projectId)
      fetchProject(projectId)
    } catch (err) {
      console.error('Failed to approve final:', err)
    }
  }

  const handleLogoDownloadFile = async (deliverable: LogoDeliverable) => {
    // Open download URL in new tab
    window.open(deliverable.downloadUrl, '_blank')
  }

  const handleLogoDownloadAll = async () => {
    if (!projectId || !logoData?.deliverables) return
    // Create a zip download URL or open Drive folder
    const driveUrl = project?.googleDriveUrl
    if (driveUrl) {
      window.open(driveUrl, '_blank')
    }
  }
  
  const phaseColors = project ? getPhaseColors(project.status) : getPhaseColors('onboarding')
  
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

  // Polling for updates - elke 5 seconden voor snelle chat
  useEffect(() => {
    if (!isVerified || !projectId) return
    const interval = setInterval(() => {
      fetchProject(projectId)
      fetchMessages(projectId)
    }, 5000)
    return () => clearInterval(interval)
  }, [isVerified, projectId])

  // Fetch logo data for logo projects
  useEffect(() => {
    if (!isVerified || !projectId || !project) return
    if (project.serviceType === 'logo') {
      fetchLogoData(projectId)
    }
  }, [isVerified, projectId, project?.serviceType])

  // Check for onboarding completion redirect
  useEffect(() => {
    const onboardingParam = searchParams.get('onboarding')
    if (onboardingParam === 'complete' && isVerified) {
      // Set onboarding as completed
      setOnboardingCompleted(true)
      
      // Show success notification
      setNotifications(prev => {
        // Don't add if already exists
        if (prev.some(n => n.id === 'onboarding-complete')) return prev
        return [{
          id: 'onboarding-complete',
          type: 'success' as const,
          title: '✅ Onboarding voltooid!',
          message: 'Bedankt! We gaan aan de slag met je project.',
          date: new Date().toISOString()
        }, ...prev]
      })
      
      // Remove the query param from URL
      navigate(`/status/${projectId}`, { replace: true })
    }
  }, [searchParams, isVerified, projectId, navigate])

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
        navigate(`/status/${id}`, { replace: true })
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
        navigate(`/status/${id}`, { replace: true })
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
        setIsVerified(true)
        // Fetch project data immediately after login
        await fetchProject(proj.projectId)
        fetchMessages(proj.projectId)
        fetchOnboardingStatus(proj.projectId)
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
        const proj = data.project || data
        setProject(proj)
        setError('')
        // Generate notifications on first load
        if (!project) {
          setTimeout(() => generateNotifications(proj), 500)
        }
      } else if (response.status === 404) {
        // Project bestaat niet - toon geen error
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
        console.error('Project fetch failed:', response.status)
        setError('')
      }
    } catch (err) {
      // Network error - alleen loggen
      console.error('Network error fetching project:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (id: string) => {
    try {
      const response = await fetch(`/api/project/${id}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.success ? data.messages || [] : data || [])
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
        if (data?.submittedAt || data?.isComplete) setOnboardingCompleted(true)
      }
    } catch {
      // Ignore
    }
  }

  // Generate notifications based on project state
  const generateNotifications = (proj: Project) => {
    const notifs: typeof notifications = []
    
    // Unread messages notification
    const unreadCount = messages.filter(m => !m.read && m.from === 'developer').length
    if (unreadCount > 0) {
      notifs.push({
        id: 'unread-messages',
        type: 'info',
        title: `${unreadCount} nieuwe bericht${unreadCount > 1 ? 'en' : ''}`,
        message: 'Je hebt ongelezen berichten van het team',
        date: new Date().toISOString()
      })
    }
    
    // Phase-specific notifications
    if (proj.status === 'design' && proj.designPreviewUrl) {
      notifs.push({
        id: 'design-ready',
        type: 'success',
        title: 'Design klaar voor review',
        message: 'Bekijk je design en geef feedback',
        date: new Date().toISOString()
      })
    }
    
    if (proj.status === 'feedback' && proj.paymentStatus !== 'paid') {
      notifs.push({
        id: 'payment-pending',
        type: 'warning',
        title: proj.paymentUrl ? '💳 Betaallink klaar!' : 'Betaling openstaat',
        message: proj.paymentUrl ? 'Klik hier om je betaling af te ronden' : 'Betaallink wordt voorbereid...',
        date: new Date().toISOString()
      })
    }
    
    // Payment ready notification - show prominently when payment URL is available
    if (proj.paymentUrl && proj.paymentStatus !== 'paid' && proj.status !== 'feedback') {
      notifs.push({
        id: 'payment-ready',
        type: 'warning',
        title: '💳 Betaling klaargezet',
        message: 'Er staat een betaling voor je klaar',
        date: new Date().toISOString()
      })
    }
    
    if (proj.status === 'payment' && proj.designPreviewUrl) {
      notifs.push({
        id: 'review-ready',
        type: 'success',
        title: 'Website klaar voor review',
        message: 'Test je website en geef feedback',
        date: new Date().toISOString()
      })
    }
    
    if (proj.status === 'live') {
      notifs.push({
        id: 'website-live',
        type: 'success',
        title: '🎉 Je website is live!',
        message: proj.liveUrl || 'Bekijk je live website',
        date: proj.liveDate || new Date().toISOString()
      })
    }
    
    setNotifications(notifs)
    if (notifs.length > 0) setShowNotifications(true)
  }

  const sendMessage = async () => {
    if (!projectId || !newMessage.trim()) return
    setMessageLoading(true)
    try {
      const response = await fetch(`/api/project/${projectId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage, from: 'client' })
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

  // Approve design - updates project status to design_approved
  const approveDesign = async () => {
    if (!projectId || !project) return
    setApprovingDesign(true)
    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'feedback',
          designApprovedAt: new Date().toISOString()
        })
      })
      if (response.ok) {
        setProject(prev => prev ? { ...prev, status: 'feedback', designApprovedAt: new Date().toISOString() } : null)
        setShowApprovalConfirm(false)
        // Add success notification
        setNotifications(prev => [...prev, {
          id: 'design-approved-' + Date.now(),
          type: 'success',
          title: '✅ Design goedgekeurd!',
          message: 'Super! We sturen je binnenkort de betaallink.',
          date: new Date().toISOString()
        }])
        setShowNotifications(true)
      }
    } catch (err) {
      console.error('Failed to approve design:', err)
    }
    setApprovingDesign(false)
  }

  // Get phase status
  const getPhaseStatus = (phaseKey: ProjectPhase) => {
    if (!project) return 'pending'
    const currentIndex = PHASES.findIndex(p => p.key === project.status || (project.status === 'feedback' && p.key === 'design'))
    const phaseIndex = PHASES.findIndex(p => p.key === phaseKey)
    
    if (phaseIndex < currentIndex) return 'completed'
    if (phaseIndex === currentIndex) return 'current'
    return 'pending'
  }

  // Get client actions for current phase
  const getClientActions = () => {
    if (!project) return []
    const actions = PHASE_ACTIONS[project.status] || []
    
    return actions.map(action => ({
      ...action,
      completed: action.title === 'Onboarding invullen' && onboardingCompleted,
      link: action.buttonLink?.replace(':projectId', projectId || '')
    }))
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
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors ${
        darkMode 
          ? 'border-white/10 bg-gray-950/80' 
          : 'border-gray-200 bg-white/80'
      }`}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="hover:opacity-80 transition">
            <Logo variant={darkMode ? 'white' : 'default'} size="sm" />
          </Link>
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className={`relative p-2 transition rounded-lg ${
                darkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </button>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-mono ${
              darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
            }`}>
              {projectId}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Horizontal Timeline - Always visible */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-4 transition-colors ${
            darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between overflow-x-auto scrollbar-hide gap-2">
            {PHASES.map((phase, index) => {
              const status = getPhaseStatus(phase.key)
              const Icon = phase.icon
              const isLast = index === PHASES.length - 1
              
              return (
                <div key={phase.key} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      status === 'completed' 
                        ? 'bg-green-500 text-white' 
                        : status === 'current' 
                          ? `bg-gradient-to-br ${phaseColors.gradient} text-white shadow-lg` 
                          : darkMode 
                            ? 'bg-gray-800 text-gray-500' 
                            : 'bg-gray-100 text-gray-400'
                    }`}>
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`mt-1.5 text-xs font-medium text-center whitespace-nowrap ${
                      status === 'completed' 
                        ? 'text-green-500' 
                        : status === 'current' 
                          ? darkMode ? 'text-white' : 'text-gray-900'
                          : darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {phase.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                      status === 'completed' 
                        ? 'bg-green-500' 
                        : darkMode ? 'bg-gray-800' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Notifications Banner */}
        <AnimatePresence>
          {showNotifications && notifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-2"
            >
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                    notif.type === 'success' ? 'bg-green-500/10 border-green-500/30' :
                    notif.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                    'bg-blue-500/10 border-blue-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      notif.type === 'success' ? 'bg-green-500/20' :
                      notif.type === 'warning' ? 'bg-amber-500/20' :
                      'bg-blue-500/20'
                    }`}>
                      {notif.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> :
                       notif.type === 'warning' ? <AlertCircle className="w-4 h-4 text-amber-400" /> :
                       <Sparkles className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${
                        notif.type === 'success' ? 'text-green-400' :
                        notif.type === 'warning' ? 'text-amber-400' :
                        'text-blue-400'
                      }`}>{notif.title}</p>
                      <p className="text-xs text-gray-400">{notif.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                    className="text-gray-500 hover:text-white transition p-1"
                  >
                    <ChevronDown className="w-4 h-4 rotate-45" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Card - Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${phaseColors.gradient} rounded-2xl p-5 text-white relative overflow-hidden`}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative">
            {/* Business name & phase */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold mb-1">{project.businessName}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Service Type Badge */}
                  {(project as any).type && (
                    <span className="px-2.5 py-1 bg-white/30 backdrop-blur-sm rounded-full text-xs font-medium capitalize">
                      {(project as any).type === 'website' ? '🌐 Website' :
                       (project as any).type === 'webshop' ? '🛒 Webshop' :
                       (project as any).type === 'logo' ? '🎨 Logo' :
                       (project as any).type === 'drone' ? '🚁 Drone' :
                       (project as any).type}
                    </span>
                  )}
                  {/* Package Badge */}
                  {project.package && (
                    <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium capitalize">
                      {project.package === 'starter' ? '⭐ Starter' :
                       project.package === 'professional' ? '💎 Professional' :
                       project.package === 'premium' || project.package === 'business' ? '🚀 Business' :
                       project.package === 'webshop' ? '🛒 Webshop' :
                       project.package}
                    </span>
                  )}
                  {/* Phase Badge */}
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                    {PHASES.find(p => p.key === project.status || (project.status === 'feedback' && p.key === 'design'))?.label || project.status}
                  </span>
                  {project.status !== 'live' && (
                    <span className="text-white/70 text-xs">{progress}% voltooid</span>
                  )}
                </div>
              </div>
              {project.status === 'live' && (
                <div className="text-3xl">🎉</div>
              )}
            </div>

            {/* Progress bar */}
            {project.status !== 'live' && (
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            )}

            {/* Phase info */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
              <p className="font-semibold mb-1">{getPhaseInfo(project.status, project.serviceType)?.title}</p>
              <p className="text-sm text-white/80">{getPhaseInfo(project.status, project.serviceType)?.description}</p>
            </div>

            {/* Enhanced Countdown timer with urgency */}
            {countdown && project.status !== 'live' && (
              <div className={`mt-4 p-3 rounded-lg ${
                countdown.days <= 1 ? 'bg-red-500/20 border border-red-500/30' :
                countdown.days <= 3 ? 'bg-amber-500/20 border border-amber-500/30' :
                'bg-white/10'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className={`w-4 h-4 ${
                      countdown.days <= 1 ? 'text-red-400' :
                      countdown.days <= 3 ? 'text-amber-400' :
                      'text-white/70'
                    }`} />
                    <span className={`text-sm font-medium ${
                      countdown.days <= 1 ? 'text-red-400' :
                      countdown.days <= 3 ? 'text-amber-400' :
                      'text-white'
                    }`}>
                      {countdown.days <= 1 ? 'Bijna klaar! 🎉' :
                       countdown.days <= 3 ? 'Nog even geduld...' :
                       'Geschatte oplevering'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <span className="text-xl font-bold text-white">{countdown.days}</span>
                      <span className="text-xs text-white/60 ml-1">dagen</span>
                    </div>
                    <div className="text-center">
                      <span className="text-xl font-bold text-white">{countdown.hours}</span>
                      <span className="text-xs text-white/60 ml-1">uren</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

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
            
            {pendingActions.map((action, index) => (
              <Link
                key={index}
                to={action.link || '#'}
                className={`block p-4 rounded-xl border transition group ${
                  action.urgent 
                    ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50' 
                    : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    action.urgent ? 'bg-amber-500/20' : 'bg-gray-800'
                  }`}>
                    <Circle className={`w-5 h-5 ${action.urgent ? 'text-amber-400' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${action.urgent ? 'text-amber-400' : 'text-white'}`}>
                      {action.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{action.description}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition group-hover:translate-x-1 ${
                    action.urgent ? 'text-amber-500' : 'text-gray-600'
                  }`} />
                </div>
              </Link>
            ))}
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
                  {/* Edit button for onboarding */}
                  {action.title === 'Onboarding invullen' && action.link && (
                    <Link
                      to={action.link}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-xs font-medium rounded-lg transition flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Wijzig
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Design Preview Link - Show during feedback and payment phases */}
        {project.designPreviewUrl && (project.status === 'design' || project.status === 'feedback' || project.status === 'payment') && (
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            href={project.designPreviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:border-purple-500/50 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Bekijk preview</p>
                <p className="text-sm text-gray-500 truncate">{project.designPreviewUrl}</p>
              </div>
              <ExternalLink className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition" />
            </div>
          </motion.a>
        )}

        {/* Design Approval Card - Show when design is ready for approval */}
        {project.status === 'design' && project.designPreviewUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/30"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <ThumbsUp className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Design goedkeuren</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Tevreden met het design? Keur het goed om door te gaan naar de volgende fase.
                </p>
                
                {!showApprovalConfirm ? (
                  <button
                    onClick={() => setShowApprovalConfirm(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-lg hover:from-emerald-400 hover:to-green-400 transition shadow-lg shadow-emerald-500/25"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Design goedkeuren
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-amber-400 text-sm font-medium">
                      ⚠️ Let op: Na goedkeuring ontvang je de betaallink
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={approveDesign}
                        disabled={approvingDesign}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-400 transition disabled:opacity-50"
                      >
                        {approvingDesign ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        Ja, goedkeuren
                      </button>
                      <button
                        onClick={() => setShowApprovalConfirm(false)}
                        className="px-4 py-2.5 text-gray-400 hover:text-white transition"
                      >
                        Annuleren
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Design Feedback Component - For structured feedback during design phase */}
        {project.status === 'design' && project.designPreviewUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
          >
            <DesignFeedback
              projectId={project.projectId}
              serviceType={project.serviceType || 'website'}
              designPreviewUrl={project.designPreviewUrl}
              onSubmit={async (_feedbackItems, approved) => {
                if (approved) {
                  await approveDesign()
                } else {
                  // Refresh project data to show updated feedback
                  fetchProject(project.projectId)
                }
              }}
            />
          </motion.div>
        )}

        {/* Review & Live Approval Section - includes feedback, approval, and change requests */}
        {(project.status === 'payment' || project.status === 'live') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
          >
            <LiveApprovalSection
              projectPackage={project.package}
              status={project.status as 'payment' | 'live'}
              stagingUrl={project.designPreviewUrl}
              liveUrl={project.liveUrl}
              googleDriveUrl={project.googleDriveUrl}
              reviewApproved={project.reviewApproved}
              reviewApprovedAt={project.reviewApprovedAt}
              pendingChanges={project.changeRequests}
              changesThisMonth={project.changesThisMonth || 0}
              onApprove={handleReviewApprove}
              onFeedback={handleReviewFeedback}
              onRequestChange={handleChangeRequest}
            />
          </motion.div>
        )}

        {/* Logo Project Section - For logo design projects */}
        {project.serviceType === 'logo' && logoData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
          >
            <LogoProjectSection
              logoData={logoData}
              packageType={typeof project.package === 'string' ? project.package : 'professional'}
              onSelectConcept={handleLogoSelectConcept}
              onSubmitFeedback={handleLogoSubmitFeedback}
              onApproveFinal={handleLogoApproveFinal}
              onDownloadFile={handleLogoDownloadFile}
              onDownloadAll={handleLogoDownloadAll}
            />
          </motion.div>
        )}

        {/* Google Drive - Project Files with Upload Indicator */}
        {project.googleDriveUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="rounded-xl bg-blue-500/10 border border-blue-500/30 overflow-hidden"
          >
            <a
              href={project.googleDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 hover:bg-blue-500/5 transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Projectbestanden</p>
                  <p className="text-sm text-gray-500">Upload hier je logo, foto's en teksten</p>
                </div>
                <ExternalLink className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition" />
              </div>
            </a>
            
            {/* Upload checklist */}
            {project.status === 'onboarding' && (
              <div className="border-t border-blue-500/20 p-4 bg-blue-500/5">
                <p className="text-xs text-blue-400 font-medium mb-3 flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" />
                  Wat moet je uploaden?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Image, label: 'Logo (PNG/SVG)', key: 'logo' },
                    { icon: Image, label: "Foto's", key: 'photos' },
                    { icon: File, label: 'Teksten', key: 'texts' },
                    { icon: File, label: 'Huisstijl', key: 'branding' }
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center gap-2 text-xs text-gray-400 bg-gray-800/50 rounded-lg px-2.5 py-2"
                    >
                      <item.icon className="w-3.5 h-3.5 text-blue-400" />
                      {item.label}
                    </div>
                  ))}
                </div>
                
                {/* Upload complete button */}
                {!uploadsCompleted && !project.uploadsConfirmed && (
                  onboardingCompleted ? (
                    <button
                      onClick={() => setShowUploadConfirm(true)}
                      className="w-full mt-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold rounded-xl transition shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Alles geüpload? Klik hier
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        // Scroll to onboarding section or navigate
                        const onboardingBtn = document.querySelector('[data-action="onboarding"]')
                        if (onboardingBtn) {
                          onboardingBtn.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }
                      }}
                      className="w-full mt-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white font-semibold rounded-xl transition shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
                    >
                      <AlertCircle className="w-5 h-5" />
                      Eerst onboarding invullen
                    </button>
                  )
                )}
                
                {/* Already confirmed */}
                {(uploadsCompleted || project.uploadsConfirmed) && (
                  <div className="mt-4 py-3 bg-green-500/20 text-green-400 font-medium rounded-xl flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Bestanden bevestigd
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Upload confirmation modal */}
        <AnimatePresence>
          {showUploadConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowUploadConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Alles geüpload?</h3>
                  <p className="text-gray-400 mb-6">
                    Bevestig dat je alle bestanden hebt geüpload (logo, foto's, teksten). Na bevestiging starten we met het design.
                  </p>
                  
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                    <p className="text-amber-400 text-sm">
                      ⚠️ Let op: na bevestiging kun je nog steeds extra bestanden uploaden, maar we starten wel alvast met wat je nu hebt aangeleverd.
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowUploadConfirm(false)}
                      className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition"
                    >
                      Annuleren
                    </button>
                    <button
                      onClick={handleConfirmUploadsComplete}
                      disabled={confirmingUploads}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold rounded-xl transition shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {confirmingUploads ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Bevestigen
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Design Phase Transition Modal */}
        <AnimatePresence>
          {showDesignTransition && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="max-w-lg w-full text-center"
              >
                {/* Animated Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                  className="relative mx-auto mb-8"
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30 mx-auto">
                    <Palette className="w-16 h-16 text-white" />
                  </div>
                  {/* Sparkles around icon */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <span className="text-lg">✨</span>
                  </motion.div>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                    className="absolute -bottom-1 -left-3 w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <span className="text-sm">🎨</span>
                  </motion.div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Design fase gestart! 🎉
                  </h2>
                  <p className="text-lg text-gray-300 mb-6">
                    Je project gaat nu naar de design fase. We gaan aan de slag met het ontwerp van jouw website!
                  </p>
                  
                  {/* Progress indicator */}
                  <div className="bg-gray-800/50 rounded-2xl p-4 mb-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">Voortgang</span>
                      <span className="text-sm font-semibold text-amber-400">35%</span>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: '15%' }}
                        animate={{ width: '35%' }}
                        transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-gray-500">
                      <span className="text-green-400">✓ Onboarding</span>
                      <span className="text-amber-400 font-semibold">→ Design</span>
                      <span>Development</span>
                      <span>Live</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400">
                    Je ontvangt binnenkort een preview van het ontwerp
                  </p>
                </motion.div>

                {/* Auto-close indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-8"
                >
                  <button
                    onClick={() => setShowDesignTransition(false)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
                  >
                    Sluiten
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>



        {/* Payment Section - Show when payment is pending or awaiting */}
        {project.paymentUrl && project.paymentStatus !== 'paid' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border-2 border-indigo-500/50"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-white">Betaling klaargezet</h3>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full animate-pulse">
                    Actie nodig
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  {project.status === 'feedback' 
                    ? 'Je design is goedgekeurd! Rond de betaling af om door te gaan naar development.'
                    : 'Er staat een betaling voor je klaar. Rond deze af om verder te gaan.'}
                </p>
                
                {/* Payment details */}
                {project.package && (
                  <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Pakket:</span>
                      <span className="text-white font-medium capitalize">{project.package}</span>
                    </div>
                  </div>
                )}
                
                <a
                  href={project.paymentUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-400 hover:to-purple-400 transition shadow-lg shadow-indigo-500/25 group"
                >
                  <CreditCard className="w-5 h-5" />
                  Nu betalen
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Awaiting Payment Link - Show when design approved but no link yet */}
        {project.status === 'feedback' && !project.paymentUrl && project.paymentStatus !== 'paid' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-5 rounded-xl bg-gray-800/50 border border-gray-700"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Betaallink wordt voorbereid</h3>
                <p className="text-sm text-gray-400">
                  Je design is goedgekeurd! We sturen je binnenkort een betaallink om door te gaan.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Payment Status Card - Show when paid */}
        {project.paymentStatus === 'paid' && project.paymentCompletedAt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-4 rounded-xl bg-green-500/10 border border-green-500/30"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-green-400">Betaling ontvangen</p>
                <p className="text-xs text-gray-500">
                  {new Date(project.paymentCompletedAt).toLocaleDateString('nl-NL', { 
                    day: 'numeric', month: 'long', year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Invoices Section */}
        {project.invoices && project.invoices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.27 }}
            className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <h3 className="font-medium text-white">Facturen</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-800">
              {project.invoices.map((invoice) => (
                <div key={invoice.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      invoice.status === 'paid' ? 'bg-green-500/20' :
                      invoice.status === 'overdue' ? 'bg-red-500/20' :
                      'bg-gray-800'
                    }`}>
                      {invoice.status === 'paid' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : invoice.status === 'overdue' ? (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{invoice.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(invoice.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-white">€{invoice.amount.toFixed(2)}</p>
                      <p className={`text-xs ${
                        invoice.status === 'paid' ? 'text-green-400' :
                        invoice.status === 'overdue' ? 'text-red-400' :
                        'text-gray-500'
                      }`}>
                        {invoice.status === 'paid' ? 'Betaald' :
                         invoice.status === 'overdue' ? 'Te laat' :
                         invoice.status === 'sent' ? 'Openstaand' : 'Concept'}
                      </p>
                    </div>
                    {invoice.paymentUrl && invoice.status !== 'paid' && (
                      <a
                        href={invoice.paymentUrl}
                        className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-400 transition"
                      >
                        Betalen
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-2 gap-3"
        >
          {/* WhatsApp */}
          <a
            href={getWhatsAppLink(WHATSAPP_MESSAGES.PROJECT(projectId!))}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-4 rounded-xl border transition group ${
              darkMode 
                ? 'bg-gray-900 border-gray-800 hover:border-green-500/50' 
                : 'bg-white border-gray-200 hover:border-green-500/50 shadow-sm'
            }`}
          >
            <Phone className="w-5 h-5 text-green-500 mb-2" />
            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>WhatsApp</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Direct contact</p>
          </a>

          {/* Klantportaal */}
          <button
            onClick={() => setShowAccountModal(true)}
            className={`p-4 rounded-xl border transition group text-left ${
              darkMode 
                ? 'bg-gray-900 border-gray-800 hover:border-primary-500/50' 
                : 'bg-white border-gray-200 hover:border-primary-500/50 shadow-sm'
            }`}
          >
            <User className="w-5 h-5 text-primary-500 mb-2" />
            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mijn Account</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Gegevens & pakket</p>
          </button>
        </motion.div>

        {/* Trust badges */}
        <div className={`flex justify-center gap-6 py-4 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
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

      {/* Floating Chat */}
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
            
            {/* Chat Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto"
            >
              <div className="bg-gray-900 rounded-t-2xl border-t border-x border-gray-800 shadow-2xl">
                {/* Chat header */}
                <div className={`bg-gradient-to-r ${phaseColors.gradient} p-4 rounded-t-2xl`}>
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
                    <button
                      onClick={() => setShowChat(false)}
                      className="p-2 hover:bg-white/10 rounded-lg transition"
                    >
                      <ChevronDown className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-950">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
                      <p className="text-sm">Nog geen berichten</p>
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
                            : 'bg-gray-800 text-white rounded-bl-md'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${msg.from === 'client' ? 'text-white/60' : 'text-gray-500'}`}>
                            {new Date(msg.date).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Typ je bericht..."
                      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
    </div>
  )
}
