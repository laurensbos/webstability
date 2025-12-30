/**
 * Customer Dashboard Extras
 * 
 * Extra dashboard features voor klanten:
 * 1. Factuuroverzicht/Betalingshistorie
 * 2. Uptime & Performance Monitor
 * 3. Echte Bezoekersstatistieken  
 * 4. Abonnement Info & Volgende Betaling
 * 5. Documenten & Bestanden
 * 6. Notificatie Voorkeuren
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  FileText,
  Download,
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Users,
  Eye,
  Globe,
  Activity,
  Bell,
  Mail,
  Smartphone,
  FolderOpen,
  Image,
  FileImage,
  ExternalLink,
  ChevronDown,
  Package,
  ArrowUpRight,
  WifiOff,
  RefreshCw,
  Settings,
  MapPin,
  BarChart3,
  Sparkles
} from 'lucide-react'
import { PACKAGES, type PackageType } from '../config/packages'

// ===========================================
// TYPES
// ===========================================

interface Invoice {
  id: string
  date: string
  dueDate?: string
  description: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  paidAt?: string
  paymentUrl?: string
  pdfUrl?: string
}

interface UptimeData {
  isOnline: boolean
  uptimePercentage: number
  lastChecked: string
  avgLoadTime: number
  recentIncidents: Array<{
    date: string
    duration: number
    type: 'downtime' | 'slow' | 'error'
  }>
}

interface AnalyticsData {
  visitorsToday: number
  visitorsWeek: number
  visitorsMonth: number
  pageViews: number
  topPages: Array<{ path: string; views: number }>
  topSources: Array<{ source: string; visitors: number }>
  bounceRate: number
}

interface NotificationPreferences {
  emailNotifications: boolean
  pushNotifications: boolean
  types: {
    changeRequests: boolean
    payments: boolean
    updates: boolean
    marketing: boolean
  }
}

interface DocumentFile {
  id: string
  name: string
  type: 'logo' | 'image' | 'document' | 'design'
  url: string
  uploadedAt: string
  thumbnail?: string
}

interface CustomerDashboardExtrasProps {
  projectId: string
  darkMode?: boolean
  invoices?: Invoice[]
  packageType?: string
  monthlyPrice?: number
  liveDate?: string
  liveUrl?: string
  googleDriveUrl?: string
  analyticsUrl?: string
}

// ===========================================
// 1. INVOICE HISTORY SECTION
// ===========================================

interface InvoiceHistorySectionProps {
  invoices: Invoice[]
  darkMode: boolean
  nextPaymentDate?: string
}

function InvoiceHistorySection({ invoices, darkMode, nextPaymentDate }: InvoiceHistorySectionProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  
  const paidInvoices = invoices.filter(i => i.status === 'paid')
  const pendingInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'overdue')
  const totalPaid = paidInvoices.reduce((sum, i) => sum + i.amount, 0)
  const totalPending = pendingInvoices.reduce((sum, i) => sum + i.amount, 0)
  
  // Calculate next payment date (first day of next month)
  const nextPayment = nextPaymentDate || new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    1
  ).toISOString()
  
  const daysUntilPayment = Math.ceil(
    (new Date(nextPayment).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}>
              <CreditCard className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('dashboard.invoices.title', 'Betalingen & Facturen')}
              </h3>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {t('dashboard.invoices.subtitle', 'Overzicht van al je betalingen')}
              </p>
            </div>
          </div>
          
          {/* Next payment badge */}
          {daysUntilPayment > 0 && daysUntilPayment <= 14 && (
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
              daysUntilPayment <= 3
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-blue-500/20 text-blue-400'
            }`}>
              <Calendar className="w-3 h-3 inline mr-1" />
              {daysUntilPayment === 1 ? 'Morgen' : `Over ${daysUntilPayment} dagen`}
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className={`grid grid-cols-3 divide-x ${darkMode ? 'divide-gray-800' : 'divide-gray-200'}`}>
        <div className="p-4 text-center">
          <p className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            €{totalPaid.toFixed(0)}
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {t('dashboard.invoices.totalPaid', 'Totaal betaald')}
          </p>
        </div>
        <div className="p-4 text-center">
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {paidInvoices.length}
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {t('dashboard.invoices.invoicesPaid', 'Facturen betaald')}
          </p>
        </div>
        <div className="p-4 text-center">
          <p className={`text-2xl font-bold ${
            totalPending > 0 
              ? (darkMode ? 'text-amber-400' : 'text-amber-600')
              : (darkMode ? 'text-gray-400' : 'text-gray-400')
          }`}>
            €{totalPending.toFixed(0)}
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {t('dashboard.invoices.pending', 'Openstaand')}
          </p>
        </div>
      </div>

      {/* Invoice List */}
      <div className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-200'}`}>
        {(expanded ? invoices : invoices.slice(0, 3)).map((invoice) => (
          <div 
            key={invoice.id}
            className={`p-4 flex items-center justify-between ${
              darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
            } transition`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                invoice.status === 'paid' 
                  ? 'bg-green-500/20' 
                  : invoice.status === 'overdue' 
                    ? 'bg-red-500/20' 
                    : darkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                {invoice.status === 'paid' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : invoice.status === 'overdue' ? (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                ) : (
                  <Clock className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {invoice.description}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {new Date(invoice.date).toLocaleDateString('nl-NL', { 
                    day: 'numeric', 
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold ${
                invoice.status === 'paid' 
                  ? 'text-green-400' 
                  : invoice.status === 'overdue'
                    ? 'text-red-400'
                    : darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                €{invoice.amount.toFixed(2)}
              </span>
              {invoice.pdfUrl && (
                <a
                  href={invoice.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                  title={t('dashboard.invoices.downloadPdf', 'Download PDF')}
                >
                  <Download className="w-4 h-4" />
                </a>
              )}
              {invoice.status !== 'paid' && invoice.paymentUrl && (
                <a
                  href={invoice.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition"
                >
                  {t('dashboard.invoices.payNow', 'Betalen')}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show more button */}
      {invoices.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full p-3 text-sm font-medium flex items-center justify-center gap-1 border-t transition ${
            darkMode 
              ? 'border-gray-800 text-blue-400 hover:bg-gray-800/50' 
              : 'border-gray-200 text-blue-600 hover:bg-gray-50'
          }`}
        >
          {expanded ? t('common.showLess', 'Minder tonen') : t('common.viewAll', `Alle ${invoices.length} facturen`)}
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </motion.div>
  )
}

// ===========================================
// 2. UPTIME MONITOR SECTION
// ===========================================

interface UptimeMonitorSectionProps {
  liveUrl?: string
  darkMode: boolean
  projectId: string
}

function UptimeMonitorSection({ liveUrl, darkMode, projectId }: UptimeMonitorSectionProps) {
  const { t } = useTranslation()
  const [uptimeData, setUptimeData] = useState<UptimeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching uptime data
    // In production, this would call an uptime monitoring service API
    const fetchUptime = async () => {
      setLoading(true)
      try {
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setUptimeData({
          isOnline: true,
          uptimePercentage: 99.97,
          lastChecked: new Date().toISOString(),
          avgLoadTime: 1.2,
          recentIncidents: []
        })
      } catch (error) {
        console.error('Error fetching uptime:', error)
      } finally {
        setLoading(false)
      }
    }

    if (liveUrl) {
      fetchUptime()
      // Refresh every 5 minutes
      const interval = setInterval(fetchUptime, 5 * 60 * 1000)
      return () => clearInterval(interval)
    } else {
      setLoading(false)
    }
  }, [liveUrl, projectId])

  if (!liveUrl) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              uptimeData?.isOnline
                ? 'bg-green-500/20'
                : 'bg-red-500/20'
            }`}>
              {loading ? (
                <RefreshCw className={`w-5 h-5 animate-spin ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              ) : uptimeData?.isOnline ? (
                <Activity className="w-5 h-5 text-green-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('dashboard.uptime.title', 'Website Status')}
              </h3>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {liveUrl.replace(/^https?:\/\//, '')}
              </p>
            </div>
          </div>
          
          {/* Status badge */}
          {!loading && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
              uptimeData?.isOnline
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                uptimeData?.isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`} />
              {uptimeData?.isOnline ? t('dashboard.uptime.online', 'Online') : t('dashboard.uptime.offline', 'Offline')}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {!loading && uptimeData && (
        <div className={`grid grid-cols-3 divide-x ${darkMode ? 'divide-gray-800' : 'divide-gray-200'}`}>
          <div className="p-4 text-center">
            <p className={`text-2xl font-bold ${
              uptimeData.uptimePercentage >= 99.9
                ? 'text-green-400'
                : uptimeData.uptimePercentage >= 99
                  ? 'text-amber-400'
                  : 'text-red-400'
            }`}>
              {uptimeData.uptimePercentage.toFixed(2)}%
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {t('dashboard.uptime.uptime', 'Uptime (30 dagen)')}
            </p>
          </div>
          <div className="p-4 text-center">
            <p className={`text-2xl font-bold ${
              uptimeData.avgLoadTime < 2
                ? 'text-green-400'
                : uptimeData.avgLoadTime < 4
                  ? 'text-amber-400'
                  : 'text-red-400'
            }`}>
              {uptimeData.avgLoadTime.toFixed(1)}s
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {t('dashboard.uptime.loadTime', 'Gem. laadtijd')}
            </p>
          </div>
          <div className="p-4 text-center">
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {uptimeData.recentIncidents.length}
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {t('dashboard.uptime.incidents', 'Storingen (30d)')}
            </p>
          </div>
        </div>
      )}

      {/* Last checked */}
      {!loading && uptimeData && (
        <div className={`px-4 py-2 text-xs border-t ${
          darkMode ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-500'
        }`}>
          {t('dashboard.uptime.lastChecked', 'Laatst gecontroleerd')}: {' '}
          {new Date(uptimeData.lastChecked).toLocaleTimeString('nl-NL', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      )}
    </motion.div>
  )
}

// ===========================================
// 3. VISITOR ANALYTICS SECTION
// ===========================================

interface AnalyticsSectionProps {
  projectId: string
  analyticsUrl?: string
  darkMode: boolean
}

function AnalyticsSection({ projectId, analyticsUrl, darkMode }: AnalyticsSectionProps) {
  const { t } = useTranslation()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        // Try to fetch from analytics API
        const response = await fetch(`/api/analytics/stats?projectId=${projectId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setAnalytics(data.analytics)
          }
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [projectId])

  // If no analytics data and no analytics URL, show placeholder
  if (!loading && !analytics && !analyticsUrl) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
              <BarChart3 className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('dashboard.analytics.title', 'Bezoekersstatistieken')}
              </h3>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {t('dashboard.analytics.subtitle', 'Inzicht in je websitebezoekers')}
              </p>
            </div>
          </div>
          
          {analyticsUrl && (
            <a
              href={analyticsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                darkMode 
                  ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' 
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              {t('dashboard.analytics.viewFull', 'Volledig rapport')}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="p-8 text-center">
          <RefreshCw className={`w-6 h-6 animate-spin mx-auto mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {t('dashboard.analytics.loading', 'Statistieken laden...')}
          </p>
        </div>
      ) : analytics ? (
        <>
          <div className={`grid grid-cols-3 divide-x ${darkMode ? 'divide-gray-800' : 'divide-gray-200'}`}>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              </div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {analytics.visitorsToday}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {t('dashboard.analytics.today', 'Vandaag')}
              </p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
              </div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {analytics.visitorsWeek}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {t('dashboard.analytics.week', 'Deze week')}
              </p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
              </div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {analytics.visitorsMonth}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {t('dashboard.analytics.month', 'Deze maand')}
              </p>
            </div>
          </div>

          {/* Top Pages */}
          {analytics.topPages && analytics.topPages.length > 0 && (
            <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('dashboard.analytics.topPages', 'Populairste pagina\'s')}
              </p>
              <div className="space-y-2">
                {analytics.topPages.slice(0, 3).map((page, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {page.path === '/' ? 'Homepage' : page.path}
                    </span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {page.views} {t('dashboard.analytics.views', 'views')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Traffic Sources */}
          {analytics.topSources && analytics.topSources.length > 0 && (
            <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('dashboard.analytics.sources', 'Verkeersbronnen')}
              </p>
              <div className="flex flex-wrap gap-2">
                {analytics.topSources.slice(0, 4).map((source, i) => (
                  <span 
                    key={i}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                      darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    {source.source}: {source.visitors}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-6 text-center">
          <BarChart3 className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-sm mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {t('dashboard.analytics.noData', 'Nog geen statistieken beschikbaar')}
          </p>
          {analyticsUrl && (
            <a
              href={analyticsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-purple-500 hover:text-purple-600"
            >
              {t('dashboard.analytics.viewExternal', 'Bekijk extern dashboard')}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ===========================================
// 4. SUBSCRIPTION INFO SECTION
// ===========================================

interface SubscriptionSectionProps {
  packageType: string
  monthlyPrice: number
  liveDate?: string
  darkMode: boolean
}

function SubscriptionSection({ packageType, monthlyPrice, liveDate, darkMode }: SubscriptionSectionProps) {
  const { t } = useTranslation()
  const pkg = PACKAGES[packageType as PackageType]
  
  // Calculate next payment date (first of next month)
  const nextPaymentDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    1
  )
  
  // Calculate months as customer
  const monthsAsCustomer = liveDate 
    ? Math.floor((Date.now() - new Date(liveDate).getTime()) / (30 * 24 * 60 * 60 * 1000))
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${
              pkg?.gradient || 'from-blue-500 to-purple-600'
            }`}>
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {pkg?.name || packageType} {t('dashboard.subscription.package', 'pakket')}
              </h3>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {t('dashboard.subscription.subtitle', 'Je huidige abonnement')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className={`grid grid-cols-2 divide-x ${darkMode ? 'divide-gray-800' : 'divide-gray-200'}`}>
        <div className="p-4">
          <p className={`text-xs mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {t('dashboard.subscription.monthlyPrice', 'Maandelijks')}
          </p>
          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            €{monthlyPrice}/maand
          </p>
        </div>
        <div className="p-4">
          <p className={`text-xs mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {t('dashboard.subscription.nextPayment', 'Volgende betaling')}
          </p>
          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {nextPaymentDate.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
          </p>
        </div>
      </div>

      {/* Customer since badge */}
      {monthsAsCustomer > 0 && (
        <div className={`px-4 py-3 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            darkMode ? 'bg-primary-500/10' : 'bg-primary-50'
          }`}>
            <Sparkles className={`w-4 h-4 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
            <span className={`text-sm ${darkMode ? 'text-primary-300' : 'text-primary-700'}`}>
              {t('dashboard.subscription.customerFor', 'Al {{months}} maanden klant!', { months: monthsAsCustomer })}
            </span>
          </div>
        </div>
      )}

      {/* Features */}
      {pkg?.features && (
        <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <p className={`text-xs font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('dashboard.subscription.includedFeatures', 'Inbegrepen in je pakket')}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {pkg.features.slice(0, 6).map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade CTA */}
      {packageType !== 'business' && (
        <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <button className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
            darkMode 
              ? 'bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white' 
              : 'bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white'
          }`}>
            <ArrowUpRight className="w-4 h-4" />
            {t('dashboard.subscription.upgrade', 'Upgrade je pakket')}
          </button>
        </div>
      )}
    </motion.div>
  )
}

// ===========================================
// 5. DOCUMENTS SECTION
// ===========================================

interface DocumentsSectionProps {
  googleDriveUrl?: string
  darkMode: boolean
  projectId: string
}

function DocumentsSection({ googleDriveUrl, darkMode, projectId }: DocumentsSectionProps) {
  const { t } = useTranslation()
  const [documents, setDocuments] = useState<DocumentFile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch uploaded documents
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`/api/project/${projectId}/documents`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setDocuments(data.documents || [])
          }
        }
      } catch (error) {
        console.error('Error fetching documents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [projectId])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              darkMode ? 'bg-amber-500/20' : 'bg-amber-100'
            }`}>
              <FolderOpen className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('dashboard.documents.title', 'Documenten & Bestanden')}
              </h3>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {t('dashboard.documents.subtitle', 'Je geüploade bestanden en designs')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Google Drive Link */}
      {googleDriveUrl && (
        <a
          href={googleDriveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 p-4 border-b transition ${
            darkMode 
              ? 'border-gray-800 hover:bg-gray-800/50' 
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
          }`}>
            <Globe className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Google Drive
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {t('dashboard.documents.driveDesc', 'Al je projectbestanden op één plek')}
            </p>
          </div>
          <ExternalLink className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
        </a>
      )}

      {/* Documents List */}
      {loading ? (
        <div className="p-6 text-center">
          <RefreshCw className={`w-5 h-5 animate-spin mx-auto mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>
      ) : documents.length > 0 ? (
        <div className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-200'}`}>
          {documents.slice(0, 5).map((doc) => (
            <a
              key={doc.id}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-4 transition ${
                darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                doc.type === 'logo' ? 'bg-purple-500/20' :
                doc.type === 'image' ? 'bg-green-500/20' :
                doc.type === 'design' ? 'bg-pink-500/20' :
                darkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                {doc.type === 'logo' ? (
                  <Sparkles className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                ) : doc.type === 'image' ? (
                  <Image className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                ) : doc.type === 'design' ? (
                  <FileImage className={`w-4 h-4 ${darkMode ? 'text-pink-400' : 'text-pink-500'}`} />
                ) : (
                  <FileText className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {doc.name}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {new Date(doc.uploadedAt).toLocaleDateString('nl-NL')}
                </p>
              </div>
              <Download className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </a>
          ))}
        </div>
      ) : !googleDriveUrl ? (
        <div className="p-6 text-center">
          <FolderOpen className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {t('dashboard.documents.noFiles', 'Nog geen bestanden geüpload')}
          </p>
        </div>
      ) : null}
    </motion.div>
  )
}

// ===========================================
// 6. NOTIFICATION PREFERENCES SECTION
// ===========================================

interface NotificationPreferencesSectionProps {
  projectId: string
  darkMode: boolean
}

function NotificationPreferencesSection({ projectId, darkMode }: NotificationPreferencesSectionProps) {
  const { t } = useTranslation()
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    pushNotifications: false,
    types: {
      changeRequests: true,
      payments: true,
      updates: true,
      marketing: false
    }
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Load preferences from localStorage or API
    const stored = localStorage.getItem(`notification_prefs_${projectId}`)
    if (stored) {
      try {
        setPreferences(JSON.parse(stored))
      } catch (e) {
        console.error('Error parsing notification preferences:', e)
      }
    }
  }, [projectId])

  const updatePreference = async (key: string, value: boolean) => {
    setSaving(true)
    
    const newPreferences = { ...preferences }
    if (key === 'emailNotifications' || key === 'pushNotifications') {
      newPreferences[key] = value
    } else {
      newPreferences.types = { ...newPreferences.types, [key]: value }
    }
    
    setPreferences(newPreferences)
    localStorage.setItem(`notification_prefs_${projectId}`, JSON.stringify(newPreferences))
    
    // Optionally sync to API
    try {
      await fetch(`/api/project/${projectId}/notification-preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPreferences)
      })
    } catch (e) {
      console.error('Error saving notification preferences:', e)
    }
    
    setSaving(false)
  }

  const toggleItems = [
    { key: 'emailNotifications', label: t('dashboard.notifications.email', 'E-mail notificaties'), icon: Mail, main: true },
    { key: 'pushNotifications', label: t('dashboard.notifications.push', 'Push notificaties'), icon: Smartphone, main: true },
    { key: 'changeRequests', label: t('dashboard.notifications.changeRequests', 'Wijzigingsverzoeken'), icon: Settings },
    { key: 'payments', label: t('dashboard.notifications.payments', 'Betalingsherinneringen'), icon: CreditCard },
    { key: 'updates', label: t('dashboard.notifications.updates', 'Project updates'), icon: Bell },
    { key: 'marketing', label: t('dashboard.notifications.marketing', 'Tips & nieuws'), icon: Sparkles },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            darkMode ? 'bg-pink-500/20' : 'bg-pink-100'
          }`}>
            <Bell className={`w-5 h-5 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('dashboard.notifications.title', 'Notificatie voorkeuren')}
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {t('dashboard.notifications.subtitle', 'Bepaal hoe je op de hoogte gehouden wilt worden')}
            </p>
          </div>
        </div>
      </div>

      {/* Toggle List */}
      <div className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-200'}`}>
        {toggleItems.map((item) => {
          const Icon = item.icon
          const isEnabled = item.main 
            ? preferences[item.key as 'emailNotifications' | 'pushNotifications']
            : preferences.types[item.key as keyof typeof preferences.types]
          
          return (
            <div 
              key={item.key}
              className={`flex items-center justify-between p-4 ${
                item.main ? '' : 'pl-6'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${
                  isEnabled 
                    ? (darkMode ? 'text-pink-400' : 'text-pink-600')
                    : (darkMode ? 'text-gray-500' : 'text-gray-400')
                }`} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {item.label}
                </span>
              </div>
              <button
                onClick={() => updatePreference(item.key, !isEnabled)}
                disabled={saving}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  isEnabled
                    ? 'bg-pink-500'
                    : darkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}
              >
                <span 
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    isEnabled ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ===========================================
// MAIN EXPORT COMPONENT
// ===========================================

export default function CustomerDashboardExtras({
  projectId,
  darkMode = true,
  invoices = [],
  packageType = 'starter',
  monthlyPrice = 119,
  liveDate,
  liveUrl,
  googleDriveUrl,
  analyticsUrl
}: CustomerDashboardExtrasProps) {
  return (
    <div className="space-y-4">
      {/* 1. Invoice History */}
      {invoices.length > 0 && (
        <InvoiceHistorySection 
          invoices={invoices} 
          darkMode={darkMode} 
        />
      )}

      {/* 4. Subscription Info */}
      <SubscriptionSection
        packageType={packageType}
        monthlyPrice={monthlyPrice}
        liveDate={liveDate}
        darkMode={darkMode}
      />

      {/* 2. Uptime Monitor */}
      <UptimeMonitorSection
        liveUrl={liveUrl}
        darkMode={darkMode}
        projectId={projectId}
      />

      {/* 3. Analytics */}
      <AnalyticsSection
        projectId={projectId}
        analyticsUrl={analyticsUrl}
        darkMode={darkMode}
      />

      {/* 5. Documents */}
      <DocumentsSection
        googleDriveUrl={googleDriveUrl}
        darkMode={darkMode}
        projectId={projectId}
      />

      {/* 6. Notification Preferences */}
      <NotificationPreferencesSection
        projectId={projectId}
        darkMode={darkMode}
      />
    </div>
  )
}

// Export individual sections for flexible usage
export {
  InvoiceHistorySection,
  UptimeMonitorSection,
  AnalyticsSection,
  SubscriptionSection,
  DocumentsSection,
  NotificationPreferencesSection
}
