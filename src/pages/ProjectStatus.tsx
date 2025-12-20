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
  Settings,
  Receipt,
  Download
} from 'lucide-react'
import Logo from '../components/Logo'
import PreviewLink from '../components/PreviewLink'
import FeedbackModule from '../components/FeedbackModule'
import TaskList, { type Task } from '../components/TaskList'
import PaymentSection from '../components/PaymentSection'
import DesignApprovalCard from '../components/DesignApprovalCard'
import LivePortal from '../components/LivePortal'
import DeadlineTracker from '../components/DeadlineTracker'
import type { Project, ProjectPhase, ProjectMessage, Invoice } from '../types/project'
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
  { key: 'design_approved', label: 'Goedgekeurd', icon: CreditCard, description: 'Design akkoord, wacht op betaling' },
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
    case 'design_approved':
      return { 
        bg: 'bg-blue-500', 
        text: 'text-blue-600', 
        gradient: 'from-blue-500 via-indigo-500 to-purple-500',
        light: 'bg-blue-100',
        ring: 'ring-blue-100'
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
  
  // Upload status
  const [uploadsCompleted, setUploadsCompleted] = useState(false)
  const [uploadsCompletedAt, setUploadsCompletedAt] = useState<string | null>(null)
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  
  // Password verification state
  const [isVerified, setIsVerified] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const [requiresEmailVerification, setRequiresEmailVerification] = useState(false)
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)
  const [maskedEmail, setMaskedEmail] = useState('')
  const [sendingVerificationEmail, setSendingVerificationEmail] = useState(false)
  
  const [messages, setMessages] = useState<ProjectMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [messageLoading, setMessageLoading] = useState(false)
  const [showFaq, setShowFaq] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [lookupQuery, setLookupQuery] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupResults, setLookupResults] = useState<Project[]>([])
  const [lookupError, setLookupError] = useState('')
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [chatFocused, setChatFocused] = useState(false)

  const phaseColors = project ? getPhaseColor(project.status) : getPhaseColor('onboarding')

  // Polling for real-time updates - faster when chat is focused
  useEffect(() => {
    if (!isVerified || !projectId) return

    const pollData = () => {
      fetchProject(projectId)
      fetchMessages(projectId)
      setLastRefresh(new Date())
    }

    // Poll every 5 seconds when chat is focused, otherwise every 30 seconds
    const pollInterval = chatFocused ? 5000 : 30000
    const interval = setInterval(pollData, pollInterval)
    return () => clearInterval(interval)
  }, [isVerified, projectId, chatFocused])

  // Check for existing session or password in URL
  useEffect(() => {
    if (!projectId) return
    
    const normalizedId = projectId.toUpperCase()
    const hasSession = sessionStorage.getItem(`project_auth_${normalizedId}`) === 'true'
    const pwd = searchParams.get('pwd')
    const magicSession = searchParams.get('magic_session')
    const magicError = searchParams.get('magic')
    
    // Handle magic link errors
    if (magicError === 'expired') {
      setVerifyError('Deze link is verlopen. Log in met je wachtwoord.')
      setLoading(false)
      return
    }
    if (magicError === 'invalid') {
      setVerifyError('Ongeldige link. Log in met je wachtwoord.')
      setLoading(false)
      return
    }
    
    if (hasSession) {
      // Already verified in this session
      setIsVerified(true)
      fetchProject(projectId)
      fetchMessages(projectId)
      fetchOnboardingStatus(projectId)
      setLoading(false)
      setLastRefresh(new Date())
    } else if (magicSession) {
      // Magic link session token - verify it
      verifyMagicSession(projectId, magicSession)
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

  // Check upload status from project data
  const checkUploadStatus = (projectData: Project) => {
    const onboardingData = (projectData as any).onboardingData
    if (onboardingData?.uploadsCompleted) {
      setUploadsCompleted(true)
      setUploadsCompletedAt(onboardingData.uploadsCompletedAt || null)
    }
  }

  // Mark uploads as complete
  const handleUploadsComplete = async () => {
    if (!projectId) return
    
    setUploadLoading(true)
    try {
      const response = await fetch('/api/uploads-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectId: projectId.toUpperCase(),
          message: uploadMessage 
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setUploadsCompleted(true)
        setUploadsCompletedAt(data.uploadsCompletedAt)
        setShowUploadModal(false)
        setUploadMessage('')
      }
    } catch (err) {
      console.error('Error marking uploads complete:', err)
    } finally {
      setUploadLoading(false)
    }
  }

  // Verify magic session token from magic link
  const verifyMagicSession = async (id: string, sessionToken: string) => {
    setVerifyLoading(true)
    setVerifyError('')
    
    try {
      const response = await fetch('/api/verify-magic-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: id, sessionToken })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Store session
        sessionStorage.setItem(`project_auth_${id.toUpperCase()}`, 'true')
        setIsVerified(true)
        fetchProject(id)
        fetchMessages(id)
        fetchOnboardingStatus(id)
        // Remove magic_session from URL for cleanliness
        navigate(`/project/${id}`, { replace: true })
      } else {
        setVerifyError(data.message || 'Ongeldige of verlopen link. Log in met je wachtwoord.')
        setIsVerified(false)
      }
    } catch (err) {
      console.error('Magic session verify error:', err)
      setVerifyError('Er ging iets mis. Probeer in te loggen met je wachtwoord.')
    } finally {
      setVerifyLoading(false)
      setLoading(false)
    }
  }

  // Verify password against API
  const verifyPassword = async (id: string, password: string) => {
    setVerifyLoading(true)
    setVerifyError('')
    setRequiresEmailVerification(false)
    
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
      } else if (data.requiresEmailVerification) {
        // Email not verified yet
        setRequiresEmailVerification(true)
        setMaskedEmail(data.email || '')
        setVerifyError(data.message || 'Je e-mailadres is nog niet geverifieerd.')
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

  // Send verification email
  const sendVerificationEmail = async () => {
    if (!projectId) return
    setSendingVerificationEmail(true)
    
    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setEmailVerificationSent(true)
        if (data.email) setMaskedEmail(data.email)
      } else {
        setVerifyError(data.message || 'Kon verificatie-email niet versturen.')
      }
    } catch (err) {
      console.error('Send verification email error:', err)
      setVerifyError('Er ging iets mis bij het versturen van de verificatie-email.')
    } finally {
      setSendingVerificationEmail(false)
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
        checkUploadStatus(data)
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
      
      // Als goedgekeurd: update project met designApprovedAt, paymentStatus en status naar design_approved
      if (approved && project) {
        setProject({
          ...project,
          status: 'design_approved', // Verander fase naar design_approved
          designApprovedAt: data.designApprovedAt || new Date().toISOString(),
          paymentStatus: 'awaiting_payment'
        })
      }
    } catch (err) {
      console.error('Feedback error:', err)
    }
    setFeedbackLoading(false)
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <FloatingParticles />
          
          <header className="relative z-10 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <Link to="/" className="hover:opacity-80 transition">
                <Logo variant="white" />
              </Link>
            </div>
          </header>

          <div className="relative z-10 max-w-4xl mx-auto px-4 pt-12 pb-20 sm:pt-16 sm:pb-24 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6"
            >
              <Search className="w-4 h-4" />
              Project Status
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              Bekijk de voortgang van je project
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto"
            >
              Vul je e-mailadres of Project ID in om real-time updates te zien
            </motion.p>
          </div>
        </div>

        <main className="max-w-xl mx-auto px-4 -mt-12 pb-12 sm:pb-16 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-700/50 p-6 sm:p-8"
          >
            <form onSubmit={handleLookup}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  E-mailadres of Project ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    placeholder="jouw@email.nl of WS-MJ1G8LH1"
                    className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-gray-500"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Je vindt je Project ID in de welkomstmail die je hebt ontvangen.
                </p>
              </div>

              {lookupError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2"
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
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-500 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
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
                className="mt-6 border-t border-gray-700/50 pt-6"
              >
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  Meerdere projecten gevonden ({lookupResults.length})
                </h3>
                <div className="space-y-2">
                  {lookupResults.map((p) => (
                    <Link
                      key={p.projectId}
                      to={`/status/${p.projectId}`}
                      className="block p-4 bg-gray-900/50 hover:bg-gray-700/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white group-hover:text-blue-400 transition">{p.businessName}</p>
                          <p className="text-xs text-gray-500">{p.projectId}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            p.status === 'live' ? 'bg-green-500/20 text-green-400' :
                            p.status === 'review' ? 'bg-cyan-500/20 text-cyan-400' :
                            p.status === 'development' ? 'bg-purple-500/20 text-purple-400' :
                            p.status === 'design' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {p.status}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition" />
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
            className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              <span>SSL beveiligd</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              <span>24/7 toegang</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              <span>Real-time updates</span>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  // Loading state with skeleton
  if (loading) {
    return <ProjectStatusSkeleton />
  }

  // Password verification required
  if (!isVerified && projectId) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Background with gradient and blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Main gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20" />
          
          {/* Animated gradient blobs */}
          <motion.div 
            className="absolute top-0 right-0 w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] bg-gradient-to-br from-blue-500/25 via-indigo-500/15 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] bg-gradient-to-tr from-purple-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
            animate={{ 
              scale: [1, 1.08, 1],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Decorative rings - hidden on mobile */}
          <div className="hidden sm:block absolute top-20 right-20 w-32 h-32 border border-blue-400/20 rounded-full" />
          <div className="hidden sm:block absolute top-24 right-24 w-24 h-24 border border-indigo-500/10 rounded-full" />
          <div className="hidden sm:block absolute bottom-32 left-20 w-20 h-20 border border-purple-400/20 rounded-full" />
          
          {/* Floating particles */}
          <FloatingParticles />
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-white/10 bg-gray-900/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
            <Link to="/" className="hover:opacity-80 transition">
              <Logo variant="white" />
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="px-2.5 py-1 sm:px-4 sm:py-2 bg-blue-500/10 backdrop-blur-sm rounded-full text-blue-400 text-xs sm:text-sm border border-blue-500/20 font-medium flex items-center gap-1.5">
                <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Beveiligd</span>
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-8 sm:py-12">
          <div className="w-full max-w-md">
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
              >
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">Beveiligd Project</span>
              </motion.div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                Bekijk je{' '}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">projectvoortgang</span>
              </h1>
              
              <p className="text-sm sm:text-base text-gray-400 max-w-sm mx-auto">
                Voer je wachtwoord in om de status van je project te bekijken.
              </p>
            </motion.div>

            {/* Login Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-700/50 p-5 sm:p-8 shadow-2xl"
            >
              {/* Project ID Badge */}
              <div className="flex items-center justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/60 rounded-xl border border-gray-700/50">
                  <FolderOpen className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm text-gray-300">Project: </span>
                  <span className="text-sm font-semibold text-white">{projectId}</span>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Wachtwoord
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Je project wachtwoord"
                      className="w-full pl-12 pr-12 py-3.5 sm:py-4 bg-gray-900/60 border-2 border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition text-white placeholder-gray-500 text-sm sm:text-base"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition p-1"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    Dit wachtwoord heb je ontvangen bij het starten van je project.
                  </p>
                </div>

                {/* Error Message */}
                {verifyError && !requiresEmailVerification && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-medium text-sm">Verificatie mislukt</p>
                      <p className="text-red-400/80 text-xs sm:text-sm">{verifyError}</p>
                    </div>
                  </motion.div>
                )}

                {/* Email Verification Required */}
                {requiresEmailVerification && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-amber-400 font-medium text-sm">E-mail verificatie vereist</p>
                        <p className="text-amber-400/80 text-xs sm:text-sm mt-1">
                          {emailVerificationSent ? (
                            <>Verificatie-email verstuurd naar <strong>{maskedEmail}</strong>. Check je inbox (en spam folder).</>
                          ) : (
                            <>Je moet eerst je e-mailadres verifiëren voordat je kunt inloggen.</>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    {!emailVerificationSent && (
                      <button
                        type="button"
                        onClick={sendVerificationEmail}
                        disabled={sendingVerificationEmail}
                        className="w-full py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-medium rounded-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                      >
                        {sendingVerificationEmail ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Versturen...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Stuur verificatie-email</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    {emailVerificationSent && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-xs sm:text-sm">Verificatie-email verstuurd!</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={verifyLoading || !passwordInput.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-indigo-500 transition shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {verifyLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifiëren...</span>
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-5 h-5" />
                      <span>Bekijk project</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Forgot Password */}
              <div className="mt-6 pt-5 border-t border-gray-700/50 text-center">
                <p className="text-xs sm:text-sm text-gray-500 mb-2">Wachtwoord vergeten?</p>
                <Link 
                  to="/wachtwoord-vergeten"
                  className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 font-medium transition inline-flex items-center gap-1"
                >
                  <Mail className="w-4 h-4" />
                  Vraag een nieuw wachtwoord aan
                </Link>
              </div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6"
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <span>SSL beveiligd</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <span>24/7 toegang</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Star className="w-4 h-4 text-amber-400" />
                </div>
                <span>Real-time updates</span>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    )
  }

  // Error state
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
        <div className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-rose-600/10 to-orange-600/20" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-[120px]" />
          </div>
          
          <header className="relative z-10 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <Link to="/" className="hover:opacity-80 transition">
                <Logo variant="white" />
              </Link>
            </div>
          </header>
          <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 sm:py-16 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <AlertCircle className="w-10 h-10 text-red-400" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Project niet gevonden</h1>
            <p className="text-gray-400">
              We konden geen project vinden met ID: <code className="text-red-400 bg-red-500/10 px-2 py-1 rounded">{projectId}</code>
            </p>
          </div>
        </div>
        <main className="max-w-xl mx-auto px-4 -mt-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6 sm:p-8 text-center"
          >
            <p className="text-gray-400 mb-6">Controleer of je Project ID correct is of neem contact met ons op.</p>
            <Link
              to="/status"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-500 transition shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      {/* Hero Section with Dynamic Colors */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${phaseColors.gradient} opacity-20`} />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <FloatingParticles />
        
        <header className="relative z-10 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="hover:opacity-80 transition">
              <Logo variant="white" />
            </Link>
            <div className="flex items-center gap-3">
              {lastRefresh && (
                <span className="hidden sm:block text-xs text-white/50">
                  Bijgewerkt: {lastRefresh.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs sm:text-sm border border-white/20 font-medium">
                {projectId}
              </span>
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 sm:py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Phase Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-4`}>
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
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              {project.businessName}
            </h1>
            
            {project.package && (
              <p className="text-base sm:text-lg text-white/70 mb-6">
                {project.package}
              </p>
            )}
            
            {/* Progress Bar in Hero */}
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>Voortgang</span>
                <span className="font-semibold text-white">{progressPercentage}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${phaseColors.gradient} rounded-full shadow-lg`}
                  role="progressbar"
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>

            {project.estimatedCompletion && (
              <div className="mt-6 inline-flex items-center gap-2 text-white/70">
                <Calendar className="w-5 h-5" />
                <span>Geschatte oplevering: <span className="text-white font-medium">{project.estimatedCompletion}</span></span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
        {/* Deadline Tracker - Timeline met countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <DeadlineTracker
            createdAt={project.createdAt}
            status={project.status}
            estimatedCompletion={project.estimatedCompletion}
            phaseDeadlines={project.phaseDeadlines}
            packageType={project.package}
          />
        </motion.div>

        {/* Status Message */}
        {project.statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 sm:p-5 bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 ${phaseColors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <p className="text-gray-300 pt-2">{project.statusMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Wat te verwachten - Per fase uitleg voor de klant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 sm:p-5 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-blue-500/20"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                Wat kun je nu verwachten?
              </h3>
              {(() => {
                const phaseInfo: Record<ProjectPhase, { text: string; action?: string }> = {
                  onboarding: {
                    text: 'We verzamelen nu alle informatie over jouw bedrijf. Zodra je de onboarding hebt ingevuld, gaan we aan de slag met het design.',
                    action: 'Vul de onboarding in als je dat nog niet gedaan hebt via de link in je e-mail.'
                  },
                  design: {
                    text: 'We werken aan het design van jouw website. Je ontvangt binnenkort een preview om te bekijken. Geef feedback via de chat hieronder.',
                    action: 'Houd je berichten in de gaten voor de design preview.'
                  },
                  design_approved: {
                    text: 'Super! Je hebt het design goedgekeurd. Na ontvangst van de betaling starten we direct met het bouwen van je website.',
                    action: 'Rond de betaling af via de link in je e-mail.'
                  },
                  development: {
                    text: 'We zijn druk bezig met het bouwen van je website! Je ontvangt binnenkort een link om de staging versie te bekijken.',
                    action: 'Nog even geduld - we houden je op de hoogte.'
                  },
                  review: {
                    text: 'Je website is klaar om te bekijken! Test alle paginas en functies. Geef feedback via de chat of keur het goed om live te gaan.',
                    action: 'Bekijk de preview en geef je feedback.'
                  },
                  live: {
                    text: 'Gefeliciteerd! 🎉 Je website is live en bereikbaar voor de wereld. Bij vragen kun je altijd contact opnemen via de chat.',
                    action: 'Bekijk je live website via de link hierboven.'
                  },
                }
                const info = phaseInfo[project.status] || phaseInfo.onboarding
                return (
                  <>
                    <p className="text-gray-300 text-sm mb-2">{info.text}</p>
                    {info.action && (
                      <p className="text-blue-400 text-sm font-medium">👉 {info.action}</p>
                    )}
                  </>
                )
              })()}
            </div>
          </div>
        </motion.div>

        {/* Progress Steps Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6 md:p-8 mb-6"
        >
          <h2 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock className={`w-5 h-5 sm:w-6 sm:h-6 ${phaseColors.text}`} />
            Project Voortgang
          </h2>
          
          <div className="relative">
            {/* Vertical Progress Line */}
            <div className="absolute left-5 sm:left-6 top-6 bottom-6 w-0.5 bg-gray-700 hidden md:block" />
            
            <div className="space-y-3 sm:space-y-4">
              {STATUS_STEPS.map((step, index) => {
                const status = getStepStatus(step.key)
                const Icon = step.icon
                
                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className={`flex items-start gap-3 sm:gap-4 relative ${
                      status === 'pending' ? 'opacity-40' : ''
                    }`}
                  >
                    <div className={`
                      w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 z-10 transition-all
                      ${status === 'completed' ? 'bg-green-500/20 ring-2 ring-green-500/30' : ''}
                      ${status === 'current' ? `${phaseColors.bg} ring-4 ring-white/10 shadow-lg` : ''}
                      ${status === 'pending' ? 'bg-gray-700/50' : ''}
                    `}>
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                      ) : status === 'current' ? (
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      ) : (
                        <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 pt-1 sm:pt-2">
                      <h3 className={`font-semibold text-sm sm:text-base ${
                        status === 'current' ? 'text-white' : status === 'completed' ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {step.label}
                        {status === 'current' && (
                          <span className="ml-2 text-xs font-normal text-white/60">
                            (huidige fase)
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm">{step.description}</p>
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
            className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6 md:p-8 mb-6"
          >
            <h2 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 ${phaseColors.text}`} />
              Updates
            </h2>
            <div className="space-y-6">
              {Array.from(groupUpdatesByDate(project.updates)).map(([date, updates]) => (
                <div key={date}>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{date}</span>
                    {updates.length > 1 && (
                      <span className={`${phaseColors.bg} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
                        {updates.length} updates
                      </span>
                    )}
                  </div>
                  <div className={`space-y-3 border-l-2 ${phaseColors.bg} pl-4`}>
                    {updates.map((update, index) => (
                      <div key={index} className="py-2">
                        <h3 className="font-semibold text-white">{update.title}</h3>
                        <p className="text-gray-400 text-sm">{update.message}</p>
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
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6 md:p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${phaseColors.bg} rounded-lg sm:rounded-xl flex items-center justify-center`}>
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Projectgegevens</h2>
              <p className="text-gray-400 text-sm">Overzicht van je project</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Project Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-300 flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4" />
                Project
              </h3>
              <div className="bg-gray-900/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Project ID</span>
                  <span className="font-mono text-sm font-medium text-white">{projectId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Pakket</span>
                  <span className="text-sm font-medium text-white">{project.package || 'Starter'}</span>
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
                    <span className="text-sm font-medium text-white">{project.estimatedCompletion}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-300 flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                Contactgegevens
              </h3>
              <div className="bg-gray-900/50 rounded-xl p-4 space-y-3">
                {project.contactName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Naam</span>
                    <span className="text-sm font-medium text-white">{project.contactName}</span>
                  </div>
                )}
                {project.contactEmail && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Email</span>
                    <span className="text-sm font-medium text-white truncate ml-4">{project.contactEmail}</span>
                  </div>
                )}
                {project.contactPhone && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Telefoon</span>
                    <span className="text-sm font-medium text-white">{project.contactPhone}</span>
                  </div>
                )}
                {!project.contactName && !project.contactEmail && (
                  <p className="text-gray-500 text-sm italic">Geen gegevens beschikbaar</p>
                )}
              </div>
              <Link
                to={`/intake/${projectId}`}
                className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg text-sm font-medium transition ${
                  onboardingCompleted
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : `${phaseColors.bg} text-white hover:opacity-90`
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
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6"
        >
          {/* Onboarding Checklist - Dynamic */}
          <Link
            to={`/intake/${projectId}`}
            className={`bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 sm:p-5 border transition group ${
              onboardingCompleted 
                ? 'border-green-500/30 hover:border-green-500/50 hover:bg-gray-800/80' 
                : 'border-blue-500/30 hover:border-blue-500/50 hover:bg-gray-800/80'
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition relative ${
                onboardingCompleted ? 'bg-green-500/20' : 'bg-blue-500/20'
              }`}>
                <FileText className={`w-5 h-5 sm:w-6 sm:h-6 ${onboardingCompleted ? 'text-green-400' : 'text-blue-400'}`} />
                {onboardingCompleted && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-sm sm:text-base transition ${
                  onboardingCompleted 
                    ? 'text-green-400' 
                    : 'text-white'
                }`}>
                  {onboardingCompleted ? 'Onboarding voltooid' : 'Onboarding Checklist'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {onboardingCompleted 
                    ? onboardingDate 
                      ? `Ingevuld op ${new Date(onboardingDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}`
                      : 'Bekijk of wijzig je gegevens'
                    : 'Lever je materialen aan'
                  }
                </p>
              </div>
              <ChevronRight className={`w-5 h-5 transition group-hover:translate-x-1 flex-shrink-0 ${
                onboardingCompleted ? 'text-green-500/50' : 'text-gray-600'
              }`} />
            </div>
          </Link>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hallo! Ik heb een vraag over mijn project ${projectId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-gray-700/50 hover:border-green-500/50 hover:bg-gray-800/80 transition group"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm sm:text-base group-hover:text-green-400 transition">WhatsApp</h3>
                <p className="text-xs sm:text-sm text-gray-500">Stel je vraag via WhatsApp</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-green-400 transition flex-shrink-0" />
            </div>
          </a>

          {/* Google Drive - Only if available */}
          {project.googleDriveUrl && (
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-gray-700/50">
              {/* Drive Link */}
              <a
                href={project.googleDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-80 transition group"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                    <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm sm:text-base group-hover:text-blue-400 transition">Bestanden uploaden</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Logo, foto's en teksten</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition flex-shrink-0" />
                </div>
              </a>
              
              {/* Upload Complete Status / Button */}
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                {uploadsCompleted ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Bestanden aangeleverd</span>
                    {uploadsCompletedAt && (
                      <span className="text-xs text-gray-500 ml-auto">
                        {new Date(uploadsCompletedAt).toLocaleDateString('nl-NL')}
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-gray-500 mb-3">
                      Upload je bestanden naar de juiste mappen en klik hieronder als je klaar bent.
                    </p>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Uploads klaar melden
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Upload Complete Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowUploadModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Uploads klaar?</h3>
                  <p className="text-gray-400 text-sm">
                    Laat ons weten dat je bestanden klaar staan. We gaan dan direct voor je aan de slag!
                  </p>
                </div>

                {/* Checklist */}
                <div className="bg-gray-900/50 rounded-xl p-4 mb-6 space-y-2">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-3">Controleer of je hebt geüpload:</p>
                  {[
                    { icon: '🎨', label: 'Ontwerp', desc: 'Logo & huisstijl' },
                    { icon: '📝', label: 'Content', desc: 'Teksten voor website' },
                    { icon: '📸', label: 'Afbeeldingen', desc: "Foto's van je bedrijf" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-white font-medium">{item.label}</span>
                      <span className="text-gray-500">• {item.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Optional Message */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-2">
                    Optioneel bericht <span className="text-gray-600">(bijv. wat je nog mist)</span>
                  </label>
                  <textarea
                    value={uploadMessage}
                    onChange={(e) => setUploadMessage(e.target.value)}
                    placeholder="Bijv. 'De foto's van ons team volgen later'"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={handleUploadsComplete}
                    disabled={uploadLoading}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {uploadLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Bevestigen
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Direct Chat Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 overflow-hidden mb-6"
        >
          <div className={`bg-gradient-to-r ${phaseColors.gradient} p-4 sm:p-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Direct Contact</h2>
                  <p className="text-white/70 text-xs sm:text-sm">Chat met je developer</p>
                </div>
              </div>
              {messages.filter(m => !m.read && m.from === 'developer').length > 0 && (
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-red-500 text-white text-xs sm:text-sm font-bold rounded-full animate-pulse">
                  {messages.filter(m => !m.read && m.from === 'developer').length} nieuw
                </span>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div>
            {/* Messages */}
            <div className="h-64 sm:h-72 overflow-y-auto p-4 space-y-3 bg-gray-900/50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 mb-2 opacity-50" />
                  <p className="font-medium text-sm sm:text-base">Nog geen berichten</p>
                  <p className="text-xs sm:text-sm text-center">Stel je vraag en we reageren zo snel mogelijk!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === 'client' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 ${
                      msg.from === 'client'
                        ? `bg-gradient-to-r ${phaseColors.gradient} text-white rounded-br-md`
                        : 'bg-gray-800 text-white border border-gray-700 rounded-bl-md'
                    }`}>
                      {msg.from === 'developer' && (
                        <p className={`text-xs font-semibold ${phaseColors.text} mb-1`}>Team Webstability</p>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      <p className={`text-xs mt-2 ${
                        msg.from === 'client' ? 'text-white/70' : 'text-gray-500'
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
            <div className="p-3 sm:p-4 border-t border-gray-700/50 bg-gray-800/80">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Typ je vraag of opmerking..."
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 text-sm sm:text-base transition"
                  onKeyPress={(e) => e.key === 'Enter' && !messageLoading && sendMessage()}
                  onFocus={() => setChatFocused(true)}
                  onBlur={() => setChatFocused(false)}
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={messageLoading || !newMessage.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r ${phaseColors.gradient} hover:opacity-90 text-white rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
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

        {/* Design Approval Card - Prominent approval section */}
        {project.designPreviewUrl && (project.status === 'design' || project.status === 'review') && !project.designApprovedAt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="mb-6"
          >
            <DesignApprovalCard
              projectId={projectId || ''}
              previewUrl={project.designPreviewUrl}
              designApprovedAt={project.designApprovedAt}
              paymentStatus={project.paymentStatus}
              onApprove={async () => {
                await sendFeedback(true)
              }}
              onRequestChanges={async (feedbackText) => {
                setFeedbackText(feedbackText)
                await sendFeedback(false)
              }}
            />
          </motion.div>
        )}

        {/* Design Approved Banner - Shows when design is approved */}
        {project.designApprovedAt && (project.status === 'design' || project.status === 'review') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white mb-1">Design Goedgekeurd!</h3>
                  <p className="text-sm text-gray-300 mb-2">
                    Je hebt het design goedgekeurd op {new Date(project.designApprovedAt).toLocaleDateString('nl-NL', { 
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}.
                  </p>
                  {project.paymentStatus === 'awaiting_payment' && (
                    <p className="text-sm text-green-400 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Volgende stap: betaling afronden om live te gaan
                    </p>
                  )}
                  {project.paymentStatus === 'paid' && (
                    <p className="text-sm text-green-400 flex items-center gap-2">
                      <Rocket className="w-4 h-4" />
                      Betaling ontvangen - we gaan aan de slag!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Design Preview Section */}
        {project.designPreviewUrl && (project.status === 'design' || project.status === 'review') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6 md:p-8 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Design Preview</h2>
                <p className="text-gray-400 text-xs sm:text-sm">Bekijk je ontwerp en geef feedback</p>
              </div>
            </div>

            <a
              href={project.designPreviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-6 p-4 sm:p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition text-center group"
            >
              <ExternalLink className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition" />
              <p className="font-semibold text-white mb-1 text-sm sm:text-base">Bekijk design preview</p>
              <p className="text-xs sm:text-sm text-purple-400 truncate">{project.designPreviewUrl}</p>
            </a>

            {!feedbackSent ? (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  Heb je feedback of opmerkingen?
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Deel hier je feedback over het design..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500 transition text-sm"
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={() => sendFeedback(true)}
                    disabled={feedbackLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition disabled:opacity-50 shadow-lg shadow-green-500/25 text-sm sm:text-base"
                  >
                    <ThumbsUp className="w-5 h-5" />
                    Goedkeuren
                  </motion.button>
                  <motion.button
                    onClick={() => sendFeedback(false)}
                    disabled={feedbackLoading || !feedbackText.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-xl transition disabled:opacity-50 shadow-lg shadow-amber-500/25 text-sm sm:text-base"
                  >
                    <Edit3 className="w-5 h-5" />
                    Feedback sturen
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="bg-green-500/10 rounded-xl p-6 text-center border border-green-500/30">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto mb-3" />
                <p className="font-semibold text-white text-base sm:text-lg">Bedankt voor je feedback!</p>
                <p className="text-sm text-green-400">We gaan ermee aan de slag.</p>
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

        {/* Payment Section - Alleen tonen in design_approved fase wanneer betaling nog niet gedaan is */}
        {project.status === 'design_approved' && project.paymentStatus !== 'paid' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46 }}
            className="mb-6"
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

        {/* Invoices Section - Show if there are invoices */}
        {project.invoices && project.invoices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.47 }}
            className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6 md:p-8 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Facturen</h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {project.invoices.length} factuur{project.invoices.length !== 1 ? 'en' : ''}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {project.invoices.map((invoice: Invoice) => (
                <div
                  key={invoice.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition ${
                    invoice.status === 'paid'
                      ? 'bg-green-500/10 border-green-500/30'
                      : invoice.status === 'overdue'
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-gray-900/50 border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      invoice.status === 'paid'
                        ? 'bg-green-500/20'
                        : invoice.status === 'overdue'
                        ? 'bg-red-500/20'
                        : 'bg-gray-700'
                    }`}>
                      {invoice.status === 'paid' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : invoice.status === 'overdue' ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <CreditCard className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm sm:text-base">{invoice.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(invoice.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-white">€{invoice.amount.toFixed(2)}</p>
                      <span className={`text-xs font-medium ${
                        invoice.status === 'paid'
                          ? 'text-green-400'
                          : invoice.status === 'overdue'
                          ? 'text-red-400'
                          : invoice.status === 'sent'
                          ? 'text-blue-400'
                          : 'text-gray-400'
                      }`}>
                        {invoice.status === 'paid' ? 'Betaald' :
                         invoice.status === 'overdue' ? 'Te laat' :
                         invoice.status === 'sent' ? 'Openstaand' :
                         invoice.status === 'draft' ? 'Concept' : 'Geannuleerd'}
                      </span>
                    </div>
                    {invoice.paymentUrl && invoice.status !== 'paid' && (
                      <a
                        href={invoice.paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-500 hover:to-indigo-500 transition"
                      >
                        Betalen
                      </a>
                    )}
                    {invoice.status === 'paid' && (
                      <button className="p-2 text-gray-400 hover:text-white transition">
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Notice */}
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-sm text-blue-400 flex items-start gap-2">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Betalingen worden veilig afgehandeld via Mollie. Je betaalt pas na goedkeuring van het design.
                </span>
              </p>
            </div>
          </motion.div>
        )}

        {/* Task List - Altijd zichtbaar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.46 }}
          className="mb-6"
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

        {/* Live Portal - Complete klantportaal voor live projecten */}
        {project.status === 'live' && (
          <LivePortal
            project={project}
            onSendMessage={async (message) => {
              if (!projectId || !message.trim()) return
              try {
                const response = await fetch(`/api/project/${projectId}/message`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    message,
                    from: 'client'
                  })
                })
                const data = await response.json()
                if (data.success) {
                  setMessages(prev => [...prev, data.message])
                }
              } catch (err) {
                console.error('Send message error:', err)
              }
            }}
            onUpdateProject={(updates) => {
              setProject(prev => prev ? { ...prev, ...updates } : null)
            }}
          />
        )}

        {/* Change Request History */}
        {project.changeRequests && project.changeRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6 md:p-8 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Mijn Aanvragen</h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {project.changeRequests.length} aanvra{project.changeRequests.length === 1 ? 'ag' : 'gen'}
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {project.changeRequests.slice().reverse().map((request) => (
                <div
                  key={request.id}
                  className={`border rounded-xl p-4 sm:p-5 transition ${
                    request.status === 'completed'
                      ? 'border-green-500/30 bg-green-500/10'
                      : request.status === 'in_progress'
                      ? 'border-blue-500/30 bg-blue-500/10'
                      : 'border-gray-700 bg-gray-900/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                          request.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : request.status === 'in_progress'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {request.status === 'completed' ? (
                            <><CheckCircle2 className="w-3 h-3" /> Afgerond</>
                          ) : request.status === 'in_progress' ? (
                            <><Loader2 className="w-3 h-3 animate-spin" /> In behandeling</>
                          ) : (
                            <><Clock className="w-3 h-3" /> In de wacht</>
                          )}
                        </span>
                        <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                          request.priority === 'urgent'
                            ? 'bg-red-500/20 text-red-400'
                            : request.priority === 'normal'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {PRIORITY_CONFIG[request.priority].label}
                        </span>
                      </div>
                      <p className="text-white text-sm sm:text-base">{request.request}</p>
                      {request.response && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <p className="text-xs font-medium text-gray-500 mb-1">Reactie developer:</p>
                          <p className="text-gray-300 text-sm">{request.response}</p>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap">
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
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6 md:p-8"
        >
          <button
            onClick={() => setShowFaq(!showFaq)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              </div>
              <div className="text-left">
                <h2 className="text-lg sm:text-xl font-bold text-white">Veelgestelde vragen</h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Over de {STATUS_STEPS.find(s => s.key === project.status)?.label.toLowerCase()}-fase
                </p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-500 transition-transform flex-shrink-0 ${showFaq ? 'rotate-180' : ''}`} />
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
                    <div key={index} className={`border-l-2 ${phaseColors.bg} pl-4 py-2`}>
                      <h4 className="font-semibold text-white text-sm sm:text-base">{faq.question}</h4>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">{faq.answer}</p>
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
          className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <span>Veilig & beveiligd</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span>Snelle reactietijd</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <span>100+ tevreden klanten</span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
