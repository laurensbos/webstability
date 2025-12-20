import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Save,
  ChevronRight,
  Check,
  FileText,
  Palette,
  Code,
  MessageSquare,
  Rocket,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Mail,
  User,
  Phone,
  Calendar,
  Link as LinkIcon,
  AlertCircle,
  CreditCard
} from 'lucide-react'
import type { Project, ProjectPhase, ProjectUpdate } from '../types/project'
import { PHASE_CONFIGS, getPhaseConfig, getNextPhase, getProgressPercentage } from '../types/project'

interface ProjectEditModalProps {
  project: Project
  isOpen: boolean
  onClose: () => void
  onSave: (project: Project) => Promise<void>
}

const PHASE_ICONS: Record<ProjectPhase, typeof FileText> = {
  onboarding: FileText,
  design: Palette,
  design_approved: CreditCard,
  development: Code,
  review: MessageSquare,
  live: Rocket
}

export default function ProjectEditModal({ project, isOpen, onClose, onSave }: ProjectEditModalProps) {
  const [editingProject, setEditingProject] = useState<Project>(project)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'status' | 'updates' | 'info'>('status')

  useEffect(() => {
    setEditingProject(project)
  }, [project])

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(editingProject)
    } finally {
      setSaving(false)
    }
  }

  const handlePhaseChange = (newPhase: ProjectPhase) => {
    const config = getPhaseConfig(newPhase)
    const today = new Date().toLocaleDateString('nl-NL')
    
    // Auto-add update when phase changes
    const phaseChangeUpdate: ProjectUpdate = {
      date: today,
      title: `Fase: ${config.label}`,
      message: config.customerMessage,
      phase: newPhase
    }
    
    setEditingProject({
      ...editingProject,
      status: newPhase,
      statusMessage: config.customerMessage,
      updates: [phaseChangeUpdate, ...(editingProject.updates || [])]
    })
  }

  const advanceToNextPhase = () => {
    const nextPhase = getNextPhase(editingProject.status)
    if (nextPhase) {
      handlePhaseChange(nextPhase)
    }
  }

  const addUpdate = () => {
    const today = new Date().toLocaleDateString('nl-NL')
    const newUpdate: ProjectUpdate = {
      date: today,
      title: '',
      message: ''
    }
    setEditingProject({
      ...editingProject,
      updates: [newUpdate, ...(editingProject.updates || [])]
    })
  }

  const updateUpdate = (index: number, field: keyof ProjectUpdate, value: string) => {
    const updates = [...(editingProject.updates || [])]
    updates[index] = { ...updates[index], [field]: value }
    setEditingProject({ ...editingProject, updates })
  }

  const removeUpdate = (index: number) => {
    const updates = [...(editingProject.updates || [])]
    updates.splice(index, 1)
    setEditingProject({ ...editingProject, updates })
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const currentPhaseConfig = getPhaseConfig(editingProject.status)
  const nextPhase = getNextPhase(editingProject.status)
  const progress = getProgressPercentage(editingProject.status)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{editingProject.businessName}</h2>
              <div className="flex items-center gap-4 mt-2 text-gray-300 text-sm">
                <span className="flex items-center gap-1">
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded">
                    {editingProject.projectId}
                  </span>
                  <button 
                    onClick={() => copyToClipboard(editingProject.projectId, 'id')}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    {copied === 'id' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </span>
                <span className="capitalize">{editingProject.package}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Voortgang</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-400 to-green-400 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Phase selector - Visual timeline */}
        <div className="border-b bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between gap-2">
            {PHASE_CONFIGS.map((phase, index) => {
              const Icon = PHASE_ICONS[phase.key]
              const isActive = editingProject.status === phase.key
              const isPast = PHASE_CONFIGS.findIndex(p => p.key === editingProject.status) > index
              
              return (
                <button
                  key={phase.key}
                  onClick={() => handlePhaseChange(phase.key)}
                  className={`
                    flex-1 relative group transition-all
                    ${isActive ? 'scale-105' : 'hover:scale-102'}
                  `}
                >
                  <div className={`
                    flex flex-col items-center p-3 rounded-xl border-2 transition-all
                    ${isActive ? `${phase.bgColor} ${phase.borderColor} shadow-lg` : ''}
                    ${isPast ? 'bg-green-50 border-green-200' : ''}
                    ${!isActive && !isPast ? 'bg-white border-gray-200 hover:border-gray-300' : ''}
                  `}>
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center mb-2
                      ${isActive ? phase.bgColor : ''}
                      ${isPast ? 'bg-green-100' : ''}
                      ${!isActive && !isPast ? 'bg-gray-100' : ''}
                    `}>
                      {isPast ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Icon className={`w-5 h-5 ${isActive ? phase.color : 'text-gray-400'}`} />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${isActive ? phase.color : isPast ? 'text-green-700' : 'text-gray-500'}`}>
                      {phase.label}
                    </span>
                  </div>
                  
                  {/* Connector line */}
                  {index < PHASE_CONFIGS.length - 1 && (
                    <div className={`
                      absolute top-1/2 -right-1 w-2 h-0.5
                      ${isPast ? 'bg-green-300' : 'bg-gray-200'}
                    `} />
                  )}
                </button>
              )
            })}
          </div>
          
          {/* Next phase action */}
          {nextPhase && currentPhaseConfig.nextPhaseAction && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={advanceToNextPhase}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all
                  bg-gradient-to-r from-blue-500 to-blue-600 text-white
                  hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl
                `}
              >
                {currentPhaseConfig.nextPhaseAction}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b bg-white px-6">
          <div className="flex gap-6">
            {[
              { id: 'status', label: 'Status & Checklist' },
              { id: 'updates', label: 'Updates' },
              { id: 'info', label: 'Klantinfo' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`
                  py-3 px-1 border-b-2 font-medium text-sm transition
                  ${activeTab === tab.id 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'status' && (
              <motion.div
                key="status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Current phase info */}
                <div className={`rounded-xl p-5 ${currentPhaseConfig.bgColor} border ${currentPhaseConfig.borderColor}`}>
                  <h3 className={`font-semibold ${currentPhaseConfig.color} mb-2`}>
                    Huidige fase: {currentPhaseConfig.label}
                  </h3>
                  <p className="text-gray-700 text-sm">{currentPhaseConfig.description}</p>
                </div>

                {/* Checklist */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                    Checklist voor deze fase
                  </h3>
                  <div className="space-y-3">
                    {currentPhaseConfig.checklist.map((item, index) => (
                      <label
                        key={index}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                          hover:bg-gray-50
                          ${item.forCustomer ? 'border-amber-200 bg-amber-50/50' : 'border-gray-200'}
                        `}
                      >
                        <input type="checkbox" className="w-5 h-5 rounded text-blue-500" />
                        <span className="flex-1 text-gray-700 dark:text-gray-300">{item.label}</span>
                        {item.forCustomer && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                            Klant
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bericht voor klant
                  </label>
                  <textarea
                    value={editingProject.statusMessage}
                    onChange={(e) => setEditingProject({ ...editingProject, statusMessage: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Dit bericht ziet de klant op hun status pagina..."
                  />
                </div>

                {/* Quick fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Geschatte oplevering
                    </label>
                    <input
                      type="text"
                      value={editingProject.estimatedCompletion || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, estimatedCompletion: e.target.value })}
                      placeholder="Bijv. Week 52 of 20 december"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <LinkIcon className="w-4 h-4 inline mr-1" />
                      Design preview URL
                    </label>
                    <input
                      type="url"
                      value={editingProject.designPreviewUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, designPreviewUrl: e.target.value })}
                      placeholder="https://figma.com/..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Rocket className="w-4 h-4 inline mr-1" />
                      Live URL
                    </label>
                    <input
                      type="url"
                      value={editingProject.liveUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                      placeholder="https://example.nl"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <svg className="w-4 h-4 inline mr-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5L7.71 3.5zm9.58 0l3.43 6-9.14 16-3.43-6L17.29 3.5zM14.29 9l-6.14 10.5h6.55l6.14-10.5h-6.55z" />
                      </svg>
                      Google Drive Link (voor klant)
                    </label>
                    <input
                      type="url"
                      value={editingProject.googleDriveUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, googleDriveUrl: e.target.value })}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Klant ziet deze link op hun project pagina om bestanden te uploaden/bekijken
                    </p>
                  </div>
                </div>

                {/* Revisies teller */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Revisie Tracking</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400">Gebruikt</label>
                      <input
                        type="number"
                        min="0"
                        value={editingProject.revisionsUsed || 0}
                        onChange={(e) => setEditingProject({ ...editingProject, revisionsUsed: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center font-bold text-lg"
                      />
                    </div>
                    <span className="text-gray-400 text-xl font-light">/</span>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400">Totaal</label>
                      <input
                        type="number"
                        min="1"
                        value={editingProject.revisionsTotal || 2}
                        onChange={(e) => setEditingProject({ ...editingProject, revisionsTotal: parseInt(e.target.value) || 2 })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center font-bold text-lg"
                      />
                    </div>
                  </div>
                  {(editingProject.revisionsUsed || 0) >= (editingProject.revisionsTotal || 2) && (
                    <p className="text-amber-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Revisie limiet bereikt
                    </p>
                  )}
                </div>

                {/* Quick links */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`/status/${editingProject.projectId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Bekijk klant pagina
                  </a>
                  <a
                    href={`/onboarding/${editingProject.projectId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
                  >
                    <FileText className="w-4 h-4" />
                    Onboarding pagina
                  </a>
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/status/${editingProject.projectId}`, 'status-url')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm font-medium text-blue-700 transition"
                  >
                    {copied === 'status-url' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Kopieer status URL
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'updates' && (
              <motion.div
                key="updates"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Project updates</h3>
                  <button
                    onClick={addUpdate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Nieuwe update
                  </button>
                </div>

                <div className="space-y-4">
                  {(editingProject.updates || []).map((update, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 relative group">
                      <button
                        onClick={() => removeUpdate(index)}
                        className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{update.date}</span>
                        {update.phase && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getPhaseConfig(update.phase).bgColor} ${getPhaseConfig(update.phase).color}`}>
                            {getPhaseConfig(update.phase).label}
                          </span>
                        )}
                      </div>
                      
                      <input
                        type="text"
                        value={update.title}
                        onChange={(e) => updateUpdate(index, 'title', e.target.value)}
                        placeholder="Titel van de update..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2 font-medium"
                      />
                      <textarea
                        value={update.message}
                        onChange={(e) => updateUpdate(index, 'message', e.target.value)}
                        placeholder="Beschrijving..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                  ))}

                  {(!editingProject.updates || editingProject.updates.length === 0) && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Nog geen updates</p>
                      <button
                        onClick={addUpdate}
                        className="mt-3 text-blue-500 hover:text-blue-600 font-medium"
                      >
                        Voeg de eerste update toe
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Klantgegevens</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Contactpersoon
                      </label>
                      <input
                        type="text"
                        value={editingProject.contactName || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, contactName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={editingProject.contactEmail || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, contactEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Telefoon
                      </label>
                      <input
                        type="tel"
                        value={editingProject.contactPhone || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, contactPhone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pakket
                      </label>
                      <input
                        type="text"
                        value={editingProject.package}
                        disabled
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 dark:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Project details</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Project ID:</span>
                      <span className="ml-2 font-mono">{editingProject.projectId}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Aangemaakt:</span>
                      <span className="ml-2">{new Date(editingProject.createdAt).toLocaleDateString('nl-NL')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            Annuleren
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition font-medium disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Opslaan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Opslaan
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
