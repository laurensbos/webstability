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
  CreditCard
} from 'lucide-react'
import Logo from '../components/Logo'
import type { Project, ProjectPhase, ProjectMessage } from '../types/project'
import { getProgressPercentage } from '../types/project'

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

// Phase expectations text
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

const WHATSAPP_NUMBER = '31612345678'

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
  
  // Onboarding state
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)
  
  // Timeline expansion
  const [showTimeline, setShowTimeline] = useState(false)
  
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

  // Polling for updates
  useEffect(() => {
    if (!isVerified || !projectId) return
    const interval = setInterval(() => {
      fetchProject(projectId)
      fetchMessages(projectId)
    }, 30000)
    return () => clearInterval(interval)
  }, [isVerified, projectId])

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
        setProject(data.project || data)
        setError('')
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
                <div className="flex items-center gap-2">
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
              <p className="font-semibold mb-1">{PHASE_INFO[project.status]?.title}</p>
              <p className="text-sm text-white/80">{PHASE_INFO[project.status]?.description}</p>
            </div>

            {/* Countdown timer */}
            {countdown && project.status !== 'live' && (
              <div className="mt-4 flex items-center gap-2">
                <Timer className="w-4 h-4 text-white/70" />
                <span className="text-sm text-white/70">
                  Geschatte deadline: <span className="font-medium text-white">{countdown.days}d {countdown.hours}u</span>
                </span>
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

        {/* Payment Section */}
        {project.status === 'design_approved' && project.paymentStatus !== 'paid' && (
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
