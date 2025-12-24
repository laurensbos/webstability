import { motion } from 'framer-motion'
import { 
  Package,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Mail,
  Phone
} from 'lucide-react'
import { PACKAGES, getPhaseInfo } from '../../config/packages'
import type { PackageType, ProjectPhase } from '../../config/packages'

interface ProjectPhaseInfoProps {
  project: {
    businessName: string
    contactName: string
    contactEmail: string
    contactPhone?: string
    package: PackageType
    phase: ProjectPhase
    revisionsUsed?: number
    createdAt: string
    estimatedCompletion?: string
  }
  darkMode?: boolean
  onSendReminder?: () => void
  onUpdatePhase?: (phase: ProjectPhase) => void
}

export default function ProjectPhaseInfo({
  project,
  darkMode = true,
  onSendReminder,
  onUpdatePhase
}: ProjectPhaseInfoProps) {
  const pkg = PACKAGES[project.package]
  const phaseInfo = getPhaseInfo(project.package, project.phase)
  const remainingRevisions = Math.max(0, pkg.revisions - (project.revisionsUsed || 0))
  const estimatedDays = pkg.estimatedDays[project.phase]

  // Calculate progress
  const phases: ProjectPhase[] = ['onboarding', 'design', 'feedback', 'revisie', 'payment', 'approval', 'live']
  const currentPhaseIndex = phases.indexOf(project.phase)
  const progressPercent = Math.round((currentPhaseIndex / (phases.length - 1)) * 100)

  // Phase status colors
  const phaseColors: Record<ProjectPhase, string> = {
    onboarding: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    design: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    feedback: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
    revisie: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30',
    payment: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30',
    approval: 'text-pink-500 bg-pink-500/10 border-pink-500/30',
    live: 'text-green-500 bg-green-500/10 border-green-500/30'
  }

  const phaseLabels: Record<ProjectPhase, string> = {
    onboarding: 'Onboarding',
    design: 'Design',
    feedback: 'Feedback',
    revisie: 'Revisie',
    payment: 'Betaling',
    approval: 'Goedkeuring',
    live: 'Live'
  }

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{pkg.icon}</span>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {project.businessName}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {pkg.name} · €{pkg.price}/maand
              </p>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${phaseColors[project.phase]}`}>
            {phaseLabels[project.phase]}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Voortgang</span>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{progressPercent}%</span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full bg-gradient-to-r ${pkg.gradient}`}
            />
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {project.contactName}
            </p>
            <div className="flex items-center gap-4 mt-1">
              <a 
                href={`mailto:${project.contactEmail}`}
                className={`flex items-center gap-1 text-sm ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'}`}
              >
                <Mail className="w-3 h-3" />
                {project.contactEmail}
              </a>
              {project.contactPhone && (
                <a 
                  href={`tel:${project.contactPhone}`}
                  className={`flex items-center gap-1 text-sm ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'}`}
                >
                  <Phone className="w-3 h-3" />
                  {project.contactPhone}
                </a>
              )}
            </div>
          </div>
          {onSendReminder && project.phase !== 'live' && (
            <button
              onClick={onSendReminder}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Herinnering sturen
            </button>
          )}
        </div>
      </div>

      {/* Phase Details */}
      <div className="p-4">
        <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Huidige fase: {phaseInfo.title}
        </h4>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {phaseInfo.description}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <Clock className={`w-4 h-4 mx-auto mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {estimatedDays}d
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Geschat
            </p>
          </div>
          <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <RefreshCw className={`w-4 h-4 mx-auto mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {remainingRevisions}/{pkg.revisions}
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Revisies over
            </p>
          </div>
          <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <Package className={`w-4 h-4 mx-auto mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {pkg.features.length}
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Features
            </p>
          </div>
        </div>

        {/* Client Tasks */}
        {phaseInfo.clientTasks.length > 0 && (
          <div className="mb-4">
            <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Wacht op klant:
            </p>
            <div className="space-y-1">
              {phaseInfo.clientTasks.map((task, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0" />
                  {task}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Phase Update Buttons */}
        {onUpdatePhase && project.phase !== 'live' && (
          <div className="flex gap-2">
            {phases[currentPhaseIndex + 1] && (
              <button
                onClick={() => onUpdatePhase(phases[currentPhaseIndex + 1])}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors bg-gradient-to-r ${pkg.gradient} text-white hover:opacity-90`}
              >
                <span>Naar {phaseLabels[phases[currentPhaseIndex + 1]]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Package Features Footer */}
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <p className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {pkg.name} Features
          </p>
          <div className="flex items-center gap-1">
            {pkg.features.slice(0, 3).map((feature, i) => (
              <span 
                key={i}
                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                {feature.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
