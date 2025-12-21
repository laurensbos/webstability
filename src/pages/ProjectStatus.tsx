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
  Calendar,
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
  File
} from 'lucide-react'
import Logo from '../components/Logo'
import DesignFeedback from '../components/DesignFeedback'
import type { Project, ProjectPhase, ProjectMessage } from '../types/project'
import { getProgressPercentage } from '../types/project'

// WhatsApp number for support
const WHATSAPP_NUMBER = '31644712573'

// Phase configuration
const PHASES: { key: ProjectPhase; label: string; icon: typeof FileText }[] = [
  { key: 'onboarding', label: 'Onboarding', icon: FileText },
  { key: 'design', label: 'Design', icon: Palette },
  { key: 'development', label: 'Development', icon: Code },
  { key: 'review', label: 'Review', icon: MessageSquare },
  { key: 'live', label: 'Live', icon: Rocket }
]

// Client actions per phase
const PHASE_ACTIONS: Record<ProjectPhase, { 
  title: string
  description: string
  buttonText: string
  buttonLink?: string
  type: 'link' | 'action' | 'none'
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
      title: 'Logo uploaden', 
      description: 'Upload je logo in hoge kwaliteit',
      buttonText: 'Upload',
      type: 'link'
    },
    { 
      title: 'Teksten aanleveren', 
      description: 'Lever je content aan',
      buttonText: 'Uploaden',
      type: 'link'
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
  design_approved: [
    { 
      title: 'Betaling afronden', 
      description: 'Rond de betaling af om door te gaan',
      buttonText: 'Betalen',
      type: 'action',
      urgent: true
    }
  ],
  development: [],
  review: [
    { 
      title: 'Website reviewen', 
      description: 'Test alle paginas en geef feedback',
      buttonText: 'Review',
      type: 'link',
      urgent: true
    }
  ],
  live: []
}

// Phase expectations text - base for websites
const PHASE_INFO: Record<ProjectPhase, { title: string; description: string }> = {
  onboarding: {
    title: 'We verzamelen je informatie',
    description: 'Vul de onboarding in zodat we je bedrijf goed begrijpen. Zodra je klaar bent, gaan we aan de slag met het design.'
  },
  design: {
    title: 'Je design wordt gemaakt',
    description: 'We werken aan het ontwerp van jouw website. Je ontvangt binnenkort een preview om te bekijken.'
  },
  design_approved: {
    title: 'Design goedgekeurd!',
    description: 'Super! Na de betaling starten we direct met het bouwen van je website.'
  },
  development: {
    title: 'Je website wordt gebouwd',
    description: 'We zijn druk bezig met bouwen! Even geduld, we houden je op de hoogte.'
  },
  review: {
    title: 'Klaar voor review',
    description: 'Je website is klaar om te bekijken. Test alles en geef je feedback.'
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
    development: {
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
    review: {
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
    development: {
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
    design_approved: { bg: 'bg-indigo-500', gradient: 'from-indigo-500 to-purple-500', text: 'text-indigo-400' },
    development: { bg: 'bg-purple-500', gradient: 'from-purple-600 to-indigo-500', text: 'text-purple-400' },
    review: { bg: 'bg-cyan-500', gradient: 'from-cyan-500 to-teal-500', text: 'text-cyan-400' },
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
  
  // Timeline expansion
  const [showTimeline, setShowTimeline] = useState(false)
  
  // Design approval state
  const [approvingDesign, setApprovingDesign] = useState(false)
  const [showApprovalConfirm, setShowApprovalConfirm] = useState(false)
  
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
      fetchProject(projectId)
      fetchMessages(projectId)
      fetchOnboardingStatus(projectId)
      setLoading(false)
    } else if (magicSession) {
      verifyMagicSession(projectId, magicSession)
    } else if (pwd) {
      verifyPassword(projectId, pwd)
    } else {
      setLoading(false)
    }
  }, [projectId, searchParams])

  // Polling for updates - elke 10 seconden
  useEffect(() => {
    if (!isVerified || !projectId) return
    const interval = setInterval(() => {
      fetchProject(projectId)
      fetchMessages(projectId)
    }, 10000)
    return () => clearInterval(interval)
  }, [isVerified, projectId])

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
      } else {
        setProject({
          projectId: id,
          businessName: 'Je project',
          package: '',
          status: 'onboarding',
          statusMessage: 'Project laden...',
          estimatedCompletion: '',
          updates: [],
          createdAt: new Date().toISOString()
        })
      }
    } catch {
      setError('Kon project niet laden.')
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
    
    if (proj.status === 'design_approved' && proj.paymentStatus !== 'paid') {
      notifs.push({
        id: 'payment-pending',
        type: 'warning',
        title: proj.paymentUrl ? '💳 Betaallink klaar!' : 'Betaling openstaat',
        message: proj.paymentUrl ? 'Klik hier om je betaling af te ronden' : 'Betaallink wordt voorbereid...',
        date: new Date().toISOString()
      })
    }
    
    // Payment ready notification - show prominently when payment URL is available
    if (proj.paymentUrl && proj.paymentStatus !== 'paid' && proj.status !== 'design_approved') {
      notifs.push({
        id: 'payment-ready',
        type: 'warning',
        title: '💳 Betaling klaargezet',
        message: 'Er staat een betaling voor je klaar',
        date: new Date().toISOString()
      })
    }
    
    if (proj.status === 'review' && proj.designPreviewUrl) {
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

  // Approve design - updates project status to design_approved
  const approveDesign = async () => {
    if (!projectId || !project) return
    setApprovingDesign(true)
    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'design_approved',
          designApprovedAt: new Date().toISOString()
        })
      })
      if (response.ok) {
        setProject(prev => prev ? { ...prev, status: 'design_approved', designApprovedAt: new Date().toISOString() } : null)
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

  // Open WhatsApp chat
  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Hoi! Ik heb een vraag over mijn project ${projectId} (${project?.businessName || 'mijn website'}).`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
  }

  // Get phase status
  const getPhaseStatus = (phaseKey: ProjectPhase) => {
    if (!project) return 'pending'
    const currentIndex = PHASES.findIndex(p => p.key === project.status || (project.status === 'design_approved' && p.key === 'design'))
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
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="hover:opacity-80 transition">
            <Logo variant="white" size="sm" />
          </Link>
          <div className="flex items-center gap-2">
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
            <span className="px-2.5 py-1 bg-gray-800 rounded-lg text-xs font-mono text-gray-400">
              {projectId}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
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
                    {PHASES.find(p => p.key === project.status || (project.status === 'design_approved' && p.key === 'design'))?.label || project.status}
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
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Design Preview Link */}
        {project.designPreviewUrl && (project.status === 'design' || project.status === 'review' || project.status === 'development') && (
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

        {/* Live website link */}
        {project.status === 'live' && project.liveUrl && (
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-xl bg-green-500/10 border border-green-500/30 hover:border-green-500/50 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Je live website</p>
                <p className="text-sm text-green-400">{project.liveUrl}</p>
              </div>
              <ExternalLink className="w-5 h-5 text-green-400 group-hover:translate-x-1 transition" />
            </div>
          </motion.a>
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
              </div>
            )}
          </motion.div>
        )}

        {/* WhatsApp Support Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          onClick={openWhatsApp}
          className="w-full p-4 rounded-xl bg-green-600/20 border border-green-500/30 hover:border-green-500/50 transition group flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-green-500/30 flex items-center justify-center">
            <Phone className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-white">Direct contact via WhatsApp</p>
            <p className="text-sm text-gray-500">Stel je vraag via WhatsApp</p>
          </div>
          <ArrowRight className="w-5 h-5 text-green-400 group-hover:translate-x-1 transition" />
        </motion.button>

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
                  {project.status === 'design_approved' 
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
        {project.status === 'design_approved' && !project.paymentUrl && project.paymentStatus !== 'paid' && (
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

        {/* Timeline - Collapsible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
        >
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <Calendar className={`w-5 h-5 ${phaseColors.text}`} />
              <div>
                <p className="font-medium text-white">Project Timeline</p>
                <p className="text-xs text-gray-500">
                  Fase {PHASES.findIndex(p => p.key === project.status || (project.status === 'design_approved' && p.key === 'design')) + 1} van {PHASES.length}
                </p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition ${showTimeline ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showTimeline && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3">
                  {PHASES.map((phase) => {
                    const status = getPhaseStatus(phase.key)
                    const Icon = phase.icon
                    
                    return (
                      <div
                        key={phase.key}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          status === 'current' ? 'bg-gray-800' : ''
                        } ${status === 'pending' ? 'opacity-50' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          status === 'completed' ? 'bg-green-500/20' :
                          status === 'current' ? phaseColors.bg :
                          'bg-gray-800'
                        }`}>
                          {status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          ) : (
                            <Icon className={`w-4 h-4 ${
                              status === 'current' ? 'text-white' : 'text-gray-500'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            status === 'completed' ? 'text-green-400' :
                            status === 'current' ? 'text-white' :
                            'text-gray-500'
                          }`}>
                            {phase.label}
                            {status === 'current' && (
                              <span className="ml-2 text-xs text-gray-400 font-normal">Nu</span>
                            )}
                          </p>
                        </div>
                        {project.phaseDeadlines?.[phase.key as keyof typeof project.phaseDeadlines] && (
                          <span className="text-xs text-gray-500">
                            {new Date(project.phaseDeadlines[phase.key as keyof typeof project.phaseDeadlines]!).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-2 gap-3"
        >
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hoi! Vraag over project ${projectId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-green-500/50 transition group"
          >
            <Phone className="w-5 h-5 text-green-400 mb-2" />
            <p className="text-sm font-medium text-white">WhatsApp</p>
            <p className="text-xs text-gray-500">Direct contact</p>
          </a>

          {/* Help */}
          <Link
            to={`/intake/${projectId}`}
            className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-blue-500/50 transition group"
          >
            <FolderOpen className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-sm font-medium text-white">Gegevens</p>
            <p className="text-xs text-gray-500">Bekijk/wijzig</p>
          </Link>
        </motion.div>

        {/* Trust badges */}
        <div className="flex justify-center gap-6 py-4 text-xs text-gray-500">
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
    </div>
  )
}
