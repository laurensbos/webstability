import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lock, 
  LogOut, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Briefcase,
  Palette,
  FileText,
  ChevronDown,
  ChevronUp,
  Trash2,
  Download,
  Search,
  Edit3,
  Save,
  X,
  CreditCard,
  Send,
  Copy,
  Check as CheckIcon,
  ClipboardList,
  Activity,
  RefreshCw,
  Clock,
  Rocket,
  MessageSquare,
  ExternalLink,
  Users,
  LayoutDashboard,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react'
import ProjectEditModal from '../components/ProjectEditModal'
import type { Project as ProjectType } from '../types/project'

// Types
interface Submission {
  id: string
  timestamp: string
  package: string
  websiteType: string
  industry: string
  domain: string
  domainStatus: string
  businessName: string
  tagline: string
  description: string
  primaryColor: string
  style: string
  exampleSites: string
  pages: string[]
  content: string
  contactName: string
  contactEmail: string
  contactPhone: string
  remarks: string
}

interface Project {
  projectId: string
  businessName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  package: string
  status: 'onboarding' | 'design' | 'development' | 'review' | 'live'
  statusMessage: string
  estimatedCompletion: string
  updates: ProjectUpdate[]
  createdAt: string
  // Nieuwe velden
  revisionsUsed?: number
  revisionsTotal?: number
  googleDriveUrl?: string
  designPreviewUrl?: string
  liveUrl?: string
  messages?: Array<{
    id: string
    date: string
    from: 'client' | 'developer'
    message: string
    read: boolean
  }>
  changeRequests?: Array<{
    id: string
    date: string
    request: string
    priority: 'low' | 'normal' | 'urgent'
    status: 'pending' | 'in_progress' | 'completed'
    response?: string
  }>
}

interface ProjectUpdate {
  date: string
  title: string
  message: string
}

interface OnboardingSubmission {
  projectId: string
  businessName: string
  contactName: string
  contactEmail: string
  aboutText: string
  services: string
  uniqueSellingPoints: string
  hasLogo: string
  logoDescription: string
  brandColors: string
  brandFonts: string
  photos: string
  socialMedia: string
  competitors: string
  extraWishes: string
  submittedAt: string
}

interface ServiceRequest {
  // Common fields
  requestId: string
  type: 'drone' | 'logo'
  status: string
  createdAt: string
  updatedAt?: string
  
  // Contact
  contactName: string
  contactEmail: string
  contactPhone?: string
  businessName?: string
  additionalNotes?: string
  
  // Drone specific
  locationType?: string
  locationAddress?: string
  locationCity?: string
  locationNotes?: string
  captureType?: string[]
  duration?: string
  preferredDate?: string
  preferredTime?: string
  flexibleSchedule?: boolean
  confirmedDate?: string
  confirmedTime?: string
  
  // Logo specific
  industry?: string
  businessDescription?: string
  hasExistingLogo?: boolean
  style?: string[]
  colors?: string[]
  avoidColors?: string[]
  inspiration?: string
  mustHave?: string
  mustAvoid?: string
  preferCall?: boolean
  concepts?: string[]
  selectedConcept?: string
  
  // Admin/payment
  adminNotes?: string
  price?: number
  paymentStatus?: string
  paymentLink?: string
  paymentId?: string
  
  // Legacy (backwards compat)
  id?: string
  service?: string
  serviceName?: string
  name?: string
  email?: string
  phone?: string
  company?: string
  remarks?: string
}

const DASHBOARD_PASSWORD = 'N45eqtu2!jz8j0v'
const STORAGE_KEY = 'webstability_submissions'
const AUTH_KEY = 'webstability_dashboard_auth'

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Submission>>({})
  const [saveMessage, setSaveMessage] = useState('')
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'overzicht' | 'klanten' | 'projecten' | 'aanvragen' | 'onboarding' | 'diensten'>('overzicht')
  
  // Projects state
  const [projects, setProjects] = useState<Project[]>([])
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  
  // Onboarding submissions state
  const [onboardingSubmissions, setOnboardingSubmissions] = useState<OnboardingSubmission[]>([])
  const [selectedOnboarding, setSelectedOnboarding] = useState<OnboardingSubmission | null>(null)
  
  // Service requests state
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [updatingServiceId, setUpdatingServiceId] = useState<string | null>(null)
  const [servicePaymentLoading, setServicePaymentLoading] = useState<string | null>(null)
  
  // Payment link states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [paymentSubmission, setPaymentSubmission] = useState<Submission | null>(null)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentLink, setPaymentLink] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)
  const [customAmount, setCustomAmount] = useState('')
  const [includeSetup, setIncludeSetup] = useState(true)
  
  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteType, setDeleteType] = useState<'project' | 'onboarding' | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Template email states
  const [templateModalOpen, setTemplateModalOpen] = useState(false)
  const [templateProject, setTemplateProject] = useState<Project | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<'welcome' | 'materials_reminder' | 'design_ready' | 'live_announcement' | 'general_update'>('welcome')
  const [customSubject, setCustomSubject] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [templateLoading, setTemplateLoading] = useState(false)
  const [templateSent, setTemplateSent] = useState(false)
  
  // Template opties
  const TEMPLATE_OPTIONS = [
    { key: 'welcome', label: '👋 Welkom', description: 'Welkomstmail met project link' },
    { key: 'materials_reminder', label: '📎 Materialen herinnering', description: 'Vraag om content/materialen' },
    { key: 'design_ready', label: '🎨 Design klaar', description: 'Notificatie dat ontwerp klaar is' },
    { key: 'live_announcement', label: '🚀 Website live!', description: 'Felicitatiemail dat website live is' },
    { key: 'general_update', label: '📝 Eigen bericht', description: 'Schrijf een eigen update' }
  ] as const

  // Pakket prijzen
  const PACKAGE_PRICES: Record<string, { monthly: number; setup: number }> = {
    starter: { monthly: 79, setup: 99 },
    professional: { monthly: 148, setup: 179 },
    business: { monthly: 247, setup: 239 },
    webshop: { monthly: 247, setup: 299 }
  }

  // Check if already authenticated
  useEffect(() => {
    const auth = sessionStorage.getItem(AUTH_KEY)
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  // Load submissions
  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions()
      loadProjects()
      loadOnboardingSubmissions()
      loadServiceRequests()
    }
  }, [isAuthenticated])

  const loadSubmissions = async () => {
    try {
      // Eerst laden van server
      const response = await fetch('/api/submissions')
      const contentType = response.headers.get('content-type')
      
      if (response.ok && contentType && contentType.includes('application/json')) {
        const serverData = await response.json()
        
        // Zorg dat serverData een array is
        if (!Array.isArray(serverData)) {
          throw new Error('Server returned non-array data')
        }
        
        // Ook localStorage checken voor lokale data die nog niet gesync is
        const stored = localStorage.getItem(STORAGE_KEY)
        let localData: Submission[] = []
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            localData = Array.isArray(parsed) ? parsed : []
          } catch (e) {
            console.error('Error parsing local submissions:', e)
          }
        }
        
        // Merge: voeg lokale items toe die niet op server staan
        const serverIds = new Set(serverData.map((s: Submission) => s.id))
        const newLocalItems = localData.filter(item => !serverIds.has(item.id))
        
        // Sync nieuwe lokale items naar server
        for (const item of newLocalItems) {
          try {
            await fetch('/api/submissions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item)
            })
          } catch (e) {
            console.error('Error syncing submission:', e)
          }
        }
        
        // Combineer en sorteer
        const allSubmissions = [...serverData, ...newLocalItems]
        allSubmissions.sort((a: Submission, b: Submission) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        setSubmissions(allSubmissions)
        
        // Update localStorage met alle data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allSubmissions))
      } else {
        // Fallback naar localStorage als server niet bereikbaar of geen JSON
        console.warn('API unavailable or returned non-JSON, using localStorage')
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            const data = Array.isArray(parsed) ? parsed : []
            data.sort((a: Submission, b: Submission) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )
            setSubmissions(data)
          } catch {
            setSubmissions([])
          }
        } else {
          setSubmissions([])
        }
      }
    } catch (e) {
      console.error('Error loading submissions:', e)
      // Fallback naar localStorage
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          const data = Array.isArray(parsed) ? parsed : []
          data.sort((a: Submission, b: Submission) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          setSubmissions(data)
        } catch (err) {
          setSubmissions([])
        }
      } else {
        setSubmissions([])
      }
    }
  }

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          // Zorg ervoor dat het een array is
          setProjects(Array.isArray(data) ? data : [])
        } else {
          console.error('API returned non-JSON response')
          setProjects([])
        }
      } else {
        setProjects([])
      }
    } catch (e) {
      console.error('Error loading projects:', e)
      setProjects([])
    }
  }

  const loadOnboardingSubmissions = async () => {
    try {
      const response = await fetch('/api/onboarding-submissions')
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          setOnboardingSubmissions(Array.isArray(data) ? data : [])
        } else {
          console.error('API returned non-JSON response')
          setOnboardingSubmissions([])
        }
      } else {
        setOnboardingSubmissions([])
      }
    } catch (e) {
      console.error('Error loading onboarding submissions:', e)
    }
  }

  const loadServiceRequests = async () => {
    try {
      const response = await fetch('/api/service-requests')
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          // New format returns { drone: [], logo: [] }
          if (data && typeof data === 'object' && !Array.isArray(data)) {
            const allRequests = [
              ...(data.drone || []),
              ...(data.logo || [])
            ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            setServiceRequests(allRequests)
          } else {
            // Legacy format: array
            setServiceRequests(Array.isArray(data) ? data : [])
          }
        } else {
          console.error('API returned non-JSON response for service requests')
          setServiceRequests([])
        }
      } else {
        setServiceRequests([])
      }
    } catch (e) {
      console.error('Error loading service requests:', e)
      setServiceRequests([])
    }
  }

  const updateServiceRequestStatus = async (requestId: string, type: string, status: string) => {
    setUpdatingServiceId(requestId)
    try {
      const response = await fetch(`/api/service-requests/${type}/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (response.ok) {
        setServiceRequests(prev => prev.map(req => 
          req.requestId === requestId ? { ...req, status, updatedAt: new Date().toISOString() } : req
        ))
      }
    } catch (e) {
      console.error('Error updating service request:', e)
    } finally {
      setUpdatingServiceId(null)
    }
  }

  const createServicePaymentLink = async (request: ServiceRequest, amount: number) => {
    const requestId = request.requestId || request.id || ''
    setServicePaymentLoading(requestId)
    try {
      const description = request.type === 'drone' 
        ? `Drone opnames - ${request.businessName || request.contactName}`
        : `Logo ontwerp - ${request.businessName || request.contactName}`
      
      const response = await fetch(`/api/service-requests/${request.type}/${requestId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.paymentUrl) {
          // Copy to clipboard
          await navigator.clipboard.writeText(data.paymentUrl)
          alert(`Betaallink gekopieerd!\n\n${data.paymentUrl}`)
          // Update local state
          setServiceRequests(prev => prev.map(r => 
            (r.requestId || r.id) === requestId 
              ? { ...r, paymentLink: data.paymentUrl, paymentStatus: 'pending' } 
              : r
          ))
        }
      } else {
        alert('Kon betaallink niet aanmaken')
      }
    } catch (e) {
      console.error('Error creating payment link:', e)
      alert('Fout bij aanmaken betaallink')
    } finally {
      setServicePaymentLoading(null)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === DASHBOARD_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem(AUTH_KEY, 'true')
      setError('')
    } else {
      setError('Ongeldig wachtwoord')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem(AUTH_KEY)
    setPassword('')
  }

  const deleteSubmission = async (id: string) => {
    if (confirm('Weet je zeker dat je deze aanvraag wilt verwijderen?')) {
      const updated = submissions.filter(s => s.id !== id)
      setSubmissions(updated)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      
      // Ook van server verwijderen
      try {
        await fetch(`/api/submissions/${id}`, { method: 'DELETE' })
      } catch (e) {
        console.error('Error deleting from server:', e)
      }
    }
  }

  const startEditing = (submission: Submission) => {
    setEditingId(submission.id)
    setEditForm({ ...submission })
    setExpandedId(submission.id)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditForm({})
  }

  // Admin delete functions
  const openDeleteModal = (type: 'project' | 'onboarding', id: string) => {
    setDeleteType(type)
    setDeleteId(id)
    setDeletePassword('')
    setDeleteError('')
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setDeleteType(null)
    setDeleteId(null)
    setDeletePassword('')
    setDeleteError('')
  }

  const handleAdminDelete = async () => {
    if (!deleteType || !deleteId) return
    
    setDeleteLoading(true)
    setDeleteError('')
    
    try {
      // Gebruik POST /delete endpoint ipv DELETE (Nginx blokkeert vaak DELETE)
      const endpoint = deleteType === 'project' 
        ? `/api/project/${deleteId}/delete` 
        : `/api/onboarding/${deleteId}/delete`
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setDeleteError(data.error || 'Er ging iets mis')
        setDeleteLoading(false)
        return
      }
      
      // Update local state
      if (deleteType === 'project') {
        setProjects(prev => prev.filter(p => p.projectId !== deleteId))
      } else {
        setOnboardingSubmissions(prev => prev.filter(o => o.projectId !== deleteId))
        if (selectedOnboarding?.projectId === deleteId) {
          setSelectedOnboarding(null)
        }
      }
      
      setSaveMessage(`${deleteType === 'project' ? 'Project' : 'Onboarding'} verwijderd!`)
      setTimeout(() => setSaveMessage(''), 3000)
      closeDeleteModal()
    } catch (error) {
      console.error('Delete error:', error)
      setDeleteError('Fout bij verwijderen')
    } finally {
      setDeleteLoading(false)
    }
  }
  
  // Template email functies
  const openTemplateModal = (project: Project) => {
    setTemplateProject(project)
    setSelectedTemplate('welcome')
    setCustomSubject('')
    setCustomMessage('')
    setTemplateSent(false)
    setTemplateModalOpen(true)
  }
  
  const closeTemplateModal = () => {
    setTemplateModalOpen(false)
    setTemplateProject(null)
    setTemplateSent(false)
  }
  
  const sendTemplateEmail = async () => {
    if (!templateProject) return
    
    setTemplateLoading(true)
    
    try {
      const response = await fetch('/api/send-template-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: templateProject.projectId,
          template: selectedTemplate,
          customSubject: customSubject || undefined,
          customMessage: customMessage || undefined
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setTemplateSent(true)
        setSaveMessage(`Email verstuurd naar ${templateProject.contactEmail}!`)
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        alert(data.error || 'Fout bij versturen email')
      }
    } catch (error) {
      console.error('Template email error:', error)
      alert('Fout bij versturen email')
    } finally {
      setTemplateLoading(false)
    }
  }

  const saveSubmission = async () => {
    if (!editingId) return
    
    const updatedSubmission = { ...submissions.find(s => s.id === editingId), ...editForm } as Submission
    const updated = submissions.map(s => 
      s.id === editingId ? updatedSubmission : s
    )
    setSubmissions(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    
    // Ook naar server sturen
    try {
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSubmission)
      })
    } catch (e) {
      console.error('Error saving to server:', e)
    }
    
    setEditingId(null)
    setEditForm({})
    setSaveMessage('Wijzigingen opgeslagen!')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const updateEditField = (field: keyof Submission, value: string | string[]) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  // Payment link functies
  const openPaymentModal = (submission: Submission) => {
    setPaymentSubmission(submission)
    setPaymentLink('')
    setLinkCopied(false)
    const pkg = submission.package?.toLowerCase() || 'starter'
    const prices = PACKAGE_PRICES[pkg] || PACKAGE_PRICES.starter
    setCustomAmount((prices.monthly + prices.setup).toString())
    setIncludeSetup(true)
    setPaymentModalOpen(true)
  }

  const closePaymentModal = () => {
    setPaymentModalOpen(false)
    setPaymentSubmission(null)
    setPaymentLink('')
    setLinkCopied(false)
  }

  const generatePaymentLink = async () => {
    if (!paymentSubmission) return
    
    setPaymentLoading(true)
    try {
      const pkg = paymentSubmission.package?.toLowerCase() || 'starter'
      const prices = PACKAGE_PRICES[pkg] || PACKAGE_PRICES.starter
      const amount = customAmount || (includeSetup ? prices.monthly + prices.setup : prices.monthly).toString()
      
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount).toFixed(2),
          description: `Webstability ${paymentSubmission.websiteType || 'Website'} - ${paymentSubmission.businessName}`,
          customerEmail: paymentSubmission.contactEmail,
          customerName: paymentSubmission.contactName,
          packageType: pkg,
          isFirstPayment: includeSetup,
          metadata: {
            submissionId: paymentSubmission.id,
            businessName: paymentSubmission.businessName
          }
        })
      })
      
      const data = await response.json()
      
      if (data.paymentUrl) {
        setPaymentLink(data.paymentUrl)
      } else {
        alert('Fout bij aanmaken betaallink: ' + (data.error || 'Onbekende fout'))
      }
    } catch (err) {
      console.error('Payment link error:', err)
      alert('Er ging iets mis bij het aanmaken van de betaallink')
    }
    setPaymentLoading(false)
  }

  const copyPaymentLink = async () => {
    if (!paymentLink) return
    try {
      await navigator.clipboard.writeText(paymentLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 3000)
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = paymentLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 3000)
    }
  }

  const sendPaymentEmail = async () => {
    if (!paymentLink || !paymentSubmission) return
    
    setPaymentLoading(true)
    try {
      const response = await fetch('/api/send-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: paymentSubmission.contactEmail,
          name: paymentSubmission.contactName,
          businessName: paymentSubmission.businessName,
          paymentLink,
          amount: customAmount
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setSaveMessage(`Betaallink verstuurd naar ${paymentSubmission.contactEmail}!`)
        setTimeout(() => setSaveMessage(''), 5000)
        closePaymentModal()
      } else {
        alert('Fout bij versturen: ' + (data.error || 'Onbekende fout'))
      }
    } catch (err) {
      alert('Er ging iets mis bij het versturen van de email')
    }
    setPaymentLoading(false)
  }

  // Project management functions
  const openProjectModal = (project: Project) => {
    setEditingProject({ ...project })
    setProjectModalOpen(true)
  }

  const closeProjectModal = () => {
    setProjectModalOpen(false)
    setEditingProject(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'onboarding': return 'bg-gray-100 text-gray-700'
      case 'design': return 'bg-purple-100 text-purple-700'
      case 'development': return 'bg-blue-100 text-blue-700'
      case 'review': return 'bg-amber-100 text-amber-700'
      case 'live': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'onboarding': return 'Onboarding'
      case 'design': return 'Design'
      case 'development': return 'Development'
      case 'review': return 'Review'
      case 'live': return 'Live'
      default: return status
    }
  }

  const exportToCSV = () => {
    const headers = [
      'ID', 'Datum', 'Pakket', 'Type Website', 'Branche', 'Domein', 'Domein Status',
      'Bedrijfsnaam', 'Tagline', 'Beschrijving', 'Kleur', 'Stijl', 'Voorbeeldsites',
      'Paginas', 'Content', 'Naam', 'Email', 'Telefoon', 'Opmerkingen'
    ]
    
    const rows = submissions.map(s => [
      s.id,
      s.timestamp,
      s.package,
      s.websiteType,
      s.industry,
      s.domain,
      s.domainStatus,
      s.businessName,
      s.tagline,
      `"${s.description.replace(/"/g, '""')}"`,
      s.primaryColor,
      s.style,
      s.exampleSites,
      s.pages.join('; '),
      `"${s.content.replace(/"/g, '""')}"`,
      s.contactName,
      s.contactEmail,
      s.contactPhone,
      `"${s.remarks.replace(/"/g, '""')}"`
    ])

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `webstability-aanvragen-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const filteredSubmissions = submissions.filter(s => 
    s.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.domain.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPackageColor = (pkg: string) => {
    switch (pkg) {
      case 'starter': return 'bg-gray-100 text-gray-700'
      case 'professional': return 'bg-primary-100 text-primary-700'
      case 'business': return 'bg-amber-100 text-amber-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPackageLabel = (pkg: string) => {
    switch (pkg) {
      case 'starter': return 'Starter €119/mnd'
      case 'professional': return 'Professional €149/mnd'
      case 'business': return 'Business €199/mnd'
      default: return pkg
    }
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">dash login</h1>
            <p className="text-gray-600 mt-2">Alleen toegankelijk voor developers</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wachtwoord
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Voer wachtwoord in"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
            >
              Inloggen
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      {/* Top Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">Webstability</span>
              </div>
              <div className="hidden md:block h-6 w-px bg-gray-200 dark:bg-gray-700" />
              <h1 className="hidden md:block text-sm font-medium text-gray-500 dark:text-gray-400">Dashboard</h1>
              {saveMessage && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full"
                >
                  {saveMessage}
                </motion.span>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  loadSubmissions()
                  loadProjects()
                  loadOnboardingSubmissions()
                  loadServiceRequests()
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Ververs data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Uitloggen</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mb-px">
            <button
              onClick={() => setActiveTab('overzicht')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'overzicht' 
                  ? 'border-primary-500 text-primary-600 bg-primary-50/50' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Overzicht
            </button>
            <button
              onClick={() => setActiveTab('klanten')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'klanten' 
                  ? 'border-primary-500 text-primary-600 bg-primary-50/50' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4" />
              Klanten
              <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === 'klanten' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
                {submissions.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('projecten')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'projecten' 
                  ? 'border-primary-500 text-primary-600 bg-primary-50/50' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Activity className="w-4 h-4" />
              Projecten
              <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === 'projecten' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
                {projects.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('aanvragen')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'aanvragen' 
                  ? 'border-primary-500 text-primary-600 bg-primary-50/50' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              Aanvragen
            </button>
            <button
              onClick={() => setActiveTab('onboarding')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'onboarding' 
                  ? 'border-primary-500 text-primary-600 bg-primary-50/50' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Onboarding
              <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === 'onboarding' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
                {onboardingSubmissions.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('diensten')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'diensten' 
                  ? 'border-purple-500 text-purple-600 bg-purple-50/50' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Palette className="w-4 h-4" />
              Extra Diensten
              {serviceRequests.filter(r => r.status === 'nieuw').length > 0 && (
                <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full animate-pulse">
                  {serviceRequests.filter(r => r.status === 'nieuw').length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-6">
        {/* Tab: Overzicht */}
        {activeTab === 'overzicht' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setActiveTab('klanten')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{submissions.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Klanten</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-gray-100 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {projects.filter(p => p.status === 'onboarding').length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Onboarding</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-purple-50 rounded-lg">
                    <Palette className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {projects.filter(p => p.status === 'design').length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Design</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {projects.filter(p => p.status === 'development').length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Development</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-amber-50 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {projects.filter(p => p.status === 'review').length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Review</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-green-50 rounded-lg">
                    <Rocket className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {projects.filter(p => p.status === 'live').length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Live</p>
              </motion.div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Snelle acties</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('klanten')}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Klanten bekijken</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Beheer klantgegevens</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('projecten')}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <Activity className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Projecten beheren</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Status & voortgang</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </button>
                  <button 
                    onClick={exportToCSV}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Export naar CSV</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Download alle data</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </button>
                </div>
              </div>

              {/* Recent Customers */}
              <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Recente klanten</h3>
                  <button 
                    onClick={() => setActiveTab('klanten')}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Bekijk alle →
                  </button>
                </div>
                {submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Nog geen klanten</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissions.slice(0, 5).map((submission, index) => (
                      <motion.div
                        key={submission.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                        onClick={() => {
                          setActiveTab('klanten')
                          setExpandedId(submission.id)
                        }}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {submission.businessName?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{submission.businessName || 'Onbekend'}</p>
                          <p className="text-sm text-gray-500 truncate">{submission.contactEmail}</p>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPackageColor(submission.package)}`}>
                          {submission.package}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(submission.timestamp).toLocaleDateString('nl-NL')}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Projects Kanban Preview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Projecten per fase</h3>
                <button 
                  onClick={() => setActiveTab('projecten')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Bekijk alle →
                </button>
              </div>
              
              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Nog geen projecten</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-5 gap-4">
                  {['onboarding', 'design', 'development', 'review', 'live'].map((status) => {
                    const statusProjects = projects.filter(p => p.status === status)
                    const colors = {
                      onboarding: { bg: 'bg-gray-50', border: 'border-gray-200', dot: 'bg-gray-400' },
                      design: { bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-500' },
                      development: { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500' },
                      review: { bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
                      live: { bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-500' }
                    }
                    const color = colors[status as keyof typeof colors]
                    
                    return (
                      <div key={status} className={`rounded-xl p-4 ${color.bg} border ${color.border}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-2 h-2 rounded-full ${color.dot}`} />
                          <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                          <span className="text-xs text-gray-500 ml-auto">{statusProjects.length}</span>
                        </div>
                        <div className="space-y-2">
                          {statusProjects.slice(0, 3).map(project => (
                            <div 
                              key={project.projectId} 
                              className="bg-white p-2.5 rounded-lg text-sm shadow-sm cursor-pointer hover:shadow transition-shadow"
                              onClick={() => {
                                setEditingProject(project)
                                setProjectModalOpen(true)
                              }}
                            >
                              <p className="font-medium text-gray-900 truncate">{project.businessName}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{project.package}</p>
                            </div>
                          ))}
                          {statusProjects.length > 3 && (
                            <p className="text-xs text-gray-500 text-center">+{statusProjects.length - 3} meer</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Klanten */}
        {activeTab === 'klanten' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Klanten</h2>
                <p className="text-gray-500 text-sm">Klanten die zich hebben aangemeld via /start</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Zoek op naam, email, bedrijf..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                  />
                </div>
                <button
                  onClick={exportToCSV}
                  disabled={submissions.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {/* Empty state */}
            {submissions.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nog geen klanten</h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Wanneer klanten zich aanmelden via /start, verschijnen ze hier.
                </p>
              </div>
            ) : (
              /* Customers Table */
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Klant</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Contact</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Pakket</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Domein</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Datum</th>
                        <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Acties</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredSubmissions.map((submission) => (
                        <tr 
                          key={submission.id} 
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                {submission.businessName?.charAt(0).toUpperCase() || '?'}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{submission.businessName || 'Onbekend'}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{submission.contactName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-900 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                {submission.contactEmail}
                              </p>
                              {submission.contactPhone && (
                                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                                  {submission.contactPhone}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getPackageColor(submission.package)}`}>
                              {getPackageLabel(submission.package)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm text-gray-900 dark:text-white">{submission.domain || '-'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(submission.timestamp)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openPaymentModal(submission)
                                }}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Betaallink"
                              >
                                <CreditCard className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  startEditing(submission)
                                }}
                                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                title="Bewerken"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteSubmission(submission.id)
                                }}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Verwijderen"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="w-px h-4 bg-gray-200 mx-1" />
                              {expandedId === submission.id ? (
                                <ChevronUp className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedId && filteredSubmissions.find(s => s.id === expandedId) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 bg-gray-50 dark:bg-gray-800"
                    >
                      {(() => {
                        const submission = filteredSubmissions.find(s => s.id === expandedId)!
                        return (
                          <div className="p-6">
                            {/* Edit mode toolbar */}
                            {editingId === submission.id && (
                              <div className="bg-primary-50 border border-primary-200 rounded-lg px-4 py-3 mb-6 flex items-center justify-between">
                                <span className="text-primary-700 font-medium flex items-center gap-2">
                                  <Edit3 className="w-4 h-4" />
                                  Bewerk modus
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={cancelEditing}
                                    className="px-3 py-1.5 text-gray-600 hover:text-gray-900 font-medium rounded-lg transition-colors flex items-center gap-1.5 text-sm"
                                  >
                                    <X className="w-4 h-4" />
                                    Annuleren
                                  </button>
                                  <button
                                    onClick={saveSubmission}
                                    className="px-4 py-1.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors flex items-center gap-1.5 text-sm"
                                  >
                                    <Save className="w-4 h-4" />
                                    Opslaan
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            <div className="grid md:grid-cols-3 gap-6">
                              {/* Contact Details */}
                              <div className="bg-white rounded-xl p-5 border border-gray-100">
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                  <User className="w-4 h-4 text-primary-500" />
                                  Contactgegevens
                                </h4>
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Naam</label>
                                    {editingId === submission.id ? (
                                      <input
                                        type="text"
                                        value={editForm.contactName || ''}
                                        onChange={(e) => updateEditField('contactName', e.target.value)}
                                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                                      />
                                    ) : (
                                      <p className="font-medium text-gray-900 dark:text-white">{submission.contactName || '-'}</p>
                                    )}
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
                                    {editingId === submission.id ? (
                                      <input
                                        type="email"
                                        value={editForm.contactEmail || ''}
                                        onChange={(e) => updateEditField('contactEmail', e.target.value)}
                                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                                      />
                                    ) : (
                                      <p className="font-medium text-gray-900 dark:text-white">{submission.contactEmail || '-'}</p>
                                    )}
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Telefoon</label>
                                    {editingId === submission.id ? (
                                      <input
                                        type="tel"
                                        value={editForm.contactPhone || ''}
                                        onChange={(e) => updateEditField('contactPhone', e.target.value)}
                                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                                      />
                                    ) : (
                                      <p className="font-medium text-gray-900 dark:text-white">{submission.contactPhone || '-'}</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Website Details */}
                              <div className="bg-white rounded-xl p-5 border border-gray-100">
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                  <Globe className="w-4 h-4 text-primary-500" />
                                  Website Details
                                </h4>
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Bedrijfsnaam</label>
                                    {editingId === submission.id ? (
                                      <input
                                        type="text"
                                        value={editForm.businessName || ''}
                                        onChange={(e) => updateEditField('businessName', e.target.value)}
                                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                                      />
                                    ) : (
                                      <p className="font-medium text-gray-900 dark:text-white">{submission.businessName || '-'}</p>
                                    )}
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Type</label>
                                    {editingId === submission.id ? (
                                      <input
                                        type="text"
                                        value={editForm.websiteType || ''}
                                        onChange={(e) => updateEditField('websiteType', e.target.value)}
                                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                                      />
                                    ) : (
                                      <p className="font-medium text-gray-900 dark:text-white">{submission.websiteType || '-'}</p>
                                    )}
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Branche</label>
                                    {editingId === submission.id ? (
                                      <input
                                        type="text"
                                        value={editForm.industry || ''}
                                        onChange={(e) => updateEditField('industry', e.target.value)}
                                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                                      />
                                    ) : (
                                      <p className="font-medium text-gray-900 dark:text-white">{submission.industry || '-'}</p>
                                    )}
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Domein</label>
                                    {editingId === submission.id ? (
                                      <input
                                        type="text"
                                        value={editForm.domain || ''}
                                        onChange={(e) => updateEditField('domain', e.target.value)}
                                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                                      />
                                    ) : (
                                      <p className="font-medium text-gray-900 dark:text-white">{submission.domain || '-'}</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Design & Extra */}
                              <div className="bg-white rounded-xl p-5 border border-gray-100">
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                  <Palette className="w-4 h-4 text-primary-500" />
                                  Stijl & Extra
                                </h4>
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Stijl</label>
                                    <p className="font-medium text-gray-900 dark:text-white">{submission.style || '-'}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Primaire kleur</label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div 
                                        className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700" 
                                        style={{ backgroundColor: submission.primaryColor || '#ccc' }}
                                      />
                                      <span className="font-medium text-gray-900 dark:text-white">{submission.primaryColor || '-'}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Pagina's</label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {submission.pages?.map((page, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                          {page}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Description & Remarks */}
                            {(submission.description || submission.remarks) && (
                              <div className="grid md:grid-cols-2 gap-6 mt-6">
                                {submission.description && (
                                  <div className="bg-white rounded-xl p-5 border border-gray-100">
                                    <h4 className="font-semibold text-gray-900 mb-2">Beschrijving</h4>
                                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{submission.description}</p>
                                  </div>
                                )}
                                {submission.remarks && (
                                  <div className="bg-white rounded-xl p-5 border border-gray-100">
                                    <h4 className="font-semibold text-gray-900 mb-2">Opmerkingen</h4>
                                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{submission.remarks}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* Tab: Aanvragen - Old submissions tab, now simplified */}
        {activeTab === 'aanvragen' && (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aanvragen samengevoegd</h3>
            <p className="text-gray-600 mb-4">
              Alle aanvragen staan nu in de <strong>Klanten</strong> tab voor een beter overzicht.
            </p>
            <button
              onClick={() => setActiveTab('klanten')}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              Ga naar Klanten →
            </button>
          </div>
        )}

        {/* Tab: Projecten */}
        {activeTab === 'projecten' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Project Pipeline</h2>
              <button
                onClick={() => { loadProjects(); setSaveMessage('Projecten vernieuwd!'); setTimeout(() => setSaveMessage(''), 2000) }}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Vernieuwen
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Nog geen projecten</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Projecten verschijnen hier wanneer klanten een aanvraag indienen via /start
                </p>
              </div>
            ) : (
              <>
                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                  {[
                    { key: 'onboarding', label: 'Onboarding', color: 'gray', icon: '📋' },
                    { key: 'design', label: 'Design', color: 'purple', icon: '🎨' },
                    { key: 'development', label: 'Development', color: 'blue', icon: '💻' },
                    { key: 'review', label: 'Review', color: 'amber', icon: '👀' },
                    { key: 'live', label: 'Live', color: 'green', icon: '🚀' }
                  ].map(phase => {
                    const phaseProjects = projects.filter(p => p.status === phase.key)
                    return (
                      <div key={phase.key} className="bg-gray-50 rounded-xl p-3">
                        <div className={`flex items-center gap-2 mb-3 pb-2 border-b border-${phase.color}-200`}>
                          <span className="text-lg">{phase.icon}</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{phase.label}</span>
                          <span className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-${phase.color}-100 text-${phase.color}-700`}>
                            {phaseProjects.length}
                          </span>
                        </div>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                          {phaseProjects.length === 0 ? (
                            <div className="text-center py-4 text-gray-400 text-sm">
                              Geen projecten
                            </div>
                          ) : (
                            phaseProjects.map(project => (
                              <motion.div
                                key={project.projectId}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer"
                                onClick={() => openProjectModal(project)}
                              >
                                <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                                  {project.businessName}
                                </h4>
                                <p className="text-xs text-gray-500 truncate">{project.contactName}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-400 font-mono">{project.projectId}</span>
                                  {project.revisionsUsed !== undefined && project.revisionsTotal && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                                      project.revisionsUsed >= project.revisionsTotal 
                                        ? 'bg-red-100 text-red-600' 
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {project.revisionsUsed}/{project.revisionsTotal}
                                    </span>
                                  )}
                                </div>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Project Lijst */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Alle Projecten</h3>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.projectId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{project.businessName}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                              {getStatusLabel(project.status)}
                            </span>
                            {project.revisionsUsed !== undefined && project.revisionsTotal && (
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                project.revisionsUsed >= project.revisionsTotal 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                Revisies: {project.revisionsUsed}/{project.revisionsTotal}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {project.projectId} • {project.contactName} • {project.contactEmail}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{project.package}</p>
                            {project.googleDriveUrl && (
                              <a 
                                href={project.googleDriveUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="w-3 h-3" />
                                Google Drive
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openTemplateModal(project)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition"
                            title="Email versturen"
                          >
                            <Send className="w-4 h-4" />
                            <span className="hidden md:inline">Email</span>
                          </button>
                          <button
                            onClick={() => openProjectModal(project)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition"
                          >
                            <Edit3 className="w-4 h-4" />
                            Bewerken
                          </button>
                          <button
                            onClick={() => openDeleteModal('project', project.projectId)}
                            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                            title="Verwijderen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {project.statusMessage && (
                        <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                          {project.statusMessage}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Tab: Onboarding */}
        {activeTab === 'onboarding' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Onboarding Inzendingen</h2>
              <button
                onClick={() => { loadOnboardingSubmissions(); setSaveMessage('Onboarding vernieuwd!'); setTimeout(() => setSaveMessage(''), 2000) }}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Vernieuwen
              </button>
            </div>

            {onboardingSubmissions.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Nog geen onboarding inzendingen</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Wanneer klanten hun onboarding checklist invullen, verschijnen ze hier.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {onboardingSubmissions.map((ob) => (
                  <div key={ob.projectId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div 
                      className="p-6 cursor-pointer hover:bg-gray-50 transition"
                      onClick={() => setSelectedOnboarding(selectedOnboarding?.projectId === ob.projectId ? null : ob)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{ob.businessName}</h3>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                              Ingevuld
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {ob.projectId} • {ob.contactName} • {ob.contactEmail}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Ingediend: {new Date(ob.submittedAt).toLocaleString('nl-NL')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); openDeleteModal('onboarding', ob.projectId); }}
                            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                            title="Verwijderen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {selectedOnboarding?.projectId === ob.projectId ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {selectedOnboarding?.projectId === ob.projectId && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100 p-6 bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Over het bedrijf</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{ob.aboutText}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Diensten/Producten</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{ob.services}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">USPs</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{ob.uniqueSellingPoints || '-'}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Logo</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{ob.hasLogo}</p>
                            {ob.logoDescription && <p className="text-sm text-gray-600 mt-1">{ob.logoDescription}</p>}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Kleuren & Fonts</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Kleuren: {ob.brandColors || '-'}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Fonts: {ob.brandFonts || '-'}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Foto's & Media</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{ob.photos || '-'}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Social Media</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{ob.socialMedia || '-'}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Concurrenten/Inspiratie</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{ob.competitors || '-'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <h4 className="font-semibold text-gray-900 mb-2">Extra wensen</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{ob.extraWishes || '-'}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Tab: Extra Diensten */}
        {activeTab === 'diensten' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Extra Diensten Aanvragen</h2>
                <p className="text-gray-600 text-sm">Aanvragen voor logo ontwerp, luchtfoto's en andere diensten</p>
              </div>
              <button
                onClick={loadServiceRequests}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Vernieuwen
              </button>
            </div>

            {serviceRequests.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                <Palette className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Geen aanvragen</h3>
                <p className="text-gray-500 dark:text-gray-400">Er zijn nog geen extra diensten aangevraagd via de website.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {serviceRequests.map((request) => {
                  const isDrone = request.type === 'drone'
                  const displayName = request.contactName || request.name || 'Onbekend'
                  const displayEmail = request.contactEmail || request.email || ''
                  const displayPhone = request.contactPhone || request.phone || ''
                  const displayCompany = request.businessName || request.company || ''
                  const displayId = request.requestId || request.id || ''
                  const displayPrice = request.price ? `€${request.price}` : (isDrone ? '€301+' : '€241')
                  
                  return (
                    <motion.div
                      key={displayId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white border rounded-2xl overflow-hidden transition-all ${
                        request.status === 'pending' ? 'border-purple-300 ring-2 ring-purple-100' : 'border-gray-200'
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                              isDrone ? 'bg-sky-100' : 'bg-purple-100'
                            }`}>
                              {isDrone ? '🚁' : '🎨'}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {isDrone ? 'Drone Opnames' : 'Logo Ontwerp'}
                                {request.preferCall && <span className="ml-2 text-orange-500 text-sm">📞 Wil bellen</span>}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{displayName}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm flex-wrap">
                                {displayEmail && (
                                  <a href={`mailto:${displayEmail}`} className="text-primary-600 hover:underline flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {displayEmail}
                                  </a>
                                )}
                                {displayPhone && (
                                  <a href={`tel:${displayPhone}`} className="text-gray-600 hover:underline flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {displayPhone}
                                  </a>
                                )}
                                {displayCompany && (
                                  <span className="text-gray-600 flex items-center gap-1">
                                    <Briefcase className="w-3 h-3" />
                                    {displayCompany}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              isDrone ? 'bg-sky-100 text-sky-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {displayPrice}
                            </span>
                            <select
                              value={request.status}
                              onChange={(e) => updateServiceRequestStatus(displayId, request.type, e.target.value)}
                              disabled={updatingServiceId === displayId}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                                request.status === 'pending' 
                                  ? 'bg-yellow-50 border-yellow-200 text-yellow-700' 
                                  : request.status === 'confirmed' || request.status === 'in_progress'
                                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                                  : request.status === 'completed'
                                  ? 'bg-green-50 border-green-200 text-green-700'
                                  : 'bg-gray-50 border-gray-200 text-gray-700'
                              }`}
                            >
                              <option value="pending">Nieuw</option>
                              <option value="confirmed">Bevestigd</option>
                              <option value="in_progress">In uitvoering</option>
                              <option value="completed">Afgerond</option>
                              <option value="cancelled">Geannuleerd</option>
                            </select>
                          </div>
                        </div>
                        
                        {/* Drone specific info */}
                        {isDrone && (
                          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Locatie:</span>
                              <p className="font-medium">{request.locationAddress}, {request.locationCity}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Datum:</span>
                              <p className="font-medium">
                                {request.confirmedDate || request.preferredDate 
                                  ? new Date(request.confirmedDate || request.preferredDate || '').toLocaleDateString('nl-NL')
                                  : '-'}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Tijd:</span>
                              <p className="font-medium">{request.confirmedTime || request.preferredTime || '-'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Duur:</span>
                              <p className="font-medium">{request.duration || '-'}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Logo specific info */}
                        {!isDrone && (
                          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Branche:</span>
                              <p className="font-medium">{request.industry || '-'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Stijl:</span>
                              <p className="font-medium">{(request.style || []).join(', ') || '-'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Kleuren:</span>
                              <p className="font-medium">{(request.colors || []).join(', ') || '-'}</p>
                            </div>
                          </div>
                        )}
                        
                        {(request.additionalNotes || request.remarks) && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <strong>Opmerkingen:</strong> {request.additionalNotes || request.remarks}
                            </p>
                          </div>
                        )}
                        
                        {/* Payment actions */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
                          {request.paymentStatus !== 'paid' && (
                            <button
                              onClick={() => {
                                const defaultAmount = isDrone 
                                  ? (request.duration === '30min' ? 249 : request.duration === '1hour' ? 349 : request.duration === '2hours' ? 499 : 749)
                                  : 199
                                const amount = prompt(`Bedrag in euro's:`, String(defaultAmount))
                                if (amount && !isNaN(Number(amount))) {
                                  createServicePaymentLink(request, Number(amount))
                                }
                              }}
                              disabled={servicePaymentLoading === displayId}
                              className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                              {servicePaymentLoading === displayId ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <CreditCard className="w-3 h-3" />
                              )}
                              Betaallink maken
                            </button>
                          )}
                          {request.paymentLink && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(request.paymentLink || '')
                                alert('Betaallink gekopieerd!')
                              }}
                              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                              Link kopiëren
                            </button>
                          )}
                          <a
                            href={`mailto:${displayEmail}`}
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 text-sm font-medium rounded-lg transition-colors"
                          >
                            <Mail className="w-3 h-3" />
                            E-mail
                          </a>
                          {displayPhone && (
                            <a
                              href={`tel:${displayPhone}`}
                              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                            >
                              <Phone className="w-3 h-3" />
                              Bellen
                            </a>
                          )}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                          <span>ID: {displayId}</span>
                          <div className="flex items-center gap-4">
                            {request.paymentStatus && (
                              <span className={`px-2 py-1 rounded ${
                                request.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {request.paymentStatus === 'paid' ? '✓ Betaald' : 'Niet betaald'}
                              </span>
                            )}
                            <span>Aangevraagd: {new Date(request.createdAt).toLocaleString('nl-NL')}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* Project Edit Modal - New improved version */}
      {editingProject && (
        <ProjectEditModal
          project={editingProject as ProjectType}
          isOpen={projectModalOpen}
          onClose={closeProjectModal}
          onSave={async (updatedProject) => {
            try {
              const response = await fetch(`/api/project/${updatedProject.projectId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProject)
              })
              
              if (response.ok) {
                setSaveMessage('Project bijgewerkt!')
                setTimeout(() => setSaveMessage(''), 3000)
                loadProjects()
                closeProjectModal()
              }
            } catch (err) {
              alert('Fout bij opslaan project')
            }
          }}
        />
      )}

      {/* Payment Link Modal */}
      {paymentModalOpen && paymentSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closePaymentModal} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-500" />
                Betaallink voor {paymentSubmission.businessName}
              </h3>
              <button onClick={closePaymentModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Klantinfo */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Klant:</strong> {paymentSubmission.contactName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Email:</strong> {paymentSubmission.contactEmail}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Pakket:</strong> {getPackageLabel(paymentSubmission.package)}
                </p>
              </div>

              {/* Bedrag opties */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrag</label>
                <div className="flex items-center gap-3 mb-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeSetup}
                      onChange={(e) => {
                        setIncludeSetup(e.target.checked)
                        const pkg = paymentSubmission.package?.toLowerCase() || 'starter'
                        const prices = PACKAGE_PRICES[pkg] || PACKAGE_PRICES.starter
                        setCustomAmount(e.target.checked 
                          ? (prices.monthly + prices.setup).toString()
                          : prices.monthly.toString()
                        )
                      }}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Inclusief eenmalige opstartkosten</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">€</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="Bedrag"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {includeSetup 
                    ? `Eenmalig + eerste maand = €${customAmount}`
                    : `Alleen maandelijkse kosten = €${customAmount}`
                  }
                </p>
              </div>

              {/* Genereer link knop */}
              {!paymentLink && (
                <button
                  onClick={generatePaymentLink}
                  disabled={paymentLoading || !customAmount}
                  className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {paymentLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Aanmaken...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Genereer Mollie betaallink
                    </>
                  )}
                </button>
              )}

              {/* Payment link resultaat */}
              {paymentLink && (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm text-green-700 font-medium mb-2">✓ Betaallink aangemaakt!</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={paymentLink}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-green-200 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                      />
                      <button
                        onClick={copyPaymentLink}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                          linkCopied 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {linkCopied ? (
                          <>
                            <CheckIcon className="w-4 h-4" />
                            Gekopieerd!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Kopieer
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Verstuur per email */}
                  <button
                    onClick={sendPaymentEmail}
                    disabled={paymentLoading}
                    className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {paymentLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Versturen...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Stuur naar {paymentSubmission.contactEmail}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Template Email Modal */}
      {templateModalOpen && templateProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeTemplateModal} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {templateSent ? (
              <>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Email verstuurd!</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    De email is succesvol verstuurd naar {templateProject.contactEmail}
                  </p>
                </div>
                <button
                  onClick={closeTemplateModal}
                  className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition"
                >
                  Sluiten
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email versturen</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Naar: {templateProject.contactEmail}
                    </p>
                  </div>
                  <button onClick={closeTemplateModal} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Kies een template
                  </label>
                  <div className="space-y-2">
                    {TEMPLATE_OPTIONS.map((opt) => (
                      <label
                        key={opt.key}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                          selectedTemplate === opt.key 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="template"
                          value={opt.key}
                          checked={selectedTemplate === opt.key}
                          onChange={() => setSelectedTemplate(opt.key)}
                          className="sr-only"
                        />
                        <span className="text-xl">{opt.label.split(' ')[0]}</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{opt.label.replace(/^[^\s]+\s/, '')}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{opt.description}</p>
                        </div>
                        {selectedTemplate === opt.key && (
                          <CheckIcon className="w-5 h-5 text-primary-600" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {selectedTemplate === 'general_update' && (
                  <div className="mb-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Onderwerp
                      </label>
                      <input
                        type="text"
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        placeholder="Update over je project"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bericht
                      </label>
                      <textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Schrijf hier je bericht..."
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={closeTemplateModal}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={sendTemplateEmail}
                    disabled={templateLoading || (selectedTemplate === 'general_update' && !customMessage.trim())}
                    className="flex-1 px-4 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {templateLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Versturen...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Versturen
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeDeleteModal} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {deleteType === 'project' ? 'Project' : 'Onboarding'} verwijderen
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{deleteId}</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              Weet je zeker dat je {deleteType === 'project' ? 'dit project' : 'deze onboarding'} wilt verwijderen? 
              {deleteType === 'project' && ' Dit verwijdert ook de bijbehorende onboarding data.'}
              <strong className="block mt-2 text-red-600">Deze actie kan niet ongedaan worden gemaakt!</strong>
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin wachtwoord
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Voer wachtwoord in..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                onKeyDown={(e) => e.key === 'Enter' && handleAdminDelete()}
              />
              {deleteError && (
                <p className="mt-2 text-sm text-red-600">{deleteError}</p>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
              >
                Annuleren
              </button>
              <button
                onClick={handleAdminDelete}
                disabled={!deletePassword || deleteLoading}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verwijderen...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Verwijderen
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
