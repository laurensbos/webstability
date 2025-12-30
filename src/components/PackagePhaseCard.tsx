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
  const phaseInfoFromPackage = getPhaseInfo(packageType, currentPhase)
  const remainingRevisions = getRemainingRevisions(packageType, usedRevisions)
  const estimatedDays = pkg.estimatedDays[currentPhase]

  // Get translated phase info - fallback to package config if translation doesn't exist
  const phaseInfo = {
    title: t(`packagePhaseCard.phases.${currentPhase}.title`, phaseInfoFromPackage.title),
    description: t(`packagePhaseCard.phases.${currentPhase}.description`, phaseInfoFromPackage.description),
    clientTasks: t(`packagePhaseCard.phases.${currentPhase}.clientTasks`, { returnObjects: true, defaultValue: phaseInfoFromPackage.clientTasks }) as string[],
    tips: t(`packagePhaseCard.phases.${currentPhase}.tips`, { returnObjects: true, defaultValue: phaseInfoFromPackage.tips }) as string[]
  }

  // Phase-specific colors - Enhanced with gradients
  const phaseColors: Record<ProjectPhase, { bg: string; border: string; icon: string; gradient: string; shadow: string }> = {
    onboarding: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'text-blue-400', gradient: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-500/25' },
    design: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: 'text-amber-400', gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/25' },
    feedback: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: 'text-purple-400', gradient: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-500/25' },
    revisie: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: 'text-cyan-400', gradient: 'from-cyan-500 to-blue-500', shadow: 'shadow-cyan-500/25' },
    payment: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', icon: 'text-indigo-400', gradient: 'from-indigo-500 to-purple-500', shadow: 'shadow-indigo-500/25' },
    domain: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', icon: 'text-pink-400', gradient: 'from-pink-500 to-rose-500', shadow: 'shadow-pink-500/25' },
    live: { bg: 'bg-green-500/10', border: 'border-green-500/30', icon: 'text-green-400', gradient: 'from-green-500 to-emerald-500', shadow: 'shadow-green-500/25' }
  }

  const colors = phaseColors[currentPhase]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative rounded-2xl border-2 overflow-hidden backdrop-blur-sm ${colors.bg} ${colors.border} shadow-lg ${colors.shadow}`}
    >
      {/* Gradient accent line at top */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colors.gradient}`} />
      
      {/* Decorative blur orb */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${colors.gradient} opacity-20 rounded-full blur-3xl pointer-events-none`} />
      
      {/* Header - Enhanced */}
      <div className={`relative p-4 sm:p-5 border-b ${colors.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg ${colors.shadow}`}>
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">{pkg.icon}</span>
                <h3 className={`font-bold text-base sm:text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {pkg.name}
                </h3>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                €{pkg.price}{t('packagePhaseCard.perMonth')}
              </p>
            </div>
          </div>

          {/* Revisions Badge - Only show in feedback/revisie phase - Enhanced */}
          {(currentPhase === 'feedback' || currentPhase === 'revisie') && (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl ${
                darkMode ? 'bg-gray-800/80' : 'bg-white shadow-md'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${colors.icon}`} />
              <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {remainingRevisions} {remainingRevisions !== 1 ? t('packagePhaseCard.revisions') : t('packagePhaseCard.revision')}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Phase Info - Enhanced */}
      <div className="relative p-4 sm:p-5">
        <h4 className={`font-bold text-base sm:text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {phaseInfo.title}
        </h4>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {phaseInfo.description}
        </p>

        {/* Estimated Time - Enhanced */}
        {estimatedDays > 0 && currentPhase !== 'live' && (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4 ${
            darkMode ? 'bg-gray-800/50' : 'bg-white shadow-sm'
          }`}>
            <Clock className={`w-4 h-4 ${colors.icon}`} />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('packagePhaseCard.estimatedTime')}: {estimatedDays} {estimatedDays !== 1 ? t('packagePhaseCard.workdays') : t('packagePhaseCard.workday')}
            </span>
          </div>
        )}

        {/* Client Tasks - Hidden on mobile for cleaner look, shown on desktop - Enhanced */}
        {phaseInfo.clientTasks.length > 0 && (
          <div className="mb-4 hidden sm:block">
            <h5 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('packagePhaseCard.yourTasks')}:
            </h5>
            <div className="space-y-2.5">
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
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 2 }}
                  >
                    <TaskWrapper
                      {...taskProps as any}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all active:scale-[0.98] ${
                        isCompleted
                          ? 'bg-green-500/15 border-2 border-green-500/30'
                          : darkMode 
                            ? 'bg-gray-800/60 hover:bg-gray-800 border-2 border-transparent hover:border-gray-700' 
                            : 'bg-white hover:bg-gray-50 border-2 border-gray-100 hover:border-gray-200 shadow-sm'
                      }`}
                    >
                      {isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md shadow-green-500/25">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${
                          darkMode ? 'border-gray-600' : 'border-gray-300'
                        }`} />
                      )}
                      <span className={`text-sm font-medium flex-1 ${
                        isCompleted 
                          ? 'text-green-500 line-through' 
                          : darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {task}
                      </span>
                      {!isCompleted && (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                        }`}>
                          {isExternal ? (
                            <ExternalLink className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          ) : (
                            <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          )}
                        </div>
                      )}
                    </TaskWrapper>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Upload Button - Only in onboarding phase with drive URL - Enhanced */}
        {currentPhase === 'onboarding' && googleDriveUrl && (
          <motion.a
            href={googleDriveUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`hidden sm:flex items-center justify-center gap-2.5 w-full py-3 mb-4 rounded-xl font-semibold text-sm transition shadow-lg ${
              darkMode 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-green-500/25' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-green-500/25'
            }`}
          >
            <Upload className="w-4 h-4" />
            {t('packagePhaseCard.uploadFiles')}
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.a>
        )}

        {/* Tips - Enhanced */}
        {phaseInfo.tips.length > 0 && (
          <div className={`p-4 rounded-xl border-2 ${
            darkMode 
              ? 'bg-amber-500/10 border-amber-500/25' 
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-500/25">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className={`text-sm font-bold mb-1.5 ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                  {t('packagePhaseCard.tips')}
                </p>
                <ul className="space-y-1">
                  {phaseInfo.tips.slice(0, 2).map((tip, index) => (
                    <li key={index} className={`text-sm ${darkMode ? 'text-amber-200/70' : 'text-amber-600'}`}>
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Package Features Teaser - Only in live phase - Enhanced */}
      {currentPhase === 'live' && (
        <div className={`relative p-4 sm:p-5 border-t ${colors.border}`}>
          <p className={`text-sm font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('packagePhaseCard.includedInPackage')}:
          </p>
          <div className="flex flex-wrap gap-2">
            {pkg.features.slice(0, 3).map((feature, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  darkMode ? 'bg-gray-800/80 text-gray-300' : 'bg-white text-gray-600 shadow-sm'
                }`}
              >
                {feature}
              </motion.span>
            ))}
            {pkg.features.length > 3 && (
              <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${colors.icon} ${colors.bg}`}>
                {t('packagePhaseCard.andMore', { count: pkg.features.length - 3 })}
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
