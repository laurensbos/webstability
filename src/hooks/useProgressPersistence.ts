/**
 * useProgressPersistence - Persist form/wizard progress to localStorage
 * 
 * Features:
 * - Auto-save on changes with debounce
 * - Restore on mount
 * - Clear on completion
 * - Timestamp tracking
 */

import { useState, useEffect, useCallback, useRef } from 'react'

interface PersistedData<T> {
  data: T
  timestamp: number
  version: number
}

interface UseProgressPersistenceOptions<T> {
  /** Unique key for localStorage */
  key: string
  /** Initial/default data */
  initialData: T
  /** Version number - bump to invalidate old data */
  version?: number
  /** Debounce delay in ms */
  debounceMs?: number
  /** Max age in ms before data is considered stale (default: 7 days) */
  maxAge?: number
  /** Project ID to scope the storage */
  projectId?: string
}

interface UseProgressPersistenceReturn<T> {
  /** Current data */
  data: T
  /** Update data (triggers auto-save) */
  setData: (data: T | ((prev: T) => T)) => void
  /** Whether data was restored from storage */
  wasRestored: boolean
  /** Clear persisted data */
  clearProgress: () => void
  /** Manually save now */
  saveNow: () => void
  /** Last save timestamp */
  lastSaved: Date | null
  /** Is there unsaved data */
  hasUnsavedChanges: boolean
}

export function useProgressPersistence<T>({
  key,
  initialData,
  version = 1,
  debounceMs = 1000,
  maxAge = 7 * 24 * 60 * 60 * 1000, // 7 days
  projectId
}: UseProgressPersistenceOptions<T>): UseProgressPersistenceReturn<T> {
  const storageKey = projectId ? `${key}_${projectId}` : key
  
  // Try to restore from storage on mount
  const getInitialData = (): { data: T; wasRestored: boolean } => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed: PersistedData<T> = JSON.parse(stored)
        
        // Check version
        if (parsed.version !== version) {
          localStorage.removeItem(storageKey)
          return { data: initialData, wasRestored: false }
        }
        
        // Check age
        if (Date.now() - parsed.timestamp > maxAge) {
          localStorage.removeItem(storageKey)
          return { data: initialData, wasRestored: false }
        }
        
        return { data: parsed.data, wasRestored: true }
      }
    } catch {
      // Ignore errors, use initial data
    }
    return { data: initialData, wasRestored: false }
  }
  
  const initial = getInitialData()
  const [data, setDataInternal] = useState<T>(initial.data)
  const [wasRestored] = useState(initial.wasRestored)
  const [lastSaved, setLastSaved] = useState<Date | null>(
    initial.wasRestored ? new Date() : null
  )
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dataRef = useRef(data)
  dataRef.current = data
  
  // Save to storage
  const saveToStorage = useCallback(() => {
    try {
      const toStore: PersistedData<T> = {
        data: dataRef.current,
        timestamp: Date.now(),
        version
      }
      localStorage.setItem(storageKey, JSON.stringify(toStore))
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }, [storageKey, version])
  
  // Debounced save
  const scheduleSave = useCallback(() => {
    setHasUnsavedChanges(true)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    saveTimeoutRef.current = setTimeout(saveToStorage, debounceMs)
  }, [saveToStorage, debounceMs])
  
  // Set data and schedule save
  const setData = useCallback((newData: T | ((prev: T) => T)) => {
    setDataInternal(prev => {
      const next = typeof newData === 'function' 
        ? (newData as (prev: T) => T)(prev) 
        : newData
      return next
    })
    scheduleSave()
  }, [scheduleSave])
  
  // Clear progress
  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(storageKey)
      setLastSaved(null)
      setHasUnsavedChanges(false)
    } catch {
      // Ignore
    }
  }, [storageKey])
  
  // Save immediately
  const saveNow = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    saveToStorage()
  }, [saveToStorage])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      // Save on unmount if there are unsaved changes
      if (hasUnsavedChanges) {
        saveToStorage()
      }
    }
  }, [hasUnsavedChanges, saveToStorage])
  
  // Save before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasUnsavedChanges) {
        saveToStorage()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges, saveToStorage])
  
  return {
    data,
    setData,
    wasRestored,
    clearProgress,
    saveNow,
    lastSaved,
    hasUnsavedChanges
  }
}

export default useProgressPersistence
