import * as Sentry from '@sentry/react'

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN

// Check if Sentry is configured
export const isSentryConfigured = (): boolean => {
  return Boolean(SENTRY_DSN)
}

// Initialize Sentry
export const initSentry = () => {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured. Error tracking disabled.')
    return
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    
    // Performance monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    
    // Session replay for debugging
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Integrations
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Filtering
    beforeSend(event) {
      // Filter out specific errors if needed
      if (event.exception?.values?.[0]?.type === 'ChunkLoadError') {
        // Ignore chunk load errors (usually from outdated cached bundles)
        return null
      }
      return event
    },

    // Don't send errors in development by default
    enabled: import.meta.env.PROD || import.meta.env.VITE_SENTRY_DEV === 'true',
  })

  console.log('Sentry initialized')
}

// Capture exception with extra context
export const captureException = (
  error: Error | unknown,
  context?: Record<string, unknown>
) => {
  if (!isSentryConfigured()) {
    console.error('Uncaptured error:', error, context)
    return
  }

  Sentry.withScope((scope) => {
    if (context) {
      scope.setExtras(context)
    }
    Sentry.captureException(error)
  })
}

// Capture message (for logging important events)
export const captureMessage = (
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: Record<string, unknown>
) => {
  if (!isSentryConfigured()) {
    console.log(`[${level}]`, message, context)
    return
  }

  Sentry.withScope((scope) => {
    if (context) {
      scope.setExtras(context)
    }
    Sentry.captureMessage(message, level)
  })
}

// Set user context (call after login)
export const setUser = (user: {
  id: string
  email?: string
  role?: string
}) => {
  if (!isSentryConfigured()) return

  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
  })
}

// Clear user context (call after logout)
export const clearUser = () => {
  if (!isSentryConfigured()) return
  Sentry.setUser(null)
}

// Add breadcrumb (for debugging user flow)
export const addBreadcrumb = (breadcrumb: {
  category: string
  message: string
  level?: 'info' | 'warning' | 'error'
  data?: Record<string, unknown>
}) => {
  if (!isSentryConfigured()) return

  Sentry.addBreadcrumb({
    category: breadcrumb.category,
    message: breadcrumb.message,
    level: breadcrumb.level || 'info',
    data: breadcrumb.data,
  })
}

// Error boundary component
export const SentryErrorBoundary = Sentry.ErrorBoundary

// Wrap component with Sentry profiler
export const withSentryProfiler = Sentry.withProfiler

export default {
  initSentry,
  isSentryConfigured,
  captureException,
  captureMessage,
  setUser,
  clearUser,
  addBreadcrumb,
  SentryErrorBoundary,
  withSentryProfiler,
}
