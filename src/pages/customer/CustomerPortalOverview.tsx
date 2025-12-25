/**
 * Customer Portal Overview - Dashboard Home
 * 
 * Overzicht van:
 * - Actieve projecten met status
 * - Openstaande acties
 * - Recente activiteit
 * - Quick links
 */

import { Link, useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FolderOpen,
  ExternalLink,
  Clock,
  Globe,
  AlertCircle,
  ArrowRight,
  Rocket,
  Palette,
  FileText,
  MessageSquare,
  CreditCard,
  Edit3,
  TrendingUp,
  Sparkles,
  RefreshCw,
  ChevronRight
} from 'lucide-react'

// Types
interface ProjectSummary {
  projectId: string
  businessName: string
  status: string
  type: string
  package: string
  unreadMessages?: number
  pendingActions?: number
  liveUrl?: string
  designPreviewUrl?: string
  createdAt?: string
  updatedAt?: string
}

interface CustomerPortalContext {
  session: {
    email: string
    name: string
    projectIds: string[]
  } | null
  projects: ProjectSummary[]
  notifications: Array<{
    id: string
    type: string
    title: string
    message: string
    read: boolean
    createdAt: string
  }>
  fetchProjects: (email: string) => Promise<void>
}

// Status configuration
const STATUS_CONFIG: Record<string, {
  label: string
  color: string
  bgColor: string
  icon: typeof FileText
  description: string
}> = {
  onboarding: {
    label: 'Onboarding',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/20',
    icon: FileText,
    description: 'Vul je bedrijfsgegevens in'
  },
  design: {
    label: 'Design',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/20',
    icon: Palette,
    description: 'We werken aan je ontwerp'
  },
  feedback: {
    label: 'Feedback',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/20',
    icon: MessageSquare,
    description: 'Bekijk en geef feedback'
  },
  revisie: {
    label: 'Revisie',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/20',
    icon: RefreshCw,
    description: 'We verwerken je feedback'
  },
  payment: {
    label: 'Betaling',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/20',
    icon: CreditCard,
    description: 'Rond je betaling af'
  },
  domain: {
    label: 'Domein',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/20',
    icon: Globe,
    description: 'Domein configureren'
  },
  live: {
    label: 'Live',
    color: 'text-green-500',
    bgColor: 'bg-green-500/20',
    icon: Rocket,
    description: 'Je website is online!'
  }
}

// Quick action cards
const QUICK_ACTIONS = [
  {
    id: 'new-change',
    title: 'Wijziging aanvragen',
    description: 'Vraag een aanpassing aan op je website',
    icon: Edit3,
    link: '/portaal/wijzigingen/nieuw',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'view-analytics',
    title: 'Analytics bekijken',
    description: 'Bekijk bezoekersstatistieken',
    icon: TrendingUp,
    link: '/portaal/analytics',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'contact-support',
    title: 'Support',
    description: 'Stel je vraag aan ons team',
    icon: MessageSquare,
    link: '/portaal/support',
    color: 'from-emerald-500 to-teal-500'
  }
]

export default function CustomerPortalOverview() {
  const context = useOutletContext<CustomerPortalContext>()
  const { session, projects } = context || { session: null, projects: [] }
  
  // Calculate stats
  const liveProjects = projects.filter(p => p.status === 'live')
  const activeProjects = projects.filter(p => p.status !== 'live')
  const totalUnreadMessages = projects.reduce((sum, p) => sum + (p.unreadMessages || 0), 0)
  const totalPendingActions = projects.reduce((sum, p) => sum + (p.pendingActions || 0), 0)
  
  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Goedemorgen'
    if (hour < 18) return 'Goedemiddag'
    return 'Goedenavond'
  }

  // Format relative time
  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Vandaag'
    if (diffDays === 1) return 'Gisteren'
    if (diffDays < 7) return `${diffDays} dagen geleden`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weken geleden`
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 via-primary-600 to-purple-600 rounded-2xl p-6 lg:p-8 text-white shadow-xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-primary-100 text-sm">{getGreeting()}</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              Welkom terug, {session?.name?.split(' ')[0] || 'Klant'}!
            </h1>
            <p className="text-primary-100">
              {projects.length === 0 
                ? 'Je hebt nog geen projecten.'
                : projects.length === 1
                  ? 'Je hebt 1 project.'
                  : `Je hebt ${projects.length} projecten.`
              }
              {totalPendingActions > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-sm">
                  {totalPendingActions} actie{totalPendingActions > 1 ? 's' : ''} nodig
                </span>
              )}
            </p>
          </div>
          
          {liveProjects.length > 0 && (
            <a
              href={liveProjects[0].liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary-600 font-medium rounded-xl hover:bg-primary-50 transition shadow-lg"
            >
              <Globe className="w-5 h-5" />
              Bekijk website
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
          <div>
            <p className="text-3xl font-bold">{projects.length}</p>
            <p className="text-primary-100 text-sm">Projecten</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{liveProjects.length}</p>
            <p className="text-primary-100 text-sm">Live websites</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{totalUnreadMessages}</p>
            <p className="text-primary-100 text-sm">Ongelezen berichten</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{totalPendingActions}</p>
            <p className="text-primary-100 text-sm">Openstaande acties</p>
          </div>
        </div>
      </motion.div>

      {/* Active Projects */}
      {activeProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Actieve projecten
            </h2>
            <Link
              to="/portaal/projecten"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              Alle projecten
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProjects.slice(0, 4).map((project, index) => {
              const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.onboarding
              const StatusIcon = statusConfig.icon
              
              return (
                <motion.div
                  key={project.projectId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    to={`/status/${project.projectId}`}
                    className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
                          {project.businessName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {project.type} • {project.package}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{statusConfig.label}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {statusConfig.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {formatRelativeTime(project.updatedAt || project.createdAt)}
                      </span>
                      <span className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        Bekijken
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>

                    {/* Pending Actions Badge */}
                    {(project.pendingActions || 0) > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">
                          {project.pendingActions} actie{(project.pendingActions || 0) > 1 ? 's' : ''} nodig
                        </span>
                      </div>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Live Projects */}
      {liveProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Rocket className="w-5 h-5 text-green-500" />
              Live websites
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveProjects.map((project, index) => (
              <motion.div
                key={project.projectId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 border border-emerald-500/30 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {project.businessName}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-green-600 dark:text-green-400">Online</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Bekijken
                    </a>
                  )}
                  <Link
                    to={`/status/${project.projectId}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition text-sm"
                  >
                    <FolderOpen className="w-4 h-4" />
                    Dashboard
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-500" />
          Snelle acties
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Link
                  to={action.link}
                  className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {action.description}
                  </p>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Empty State */}
      {projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <FolderOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nog geen projecten
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Start vandaag nog met je eerste website project.
          </p>
          <Link
            to="/start"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition shadow-lg shadow-primary-500/25"
          >
            <Sparkles className="w-5 h-5" />
            Start een project
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      )}
    </div>
  )
}
