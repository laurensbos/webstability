/**
 * Developer Dashboard - Project Card
 * Compact card for Kanban board
 */

import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  MessageSquare, 
  Clock, 
  ExternalLink,
  AlertCircle
} from 'lucide-react'
import type { Project } from './types'
import { PACKAGE_CONFIG, SERVICE_CONFIG } from './types'

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const { t } = useTranslation()
  const unreadMessages = project.messages.filter(m => !m.read && m.from === 'client').length
  const hasPendingPayment = project.phase === 'feedback' && project.paymentStatus !== 'paid'
  const hasPendingFeedback = project.feedbackHistory?.some(f => f.status === 'pending')
  const packageInfo = PACKAGE_CONFIG[project.package]
  const serviceInfo = project.serviceType ? SERVICE_CONFIG[project.serviceType] : null
  
  // Calculate days in current phase
  const daysInPhase = Math.floor((Date.now() - new Date(project.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
  
  return (
    <motion.div
      layout
      layoutId={project.id}
      onClick={onClick}
      className="relative bg-gradient-to-br from-gray-800 to-gray-850 rounded-2xl p-4 cursor-pointer transition-all duration-200 border-2 border-gray-700/50 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 group overflow-hidden"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white truncate group-hover:text-emerald-400 transition">
            {project.businessName}
          </h3>
          <p className="text-xs text-gray-500 truncate">{project.contactName}</p>
        </div>
        
        {/* Badges */}
        <div className="flex items-center gap-1.5 ml-2">
          {serviceInfo && (
            <span className="text-sm p-1.5 bg-gray-700/50 rounded-lg" title={serviceInfo.label}>{serviceInfo.emoji}</span>
          )}
          <span className="text-sm p-1.5 bg-gray-700/50 rounded-lg" title={packageInfo.name}>{packageInfo.emoji}</span>
        </div>
      </div>

      {/* Alerts */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {unreadMessages > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 rounded-lg text-xs font-semibold border border-blue-500/30">
            <MessageSquare className="w-3 h-3" />
            {unreadMessages}
          </span>
        )}
        
        {hasPendingPayment && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 rounded-lg text-xs font-semibold animate-pulse border border-amber-500/30">
            💳 {t('developerDashboard.urgency.waitingForPayment')}
          </span>
        )}
        
        {hasPendingFeedback && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 rounded-lg text-xs font-semibold border border-purple-500/30">
            <AlertCircle className="w-3 h-3" />
            Feedback
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-gray-500 font-medium">
          <Clock className="w-3.5 h-3.5" />
          {daysInPhase === 0 ? t('developerDashboard.projectCard.today') : `${daysInPhase}d`}
        </div>
        
        <div className="flex items-center gap-3">
          {project.designPreviewUrl && (
            <a 
              href={project.designPreviewUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-gray-500 hover:text-purple-400 transition p-1 hover:bg-purple-500/10 rounded-lg"
              title="Design preview"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <span className="text-gray-400 font-semibold px-2 py-0.5 bg-gray-700/50 rounded-lg">€{packageInfo.price}/m</span>
        </div>
      </div>
    </motion.div>
  )
}
