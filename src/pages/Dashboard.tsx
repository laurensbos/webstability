import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Lock, 
  LogOut, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Calendar,
  Briefcase,
  Palette,
  FileText,
  ChevronDown,
  ChevronUp,
  Trash2,
  Download,
  Search,
  Eye,
  PhoneCall,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard
} from 'lucide-react'
import PaymentModal from '../components/PaymentModal'

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
  // New call scheduling fields
  callScheduled?: boolean
  callDate?: string
  callTime?: string
  callTopics?: string[]
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
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

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
    }
  }, [isAuthenticated])

  const loadSubmissions = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Sort by timestamp descending (newest first)
        parsed.sort((a: Submission, b: Submission) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        setSubmissions(parsed)
      } catch (e) {
        console.error('Error parsing submissions:', e)
        setSubmissions([])
      }
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

  const deleteSubmission = (id: string) => {
    if (confirm('Weet je zeker dat je deze aanvraag wilt verwijderen?')) {
      const updated = submissions.filter(s => s.id !== id)
      setSubmissions(updated)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
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
      case 'starter': return 'Starter €79/mnd'
      case 'professional': return 'Professional €149/mnd'
      case 'business': return 'Business €249/mnd'
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
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Login</h1>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">Webstability Dashboard</h1>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              {submissions.length} aanvragen
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Uitloggen
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Upcoming Calls Section */}
        {submissions.filter(s => s.callScheduled && s.callDate && new Date(s.callDate) >= new Date(new Date().setHours(0,0,0,0))).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <PhoneCall className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">📞 Aankomende Gesprekken</h2>
                <p className="text-sm text-gray-600">Geplande telefoongesprekken met klanten</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {submissions
                .filter(s => s.callScheduled && s.callDate && new Date(s.callDate) >= new Date(new Date().setHours(0,0,0,0)))
                .sort((a, b) => new Date(a.callDate!).getTime() - new Date(b.callDate!).getTime())
                .map((submission) => (
                  <div 
                    key={submission.id + '-call'}
                    className="bg-white rounded-xl p-4 shadow-sm border border-green-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{submission.businessName}</h3>
                        <p className="text-sm text-gray-500">{submission.contactName}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPackageColor(submission.package)}`}>
                        {submission.package}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-green-500" />
                        {new Date(submission.callDate!).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-green-500" />
                        {submission.callTime} uur
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-green-500" />
                        {submission.contactPhone}
                      </div>
                    </div>
                    <a
                      href={`tel:${submission.contactPhone}`}
                      className="mt-4 w-full py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Bel nu
                    </a>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Zoek op naam, email, bedrijf of domein..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <button
            onClick={exportToCSV}
            disabled={submissions.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Exporteer CSV
          </button>
        </div>

        {/* Empty state */}
        {submissions.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Nog geen aanvragen</h2>
            <p className="text-gray-600">
              Wanneer klanten het onboarding formulier invullen, verschijnen ze hier.
            </p>
          </div>
        )}

        {/* Submissions list */}
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {submission.businessName || 'Onbekend bedrijf'}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPackageColor(submission.package)}`}>
                        {getPackageLabel(submission.package)}
                      </span>
                      {submission.callScheduled && submission.callDate && submission.callTime && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                          <PhoneCall className="w-3 h-3" />
                          📞 {new Date(submission.callDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })} {submission.callTime}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        {submission.contactName}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        {submission.contactEmail}
                      </span>
                      {submission.contactPhone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4" />
                          {submission.contactPhone}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {formatDate(submission.timestamp)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedSubmission(submission)
                        setPaymentModalOpen(true)
                      }}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Betaallink versturen"
                    >
                      <CreditCard className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSubmission(submission.id)
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {expandedId === submission.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === submission.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-100"
                >
                  <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Website Details */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary-500" />
                        Website Details
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <p className="font-medium text-gray-900">{submission.websiteType || '-'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Branche:</span>
                          <p className="font-medium text-gray-900">{submission.industry || '-'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Domein:</span>
                          <p className="font-medium text-gray-900">
                            {submission.domain || '-'}
                            {submission.domainStatus && (
                              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                submission.domainStatus === 'available' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {submission.domainStatus === 'available' ? 'Beschikbaar' : 'Bezet'}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Business Info */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary-500" />
                        Bedrijfsinfo
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-gray-500">Tagline:</span>
                          <p className="font-medium text-gray-900">{submission.tagline || '-'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Beschrijving:</span>
                          <p className="font-medium text-gray-900 whitespace-pre-wrap">{submission.description || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Design */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Palette className="w-4 h-4 text-primary-500" />
                        Design
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-gray-500">Primaire kleur:</span>
                          <div className="flex items-center gap-2 mt-1">
                            {submission.primaryColor && (
                              <div 
                                className="w-6 h-6 rounded-full border border-gray-200" 
                                style={{ backgroundColor: submission.primaryColor }}
                              />
                            )}
                            <span className="font-medium text-gray-900">{submission.primaryColor || '-'}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Stijl:</span>
                          <p className="font-medium text-gray-900">{submission.style || '-'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Voorbeeldsites:</span>
                          <p className="font-medium text-gray-900 break-all">{submission.exampleSites || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Pages & Content */}
                    <div className="space-y-4 md:col-span-2 lg:col-span-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary-500" />
                        Pagina's & Content
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Gewenste pagina's:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {submission.pages && submission.pages.length > 0 ? (
                              submission.pages.map((page, idx) => (
                                <span 
                                  key={idx}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                >
                                  {page}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Content notities:</span>
                          <p className="font-medium text-gray-900 mt-2 whitespace-pre-wrap">{submission.content || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Remarks */}
                    {submission.remarks && (
                      <div className="md:col-span-2 lg:col-span-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                          <Eye className="w-4 h-4 text-primary-500" />
                          Extra opmerkingen
                        </h4>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">
                          {submission.remarks}
                        </p>
                      </div>
                    )}

                    {/* Scheduled Call */}
                    {submission.callScheduled && submission.callDate && submission.callTime && (
                      <div className="md:col-span-2 lg:col-span-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                          <PhoneCall className="w-4 h-4 text-green-500" />
                          Gepland Telefoongesprek
                        </h4>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <span className="text-green-700 text-sm font-medium flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Datum
                              </span>
                              <p className="text-green-900 font-semibold mt-1">
                                {new Date(submission.callDate).toLocaleDateString('nl-NL', { 
                                  weekday: 'long', 
                                  day: 'numeric', 
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                            <div>
                              <span className="text-green-700 text-sm font-medium flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Tijd
                              </span>
                              <p className="text-green-900 font-semibold mt-1">{submission.callTime} uur</p>
                            </div>
                            <div>
                              <span className="text-green-700 text-sm font-medium flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Bellen naar
                              </span>
                              <p className="text-green-900 font-semibold mt-1">{submission.contactPhone}</p>
                            </div>
                          </div>
                          {submission.callTopics && submission.callTopics.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-green-200">
                              <span className="text-green-700 text-sm font-medium">Bespreekpunten:</span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {submission.callTopics.map((topic, idx) => (
                                  <span 
                                    key={idx}
                                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                                  >
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="mt-4 pt-4 border-t border-green-200 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              {new Date(submission.callDate) > new Date() ? (
                                <>
                                  <AlertCircle className="w-4 h-4 text-amber-500" />
                                  <span className="text-amber-700 font-medium">Aankomend gesprek</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-green-700 font-medium">Gesprek geweest</span>
                                </>
                              )}
                            </div>
                            <a
                              href={`tel:${submission.contactPhone}`}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="w-4 h-4" />
                              Bel nu
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* No results */}
        {searchTerm && filteredSubmissions.length === 0 && submissions.length > 0 && (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-600">Geen resultaten gevonden voor "{searchTerm}"</p>
          </div>
        )}
      </main>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false)
          setSelectedSubmission(null)
        }}
        submission={selectedSubmission}
      />
    </div>
  )
}
