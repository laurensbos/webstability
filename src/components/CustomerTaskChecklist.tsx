/**
 * CustomerTaskChecklist - Interactieve taken checklist voor klanten
 * 
 * Mobile-first design met:
 * - Uitvouwbare taken per fase
 * - Inline upload knop met info tooltip
 * - Geen popups, alles inline
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Clock,
  Upload,
  Info,
  ExternalLink,
  X
} from 'lucide-react'

// Fase types
type ProjectPhase = 'onboarding' | 'design' | 'feedback' | 'revisie' | 'payment' | 'domain' | 'live'

interface Task {
  id: string
  label: string
  description?: string
  required: boolean
}

interface PhaseTaskConfig {
  title: string
  description: string
  tasks: Task[]
  estimatedMinutes: number
  showUpload?: boolean // Show upload button for this phase
}

// Taken per fase
const PHASE_TASKS: Record<ProjectPhase, PhaseTaskConfig> = {
  onboarding: {
    title: 'Onboarding afronden',
    description: 'Vul alle gegevens in zodat we kunnen starten',
    estimatedMinutes: 15,
    showUpload: true,
    tasks: [
      { id: 'business-info', label: 'Bedrijfsgegevens invullen', description: 'Naam, adres, KVK, BTW', required: true },
      { id: 'contact-info', label: 'Contactgegevens invullen', description: 'E-mail, telefoon', required: true },
      { id: 'logo-upload', label: 'Logo uploaden', description: 'Of aangeven dat je er geen hebt', required: true },
      { id: 'content-text', label: 'Teksten aanleveren', description: 'Beschrijving van je bedrijf, diensten', required: true },
      { id: 'photos-upload', label: 'Foto\'s uploaden', description: 'Minimaal 3-5 foto\'s van je werk/team', required: false },
      { id: 'preferences', label: 'Voorkeuren aangeven', description: 'Kleuren, stijl, voorbeelden', required: false },
    ]
  },
  design: {
    title: 'Wachten op ontwerp',
    description: 'We werken aan je website',
    estimatedMinutes: 0,
    tasks: [
      { id: 'wait-design', label: 'Ontwerp wordt gemaakt', description: 'Je ontvangt een e-mail wanneer het klaar is', required: false },
    ]
  },
  feedback: {
    title: 'Feedback geven',
    description: 'Bekijk het ontwerp en geef je feedback',
    estimatedMinutes: 20,
    tasks: [
      { id: 'view-desktop', label: 'Bekijk de desktop versie', description: 'Open de preview op je computer', required: true },
      { id: 'view-mobile', label: 'Bekijk de mobiele versie', description: 'Check hoe het eruitziet op je telefoon', required: true },
      { id: 'check-text', label: 'Controleer alle teksten', description: 'Zijn er geen tikfouten? Klopt alles?', required: true },
      { id: 'check-images', label: 'Controleer de afbeeldingen', description: 'Zijn de juiste foto\'s gebruikt?', required: true },
      { id: 'submit-feedback', label: 'Verstuur je feedback', description: 'Of keur het ontwerp goed', required: true },
    ]
  },
  revisie: {
    title: 'Revisie in behandeling',
    description: 'We verwerken je feedback',
    estimatedMinutes: 0,
    tasks: [
      { id: 'wait-revision', label: 'Aanpassingen worden gemaakt', description: 'Je ontvangt een e-mail wanneer het klaar is', required: false },
    ]
  },
  payment: {
    title: 'Betaling afronden',
    description: 'Rond de betaling af om live te gaan',
    estimatedMinutes: 5,
    tasks: [
      { id: 'review-invoice', label: 'Controleer de factuur', description: 'Bekijk het bedrag en de voorwaarden', required: true },
      { id: 'complete-payment', label: 'Voltooi de betaling', description: 'Na betaling gaan we naar de laatste stap', required: true },
    ]
  },
  domain: {
    title: 'Domein verhuizen',
    description: 'We configureren je domein voor livegang',
    estimatedMinutes: 15,
    tasks: [
      { id: 'provide-authcode', label: 'Deel je autorisatiecode', description: 'Vraag deze op bij je huidige provider', required: true },
      { id: 'approve-transfer', label: 'Keur de verhuizing goed', description: 'Je ontvangt een e-mail om te bevestigen', required: true },
      { id: 'wait-dns', label: 'DNS propagatie', description: 'Dit kan 1-48 uur duren', required: false },
    ]
  },
  live: {
    title: 'Je website is live! 🎉',
    description: 'Beheer je website',
    estimatedMinutes: 0,
    tasks: [
      { id: 'share-website', label: 'Deel je website', description: 'Laat iedereen weten dat je online bent', required: false },
      { id: 'request-reviews', label: 'Vraag klanten om reviews', description: 'Reviews helpen je online zichtbaarheid', required: false },
    ]
  }
}

// Upload info items
const UPLOAD_INFO = [
  { icon: '🖼️', label: 'Logo', desc: 'PNG of SVG formaat' },
  { icon: '📸', label: "Foto's", desc: 'Hoge kwaliteit foto\'s' },
  { icon: '📄', label: 'Teksten', desc: 'Word of PDF documenten' },
  { icon: '🎨', label: 'Huisstijl', desc: 'Kleuren & fonts (optioneel)' },
]

interface CustomerTaskChecklistProps {
  projectId: string
  currentPhase: ProjectPhase
  completedTasks?: string[]
  onTaskComplete?: (taskId: string, completed: boolean) => Promise<void>
  onAllTasksComplete?: () => void
  darkMode?: boolean
  compact?: boolean
  googleDriveUrl?: string
}

export default function CustomerTaskChecklist({
  projectId,
  currentPhase,
  completedTasks: externalCompletedTasks,
  onTaskComplete,
  onAllTasksComplete,
  darkMode = true,
  compact = false,
  googleDriveUrl
}: CustomerTaskChecklistProps) {
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(true)
  const [isAnimating, setIsAnimating] = useState<string | null>(null)
  const [showUploadInfo, setShowUploadInfo] = useState(false)

  const phaseConfig = PHASE_TASKS[currentPhase]
  const tasks = phaseConfig.tasks

  // Load completed tasks
  useEffect(() => {
    if (externalCompletedTasks) {
      setCompletedTasks(externalCompletedTasks)
    } else {
      const stored = localStorage.getItem(`tasks-${projectId}-${currentPhase}`)
      if (stored) {
        setCompletedTasks(JSON.parse(stored))
      }
    }
  }, [projectId, currentPhase, externalCompletedTasks])

  // Save to localStorage
  useEffect(() => {
    if (!externalCompletedTasks) {
      localStorage.setItem(`tasks-${projectId}-${currentPhase}`, JSON.stringify(completedTasks))
    }
  }, [completedTasks, projectId, currentPhase, externalCompletedTasks])

  // Check if all required tasks are complete
  useEffect(() => {
    const requiredTasks = tasks.filter(t => t.required)
    const allRequiredComplete = requiredTasks.every(t => completedTasks.includes(t.id))
    if (allRequiredComplete && requiredTasks.length > 0 && onAllTasksComplete) {
      onAllTasksComplete()
    }
  }, [completedTasks, tasks, onAllTasksComplete])

  const handleToggleTask = async (taskId: string) => {
    const isCompleting = !completedTasks.includes(taskId)
    
    setIsAnimating(taskId)
    setTimeout(() => setIsAnimating(null), 500)

    if (isCompleting) {
      setCompletedTasks(prev => [...prev, taskId])
    } else {
      setCompletedTasks(prev => prev.filter(id => id !== taskId))
    }

    if (onTaskComplete) {
      await onTaskComplete(taskId, isCompleting)
    }
  }

  const completedCount = tasks.filter(t => completedTasks.includes(t.id)).length
  const requiredCount = tasks.filter(t => t.required).length
  const requiredCompletedCount = tasks.filter(t => t.required && completedTasks.includes(t.id)).length
  const progress = requiredCount > 0 ? Math.round((requiredCompletedCount / requiredCount) * 100) : 100

  // Compact mode
  if (compact) {
    return (
      <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {phaseConfig.title}
          </span>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {completedCount}/{tasks.length}
          </span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full ${progress === 100 ? 'bg-green-500' : 'bg-amber-500'}`}
          />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/30' 
          : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
      }`}
    >
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            progress === 100 
              ? 'bg-green-500/20 text-green-500' 
              : 'bg-amber-500/20 text-amber-500'
          }`}>
            {progress === 100 ? (
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <span className="text-lg sm:text-xl font-bold">{requiredCompletedCount}</span>
            )}
          </div>
          <div>
            <h3 className={`font-semibold text-base sm:text-lg ${
              progress === 100 
                ? darkMode ? 'text-green-400' : 'text-green-600'
                : darkMode ? 'text-amber-400' : 'text-amber-600'
            }`}>
              {phaseConfig.title}
            </h3>
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {progress === 100 
                ? '✓ Alle taken afgerond!' 
                : `${requiredCompletedCount} van ${requiredCount} verplicht`
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {phaseConfig.estimatedMinutes > 0 && (
            <div className={`hidden sm:flex items-center gap-1.5 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <Clock className="w-3.5 h-3.5" />
              <span>~{phaseConfig.estimatedMinutes} min</span>
            </div>
          )}
          <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
            {isExpanded ? (
              <ChevronUp className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            ) : (
              <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            )}
          </div>
        </div>
      </button>

      {/* Progress bar */}
      <div className={`h-1 ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${progress === 100 ? 'bg-green-500' : 'bg-amber-500'}`}
        />
      </div>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Tasks list */}
            <div className="p-3 sm:p-4 space-y-2">
              {tasks.map((task, index) => {
                const isCompleted = completedTasks.includes(task.id)
                const isAnimatingThis = isAnimating === task.id

                return (
                  <motion.button
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleToggleTask(task.id)}
                    className={`w-full flex items-start gap-3 p-3 sm:p-4 rounded-xl text-left transition-all active:scale-[0.98] ${
                      isCompleted
                        ? darkMode 
                          ? 'bg-green-500/15 border border-green-500/30' 
                          : 'bg-green-100 border border-green-300'
                        : darkMode
                          ? 'bg-gray-900/50 hover:bg-gray-900 border border-gray-700/50'
                          : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="flex-shrink-0 mt-0.5">
                      <AnimatePresence mode="wait">
                        {isCompleted ? (
                          <motion.div
                            key="checked"
                            initial={{ scale: 0 }}
                            animate={{ scale: isAnimatingThis ? [1, 1.3, 1] : 1 }}
                            exit={{ scale: 0 }}
                            className="text-green-500"
                          >
                            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="unchecked"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className={darkMode ? 'text-gray-600' : 'text-gray-400'}
                          >
                            <Circle className="w-5 h-5 sm:w-6 sm:h-6" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-medium text-sm sm:text-base ${
                          isCompleted 
                            ? 'text-green-500 line-through' 
                            : darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {task.label}
                        </span>
                        {task.required && !isCompleted && (
                          <span className="text-[10px] sm:text-xs text-red-500 font-medium bg-red-500/10 px-1.5 py-0.5 rounded">
                            Verplicht
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className={`text-xs sm:text-sm mt-0.5 ${
                          isCompleted
                            ? 'text-green-500/70'
                            : darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Upload Section - Only for onboarding phase with drive URL */}
            {phaseConfig.showUpload && googleDriveUrl && (
              <div className={`mx-3 sm:mx-4 mb-3 sm:mb-4 p-3 sm:p-4 rounded-xl border ${
                darkMode ? 'bg-gray-900/50 border-gray-700/50' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Upload className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Bestanden uploaden
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowUploadInfo(!showUploadInfo)
                    }}
                    className={`p-1.5 rounded-lg transition ${
                      showUploadInfo
                        ? darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                        : darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                    }`}
                    title="Wat moet ik uploaden?"
                  >
                    {showUploadInfo ? <X className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                  </button>
                </div>

                {/* Upload info tooltip */}
                <AnimatePresence>
                  {showUploadInfo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-3"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {UPLOAD_INFO.map((item, i) => (
                          <div 
                            key={i} 
                            className={`p-2 sm:p-3 rounded-lg ${
                              darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                            }`}
                          >
                            <span className="text-base sm:text-lg">{item.icon}</span>
                            <p className={`text-xs sm:text-sm font-medium mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {item.label}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Upload button */}
                <a
                  href={googleDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-sm sm:text-base transition active:scale-[0.98] ${
                    darkMode 
                      ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload naar Google Drive
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Footer hint */}
            {progress < 100 && (
              <p className={`text-[10px] sm:text-xs text-center pb-3 sm:pb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                Tik op een taak om af te vinken
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
