/**
 * Developer Dashboard - Premium Design
 * 
 * Volledig herschreven met dezelfde visuele stijl als het klantendashboard:
 * - Gradient hero cards
 * - Glasmorphism effects
 * - Urgentie indicators
 * - Quick actions voor snelle workflow
 * - Real-time klant activiteit
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FolderKanban, 
  MessageSquare, 
  CreditCard,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Loader2,
  Users,
  LayoutGrid,
  List,
  TrendingUp,
  Euro,
  ExternalLink,
  Mail,
  Phone,
  ChevronRight,
  Globe,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Eye,
  Send,
  XCircle
} from 'lucide-react'
import Logo from '../Logo'
import QuickStats from './QuickStats'
import ProjectDetailModal from './ProjectDetailModal'
import type { Project, DashboardView, ProjectPhase } from './types'
import { PHASE_CONFIG, PACKAGE_CONFIG } from './types'

// Phase gradient colors - matching client dashboard style
const PHASE_GRADIENTS: Record<ProjectPhase, string> = {
  onboarding: 'from-amber-500 to-orange-600',
  design: 'from-purple-500 to-pink-600',
  design_approved: 'from-blue-500 to-cyan-600',
  development: 'from-emerald-500 to-teal-600',
  review: 'from-indigo-500 to-purple-600',
  live: 'from-green-500 to-emerald-600'
}

// Constants
const TOKEN_KEY = 'webstability_dev_token'

// API URL
const API_BASE = '/api'

// Helper function to get project urgency
function getProjectUrgency(project: Project): { level: 'high' | 'medium' | 'low' | 'none', reason: string } {
  const unreadMessages = project.messages.filter(m => !m.read && m.from === 'client').length
  const daysSinceUpdate = Math.floor((Date.now() - new Date(project.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
  
  // High urgency
  if (unreadMessages > 0) {
    return { level: 'high', reason: `${unreadMessages} nieuw bericht${unreadMessages > 1 ? 'en' : ''}` }
  }
  if (project.phase === 'design_approved' && project.paymentStatus === 'paid') {
    return { level: 'high', reason: 'Klaar om te beginnen!' }
  }
  if (project.phase === 'review') {
    return { level: 'high', reason: 'Wacht op review' }
  }
  
  // Medium urgency
  if (daysSinceUpdate > 3 && project.phase !== 'live') {
    return { level: 'medium', reason: `${daysSinceUpdate} dagen geen update` }
  }
  if (project.phase === 'design_approved' && project.paymentStatus !== 'paid') {
    return { level: 'medium', reason: 'Wacht op betaling' }
  }
  
  // Low urgency
  if (project.phase === 'onboarding') {
    return { level: 'low', reason: 'Nieuwe klant' }
  }
  
  return { level: 'none', reason: '' }
}

export default function DeveloperDashboard() {
  const navigate = useNavigate()
  
  // Dashboard state
  const [activeView, setActiveView] = useState<DashboardView>('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showLiveProjects, setShowLiveProjects] = useState(false)
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  
  // Payment modal state
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean
    project: Project | null
    loading: boolean
    success: boolean
    error: string
  }>({ open: false, project: null, loading: false, success: false, error: '' })
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentDescription, setPaymentDescription] = useState('')

  // Handle logout - clear session and redirect
  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem('fallback_auth')
    sessionStorage.removeItem('fallback_role')
    navigate('/')
  }

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      const token = sessionStorage.getItem(TOKEN_KEY)
      const response = await fetch(`${API_BASE}/developer/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.projects) {
          setProjects(data.projects)
        }
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount and poll
  useEffect(() => {
    fetchProjects()
    const interval = setInterval(fetchProjects, 30000) // Poll every 30s
    return () => clearInterval(interval)
  }, [fetchProjects])

  // Update project
  const handleUpdateProject = async (updatedProject: Project) => {
    // Optimistic update
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p))
    
    // Update selected project if it's open
    if (selectedProject?.id === updatedProject.id) {
      setSelectedProject(updatedProject)
    }

    // Sync to API
    try {
      const token = sessionStorage.getItem(TOKEN_KEY)
      await fetch(`${API_BASE}/developer/projects`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedProject)
      })
    } catch (error) {
      console.error('Failed to update project:', error)
    }
  }

  // Send payment link
  const handleSendPaymentLink = async (project: Project, customAmount?: number, customDescription?: string) => {
    setPaymentModal(prev => ({ ...prev, loading: true, error: '', success: false }))
    
    try {
      const token = sessionStorage.getItem(TOKEN_KEY)
      const amount = customAmount || getFirstPayment(project.package)
      const description = customDescription || `Eerste betaling - ${project.businessName}`
      
      const response = await fetch(`${API_BASE}/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: project.projectId,
          amount: amount.toString(),
          description: description,
          customerEmail: project.contactEmail,
          customerName: project.contactName,
          packageName: project.package,
          sendEmail: true
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.checkoutUrl || data.paymentUrl) {
          handleUpdateProject({
            ...project,
            paymentUrl: data.checkoutUrl || data.paymentUrl,
            paymentStatus: 'awaiting_payment'
          })
          setPaymentModal(prev => ({ ...prev, loading: false, success: true }))
          
          // Close modal after 2 seconds
          setTimeout(() => {
            closePaymentModal()
          }, 2000)
        } else {
          throw new Error('Geen betaallink ontvangen')
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Kon betaallink niet aanmaken')
      }
    } catch (error) {
      console.error('Failed to create payment:', error)
      setPaymentModal(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Er ging iets mis' 
      }))
    }
  }

  // Open payment modal
  const openPaymentModal = (project: Project) => {
    // Get default amount based on package
    const defaultAmount = getFirstPayment(project.package || 'professional')
    setPaymentAmount(defaultAmount.toString())
    setPaymentDescription(`Betaling voor ${project.businessName} - ${PACKAGE_CONFIG[project.package]?.name || 'Website'}`)
    setPaymentModal({
      open: true,
      project,
      loading: false,
      success: false,
      error: ''
    })
  }
  
  // Close payment modal
  const closePaymentModal = () => {
    setPaymentModal({ open: false, project: null, loading: false, success: false, error: '' })
    setPaymentAmount('')
    setPaymentDescription('')
  }

  const getFirstPayment = (pkg: string) => {
    const prices: Record<string, number> = {
      starter: 128, // 99 + 29
      professional: 228, // 179 + 49
      business: 318, // 239 + 79
      webshop: 348 // 249 + 99
    }
    return prices[pkg] || 128
  }

  // Delete project
  const handleDeleteProject = async (projectId: string): Promise<boolean> => {
    try {
      const token = sessionStorage.getItem(TOKEN_KEY)
      const response = await fetch(`${API_BASE}/developer/projects?projectId=${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        // Remove from local state
        setProjects(prev => prev.filter(p => p.projectId !== projectId))
        setSelectedProject(null)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to delete project:', error)
      return false
    }
  }

  // Filter projects by search
  const filteredProjects = projects.filter(p => 
    p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group projects by phase for Kanban
  const projectsByPhase = (phases: ProjectPhase[]) => {
    return phases.reduce((acc, phase) => {
      acc[phase] = filteredProjects.filter(p => p.phase === phase)
      return acc
    }, {} as Record<ProjectPhase, Project[]>)
  }

  // Count unread messages
  const unreadCount = projects.reduce((sum, p) => 
    sum + p.messages.filter(m => !m.read && m.from === 'client').length, 0
  )

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  const phases: ProjectPhase[] = ['onboarding', 'design', 'design_approved', 'development', 'review']
  const liveProjects = filteredProjects.filter(p => p.phase === 'live')
  const activeProjects = filteredProjects.filter(p => p.phase !== 'live')
  const grouped = projectsByPhase(phases)

  // Get urgent projects for notification
  const urgentProjects = projects.filter(p => {
    const urgency = getProjectUrgency(p)
    return urgency.level === 'high' || urgency.level === 'medium'
  }).slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background gradient effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Premium Design */}
      <aside className={`fixed left-0 top-0 bottom-0 w-72 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 z-50 transform transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="white" />
            <span className="text-xs font-medium px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">
              Developer
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats in Sidebar */}
        <div className="p-4 border-b border-white/10">
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 rounded-xl p-4 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">MRR</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400">
              €{projects.filter(p => p.paymentStatus === 'paid' && p.phase === 'live').reduce((sum, p) => sum + (PACKAGE_CONFIG[p.package]?.price || 0), 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{liveProjects.length} actieve abonnementen</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {[
            { id: 'projects' as const, label: 'Projecten', icon: FolderKanban, count: activeProjects.length },
            { id: 'customers' as const, label: 'Klanten', icon: Users, count: projects.length },
            { id: 'messages' as const, label: 'Berichten', icon: MessageSquare, badge: unreadCount > 0 ? unreadCount : undefined },
            { id: 'payments' as const, label: 'Betalingen', icon: CreditCard },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition ${
                activeView === item.id
                  ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.count !== undefined && !item.badge && (
                <span className="ml-auto text-xs text-gray-500">{item.count}</span>
              )}
              {item.badge && item.badge > 0 && (
                <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-5 h-5" />
            Uitloggen
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen relative">
        {/* Header - Premium Glassmorphism */}
        <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center gap-4 px-4 lg:px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search - Enhanced */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Zoek projecten..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition"
              />
            </div>

            {/* Notifications with dropdown preview */}
            <div className="relative group">
              <button className="relative p-2.5 hover:bg-white/10 rounded-xl transition">
                <Bell className="w-5 h-5 text-gray-400" />
                {urgentProjects.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>
              
              {/* Notification dropdown */}
              <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform scale-95 group-hover:scale-100 origin-top-right">
                <div className="p-3 border-b border-white/10">
                  <h4 className="text-sm font-medium text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Aandacht nodig
                  </h4>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {urgentProjects.length > 0 ? urgentProjects.map(project => {
                    const urgency = getProjectUrgency(project)
                    return (
                      <button
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition text-left"
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          urgency.level === 'high' ? 'bg-red-500' : 'bg-amber-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{project.businessName}</p>
                          <p className="text-xs text-gray-500">{urgency.reason}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                    )
                  }) : (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Alles up-to-date!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 lg:p-6">
          {/* Hero Section - Only on Projects View */}
          {activeView === 'projects' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              {/* Hero Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                          🚀 Dashboard
                        </span>
                      </div>
                      <h1 className="text-2xl font-bold text-white mb-1">
                        Welkom terug, developer!
                      </h1>
                      <p className="text-white/80 text-sm">
                        {activeProjects.length} actieve projecten • {liveProjects.length} live websites
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      {urgentProjects.filter(p => getProjectUrgency(p).level === 'high').length > 0 && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/30 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                          <AlertCircle className="w-4 h-4" />
                          {urgentProjects.filter(p => getProjectUrgency(p).level === 'high').length} urgent
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {urgentProjects.slice(0, 3).map(project => {
                      const urgency = getProjectUrgency(project)
                      return (
                        <button
                          key={project.id}
                          onClick={() => setSelectedProject(project)}
                          className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium transition"
                        >
                          <span className={`w-2 h-2 rounded-full ${
                            urgency.level === 'high' ? 'bg-red-400 animate-pulse' : 'bg-amber-400'
                          }`} />
                          {project.businessName}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Stats - Hidden on Projects (shown in hero) */}
          {activeView !== 'projects' && <QuickStats projects={projects} />}

          {/* Projects View */}
          {activeView === 'projects' && (
            <div className="mt-2">
              {/* Active Projects Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Actieve projecten
                </h2>
                <div className="flex items-center gap-3">
                  {/* View Toggle */}
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('kanban')}
                      className={`p-2 rounded-lg transition ${viewMode === 'kanban' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                      title="Kanban weergave"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                      title="Lijst weergave"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    {activeProjects.length} actief
                  </span>
                </div>
              </div>

              {/* Kanban View - Enhanced */}
              {viewMode === 'kanban' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {phases.map(phase => {
                    const phaseInfo = PHASE_CONFIG[phase]
                    const phaseProjects = grouped[phase] || []
                    const gradient = PHASE_GRADIENTS[phase]
                    
                    return (
                      <div key={phase} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                        {/* Phase Header with Gradient */}
                        <div className={`bg-gradient-to-r ${gradient} p-3`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{phaseInfo.emoji}</span>
                              <span className="text-sm font-medium text-white">
                                {phaseInfo.label}
                              </span>
                            </div>
                            <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full font-medium">
                              {phaseProjects.length}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 space-y-2 min-h-[100px] max-h-[400px] overflow-y-auto">
                          {phaseProjects.map(project => {
                            const urgency = getProjectUrgency(project)
                            return (
                              <motion.div
                                key={project.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedProject(project)}
                                className={`relative p-3 bg-gray-900/50 border rounded-xl cursor-pointer transition group ${
                                  urgency.level === 'high' ? 'border-red-500/50 bg-red-500/5' :
                                  urgency.level === 'medium' ? 'border-amber-500/30' :
                                  'border-white/10 hover:border-white/20'
                                }`}
                              >
                                {/* Urgency indicator */}
                                {urgency.level !== 'none' && (
                                  <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                                    urgency.level === 'high' ? 'bg-red-500 animate-pulse' :
                                    urgency.level === 'medium' ? 'bg-amber-500' :
                                    'bg-blue-500'
                                  }`} />
                                )}
                                
                                <div className="flex items-start gap-2">
                                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm shrink-0">
                                    {PACKAGE_CONFIG[project.package]?.emoji}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-medium text-sm text-white truncate group-hover:text-emerald-400 transition">
                                      {project.businessName}
                                    </h4>
                                    <p className="text-xs text-gray-500 truncate">{project.contactName}</p>
                                    {urgency.level !== 'none' && (
                                      <p className={`text-xs mt-1 ${
                                        urgency.level === 'high' ? 'text-red-400' :
                                        urgency.level === 'medium' ? 'text-amber-400' :
                                        'text-blue-400'
                                      }`}>
                                        {urgency.reason}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Quick action on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition rounded-xl flex items-end justify-center pb-2">
                                  <span className="text-xs text-white flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> Bekijk details
                                  </span>
                                </div>
                              </motion.div>
                            )
                          })}
                          
                          {phaseProjects.length === 0 && (
                            <div className="text-center py-8 text-gray-600 text-sm">
                              Geen projecten
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* List View - Enhanced */}
              {viewMode === 'list' && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-white/5 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-white/10">
                    <div className="col-span-4">Project</div>
                    <div className="col-span-2">Fase</div>
                    <div className="col-span-2">Pakket</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Actie</div>
                  </div>
                  
                  {/* Table Body */}
                  <div className="divide-y divide-white/5">
                    {activeProjects.map(project => {
                      const phaseInfo = PHASE_CONFIG[project.phase]
                      const packageInfo = PACKAGE_CONFIG[project.package]
                      const urgency = getProjectUrgency(project)
                      const gradient = PHASE_GRADIENTS[project.phase]
                      
                      return (
                        <motion.div 
                          key={project.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => setSelectedProject(project)}
                          className={`grid grid-cols-12 gap-4 px-4 py-4 hover:bg-white/5 cursor-pointer transition items-center group ${
                            urgency.level === 'high' ? 'bg-red-500/5' : ''
                          }`}
                        >
                          <div className="col-span-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-sm shadow-lg`}>
                                {packageInfo?.emoji}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-white group-hover:text-emerald-400 transition">{project.businessName}</span>
                                  {urgency.level !== 'none' && (
                                    <span className={`w-2 h-2 rounded-full ${
                                      urgency.level === 'high' ? 'bg-red-500 animate-pulse' :
                                      urgency.level === 'medium' ? 'bg-amber-500' :
                                      'bg-blue-500'
                                    }`} />
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">{project.contactName}</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r ${gradient} text-white shadow-lg`}>
                              {phaseInfo?.emoji} {phaseInfo?.label}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-sm text-gray-300">{packageInfo?.name}</span>
                            <span className="text-xs text-gray-500 block">€{packageInfo?.price}/mnd</span>
                          </div>
                          <div className="col-span-2">
                            {urgency.level !== 'none' ? (
                              <span className={`text-xs font-medium ${
                                urgency.level === 'high' ? 'text-red-400' :
                                urgency.level === 'medium' ? 'text-amber-400' :
                                'text-blue-400'
                              }`}>
                                {urgency.reason}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(project.updatedAt).toLocaleDateString('nl-NL')}
                              </span>
                            )}
                          </div>
                          <div className="col-span-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-medium rounded-lg transition opacity-0 group-hover:opacity-100">
                              <Eye className="w-3 h-3" />
                              Bekijken
                            </button>
                          </div>
                        </motion.div>
                      )
                    })}
                    
                    {activeProjects.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        Geen actieve projecten
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Live Projects Section - Premium */}
              {liveProjects.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <button
                    onClick={() => setShowLiveProjects(!showLiveProjects)}
                    className="w-full relative overflow-hidden rounded-xl transition"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-600/20" />
                    <div className="relative flex items-center justify-between p-5 border border-green-500/30 rounded-xl hover:border-green-500/50 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                          <span className="text-xl">🚀</span>
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-white flex items-center gap-2">
                            Live websites
                            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                              {liveProjects.length}
                            </span>
                          </h3>
                          <p className="text-sm text-gray-400">
                            €{liveProjects.reduce((sum, p) => sum + (PACKAGE_CONFIG[p.package]?.price || 0), 0)}/maand aan abonnementen
                          </p>
                        </div>
                      </div>
                      <div className={`transition-transform ${showLiveProjects ? 'rotate-180' : ''}`}>
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {showLiveProjects && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
                          {liveProjects.map(project => {
                            const packageInfo = PACKAGE_CONFIG[project.package]
                            return (
                              <motion.div
                                key={project.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedProject(project)}
                                className="p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-green-500/30 transition group"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-sm">
                                      {packageInfo?.emoji}
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-sm text-white group-hover:text-green-400 transition">{project.businessName}</h4>
                                      <p className="text-xs text-gray-500">€{packageInfo?.price}/mnd</p>
                                    </div>
                                  </div>
                                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                </div>
                                {project.liveUrl && (
                                  <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={e => e.stopPropagation()}
                                    className="flex items-center gap-2 text-xs text-gray-500 hover:text-green-400 transition"
                                  >
                                    <Globe className="w-3 h-3" />
                                    {project.liveUrl.replace(/https?:\/\//, '')}
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </motion.div>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          )}

          {/* Messages View - Premium */}
          {activeView === 'messages' && (
            <div className="mt-6">
              {/* Messages Hero */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 mb-6">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                
                <div className="relative flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Berichten
                    </h1>
                    <p className="text-white/80 text-sm">
                      {unreadCount > 0 ? `${unreadCount} ongelezen berichten` : 'Alle berichten gelezen'}
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-sm font-medium">
                      {unreadCount} nieuw
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                {projects
                  .filter(p => p.messages.length > 0)
                  .sort((a, b) => {
                    const aLast = a.messages[a.messages.length - 1]?.date || a.createdAt
                    const bLast = b.messages[b.messages.length - 1]?.date || b.createdAt
                    return new Date(bLast).getTime() - new Date(aLast).getTime()
                  })
                  .map(project => {
                    const lastMessage = project.messages[project.messages.length - 1]
                    const unread = project.messages.filter(m => !m.read && m.from === 'client').length
                    const gradient = PHASE_GRADIENTS[project.phase]
                    
                    return (
                      <motion.div
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className={`relative overflow-hidden p-4 rounded-xl cursor-pointer transition group ${
                          unread > 0 
                            ? 'bg-blue-500/10 border-2 border-blue-500/40' 
                            : 'bg-white/5 border border-white/10 hover:border-white/20'
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        {/* Unread indicator line */}
                        {unread > 0 && (
                          <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gradient}`} />
                        )}
                        
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shrink-0 shadow-lg`}>
                              <span className="text-sm">{PACKAGE_CONFIG[project.package]?.emoji}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-white group-hover:text-blue-400 transition">{project.businessName}</h3>
                                {unread > 0 && (
                                  <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full animate-pulse">
                                    {unread} nieuw
                                  </span>
                                )}
                              </div>
                              {lastMessage && (
                                <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                                  {lastMessage.from === 'developer' && (
                                    <span className="text-emerald-400">Jij: </span>
                                  )}
                                  {lastMessage.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs text-gray-500">
                              {lastMessage && new Date(lastMessage.date).toLocaleDateString('nl-NL')}
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-600 mt-2 ml-auto group-hover:text-blue-400 transition" />
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                
                {projects.filter(p => p.messages.length > 0).length === 0 && (
                  <div className="text-center py-16 text-gray-500">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 opacity-50" />
                    </div>
                    <p className="font-medium mb-1">Nog geen berichten</p>
                    <p className="text-sm text-gray-600">Berichten van klanten verschijnen hier</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payments View - Premium */}
          {activeView === 'payments' && (
            <div className="mt-6">
              {/* Payments Hero */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 mb-6">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                
                <div className="relative flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Betalingen
                    </h1>
                    <p className="text-white/80 text-sm">
                      Beheer facturen en bekijk inkomsten
                    </p>
                  </div>
                  
                  {/* Quick Action: Create payment for any project */}
                  {projects.length > 0 && (
                    <div className="relative">
                      <select 
                        onChange={(e) => {
                          const project = projects.find(p => p.projectId === e.target.value)
                          if (project) openPaymentModal(project)
                          e.target.value = ''
                        }}
                        className="appearance-none bg-white/20 hover:bg-white/30 text-white font-medium py-2.5 pl-4 pr-10 rounded-xl transition cursor-pointer border border-white/20"
                      >
                        <option value="" className="bg-gray-800 text-white">+ Nieuwe betaling</option>
                        {projects.map(project => (
                          <option key={project.projectId} value={project.projectId} className="bg-gray-800 text-white">
                            {project.businessName} - {PACKAGE_CONFIG[project.package]?.name || 'Website'}
                          </option>
                        ))}
                      </select>
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Revenue Stats - Premium Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 rounded-2xl p-6 border border-emerald-500/20"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Maandelijkse Inkomsten (MRR)</p>
                    <p className="text-3xl font-bold text-emerald-400">
                      €{projects.filter(p => p.paymentStatus === 'paid' && p.phase === 'live').reduce((sum, p) => sum + (PACKAGE_CONFIG[p.package]?.price || 0), 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">{liveProjects.filter(p => p.paymentStatus === 'paid').length} actieve abonnementen</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative overflow-hidden bg-gradient-to-br from-amber-500/20 to-amber-600/5 rounded-2xl p-6 border border-amber-500/20"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                        <Euro className="w-6 h-6 text-amber-400" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Openstaand</p>
                    <p className="text-3xl font-bold text-amber-400">
                      €{projects.filter(p => p.phase === 'design_approved' && p.paymentStatus !== 'paid').reduce((sum, p) => sum + getFirstPayment(p.package), 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {projects.filter(p => p.phase === 'design_approved' && p.paymentStatus !== 'paid').length} wachtend op betaling
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-blue-600/5 rounded-2xl p-6 border border-blue-500/20"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Betaald</p>
                    <p className="text-3xl font-bold text-blue-400">
                      {projects.filter(p => p.paymentStatus === 'paid').length}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Projecten met betaling ontvangen</p>
                  </div>
                </motion.div>
              </div>
              
              {/* Awaiting Payment - Premium */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-amber-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  Wacht op betaling
                </h3>
                <div className="space-y-3">
                  {projects
                    .filter(p => p.phase === 'design_approved' && p.paymentStatus !== 'paid')
                    .map(project => {
                      const packageInfo = PACKAGE_CONFIG[project.package]
                      const gradient = PHASE_GRADIENTS[project.phase]
                      return (
                        <motion.div 
                          key={project.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-xl hover:border-amber-500/30 transition group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-lg shadow-lg`}>
                              {packageInfo?.emoji}
                            </div>
                            <div>
                              <h4 className="font-medium text-white group-hover:text-amber-400 transition">{project.businessName}</h4>
                              <p className="text-sm text-gray-500">{packageInfo?.name} pakket • {project.contactEmail}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xl font-bold text-amber-400">€{getFirstPayment(project.package)}</p>
                              <p className="text-xs text-gray-500">Eerste betaling</p>
                            </div>
                            {project.paymentUrl ? (
                              <a
                                href={project.paymentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Link
                              </a>
                            ) : (
                              <button
                                onClick={() => openPaymentModal(project)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-amber-500/20"
                              >
                                <Mail className="w-4 h-4" />
                                Stuur betaallink
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  
                  {projects.filter(p => p.phase === 'design_approved' && p.paymentStatus !== 'paid').length === 0 && (
                    <div className="text-center py-10 text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">Geen openstaande betalingen</p>
                      <p className="text-sm text-gray-600 mt-1">Alle facturen zijn betaald</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recently Paid - Premium */}
              <div>
                <h3 className="text-sm font-medium text-green-400 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Recent betaald
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {projects
                    .filter(p => p.paymentStatus === 'paid')
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .slice(0, 10)
                    .map(project => {
                      const packageInfo = PACKAGE_CONFIG[project.package]
                      const gradient = PHASE_GRADIENTS[project.phase]
                      return (
                        <motion.div 
                          key={project.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => setSelectedProject(project)}
                          className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 cursor-pointer transition group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-sm shadow-lg`}>
                              {packageInfo?.emoji}
                            </div>
                            <div>
                              <h4 className="font-medium text-white text-sm group-hover:text-green-400 transition">{project.businessName}</h4>
                              <p className="text-xs text-gray-500">{packageInfo?.name} • €{packageInfo?.price}/mnd</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-400 bg-green-500/20 px-2.5 py-1 rounded-lg font-medium">✓ Betaald</span>
                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-green-400 transition" />
                          </div>
                        </motion.div>
                      )
                    })}
                </div>
              </div>
            </div>
          )}

          {/* Customers View - Premium */}
          {activeView === 'customers' && (
            <div className="mt-6">
              {/* Customers Hero */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 mb-6">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                
                <div className="relative flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Klanten
                    </h1>
                    <p className="text-white/80 text-sm">
                      {projects.length} klanten • €{projects.filter(p => p.phase === 'live').reduce((sum, p) => sum + (PACKAGE_CONFIG[p.package]?.price || 0), 0)}/mnd MRR
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium flex items-center gap-1.5">
                      <Globe className="w-4 h-4" />
                      {liveProjects.length} live
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Customers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects
                  .sort((a, b) => a.businessName.localeCompare(b.businessName))
                  .map(project => {
                    const phaseInfo = PHASE_CONFIG[project.phase]
                    const packageInfo = PACKAGE_CONFIG[project.package]
                    const gradient = PHASE_GRADIENTS[project.phase]
                    const urgency = getProjectUrgency(project)
                    
                    return (
                      <motion.div 
                        key={project.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedProject(project)}
                        className={`relative overflow-hidden p-5 bg-white/5 border rounded-xl cursor-pointer transition group ${
                          urgency.level === 'high' ? 'border-red-500/40' : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* Phase indicator line */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gradient}`} />
                        
                        {/* Urgency badge */}
                        {urgency.level !== 'none' && (
                          <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${
                            urgency.level === 'high' ? 'bg-red-500 animate-pulse' :
                            urgency.level === 'medium' ? 'bg-amber-500' :
                            'bg-blue-500'
                          }`} />
                        )}
                        
                        <div className="flex items-start gap-4 pl-3">
                          <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-xl font-semibold text-white shadow-lg shrink-0`}>
                            {project.businessName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white group-hover:text-emerald-400 transition">{project.businessName}</h4>
                            <p className="text-sm text-gray-500 mb-3">{project.contactName}</p>
                            
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${gradient} text-white`}>
                                {phaseInfo?.emoji} {phaseInfo?.label}
                              </span>
                              <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-lg">
                                {packageInfo?.name} • €{packageInfo?.price}/mnd
                              </span>
                              {project.paymentStatus === 'paid' && (
                                <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">✓ Betaald</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Contact actions */}
                        <div className="flex items-center gap-2 mt-4 pl-3">
                          <a
                            href={`mailto:${project.contactEmail}`}
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 text-xs rounded-lg transition"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            Email
                          </a>
                          {project.contactPhone && (
                            <a
                              href={`tel:${project.contactPhone}`}
                              onClick={e => e.stopPropagation()}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-green-500/20 text-gray-400 hover:text-green-400 text-xs rounded-lg transition"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              Bellen
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 text-xs rounded-lg transition"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              Website
                            </a>
                          )}
                          <div className="ml-auto">
                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition" />
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                  
                {projects.length === 0 && (
                  <div className="col-span-2 text-center py-16 text-gray-500 bg-white/5 rounded-xl border border-white/10">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">Nog geen klanten</p>
                    <p className="text-sm text-gray-600 mt-1">Nieuwe klanten verschijnen hier</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onUpdate={handleUpdateProject}
            onSendPaymentLink={openPaymentModal}
            onDelete={handleDeleteProject}
          />
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {paymentModal.open && paymentModal.project && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closePaymentModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-b from-gray-900 to-gray-950 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="relative p-6 pb-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-b border-white/10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
                <button
                  onClick={closePaymentModal}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <Euro className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Betaallink versturen</h2>
                    <p className="text-sm text-gray-400">Via Mollie naar {paymentModal.project.contactEmail}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* Success State */}
                {paymentModal.success && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Betaallink verstuurd! ✨</h3>
                    <p className="text-gray-400">De klant ontvangt de link per e-mail</p>
                  </motion.div>
                )}

                {/* Error State */}
                {paymentModal.error && (
                  <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-400">Er ging iets mis</p>
                      <p className="text-sm text-red-300/70">{paymentModal.error}</p>
                    </div>
                  </div>
                )}

                {/* Form - Only show when not success */}
                {!paymentModal.success && (
                  <>
                    {/* Project Info */}
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{paymentModal.project.businessName}</p>
                          <p className="text-sm text-gray-400">{PACKAGE_CONFIG[paymentModal.project.package]?.name || 'Website'} pakket</p>
                        </div>
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bedrag (€)
                      </label>
                      <div className="relative">
                        <Euro className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition text-lg font-medium"
                          placeholder="0.00"
                          min="1"
                          step="0.01"
                        />
                      </div>
                    </div>

                    {/* Description Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Omschrijving
                      </label>
                      <input
                        type="text"
                        value={paymentDescription}
                        onChange={(e) => setPaymentDescription(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition"
                        placeholder="Omschrijving voor de klant..."
                      />
                    </div>

                    {/* Send Button */}
                    <button
                      onClick={() => handleSendPaymentLink(
                        paymentModal.project!,
                        parseFloat(paymentAmount) || undefined,
                        paymentDescription || undefined
                      )}
                      disabled={paymentModal.loading || !paymentAmount || parseFloat(paymentAmount) < 1}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {paymentModal.loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Betaallink aanmaken...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Verstuur betaallink</span>
                        </>
                      )}
                    </button>

                    {/* Info text */}
                    <p className="text-xs text-center text-gray-500">
                      De klant ontvangt een e-mail met een beveiligde Mollie betaallink
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
