import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExternalLink,
  Rocket,
  Settings,
  Edit3,
  User,
  Mail,
  Phone,
  Lock,
  Building2,
  Check,
  Loader2,
  AlertCircle,
  ChevronRight,
  MessageSquare,
  FileText,
  Star,
  Shield,
  Clock,
  Send,
  Sparkles,
  Globe,
  CheckCircle2
} from 'lucide-react'
import type { Project } from '../types/project'

interface LivePortalProps {
  project: Project
  onSendMessage?: (message: string) => Promise<void>
  onUpdateProject?: (updates: Partial<Project>) => void
}

// Priority config
const PRIORITY_CONFIG = {
  low: { label: 'Laag', color: 'gray', description: 'Geen haast' },
  normal: { label: 'Normaal', color: 'blue', description: 'Binnen een week' },
  urgent: { label: 'Urgent', color: 'red', description: 'Zo snel mogelijk' }
}

export default function LivePortal({ 
  project, 
  onSendMessage,
  onUpdateProject
}: LivePortalProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'request' | 'account' | 'contact'>('overview')
  
  // Change request state
  const [changeRequestText, setChangeRequestText] = useState('')
  const [changePriority, setChangePriority] = useState<'low' | 'normal' | 'urgent'>('normal')
  const [changeRequestSent, setChangeRequestSent] = useState(false)
  const [changeRequestLoading, setChangeRequestLoading] = useState(false)
  
  // Account state
  const [isEditingAccount, setIsEditingAccount] = useState(false)
  const [accountData, setAccountData] = useState({
    contactName: project.contactName || '',
    contactEmail: project.contactEmail || '',
    contactPhone: project.contactPhone || '',
    businessName: project.businessName || ''
  })
  const [accountLoading, setAccountLoading] = useState(false)
  const [accountSaved, setAccountSaved] = useState(false)
  const [accountError, setAccountError] = useState('')
  
  // Password reset state
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [resetEmailSent, setResetEmailSent] = useState(false)
  
  // Quick message state
  const [quickMessage, setQuickMessage] = useState('')
  const [messageLoading, setMessageLoading] = useState(false)
  const [messageSent, setMessageSent] = useState(false)

  // Handle change request submit
  const handleChangeRequestSubmit = async () => {
    if (!changeRequestText.trim()) return
    setChangeRequestLoading(true)
    try {
      const response = await fetch(`/api/project/${project.projectId}/change-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request: changeRequestText,
          priority: changePriority
        })
      })
      if (response.ok) {
        setChangeRequestSent(true)
        setChangeRequestText('')
      }
    } catch (error) {
      console.error('Error sending change request:', error)
    } finally {
      setChangeRequestLoading(false)
    }
  }

  // Handle account save
  const handleSaveAccount = async () => {
    setAccountLoading(true)
    setAccountError('')
    try {
      const response = await fetch(`/api/project/${project.projectId}/account`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: accountData.contactName,
          contactEmail: accountData.contactEmail,
          contactPhone: accountData.contactPhone,
          businessName: accountData.businessName
        })
      })
      
      if (!response.ok) {
        throw new Error('Kon gegevens niet opslaan')
      }
      
      // Update project lokaal
      onUpdateProject?.({
        contactName: accountData.contactName,
        contactEmail: accountData.contactEmail,
        contactPhone: accountData.contactPhone,
        businessName: accountData.businessName
      })
      
      setAccountSaved(true)
      setIsEditingAccount(false)
      setTimeout(() => setAccountSaved(false), 3000)
    } catch (error) {
      setAccountError('Er ging iets mis bij het opslaan. Probeer het opnieuw.')
    } finally {
      setAccountLoading(false)
    }
  }

  // Handle password reset request (send email)
  const handlePasswordResetEmail = async () => {
    setPasswordLoading(true)
    setPasswordError('')
    try {
      const response = await fetch('/api/reset-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.projectId,
          email: project.contactEmail
        })
      })
      
      if (!response.ok) {
        throw new Error('Kon reset email niet versturen')
      }
      
      setResetEmailSent(true)
    } catch (error) {
      setPasswordError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setPasswordLoading(false)
    }
  }

  // Handle quick message
  const handleSendQuickMessage = async () => {
    if (!quickMessage.trim() || !onSendMessage) return
    setMessageLoading(true)
    try {
      await onSendMessage(quickMessage)
      setMessageSent(true)
      setQuickMessage('')
      setTimeout(() => setMessageSent(false), 3000)
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setMessageLoading(false)
    }
  }

  // Navigation items
  const navItems = [
    { key: 'overview', label: 'Overzicht', icon: Globe },
    { key: 'request', label: 'Aanpassing', icon: Edit3 },
    { key: 'contact', label: 'Contact', icon: MessageSquare },
    { key: 'account', label: 'Account', icon: Settings },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Banner - Website Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-xl sm:rounded-2xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Rocket className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white/80 text-sm">Je website is</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-white text-xs font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                    LIVE
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mt-0.5">
                  {project.businessName}
                </h2>
              </div>
            </div>
            
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-all hover:scale-105 active:scale-95 shadow-lg text-sm sm:text-base"
              >
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Bekijk website</span>
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
              <p className="text-white/70 text-[10px] sm:text-xs">Package</p>
              <p className="text-white font-semibold text-sm sm:text-base capitalize">{project.package || 'Starter'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
              <p className="text-white/70 text-[10px] sm:text-xs">Revisies</p>
              <p className="text-white font-semibold text-sm sm:text-base">
                {project.revisionsUsed || 0}/{project.revisionsTotal || 3}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
              <p className="text-white/70 text-[10px] sm:text-xs">Project ID</p>
              <p className="text-white font-semibold text-sm sm:text-base font-mono">{project.projectId}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-1 sm:gap-2 p-1 bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50"
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.key
          return (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key as typeof activeSection)}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl font-medium transition-all text-xs sm:text-sm ${
                isActive
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline sm:inline">{item.label}</span>
            </button>
          )
        })}
      </motion.div>

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveSection('request')}
                className="flex flex-col items-center gap-2 p-4 sm:p-6 bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Edit3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <span className="text-white font-medium text-sm sm:text-base">Aanpassing</span>
                <span className="text-gray-500 text-xs text-center hidden sm:block">Vraag een wijziging aan</span>
              </button>
              
              <button
                onClick={() => setActiveSection('contact')}
                className="flex flex-col items-center gap-2 p-4 sm:p-6 bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <span className="text-white font-medium text-sm sm:text-base">Contact</span>
                <span className="text-gray-500 text-xs text-center hidden sm:block">Chat met developer</span>
              </button>
              
              <button
                onClick={() => setActiveSection('account')}
                className="flex flex-col items-center gap-2 p-4 sm:p-6 bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                </div>
                <span className="text-white font-medium text-sm sm:text-base">Account</span>
                <span className="text-gray-500 text-xs text-center hidden sm:block">Gegevens wijzigen</span>
              </button>
              
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 sm:p-6 bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 hover:border-green-500/50 hover:bg-green-500/10 transition-all group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                  </div>
                  <span className="text-white font-medium text-sm sm:text-base">Website</span>
                  <span className="text-gray-500 text-xs text-center hidden sm:block">Bekijk je website</span>
                </a>
              )}
            </div>

            {/* Tips & Info */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Tips voor je website
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Deel je website</p>
                    <p className="text-gray-400 text-xs mt-0.5">Zet je nieuwe website op je sociale media!</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Google Mijn Bedrijf</p>
                    <p className="text-gray-400 text-xs mt-0.5">Voeg je website URL toe aan je Google profiel</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Houd content actueel</p>
                    <p className="text-gray-400 text-xs mt-0.5">Vraag ons om updates wanneer nodig</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Request Section */}
        {activeSection === 'request' && (
          <motion.div
            key="request"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Aanpassing aanvragen</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Beschrijf wat je wilt laten wijzigen</p>
                </div>
              </div>
              {project.revisionsTotal && (
                <div className="text-right px-3 py-2 bg-gray-900/50 rounded-xl">
                  <p className="text-xs text-gray-500">Revisies</p>
                  <p className={`text-lg font-bold ${
                    (project.revisionsUsed || 0) >= project.revisionsTotal 
                      ? 'text-red-400' 
                      : 'text-white'
                  }`}>
                    {project.revisionsUsed || 0}/{project.revisionsTotal}
                  </p>
                </div>
              )}
            </div>

            {!changeRequestSent ? (
              <div className="space-y-4">
                <textarea
                  value={changeRequestText}
                  onChange={(e) => setChangeRequestText(e.target.value)}
                  placeholder="Bijv. Graag de tekst op de homepage aanpassen naar..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition text-sm resize-none"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Prioriteit</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'normal', 'urgent'] as const).map((priority) => (
                      <button
                        key={priority}
                        onClick={() => setChangePriority(priority)}
                        className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition ${
                          changePriority === priority
                            ? priority === 'urgent' 
                              ? 'border-red-500 bg-red-500/20 text-red-400'
                              : priority === 'normal'
                              ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                              : 'border-gray-500 bg-gray-500/20 text-gray-300'
                            : 'border-gray-700 text-gray-500 hover:border-gray-600'
                        }`}
                      >
                        {PRIORITY_CONFIG[priority].label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {PRIORITY_CONFIG[changePriority].description}
                  </p>
                </div>
                
                <button
                  onClick={handleChangeRequestSubmit}
                  disabled={changeRequestLoading || !changeRequestText.trim()}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {changeRequestLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Verstuur aanvraag
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-white font-semibold text-lg">Aanvraag verstuurd!</h4>
                <p className="text-gray-400 text-sm mt-2">We nemen zo snel mogelijk contact met je op.</p>
                <button
                  onClick={() => setChangeRequestSent(false)}
                  className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  Nog een aanvraag versturen
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Quick Message */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Stuur een bericht</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Direct contact met je developer</p>
                </div>
              </div>

              {!messageSent ? (
                <div className="space-y-3">
                  <textarea
                    value={quickMessage}
                    onChange={(e) => setQuickMessage(e.target.value)}
                    placeholder="Typ je bericht..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500 transition text-sm resize-none"
                  />
                  <button
                    onClick={handleSendQuickMessage}
                    disabled={messageLoading || !quickMessage.trim()}
                    className="w-full py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {messageLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Verstuur bericht
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-medium">Bericht verstuurd!</p>
                </div>
              )}
            </div>

            {/* Contact Options */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6">
              <h3 className="text-white font-semibold mb-4">Andere manieren om contact op te nemen</h3>
              <div className="space-y-3">
                <a
                  href="mailto:info@webstability.nl"
                  className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl hover:bg-gray-700/50 transition"
                >
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white text-sm font-medium">E-mail</p>
                    <p className="text-gray-400 text-xs">info@webstability.nl</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
                </a>
                
                <a
                  href="https://wa.me/31612345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl hover:bg-gray-700/50 transition"
                >
                  <MessageSquare className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white text-sm font-medium">WhatsApp</p>
                    <p className="text-gray-400 text-xs">Direct antwoord</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
                </a>
                
                <a
                  href="tel:+31612345678"
                  className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl hover:bg-gray-700/50 transition"
                >
                  <Phone className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Telefoon</p>
                    <p className="text-gray-400 text-xs">Ma-Vr 9:00 - 17:00</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Account Section */}
        {activeSection === 'account' && (
          <motion.div
            key="account"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Account Details */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Accountgegevens</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Beheer je contactgegevens</p>
                  </div>
                </div>
                {!isEditingAccount && (
                  <button
                    onClick={() => setIsEditingAccount(true)}
                    className="px-3 py-1.5 text-sm text-amber-400 hover:text-amber-300 font-medium"
                  >
                    Wijzigen
                  </button>
                )}
              </div>

              {accountSaved && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">Gegevens opgeslagen!</span>
                </div>
              )}

              {accountError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">{accountError}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Bedrijfsnaam</label>
                  {isEditingAccount ? (
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={accountData.businessName}
                        onChange={(e) => setAccountData({ ...accountData, businessName: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  ) : (
                    <p className="text-white text-sm py-2">{project.businessName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Contactpersoon</label>
                  {isEditingAccount ? (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={accountData.contactName}
                        onChange={(e) => setAccountData({ ...accountData, contactName: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  ) : (
                    <p className="text-white text-sm py-2">{project.contactName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">E-mailadres</label>
                  {isEditingAccount ? (
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        value={accountData.contactEmail}
                        onChange={(e) => setAccountData({ ...accountData, contactEmail: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  ) : (
                    <p className="text-white text-sm py-2">{project.contactEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Telefoonnummer</label>
                  {isEditingAccount ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="tel"
                        value={accountData.contactPhone}
                        onChange={(e) => setAccountData({ ...accountData, contactPhone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  ) : (
                    <p className="text-white text-sm py-2">{project.contactPhone || '-'}</p>
                  )}
                </div>

                {isEditingAccount && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setIsEditingAccount(false)
                        setAccountData({
                          contactName: project.contactName || '',
                          contactEmail: project.contactEmail || '',
                          contactPhone: project.contactPhone || '',
                          businessName: project.businessName || ''
                        })
                      }}
                      className="flex-1 py-2.5 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition text-sm font-medium"
                    >
                      Annuleren
                    </button>
                    <button
                      onClick={handleSaveAccount}
                      disabled={accountLoading}
                      className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition disabled:opacity-50 text-sm font-medium flex items-center justify-center gap-2"
                    >
                      {accountLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Opslaan
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Password Reset */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Wachtwoord wijzigen</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Beveilig je account</p>
                </div>
              </div>

              {!showPasswordReset ? (
                <button
                  onClick={() => setShowPasswordReset(true)}
                  className="w-full py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition text-sm font-medium"
                >
                  Wachtwoord wijzigen
                </button>
              ) : !resetEmailSent ? (
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm">
                    We sturen een beveiligde link naar je e-mailadres ({project.contactEmail}) waarmee je je wachtwoord kunt wijzigen.
                  </p>
                  
                  {passwordError && (
                    <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 text-sm">{passwordError}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPasswordReset(false)}
                      className="flex-1 py-2.5 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition text-sm font-medium"
                    >
                      Annuleren
                    </button>
                    <button
                      onClick={handlePasswordResetEmail}
                      disabled={passwordLoading}
                      className="flex-1 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition disabled:opacity-50 text-sm font-medium flex items-center justify-center gap-2"
                    >
                      {passwordLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Verstuur link
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-white font-semibold">E-mail verstuurd!</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    Check je inbox voor de reset link.
                  </p>
                  <button
                    onClick={() => {
                      setShowPasswordReset(false)
                      setResetEmailSent(false)
                    }}
                    className="mt-4 text-gray-400 hover:text-white text-sm"
                  >
                    Sluiten
                  </button>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Project informatie</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Details over je project</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Project ID</span>
                  <span className="text-white font-mono">{project.projectId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Pakket</span>
                  <span className="text-white capitalize">{project.package || 'Starter'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                    Live
                  </span>
                </div>
                {project.liveUrl && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">Website</span>
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      {new URL(project.liveUrl).hostname}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-gray-500 pt-4"
      >
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-green-500" />
          <span>Beveiligd</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>24/7 bereikbaar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-500" />
          <span>Premium support</span>
        </div>
      </motion.div>
    </div>
  )
}
