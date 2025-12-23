/**
 * Developer Dashboard - Project Detail Modal
 * Simplified modal with essential project management features
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Send, 
  ExternalLink, 
  Copy, 
  Check,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  CreditCard,
  FileText,
  Globe,
  AlertCircle,
  Clock,
  Mail,
  Phone,
  User,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ClipboardList,
  ListChecks,
  Palette
} from 'lucide-react'
import type { Project, ProjectPhase, ChatMessage } from './types'
import { PHASE_CONFIG, PACKAGE_CONFIG, SERVICE_CONFIG, PHASE_CHECKLIST } from './types'

interface ProjectDetailModalProps {
  project: Project
  onClose: () => void
  onUpdate: (project: Project) => void
  onSendPaymentLink: (project: Project) => void
  onDelete?: (projectId: string) => Promise<boolean>
  initialTab?: 'info' | 'onboarding' | 'messages' | 'feedback' | 'customer'
}

export default function ProjectDetailModal({ 
  project, 
  onClose, 
  onUpdate,
  onSendPaymentLink,
  onDelete,
  initialTab = 'info'
}: ProjectDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'onboarding' | 'messages' | 'feedback' | 'customer'>(initialTab)
  const [newMessage, setNewMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [internalNotes, setInternalNotes] = useState(project.internalNotes || '')
  const [designPreviewUrl, setDesignPreviewUrl] = useState(project.designPreviewUrl || '')
  const [savingDesignUrl, setSavingDesignUrl] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  
  // Phase checklist modal state
  const [showPhaseChecklist, setShowPhaseChecklist] = useState(false)
  const [checklistItems, setChecklistItems] = useState<Record<string, boolean>>({})
  const [targetPhase, setTargetPhase] = useState<ProjectPhase | null>(null)

  const packageInfo = PACKAGE_CONFIG[project.package]
  const phaseInfo = PHASE_CONFIG[project.phase]
  const serviceInfo = project.serviceType ? SERVICE_CONFIG[project.serviceType] : null
  const unreadMessages = project.messages.filter(m => !m.read && m.from === 'client').length
  const pendingFeedback = project.feedbackHistory?.filter(f => f.status === 'pending') || []
  
  // Phase navigation - Flow: Onboarding → Design → Feedback → Betaling → Live
  const phases: ProjectPhase[] = ['onboarding', 'design', 'feedback', 'payment', 'live']
  const currentPhaseIndex = phases.indexOf(project.phase)

  // Helper to safely get onboarding data values
  const getData = (key: string): string | undefined => {
    const value = project.onboardingData?.[key]
    return typeof value === 'string' ? value : undefined
  }
  
  const getArrayData = (key: string): string[] => {
    const value = project.onboardingData?.[key]
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
  }
  
  const getBoolData = (key: string): boolean | undefined => {
    const value = project.onboardingData?.[key]
    return typeof value === 'boolean' ? value : undefined
  }

  // Scroll to bottom of messages
  useEffect(() => {
    if (activeTab === 'messages') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [project.messages, activeTab])

  // Mark messages as read
  useEffect(() => {
    if (activeTab === 'messages' && unreadMessages > 0) {
      const updatedMessages = project.messages.map(m => 
        m.from === 'client' ? { ...m, read: true } : m
      )
      onUpdate({ ...project, messages: updatedMessages })
    }
  }, [activeTab])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      date: new Date().toISOString(),
      from: 'developer',
      message: newMessage.trim(),
      read: true
    }
    
    onUpdate({
      ...project,
      messages: [...project.messages, message],
      updatedAt: new Date().toISOString()
    })
    setNewMessage('')
  }

  const handlePhaseChange = (newPhase: ProjectPhase) => {
    // Don't do anything if clicking current phase
    if (newPhase === project.phase) return
    
    // Set target phase and open checklist
    setTargetPhase(newPhase)
    
    // Determine which checklist to show (current phase for forward, target for backward)
    const targetIndex = phases.indexOf(newPhase)
    const isMovingForward = targetIndex > currentPhaseIndex
    const checklistPhase = isMovingForward ? project.phase : newPhase
    
    // Reset checklist items
    const currentChecklist = PHASE_CHECKLIST[checklistPhase]
    const initialItems: Record<string, boolean> = {}
    currentChecklist.tasks.forEach((_, index) => {
      initialItems[`task-${index}`] = false
    })
    setChecklistItems(initialItems)
    setShowPhaseChecklist(true)
  }

  // Actually change the phase after checklist confirmation
  const confirmPhaseChange = () => {
    if (!targetPhase) return
    onUpdate({
      ...project,
      phase: targetPhase,
      updatedAt: new Date().toISOString()
    })
    setShowPhaseChecklist(false)
    setChecklistItems({})
    setTargetPhase(null)
  }

  // Open phase checklist modal before advancing to next phase
  const handleOpenPhaseChecklist = () => {
    const nextPhase = phases[currentPhaseIndex + 1]
    if (!nextPhase) return
    handlePhaseChange(nextPhase)
  }

  // Get the checklist phase (current for forward, target for backward)
  const getChecklistPhase = (): ProjectPhase => {
    if (!targetPhase) return project.phase
    const targetIndex = phases.indexOf(targetPhase)
    const isMovingForward = targetIndex > currentPhaseIndex
    return isMovingForward ? project.phase : targetPhase
  }

  // Check if all checklist items are checked
  const allChecklistItemsChecked = () => {
    const checklistPhase = getChecklistPhase()
    const checklist = PHASE_CHECKLIST[checklistPhase]
    return checklist.tasks.every((_, index) => checklistItems[`task-${index}`])
  }

  const handleSaveNotes = () => {
    onUpdate({
      ...project,
      internalNotes,
      updatedAt: new Date().toISOString()
    })
  }

  const handleSaveDesignUrl = async () => {
    if (designPreviewUrl === project.designPreviewUrl) return
    setSavingDesignUrl(true)
    
    // Als er een URL wordt ingevuld en we zijn in 'design' fase, ga automatisch naar 'feedback' fase
    const shouldAdvanceToFeedback = designPreviewUrl && designPreviewUrl.trim() !== '' && project.phase === 'design'
    
    onUpdate({
      ...project,
      designPreviewUrl: designPreviewUrl || undefined,
      // Automatisch naar feedback fase als URL wordt toegevoegd tijdens design fase
      ...(shouldAdvanceToFeedback && { phase: 'feedback' as ProjectPhase }),
      updatedAt: new Date().toISOString()
    })
    setTimeout(() => setSavingDesignUrl(false), 500)
  }

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleResolveFeedback = (feedbackId: string) => {
    const updatedHistory = project.feedbackHistory?.map(f =>
      f.id === feedbackId ? { ...f, status: 'resolved' as const } : f
    ) || []
    onUpdate({ ...project, feedbackHistory: updatedHistory })
  }

  // Handle project deletion with password verification
  const handleDeleteProject = async () => {
    if (!deletePassword.trim()) {
      setDeleteError('Voer je wachtwoord in')
      return
    }
    
    setDeleteLoading(true)
    setDeleteError('')
    
    try {
      // Verify password via developer login endpoint
      const verifyResponse = await fetch('/api/developer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword })
      })
      
      if (!verifyResponse.ok) {
        setDeleteError('Onjuist wachtwoord')
        setDeleteLoading(false)
        return
      }
      
      // Password correct, proceed with deletion
      if (onDelete) {
        const success = await onDelete(project.projectId)
        if (success) {
          onClose()
        } else {
          setDeleteError('Kon project niet verwijderen')
        }
      }
    } catch (err) {
      setDeleteError('Er ging iets mis')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {serviceInfo && <span className="text-lg">{serviceInfo.emoji}</span>}
                <h2 className="text-xl font-bold text-white">{project.businessName}</h2>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${phaseInfo.bgColor} ${phaseInfo.color}`}>
                  {phaseInfo.emoji} {phaseInfo.label}
                </span>
              </div>
              <p className="text-sm text-gray-400">{project.contactName} • {project.contactEmail}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Phase Progress */}
          <div className="mt-4 flex items-center gap-1">
            {phases.map((phase, idx) => {
              const info = PHASE_CONFIG[phase]
              const isActive = idx === currentPhaseIndex
              const isPast = idx < currentPhaseIndex
              
              return (
                <button
                  key={phase}
                  onClick={() => handlePhaseChange(phase)}
                  className={`flex-1 py-2 px-1 text-xs font-medium rounded transition ${
                    isActive 
                      ? `${info.bgColor} ${info.color}` 
                      : isPast
                      ? 'bg-gray-800 text-gray-400'
                      : 'bg-gray-800/50 text-gray-600 hover:bg-gray-800 hover:text-gray-400'
                  }`}
                  title={info.label}
                >
                  {info.emoji}
                </button>
              )
            })}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto">
            {[
              { id: 'info', label: 'Info', icon: FileText },
              { id: 'onboarding', label: 'Onboarding', icon: ClipboardList },
              { id: 'messages', label: 'Berichten', icon: MessageSquare, badge: unreadMessages > 0 ? unreadMessages : undefined },
              { id: 'feedback', label: 'Feedback', icon: AlertCircle, badge: pendingFeedback.length > 0 ? pendingFeedback.length : undefined },
              { id: 'customer', label: 'Klant', icon: User },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-280px)]">
          <AnimatePresence mode="wait">
            {/* Info Tab */}
            {activeTab === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800/50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Pakket</p>
                    <p className="text-white font-medium">{packageInfo.emoji} {packageInfo.name}</p>
                    <p className="text-emerald-400 text-sm">€{packageInfo.price}/maand</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Betaling</p>
                    <p className={`font-medium ${
                      project.paymentStatus === 'paid' ? 'text-green-400' :
                      project.paymentStatus === 'awaiting_payment' ? 'text-amber-400' :
                      'text-gray-400'
                    }`}>
                      {project.paymentStatus === 'paid' ? '✓ Betaald' :
                       project.paymentStatus === 'awaiting_payment' ? '⏳ Wacht op betaling' :
                       '○ In afwachting'}
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Contact</h4>
                  <div className="space-y-2">
                    <a href={`mailto:${project.contactEmail}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-emerald-400 transition">
                      <Mail className="w-4 h-4" />
                      {project.contactEmail}
                    </a>
                    {project.contactPhone && (
                      <a href={`tel:${project.contactPhone}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-emerald-400 transition">
                        <Phone className="w-4 h-4" />
                        {project.contactPhone}
                      </a>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Acties</h4>
                  <div className="flex flex-wrap gap-2">
                    {/* Client Dashboard Link */}
                    <button
                      onClick={() => handleCopyLink(`https://webstability.nl/status/${project.projectId}`)}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      Klant dashboard link
                    </button>
                    
                    {/* Send Payment Link */}
                    {project.phase === 'feedback' && project.paymentStatus !== 'paid' && (
                      <button
                        onClick={() => onSendPaymentLink(project)}
                        className="flex items-center gap-2 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg text-sm text-amber-400 transition"
                      >
                        <CreditCard className="w-4 h-4" />
                        Stuur betaallink
                      </button>
                    )}

                    {/* External Links */}
                    {project.designPreviewUrl && (
                      <a
                        href={project.designPreviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-sm text-purple-400 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Design preview
                      </a>
                    )}
                    
                    {project.googleDriveUrl && (
                      <a
                        href={project.googleDriveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-sm text-blue-400 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Google Drive
                      </a>
                    )}
                    
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-sm text-green-400 transition"
                      >
                        <Globe className="w-4 h-4" />
                        Live website
                      </a>
                    )}
                  </div>
                </div>

                {/* 🎨 DESIGN PREVIEW URL - Only in design phase */}
                {project.phase === 'design' && (
                  <div className={`rounded-xl p-4 border-2 ${
                    designPreviewUrl 
                      ? 'bg-emerald-500/10 border-emerald-500/50' 
                      : 'bg-purple-500/10 border-purple-500 animate-pulse'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${designPreviewUrl ? 'bg-emerald-500' : 'bg-purple-500'}`}>
                        <Palette className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-sm ${designPreviewUrl ? 'text-emerald-400' : 'text-purple-400'}`}>
                          🎨 Design Preview URL {!designPreviewUrl && '(VERPLICHT!)'}
                        </h4>
                        <p className="text-xs text-gray-400">
                          Figma, staging, of andere preview link voor de klant
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={designPreviewUrl}
                        onChange={(e) => setDesignPreviewUrl(e.target.value)}
                        onBlur={handleSaveDesignUrl}
                        placeholder="https://figma.com/... of https://preview.webstability.nl/..."
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
                      />
                      {designPreviewUrl && (
                        <a
                          href={designPreviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-1 text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open
                        </a>
                      )}
                    </div>
                    {savingDesignUrl && (
                      <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Opslaan...
                      </p>
                    )}
                    {designPreviewUrl && !savingDesignUrl && (
                      <p className="text-xs text-emerald-400 mt-2">
                        ✓ Klant kan dit bekijken via hun dashboard
                      </p>
                    )}
                  </div>
                )}

                {/* Developer Checklist - Wat moet je doen? */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ListChecks className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-sm font-medium text-emerald-400">
                      {PHASE_CHECKLIST[project.phase].title}
                    </h4>
                  </div>
                  <ul className="space-y-2 mb-3">
                    {PHASE_CHECKLIST[project.phase].tasks.map((task, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 pt-3 border-t border-emerald-500/20">
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                    <p className="text-sm text-emerald-400 font-medium">
                      {PHASE_CHECKLIST[project.phase].nextAction}
                    </p>
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Interne notities</h4>
                  <textarea
                    value={internalNotes}
                    onChange={e => setInternalNotes(e.target.value)}
                    onBlur={handleSaveNotes}
                    placeholder="Notities voor jezelf..."
                    rows={3}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                {/* Timeline Info */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Aangemaakt: {new Date(project.createdAt).toLocaleDateString('nl-NL')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Laatste update: {new Date(project.updatedAt).toLocaleDateString('nl-NL')}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Onboarding Tab - All client submitted data */}
            {activeTab === 'onboarding' && (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {project.onboardingData ? (
                  <>
                    {/* Business Info */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-xs">1</span>
                        Bedrijfsgegevens
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {getData('businessName') && (
                          <div>
                            <p className="text-gray-500 text-xs">Bedrijfsnaam</p>
                            <p className="text-gray-200">{getData('businessName')}</p>
                          </div>
                        )}
                        {getData('industry') && (
                          <div>
                            <p className="text-gray-500 text-xs">Branche</p>
                            <p className="text-gray-200">{getData('industry')}</p>
                          </div>
                        )}
                        {getData('targetAudience') && (
                          <div className="col-span-2">
                            <p className="text-gray-500 text-xs">Doelgroep</p>
                            <p className="text-gray-200">{getData('targetAudience')}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Website Requirements */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-xs">2</span>
                        Website wensen
                      </h4>
                      <div className="space-y-3 text-sm">
                        {getArrayData('pages').length > 0 && (
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Gewenste pagina's</p>
                            <div className="flex flex-wrap gap-1">
                              {getArrayData('pages').map((page, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">
                                  {page}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {getArrayData('features').length > 0 && (
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Gewenste functies</p>
                            <div className="flex flex-wrap gap-1">
                              {getArrayData('features').map((feature, i) => (
                                <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {getData('stylePreference') && (
                          <div>
                            <p className="text-gray-500 text-xs">Stijlvoorkeur</p>
                            <p className="text-gray-200">{getData('stylePreference')}</p>
                          </div>
                        )}
                        {getData('colorPreference') && (
                          <div>
                            <p className="text-gray-500 text-xs">Kleurvoorkeur</p>
                            <p className="text-gray-200">{getData('colorPreference')}</p>
                          </div>
                        )}
                        {getData('exampleWebsites') && (
                          <div>
                            <p className="text-gray-500 text-xs">Voorbeeld websites</p>
                            <p className="text-gray-200 break-all">{getData('exampleWebsites')}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-xs">3</span>
                        Content
                      </h4>
                      <div className="space-y-3 text-sm">
                        {getData('aboutText') && (
                          <div>
                            <p className="text-gray-500 text-xs">Over ons tekst</p>
                            <p className="text-gray-200 whitespace-pre-wrap">{getData('aboutText')}</p>
                          </div>
                        )}
                        {getData('services') && (
                          <div>
                            <p className="text-gray-500 text-xs">Diensten / Producten</p>
                            <p className="text-gray-200 whitespace-pre-wrap">{getData('services')}</p>
                          </div>
                        )}
                        {getBoolData('hasLogo') !== undefined && (
                          <div>
                            <p className="text-gray-500 text-xs">Heeft logo</p>
                            <p className="text-gray-200">{getBoolData('hasLogo') ? 'Ja' : 'Nee (moet gemaakt worden)'}</p>
                          </div>
                        )}
                        {getBoolData('hasPhotos') !== undefined && (
                          <div>
                            <p className="text-gray-500 text-xs">Heeft foto's</p>
                            <p className="text-gray-200">{getBoolData('hasPhotos') ? 'Ja' : 'Nee'}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Info */}
                    {(getData('additionalNotes') || getData('deadline')) && (
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <span className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-xs">4</span>
                          Extra informatie
                        </h4>
                        <div className="space-y-3 text-sm">
                          {getData('deadline') && (
                            <div>
                              <p className="text-gray-500 text-xs">Gewenste deadline</p>
                              <p className="text-gray-200">{getData('deadline')}</p>
                            </div>
                          )}
                          {getData('additionalNotes') && (
                            <div>
                              <p className="text-gray-500 text-xs">Extra opmerkingen</p>
                              <p className="text-gray-200 whitespace-pre-wrap">{getData('additionalNotes')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Raw data for debugging / completeness */}
                    <details className="bg-gray-800/30 rounded-xl p-3">
                      <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
                        Bekijk alle ruwe data
                      </summary>
                      <pre className="mt-2 text-xs text-gray-400 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(project.onboardingData, null, 2)}
                      </pre>
                    </details>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    <div className="text-center">
                      <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Geen onboarding data beschikbaar</p>
                      <p className="text-xs text-gray-600 mt-1">Klant heeft formulier nog niet ingevuld</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-[400px]"
              >
                {/* Messages List */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {project.messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Nog geen berichten</p>
                      </div>
                    </div>
                  ) : (
                    project.messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.from === 'developer' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                          msg.from === 'developer'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-800 text-gray-200'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${
                            msg.from === 'developer' ? 'text-emerald-200' : 'text-gray-500'
                          }`}>
                            {new Date(msg.date).toLocaleString('nl-NL', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Typ een bericht..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl transition"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {(!project.feedbackHistory || project.feedbackHistory.length === 0) ? (
                  <div className="flex items-center justify-center py-12 text-gray-500">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Nog geen feedback ontvangen</p>
                      <p className="text-xs mt-1">Feedback verschijnt hier wanneer de klant reageert op het design</p>
                    </div>
                  </div>
                ) : (
                  project.feedbackHistory.map(fb => (
                    <div 
                      key={fb.id}
                      className={`p-4 rounded-xl border ${
                        fb.status === 'resolved'
                          ? 'bg-gray-800/30 border-gray-700'
                          : 'bg-amber-500/10 border-amber-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            fb.status === 'resolved'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {fb.status === 'resolved' ? '✓ Verwerkt' : '⏳ Open'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {fb.type === 'design' ? '🎨 Design' : '✅ Review'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(fb.date).toLocaleDateString('nl-NL', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {/* Structured feedback items */}
                      {fb.feedbackItems && fb.feedbackItems.length > 0 ? (
                        <div className="space-y-2">
                          {fb.feedbackItems.filter(item => item.rating === 'negative').map((item, i) => (
                            <div key={i} className="bg-red-500/10 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm text-red-300">⚠️ {item.category}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  item.priority === 'urgent' ? 'bg-red-500 text-white' :
                                  item.priority === 'normal' ? 'bg-amber-500 text-white' : 'bg-gray-600 text-gray-300'
                                }`}>
                                  {item.priority === 'urgent' ? '🔴 Urgent' : item.priority === 'normal' ? '🟡 Normaal' : '🟢 Laag'}
                                </span>
                              </div>
                              <p className="text-sm text-red-200">{item.feedback}</p>
                            </div>
                          ))}
                          
                          {fb.feedbackItems.filter(item => item.rating === 'positive').length > 0 && (
                            <div className="bg-green-500/10 rounded-lg p-3">
                              <p className="text-sm text-green-300">
                                ✅ Goedgekeurd: {fb.feedbackItems.filter(item => item.rating === 'positive').map(item => item.category).join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : fb.feedback ? (
                        <p className="text-sm text-gray-300 whitespace-pre-line">{fb.feedback}</p>
                      ) : null}

                      {/* Resolve button */}
                      {fb.status !== 'resolved' && (
                        <button
                          onClick={() => handleResolveFeedback(fb.id)}
                          className="mt-3 px-3 py-1.5 text-xs font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition"
                        >
                          ✓ Markeer als verwerkt
                        </button>
                      )}
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* Customer Tab */}
            {activeTab === 'customer' && (
              <motion.div
                key="customer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Customer Contact Info - Compact Grid */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Contactgegevens
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Bedrijf</p>
                      <p className="text-white font-medium text-sm truncate">{project.businessName || '-'}</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Contact</p>
                      <p className="text-white font-medium text-sm truncate">{project.contactName || '-'}</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">E-mail</p>
                      <a href={`mailto:${project.contactEmail}`} className="text-emerald-400 hover:underline text-sm truncate block">
                        {project.contactEmail || '-'}
                      </a>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Telefoon</p>
                      {project.contactPhone ? (
                        <a href={`tel:${project.contactPhone}`} className="text-emerald-400 hover:underline text-sm">
                          {project.contactPhone}
                        </a>
                      ) : (
                        <p className="text-gray-500 text-sm">-</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Domain & Email Status - Show if project has liveGoingData or domainInfo */}
                {(project.domainInfo || project.emailInfo || project.liveGoingData) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Domain Status */}
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Domein
                      </h4>
                      {(() => {
                        const domain = project.liveGoingData?.domainInfo || project.domainInfo
                        if (!domain) return <p className="text-gray-500 text-xs">Niet ingevuld</p>
                        
                        const statusColors = {
                          not_started: 'bg-gray-500/20 text-gray-400',
                          instructions_sent: 'bg-amber-500/20 text-amber-400',
                          pending: 'bg-amber-500/20 text-amber-400',
                          in_progress: 'bg-blue-500/20 text-blue-400',
                          completed: 'bg-green-500/20 text-green-400',
                          not_needed: 'bg-gray-500/20 text-gray-400'
                        }
                        const statusLabels = {
                          not_started: 'Niet gestart',
                          instructions_sent: 'Instructies verstuurd',
                          pending: 'In afwachting',
                          in_progress: 'Bezig',
                          completed: 'Voltooid',
                          not_needed: 'Niet nodig'
                        }
                        
                        return (
                          <div className="space-y-2">
                            <div className="bg-gray-900/50 rounded-lg p-2">
                              <p className="text-[10px] uppercase tracking-wider text-gray-500">Status</p>
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${statusColors[domain.transferStatus]}`}>
                                {statusLabels[domain.transferStatus]}
                              </span>
                            </div>
                            {domain.domainName && (
                              <div className="bg-gray-900/50 rounded-lg p-2">
                                <p className="text-[10px] uppercase tracking-wider text-gray-500">Domein</p>
                                <p className="text-white text-sm font-mono">{domain.domainName}</p>
                              </div>
                            )}
                            {domain.registrar && (
                              <div className="bg-gray-900/50 rounded-lg p-2">
                                <p className="text-[10px] uppercase tracking-wider text-gray-500">Registrar</p>
                                <p className="text-gray-300 text-sm">{domain.registrar}</p>
                              </div>
                            )}
                            {domain.dnsVerified !== undefined && (
                              <div className="flex items-center gap-2 text-xs">
                                {domain.dnsVerified ? (
                                  <span className="flex items-center gap-1 text-green-400">
                                    <CheckCircle2 className="w-3 h-3" />
                                    DNS geverifieerd
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-amber-400">
                                    <Clock className="w-3 h-3" />
                                    DNS niet geverifieerd
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                    
                    {/* Email Status */}
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Zakelijke E-mail
                      </h4>
                      {(() => {
                        const email = project.liveGoingData?.emailInfo || project.emailInfo
                        if (!email) return <p className="text-gray-500 text-xs">Niet ingevuld</p>
                        
                        const statusColors = {
                          not_started: 'bg-gray-500/20 text-gray-400',
                          pending: 'bg-amber-500/20 text-amber-400',
                          in_progress: 'bg-blue-500/20 text-blue-400',
                          completed: 'bg-green-500/20 text-green-400',
                          not_needed: 'bg-gray-500/20 text-gray-400'
                        }
                        const statusLabels = {
                          not_started: 'Niet gestart',
                          pending: 'In afwachting',
                          in_progress: 'Bezig',
                          completed: 'Voltooid',
                          not_needed: 'Niet nodig'
                        }
                        
                        return (
                          <div className="space-y-2">
                            <div className="bg-gray-900/50 rounded-lg p-2">
                              <p className="text-[10px] uppercase tracking-wider text-gray-500">Status</p>
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${statusColors[email.emailSetupStatus]}`}>
                                {statusLabels[email.emailSetupStatus]}
                              </span>
                            </div>
                            <div className="bg-gray-900/50 rounded-lg p-2">
                              <p className="text-[10px] uppercase tracking-wider text-gray-500">Huidige situatie</p>
                              <p className="text-gray-300 text-sm">
                                {email.hasBusinessEmail ? 'Heeft al zakelijke email' : 'Nog geen zakelijke email'}
                              </p>
                            </div>
                            {email.currentProvider && (
                              <div className="bg-gray-900/50 rounded-lg p-2">
                                <p className="text-[10px] uppercase tracking-wider text-gray-500">Provider</p>
                                <p className="text-gray-300 text-sm">{email.currentProvider}</p>
                              </div>
                            )}
                            {email.wantsWebstabilityEmail && (
                              <div className="flex items-center gap-2 text-xs text-purple-400">
                                <CheckCircle2 className="w-3 h-3" />
                                Wil Webstability email
                              </div>
                            )}
                            {email.emailAddresses && email.emailAddresses.length > 0 && (
                              <div className="bg-gray-900/50 rounded-lg p-2">
                                <p className="text-[10px] uppercase tracking-wider text-gray-500">E-mailadressen</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {email.emailAddresses.map((addr, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-gray-700/50 rounded text-xs text-gray-300 font-mono">
                                      {addr}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                )}

                {/* Full Onboarding Data - All Fields */}
                {project.onboardingData && Object.keys(project.onboardingData).length > 0 && (() => {
                  const data = project.onboardingData as Record<string, unknown>
                  
                  // Categorize fields
                  const fieldCategories = {
                    bedrijf: {
                      title: '🏢 Bedrijfsinformatie',
                      color: 'from-blue-500/10 to-indigo-500/10',
                      borderColor: 'border-blue-500/20',
                      titleColor: 'text-blue-400',
                      fields: ['businessName', 'aboutBusiness', 'uniqueFeatures', 'services', 'targetAudience', 'competitors', 'usp']
                    },
                    branding: {
                      title: '🎨 Branding & Design',
                      color: 'from-purple-500/10 to-pink-500/10',
                      borderColor: 'border-purple-500/20',
                      titleColor: 'text-purple-400',
                      fields: ['brandColors', 'colorPreferences', 'fontStyle', 'fontPreferences', 'designStyle', 'webshopStyle', 'designPreferences', 'hasLogo', 'logoDescription', 'inspirationUrls', 'exampleShops', 'referenceWebsites', 'inspiration', 'designNotes', 'moodboard']
                    },
                    doelen: {
                      title: '🎯 Doelen & Strategie',
                      color: 'from-amber-500/10 to-orange-500/10',
                      borderColor: 'border-amber-500/20',
                      titleColor: 'text-amber-400',
                      fields: ['mainGoal', 'goal', 'websiteGoals', 'callToAction', 'conversionGoals', 'kpis']
                    },
                    paginas: {
                      title: '📄 Pagina\'s & Content',
                      color: 'from-green-500/10 to-emerald-500/10',
                      borderColor: 'border-green-500/20',
                      titleColor: 'text-green-400',
                      fields: ['selectedPages', 'pages', 'pageContent', 'contentReady', 'copywriting', 'blogNeeded', 'hasContent']
                    },
                    features: {
                      title: '⚙️ Functionaliteiten',
                      color: 'from-cyan-500/10 to-blue-500/10',
                      borderColor: 'border-cyan-500/20',
                      titleColor: 'text-cyan-400',
                      fields: ['selectedFeatures', 'features', 'integrations', 'contactForm', 'newsletter', 'socialMedia', 'analytics', 'seo', 'multilingual', 'languages']
                    },
                    planning: {
                      title: '📅 Planning & Deadline',
                      color: 'from-rose-500/10 to-red-500/10',
                      borderColor: 'border-rose-500/20',
                      titleColor: 'text-rose-400',
                      fields: ['deadline', 'preferredDate', 'launchDate', 'timeline', 'urgency', 'budget', 'additionalNotes', 'extraInfo']
                    }
                  }
                  
                  // Field labels in Dutch
                  const fieldLabels: Record<string, string> = {
                    businessName: 'Bedrijfsnaam',
                    aboutBusiness: 'Over het bedrijf',
                    uniqueFeatures: 'Unieke kenmerken',
                    services: 'Diensten/Producten',
                    targetAudience: 'Doelgroep',
                    competitors: 'Concurrenten',
                    usp: 'USP',
                    brandColors: 'Merkleuren',
                    colorPreferences: 'Kleurvoorkeuren',
                    fontStyle: 'Lettertype stijl',
                    fontPreferences: 'Lettertype voorkeuren',
                    designStyle: 'Designstijl',
                    webshopStyle: 'Webshop stijl',
                    designPreferences: 'Design voorkeuren',
                    hasLogo: 'Heeft logo',
                    logoDescription: 'Logo omschrijving',
                    inspirationUrls: 'Inspiratie websites',
                    exampleShops: 'Voorbeeld webshops',
                    designNotes: 'Design opmerkingen',
                    moodboard: 'Moodboard',
                    referenceWebsites: 'Referentie websites',
                    inspiration: 'Inspiratie',
                    mainGoal: 'Hoofddoel',
                    goal: 'Doel',
                    websiteGoals: 'Website doelen',
                    callToAction: 'Call-to-action',
                    conversionGoals: 'Conversiedoelen',
                    kpis: 'KPIs',
                    selectedPages: 'Geselecteerde pagina\'s',
                    pages: 'Pagina\'s',
                    pageContent: 'Pagina content',
                    contentReady: 'Content gereed',
                    copywriting: 'Copywriting nodig',
                    blogNeeded: 'Blog gewenst',
                    hasContent: 'Heeft content',
                    selectedFeatures: 'Geselecteerde features',
                    features: 'Features',
                    integrations: 'Integraties',
                    contactForm: 'Contactformulier',
                    newsletter: 'Nieuwsbrief',
                    socialMedia: 'Social media',
                    analytics: 'Analytics',
                    seo: 'SEO',
                    multilingual: 'Meertalig',
                    languages: 'Talen',
                    deadline: 'Deadline',
                    preferredDate: 'Gewenste datum',
                    launchDate: 'Lanceerdatum',
                    timeline: 'Tijdlijn',
                    urgency: 'Urgentie',
                    budget: 'Budget',
                    additionalNotes: 'Extra opmerkingen',
                    extraInfo: 'Extra informatie',
                    package: 'Pakket',
                    packageType: 'Pakket type'
                  }
                  
                  // Font style labels
                  const fontStyleLabels: Record<string, string> = {
                    modern: 'Modern & Clean (Inter)',
                    elegant: 'Elegant & Classy (Playfair Display + Lato)',
                    bold: 'Bold & Impactful (Montserrat + Open Sans)',
                    friendly: 'Friendly & Warm (Poppins + Nunito)',
                    creative: 'Creative & Unique (Space Grotesk + DM Sans)'
                  }
                  
                  // Design style labels
                  const designStyleLabels: Record<string, string> = {
                    minimalist: 'Minimalistisch',
                    minimal: 'Minimalistisch',
                    modern: 'Modern & Strak',
                    creative: 'Creatief & Speels',
                    professional: 'Corporate & Zakelijk',
                    corporate: 'Zakelijk',
                    warm: 'Warm & Uitnodigend',
                    bold: 'Bold & Opvallend',
                    luxury: 'Luxe & Premium',
                    playful: 'Speels & Vrolijk'
                  }
                  
                  // Check if value is a color (hex)
                  const isColor = (val: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(val)
                  
                  // Render value based on type and field
                  const renderValue = (value: unknown, fieldName?: string): React.ReactNode => {
                    if (value === null || value === undefined || value === '') return null
                    if (typeof value === 'boolean') return value ? '✓ Ja' : '✗ Nee'
                    
                    // Special handling for font style
                    if (fieldName === 'fontStyle' && typeof value === 'string') {
                      return fontStyleLabels[value] || value
                    }
                    
                    // Special handling for design style (includes webshopStyle)
                    if ((fieldName === 'designStyle' || fieldName === 'webshopStyle') && typeof value === 'string') {
                      return designStyleLabels[value] || value
                    }
                    
                    // Special handling for hasLogo
                    if (fieldName === 'hasLogo' && typeof value === 'string') {
                      const logoLabels: Record<string, string> = {
                        yes: '✓ Ja, heeft logo',
                        no: '✗ Nee, geen logo',
                        need_refresh: '↻ Ja, maar wil nieuw logo'
                      }
                      return logoLabels[value] || value
                    }
                    
                    if (Array.isArray(value)) {
                      if (value.length === 0) return null
                      // Check if array contains colors
                      const hasColors = value.some(v => typeof v === 'string' && isColor(v))
                      if (hasColors) {
                        return (
                          <div className="flex flex-wrap gap-2">
                            {value.map((item, i) => {
                              const strItem = String(item)
                              if (isColor(strItem)) {
                                return (
                                  <div key={i} className="flex items-center gap-2 px-2 py-1 bg-gray-700/50 rounded">
                                    <div 
                                      className="w-6 h-6 rounded border border-white/20" 
                                      style={{ backgroundColor: strItem }}
                                    />
                                    <span className="text-xs font-mono text-gray-300">{strItem}</span>
                                  </div>
                                )
                              }
                              return (
                                <span key={i} className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
                                  {strItem}
                                </span>
                              )
                            })}
                          </div>
                        )
                      }
                      // Check if array contains URLs
                      const hasUrls = value.some(v => typeof v === 'string' && v.startsWith('http'))
                      if (hasUrls) {
                        return (
                          <div className="flex flex-col gap-1">
                            {value.map((item, i) => {
                              const strItem = String(item)
                              if (strItem.startsWith('http')) {
                                return (
                                  <a 
                                    key={i} 
                                    href={strItem} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 truncate"
                                  >
                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">{strItem}</span>
                                  </a>
                                )
                              }
                              return (
                                <span key={i} className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
                                  {strItem}
                                </span>
                              )
                            })}
                          </div>
                        )
                      }
                      return (
                        <div className="flex flex-wrap gap-1.5">
                          {value.map((item, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
                              {String(item)}
                            </span>
                          ))}
                        </div>
                      )
                    }
                    if (typeof value === 'object') return JSON.stringify(value, null, 2)
                    return String(value)
                  }
                  
                  // Get fields that have data for each category
                  const categoriesWithData = Object.entries(fieldCategories).map(([key, cat]) => {
                    const fieldsWithData = cat.fields.filter(field => {
                      const val = data[field]
                      return val !== null && val !== undefined && val !== '' && 
                             !(Array.isArray(val) && val.length === 0)
                    })
                    return { key, ...cat, fieldsWithData }
                  }).filter(cat => cat.fieldsWithData.length > 0)
                  
                  // Also collect uncategorized fields
                  const allCategorizedFields = Object.values(fieldCategories).flatMap(cat => cat.fields)
                  const uncategorizedFields = Object.keys(data).filter(key => 
                    !allCategorizedFields.includes(key) && 
                    data[key] !== null && 
                    data[key] !== undefined && 
                    data[key] !== '' &&
                    !(Array.isArray(data[key]) && (data[key] as unknown[]).length === 0)
                  )
                  
                  return (
                    <div className="space-y-3">
                      {categoriesWithData.map(cat => (
                        <div key={cat.key} className={`bg-gradient-to-br ${cat.color} border ${cat.borderColor} rounded-xl p-4`}>
                          <h4 className={`text-sm font-semibold ${cat.titleColor} mb-3`}>
                            {cat.title}
                          </h4>
                          <div className="space-y-2">
                            {cat.fieldsWithData.map(field => {
                              const value = renderValue(data[field], field)
                              if (!value) return null
                              return (
                                <div key={field} className="bg-gray-900/50 rounded-lg p-3">
                                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                                    {fieldLabels[field] || field}
                                  </p>
                                  <div className="text-gray-200 text-sm whitespace-pre-wrap break-words">
                                    {value}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                      
                      {/* Uncategorized fields */}
                      {uncategorizedFields.length > 0 && (
                        <div className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 border border-gray-500/20 rounded-xl p-4">
                          <h4 className="text-sm font-semibold text-gray-400 mb-3">
                            📋 Overige gegevens
                          </h4>
                          <div className="space-y-2">
                            {uncategorizedFields.map(field => {
                              const value = renderValue(data[field], field)
                              if (!value) return null
                              return (
                                <div key={field} className="bg-gray-900/50 rounded-lg p-3">
                                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                                    {fieldLabels[field] || field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                  </p>
                                  <div className="text-gray-200 text-sm whitespace-pre-wrap break-words">
                                    {value}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}

                {/* No onboarding data message */}
                {(!project.onboardingData || Object.keys(project.onboardingData).length === 0) && (
                  <div className="bg-gray-800/50 rounded-xl p-6 text-center">
                    <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Nog geen onboarding gegevens ingevuld</p>
                    <p className="text-gray-500 text-xs mt-1">De klant heeft de onboarding nog niet voltooid</p>
                  </div>
                )}

                {/* Danger Zone - Delete Project */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Gevarenzone
                  </h4>
                  <p className="text-xs text-red-300/70 mb-4">
                    Het verwijderen van een project is permanent en kan niet ongedaan worden gemaakt.
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm text-red-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Project verwijderen
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-red-300">
                        Voer je developer wachtwoord in om te bevestigen:
                      </p>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={deletePassword}
                          onChange={e => {
                            setDeletePassword(e.target.value)
                            setDeleteError('')
                          }}
                          placeholder="Wachtwoord"
                          className="w-full pl-10 pr-10 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      {deleteError && (
                        <p className="text-sm text-red-400 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {deleteError}
                        </p>
                      )}
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(false)
                            setDeletePassword('')
                            setDeleteError('')
                          }}
                          className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition"
                        >
                          Annuleren
                        </button>
                        <button
                          onClick={handleDeleteProject}
                          disabled={deleteLoading || !deletePassword.trim()}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg text-sm text-white font-medium transition"
                        >
                          {deleteLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              Definitief verwijderen
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer - Quick Phase Navigation */}
        {project.phase !== 'live' && (
          <div className="p-4 border-t border-gray-800 bg-gray-900/50">
            <button
              onClick={handleOpenPhaseChecklist}
              disabled={currentPhaseIndex >= phases.length - 1}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-gray-700 disabled:to-gray-700 text-white font-medium rounded-xl transition flex items-center justify-center gap-2"
            >
              <ListChecks className="w-4 h-4" />
              Naar volgende fase
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Phase Checklist Modal */}
        <AnimatePresence>
          {showPhaseChecklist && targetPhase && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => { setShowPhaseChecklist(false); setTargetPhase(null) }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border border-gray-700 w-full max-w-md overflow-hidden shadow-2xl"
              >
                {/* Header */}
                <div className="p-5 border-b border-gray-700 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <ListChecks className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          Fase wijzigen
                        </h3>
                        <p className="text-sm text-gray-400">
                          {PHASE_CONFIG[project.phase].label} → {PHASE_CONFIG[targetPhase].label}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setShowPhaseChecklist(false); setTargetPhase(null) }}
                      className="p-2 hover:bg-gray-700 rounded-lg transition"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Checklist Content */}
                <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-200 font-medium">
                        {PHASE_CHECKLIST[getChecklistPhase()].title}
                      </p>
                      <p className="text-xs text-amber-300/70 mt-1">
                        {PHASE_CHECKLIST[getChecklistPhase()].nextAction}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-300">Controleer de volgende punten:</p>
                    {PHASE_CHECKLIST[getChecklistPhase()].tasks.map((task, index) => (
                      <motion.label
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          checklistItems[`task-${index}`]
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="relative shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            checked={checklistItems[`task-${index}`] || false}
                            onChange={(e) => setChecklistItems(prev => ({
                              ...prev,
                              [`task-${index}`]: e.target.checked
                            }))}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            checklistItems[`task-${index}`]
                              ? 'bg-emerald-500 border-emerald-500'
                              : 'border-gray-500 hover:border-gray-400'
                          }`}>
                            <AnimatePresence>
                              {checklistItems[`task-${index}`] && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <Check className="w-3 h-3 text-white" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <span className={`text-sm transition-colors ${
                          checklistItems[`task-${index}`] ? 'text-emerald-300' : 'text-gray-300'
                        }`}>
                          {task}
                        </span>
                      </motion.label>
                    ))}
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>Voortgang</span>
                      <span>
                        {Object.values(checklistItems).filter(Boolean).length} / {PHASE_CHECKLIST[getChecklistPhase()].tasks.length}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${(Object.values(checklistItems).filter(Boolean).length / PHASE_CHECKLIST[getChecklistPhase()].tasks.length) * 100}%` 
                        }}
                        transition={{ type: 'spring', damping: 15 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-700 bg-gray-900/50 flex gap-3">
                  <button
                    onClick={() => { setShowPhaseChecklist(false); setTargetPhase(null) }}
                    className="flex-1 py-2.5 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={confirmPhaseChange}
                    disabled={!allChecklistItemsChecked()}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Doorgaan
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
