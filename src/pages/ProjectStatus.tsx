import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
  ThumbsUp,
  Send,
  Edit3,
  Phone,
  HelpCircle,
  FolderOpen,
  Mail,
  Search,
  Shield,
  Sparkles,
  Star,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  CreditCard,
  Settings
} from 'lucide-react'
import Logo from '../components/Logo'
import PreviewLink from '../components/PreviewLink'
import FeedbackModule from '../components/FeedbackModule'
import TaskList, { type Task } from '../components/TaskList'
import PaymentSection from '../components/PaymentSection'
import type { Project, ProjectPhase, ProjectMessage } from '../types/project'
import { getProgressPercentage, groupUpdatesByDate, PHASE_FAQS, PRIORITY_CONFIG } from '../types/project'

// Demo tasks voor de takenlijst
const DEMO_TASKS: Task[] = [
  { id: '1', title: 'Onboarding invullen', description: 'Vul je bedrijfsgegevens in', phase: 'onboarding', status: 'completed', assignedTo: 'client', completedAt: new Date().toISOString() },
  { id: '2', title: 'Logo uploaden', description: 'Upload je logo in hoge kwaliteit', phase: 'onboarding', status: 'completed', assignedTo: 'client' },
  { id: '3', title: 'Teksten aanleveren', phase: 'onboarding', status: 'pending', assignedTo: 'client' },
  { id: '4', title: 'Design concept maken', phase: 'design', status: 'in_progress', assignedTo: 'developer' },
  { id: '5', title: 'Design reviewen', description: 'Bekijk het design en geef feedback', phase: 'design', status: 'pending', assignedTo: 'client' },
  { id: '6', title: 'Homepage bouwen', phase: 'development', status: 'pending', assignedTo: 'developer' },
  { id: '7', title: 'Contact pagina bouwen', phase: 'development', status: 'pending', assignedTo: 'developer' },
  { id: '8', title: 'Formulieren testen', phase: 'development', status: 'pending', assignedTo: 'developer' },
  { id: '9', title: 'Website reviewen', description: 'Test alle paginas en geef feedback', phase: 'review', status: 'pending', assignedTo: 'client' },
  { id: '10', title: 'Finale goedkeuring', phase: 'review', status: 'pending', assignedTo: 'client' },
  { id: '11', title: 'Domein koppelen', phase: 'live', status: 'pending', assignedTo: 'developer' },
  { id: '12', title: 'SSL certificaat instellen', phase: 'live', status: 'pending', assignedTo: 'developer' },
]

// Floating Particles Component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/20"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * 400,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: [null, Math.random() * 400],
            x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

const STATUS_STEPS: { key: ProjectPhase; label: string; icon: typeof FileText; description: string }[] = [
  { key: 'onboarding', label: 'Onboarding', icon: FileText, description: 'We verzamelen je materialen' },
  { key: 'design', label: 'Design', icon: Palette, description: 'We werken aan het ontwerp' },
  { key: 'development', label: 'Development', icon: Code, description: 'We bouwen je website' },
  { key: 'review', label: 'Review', icon: MessageSquare, description: 'Je bekijkt en geeft feedback' },
  { key: 'live', label: 'Live!', icon: Rocket, description: 'Je website is online' }
]

const WHATSAPP_NUMBER = '31612345678'

// Get color for current phase
const getPhaseColor = (phase: ProjectPhase): { 
  bg: string; 
  text: string; 
  gradient: string;
  light: string;
  ring: string;
} => {
  switch (phase) {
    case 'onboarding':
      return { 
        bg: 'bg-blue-500', 
        text: 'text-blue-600', 
        gradient: 'from-blue-600 via-blue-500 to-indigo-600',
        light: 'bg-blue-100',
        ring: 'ring-blue-100'
      }
    case 'design':
      return { 
        bg: 'bg-amber-500', 
        text: 'text-amber-600', 
        gradient: 'from-amber-500 via-orange-500 to-yellow-500',
        light: 'bg-amber-100',
        ring: 'ring-amber-100'
      }
    case 'development':
      return { 
        bg: 'bg-purple-500', 
        text: 'text-purple-600', 
        gradient: 'from-purple-600 via-purple-500 to-indigo-500',
        light: 'bg-purple-100',
        ring: 'ring-purple-100'
      }
    case 'review':
      return { 
        bg: 'bg-cyan-500', 
        text: 'text-cyan-600', 
        gradient: 'from-cyan-500 via-teal-500 to-blue-500',
        light: 'bg-cyan-100',
        ring: 'ring-cyan-100'
      }
    case 'live':
      return { 
        bg: 'bg-green-500', 
        text: 'text-green-600', 
        gradient: 'from-green-500 via-emerald-500 to-teal-500',
        light: 'bg-green-100',
        ring: 'ring-green-100'
      }
    default:
      return { 
        bg: 'bg-blue-500', 
        text: 'text-blue-600', 
        gradient: 'from-blue-600 via-blue-500 to-indigo-600',
        light: 'bg-blue-100',
        ring: 'ring-blue-100'
      }
  }
}

export default function ProjectStatus() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState('')
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState(false)
  
  // Onboarding status
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)
  const [onboardingDate, setOnboardingDate] = useState<string | null>(null)
  const [changeRequestText, setChangeRequestText] = useState('')
  const [changeRequestLoading, setChangeRequestLoading] = useState(false)
  const [changeRequestSent, setChangeRequestSent] = useState(false)
  
  // Password verification state
  const [isVerified, setIsVerified] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  
  const [messages, setMessages] = useState<ProjectMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [messageLoading, setMessageLoading] = useState(false)
  const [showFaq, setShowFaq] = useState(false)
  const [changePriority, setChangePriority] = useState<'low' | 'normal' | 'urgent'>('normal')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [lookupQuery, setLookupQuery] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupResults, setLookupResults] = useState<Project[]>([])
  const [lookupError, setLookupError] = useState('')

  const phaseColors = project ? getPhaseColor(project.status) : getPhaseColor('onboarding')

  // Check for existing session or password in URL
  useEffect(() => {
    if (!projectId) return
    
    const normalizedId = projectId.toUpperCase()
    const hasSession = sessionStorage.getItem(`project_auth_${normalizedId}`) === 'true'
    const pwd = searchParams.get('pwd')
    
    if (hasSession) {
      // Already verified in this session
      setIsVerified(true)
      fetchProject(projectId)
      fetchMessages(projectId)
      fetchOnboardingStatus(projectId)
      setLoading(false)
    } else if (pwd) {
      // Password in URL from Header modal
      verifyPassword(projectId, pwd)
    } else {
      // No session and no password, show password form
      setLoading(false)
    }
  }, [projectId, searchParams])
  
  // Check if onboarding is completed
  const fetchOnboardingStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/onboarding/${id}`)
      if (response.ok) {
        const data = await response.json()
        if (data && data.submittedAt) {
          setOnboardingCompleted(true)
          setOnboardingDate(data.submittedAt)
        }
      }
    } catch {
      // No onboarding found
    }
  }

  // Verify password against API
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
        // Store session
        sessionStorage.setItem(`project_auth_${id.toUpperCase()}`, 'true')
        setIsVerified(true)
        fetchProject(id)
        fetchMessages(id)
        fetchOnboardingStatus(id)
        // Remove password from URL for security
        navigate(`/project/${id}`, { replace: true })
      } else {
        setVerifyError(data.message || 'Onjuist wachtwoord.')
        setIsVerified(false)
      }
    } catch (err) {
      console.error('Verify error:', err)
      setVerifyError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setVerifyLoading(false)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (projectId && passwordInput.trim()) {
      verifyPassword(projectId, passwordInput)
    }
  }

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/project/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
        setError('')
      } else {
        setProject({
          projectId: id,
          businessName: 'Je project',
          package: '',
          status: 'onboarding',
          statusMessage: 'We hebben je project ontvangen en gaan binnenkort aan de slag!',
          estimatedCompletion: '',
          updates: [],
          createdAt: new Date().toISOString()
        })
      }
    } catch {
      setProject({
        projectId: id,
        businessName: 'Je project',
        package: '',
        status: 'onboarding',
        statusMessage: 'Kon status niet ophalen. Neem contact met ons op.',
        estimatedCompletion: '',
        updates: [],
        createdAt: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  const sendFeedback = async (approved: boolean) => {
    if (!projectId) return
    setFeedbackLoading(true)
    try {
      const response = await fetch('/api/project-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          approved,
          feedback: feedbackText,
          type: 'design'
        })
      })
      const data = await response.json()
      setFeedbackSent(true)
      
      // Als goedgekeurd: update project met designApprovedAt en paymentStatus
      if (approved && project) {
        setProject({
          ...project,
          designApprovedAt: data.designApprovedAt || new Date().toISOString(),
          paymentStatus: 'awaiting_payment'
        })
      }
    } catch (err) {
      console.error('Feedback error:', err)
    }
    setFeedbackLoading(false)
  }

  const sendChangeRequest = async () => {
    if (!projectId || !changeRequestText.trim()) return
    setChangeRequestLoading(true)
    try {
      const response = await fetch(`/api/project/${projectId}/change-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request: changeRequestText,
          priority: changePriority
        })
      })
      const data = await response.json()
      if (data.success && project) {
        const newChangeRequest = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          request: changeRequestText,
          priority: changePriority,
          status: 'pending' as const
        }
        setProject({
          ...project,
          revisionsUsed: data.revisionsUsed,
          revisionsTotal: data.revisionsTotal,
          changeRequests: [...(project.changeRequests || []), newChangeRequest]
        })
      }
      setChangeRequestSent(true)
      setChangeRequestText('')
      setChangePriority('normal')
    } catch (err) {
      console.error('Change request error:', err)
    }
    setChangeRequestLoading(false)
  }

  const fetchMessages = async (id: string) => {
    try {
      const response = await fetch(`/api/project/${id}/messages`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setMessages(data.messages || [])
        } else {
          setMessages(data || [])
        }
      }
    } catch (err) {
      console.error('Messages fetch error:', err)
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
          from: 'client'
        })
      })
      const data = await response.json()
      if (data.success) {
        setMessages(prev => [...prev, data.message])
        setNewMessage('')
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    } catch (err) {
      console.error('Send message error:', err)
    }
    setMessageLoading(false)
  }

  const getStepStatus = (stepKey: string) => {
    if (!project) return 'pending'
    const currentIndex = STATUS_STEPS.findIndex(s => s.key === project.status)
    const stepIndex = STATUS_STEPS.findIndex(s => s.key === stepKey)
    
    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'pending'
  }

  // No project ID - show lookup form with enhanced styling
  if (!projectId) {
    const handleLookup = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!lookupQuery.trim()) return
      
      setLookupLoading(true)
      setLookupError('')
      setLookupResults([])
      
      try {
        const response = await fetch(`/api/project-lookup?q=${encodeURIComponent(lookupQuery.trim())}`)
        const data = await response.json()
        
        if (data.success && data.projects?.length > 0) {
          if (data.projects.length === 1) {
            navigate(`/status/${data.projects[0].projectId}`)
          } else {
            setLookupResults(data.projects)
          }
        } else {
          setLookupError('Geen project gevonden met deze gegevens.')
        }
      } catch (err) {
        console.error('Lookup error:', err)
        setLookupError('Er ging iets mis. Probeer het opnieuw.')
      }
      
      setLookupLoading(false)
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 overflow-hidden">
          <FloatingParticles />
          
          {/* Decorative Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
          </div>
          
          <header className="relative z-10 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <Link to="/" className="hover:opacity-80 transition">
                <Logo />
              </Link>
            </div>
          </header>

          <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6"
            >
              <Search className="w-4 h-4" />
              Project Status
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              Bekijk de voortgang van je project
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-blue-100 max-w-2xl mx-auto"
            >
              Vul je e-mailadres of Project ID in om real-time updates te zien
            </motion.p>
          </div>
        </div>

        <main className="max-w-xl mx-auto px-4 -mt-8 pb-16 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
          >
            <form onSubmit={handleLookup}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mailadres of Project ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    placeholder="jouw@email.nl of WS-MJ1G8LH1"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Je vindt je Project ID in de welkomstmail die je hebt ontvangen.
                </p>
              </div>

              {lookupError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {lookupError}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={lookupLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
              >
                {lookupLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Zoeken...
                  </>
                ) : (
                  <>
                    Bekijk status <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Multiple projects found */}
            {lookupResults.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 border-t pt-6"
              >
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Meerdere projecten gevonden ({lookupResults.length})
                </h3>
                <div className="space-y-2">
                  {lookupResults.map((p) => (
                    <Link
                      key={p.projectId}
                      to={`/status/${p.projectId}`}
                      className="block p-4 bg-gray-50 hover:bg-blue-50 rounded-xl border-2 border-transparent hover:border-blue-200 transition group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition">{p.businessName}</p>
                          <p className="text-xs text-gray-500">{p.projectId}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            p.status === 'live' ? 'bg-green-100 text-green-700' :
                            p.status === 'review' ? 'bg-cyan-100 text-cyan-700' :
                            p.status === 'development' ? 'bg-purple-100 text-purple-700' :
                            p.status === 'design' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {p.status}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span>SSL beveiligd</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>24/7 toegang</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span>Real-time updates</span>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Project laden...</p>
        </div>
      </div>
    )
  }

  // Password verification required
  if (!isVerified && projectId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 overflow-hidden">
          <FloatingParticles />
          
          {/* Decorative Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
          </div>
          
          <header className="relative z-10 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <Link to="/" className="hover:opacity-80 transition">
                <Logo variant="white" />
              </Link>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm border border-white/20">
                Project: {projectId}
              </span>
            </div>
          </header>

          <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6"
            >
              <Lock className="w-4 h-4" />
              Beveiligd Project
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              Project: {projectId}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-blue-100 max-w-2xl mx-auto"
            >
              Voer je wachtwoord in om de voortgang te bekijken
            </motion.p>
          </div>
        </div>

        <main className="max-w-md mx-auto px-4 -mt-8 pb-16 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
          >
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wachtwoord
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Je project wachtwoord"
                    className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Je wachtwoord heb je ingesteld bij het starten van je project.
                </p>
              </div>

              {verifyError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700 font-medium">Verificatie mislukt</p>
                    <p className="text-red-600 text-sm">{verifyError}</p>
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={verifyLoading || !passwordInput.trim()}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {verifyLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifiëren...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Bekijk project
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-2">Wachtwoord vergeten?</p>
              <a 
                href="mailto:info@webstability.nl?subject=Wachtwoord vergeten"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Neem contact op met ons team
              </a>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  // Error state
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-rose-600 overflow-hidden">
          <header className="relative z-10 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <Link to="/" className="hover:opacity-80 transition">
                <Logo />
              </Link>
            </div>
          </header>
          <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Project niet gevonden</h1>
            <p className="text-red-100">
              We konden geen project vinden met ID: <strong>{projectId}</strong>
            </p>
          </div>
        </div>
        <main className="max-w-xl mx-auto px-4 -mt-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <Link
              to="/status"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Probeer een ander Project ID
            </Link>
          </motion.div>
        </main>
      </div>
    )
  }

  const progressPercentage = getProgressPercentage(project.status)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Dynamic Colors */}
      <div className={`relative bg-gradient-to-br ${phaseColors.gradient} overflow-hidden`}>
        <FloatingParticles />
        
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>
        
        <header className="relative z-10 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="hover:opacity-80 transition">
              <Logo />
            </Link>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm border border-white/20">
              {projectId}
            </span>
          </div>
        </header>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Phase Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-4">
              {STATUS_STEPS.find(s => s.key === project.status)?.icon && (
                <span className="w-5 h-5">
                  {(() => {
                    const Icon = STATUS_STEPS.find(s => s.key === project.status)?.icon || FileText
                    return <Icon className="w-5 h-5" />
                  })()}
                </span>
              )}
              {STATUS_STEPS.find(s => s.key === project.status)?.label}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {project.businessName}
            </h1>
            
            {project.package && (
              <p className="text-lg text-white/80 mb-6">
                {project.package}
              </p>
            )}
            
            {/* Progress Bar in Hero */}
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm text-white/80 mb-2">
                <span>Voortgang</span>
                <span className="font-semibold">{progressPercentage}%</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-white rounded-full shadow-lg"
                  role="progressbar"
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>

            {project.estimatedCompletion && (
              <div className="mt-6 inline-flex items-center gap-2 text-white/80">
                <Calendar className="w-5 h-5" />
                <span>Geschatte oplevering: {project.estimatedCompletion}</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Status Message */}
        {project.statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-5 ${phaseColors.light} rounded-2xl border-2 border-${phaseColors.text.replace('text-', '')}/20`}
          >
            <div className="flex items-start gap-3">
              <Sparkles className={`w-6 h-6 ${phaseColors.text} flex-shrink-0 mt-0.5`} />
              <p className="text-gray-800">{project.statusMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Progress Steps Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className={`w-6 h-6 ${phaseColors.text}`} />
            Project Voortgang
          </h2>
          
          <div className="relative">
            {/* Vertical Progress Line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200 hidden md:block" />
            
            <div className="space-y-4">
              {STATUS_STEPS.map((step, index) => {
                const status = getStepStatus(step.key)
                const Icon = step.icon
                
                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className={`flex items-start gap-4 relative ${
                      status === 'pending' ? 'opacity-50' : ''
                    }`}
                  >
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 z-10 transition-all
                      ${status === 'completed' ? 'bg-green-100 shadow-md' : ''}
                      ${status === 'current' ? `${phaseColors.light} ring-4 ${phaseColors.ring} shadow-lg` : ''}
                      ${status === 'pending' ? 'bg-gray-100' : ''}
                    `}>
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : status === 'current' ? (
                        <Icon className={`w-6 h-6 ${phaseColors.text}`} />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className={`font-semibold ${
                        status === 'current' ? phaseColors.text : 'text-gray-900'
                      }`}>
                        {step.label}
                        {status === 'current' && (
                          <span className={`ml-2 text-sm font-normal ${phaseColors.text} opacity-75`}>
                            (huidige fase)
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Updates Section */}
        {project.updates && project.updates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className={`w-6 h-6 ${phaseColors.text}`} />
              Updates
            </h2>
            <div className="space-y-6">
              {Array.from(groupUpdatesByDate(project.updates)).map(([date, updates]) => (
                <div key={date}>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{date}</span>
                    {updates.length > 1 && (
                      <span className={`${phaseColors.light} ${phaseColors.text} text-xs px-2 py-0.5 rounded-full font-medium`}>
                        {updates.length} updates
                      </span>
                    )}
                  </div>
                  <div className={`space-y-3 border-l-4 ${phaseColors.bg} pl-4`}>
                    {updates.map((update, index) => (
                      <div key={index} className="py-2">
                        <h3 className="font-semibold text-gray-900">{update.title}</h3>
                        <p className="text-gray-600 text-sm">{update.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Project & Klantgegevens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 ${phaseColors.light} rounded-xl flex items-center justify-center`}>
              <Building2 className={`w-6 h-6 ${phaseColors.text}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Projectgegevens</h2>
              <p className="text-gray-600 text-sm">Overzicht van je project</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Project Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Project
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Project ID</span>
                  <span className="font-mono text-sm font-medium text-gray-900">{projectId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Pakket</span>
                  <span className="text-sm font-medium text-gray-900">{project.package || 'Starter'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Status</span>
                  <span className={`text-sm font-medium ${phaseColors.text}`}>
                    {STATUS_STEPS.find(s => s.key === project.status)?.label}
                  </span>
                </div>
                {project.estimatedCompletion && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Geschatte oplevering</span>
                    <span className="text-sm font-medium text-gray-900">{project.estimatedCompletion}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Contactgegevens
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                {project.contactName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Naam</span>
                    <span className="text-sm font-medium text-gray-900">{project.contactName}</span>
                  </div>
                )}
                {project.contactEmail && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Email</span>
                    <span className="text-sm font-medium text-gray-900">{project.contactEmail}</span>
                  </div>
                )}
                {project.contactPhone && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Telefoon</span>
                    <span className="text-sm font-medium text-gray-900">{project.contactPhone}</span>
                  </div>
                )}
                {!project.contactName && !project.contactEmail && (
                  <p className="text-gray-400 text-sm italic">Geen gegevens beschikbaar</p>
                )}
              </div>
              <Link
                to={`/onboarding/${projectId}`}
                className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg text-sm font-medium transition ${
                  onboardingCompleted
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                }`}
              >
                <Settings className="w-4 h-4" />
                {onboardingCompleted ? 'Gegevens wijzigen' : 'Gegevens invullen'}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          {/* Onboarding Checklist - Dynamic */}
          <Link
            to={`/onboarding/${projectId}`}
            className={`bg-white rounded-xl p-5 shadow-lg border-2 transition group ${
              onboardingCompleted 
                ? 'border-green-200 hover:border-green-300 hover:shadow-xl' 
                : 'border-blue-200 hover:border-blue-300 hover:shadow-xl'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition relative ${
                onboardingCompleted ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                <FileText className={`w-6 h-6 ${onboardingCompleted ? 'text-green-600' : 'text-blue-600'}`} />
                {onboardingCompleted && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold transition ${
                    onboardingCompleted 
                      ? 'text-green-700 group-hover:text-green-800' 
                      : 'text-gray-900 group-hover:text-blue-600'
                  }`}>
                    {onboardingCompleted ? 'Onboarding voltooid' : 'Onboarding Checklist'}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  {onboardingCompleted 
                    ? onboardingDate 
                      ? `Ingevuld op ${new Date(onboardingDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}`
                      : 'Bekijk of wijzig je gegevens'
                    : 'Lever je materialen aan'
                  }
                </p>
              </div>
              <ChevronRight className={`w-5 h-5 transition group-hover:translate-x-1 ${
                onboardingCompleted ? 'text-green-400' : 'text-gray-400'
              }`} />
            </div>
          </Link>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hallo! Ik heb een vraag over mijn project ${projectId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl hover:border-green-200 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition">WhatsApp</h3>
                <p className="text-sm text-gray-600">Stel je vraag via WhatsApp</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition" />
            </div>
          </a>

          {/* Google Drive - Only if available */}
          {project.googleDriveUrl && (
            <a
              href={project.googleDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl hover:border-amber-200 transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                  <FolderOpen className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition">Bestanden</h3>
                  <p className="text-sm text-gray-600">Bekijk gedeelde bestanden</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition" />
              </div>
            </a>
          )}
        </motion.div>

        {/* Direct Chat Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`bg-gradient-to-br ${phaseColors.gradient} rounded-2xl shadow-xl p-6 md:p-8 text-white mb-8`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Direct Contact</h2>
                <p className="text-white/80 text-sm">Chat met je developer</p>
              </div>
            </div>
            {messages.filter(m => !m.read && m.from === 'developer').length > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full animate-pulse">
                {messages.filter(m => !m.read && m.from === 'developer').length} nieuw
              </span>
            )}
          </div>

          {/* Chat Window */}
          <div className="bg-white rounded-xl overflow-hidden">
            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
                  <p className="font-medium">Nog geen berichten</p>
                  <p className="text-sm">Stel je vraag en we reageren zo snel mogelijk!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === 'client' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.from === 'client'
                        ? `${phaseColors.bg} text-white rounded-br-md`
                        : 'bg-white text-gray-900 shadow-md rounded-bl-md'
                    }`}>
                      {msg.from === 'developer' && (
                        <p className={`text-xs font-semibold ${phaseColors.text} mb-1`}>Team Webstability</p>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      <p className={`text-xs mt-2 ${
                        msg.from === 'client' ? 'text-white/70' : 'text-gray-400'
                      }`}>
                        {new Date(msg.date).toLocaleString('nl-NL', { 
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Typ je vraag of opmerking..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition"
                  onKeyPress={(e) => e.key === 'Enter' && !messageLoading && sendMessage()}
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={messageLoading || !newMessage.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-5 py-3 ${phaseColors.bg} hover:opacity-90 text-white rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                >
                  {messageLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span className="hidden sm:inline">Verstuur</span>
                    </>
                  )}
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Gemiddelde reactietijd: binnen 4 uur op werkdagen
              </p>
            </div>
          </div>
        </motion.div>

        {/* Design Preview Section */}
        {project.designPreviewUrl && (project.status === 'design' || project.status === 'review') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Design Preview</h2>
                <p className="text-gray-600 text-sm">Bekijk je ontwerp en geef feedback</p>
              </div>
            </div>

            <a
              href={project.designPreviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-dashed border-purple-200 hover:border-purple-400 transition text-center group"
            >
              <ExternalLink className="w-10 h-10 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition" />
              <p className="font-semibold text-purple-900 mb-1">Bekijk design preview</p>
              <p className="text-sm text-purple-600 truncate">{project.designPreviewUrl}</p>
            </a>

            {!feedbackSent ? (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Heb je feedback of opmerkingen?
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Deel hier je feedback over het design..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={() => sendFeedback(true)}
                    disabled={feedbackLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition disabled:opacity-50 shadow-lg shadow-green-500/25"
                  >
                    <ThumbsUp className="w-5 h-5" />
                    Goedkeuren
                  </motion.button>
                  <motion.button
                    onClick={() => sendFeedback(false)}
                    disabled={feedbackLoading || !feedbackText.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition disabled:opacity-50 shadow-lg shadow-amber-500/25"
                  >
                    <Edit3 className="w-5 h-5" />
                    Feedback sturen
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 rounded-xl p-6 text-center border border-green-200">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="font-semibold text-green-900 text-lg">Bedankt voor je feedback!</p>
                <p className="text-sm text-green-700">We gaan ermee aan de slag.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Live Preview Component - Alleen in development/review fase */}
        {project.designPreviewUrl && (project.status === 'development' || project.status === 'review') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
            className="mb-8"
          >
            <PreviewLink 
              previewUrl={project.designPreviewUrl}
              projectName={project.businessName}
              phaseColor={phaseColors.bg}
            />
          </motion.div>
        )}

        {/* Feedback Module - Tijdens review fase */}
        {(project.status === 'review' || project.status === 'development') && project.designPreviewUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44 }}
            className="mb-8"
          >
            <FeedbackModule
              projectId={projectId || ''}
              previewUrl={project.designPreviewUrl}
              existingFeedback={[]}
              onSubmit={async (feedback) => {
                // Submit feedback to API
                console.log('Feedback submitted:', feedback)
                // In productie: await fetch(`/api/project/${projectId}/feedback`, ...)
              }}
            />
          </motion.div>
        )}

        {/* Payment Section - Alleen tonen als developer de betaling heeft geactiveerd */}
        {project.status === 'review' && project.paymentStatus && project.paymentStatus !== 'not_required' && project.paymentStatus !== 'paid' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46 }}
            className="mb-8"
          >
            <PaymentSection
              projectId={projectId || ''}
              packageType={project.package}
              paymentStatus={project.paymentStatus || 'pending'}
              paymentUrl={project.paymentUrl}
              designApprovedAt={project.designApprovedAt}
              onPaymentInitiated={() => {
                // Update project status to awaiting payment
                setProject({
                  ...project,
                  paymentStatus: 'awaiting_payment'
                })
              }}
            />
          </motion.div>
        )}

        {/* Task List - Altijd zichtbaar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.46 }}
          className="mb-8"
        >
          <TaskList
            tasks={DEMO_TASKS}
            currentPhase={project.status}
            phaseColor={phaseColors.bg}
            onTaskComplete={(taskId) => {
              console.log('Task completed:', taskId)
              // In productie: update task status via API
            }}
          />
        </motion.div>

        {/* Change Request Section - Only when live */}
        {project.status === 'live' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Edit3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Aanpassing aanvragen</h2>
                  <p className="text-gray-600 text-sm">Wil je iets laten wijzigen aan je website?</p>
                </div>
              </div>
              {project.revisionsTotal && (
                <div className="text-right px-4 py-2 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Revisies</p>
                  <p className={`text-lg font-bold ${
                    (project.revisionsUsed || 0) >= project.revisionsTotal 
                      ? 'text-red-600' 
                      : 'text-gray-900'
                  }`}>
                    {project.revisionsUsed || 0} / {project.revisionsTotal}
                  </p>
                </div>
              )}
            </div>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mb-6 p-4 bg-green-50 rounded-xl text-green-700 hover:bg-green-100 transition border border-green-200 group"
              >
                <Rocket className="w-5 h-5" />
                <span className="font-medium truncate flex-1">{project.liveUrl}</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition" />
              </a>
            )}

            {!changeRequestSent ? (
              <div className="space-y-4">
                <textarea
                  value={changeRequestText}
                  onChange={(e) => setChangeRequestText(e.target.value)}
                  placeholder="Beschrijf wat je wilt laten aanpassen..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioriteit</label>
                  <div className="flex gap-2">
                    {(['low', 'normal', 'urgent'] as const).map((priority) => (
                      <button
                        key={priority}
                        onClick={() => setChangePriority(priority)}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition ${
                          changePriority === priority
                            ? priority === 'urgent' 
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : priority === 'normal'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-400 bg-gray-50 text-gray-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {PRIORITY_CONFIG[priority].label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <motion.button
                  onClick={sendChangeRequest}
                  disabled={changeRequestLoading || !changeRequestText.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-50 shadow-lg shadow-blue-500/25"
                >
                  <Send className="w-5 h-5" />
                  Aanpassing aanvragen
                </motion.button>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-200">
                <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <p className="font-semibold text-blue-900 text-lg">Aanvraag ontvangen!</p>
                <p className="text-sm text-blue-700 mb-4">We nemen zo snel mogelijk contact met je op.</p>
                <button
                  onClick={() => setChangeRequestSent(false)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                >
                  Nog een aanpassing aanvragen
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Change Request History */}
        {project.changeRequests && project.changeRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Mijn Aanvragen</h2>
                <p className="text-gray-600 text-sm">
                  {project.changeRequests.length} aanvra{project.changeRequests.length === 1 ? 'ag' : 'gen'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {project.changeRequests.slice().reverse().map((request) => (
                <div
                  key={request.id}
                  className={`border-2 rounded-xl p-5 transition ${
                    request.status === 'completed'
                      ? 'border-green-200 bg-green-50'
                      : request.status === 'in_progress'
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          request.status === 'completed'
                            ? 'bg-green-200 text-green-800'
                            : request.status === 'in_progress'
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {request.status === 'completed' ? (
                            <><CheckCircle2 className="w-3 h-3" /> Afgerond</>
                          ) : request.status === 'in_progress' ? (
                            <><Loader2 className="w-3 h-3 animate-spin" /> In behandeling</>
                          ) : (
                            <><Clock className="w-3 h-3" /> In de wacht</>
                          )}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          PRIORITY_CONFIG[request.priority].bgColor
                        } ${PRIORITY_CONFIG[request.priority].color}`}>
                          {PRIORITY_CONFIG[request.priority].label}
                        </span>
                      </div>
                      <p className="text-gray-900">{request.request}</p>
                      {request.response && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-500 mb-1">Reactie developer:</p>
                          <p className="text-gray-700">{request.response}</p>
                        </div>
                      )}
                    </div>
                    <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                      {new Date(request.date).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8"
        >
          <button
            onClick={() => setShowFaq(!showFaq)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-gray-900">Veelgestelde vragen</h2>
                <p className="text-gray-600 text-sm">
                  Over de {STATUS_STEPS.find(s => s.key === project.status)?.label.toLowerCase()}-fase
                </p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform ${showFaq ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showFaq && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 space-y-4">
                  {PHASE_FAQS[project.status]?.map((faq, index) => (
                    <div key={index} className={`border-l-4 ${phaseColors.bg} pl-4 py-2`}>
                      <h4 className="font-semibold text-gray-900">{faq.question}</h4>
                      <p className="text-gray-600 text-sm mt-1">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            <span>Veilig & beveiligd</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span>Snelle reactietijd</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            <span>100+ tevreden klanten</span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
