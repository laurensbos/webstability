import { useState, useEffect } from 'react'
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

// Package configuration with limits
const PACKAGE_CONFIG: Record<string, { 
  changes: number
  label: string
  color: string
  features: string[]
}> = {
  starter: { 
    changes: 2, 
    label: 'Starter',
    color: 'bg-gray-500',
    features: ['2 wijzigingen/maand', 'E-mail support']
  },
  professional: { 
    changes: 5, 
    label: 'Professioneel',
    color: 'bg-blue-500',
    features: ['5 wijzigingen/maand', 'Priority support', 'Analytics']
  },
  business: { 
    changes: 999, 
    label: 'Business',
    color: 'bg-purple-500',
    features: ['Onbeperkte wijzigingen', 'WhatsApp support', 'Analytics', 'Priority']
  },
  webshop: { 
    changes: 999, 
    label: 'Webshop',
    color: 'bg-indigo-500',
    features: ['Onbeperkte wijzigingen', 'WhatsApp support', 'Analytics', 'E-commerce']
  }
}

// Change request categories
const CHANGE_CATEGORIES = [
  { key: 'text', label: 'Tekst', icon: FileText, description: 'Tekst aanpassen of toevoegen' },
  { key: 'design', label: 'Design', icon: Palette, description: 'Kleuren, layout, styling' },
  { key: 'images', label: 'Afbeeldingen', icon: Image, description: 'Foto\'s toevoegen of vervangen' },
  { key: 'functionality', label: 'Functionaliteit', icon: Settings, description: 'Nieuwe features of fixes' },
  { key: 'other', label: 'Anders', icon: Edit3, description: 'Overige aanpassingen' }
]

// Priority options
const PRIORITY_OPTIONS = [
  { key: 'low', label: 'Laag', color: 'text-gray-400', description: 'Geen haast' },
  { key: 'normal', label: 'Normaal', color: 'text-blue-400', description: 'Binnen een week' },
  { key: 'urgent', label: 'Urgent', color: 'text-red-400', description: 'Zo snel mogelijk' }
]

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
  analyticsUrl?: string // Embedded analytics URL from developer
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
  const [activeTab, setActiveTab] = useState<'overview' | 'changes' | 'analytics'>('overview')
  const [showChangeForm, setShowChangeForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  
  // New change request form state
  const [newChange, setNewChange] = useState<Partial<ChangeRequest>>({
    title: '',
    description: '',
    priority: 'normal',
    category: 'text'
  })

  // Mock analytics data (in production, this would come from the analyticsUrl or API)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  const packageConfig = PACKAGE_CONFIG[projectPackage] || PACKAGE_CONFIG.starter
  const changesLeft = packageConfig.changes === 999 ? 999 : Math.max(0, packageConfig.changes - changesThisMonth)
  const isUnlimited = packageConfig.changes === 999
  const canRequestChange = isUnlimited || changesLeft > 0

  // Categorize change requests
  const pendingRequests = changeRequests.filter(r => r.status === 'pending')
  const inProgressRequests = changeRequests.filter(r => r.status === 'in_progress')
  const completedRequests = changeRequests.filter(r => r.status === 'done' || r.status === 'completed')

  // Load analytics when tab changes
  useEffect(() => {
    if (activeTab === 'analytics' && analyticsUrl && !analytics) {
      loadAnalytics()
    }
  }, [activeTab, analyticsUrl])

  const loadAnalytics = async () => {
    setAnalyticsLoading(true)
    try {
      // In production, fetch from analyticsUrl or API
      // For now, simulate with mock data
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
    if (!dateString) return 'Onbekend'
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Nieuw</span>
      case 'in_progress':
        return <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">In behandeling</span>
      case 'done':
      case 'completed':
        return <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Afgerond</span>
      default:
        return <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 text-xs rounded-full">Onbekend</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Website Status */}
      <div className="bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-white">{businessName}</h2>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Live
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Online sinds {formatDate(liveDate)}
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
                Bekijk website
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {googleDriveUrl && (
              <a
                href={googleDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition"
              >
                <FolderOpen className="w-4 h-4" />
                Bestanden
              </a>
            )}
          </div>
        </div>

        {/* Package Info */}
        <div className="mt-6 pt-6 border-t border-emerald-500/20">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 ${packageConfig.color} text-white text-sm font-medium rounded-full`}>
                {packageConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              {packageConfig.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-1.5 text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-1 bg-gray-800/50 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'overview'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Overzicht
        </button>
        <button
          onClick={() => setActiveTab('changes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'changes'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          Wijzigingen
          {pendingRequests.length + inProgressRequests.length > 0 && (
            <span className="px-1.5 py-0.5 bg-white/20 text-xs rounded-full">
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
            Analytics
          </button>
        )}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {/* Quick Stats */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Wijzigingen</h3>
                  <p className="text-xs text-gray-500">Deze maand</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">
                    {isUnlimited ? '∞' : changesLeft}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {isUnlimited ? 'beschikbaar' : `van ${packageConfig.changes}`}
                  </span>
                </div>
                {!isUnlimited && (
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(changesLeft / packageConfig.changes) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Pending Requests */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Open aanvragen</h3>
                  <p className="text-xs text-gray-500">Wachtend op verwerking</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-white">{pendingRequests.length + inProgressRequests.length}</span>
                {inProgressRequests.length > 0 && (
                  <span className="text-sm text-blue-400">{inProgressRequests.length} in behandeling</span>
                )}
              </div>
            </div>

            {/* Completed */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Afgerond</h3>
                  <p className="text-xs text-gray-500">Totaal verwerkt</p>
                </div>
              </div>
              <span className="text-3xl font-bold text-white">{completedRequests.length}</span>
            </div>

            {/* Quick Actions */}
            <div className="md:col-span-2 lg:col-span-3 bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4">Snelle acties</h3>
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
                      : 'bg-gray-700/50 border border-gray-600 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-sm font-medium">Wijziging aanvragen</span>
                </button>
                
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl hover:bg-blue-500/20 text-blue-400 transition"
                  >
                    <Globe className="w-6 h-6" />
                    <span className="text-sm font-medium">Website bekijken</span>
                  </a>
                )}
                
                {onContactDeveloper && (
                  <button
                    onClick={onContactDeveloper}
                    className="flex flex-col items-center gap-2 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl hover:bg-purple-500/20 text-purple-400 transition"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-sm font-medium">Contact opnemen</span>
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
                    <span className="text-sm font-medium">Bestanden</span>
                  </a>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            {changeRequests.length > 0 && (
              <div className="md:col-span-2 lg:col-span-3 bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-4">Recente activiteit</h3>
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
                    Bekijk alle {changeRequests.length} aanvragen →
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Changes Tab */}
        {activeTab === 'changes' && (
          <motion.div
            key="changes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Change Request Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Wijzigingen aanvragen</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {isUnlimited 
                    ? 'Je hebt onbeperkte wijzigingen met je pakket'
                    : `Je hebt nog ${changesLeft} van ${packageConfig.changes} wijzigingen over deze maand`
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
                Nieuwe aanvraag
              </button>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <p className="text-emerald-400 font-medium">Je wijzigingsverzoek is ingediend!</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* New Change Form */}
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
                      <h4 className="font-semibold text-white text-lg">Nieuwe wijziging aanvragen</h4>
                      <button
                        onClick={() => setShowChangeForm(false)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition"
                      >
                        <X className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    {/* Title (optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Titel (optioneel)
                      </label>
                      <input
                        type="text"
                        value={newChange.title || ''}
                        onChange={(e) => setNewChange({ ...newChange, title: e.target.value })}
                        placeholder="Bijv: Homepage banner aanpassen"
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Categorie
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {CHANGE_CATEGORIES.map((cat) => (
                          <button
                            key={cat.key}
                            onClick={() => setNewChange({ ...newChange, category: cat.key as any })}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition ${
                              newChange.category === cat.key
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:border-gray-500'
                            }`}
                          >
                            <cat.icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{cat.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Beschrijving *
                      </label>
                      <textarea
                        value={newChange.description || ''}
                        onChange={(e) => setNewChange({ ...newChange, description: e.target.value })}
                        placeholder="Beschrijf zo duidelijk mogelijk wat je aangepast wilt hebben...&#10;&#10;Bijv:&#10;- Op welke pagina?&#10;- Wat moet er veranderen?&#10;- Heb je voorbeelden?"
                        className="w-full h-32 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>

                    {/* Priority Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Prioriteit
                      </label>
                      <div className="flex gap-3">
                        {PRIORITY_OPTIONS.map((priority) => (
                          <button
                            key={priority.key}
                            onClick={() => setNewChange({ ...newChange, priority: priority.key as any })}
                            className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border transition ${
                              newChange.priority === priority.key
                                ? 'bg-gray-700 border-gray-500'
                                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <span className={`font-medium ${priority.color}`}>{priority.label}</span>
                            <span className="text-xs text-gray-500">{priority.description}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setShowChangeForm(false)}
                        className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition"
                      >
                        Annuleren
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
                            Versturen
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Change Requests List */}
            <div className="space-y-4">
              {/* In Progress */}
              {inProgressRequests.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                    In behandeling ({inProgressRequests.length})
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

              {/* Pending */}
              {pendingRequests.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    Wachtend ({pendingRequests.length})
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

              {/* Completed */}
              {completedRequests.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Afgerond ({completedRequests.length})
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

              {/* Empty State */}
              {changeRequests.length === 0 && !showChangeForm && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-gray-700/50 flex items-center justify-center mx-auto mb-4">
                    <Edit3 className="w-8 h-8 text-gray-500" />
                  </div>
                  <h4 className="font-medium text-white mb-2">Nog geen wijzigingen</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Wil je iets aangepast hebben aan je website?
                  </p>
                  <button
                    onClick={() => setShowChangeForm(true)}
                    disabled={!canRequestChange}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition"
                  >
                    <Plus className="w-5 h-5" />
                    Eerste aanvraag indienen
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
                  <p className="text-gray-400">Analytics laden...</p>
                </div>
              </div>
            ) : analytics ? (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    icon={Users}
                    label="Bezoekers"
                    value={analytics.visitors.current.toLocaleString('nl-NL')}
                    change={analytics.visitors.change}
                    period="vs. vorige maand"
                  />
                  <StatCard
                    icon={Eye}
                    label="Paginaweergaven"
                    value={analytics.pageViews.current.toLocaleString('nl-NL')}
                    change={analytics.pageViews.change}
                    period="vs. vorige maand"
                  />
                  <StatCard
                    icon={Clock}
                    label="Gem. sessieduur"
                    value={analytics.avgTime.current}
                    change={analytics.avgTime.change}
                    period="vs. vorige maand"
                  />
                  <StatCard
                    icon={MousePointer}
                    label="Bounce rate"
                    value={`${analytics.bounceRate.current}%`}
                    change={analytics.bounceRate.change}
                    period="vs. vorige maand"
                    invertChange
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Top Pages */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                      Populaire pagina's
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

                  {/* Traffic Sources */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      Verkeersbronnen
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

                {/* External Analytics Link */}
                {analyticsUrl && (
                  <a
                    href={analyticsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition text-gray-400 hover:text-white"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Bekijk volledige analytics
                  </a>
                )}
              </>
            ) : projectPackage === 'starter' ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-gray-700/50 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-500" />
                </div>
                <h4 className="font-medium text-white mb-2">Analytics niet beschikbaar</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Upgrade naar Professional of hoger voor uitgebreide analytics
                </p>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl transition hover:opacity-90">
                  <Zap className="w-5 h-5" />
                  Upgrade pakket
                </button>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-gray-700/50 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-500" />
                </div>
                <h4 className="font-medium text-white mb-2">Analytics wordt ingesteld</h4>
                <p className="text-gray-400 text-sm">
                  We zijn je analytics aan het configureren. Check later terug!
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Stat Card Component
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

// Change Request Card Component
function ChangeRequestCard({ 
  request, 
  expanded, 
  onToggle 
}: { 
  request: ChangeRequest
  expanded: boolean
  onToggle: () => void
}) {
  const category = CHANGE_CATEGORIES.find(c => c.key === request.category)
  const CategoryIcon = category?.icon || Edit3
  
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
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Nieuw</span>
            )}
            {request.status === 'in_progress' && (
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">In behandeling</span>
            )}
            {(request.status === 'done' || request.status === 'completed') && (
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Afgerond</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{category?.label || 'Anders'}</span>
            <span>•</span>
            <span>{request.createdAt ? new Date(request.createdAt).toLocaleDateString('nl-NL') : 'Onbekend'}</span>
            {request.priority === 'urgent' && (
              <>
                <span>•</span>
                <span className="text-red-400">Urgent</span>
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
                    <p className="text-xs text-emerald-400 font-medium mb-1">Reactie van developer:</p>
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
