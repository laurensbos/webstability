/**
 * CustomerTaskChecklist - Interactieve taken checklist voor klanten
 * 
 * Toont fase-specifieke taken die de klant moet afvinken.
 * Taken worden lokaal opgeslagen en gesynchroniseerd met de server.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react'

// Fase types
type ProjectPhase = 'onboarding' | 'design' | 'feedback' | 'revisie' | 'payment' | 'approval' | 'live'

interface Task {
  id: string
  label: string
  description?: string
  required: boolean
  link?: string
  linkLabel?: string
}

interface PhaseTaskConfig {
  title: string
  description: string
  tasks: Task[]
  estimatedMinutes: number
}

// Taken per fase
const PHASE_TASKS: Record<ProjectPhase, PhaseTaskConfig> = {
  onboarding: {
    title: 'Onboarding afronden',
    description: 'Vul alle gegevens in zodat we kunnen starten',
    estimatedMinutes: 15,
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
    description: 'We werken aan je website. Je hoeft nu niets te doen.',
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
      { id: 'answer-questions', label: 'Beantwoord de feedbackvragen', description: 'Geef aan wat je vindt', required: true },
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
      { id: 'choose-payment', label: 'Kies betaalmethode', description: 'iDEAL, creditcard of anders', required: true },
      { id: 'complete-payment', label: 'Voltooi de betaling', description: 'Na betaling gaan we naar de laatste stap', required: true },
    ]
  },
  approval: {
    title: 'Laatste goedkeuring',
    description: 'Controleer alles voor de livegang',
    estimatedMinutes: 10,
    tasks: [
      { id: 'check-content', label: 'Controleer alle content', description: 'Laatste check op teksten en afbeeldingen', required: true },
      { id: 'check-contact', label: 'Controleer contactgegevens', description: 'E-mail, telefoon, adres correct?', required: true },
      { id: 'confirm-domain', label: 'Bevestig je domeinnaam', description: 'Op welk adres komt de website?', required: true },
      { id: 'accept-terms', label: 'Accepteer de voorwaarden', description: 'Lees en accepteer de algemene voorwaarden', required: true },
      { id: 'give-approval', label: 'Geef je definitieve akkoord', description: 'Hierna gaan we live!', required: true },
    ]
  },
  live: {
    title: 'Je website is live! 🎉',
    description: 'Beheer je website en vraag wijzigingen aan',
    estimatedMinutes: 0,
    tasks: [
      { id: 'share-website', label: 'Deel je website', description: 'Laat iedereen weten dat je online bent', required: false },
      { id: 'add-signature', label: 'Voeg toe aan e-mail handtekening', description: 'Zet je website link in je e-mails', required: false },
      { id: 'request-reviews', label: 'Vraag klanten om reviews', description: 'Reviews helpen je online zichtbaarheid', required: false },
    ]
  }
}

interface CustomerTaskChecklistProps {
  projectId: string
  currentPhase: ProjectPhase
  completedTasks?: string[]
  onTaskComplete?: (taskId: string, completed: boolean) => Promise<void>
  onAllTasksComplete?: () => void
  darkMode?: boolean
  compact?: boolean
}

export default function CustomerTaskChecklist({
  projectId,
  currentPhase,
  completedTasks: externalCompletedTasks,
  onTaskComplete,
  onAllTasksComplete,
  darkMode = true,
  compact = false
}: CustomerTaskChecklistProps) {
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(true)
  const [isAnimating, setIsAnimating] = useState<string | null>(null)

  const phaseConfig = PHASE_TASKS[currentPhase]
  const tasks = phaseConfig.tasks

  // Load completed tasks from localStorage or external prop
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

  // Save to localStorage when tasks change
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
    
    // Animate
    setIsAnimating(taskId)
    setTimeout(() => setIsAnimating(null), 500)

    // Update state
    if (isCompleting) {
      setCompletedTasks(prev => [...prev, taskId])
    } else {
      setCompletedTasks(prev => prev.filter(id => id !== taskId))
    }

    // Notify parent
    if (onTaskComplete) {
      await onTaskComplete(taskId, isCompleting)
    }
  }

  const completedCount = tasks.filter(t => completedTasks.includes(t.id)).length
  const requiredCount = tasks.filter(t => t.required).length
  const requiredCompletedCount = tasks.filter(t => t.required && completedTasks.includes(t.id)).length
  const progress = requiredCount > 0 ? Math.round((requiredCompletedCount / requiredCount) * 100) : 100

  // Compact mode for sidebar
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
            className={`h-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
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
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-4 flex items-center justify-between ${
          darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
        } transition-colors`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${
            progress === 100 
              ? 'bg-green-500/20 text-green-500' 
              : 'bg-blue-500/20 text-blue-500'
          }`}>
            {progress === 100 ? (
              <Sparkles className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>
          <div className="text-left">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {phaseConfig.title}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {progress === 100 ? 'Alle taken afgerond!' : `${requiredCompletedCount} van ${requiredCount} verplichte taken`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {phaseConfig.estimatedMinutes > 0 && (
            <div className={`flex items-center gap-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <Clock className="w-4 h-4" />
              <span>~{phaseConfig.estimatedMinutes} min</span>
            </div>
          )}
          {isExpanded ? (
            <ChevronUp className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          )}
        </div>
      </button>

      {/* Progress bar */}
      <div className={`h-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
        />
      </div>

      {/* Tasks */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {tasks.map((task, index) => {
                const isCompleted = completedTasks.includes(task.id)
                const isAnimatingThis = isAnimating === task.id

                return (
                  <motion.button
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleToggleTask(task.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                      isCompleted
                        ? darkMode 
                          ? 'bg-green-500/10 border border-green-500/30' 
                          : 'bg-green-50 border border-green-200'
                        : darkMode
                          ? 'bg-gray-700/50 hover:bg-gray-700 border border-transparent'
                          : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
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
                            <CheckCircle2 className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="unchecked"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className={darkMode ? 'text-gray-500' : 'text-gray-400'}
                          >
                            <Circle className="w-5 h-5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${
                          isCompleted 
                            ? 'text-green-600 dark:text-green-400 line-through' 
                            : darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {task.label}
                        </span>
                        {task.required && !isCompleted && (
                          <span className="text-xs text-red-500 font-medium">Verplicht</span>
                        )}
                      </div>
                      {task.description && (
                        <p className={`text-sm mt-0.5 ${
                          isCompleted
                            ? 'text-green-600/70 dark:text-green-400/70'
                            : darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Link arrow */}
                    {task.link && !isCompleted && (
                      <ArrowRight className={`w-4 h-4 flex-shrink-0 ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Footer hint */}
            {progress < 100 && (
              <div className={`px-4 pb-4`}>
                <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Klik op een taak om deze af te vinken
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
