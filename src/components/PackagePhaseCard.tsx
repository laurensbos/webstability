import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  CheckCircle2, 
  Clock, 
  Lightbulb, 
  ChevronRight,
  Package,
  RefreshCw,
  Upload,
  ExternalLink
} from 'lucide-react'
import { getPackage, getPhaseInfo, getRemainingRevisions } from '../config/packages'
import type { PackageType, ProjectPhase } from '../config/packages'

interface PackagePhaseCardProps {
  packageType: PackageType
  currentPhase: ProjectPhase
  completedTasks?: string[]
  usedRevisions?: number
  darkMode?: boolean
  onTaskClick?: (taskId: string) => void
  projectId?: string
  googleDriveUrl?: string
}

export default function PackagePhaseCard({
  packageType,
  currentPhase,
  completedTasks = [],
  usedRevisions = 0,
  darkMode = true,
  onTaskClick,
  projectId,
  googleDriveUrl
}: PackagePhaseCardProps) {
  const { t } = useTranslation()
  const pkg = getPackage(packageType)
  const phaseInfo = getPhaseInfo(packageType, currentPhase)
  const remainingRevisions = getRemainingRevisions(packageType, usedRevisions)
  const estimatedDays = pkg.estimatedDays[currentPhase]

  // Phase-specific colors
  const phaseColors: Record<ProjectPhase, { bg: string; border: string; icon: string }> = {
    onboarding: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'text-blue-400' },
    design: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: 'text-amber-400' },
    feedback: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: 'text-purple-400' },
    revisie: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: 'text-cyan-400' },
    payment: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', icon: 'text-indigo-400' },
    domain: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', icon: 'text-pink-400' },
    live: { bg: 'bg-green-500/10', border: 'border-green-500/30', icon: 'text-green-400' }
  }

  const colors = phaseColors[currentPhase]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border overflow-hidden ${colors.bg} ${colors.border}`}
    >
      {/* Header - Compacter op mobiel */}
      <div className={`p-3 sm:p-4 border-b ${colors.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${colors.bg}`}>
              <Package className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.icon}`} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg">{pkg.icon}</span>
                <h3 className={`font-semibold text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {pkg.name}
                </h3>
              </div>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                €{pkg.price}/maand
              </p>
            </div>
          </div>

          {/* Revisions Badge - Only show in feedback/revisie phase */}
          {(currentPhase === 'feedback' || currentPhase === 'revisie') && (
            <div className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${colors.icon}`} />
              <span className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {remainingRevisions} {remainingRevisions !== 1 ? t('packagePhaseCard.revisions') : t('packagePhaseCard.revision')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Phase Info - Compacter op mobiel */}
      <div className="p-3 sm:p-4">
        <h4 className={`font-semibold text-sm sm:text-base mb-1 sm:mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {phaseInfo.title}
        </h4>
        <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {phaseInfo.description}
        </p>

        {/* Estimated Time */}
        {estimatedDays > 0 && currentPhase !== 'live' && (
          <div className={`flex items-center gap-2 mb-3 sm:mb-4 text-xs sm:text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{t('packagePhaseCard.estimatedTime')}: {estimatedDays} {estimatedDays !== 1 ? t('packagePhaseCard.workdays') : t('packagePhaseCard.workday')}</span>
          </div>
        )}

        {/* Client Tasks - Hidden on mobile for cleaner look, shown on desktop */}
        {phaseInfo.clientTasks.length > 0 && (
          <div className="mb-3 sm:mb-4 hidden sm:block">
            <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('packagePhaseCard.yourTasks')}:
            </h5>
            <div className="space-y-2">
              {phaseInfo.clientTasks.map((task, index) => {
                const taskId = `${currentPhase}-task-${index}`
                const isCompleted = completedTasks.includes(taskId)
                
                // Determine link based on task content and phase
                const getTaskLink = () => {
                  if (currentPhase === 'onboarding' && projectId) {
                    // All onboarding tasks link to the intake page
                    return `/intake/${projectId}`
                  }
                  if (task.toLowerCase().includes('upload') && googleDriveUrl) {
                    return googleDriveUrl
                  }
                  return null
                }
                
                const taskLink = getTaskLink()
                const isExternal = taskLink?.startsWith('http')
                
                const TaskWrapper = taskLink 
                  ? isExternal ? 'a' : Link 
                  : 'button'
                
                const taskProps = taskLink
                  ? isExternal 
                    ? { href: taskLink, target: '_blank', rel: 'noopener noreferrer' }
                    : { to: taskLink }
                  : { onClick: () => onTaskClick?.(taskId) }

                return (
                  <TaskWrapper
                    key={index}
                    {...taskProps as any}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors active:scale-[0.98] ${
                      isCompleted
                        ? 'bg-green-500/10 border border-green-500/30'
                        : darkMode 
                          ? 'bg-gray-800/50 hover:bg-gray-800' 
                          : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                        darkMode ? 'border-gray-600' : 'border-gray-300'
                      }`} />
                    )}
                    <span className={`text-sm flex-1 ${
                      isCompleted 
                        ? 'text-green-500 line-through' 
                        : darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {task}
                    </span>
                    {!isCompleted && (
                      isExternal ? (
                        <ExternalLink className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      ) : (
                        <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      )
                    )}
                  </TaskWrapper>
                )
              })}
            </div>
          </div>
        )}

        {/* Upload Button - Only in onboarding phase with drive URL - Hidden on mobile (already in QuickActions) */}
        {currentPhase === 'onboarding' && googleDriveUrl && (
          <a
            href={googleDriveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 mb-3 sm:mb-4 rounded-xl font-medium text-xs sm:text-sm transition active:scale-[0.98] ${
              darkMode 
                ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            {t('packagePhaseCard.uploadFiles')}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Tips - Compacter op mobiel */}
        {phaseInfo.tips.length > 0 && (
          <div className={`p-2.5 sm:p-3 rounded-xl ${
            darkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
          }`}>
            <div className="flex items-start gap-2">
              <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className={`text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                  {t('packagePhaseCard.tips')}
                </p>
                <ul className="space-y-0.5 sm:space-y-1">
                  {phaseInfo.tips.slice(0, 2).map((tip, index) => (
                    <li key={index} className={`text-xs sm:text-sm ${darkMode ? 'text-amber-200/70' : 'text-amber-600'}`}>
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Package Features Teaser - Only in live phase, compacter op mobiel */}
      {currentPhase === 'live' && (
        <div className={`p-3 sm:p-4 border-t ${colors.border}`}>
          <p className={`text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('packagePhaseCard.includedInPackage')}:
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {pkg.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className={`px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs ${
                  darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {feature}
              </span>
            ))}
            {pkg.features.length > 3 && (
              <span className={`px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs ${colors.icon}`}>
                {t('packagePhaseCard.andMore', { count: pkg.features.length - 3 })}
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
