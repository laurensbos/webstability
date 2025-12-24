/**
 * Developer Updates Component
 * 
 * Shows clients what developers have done on their project:
 * - Status updates
 * - Change request responses
 * - New design previews
 * 
 * Used in the Customer Portal to keep clients informed.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Clock,
  RefreshCw,
  Palette,
  MessageSquare,
  Bell,
  Sparkles,
  Loader2
} from 'lucide-react'

interface UpdateItem {
  id: string
  type: 'status_change' | 'change_request_update' | 'design_preview' | 'message' | 'milestone'
  title: string
  description: string
  date: string
  read: boolean
}

interface DeveloperUpdatesProps {
  projectId: string
  darkMode?: boolean
  maxItems?: number
}

const TYPE_CONFIG: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  status_change: { 
    icon: RefreshCw, 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/20' 
  },
  change_request_update: { 
    icon: CheckCircle2, 
    color: 'text-green-400', 
    bg: 'bg-green-500/20' 
  },
  design_preview: { 
    icon: Palette, 
    color: 'text-purple-400', 
    bg: 'bg-purple-500/20' 
  },
  message: { 
    icon: MessageSquare, 
    color: 'text-indigo-400', 
    bg: 'bg-indigo-500/20' 
  },
  milestone: { 
    icon: Sparkles, 
    color: 'text-amber-400', 
    bg: 'bg-amber-500/20' 
  }
}

export default function DeveloperUpdates({
  projectId,
  darkMode = true,
  maxItems = 10
}: DeveloperUpdatesProps) {
  const [updates, setUpdates] = useState<UpdateItem[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch updates from API
  const fetchUpdates = async () => {
    try {
      const response = await fetch(`/api/project/${projectId}/updates`)
      
      if (!response.ok) {
        // Generate mock updates if API doesn't exist
        generateMockUpdates()
        return
      }
      
      const data = await response.json()
      
      if (data.success) {
        setUpdates(data.updates.slice(0, maxItems))
      }
    } catch (err) {
      // Fallback to generating from project data
      generateMockUpdates()
    } finally {
      setLoading(false)
    }
  }

  // Generate mock updates from project state
  const generateMockUpdates = async () => {
    try {
      const response = await fetch(`/api/project/${projectId}`)
      if (!response.ok) {
        setUpdates([])
        return
      }
      
      const project = await response.json()
      const generatedUpdates: UpdateItem[] = []
      
      // Check for completed change requests
      if (project.changeRequests) {
        const completed = project.changeRequests.filter(
          (cr: any) => cr.status === 'completed' || cr.status === 'done'
        )
        
        for (const cr of completed.slice(0, 3)) {
          generatedUpdates.push({
            id: `cr-${cr.id}`,
            type: 'change_request_update',
            title: 'Wijziging afgerond ✓',
            description: cr.response || 'Je aangevraagde wijziging is verwerkt.',
            date: cr.completedAt || cr.createdAt || new Date().toISOString(),
            read: false
          })
        }
      }
      
      // Check for design preview
      if (project.designPreviewUrl && project.status === 'feedback') {
        generatedUpdates.push({
          id: 'design-ready',
          type: 'design_preview',
          title: 'Design klaar! 🎨',
          description: 'Je nieuwe design staat klaar om te bekijken.',
          date: project.updatedAt || new Date().toISOString(),
          read: false
        })
      }
      
      // Check for messages from developer
      if (project.messages) {
        const devMessages = project.messages.filter(
          (m: any) => m.from === 'developer' && !m.read
        ).slice(0, 2)
        
        for (const msg of devMessages) {
          generatedUpdates.push({
            id: `msg-${msg.id}`,
            type: 'message',
            title: 'Nieuw bericht van het team',
            description: msg.message.length > 80 
              ? msg.message.substring(0, 80) + '...' 
              : msg.message,
            date: msg.date,
            read: false
          })
        }
      }
      
      // Sort by date
      generatedUpdates.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      
      setUpdates(generatedUpdates.slice(0, maxItems))
    } catch (err) {
      console.error('Error generating updates:', err)
      setUpdates([])
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchUpdates()
    }
  }, [projectId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Zojuist'
    if (diffMins < 60) return `${diffMins} min geleden`
    if (diffHours < 24) return `${diffHours} uur geleden`
    if (diffDays < 7) return `${diffDays} dag${diffDays > 1 ? 'en' : ''} geleden`
    
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
  }

  // Loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center py-8 ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="text-sm">Updates laden...</span>
      </div>
    )
  }

  // Empty state
  if (updates.length === 0) {
    return (
      <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nog geen updates</p>
        <p className="text-xs mt-1">We houden je hier op de hoogte</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {updates.map((update, index) => {
          const config = TYPE_CONFIG[update.type] || TYPE_CONFIG.status_change
          const Icon = config.icon
          
          return (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl border transition-all ${
                update.read
                  ? darkMode 
                    ? 'bg-gray-800/30 border-gray-700/50' 
                    : 'bg-gray-50 border-gray-100'
                  : darkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-medium text-sm ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {update.title}
                    </p>
                    
                    {!update.read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  
                  <p className={`text-sm mt-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {update.description}
                  </p>
                  
                  <p className={`text-xs mt-2 ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <Clock className="w-3 h-3 inline mr-1" />
                    {formatDate(update.date)}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
