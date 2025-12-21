/**
 * Developer Dashboard - Project Card
 * Compact card for Kanban board
 */

import { motion } from 'framer-motion'
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
  const unreadMessages = project.messages.filter(m => !m.read && m.from === 'client').length
  const hasPendingPayment = project.phase === 'design_approved' && project.paymentStatus !== 'paid'
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
      className="bg-gray-800 rounded-xl p-4 cursor-pointer hover:bg-gray-750 transition border border-gray-700/50 hover:border-gray-600 group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate group-hover:text-emerald-400 transition">
            {project.businessName}
          </h3>
          <p className="text-xs text-gray-500 truncate">{project.contactName}</p>
        </div>
        
        {/* Badges */}
        <div className="flex items-center gap-1 ml-2">
          {serviceInfo && (
            <span className="text-sm" title={serviceInfo.label}>{serviceInfo.emoji}</span>
          )}
          <span className="text-sm" title={packageInfo.name}>{packageInfo.emoji}</span>
        </div>
      </div>

      {/* Alerts */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {unreadMessages > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
            <MessageSquare className="w-3 h-3" />
            {unreadMessages}
          </span>
        )}
        
        {hasPendingPayment && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-medium animate-pulse">
            💳 Wacht op betaling
          </span>
        )}
        
        {hasPendingFeedback && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Feedback
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {daysInPhase === 0 ? 'Vandaag' : `${daysInPhase}d`}
        </div>
        
        <div className="flex items-center gap-2">
          {project.designPreviewUrl && (
            <a 
              href={project.designPreviewUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="hover:text-purple-400 transition"
              title="Design preview"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <span className="text-gray-600">€{packageInfo.price}/m</span>
        </div>
      </div>
    </motion.div>
  )
}
