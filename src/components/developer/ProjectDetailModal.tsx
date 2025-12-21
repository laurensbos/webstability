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
  ChevronRight,
  MessageSquare,
  CreditCard,
  FileText,
  Globe,
  AlertCircle,
  Clock,
  Mail,
  Phone
} from 'lucide-react'
import type { Project, ProjectPhase, ChatMessage } from './types'
import { PHASE_CONFIG, PACKAGE_CONFIG, SERVICE_CONFIG } from './types'

interface ProjectDetailModalProps {
  project: Project
  onClose: () => void
  onUpdate: (project: Project) => void
  onSendPaymentLink: (project: Project) => void
}

export default function ProjectDetailModal({ 
  project, 
  onClose, 
  onUpdate,
  onSendPaymentLink
}: ProjectDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'messages' | 'feedback'>('info')
  const [newMessage, setNewMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [internalNotes, setInternalNotes] = useState(project.internalNotes || '')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const packageInfo = PACKAGE_CONFIG[project.package]
  const phaseInfo = PHASE_CONFIG[project.phase]
  const serviceInfo = project.serviceType ? SERVICE_CONFIG[project.serviceType] : null
  const unreadMessages = project.messages.filter(m => !m.read && m.from === 'client').length
  const pendingFeedback = project.feedbackHistory?.filter(f => f.status === 'pending') || []

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
    onUpdate({
      ...project,
      phase: newPhase,
      updatedAt: new Date().toISOString()
    })
  }

  const handleSaveNotes = () => {
    onUpdate({
      ...project,
      internalNotes,
      updatedAt: new Date().toISOString()
    })
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

  const phases: ProjectPhase[] = ['onboarding', 'design', 'design_approved', 'development', 'review', 'live']
  const currentPhaseIndex = phases.indexOf(project.phase)

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
          <div className="flex gap-1 mt-4">
            {[
              { id: 'info', label: 'Info', icon: FileText },
              { id: 'messages', label: 'Berichten', icon: MessageSquare, badge: unreadMessages },
              { id: 'feedback', label: 'Feedback', icon: AlertCircle, badge: pendingFeedback.length },
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
                    {project.phase === 'design_approved' && project.paymentStatus !== 'paid' && (
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
          </AnimatePresence>
        </div>

        {/* Footer - Quick Phase Navigation */}
        {project.phase !== 'live' && (
          <div className="p-4 border-t border-gray-800 bg-gray-900/50">
            <button
              onClick={() => {
                const nextPhase = phases[currentPhaseIndex + 1]
                if (nextPhase) handlePhaseChange(nextPhase)
              }}
              disabled={currentPhaseIndex >= phases.length - 1}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-gray-700 disabled:to-gray-700 text-white font-medium rounded-xl transition flex items-center justify-center gap-2"
            >
              Naar volgende fase
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
