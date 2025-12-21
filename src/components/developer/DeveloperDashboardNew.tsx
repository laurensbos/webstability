/**
 * Developer Dashboard - Simplified & Optimized
 * 
 * Vereenvoudigd dashboard met focus op:
 * - Projecten beheer (Kanban)
 * - Berichten
 * - Betalingen
 * 
 * Werkt samen met klant ProjectStatus pagina via Redis
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
  CheckCircle2
} from 'lucide-react'
import Logo from '../Logo'
import QuickStats from './QuickStats'
import ProjectCard from './ProjectCard'
import ProjectDetailModal from './ProjectDetailModal'
import type { Project, DashboardView, ProjectPhase } from './types'
import { PHASE_CONFIG, PACKAGE_CONFIG } from './types'

// Constants
const TOKEN_KEY = 'webstability_dev_token'

// API URL
const API_BASE = '/api'

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
  const handleSendPaymentLink = async (project: Project) => {
    try {
      const token = sessionStorage.getItem(TOKEN_KEY)
      const response = await fetch(`${API_BASE}/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: project.projectId,
          amount: getFirstPayment(project.package),
          description: `Eerste betaling - ${project.businessName}`,
          customerEmail: project.contactEmail,
          customerName: project.contactName,
          packageName: project.package,
          sendEmail: true
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.checkoutUrl) {
          handleUpdateProject({
            ...project,
            paymentUrl: data.checkoutUrl,
            paymentStatus: 'awaiting_payment'
          })
        }
      }
    } catch (error) {
      console.error('Failed to create payment:', error)
    }
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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 z-50 transform transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <Logo variant="white" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {[
            { id: 'projects' as const, label: 'Projecten', icon: FolderKanban },
            { id: 'customers' as const, label: 'Klanten', icon: Users },
            { id: 'messages' as const, label: 'Berichten', icon: MessageSquare, badge: unreadCount > 0 ? unreadCount : undefined },
            { id: 'payments' as const, label: 'Betalingen', icon: CreditCard },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeView === item.id
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.badge && item.badge > 0 && (
                <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 transition"
          >
            <LogOut className="w-5 h-5" />
            Uitloggen
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
          <div className="flex items-center gap-4 px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Zoek projecten..."
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-800 rounded-lg">
              <Bell className="w-5 h-5 text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 lg:p-6">
          {/* Quick Stats */}
          <QuickStats projects={projects} />

          {/* Projects View */}
          {activeView === 'projects' && (
            <div className="mt-6">
              {/* Active Projects Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Actieve projecten</h2>
                <div className="flex items-center gap-3">
                  {/* View Toggle */}
                  <div className="flex items-center bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('kanban')}
                      className={`p-2 rounded-md transition ${viewMode === 'kanban' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}
                      title="Kanban weergave"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}
                      title="Lijst weergave"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">{activeProjects.length} actief</span>
                </div>
              </div>

              {/* Kanban View */}
              {viewMode === 'kanban' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {phases.map(phase => {
                    const phaseInfo = PHASE_CONFIG[phase]
                    const phaseProjects = grouped[phase] || []
                    
                    return (
                      <div key={phase} className="bg-gray-900/50 rounded-xl p-3 border border-gray-800">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span>{phaseInfo.emoji}</span>
                            <span className={`text-sm font-medium ${phaseInfo.color}`}>
                              {phaseInfo.label}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                            {phaseProjects.length}
                          </span>
                        </div>

                        <div className="space-y-2 min-h-[100px] max-h-[400px] overflow-y-auto">
                          {phaseProjects.map(project => (
                            <ProjectCard
                              key={project.id}
                              project={project}
                              onClick={() => setSelectedProject(project)}
                            />
                          ))}
                          
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

              {/* List View */}
              {viewMode === 'list' && (
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-800/50 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="col-span-4">Project</div>
                    <div className="col-span-2">Fase</div>
                    <div className="col-span-2">Pakket</div>
                    <div className="col-span-2">Betaling</div>
                    <div className="col-span-2">Laatste update</div>
                  </div>
                  
                  {/* Table Body */}
                  <div className="divide-y divide-gray-800">
                    {activeProjects.map(project => {
                      const phaseInfo = PHASE_CONFIG[project.phase]
                      const packageInfo = PACKAGE_CONFIG[project.package]
                      const unread = project.messages.filter(m => !m.read && m.from === 'client').length
                      
                      return (
                        <div 
                          key={project.id}
                          onClick={() => setSelectedProject(project)}
                          className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-800/50 cursor-pointer transition items-center"
                        >
                          <div className="col-span-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-sm">
                                {packageInfo?.emoji}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-white">{project.businessName}</span>
                                  {unread > 0 && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">{project.contactName}</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${phaseInfo?.bgColor} ${phaseInfo?.color}`}>
                              {phaseInfo?.emoji} {phaseInfo?.label}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-sm text-gray-300">{packageInfo?.name}</span>
                            <span className="text-xs text-gray-500 block">€{packageInfo?.price}/mnd</span>
                          </div>
                          <div className="col-span-2">
                            <span className={`text-sm ${
                              project.paymentStatus === 'paid' ? 'text-green-400' :
                              project.paymentStatus === 'awaiting_payment' ? 'text-amber-400' :
                              'text-gray-400'
                            }`}>
                              {project.paymentStatus === 'paid' ? '✓ Betaald' :
                               project.paymentStatus === 'awaiting_payment' ? '⏳ Wachtend' :
                               '○ Open'}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-sm text-gray-400">
                              {new Date(project.updatedAt).toLocaleDateString('nl-NL')}
                            </span>
                          </div>
                        </div>
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

              {/* Live Projects Section - Collapsible */}
              {liveProjects.length > 0 && (
                <div className="mt-8">
                  <button
                    onClick={() => setShowLiveProjects(!showLiveProjects)}
                    className="w-full flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl hover:bg-green-500/15 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🚀</span>
                      <div className="text-left">
                        <h3 className="font-semibold text-green-400">Live websites</h3>
                        <p className="text-sm text-gray-400">{liveProjects.length} websites online</p>
                      </div>
                    </div>
                    <div className={`transition-transform ${showLiveProjects ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
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
                          {liveProjects.map(project => (
                            <ProjectCard
                              key={project.id}
                              project={project}
                              onClick={() => setSelectedProject(project)}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {/* Messages View */}
          {activeView === 'messages' && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Berichten</h2>
              
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
                    
                    return (
                      <motion.div
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className={`p-4 rounded-xl cursor-pointer transition ${
                          unread > 0 
                            ? 'bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/50' 
                            : 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-white">{project.businessName}</h3>
                              {unread > 0 && (
                                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                                  {unread} nieuw
                                </span>
                              )}
                            </div>
                            {lastMessage && (
                              <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                                {lastMessage.from === 'developer' ? 'Jij: ' : ''}
                                {lastMessage.message}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {lastMessage && new Date(lastMessage.date).toLocaleDateString('nl-NL')}
                          </span>
                        </div>
                      </motion.div>
                    )
                  })}
                
                {projects.filter(p => p.messages.length > 0).length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nog geen berichten</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payments View - Enhanced */}
          {activeView === 'payments' && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-6">Betalingen</h2>
              
              {/* Revenue Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl p-5 border border-emerald-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">MRR</p>
                      <p className="text-2xl font-bold text-emerald-400">
                        €{projects.filter(p => p.paymentStatus === 'paid' && p.phase === 'live').reduce((sum, p) => sum + (PACKAGE_CONFIG[p.package]?.price || 0), 0)}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Maandelijks terugkerende inkomsten</p>
                </div>
                
                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl p-5 border border-amber-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <Euro className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Openstaand</p>
                      <p className="text-2xl font-bold text-amber-400">
                        €{projects.filter(p => p.phase === 'design_approved' && p.paymentStatus !== 'paid').reduce((sum, p) => sum + getFirstPayment(p.package), 0)}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {projects.filter(p => p.phase === 'design_approved' && p.paymentStatus !== 'paid').length} betalingen wachtend
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-5 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Betaald</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {projects.filter(p => p.paymentStatus === 'paid').length}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Projecten met betaling ontvangen</p>
                </div>
              </div>
              
              {/* Awaiting Payment */}
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
                      return (
                        <div 
                          key={project.id}
                          className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-amber-500/30 transition group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-lg">
                              {packageInfo?.emoji}
                            </div>
                            <div>
                              <h4 className="font-medium text-white group-hover:text-amber-400 transition">{project.businessName}</h4>
                              <p className="text-sm text-gray-500">{packageInfo?.name} pakket • {project.contactEmail}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-lg font-semibold text-amber-400">€{getFirstPayment(project.package)}</p>
                              <p className="text-xs text-gray-500">Eerste betaling</p>
                            </div>
                            {project.paymentUrl ? (
                              <a
                                href={project.paymentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Link bekijken
                              </a>
                            ) : (
                              <button
                                onClick={() => handleSendPaymentLink(project)}
                                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-amber-500/20"
                              >
                                <Mail className="w-4 h-4" />
                                Stuur betaallink
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  
                  {projects.filter(p => p.phase === 'design_approved' && p.paymentStatus !== 'paid').length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
                      <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p>Geen openstaande betalingen</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recently Paid */}
              <div>
                <h3 className="text-sm font-medium text-green-400 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Recent betaald
                </h3>
                <div className="space-y-2">
                  {projects
                    .filter(p => p.paymentStatus === 'paid')
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .slice(0, 10)
                    .map(project => {
                      const packageInfo = PACKAGE_CONFIG[project.package]
                      return (
                        <div 
                          key={project.id}
                          onClick={() => setSelectedProject(project)}
                          className="flex items-center justify-between p-3 bg-gray-900/30 border border-gray-800 rounded-xl hover:bg-gray-900/50 cursor-pointer transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-sm">
                              {packageInfo?.emoji}
                            </div>
                            <div>
                              <h4 className="font-medium text-white text-sm">{project.businessName}</h4>
                              <p className="text-xs text-gray-500">{packageInfo?.name} • €{packageInfo?.price}/mnd</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">✓ Betaald</span>
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          )}

          {/* Customers View */}
          {activeView === 'customers' && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Klanten</h2>
                <span className="text-sm text-gray-500">{projects.length} klanten</span>
              </div>
              
              {/* Customers List */}
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
                <div className="divide-y divide-gray-800">
                  {projects
                    .sort((a, b) => a.businessName.localeCompare(b.businessName))
                    .map(project => {
                      const phaseInfo = PHASE_CONFIG[project.phase]
                      const packageInfo = PACKAGE_CONFIG[project.package]
                      
                      return (
                        <div 
                          key={project.id}
                          onClick={() => setSelectedProject(project)}
                          className="flex items-center justify-between p-4 hover:bg-gray-800/50 cursor-pointer transition group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl flex items-center justify-center text-lg font-semibold text-emerald-400">
                              {project.businessName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-medium text-white group-hover:text-emerald-400 transition">{project.businessName}</h4>
                              <div className="flex items-center gap-3 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {project.contactName}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {project.contactEmail}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${phaseInfo?.bgColor} ${phaseInfo?.color}`}>
                                {phaseInfo?.emoji} {phaseInfo?.label}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-300">{packageInfo?.name}</p>
                              <p className="text-xs text-gray-500">€{packageInfo?.price}/mnd</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={e => e.stopPropagation()}
                                  className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-emerald-400 transition"
                                  title="Bekijk website"
                                >
                                  <Globe className="w-4 h-4" />
                                </a>
                              )}
                              <a
                                href={`mailto:${project.contactEmail}`}
                                onClick={e => e.stopPropagation()}
                                className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-blue-400 transition"
                                title="Stuur e-mail"
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                              {project.contactPhone && (
                                <a
                                  href={`tel:${project.contactPhone}`}
                                  onClick={e => e.stopPropagation()}
                                  className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-green-400 transition"
                                  title="Bel klant"
                                >
                                  <Phone className="w-4 h-4" />
                                </a>
                              )}
                              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition" />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    
                  {projects.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Nog geen klanten</p>
                    </div>
                  )}
                </div>
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
            onSendPaymentLink={handleSendPaymentLink}
            onDelete={handleDeleteProject}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
