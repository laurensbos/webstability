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
  Loader2
} from 'lucide-react'
import Logo from '../Logo'
import QuickStats from './QuickStats'
import ProjectCard from './ProjectCard'
import ProjectDetailModal from './ProjectDetailModal'
import type { Project, DashboardView, ProjectPhase } from './types'
import { PHASE_CONFIG } from './types'

// Constants
const AUTH_KEY = 'webstability_dev_auth'
const TOKEN_KEY = 'webstability_dev_token'
const DEV_PASSWORD = 'N45eqtu2!jz8j0v'

// API URL
const API_BASE = '/api'

export default function DeveloperDashboard() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  
  // Dashboard state
  const [activeView, setActiveView] = useState<DashboardView>('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Check auth on mount
  useEffect(() => {
    const auth = sessionStorage.getItem(AUTH_KEY)
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) return
    
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
  }, [isAuthenticated])

  // Fetch on mount and poll
  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects()
      const interval = setInterval(fetchProjects, 30000) // Poll every 30s
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, fetchProjects])

  // Handle login
  const handleLogin = () => {
    if (password === DEV_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true')
      sessionStorage.setItem(TOKEN_KEY, btoa(password))
      setIsAuthenticated(true)
      setAuthError('')
    } else {
      setAuthError('Onjuist wachtwoord')
    }
  }

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    setIsAuthenticated(false)
    setProjects([])
  }

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

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <Logo variant="white" />
            <p className="text-gray-400 mt-2">Developer Dashboard</p>
          </div>
          
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Wachtwoord"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 mb-4"
            />
            
            {authError && (
              <p className="text-red-400 text-sm mb-4">{authError}</p>
            )}
            
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-400 hover:to-teal-400 transition"
            >
              Inloggen
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  const phases: ProjectPhase[] = ['onboarding', 'design', 'design_approved', 'development', 'review', 'live']
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
            { id: 'messages' as const, label: 'Berichten', icon: MessageSquare, badge: unreadCount },
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

          {/* Projects View - Kanban */}
          {activeView === 'projects' && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Projecten</h2>
                <span className="text-sm text-gray-500">{filteredProjects.length} projecten</span>
              </div>

              {/* Kanban Board */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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

                      <div className="space-y-2 min-h-[100px]">
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

          {/* Payments View */}
          {activeView === 'payments' && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Betalingen</h2>
              
              {/* Awaiting Payment */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-amber-400 mb-3">⏳ Wacht op betaling</h3>
                <div className="space-y-2">
                  {projects
                    .filter(p => p.phase === 'design_approved' && p.paymentStatus !== 'paid')
                    .map(project => (
                      <div 
                        key={project.id}
                        className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl"
                      >
                        <div>
                          <h4 className="font-medium text-white">{project.businessName}</h4>
                          <p className="text-sm text-gray-400">{project.contactEmail}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-amber-400 font-medium">
                            €{getFirstPayment(project.package)}
                          </span>
                          {project.paymentUrl ? (
                            <span className="text-xs text-amber-400">Link verstuurd</span>
                          ) : (
                            <button
                              onClick={() => handleSendPaymentLink(project)}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium rounded-lg transition"
                            >
                              Stuur link
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  
                  {projects.filter(p => p.phase === 'design_approved' && p.paymentStatus !== 'paid').length === 0 && (
                    <p className="text-gray-500 text-sm">Geen openstaande betalingen</p>
                  )}
                </div>
              </div>

              {/* Paid */}
              <div>
                <h3 className="text-sm font-medium text-green-400 mb-3">✓ Betaald</h3>
                <div className="space-y-2">
                  {projects
                    .filter(p => p.paymentStatus === 'paid')
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .slice(0, 10)
                    .map(project => (
                      <div 
                        key={project.id}
                        className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
                      >
                        <div>
                          <h4 className="font-medium text-white">{project.businessName}</h4>
                          <p className="text-sm text-gray-400">{project.package} pakket</p>
                        </div>
                        <span className="text-green-400">✓ Betaald</span>
                      </div>
                    ))}
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
