import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  Rocket,
  ExternalLink,
  Plus,
  CheckCircle2,
  Clock,
  Loader2,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  ArrowUpRight,
  ArrowDownRight,
  Edit3,
  Send,
  ChevronDown,
  ChevronUp,
  X,
  Image,
  FileText,
  Palette,
  Settings,
  MessageCircle,
  FolderOpen,
  Sparkles,
  BarChart3,
  RefreshCw,
  Zap
} from 'lucide-react'
import { useDarkMode } from '../contexts/DarkModeContext'
import { PACKAGES } from '../config/packages'
import type { PackageType } from '../config/packages'

// Pakket configuratie met limieten - nu met gecentraliseerde config
const PACKAGE_CONFIG: Record<string, { 
  changes: number
  label: string
  color: string
}> = {
  starter: { 
    changes: PACKAGES.starter.changesPerMonth, 
    label: PACKAGES.starter.name,
    color: 'bg-blue-500'
  },
  professional: { 
    changes: PACKAGES.professional.changesPerMonth, 
    label: PACKAGES.professional.name,
    color: 'bg-purple-500'
  },
  business: { 
    changes: PACKAGES.business.changesPerMonth, 
    label: PACKAGES.business.name,
    color: 'bg-amber-500'
  },
  webshop: { 
    changes: PACKAGES.webshop.changesPerMonth, 
    label: PACKAGES.webshop.name,
    color: 'bg-emerald-500'
  }
}
void (0 as unknown as PackageType) // Zorgt ervoor dat PackageType gebruikt wordt

// Wijzigingsverzoek categorie keys en icons
const CHANGE_CATEGORY_KEYS = ['text', 'design', 'images', 'functionality', 'other'] as const
const CHANGE_CATEGORY_ICONS: Record<string, typeof FileText> = {
  text: FileText,
  design: Palette,
  images: Image,
  functionality: Settings,
  other: Edit3
}

// Prioriteit keys en kleuren
const PRIORITY_KEYS = ['low', 'normal', 'urgent'] as const
const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-gray-400',
  normal: 'text-blue-400',
  urgent: 'text-red-400'
}

interface ChangeRequest {
  id?: string
  title?: string
  description: string
  priority: 'low' | 'normal' | 'urgent'
  category: 'text' | 'design' | 'images' | 'functionality' | 'other'
  status?: 'pending' | 'in_progress' | 'done' | 'completed'
  createdAt?: string
  response?: string
}

interface AnalyticsData {
  visitors: { current: number; previous: number; change: number }
  pageViews: { current: number; previous: number; change: number }
  avgTime: { current: string; previous: string; change: number }
  bounceRate: { current: number; previous: number; change: number }
  topPages: { path: string; views: number }[]
  sources: { name: string; visitors: number; percentage: number }[]
}

interface ClientLiveDashboardProps {
  businessName: string
  projectPackage: string
  liveUrl?: string
  liveDate?: string
  googleDriveUrl?: string
  analyticsUrl?: string // Ingebedde analytics URL van developer
  changeRequests?: ChangeRequest[]
  changesThisMonth?: number
  onRequestChange: (request: ChangeRequest) => Promise<void>
  onContactDeveloper?: () => void
}

export default function ClientLiveDashboard({
  businessName,
  projectPackage,
  liveUrl,
  liveDate,
  googleDriveUrl,
  analyticsUrl,
  changeRequests = [],
  changesThisMonth = 0,
  onRequestChange,
  onContactDeveloper
}: ClientLiveDashboardProps) {
  const { darkMode } = useDarkMode()
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState<'overview' | 'changes' | 'analytics'>('overview')
  const [showChangeForm, setShowChangeForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  
  // Nieuw wijzigingsverzoek formulier state
  const [newChange, setNewChange] = useState<Partial<ChangeRequest>>({
    title: '',
    description: '',
    priority: 'normal',
    category: 'text'
  })

  // Mock analytics data (in productie zou dit van analyticsUrl of API komen)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  const packageConfig = PACKAGE_CONFIG[projectPackage] || PACKAGE_CONFIG.starter
  const changesLeft = packageConfig.changes === 999 ? 999 : Math.max(0, packageConfig.changes - changesThisMonth)
  const isUnlimited = packageConfig.changes === 999
  const canRequestChange = isUnlimited || changesLeft > 0

  // Categoriseer wijzigingsverzoeken
  const pendingRequests = changeRequests.filter(r => r.status === 'pending')
  const inProgressRequests = changeRequests.filter(r => r.status === 'in_progress')
  const completedRequests = changeRequests.filter(r => r.status === 'done' || r.status === 'completed')

  // Laad analytics wanneer tab verandert
  useEffect(() => {
    if (activeTab === 'analytics' && analyticsUrl && !analytics) {
      loadAnalytics()
    }
  }, [activeTab, analyticsUrl])

  const loadAnalytics = async () => {
    setAnalyticsLoading(true)
    try {
      // In productie, ophalen van analyticsUrl of API
      // Voor nu, simuleer met mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAnalytics({
        visitors: { current: 1247, previous: 1089, change: 14.5 },
        pageViews: { current: 3892, previous: 3421, change: 13.8 },
        avgTime: { current: '2:34', previous: '2:12', change: 16.7 },
        bounceRate: { current: 42, previous: 48, change: -12.5 },
        topPages: [
          { path: '/', views: 1523 },
          { path: '/diensten', views: 892 },
          { path: '/over-ons', views: 654 },
          { path: '/contact', views: 423 },
          { path: '/portfolio', views: 312 }
        ],
        sources: [
          { name: 'Google', visitors: 623, percentage: 50 },
          { name: 'Direct', visitors: 374, percentage: 30 },
          { name: 'Social Media', visitors: 187, percentage: 15 },
          { name: 'Overig', visitors: 63, percentage: 5 }
        ]
      })
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const handleSubmitChange = async () => {
    if (!newChange.description?.trim()) return
    
    setLoading(true)
    try {
      await onRequestChange({
        title: newChange.title || undefined,
        description: newChange.description,
        priority: newChange.priority as 'low' | 'normal' | 'urgent',
        category: newChange.category as any,
        status: 'pending',
        createdAt: new Date().toISOString()
      })
      
      setNewChange({ title: '', description: '', priority: 'normal', category: 'text' })
      setShowChangeForm(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to submit change request:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('clientDashboard.status.unknown')
    return new Date(dateString).toLocaleDateString(i18n.language === 'nl' ? 'nl-NL' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Haal features op uit vertalingen
  const packageFeatures = t(`clientDashboard.packages.${projectPackage}.features`, { returnObjects: true }) as string[] || []

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">{t('clientDashboard.status.new')}</span>
      case 'in_progress':
        return <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">{t('clientDashboard.status.inProgress')}</span>
      case 'done':
      case 'completed':
        return <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">{t('clientDashboard.status.completed')}</span>
      default:
        return <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 text-xs rounded-full">{t('clientDashboard.status.unknown')}</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header met Website Status */}
      <div className={`border rounded-2xl p-6 ${
        darkMode 
          ? 'bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-teal-500/10 border-emerald-500/30' 
          : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-emerald-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{businessName}</h2>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 ${
                  darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Live
                </span>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('clientDashboard.liveSince', { date: formatDate(liveDate) })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition shadow-lg shadow-emerald-500/25"
              >
                <Globe className="w-4 h-4" />
                {t('clientDashboard.viewWebsite')}
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {googleDriveUrl && (
              <a
                href={googleDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2.5 font-medium rounded-xl transition ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                {t('clientDashboard.files')}
              </a>
            )}
          </div>
        </div>

        {/* Pakket Info */}
        <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-emerald-500/20' : 'border-emerald-200'}`}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 ${packageConfig.color} text-white text-sm font-medium rounded-full`}>
                {packageConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              {packageFeatures.map((feature: string, i: number) => (
                <div key={i} className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigatie */}
      <div className={`flex items-center gap-1 p-1 rounded-xl w-fit ${
        darkMode ? 'bg-gray-800/50' : 'bg-gray-100'
      }`}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'overview'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {t('clientDashboard.tabs.overview')}
        </button>
        <button
          onClick={() => setActiveTab('changes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'changes'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          {t('clientDashboard.tabs.changes')}
          {pendingRequests.length + inProgressRequests.length > 0 && (
            <span className={`px-1.5 py-0.5 text-xs rounded-full ${
              activeTab === 'changes' ? 'bg-white/20' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
            }`}>
              {pendingRequests.length + inProgressRequests.length}
            </span>
          )}
        </button>
        {(analyticsUrl || projectPackage !== 'starter') && (
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            {t('clientDashboard.tabs.analytics')}
          </button>
        )}
      </div>

      {/* Tab Inhoud */}
      <AnimatePresence mode="wait">
        {/* Overzicht Tab */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {/* Snelle Statistieken */}
            <div className={`border rounded-xl p-5 ${
              darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}>
                  <Edit3 className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('clientDashboard.stats.changes')}</h3>
                  <p className="text-xs text-gray-500">{t('clientDashboard.stats.thisMonth')}</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {isUnlimited ? '∞' : changesLeft}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {isUnlimited ? t('clientDashboard.stats.available') : `${t('clientDashboard.stats.of')} ${packageConfig.changes}`}
                  </span>
                </div>
                {!isUnlimited && (
                  <div className={`w-16 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(changesLeft / packageConfig.changes) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Openstaande Aanvragen */}
            <div className={`border rounded-xl p-5 ${
              darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'
                }`}>
                  <Clock className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('clientDashboard.stats.openRequests')}</h3>
                  <p className="text-xs text-gray-500">{t('clientDashboard.stats.waitingProcessing')}</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pendingRequests.length + inProgressRequests.length}</span>
                {inProgressRequests.length > 0 && (
                  <span className="text-sm text-blue-400">{inProgressRequests.length} {t('clientDashboard.stats.inProgress')}</span>
                )}
              </div>
            </div>

            {/* Afgerond */}
            <div className={`border rounded-xl p-5 ${
              darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'
                }`}>
                  <CheckCircle2 className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('clientDashboard.stats.completed')}</h3>
                  <p className="text-xs text-gray-500">{t('clientDashboard.stats.totalProcessed')}</p>
                </div>
              </div>
              <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{completedRequests.length}</span>
            </div>

            {/* Snelle Acties */}
            <div className={`md:col-span-2 lg:col-span-3 border rounded-xl p-5 ${
              darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('clientDashboard.quickActions.title')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => {
                    setActiveTab('changes')
                    setShowChangeForm(true)
                  }}
                  disabled={!canRequestChange}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition ${
                    canRequestChange
                      ? 'bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400'
                      : darkMode ? 'bg-gray-700/50 border border-gray-600 text-gray-500 cursor-not-allowed' : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-sm font-medium">{t('clientDashboard.quickActions.requestChange')}</span>
                </button>
                
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl hover:bg-blue-500/20 text-blue-400 transition"
                  >
                    <Globe className="w-6 h-6" />
                    <span className="text-sm font-medium">{t('clientDashboard.quickActions.viewWebsite')}</span>
                  </a>
                )}
                
                {onContactDeveloper && (
                  <button
                    onClick={onContactDeveloper}
                    className="flex flex-col items-center gap-2 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl hover:bg-purple-500/20 text-purple-400 transition"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-sm font-medium">{t('clientDashboard.quickActions.contact')}</span>
                  </button>
                )}
                
                {googleDriveUrl && (
                  <a
                    href={googleDriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl hover:bg-amber-500/20 text-amber-400 transition"
                  >
                    <FolderOpen className="w-6 h-6" />
                    <span className="text-sm font-medium">{t('clientDashboard.quickActions.files')}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Recente Activiteit */}
            {changeRequests.length > 0 && (
              <div className="md:col-span-2 lg:col-span-3 bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-4">{t('clientDashboard.recentActivity.title')}</h3>
                <div className="space-y-3">
                  {changeRequests.slice(0, 3).map((request, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        request.status === 'done' || request.status === 'completed' 
                          ? 'bg-emerald-500/20' 
                          : request.status === 'in_progress'
                            ? 'bg-blue-500/20'
                            : 'bg-yellow-500/20'
                      }`}>
                        {request.status === 'done' || request.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : request.status === 'in_progress' ? (
                          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white text-sm truncate">
                            {request.title || request.description.substring(0, 50)}
                          </span>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatDate(request.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {changeRequests.length > 3 && (
                  <button
                    onClick={() => setActiveTab('changes')}
                    className="mt-4 text-sm text-emerald-400 hover:text-emerald-300 transition"
                  >
                    {t('clientDashboard.recentActivity.viewAll', { count: changeRequests.length })}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Wijzigingen Tab */}
        {activeTab === 'changes' && (
          <motion.div
            key="changes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Wijzigingsverzoek Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">{t('clientDashboard.changeRequests.title')}</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {isUnlimited 
                    ? t('clientDashboard.changeRequests.unlimitedDesc')
                    : t('clientDashboard.changeRequests.limitedDesc', { left: changesLeft, total: packageConfig.changes })
                  }
                </p>
              </div>
              <button
                onClick={() => setShowChangeForm(true)}
                disabled={!canRequestChange}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition ${
                  canRequestChange
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Plus className="w-5 h-5" />
                {t('clientDashboard.changeRequests.newRequest')}
              </button>
            </div>

            {/* Succesbericht */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <p className="text-emerald-400 font-medium">{t('clientDashboard.changeRequests.successMessage')}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nieuw Wijzigingsformulier */}
            <AnimatePresence>
              {showChangeForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white text-lg">{t('clientDashboard.changeRequests.formTitle')}</h4>
                      <button
                        onClick={() => setShowChangeForm(false)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition"
                      >
                        <X className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    {/* Titel (optioneel) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('clientDashboard.changeRequests.titleLabel')}
                      </label>
                      <input
                        type="text"
                        value={newChange.title || ''}
                        onChange={(e) => setNewChange({ ...newChange, title: e.target.value })}
                        placeholder={t('clientDashboard.changeRequests.titlePlaceholder')}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Categorie Selectie */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('clientDashboard.changeRequests.categoryLabel')}
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {CHANGE_CATEGORY_KEYS.map((catKey) => {
                          const CatIcon = CHANGE_CATEGORY_ICONS[catKey] || Edit3
                          return (
                            <button
                              key={catKey}
                              onClick={() => setNewChange({ ...newChange, category: catKey as any })}
                              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition ${
                                newChange.category === catKey
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                  : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:border-gray-500'
                              }`}
                            >
                              <CatIcon className="w-5 h-5" />
                              <span className="text-xs font-medium">{t(`clientDashboard.categories.${catKey}.label`)}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Beschrijving */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('clientDashboard.changeRequests.descriptionLabel')}
                      </label>
                      <textarea
                        value={newChange.description || ''}
                        onChange={(e) => setNewChange({ ...newChange, description: e.target.value })}
                        placeholder={t('clientDashboard.changeRequests.descriptionPlaceholder')}
                        className="w-full h-32 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>

                    {/* Prioriteit Selectie */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('clientDashboard.changeRequests.priorityLabel')}
                      </label>
                      <div className="flex gap-3">
                        {PRIORITY_KEYS.map((priorityKey) => (
                          <button
                            key={priorityKey}
                            onClick={() => setNewChange({ ...newChange, priority: priorityKey as any })}
                            className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border transition ${
                              newChange.priority === priorityKey
                                ? 'bg-gray-700 border-gray-500'
                                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <span className={`font-medium ${PRIORITY_COLORS[priorityKey]}`}>{t(`clientDashboard.priority.${priorityKey}.label`)}</span>
                            <span className="text-xs text-gray-500">{t(`clientDashboard.priority.${priorityKey}.description`)}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Versturen */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setShowChangeForm(false)}
                        className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition"
                      >
                        {t('clientDashboard.changeRequests.cancel')}
                      </button>
                      <button
                        onClick={handleSubmitChange}
                        disabled={loading || !newChange.description?.trim()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-xl transition"
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            {t('clientDashboard.changeRequests.submit')}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Wijzigingsverzoeken Lijst */}
            <div className="space-y-4">
              {/* In Behandeling */}
              {inProgressRequests.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                    {t('clientDashboard.changeRequests.inProgress')} ({inProgressRequests.length})
                  </h4>
                  <div className="space-y-2">
                    {inProgressRequests.map((request, i) => (
                      <ChangeRequestCard
                        key={i}
                        request={request}
                        expanded={expandedRequest === request.id}
                        onToggle={() => setExpandedRequest(expandedRequest === request.id ? null : request.id || null)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Wachtend */}
              {pendingRequests.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    {t('clientDashboard.changeRequests.waiting')} ({pendingRequests.length})
                  </h4>
                  <div className="space-y-2">
                    {pendingRequests.map((request, i) => (
                      <ChangeRequestCard
                        key={i}
                        request={request}
                        expanded={expandedRequest === request.id}
                        onToggle={() => setExpandedRequest(expandedRequest === request.id ? null : request.id || null)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Afgerond */}
              {completedRequests.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {t('clientDashboard.changeRequests.completed')} ({completedRequests.length})
                  </h4>
                  <div className="space-y-2">
                    {completedRequests.slice(0, 5).map((request, i) => (
                      <ChangeRequestCard
                        key={i}
                        request={request}
                        expanded={expandedRequest === request.id}
                        onToggle={() => setExpandedRequest(expandedRequest === request.id ? null : request.id || null)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Lege Status */}
              {changeRequests.length === 0 && !showChangeForm && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-gray-700/50 flex items-center justify-center mx-auto mb-4">
                    <Edit3 className="w-8 h-8 text-gray-500" />
                  </div>
                  <h4 className="font-medium text-white mb-2">{t('clientDashboard.changeRequests.noChanges')}</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    {t('clientDashboard.changeRequests.noChangesDesc')}
                  </p>
                  <button
                    onClick={() => setShowChangeForm(true)}
                    disabled={!canRequestChange}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition"
                  >
                    <Plus className="w-5 h-5" />
                    {t('clientDashboard.changeRequests.firstRequest')}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {analyticsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">{t('clientDashboard.analytics.loading')}</p>
                </div>
              </div>
            ) : analytics ? (
              <>
                {/* Statistieken Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    icon={Users}
                    label={t('clientDashboard.analytics.visitors')}
                    value={analytics.visitors.current.toLocaleString(i18n.language === 'nl' ? 'nl-NL' : 'en-US')}
                    change={analytics.visitors.change}
                    period={t('clientDashboard.analytics.vsPrevMonth')}
                  />
                  <StatCard
                    icon={Eye}
                    label={t('clientDashboard.analytics.pageViews')}
                    value={analytics.pageViews.current.toLocaleString(i18n.language === 'nl' ? 'nl-NL' : 'en-US')}
                    change={analytics.pageViews.change}
                    period={t('clientDashboard.analytics.vsPrevMonth')}
                  />
                  <StatCard
                    icon={Clock}
                    label={t('clientDashboard.analytics.avgSession')}
                    value={analytics.avgTime.current}
                    change={analytics.avgTime.change}
                    period={t('clientDashboard.analytics.vsPrevMonth')}
                  />
                  <StatCard
                    icon={MousePointer}
                    label={t('clientDashboard.analytics.bounceRate')}
                    value={`${analytics.bounceRate.current}%`}
                    change={analytics.bounceRate.change}
                    period={t('clientDashboard.analytics.vsPrevMonth')}
                    invertChange
                  />
                </div>

                {/* Grafieken Rij */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Populaire Pagina's */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                      {t('clientDashboard.analytics.popularPages')}
                    </h4>
                    <div className="space-y-3">
                      {analytics.topPages.map((page, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                            {i + 1}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-white">{page.path}</span>
                              <span className="text-sm text-gray-400">{page.views}</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${(page.views / analytics.topPages[0].views) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verkeersbronnen */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      {t('clientDashboard.analytics.trafficSources')}
                    </h4>
                    <div className="space-y-3">
                      {analytics.sources.map((source, i) => {
                        const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500']
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${colors[i] || 'bg-gray-500'}`} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-white">{source.name}</span>
                                <span className="text-sm text-gray-400">{source.percentage}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${colors[i] || 'bg-gray-500'}`}
                                  style={{ width: `${source.percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Externe Analytics Link */}
                {analyticsUrl && (
                  <a
                    href={analyticsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition text-gray-400 hover:text-white"
                  >
                    <ExternalLink className="w-5 h-5" />
                    {t('clientDashboard.analytics.viewFull')}
                  </a>
                )}
              </>
            ) : projectPackage === 'starter' ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-gray-700/50 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-500" />
                </div>
                <h4 className="font-medium text-white mb-2">{t('clientDashboard.analytics.notAvailable')}</h4>
                <p className="text-gray-400 text-sm mb-4">
                  {t('clientDashboard.analytics.upgradeDesc')}
                </p>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl transition hover:opacity-90">
                  <Zap className="w-5 h-5" />
                  {t('clientDashboard.analytics.upgradePackage')}
                </button>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-gray-700/50 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-500" />
                </div>
                <h4 className="font-medium text-white mb-2">{t('clientDashboard.analytics.beingSetup')}</h4>
                <p className="text-gray-400 text-sm">
                  {t('clientDashboard.analytics.checkLater')}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Statistiek Kaart Component
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  period,
  invertChange = false 
}: { 
  icon: typeof Users
  label: string
  value: string
  change: number
  period: string
  invertChange?: boolean
}) {
  const isPositive = invertChange ? change < 0 : change > 0
  
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-emerald-400" />
        </div>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-white">{value}</span>
        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">{period}</p>
    </div>
  )
}

// Wijzigingsverzoek Kaart Component
function ChangeRequestCard({ 
  request, 
  expanded, 
  onToggle 
}: { 
  request: ChangeRequest
  expanded: boolean
  onToggle: () => void
}) {
  const { t, i18n } = useTranslation()
  const CategoryIcon = CHANGE_CATEGORY_ICONS[request.category] || Edit3
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'border-yellow-500/30 bg-yellow-500/5'
      case 'in_progress': return 'border-blue-500/30 bg-blue-500/5'
      case 'done':
      case 'completed': return 'border-emerald-500/30 bg-emerald-500/5'
      default: return 'border-gray-700'
    }
  }

  return (
    <div className={`border rounded-xl overflow-hidden ${getStatusColor(request.status)}`}>
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-4 text-left"
      >
        <div className="w-10 h-10 rounded-xl bg-gray-700/50 flex items-center justify-center flex-shrink-0">
          <CategoryIcon className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white truncate">
              {request.title || request.description.substring(0, 50)}
            </span>
            {request.status === 'pending' && (
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">{t('clientDashboard.status.new')}</span>
            )}
            {request.status === 'in_progress' && (
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">{t('clientDashboard.status.inProgress')}</span>
            )}
            {(request.status === 'done' || request.status === 'completed') && (
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">{t('clientDashboard.status.completed')}</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{t(`clientDashboard.categories.${request.category}.label`)}</span>
            <span>•</span>
            <span>{request.createdAt ? new Date(request.createdAt).toLocaleDateString(i18n.language === 'nl' ? 'nl-NL' : 'en-US') : t('clientDashboard.status.unknown')}</span>
            {request.priority === 'urgent' && (
              <>
                <span>•</span>
                <span className="text-red-400">{t('clientDashboard.priority.urgent.label')}</span>
              </>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">
              <div className="border-t border-gray-700/50 pt-4">
                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                  {request.description}
                </p>
                {request.response && (
                  <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <p className="text-xs text-emerald-400 font-medium mb-1">{t('clientDashboard.developerResponse')}</p>
                    <p className="text-sm text-gray-300">{request.response}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
