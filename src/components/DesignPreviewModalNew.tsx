/**
 * DesignPreviewModal Component - Section-based Feedback
 * 
 * Features:
 * - Full-screen overlay with embedded section feedback
 * - Simple section-based feedback for non-technical users
 * - Preview toggle to view the actual design
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ExternalLink,
  Eye,
  MessageSquare
} from 'lucide-react'
import DesignFeedbackSections from './DesignFeedbackSections'
import type { FeedbackQuestion } from '../types/project'

interface DesignPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  designPreviewUrl: string
  feedbackQuestionIds?: string[]
  customQuestions?: FeedbackQuestion[]
  onFeedbackSubmit?: () => Promise<void>
  onApprove?: () => Promise<void>
}

export default function DesignPreviewModal({
  isOpen,
  onClose,
  projectId,
  designPreviewUrl,
  feedbackQuestionIds = [],
  customQuestions = [],
  onFeedbackSubmit,
  onApprove,
}: DesignPreviewModalProps) {
  const [mode, setMode] = useState<'feedback' | 'preview'>('feedback')

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Mode toggle - top center */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setMode('feedback')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                mode === 'feedback'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Feedback geven</span>
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                mode === 'preview'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview bekijken</span>
            </button>
          </div>

          {/* External link */}
          <a
            href={designPreviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Open in nieuw tabblad</span>
          </a>

          {/* Content area */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute inset-4 top-16 bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {mode === 'feedback' ? (
              <DesignFeedbackSections
                isOpen={true}
                projectId={projectId}
                designPreviewUrl={designPreviewUrl}
                feedbackQuestionIds={feedbackQuestionIds}
                customQuestions={customQuestions.map(q => q.question)}
                onFeedbackSubmit={async () => {
                  await onFeedbackSubmit?.()
                  onClose()
                }}
                onApprove={async () => {
                  await onApprove?.()
                  onClose()
                }}
                onClose={onClose}
              />
            ) : (
              <div className="w-full h-full relative">
                {/* Preview iframe */}
                <iframe
                  src={designPreviewUrl}
                  className="w-full h-full border-0"
                  title="Design Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
                
                {/* Overlay message on preview */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Scroll door je website. Klaar? Klik op &quot;Feedback geven&quot;
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
