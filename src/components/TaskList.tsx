import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  CheckCircle,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Rocket,
  FileText,
  Palette,
  MessageSquare,
  AlertCircle,
  Star,
  CreditCard,
  RefreshCw
} from 'lucide-react'
import type { ProjectPhase } from '../types/project'

export interface Task {
  id: string
  title: string
  description?: string
  phase: ProjectPhase
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  dueDate?: string
  completedAt?: string
  assignedTo?: 'client' | 'developer'
  priority?: 'low' | 'normal' | 'high'
}

interface TaskListProps {
  tasks: Task[]
  currentPhase: ProjectPhase
  phaseColor: string
  onTaskComplete?: (taskId: string) => void
}

const PHASE_INFO: Record<ProjectPhase, { icon: typeof FileText; label: string; color: string }> = {
  onboarding: { icon: FileText, label: 'Onboarding', color: 'blue' },
  design: { icon: Palette, label: 'Design', color: 'amber' },
  feedback: { icon: MessageSquare, label: 'Feedback', color: 'purple' },
  revisie: { icon: RefreshCw, label: 'Revisie', color: 'cyan' },
  payment: { icon: CreditCard, label: 'Betaling', color: 'indigo' },
  domain: { icon: CheckCircle, label: 'Goedkeuring', color: 'pink' },
  live: { icon: Rocket, label: 'Live', color: 'green' },
}

const STATUS_CONFIG = {
  pending: { 
    icon: Circle, 
    label: 'Te doen', 
    bgColor: 'bg-gray-100', 
    textColor: 'text-gray-600',
    iconColor: 'text-gray-400'
  },
  in_progress: { 
    icon: Clock, 
    label: 'Bezig', 
    bgColor: 'bg-blue-100', 
    textColor: 'text-blue-700',
    iconColor: 'text-blue-500'
  },
  completed: { 
    icon: CheckCircle2, 
    label: 'Afgerond', 
    bgColor: 'bg-green-100', 
    textColor: 'text-green-700',
    iconColor: 'text-green-500'
  },
  blocked: { 
    icon: AlertCircle, 
    label: 'Geblokkeerd', 
    bgColor: 'bg-red-100', 
    textColor: 'text-red-700',
    iconColor: 'text-red-500'
  },
}

export default function TaskList({ 
  tasks, 
  currentPhase, 
  phaseColor,
  onTaskComplete 
}: TaskListProps) {
  const [expandedPhase, setExpandedPhase] = useState<ProjectPhase | null>(currentPhase)

  // Group tasks by phase
  const tasksByPhase = tasks.reduce((acc, task) => {
    if (!acc[task.phase]) acc[task.phase] = []
    acc[task.phase].push(task)
    return acc
  }, {} as Record<ProjectPhase, Task[]>)

  // Calculate progress
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const totalTasks = tasks.length
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Get my tasks (client tasks)
  const myTasks = tasks.filter(t => t.assignedTo === 'client' && t.status !== 'completed')

  // Order of phases
  const phaseOrder: ProjectPhase[] = ['onboarding', 'design', 'feedback', 'payment', 'live']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className={`${phaseColor} p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Project Taken</h3>
              <p className="text-white/80 text-sm">Overzicht van alle stappen</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{progressPercentage}%</p>
            <p className="text-white/80 text-sm">{completedTasks}/{totalTasks} taken</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </div>

      {/* My Tasks (Client) */}
      {myTasks.length > 0 && (
        <div className="p-4 bg-amber-50 border-b border-amber-100">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-amber-500" />
            <h4 className="font-semibold text-amber-800">Jouw actiepunten</h4>
            <span className="ml-auto px-2 py-0.5 bg-amber-200 text-amber-800 text-xs font-bold rounded-full">
              {myTasks.length}
            </span>
          </div>
          <div className="space-y-2">
            {myTasks.slice(0, 3).map((task) => {
              const phaseInfo = PHASE_INFO[task.phase]
              const PhaseIcon = phaseInfo.icon

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-amber-200 shadow-sm"
                >
                  <button
                    onClick={() => onTaskComplete?.(task.id)}
                    className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-amber-400 flex items-center justify-center hover:bg-amber-100 transition"
                  >
                    <Circle className="w-3 h-3 text-amber-400" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-gray-500 truncate">{task.description}</p>
                    )}
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 bg-${phaseInfo.color}-100 text-${phaseInfo.color}-700 text-xs font-medium rounded-lg`}>
                    <PhaseIcon className="w-3 h-3" />
                    {phaseInfo.label}
                  </div>
                </motion.div>
              )
            })}
            {myTasks.length > 3 && (
              <p className="text-center text-sm text-amber-600">
                +{myTasks.length - 3} meer
              </p>
            )}
          </div>
        </div>
      )}

      {/* All Tasks by Phase */}
      <div className="divide-y divide-gray-100">
        {phaseOrder.map((phase) => {
          const phaseTasks = tasksByPhase[phase] || []
          if (phaseTasks.length === 0) return null

          const phaseInfo = PHASE_INFO[phase]
          const PhaseIcon = phaseInfo.icon
          const isExpanded = expandedPhase === phase
          const isCurrentPhase = currentPhase === phase
          const completedInPhase = phaseTasks.filter(t => t.status === 'completed').length
          const allCompleted = completedInPhase === phaseTasks.length

          return (
            <div key={phase}>
              {/* Phase Header */}
              <button
                onClick={() => setExpandedPhase(isExpanded ? null : phase)}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition ${
                  isCurrentPhase ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    allCompleted ? 'bg-green-100' :
                    isCurrentPhase ? `bg-${phaseInfo.color}-100` : 'bg-gray-100'
                  }`}>
                    {allCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <PhaseIcon className={`w-5 h-5 ${
                        isCurrentPhase ? `text-${phaseInfo.color}-600` : 'text-gray-400'
                      }`} />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${
                        isCurrentPhase ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {phaseInfo.label}
                      </span>
                      {isCurrentPhase && (
                        <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs font-bold rounded-full">
                          Huidige fase
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {completedInPhase} van {phaseTasks.length} taken afgerond
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mini progress */}
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${allCompleted ? 'bg-green-500' : 'bg-blue-500'} rounded-full transition-all`}
                      style={{ width: `${(completedInPhase / phaseTasks.length) * 100}%` }}
                    />
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Tasks */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-2">
                      {phaseTasks.map((task, index) => {
                        const statusConfig = STATUS_CONFIG[task.status]
                        const StatusIcon = statusConfig.icon

                        return (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center gap-3 p-3 rounded-xl border ${
                              task.status === 'completed' 
                                ? 'bg-gray-50 border-gray-200' 
                                : 'bg-white border-gray-200'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${statusConfig.bgColor}`}>
                              <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium ${
                                task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                              }`}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-sm text-gray-500 truncate">{task.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {task.assignedTo === 'client' && task.status !== 'completed' && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg">
                                  Jouw actie
                                </span>
                              )}
                              <span className={`px-2 py-1 text-xs font-medium rounded-lg ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                                {statusConfig.label}
                              </span>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {tasks.length === 0 && (
        <div className="p-8 text-center text-gray-400">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium text-gray-600">Nog geen taken</p>
          <p className="text-sm">Taken worden toegevoegd zodra je project start</p>
        </div>
      )}
    </motion.div>
  )
}
