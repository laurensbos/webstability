import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock,
  LogOut,
  LayoutDashboard,
  Users,
  FolderKanban,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  FileText,
  Palette,
  Code,
  Rocket,
  ChevronRight,
  Search,
  Edit3,
  Send,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  Calendar,
  TrendingUp,
  CreditCard,
  RefreshCw,
  Settings,
  Upload,
  Download,
  Pause,
  MoreVertical,
  ArrowUpRight,
  Bell,
  Moon,
  Sun,
  Plus,
  Camera,
  PenTool,
  X,
  Check,
  Save,
  Building,
  BarChart3,
  DollarSign,
  Briefcase,
  HelpCircle,
  BookOpen,
  Lightbulb,
  MousePointer,
  ArrowRight,
  Target,
  Zap
} from 'lucide-react'
import Logo from '../components/Logo'
import KanbanBoard, { type KanbanTask, getDefaultColumns } from '../components/KanbanBoard'
import type { 
  DeveloperProject, 
  ProjectPhase, 
  PackageConfig
} from '../types/developer'

// ===========================================
// TYPES
// ===========================================

type DashboardTab = 'overview' | 'projects' | 'kanban' | 'clients' | 'billing' | 'services' | 'settings'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  company: string
  address?: string
  city?: string
  projects: string[] // projectIds
  totalSpent: number
  createdAt: string
  notes?: string
}

interface ServiceRequest {
  id: string
  type: 'drone' | 'logo' | 'foto' | 'tekst' | 'seo'
  clientName: string
  clientEmail: string
  clientPhone: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  price?: number
  createdAt: string
  completedAt?: string
  notes?: string
}

interface Notification {
  id: string
  type: 'message' | 'change_request' | 'payment' | 'deadline' | 'service'
  title: string
  message: string
  projectId?: string
  read: boolean
  createdAt: string
}

// ===========================================
// CONSTANTEN
// ===========================================

const API_BASE = '/api/developer'
const AUTH_KEY = 'webstability_dev_auth'
const TOKEN_KEY = 'webstability_dev_token'
const DARK_MODE_KEY = 'webstability_dark_mode'

// Lokaal developer wachtwoord (voor development mode)
const DEV_PASSWORD = 'N45eqtu2!jz8j0v'

// Phase kleuren
const phaseColors: Record<ProjectPhase, { bg: string; text: string; border: string }> = {
  onboarding: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  design: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  development: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  review: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
  live: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
}

// Phase icons
const PhaseIcon = ({ phase, className = "w-5 h-5" }: { phase: ProjectPhase; className?: string }) => {
  switch (phase) {
    case 'onboarding': return <FileText className={className} />
    case 'design': return <Palette className={className} />
    case 'development': return <Code className={className} />
    case 'review': return <MessageSquare className={className} />
    case 'live': return <Rocket className={className} />
  }
}

// ===========================================
// SUBCOMPONENTEN
// ===========================================

// Statistiek kaart met animaties
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subValue, 
  trend,
  color = 'blue',
  darkMode = false,
  delay = 0
}: { 
  icon: typeof Clock
  label: string
  value: string | number
  subValue?: string
  trend?: { value: number; isPositive: boolean }
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'red'
  darkMode?: boolean
  delay?: number
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    amber: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`rounded-2xl border p-4 sm:p-6 transition-all duration-300 cursor-default ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/50' 
          : 'bg-white border-gray-200 hover:shadow-lg hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <motion.div 
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
          className={`p-2.5 sm:p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.div>
        {trend && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.2 }}
            className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
          >
            <TrendingUp className={`w-4 h-4 ${!trend.isPositive ? 'rotate-180' : ''}`} />
            {trend.value}%
          </motion.div>
        )}
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.1 }}
        className={`text-2xl sm:text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}
      >
        {value}
      </motion.div>
      <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
      {subValue && <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{subValue}</div>}
    </motion.div>
  )
}

// Project kaart met verbeterde animaties
function ProjectCard({ 
  project, 
  onClick,
  onQuickAction,
  darkMode = false
}: { 
  project: DeveloperProject
  onClick: () => void
  onQuickAction: (action: string) => void
  darkMode?: boolean
}) {
  const [showActions, setShowActions] = useState(false)
  const phaseColor = phaseColors[project.phase]
  const packageConfig = getPackageConfig(project.package)
  
  const progress = calculateProgress(project)
  const hasUnreadMessages = project.messages?.some(m => !m.read && m.from === 'client')
  const hasPendingChanges = project.changeRequests?.some(cr => cr.status === 'pending')
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`group rounded-xl border p-4 transition-all cursor-pointer relative ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10' 
          : 'bg-white border-gray-200 hover:shadow-lg hover:border-blue-200'
      }`}
      onClick={onClick}
    >
      {/* Quick action menu */}
      <div className="absolute top-3 right-3">
        <button
          onClick={(e) => { e.stopPropagation(); setShowActions(!showActions) }}
          className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
            darkMode 
              ? 'text-gray-500 hover:text-white hover:bg-gray-700' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`absolute right-0 top-8 rounded-lg shadow-xl border py-1 z-10 min-w-[160px] ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => { onQuickAction('email'); setShowActions(false) }}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                  darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Mail className="w-4 h-4" /> Email sturen
              </button>
              <button
                onClick={() => { onQuickAction('update'); setShowActions(false) }}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                  darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <RefreshCw className="w-4 h-4" /> Status update
              </button>
              <button
                onClick={() => { onQuickAction('staging'); setShowActions(false) }}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                  darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ExternalLink className="w-4 h-4" /> Staging bekijken
              </button>
              <hr className={`my-1 ${darkMode ? 'border-gray-700' : ''}`} />
              <button
                onClick={() => { onQuickAction('pause'); setShowActions(false) }}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                  darkMode ? 'text-amber-400 hover:bg-amber-900/30' : 'text-amber-600 hover:bg-amber-50'
                }`}
              >
                <Pause className="w-4 h-4" /> Pauzeren
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <motion.div 
          whileHover={{ rotate: 10 }}
          className={`p-2 rounded-lg ${phaseColor.bg}`}
        >
          <PhaseIcon phase={project.phase} className={`w-4 h-4 ${phaseColor.text}`} />
        </motion.div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.businessName}</h3>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{project.projectId}</p>
        </div>
      </div>
      
      {/* Package badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${phaseColor.bg} ${phaseColor.text}`}>
          {packageConfig?.name || project.package}
        </span>
        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          €{packageConfig?.priceMonthly}/m
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Voortgang</span>
          <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{progress}%</span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
          />
        </div>
      </div>
      
      {/* Meta info */}
      <div className={`flex items-center justify-between text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {project.estimatedCompletion ? formatDate(project.estimatedCompletion) : 'Geen deadline'}
        </div>
        <div className="flex items-center gap-2">
          {hasUnreadMessages && (
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 bg-blue-500 rounded-full" 
              title="Nieuw bericht" 
            />
          )}
          {hasPendingChanges && (
            <span className="w-2 h-2 bg-amber-500 rounded-full" title="Wijzigingsverzoek" />
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Kanban kolom met dark mode
function KanbanColumn({ 
  phase, 
  projects,
  onProjectClick,
  onQuickAction,
  darkMode = false
}: { 
  phase: ProjectPhase
  projects: DeveloperProject[]
  onProjectClick: (project: DeveloperProject) => void
  onQuickAction: (project: DeveloperProject, action: string) => void
  darkMode?: boolean
}) {
  const phaseInfo = {
    onboarding: { label: 'Onboarding', icon: FileText, color: 'blue' },
    design: { label: 'Design', icon: Palette, color: 'amber' },
    development: { label: 'Development', icon: Code, color: 'purple' },
    review: { label: 'Review', icon: MessageSquare, color: 'cyan' },
    live: { label: 'Live', icon: Rocket, color: 'green' },
  }
  
  const info = phaseInfo[phase]
  const Icon = info.icon
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 min-w-[260px] sm:min-w-[280px] max-w-[320px]"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-1.5 rounded-lg bg-${info.color}-100`}>
          <Icon className={`w-4 h-4 text-${info.color}-600`} />
        </div>
        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{info.label}</h3>
        <span className={`ml-auto text-sm px-2 py-0.5 rounded-full ${
          darkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-400 bg-gray-100'
        }`}>
          {projects.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {projects.map((project, index) => (
          <motion.div
            key={project.projectId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProjectCard
              project={project}
              onClick={() => onProjectClick(project)}
              onQuickAction={(action) => onQuickAction(project, action)}
              darkMode={darkMode}
            />
          </motion.div>
        ))}
        
        {projects.length === 0 && (
          <div className={`text-center py-8 text-sm border-2 border-dashed rounded-xl ${
            darkMode ? 'text-gray-500 border-gray-700' : 'text-gray-400 border-gray-200'
          }`}>
            Geen projecten
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Project detail sidebar
function ProjectDetailPanel({ 
  project, 
  onClose,
  onUpdate,
  onSendEmail,
  onPhaseChange
}: { 
  project: DeveloperProject
  onClose: () => void
  onUpdate: (updates: Partial<DeveloperProject>) => void
  onSendEmail: (template: string) => void
  onPhaseChange: (phase: ProjectPhase) => void
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'messages' | 'changes' | 'settings'>('overview')
  const packageConfig = getPackageConfig(project.package)
  
  const tabs = [
    { id: 'overview', label: 'Overzicht', icon: LayoutDashboard },
    { id: 'tasks', label: 'Taken', icon: CheckCircle2 },
    { id: 'messages', label: 'Berichten', icon: MessageSquare, badge: project.messages?.filter(m => !m.read && m.from === 'client').length },
    { id: 'changes', label: 'Wijzigingen', icon: Edit3, badge: project.changeRequests?.filter(cr => cr.status === 'pending').length },
    { id: 'settings', label: 'Instellingen', icon: Settings },
  ]
  
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25 }}
      className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{project.businessName}</h2>
            <p className="text-sm text-gray-500">{project.projectId} • {packageConfig?.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={project.phase}
            onChange={(e) => onPhaseChange(e.target.value as ProjectPhase)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 ${phaseColors[project.phase].bg} ${phaseColors[project.phase].text} ${phaseColors[project.phase].border}`}
          >
            <option value="onboarding">Onboarding</option>
            <option value="design">Design</option>
            <option value="development">Development</option>
            <option value="review">Review</option>
            <option value="live">Live</option>
          </select>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.badge ? (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {tab.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <ProjectOverviewTab project={project} packageConfig={packageConfig} onSendEmail={onSendEmail} />
        )}
        {activeTab === 'tasks' && (
          <ProjectTasksTab project={project} packageConfig={packageConfig} onUpdate={onUpdate} />
        )}
        {activeTab === 'messages' && (
          <ProjectMessagesTab project={project} onUpdate={onUpdate} />
        )}
        {activeTab === 'changes' && (
          <ProjectChangesTab project={project} onUpdate={onUpdate} />
        )}
        {activeTab === 'settings' && (
          <ProjectSettingsTab project={project} packageConfig={packageConfig} onUpdate={onUpdate} />
        )}
      </div>
    </motion.div>
  )
}

// Overview tab
function ProjectOverviewTab({ 
  project, 
  packageConfig,
  onSendEmail
}: { 
  project: DeveloperProject
  packageConfig: PackageConfig | null
  onSendEmail: (template: string) => void
}) {
  return (
    <div className="space-y-6">
      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-gray-900">{calculateProgress(project)}%</div>
          <div className="text-sm text-gray-500">Voortgang</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-gray-900">{project.revisionsUsed}/{project.revisionsTotal}</div>
          <div className="text-sm text-gray-500">Revisies</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-gray-900">{project.hoursSpent || 0}u</div>
          <div className="text-sm text-gray-500">Besteed</div>
        </div>
      </div>
      
      {/* Contact info */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Contactgegevens</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3 text-gray-600">
            <Users className="w-4 h-4 text-gray-400" />
            {project.contactName}
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            <a href={`mailto:${project.contactEmail}`} className="text-blue-600 hover:underline">
              {project.contactEmail}
            </a>
          </div>
          {project.contactPhone && (
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" />
              <a href={`tel:${project.contactPhone}`} className="text-blue-600 hover:underline">
                {project.contactPhone}
              </a>
            </div>
          )}
        </div>
      </div>
      
      {/* Onboarding Checklist Data */}
      {project.onboardingChecklist && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Onboarding Checklist
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-auto">
              Ingevuld
            </span>
          </h3>
          <div className="space-y-3 text-sm">
            {project.onboardingChecklist.aboutText && (
              <div>
                <span className="text-gray-500 text-xs uppercase tracking-wide">Over het bedrijf</span>
                <p className="text-gray-900 mt-1 bg-white rounded-lg p-2 border border-blue-100 text-sm">
                  {project.onboardingChecklist.aboutText}
                </p>
              </div>
            )}
            {project.onboardingChecklist.services && (
              <div>
                <span className="text-gray-500 text-xs uppercase tracking-wide">Diensten/Producten</span>
                <p className="text-gray-900 mt-1 bg-white rounded-lg p-2 border border-blue-100 text-sm">
                  {project.onboardingChecklist.services}
                </p>
              </div>
            )}
            {project.onboardingChecklist.uniqueSellingPoints && (
              <div>
                <span className="text-gray-500 text-xs uppercase tracking-wide">Unique Selling Points</span>
                <p className="text-gray-900 mt-1 bg-white rounded-lg p-2 border border-blue-100 text-sm">
                  {project.onboardingChecklist.uniqueSellingPoints}
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-100">
              {project.onboardingChecklist.hasLogo && (
                <div>
                  <span className="text-gray-500 text-xs">Logo</span>
                  <p className="font-medium text-gray-900">
                    {project.onboardingChecklist.hasLogo === 'ja_vector' && 'Ja (vector)'}
                    {project.onboardingChecklist.hasLogo === 'ja_afbeelding' && 'Ja (afbeelding)'}
                    {project.onboardingChecklist.hasLogo === 'nee_nodig' && 'Logo nodig'}
                    {project.onboardingChecklist.hasLogo === 'nee_niet_nodig' && 'Alleen tekst'}
                  </p>
                </div>
              )}
              {project.onboardingChecklist.brandColors && (
                <div>
                  <span className="text-gray-500 text-xs">Kleuren</span>
                  <p className="font-medium text-gray-900">{project.onboardingChecklist.brandColors}</p>
                </div>
              )}
            </div>
            {project.onboardingChecklist.photos && (
              <div>
                <span className="text-gray-500 text-xs uppercase tracking-wide">Foto's/Media</span>
                <p className="text-gray-900 mt-1 bg-white rounded-lg p-2 border border-blue-100 text-sm break-all">
                  {project.onboardingChecklist.photos}
                </p>
              </div>
            )}
            {project.onboardingChecklist.competitors && (
              <div>
                <span className="text-gray-500 text-xs uppercase tracking-wide">Inspiratie websites</span>
                <p className="text-gray-900 mt-1 bg-white rounded-lg p-2 border border-blue-100 text-sm break-all">
                  {project.onboardingChecklist.competitors}
                </p>
              </div>
            )}
            {project.onboardingChecklist.extraWishes && (
              <div>
                <span className="text-gray-500 text-xs uppercase tracking-wide">Extra wensen</span>
                <p className="text-gray-900 mt-1 bg-white rounded-lg p-2 border border-blue-100 text-sm">
                  {project.onboardingChecklist.extraWishes}
                </p>
              </div>
            )}
            {project.onboardingChecklist.submittedAt && (
              <p className="text-xs text-gray-400 pt-2 border-t border-blue-100">
                Ingevuld op {new Date(project.onboardingChecklist.submittedAt).toLocaleDateString('nl-NL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Webshop Design Preferences (if available) */}
      {project.onboardingData?.webshopStyle && (
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-600" />
            Webshop Design Voorkeuren
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Stijl</span>
              <span className="font-medium text-gray-900">
                {project.onboardingData.webshopStyle === 'modern' && 'Modern & Clean'}
                {project.onboardingData.webshopStyle === 'bold' && 'Bold & Opvallend'}
                {project.onboardingData.webshopStyle === 'elegant' && 'Elegant & Premium'}
                {project.onboardingData.webshopStyle === 'playful' && 'Speels & Creatief'}
                {project.onboardingData.webshopStyle === 'minimalist' && 'Minimalistisch'}
                {project.onboardingData.webshopStyle === 'traditional' && 'Klassiek & Betrouwbaar'}
              </span>
            </div>
            {project.onboardingData.webshopColors && project.onboardingData.webshopColors.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Kleuren</span>
                <div className="flex gap-1">
                  {project.onboardingData.webshopColors.map((colorId: string, idx: number) => {
                    const colorMap: Record<string, string> = {
                      blue: '#3B82F6', green: '#10B981', purple: '#8B5CF6', red: '#EF4444',
                      orange: '#F97316', yellow: '#EAB308', pink: '#EC4899', teal: '#14B8A6',
                      black: '#1F2937', gray: '#6B7280', brown: '#92400E', gold: '#D4AF37'
                    }
                    return (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: colorMap[colorId] || colorId }}
                        title={colorId}
                      />
                    )
                  })}
                </div>
              </div>
            )}
            {project.onboardingData.webshopCustomColor && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Custom kleur</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded border border-gray-300"
                    style={{ backgroundColor: project.onboardingData.webshopCustomColor }}
                  />
                  <span className="font-mono text-xs text-gray-700">{project.onboardingData.webshopCustomColor}</span>
                </div>
              </div>
            )}
            {project.onboardingData.webshopExampleSites && (
              <div>
                <span className="text-gray-600 block mb-1">Voorbeeldsites</span>
                <p className="text-gray-900 text-xs bg-white rounded-lg p-2 border border-emerald-100">
                  {project.onboardingData.webshopExampleSites}
                </p>
              </div>
            )}
            {project.onboardingData.webshopBrandAssets && (
              <div>
                <span className="text-gray-600 block mb-1">Huisstijl/Branding</span>
                <p className="text-gray-900 text-xs bg-white rounded-lg p-2 border border-emerald-100">
                  {project.onboardingData.webshopBrandAssets}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Quick actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Snelle acties</h3>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => onSendEmail('welcome')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            <Mail className="w-4 h-4" />
            Welkomstmail
          </button>
          <button 
            onClick={() => onSendEmail('materials_reminder')}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium"
          >
            <Upload className="w-4 h-4" />
            Herinnering
          </button>
          <button 
            onClick={() => onSendEmail('design_ready')}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
          >
            <Palette className="w-4 h-4" />
            Design klaar
          </button>
          <button 
            onClick={() => onSendEmail('live_announcement')}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
          >
            <Rocket className="w-4 h-4" />
            Website live
          </button>
        </div>
      </div>
      
      {/* Links */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Project links</h3>
        <div className="space-y-2">
          {project.googleDriveUrl && (
            <a 
              href={project.googleDriveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Download className="w-4 h-4 text-yellow-700" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Google Drive</div>
                <div className="text-xs text-gray-500">Materialen en assets</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          )}
          {project.stagingUrl && (
            <a 
              href={project.stagingUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg">
                <Globe className="w-4 h-4 text-purple-700" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Staging</div>
                <div className="text-xs text-gray-500">{project.stagingUrl}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          )}
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <Rocket className="w-4 h-4 text-green-700" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Live website</div>
                <div className="text-xs text-gray-500">{project.liveUrl}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          )}
        </div>
      </div>
      
      {/* Package info */}
      {packageConfig && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Pakket: {packageConfig.name}</h3>
            <span className="text-sm font-medium text-gray-500">
              €{packageConfig.priceMonthly}/maand
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <FileText className="w-4 h-4 text-gray-400" />
              {packageConfig.maxPages === 'unlimited' ? 'Onbeperkt' : `Max ${packageConfig.maxPages}`} pagina's
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <RefreshCw className="w-4 h-4 text-gray-400" />
              {packageConfig.revisionsIncluded} revisierondes
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              {packageConfig.supportResponseTime} response
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Edit3 className="w-4 h-4 text-gray-400" />
              {project.monthlyChangesLimit}x/maand wijzigingen
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Tasks tab placeholder
function ProjectTasksTab({ 
  project: _project, 
  packageConfig,
  onUpdate: _onUpdate 
}: { 
  project: DeveloperProject
  packageConfig: PackageConfig | null
  onUpdate: (updates: Partial<DeveloperProject>) => void
}) {
  const tasks = packageConfig?.developerTasks || []
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Developer taken</h3>
        <span className="text-sm text-gray-500">
          {tasks.filter(t => t.required).length} taken
        </span>
      </div>
      
      {['onboarding', 'design', 'development', 'review', 'live'].map(phase => {
        const phaseTasks = tasks.filter(t => t.phase === phase)
        if (phaseTasks.length === 0) return null
        
        return (
          <div key={phase} className="border border-gray-200 rounded-xl overflow-hidden">
            <div className={`px-4 py-2 ${phaseColors[phase as ProjectPhase].bg} ${phaseColors[phase as ProjectPhase].text} font-medium text-sm`}>
              {phase.charAt(0).toUpperCase() + phase.slice(1)}
            </div>
            <div className="divide-y divide-gray-100">
              {phaseTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    <div className="text-xs text-gray-500">{task.description}</div>
                  </div>
                  {task.estimatedHours && (
                    <span className="text-xs text-gray-400">{task.estimatedHours}u</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Messages tab placeholder
function ProjectMessagesTab({ 
  project,
  onUpdate: _onUpdate 
}: { 
  project: DeveloperProject
  onUpdate: (updates: Partial<DeveloperProject>) => void
}) {
  const [newMessage, setNewMessage] = useState('')
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 mb-4">
        {project.messages?.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Nog geen berichten
          </div>
        )}
        
        {project.messages?.map(message => (
          <div
            key={message.id}
            className={`flex ${message.from === 'developer' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.from === 'developer'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="text-sm">{message.message}</p>
              <p className={`text-xs mt-1 ${
                message.from === 'developer' ? 'text-blue-100' : 'text-gray-400'
              }`}>
                {formatDate(message.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Typ een bericht..."
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// Changes tab placeholder
function ProjectChangesTab({ 
  project,
  onUpdate: _onUpdate 
}: { 
  project: DeveloperProject
  onUpdate: (updates: Partial<DeveloperProject>) => void
}) {
  const pendingChanges = project.changeRequests?.filter(cr => cr.status === 'pending') || []
  const otherChanges = project.changeRequests?.filter(cr => cr.status !== 'pending') || []
  
  return (
    <div className="space-y-6">
      {/* Monthly changes counter */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-blue-900">Maandelijkse wijzigingen</div>
            <div className="text-xs text-blue-600">Reset op de 1e van elke maand</div>
          </div>
          <div className="text-2xl font-bold text-blue-700">
            {project.monthlyChangesUsed}/{project.monthlyChangesLimit}
          </div>
        </div>
      </div>
      
      {/* Pending changes */}
      {pendingChanges.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">In afwachting ({pendingChanges.length})</h3>
          <div className="space-y-3">
            {pendingChanges.map(change => (
              <div key={change.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    change.priority === 'urgent' 
                      ? 'bg-red-100 text-red-700' 
                      : change.priority === 'normal'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}>
                    {change.priority === 'urgent' ? 'Urgent' : change.priority === 'normal' ? 'Normaal' : 'Laag'}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(change.date)}</span>
                </div>
                <p className="text-sm text-gray-900 mb-3">{change.request}</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors">
                    Accepteren
                  </button>
                  <button className="flex-1 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
                    Afwijzen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* History */}
      {otherChanges.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Geschiedenis</h3>
          <div className="space-y-2">
            {otherChanges.map(change => (
              <div key={change.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {change.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : change.status === 'rejected' ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <Clock className="w-5 h-5 text-blue-500" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{change.request}</p>
                  <p className="text-xs text-gray-400">{formatDate(change.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {pendingChanges.length === 0 && otherChanges.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          Geen wijzigingsverzoeken
        </div>
      )}
    </div>
  )
}

// Settings tab placeholder
function ProjectSettingsTab({ 
  project, 
  packageConfig: _packageConfig,
  onUpdate: _onUpdate 
}: { 
  project: DeveloperProject
  packageConfig: PackageConfig | null
  onUpdate: (updates: Partial<DeveloperProject>) => void
}) {
  return (
    <div className="space-y-6">
      {/* URLs */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Project URLs</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Drive URL</label>
            <input
              type="url"
              defaultValue={project.googleDriveUrl}
              placeholder="https://drive.google.com/..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Staging URL</label>
            <input
              type="url"
              defaultValue={project.stagingUrl}
              placeholder="https://staging.example.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Live URL</label>
            <input
              type="url"
              defaultValue={project.liveUrl}
              placeholder="https://www.example.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Internal notes */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Interne notities</h3>
        <textarea
          defaultValue={project.internalNotes}
          rows={4}
          placeholder="Notities voor jezelf (niet zichtbaar voor klant)..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Danger zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <h3 className="font-semibold text-red-900 mb-2">Gevaarlijke zone</h3>
        <p className="text-sm text-red-600 mb-4">Deze acties kunnen niet ongedaan worden gemaakt.</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors">
            Project pauzeren
          </button>
          <button className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors">
            Project annuleren
          </button>
        </div>
      </div>
    </div>
  )
}

// ===========================================
// HELPER FUNCTIES
// ===========================================

function getPackageConfig(packageId: string): PackageConfig | null {
  // Import zou normaal uit types komen
  const configs: Record<string, PackageConfig> = {
    starter: {
      id: 'starter',
      name: 'Starter',
      priceMonthly: 96,
      priceSetup: 181,
      maxPages: 5,
      revisionsIncluded: 2,
      monthlyChanges: 1,
      supportResponseTime: '48u',
      features: [],
      developerTasks: [],
      clientPermissions: [],
    },
    professional: {
      id: 'professional',
      name: 'Professioneel',
      priceMonthly: 180,
      priceSetup: 241,
      maxPages: 10,
      revisionsIncluded: 3,
      monthlyChanges: 3,
      supportResponseTime: '24u',
      features: [],
      developerTasks: [],
      clientPermissions: [],
    },
    business: {
      id: 'business',
      name: 'Business',
      priceMonthly: 301,
      priceSetup: 362,
      maxPages: 20,
      revisionsIncluded: 5,
      monthlyChanges: 5,
      supportResponseTime: '4u',
      features: [],
      developerTasks: [],
      clientPermissions: [],
    },
    webshop: {
      id: 'webshop',
      name: 'Webshop',
      priceMonthly: 422,
      priceSetup: 362,
      maxPages: 'unlimited',
      revisionsIncluded: 5,
      monthlyChanges: 5,
      supportResponseTime: '4u',
      features: [],
      developerTasks: [],
      clientPermissions: [],
    },
  }
  return configs[packageId] || null
}

function calculateProgress(project: DeveloperProject): number {
  const phaseProgress: Record<ProjectPhase, number> = {
    onboarding: 10,
    design: 30,
    development: 70,
    review: 90,
    live: 100,
  }
  return phaseProgress[project.phase] || 0
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('nl-NL', { 
    day: 'numeric', 
    month: 'short',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  })
}

// ===========================================
// TOOLTIP COMPONENT
// ===========================================

function Tooltip({ children, text, darkMode }: { children: React.ReactNode; text: string; darkMode: boolean }) {
  const [show, setShow] = useState(false)
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap z-50 ${
              darkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
            }`}
          >
            {text}
            <div className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${
              darkMode ? 'border-t-gray-700' : 'border-t-gray-900'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===========================================
// ONBOARDING MODAL
// ===========================================

const onboardingSteps = [
  {
    icon: Target,
    title: 'Welkom bij het Developer Dashboard!',
    description: 'Hier beheer je al je projecten, klanten en service aanvragen. Laten we even een korte rondleiding maken.',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: FolderKanban,
    title: 'Projecten beheren',
    description: 'Bekijk alle projecten in kanban- of lijstweergave. Volg de voortgang van elk project en communiceer met klanten.',
    color: 'from-purple-500 to-pink-600'
  },
  {
    icon: Users,
    title: 'Klantenbeheer',
    description: 'Houd alle klantgegevens bij elkaar. Zie welke projecten bij welke klant horen en track hun uitgaven.',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: Briefcase,
    title: 'Service Aanvragen',
    description: 'Beheer extra diensten zoals drone opnames, logo ontwerp en fotografie. Alles op één plek.',
    color: 'from-amber-500 to-orange-600'
  },
  {
    icon: Zap,
    title: 'Klaar om te beginnen!',
    description: 'Gebruik de help knop rechtsboven als je vragen hebt. Veel succes!',
    color: 'from-cyan-500 to-blue-600'
  }
]

function OnboardingModal({ 
  step, 
  onNext, 
  onSkip, 
  darkMode 
}: { 
  step: number
  onNext: () => void
  onSkip: () => void
  darkMode: boolean
}) {
  const currentStep = onboardingSteps[step]
  const Icon = currentStep.icon

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onSkip}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4`}
      >
        <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${currentStep.color} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {currentStep.title}
          </h2>
          <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentStep.description}
          </p>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {onboardingSteps.map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: i === step ? 1.2 : 1 }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step 
                    ? 'bg-blue-500' 
                    : i < step 
                      ? 'bg-blue-300' 
                      : darkMode ? 'bg-gray-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onSkip}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Overslaan
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg"
            >
              {step === onboardingSteps.length - 1 ? 'Aan de slag!' : 'Volgende'}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
        </div>
      </motion.div>
    </>
  )
}

// ===========================================
// HELP MODAL
// ===========================================

function HelpModal({ onClose, darkMode }: { onClose: () => void; darkMode: boolean }) {
  const [activeTab, setActiveTab] = useState<'handleiding' | 'tips' | 'sneltoetsen'>('handleiding')

  const tabs = [
    { id: 'handleiding', label: 'Handleiding', icon: BookOpen },
    { id: 'tips', label: 'Tips', icon: Lightbulb },
    { id: 'sneltoetsen', label: 'Sneltoetsen', icon: MousePointer }
  ]

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl z-50 overflow-hidden ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Hulp & Documentatie
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? darkMode 
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700/50' 
                    : 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : darkMode 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
          <AnimatePresence mode="wait">
            {activeTab === 'handleiding' && (
              <motion.div
                key="handleiding"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <HelpSection 
                  title="Projecten beheren" 
                  icon={FolderKanban}
                  darkMode={darkMode}
                >
                  <p>Gebruik de Projecten tab om alle lopende projecten te zien. Je kunt schakelen tussen kanban en lijst weergave.</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Klik op een project voor details</li>
                    <li>Wijzig de fase via de dropdown</li>
                    <li>Stuur emails direct vanuit het systeem</li>
                  </ul>
                </HelpSection>
                
                <HelpSection 
                  title="Klanten" 
                  icon={Users}
                  darkMode={darkMode}
                >
                  <p>Het klantenoverzicht toont alle klanten met hun projecten en totale uitgaven.</p>
                </HelpSection>
                
                <HelpSection 
                  title="Service aanvragen" 
                  icon={Briefcase}
                  darkMode={darkMode}
                >
                  <p>Beheer extra diensten zoals drone opnames, logo ontwerp, fotografie en tekstschrijven.</p>
                </HelpSection>
                
                <HelpSection 
                  title="Betalingen" 
                  icon={CreditCard}
                  darkMode={darkMode}
                >
                  <p>Bekijk MRR, openstaande facturen en recente betalingen. Alles wordt automatisch via Mollie verwerkt.</p>
                </HelpSection>
              </motion.div>
            )}
            
            {activeTab === 'tips' && (
              <motion.div
                key="tips"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <TipCard 
                  emoji="🚀" 
                  title="Snelle status updates"
                  description="Gebruik de quick action menu (drie puntjes) op projectkaarten voor snelle acties."
                  darkMode={darkMode}
                />
                <TipCard 
                  emoji="🔔" 
                  title="Meldingen bijhouden"
                  description="Check regelmatig de meldingen voor nieuwe berichten en wijzigingsverzoeken."
                  darkMode={darkMode}
                />
                <TipCard 
                  emoji="🌙" 
                  title="Dark mode"
                  description="Schakel dark mode in via het zon/maan icoon rechtsboven voor minder belasting van je ogen."
                  darkMode={darkMode}
                />
                <TipCard 
                  emoji="📊" 
                  title="Dashboard overview"
                  description="Het overzicht toont direct welke projecten klaar zijn om live te gaan of wachten op betaling."
                  darkMode={darkMode}
                />
                <TipCard 
                  emoji="⚡" 
                  title="Kanban Board"
                  description="Gebruik de Kanban tab voor een visueel overzicht van alle taken en hun voortgang."
                  darkMode={darkMode}
                />
              </motion.div>
            )}
            
            {activeTab === 'sneltoetsen' && (
              <motion.div
                key="sneltoetsen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <ShortcutItem shortcut="?" description="Open dit helpmenu" darkMode={darkMode} />
                <ShortcutItem shortcut="D" description="Toggle dark mode" darkMode={darkMode} />
                <ShortcutItem shortcut="O" description="Ga naar Overzicht" darkMode={darkMode} />
                <ShortcutItem shortcut="P" description="Ga naar Projecten" darkMode={darkMode} />
                <ShortcutItem shortcut="K" description="Ga naar Kanban" darkMode={darkMode} />
                <ShortcutItem shortcut="C" description="Ga naar Klanten" darkMode={darkMode} />
                <ShortcutItem shortcut="N" description="Open meldingen" darkMode={darkMode} />
                <ShortcutItem shortcut="Esc" description="Sluit modals/panels" darkMode={darkMode} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}

function HelpSection({ 
  title, 
  icon: Icon, 
  children, 
  darkMode 
}: { 
  title: string
  icon: typeof FolderKanban
  children: React.ReactNode
  darkMode: boolean
}) {
  return (
    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      </div>
      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {children}
      </div>
    </div>
  )
}

function TipCard({ 
  emoji, 
  title, 
  description, 
  darkMode 
}: { 
  emoji: string
  title: string
  description: string
  darkMode: boolean
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`flex items-start gap-4 p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
    >
      <span className="text-2xl">{emoji}</span>
      <div>
        <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
      </div>
    </motion.div>
  )
}

function ShortcutItem({ 
  shortcut, 
  description, 
  darkMode 
}: { 
  shortcut: string
  description: string
  darkMode: boolean
}) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{description}</span>
      <kbd className={`px-3 py-1 rounded-lg text-sm font-mono font-medium ${
        darkMode ? 'bg-gray-600 text-gray-200' : 'bg-white text-gray-700 shadow-sm border border-gray-200'
      }`}>
        {shortcut}
      </kbd>
    </div>
  )
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function DeveloperDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [projects, setProjects] = useState<DeveloperProject[]>([])
  const [selectedProject, setSelectedProject] = useState<DeveloperProject | null>(null)
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPackage, setFilterPackage] = useState<string>('all')
  
  // Nieuwe state voor uitgebreide dashboard
  const [activeTab, setActiveTab] = useState<DashboardTab>('projects')
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(DARK_MODE_KEY) === 'true'
    }
    return false
  })
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Help/Onboarding state
  const [showHelp, setShowHelp] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('webstability_dev_onboarding_complete')
    }
    return false
  })
  const [onboardingStep, setOnboardingStep] = useState(0)
  
  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem(DARK_MODE_KEY, String(darkMode))
  }, [darkMode])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alleen als niet in een input veld
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      
      // Escape sluit modals
      if (e.key === 'Escape') {
        if (showHelp) setShowHelp(false)
        if (showOnboarding) setShowOnboarding(false)
        if (selectedProject) setSelectedProject(null)
        if (selectedClient) setSelectedClient(null)
        if (showNotifications) setShowNotifications(false)
      }
      
      // ? opent help
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault()
        setShowHelp(true)
      }
      
      // D toggle dark mode
      if (e.key === 'd' || e.key === 'D') {
        setDarkMode(!darkMode)
      }
      
      // O ga naar overview
      if (e.key === 'o' || e.key === 'O') {
        setActiveTab('overview')
      }
      
      // P ga naar projecten
      if (e.key === 'p' || e.key === 'P') {
        setActiveTab('projects')
      }
      
      // K ga naar kanban
      if (e.key === 'k' || e.key === 'K') {
        setActiveTab('kanban')
      }
      
      // C ga naar klanten
      if (e.key === 'c' || e.key === 'C') {
        setActiveTab('clients')
      }
      
      // N toggle notificaties
      if (e.key === 'n' || e.key === 'N') {
        setShowNotifications(!showNotifications)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showHelp, showOnboarding, selectedProject, selectedClient, showNotifications, darkMode])

  // Helper function to get auth token
  const getAuthToken = () => sessionStorage.getItem(TOKEN_KEY)

  // Auth check
  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY)
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  // Load projects
  useEffect(() => {
    if (isAuthenticated) {
      loadProjects()
    }
  }, [isAuthenticated])

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE}/projects`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Transform to DeveloperProject format
          const transformedProjects = data.projects.map((p: any) => ({
            ...p,
            phase: p.status || 'onboarding',
            status: 'active',
            hoursSpent: 0,
            hoursEstimate: 20,
            revisionsUsed: p.revisionsUsed || 0,
            revisionsTotal: p.revisionsTotal || 3,
            messages: p.messages || [],
            changeRequests: p.changeRequests || [],
            updates: p.updates || [],
            monthlyChangesUsed: p.monthlyChangesUsed || 0,
            monthlyChangesLimit: getPackageConfig(p.package)?.monthlyChanges || 4,
            internalNotes: p.internalNotes || '',
          }))
          setProjects(transformedProjects)
        }
      } else if (response.status === 401) {
        // Token expired
        handleLogout()
      }
    } catch (e) {
      console.error('Error loading projects:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Lokale development mode check
    const isDev = import.meta.env.DEV
    
    if (isDev && password === DEV_PASSWORD) {
      // Lokaal direct inloggen
      sessionStorage.setItem(TOKEN_KEY, 'dev-token')
      sessionStorage.setItem(AUTH_KEY, 'true')
      setIsAuthenticated(true)
      setError('')
      setIsLoading(false)
      return
    }
    
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      
      const data = await response.json()
      
      if (data.success) {
        sessionStorage.setItem(TOKEN_KEY, data.token)
        sessionStorage.setItem(AUTH_KEY, 'true')
        setIsAuthenticated(true)
        setError('')
      } else {
        setError(data.message || 'Onjuist wachtwoord')
      }
    } catch (err) {
      // In dev mode, check wachtwoord lokaal als API faalt
      if (isDev && password === DEV_PASSWORD) {
        sessionStorage.setItem(TOKEN_KEY, 'dev-token')
        sessionStorage.setItem(AUTH_KEY, 'true')
        setIsAuthenticated(true)
        setError('')
      } else {
        setError('Er is een fout opgetreden. Probeer het opnieuw.')
        console.error('Login error:', err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    setIsAuthenticated(false)
  }

  // Generate clients from projects
  useEffect(() => {
    if (projects.length > 0) {
      const clientMap = new Map<string, Client>()
      
      projects.forEach(p => {
        const existingClient = clientMap.get(p.contactEmail)
        if (existingClient) {
          existingClient.projects.push(p.projectId)
          existingClient.totalSpent += (getPackageConfig(p.package)?.priceSetup || 0)
        } else {
          clientMap.set(p.contactEmail, {
            id: `client-${p.contactEmail.replace(/[^a-z0-9]/gi, '')}`,
            name: p.contactName,
            email: p.contactEmail,
            phone: p.contactPhone,
            company: p.businessName,
            projects: [p.projectId],
            totalSpent: getPackageConfig(p.package)?.priceSetup || 0,
            createdAt: p.createdAt,
          })
        }
      })
      
      setClients(Array.from(clientMap.values()))
    }
  }, [projects])

  // Generate notifications from projects
  useEffect(() => {
    const newNotifications: Notification[] = []
    
    projects.forEach(p => {
      // Ongelezen berichten
      p.messages?.filter(m => !m.read && m.from === 'client').forEach(m => {
        newNotifications.push({
          id: `msg-${m.id}`,
          type: 'message',
          title: 'Nieuw bericht',
          message: `${p.contactName} heeft een bericht gestuurd`,
          projectId: p.projectId,
          read: false,
          createdAt: m.date,
        })
      })
      
      // Wijzigingsverzoeken
      p.changeRequests?.filter(cr => cr.status === 'pending').forEach(cr => {
        newNotifications.push({
          id: `cr-${cr.id}`,
          type: 'change_request',
          title: 'Wijzigingsverzoek',
          message: `${p.businessName}: ${cr.request.substring(0, 50)}...`,
          projectId: p.projectId,
          read: false,
          createdAt: cr.date,
        })
      })
    })
    
    setNotifications(newNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ))
  }, [projects])

  // Mock service requests voor nu (later uit API)
  useEffect(() => {
    if (isAuthenticated && serviceRequests.length === 0) {
      setServiceRequests([
        {
          id: 'sr-1',
          type: 'drone',
          clientName: 'Demo Klant',
          clientEmail: 'demo@example.com',
          clientPhone: '06 12345678',
          description: 'Dronebeelden voor restaurant - binnenkant en terras',
          status: 'pending',
          price: 399,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'sr-2',
          type: 'logo',
          clientName: 'Bakkerij Test',
          clientEmail: 'bakker@example.com',
          clientPhone: '06 87654321',
          description: 'Logo ontwerp voor nieuwe bakkerij',
          status: 'in_progress',
          price: 399,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ])
    }
  }, [isAuthenticated, serviceRequests.length])

  const updateClient = (clientId: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, ...updates } : c
    ))
    setSelectedClient(null)
  }

  const updateServiceRequest = (id: string, updates: Partial<ServiceRequest>) => {
    setServiceRequests(prev => prev.map(sr => 
      sr.id === id ? { ...sr, ...updates } : sr
    ))
  }

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadNotifications = notifications.filter(n => !n.read).length

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = !searchTerm || 
      p.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPackage = filterPackage === 'all' || p.package === filterPackage
    return matchesSearch && matchesPackage
  })

  // Group by phase for kanban
  const projectsByPhase = {
    onboarding: filteredProjects.filter(p => p.phase === 'onboarding'),
    design: filteredProjects.filter(p => p.phase === 'design'),
    development: filteredProjects.filter(p => p.phase === 'development'),
    review: filteredProjects.filter(p => p.phase === 'review'),
    live: filteredProjects.filter(p => p.phase === 'live'),
  }

  // Stats
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.phase !== 'live').length,
    pendingMessages: projects.reduce((acc, p) => acc + (p.messages?.filter(m => !m.read && m.from === 'client').length || 0), 0),
    pendingChanges: projects.reduce((acc, p) => acc + (p.changeRequests?.filter(cr => cr.status === 'pending').length || 0), 0),
    monthlyRevenue: projects.reduce((acc, p) => {
      const config = getPackageConfig(p.package)
      return acc + (config?.priceMonthly || 0)
    }, 0),
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              x: [0, 100, 0], 
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
            className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              x: [0, -80, 0], 
              y: [0, 80, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut' }}
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex justify-center mb-4"
            >
              <Logo variant="white" size="lg" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-white"
            >
              Developer Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-blue-200"
            >
              Log in om door te gaan
            </motion.p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleLogin} 
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl"
          >
            <div className="mb-6">
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Wachtwoord
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="••••••••••••"
                  autoFocus
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Bezig...
                </>
              ) : (
                'Inloggen'
              )}
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && isAuthenticated && (
          <OnboardingModal
            step={onboardingStep}
            onNext={() => {
              if (onboardingStep < onboardingSteps.length - 1) {
                setOnboardingStep(onboardingStep + 1)
              } else {
                localStorage.setItem('webstability_dev_onboarding_complete', 'true')
                setShowOnboarding(false)
              }
            }}
            onSkip={() => {
              localStorage.setItem('webstability_dev_onboarding_complete', 'true')
              setShowOnboarding(false)
            }}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <HelpModal onClose={() => setShowHelp(false)} darkMode={darkMode} />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40 transition-colors duration-300`}>
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <Logo variant={darkMode ? 'white' : 'default'} />
            <div className={`hidden sm:block h-6 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            
            {/* Navigation Tabs - Responsive */}
            <nav className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overzicht', icon: LayoutDashboard },
                { id: 'projects', label: 'Projecten', icon: FolderKanban },
                { id: 'kanban', label: 'Kanban', icon: BarChart3 },
                { id: 'clients', label: 'Klanten', icon: Users },
                { id: 'billing', label: 'Betalingen', icon: CreditCard },
                { id: 'services', label: 'Services', icon: Briefcase },
                { id: 'settings', label: 'Instellingen', icon: Settings },
              ].map(tab => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as DashboardTab)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === tab.id 
                      ? darkMode 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-50 text-blue-600'
                      : darkMode
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Search (only on projects tab) */}
            {activeTab === 'projects' && (
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Zoek project..."
                  className={`w-48 lg:w-64 pl-10 pr-4 py-2 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm ${
                    darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100'
                  }`}
                />
              </div>
            )}
            
            {/* Help Button */}
            <Tooltip text="Hulp & Documentatie" darkMode={darkMode}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHelp(true)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <HelpCircle className="w-5 h-5" />
              </motion.button>
            </Tooltip>
            
            {/* Notifications */}
            <div className="relative">
              <Tooltip text="Meldingen" darkMode={darkMode}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-lg transition-colors ${
                    darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </motion.span>
                  )}
                </motion.button>
              </Tooltip>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute right-0 top-12 w-80 rounded-xl shadow-xl border overflow-hidden z-50 ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Meldingen</h3>
                      {unreadNotifications > 0 && (
                        <button 
                          onClick={markAllNotificationsRead}
                          className="text-sm text-blue-500 hover:text-blue-600"
                        >
                          Alles gelezen
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className={`p-6 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>Geen meldingen</p>
                        </div>
                      ) : (
                        notifications.slice(0, 10).map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-4 border-b cursor-pointer transition-colors ${
                              darkMode 
                                ? `border-gray-700 ${n.read ? 'bg-gray-800' : 'bg-gray-750'} hover:bg-gray-700`
                                : `border-gray-100 ${n.read ? 'bg-white' : 'bg-blue-50'} hover:bg-gray-50`
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${
                                n.type === 'message' ? 'bg-blue-100 text-blue-600' :
                                n.type === 'change_request' ? 'bg-amber-100 text-amber-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {n.type === 'message' ? <MessageSquare className="w-4 h-4" /> :
                                 n.type === 'change_request' ? <Edit3 className="w-4 h-4" /> :
                                 <Bell className="w-4 h-4" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{n.title}</p>
                                <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{n.message}</p>
                                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {formatDate(n.createdAt)}
                                </p>
                              </div>
                              {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Dark mode toggle */}
            <Tooltip text={darkMode ? 'Lichte modus' : 'Donkere modus'} darkMode={darkMode}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: darkMode ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.div>
              </motion.button>
            </Tooltip>
            
            {/* Logout */}
            <Tooltip text="Uitloggen" darkMode={darkMode}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </Tooltip>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 py-4 sm:py-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Welcome message when no projects */}
            {projects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center py-12 sm:py-20 ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                    darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
                  }`}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  >
                    <LayoutDashboard className={`w-10 h-10 sm:w-12 sm:h-12 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                  </motion.div>
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl sm:text-2xl font-bold mb-2"
                >
                  Welkom bij het Developer Dashboard!
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`max-w-md mx-auto mb-8 px-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Hier beheer je al je projecten, klanten en service aanvragen. 
                  Er zijn nog geen projecten om te tonen.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('projects')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Nieuw project
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('services')}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all ${
                      darkMode 
                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Briefcase className="w-5 h-5" />
                    Service aanvragen
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <StatCard icon={FolderKanban} label="Totaal projecten" value={stats.total} color="blue" darkMode={darkMode} delay={0} />
                  <StatCard icon={Clock} label="Actieve projecten" value={stats.active} color="amber" darkMode={darkMode} delay={0.05} />
                  <StatCard icon={MessageSquare} label="Ongelezen berichten" value={stats.pendingMessages} color="purple" darkMode={darkMode} delay={0.1} />
                  <StatCard icon={Edit3} label="Wijzigingsverzoeken" value={stats.pendingChanges} color="red" darkMode={darkMode} delay={0.15} />
                  <StatCard icon={CreditCard} label="Maandelijks" value={`€${stats.monthlyRevenue}`} color="green" darkMode={darkMode} delay={0.2} />
                </div>

                {/* Quick Actions */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className={`p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}
                >
                  <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Snelle acties</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('projects')}
                      className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl transition-colors ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Plus className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-sm sm:text-base">Nieuw project</span>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('clients')}
                      className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl transition-colors ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="p-2 bg-green-500 rounded-lg">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-sm sm:text-base">Klanten beheren</span>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('services')}
                      className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl transition-colors ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-sm sm:text-base">Service requests</span>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl transition-colors ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="p-2 bg-amber-500 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-sm sm:text-base">Rapportage</span>
                    </motion.button>
                  </div>
                </motion.div>

                {/* 🔔 ACTIE VEREIST - Projecten die betaald zijn en live kunnen */}
                {projects.filter(p => p.paymentStatus === 'paid' && p.phase === 'review').length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-2xl mb-8 border-2 ${
                      darkMode 
                        ? 'bg-green-900/20 border-green-500' 
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <Rocket className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          🚀 Klaar om live te gaan!
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                          Deze projecten zijn betaald en wachten op livegang
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {projects
                        .filter(p => p.paymentStatus === 'paid' && p.phase === 'review')
                        .map(p => (
                          <div 
                            key={p.projectId}
                            onClick={() => { setSelectedProject(p); setActiveTab('projects') }}
                            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${
                              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{p.businessName}</p>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Betaald op {p.paymentCompletedAt ? new Date(p.paymentCompletedAt).toLocaleDateString('nl-NL') : 'vandaag'}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                // Open project en zet naar live fase
                                setSelectedProject(p)
                                setActiveTab('projects')
                              }}
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Rocket className="w-4 h-4" />
                              Zet live
                            </button>
                          </div>
                        ))}
                    </div>
                  </motion.div>
                )}

                {/* Wacht op betaling - Design goedgekeurd maar nog niet betaald */}
                {projects.filter(p => p.designApproved && p.paymentStatus === 'awaiting_payment').length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-2xl mb-8 border-2 ${
                      darkMode 
                        ? 'bg-amber-900/20 border-amber-500' 
                        : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-500 rounded-lg">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          💳 Wacht op betaling
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                          Design goedgekeurd, wacht op eerste abonnementsbetaling
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {projects
                        .filter(p => p.designApproved && p.paymentStatus === 'awaiting_payment')
                        .map(p => (
                          <div 
                            key={p.projectId}
                            onClick={() => { setSelectedProject(p); setActiveTab('projects') }}
                            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${
                              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-amber-100 rounded-lg">
                                <Clock className="w-5 h-5 text-amber-600" />
                              </div>
                              <div>
                                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{p.businessName}</p>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Design goedgekeurd op {p.designApprovedAt ? new Date(p.designApprovedAt).toLocaleDateString('nl-NL') : '-'}
                                </p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                              Wacht op betaling
                            </span>
                          </div>
                        ))}
                    </div>
                  </motion.div>
                )}

                {/* Recent activity and revenue side by side */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recent projects */}
                  <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                    <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recente projecten</h3>
                    <div className="space-y-3">
                      {projects.slice(0, 5).map(p => (
                        <div 
                          key={p.projectId}
                          onClick={() => { setSelectedProject(p); setActiveTab('projects') }}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${phaseColors[p.phase].bg}`}>
                            <PhaseIcon phase={p.phase} className={`w-4 h-4 ${phaseColors[p.phase].text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{p.businessName}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {getPackageConfig(p.package)?.name} • {p.phase}
                            </p>
                          </div>
                          <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Revenue overview */}
                  <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                    <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Revenue overzicht</h3>
                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Maandelijks inkomen</span>
                          <DollarSign className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                        </div>
                        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          €{stats.monthlyRevenue}
                        </p>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          van {projects.filter(p => p.phase === 'live').length} actieve abonnementen
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Setup fees (dit jaar)</p>
                          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            €{projects.reduce((acc, p) => acc + (getPackageConfig(p.package)?.priceSetup || 0), 0)}
                          </p>
                        </div>
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Projecten in pipeline</p>
                          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {stats.active}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <>
            {/* Toolbar */}
            <div className={`flex items-center justify-between mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <select
                  value={filterPackage}
                  onChange={(e) => setFilterPackage(e.target.value)}
                  className={`px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-0'
                  }`}
                >
                  <option value="all">Alle pakketten</option>
                  <option value="starter">Starter</option>
                  <option value="professional">Professioneel</option>
                  <option value="business">Business</option>
                  <option value="webshop">Webshop</option>
                </select>
              </div>
              
              <div className={`flex rounded-lg p-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <button
                  onClick={() => setView('kanban')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    view === 'kanban' 
                      ? darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900 shadow-sm' 
                      : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    view === 'list' 
                      ? darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900 shadow-sm' 
                      : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Lijst
                </button>
              </div>
            </div>

            {/* Kanban view */}
            {view === 'kanban' && (
              <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                {(['onboarding', 'design', 'development', 'review', 'live'] as ProjectPhase[]).map((phase, index) => (
                  <motion.div
                    key={phase}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <KanbanColumn
                      phase={phase}
                      projects={projectsByPhase[phase]}
                      onProjectClick={(project) => setSelectedProject(project)}
                      onQuickAction={(project, action) => {
                        console.log('Quick action:', action, project.projectId)
                      }}
                      darkMode={darkMode}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* List view */}
            {view === 'list' && (
              <div className={`rounded-xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <table className="w-full">
                  <thead className={darkMode ? 'bg-gray-750 border-b border-gray-700' : 'bg-gray-50 border-b border-gray-200'}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Project</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pakket</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fase</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Voortgang</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Deadline</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Acties</th>
                    </tr>
                  </thead>
                  <tbody className={darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}>
                    {filteredProjects.map(project => (
                      <tr 
                        key={project.projectId} 
                        className={`cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                        onClick={() => setSelectedProject(project)}
                      >
                        <td className="px-6 py-4">
                          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.businessName}</div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{project.projectId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{getPackageConfig(project.package)?.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${phaseColors[project.phase].bg} ${phaseColors[project.phase].text}`}>
                            <PhaseIcon phase={project.phase} className="w-3.5 h-3.5" />
                            {project.phase.charAt(0).toUpperCase() + project.phase.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-20 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                              <div 
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${calculateProgress(project)}%` }}
                              />
                            </div>
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{calculateProgress(project)}%</span>
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {project.estimatedCompletion ? formatDate(project.estimatedCompletion) : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <button className={`p-2 rounded-lg transition-colors ${
                            darkMode ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                          }`}>
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* KANBAN TAB */}
        {activeTab === 'kanban' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Kanban Board
              </h2>
              <button
                onClick={() => {
                  alert('Nieuwe taak toevoegen is nog niet geïmplementeerd. Taken worden automatisch gegenereerd vanuit projecten.')
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                Nieuwe taak
              </button>
            </div>

            <KanbanBoard
              columns={getDefaultColumns(
                projects.flatMap((project) => {
                  const tasks: KanbanTask[] = []
                  
                  // Convert project phase to column
                  const columnMapping: Record<string, string> = {
                    'onboarding': 'todo',
                    'design': 'in_progress',
                    'development': 'in_progress',
                    'review': 'review',
                    'live': 'done',
                  }
                  
                  // Create a task for each project based on its phase
                  tasks.push({
                    id: project.projectId,
                    title: project.businessName,
                    description: `${project.package} - ${project.phase}`,
                    projectId: columnMapping[project.phase] || 'backlog',
                    projectName: project.projectId,
                    priority: 'normal',
                    dueDate: project.estimatedCompletion,
                    commentsCount: project.messages?.length || 0,
                    createdAt: project.createdAt,
                  })
                  
                  return tasks
                })
              )}
              onTaskMove={(taskId, fromColumn, toColumn) => {
                console.log(`Moving task ${taskId} from ${fromColumn} to ${toColumn}`)
                // In production: update project phase via API
              }}
              onTaskClick={(task) => {
                const project = projects.find(p => p.projectId === task.id)
                if (project) {
                  setSelectedProject(project)
                }
              }}
              onAddTask={(columnId) => {
                alert(`Taak toevoegen aan ${columnId} is nog niet geïmplementeerd. Taken worden automatisch gegenereerd vanuit projecten.`)
              }}
              onDeleteTask={(taskId, columnId) => {
                console.log(`Deleting task ${taskId} from ${columnId}`)
                // In production: delete task via API
              }}
              darkMode={darkMode}
            />
          </div>
        )}

        {/* CLIENTS TAB */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Klanten ({clients.length})
              </h2>
            </div>

            <div className="grid gap-4">
              {clients.map(client => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        darkMode ? 'bg-gray-700' : 'bg-blue-50'
                      }`}>
                        <Building className={`w-7 h-7 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {client.company}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{client.name}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <a href={`mailto:${client.email}`} className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600">
                            <Mail className="w-4 h-4" />
                            {client.email}
                          </a>
                          {client.phone && (
                            <a href={`tel:${client.phone}`} className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600">
                              <Phone className="w-4 h-4" />
                              {client.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedClient(client)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 text-white hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Projecten</p>
                          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {client.projects.length}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Totaal besteed</p>
                          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            €{client.totalSpent}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Klant sinds</p>
                          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formatDate(client.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {client.projects.map(pId => {
                          const project = projects.find(p => p.projectId === pId)
                          if (!project) return null
                          return (
                            <span 
                              key={pId}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${phaseColors[project.phase].bg} ${phaseColors[project.phase].text}`}
                            >
                              <PhaseIcon phase={project.phase} className="w-3 h-3" />
                              {project.package}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {clients.length === 0 && (
                <div className={`text-center py-12 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <Users className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Nog geen klanten</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Service Aanvragen
              </h2>
              <div className={`flex gap-2 p-1 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                {['all', 'drone', 'logo', 'foto', 'tekst'].map(type => (
                  <button
                    key={type}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      darkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                    }`}
                  >
                    {type === 'all' ? 'Alle' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {serviceRequests.map(sr => (
                <motion.div
                  key={sr.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        sr.type === 'drone' ? 'bg-blue-100 text-blue-600' :
                        sr.type === 'logo' ? 'bg-purple-100 text-purple-600' :
                        sr.type === 'foto' ? 'bg-amber-100 text-amber-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {sr.type === 'drone' ? <Camera className="w-6 h-6" /> :
                         sr.type === 'logo' ? <PenTool className="w-6 h-6" /> :
                         sr.type === 'foto' ? <Camera className="w-6 h-6" /> :
                         <FileText className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {sr.type === 'drone' ? 'Dronebeelden' :
                             sr.type === 'logo' ? 'Logo ontwerp' :
                             sr.type === 'foto' ? 'Fotografie' : 'Tekstschrijven'}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            sr.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            sr.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            sr.status === 'completed' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {sr.status === 'pending' ? 'In afwachting' :
                             sr.status === 'in_progress' ? 'Bezig' :
                             sr.status === 'completed' ? 'Afgerond' : 'Geannuleerd'}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{sr.clientName}</p>
                        <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{sr.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {sr.price && (
                        <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          €{sr.price}
                        </p>
                      )}
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formatDate(sr.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`mt-4 pt-4 border-t flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-4">
                      <a href={`mailto:${sr.clientEmail}`} className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600">
                        <Mail className="w-4 h-4" />
                        {sr.clientEmail}
                      </a>
                      <a href={`tel:${sr.clientPhone}`} className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600">
                        <Phone className="w-4 h-4" />
                        {sr.clientPhone}
                      </a>
                    </div>
                    <div className="flex gap-2">
                      {sr.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateServiceRequest(sr.id, { status: 'in_progress' })}
                            className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Start
                          </button>
                          <button
                            onClick={() => updateServiceRequest(sr.id, { status: 'cancelled' })}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                              darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Annuleren
                          </button>
                        </>
                      )}
                      {sr.status === 'in_progress' && (
                        <button
                          onClick={() => updateServiceRequest(sr.id, { status: 'completed', completedAt: new Date().toISOString() })}
                          className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          Afronden
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {serviceRequests.length === 0 && (
                <div className={`text-center py-12 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <Briefcase className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Geen service aanvragen</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BILLING TAB */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Betalingen & Facturen
              </h2>
            </div>

            {/* Billing Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>MRR</span>
                </div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  €{(projects.filter(p => p.phase !== 'live').length * 49).toLocaleString()}
                </p>
                <p className="text-sm text-green-600">+12% vs vorige maand</p>
              </div>

              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actieve abonnementen</span>
                </div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {projects.filter(p => p.phase === 'live').length}
                </p>
              </div>

              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Openstaand</span>
                </div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>€0</p>
              </div>

              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Deze maand</span>
                </div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  €{(projects.length * 49).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Recent Payments */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Recente betalingen
              </h3>
              
              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <div 
                    key={project.projectId}
                    className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {project.businessName}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {project.package} • Automatische incasso
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        €{project.package === 'starter' ? '29,00' : project.package === 'professional' ? '49,00' : '79,00'}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date().toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div className="text-center py-8">
                    <CreditCard className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Nog geen betalingen</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => alert('Factuur maken is nog niet geïmplementeerd. Dit wordt binnenkort toegevoegd.')}
                className={`p-4 rounded-xl text-left transition ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}>
                <FileText className={`w-6 h-6 mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Factuur maken</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Handmatig een factuur aanmaken
                </p>
              </button>

              <button 
                onClick={() => alert('Betaallink sturen is nog niet geïmplementeerd. Dit wordt binnenkort toegevoegd.')}
                className={`p-4 rounded-xl text-left transition ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}>
                <Mail className={`w-6 h-6 mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Betaallink sturen</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Stuur een betaalverzoek naar klant
                </p>
              </button>

              <button 
                onClick={() => alert('Export is nog niet geïmplementeerd. Dit wordt binnenkort toegevoegd.')}
                className={`p-4 rounded-xl text-left transition ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}>
                <Download className={`w-6 h-6 mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Export</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Download alle facturen
                </p>
              </button>
            </div>

            {/* Mollie Info */}
            <div className={`p-6 rounded-2xl border-2 border-dashed ${
              darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Mollie Integratie
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
                    Alle betalingen worden automatisch verwerkt via Mollie. 
                    Subscriptions worden maandelijks geïncasseerd.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
                      ✓ Verbonden
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">
                      iDEAL
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">
                      Automatische incasso
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Instellingen</h2>
            
            {/* Appearance */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Weergave</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className={darkMode ? 'text-white' : 'text-gray-900'}>Dark mode</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Schakel over naar donkere weergave</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${darkMode ? 'bg-blue-500' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>

            {/* Password change */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Wachtwoord wijzigen</h3>
              
              {!showPasswordChange ? (
                <button
                  onClick={() => setShowPasswordChange(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Wachtwoord wijzigen
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Nieuw wachtwoord
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-200'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Bevestig wachtwoord
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-200'
                      }`}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        // TODO: Save password to server
                        alert('Wachtwoord wijzigen is nog niet geïmplementeerd')
                        setShowPasswordChange(false)
                        setNewPassword('')
                        setConfirmPassword('')
                      }}
                      disabled={!newPassword || newPassword !== confirmPassword}
                      className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Opslaan
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordChange(false)
                        setNewPassword('')
                        setConfirmPassword('')
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Annuleren
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notificaties</h3>
              <div className="space-y-4">
                {[
                  { id: 'email_messages', label: 'E-mail bij nieuw bericht', desc: 'Ontvang een e-mail wanneer een klant een bericht stuurt' },
                  { id: 'email_changes', label: 'E-mail bij wijzigingsverzoek', desc: 'Ontvang een e-mail bij nieuwe wijzigingsverzoeken' },
                  { id: 'email_payments', label: 'E-mail bij betaling', desc: 'Ontvang een e-mail bij binnenkomende betalingen' },
                ].map(setting => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div>
                      <p className={darkMode ? 'text-white' : 'text-gray-900'}>{setting.label}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{setting.desc}</p>
                    </div>
                    <button className={`relative w-14 h-8 rounded-full transition-colors bg-blue-500`}>
                      <div className="absolute top-1 left-7 w-6 h-6 bg-white rounded-full shadow" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger zone */}
            <div className={`p-6 rounded-2xl border-2 ${darkMode ? 'bg-gray-800 border-red-900' : 'bg-red-50 border-red-200'}`}>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>Gevaarlijke zone</h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Deze acties zijn permanent en kunnen niet ongedaan worden gemaakt.
              </p>
              <button className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors">
                Alle data wissen
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Client edit modal */}
      <AnimatePresence>
        {selectedClient && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setSelectedClient(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-2xl shadow-2xl z-50 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Klant bewerken</h3>
                <button onClick={() => setSelectedClient(null)} className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Naam</label>
                  <input
                    type="text"
                    defaultValue={selectedClient.name}
                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bedrijf</label>
                  <input
                    type="text"
                    defaultValue={selectedClient.company}
                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>E-mail</label>
                  <input
                    type="email"
                    defaultValue={selectedClient.email}
                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Telefoon</label>
                  <input
                    type="tel"
                    defaultValue={selectedClient.phone}
                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notities</label>
                  <textarea
                    rows={3}
                    defaultValue={selectedClient.notes || ''}
                    placeholder="Interne notities..."
                    className={`w-full px-4 py-2 rounded-lg border resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200'}`}
                  />
                </div>
              </div>
              <div className={`flex justify-end gap-2 p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  onClick={() => setSelectedClient(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Annuleren
                </button>
                <button
                  onClick={() => updateClient(selectedClient.id, {})}
                  className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Opslaan
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Project detail panel */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setSelectedProject(null)}
            />
            
            {/* Panel */}
            <ProjectDetailPanel
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
              onUpdate={(updates) => {
                // Update project
                setProjects(prev => prev.map(p => 
                  p.projectId === selectedProject.projectId ? { ...p, ...updates } : p
                ))
              }}
              onSendEmail={(template) => {
                console.log('Send email:', template)
              }}
              onPhaseChange={(phase) => {
                setProjects(prev => prev.map(p => 
                  p.projectId === selectedProject.projectId ? { ...p, phase } : p
                ))
                setSelectedProject({ ...selectedProject, phase })
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
