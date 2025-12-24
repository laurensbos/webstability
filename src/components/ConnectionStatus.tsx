/**
 * ConnectionStatus - Toont online/offline status
 * 
 * Klein indicator component voor realtime sync status
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, RefreshCw } from 'lucide-react'

interface ConnectionStatusProps {
  isPolling?: boolean
  lastSyncTime?: Date | null
  syncError?: string | null
  darkMode?: boolean
  compact?: boolean
}

export default function ConnectionStatus({
  isPolling = false,
  lastSyncTime: _lastSyncTime,
  syncError,
  darkMode = true,
  compact = false
}: ConnectionStatusProps) {
  void _lastSyncTime // Reserved for future use
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${
          !isOnline ? 'bg-red-500' : syncError ? 'bg-amber-500' : 'bg-green-500'
        }`} />
        {isPolling && (
          <RefreshCw className={`w-3 h-3 animate-spin ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
        )}
      </div>
    )
  }

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center text-sm font-medium ${
            darkMode ? 'bg-red-900/90 text-red-200' : 'bg-red-500 text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Je bent offline. Wijzigingen worden opgeslagen zodra je weer online bent.</span>
          </div>
        </motion.div>
      )}

      {isOnline && syncError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center text-sm font-medium ${
            darkMode ? 'bg-amber-900/90 text-amber-200' : 'bg-amber-500 text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span>Probleem met synchroniseren. We proberen opnieuw...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Inline status for headers
export function ConnectionStatusInline({ 
  isPolling, 
  lastSyncTime, 
  darkMode = true 
}: { 
  isPolling?: boolean
  lastSyncTime?: Date | null
  darkMode?: boolean 
}) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const formatLastSync = () => {
    if (!lastSyncTime) return null
    const now = new Date()
    const diffSeconds = Math.floor((now.getTime() - lastSyncTime.getTime()) / 1000)
    
    if (diffSeconds < 10) return 'Live'
    if (diffSeconds < 60) return `${diffSeconds}s`
    const diffMins = Math.floor(diffSeconds / 60)
    return `${diffMins}m`
  }

  return (
    <div className="flex items-center gap-2">
      {isPolling ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
        </motion.div>
      ) : (
        <div className={`w-2 h-2 rounded-full ${
          !isOnline ? 'bg-red-500' : 'bg-green-500'
        }`} />
      )}
      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {!isOnline ? 'Offline' : formatLastSync() || 'Verbonden'}
      </span>
    </div>
  )
}
