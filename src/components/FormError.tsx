import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

interface FormErrorProps {
  message?: string
  show: boolean
}

/**
 * Inline form error message with animation
 */
export function FormError({ message, show }: FormErrorProps) {
  return (
    <AnimatePresence>
      {show && message && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-2 mt-1.5 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface FormFieldProps {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  touched?: boolean
  children: React.ReactNode
  hint?: string
}

/**
 * Form field wrapper with label and error handling
 */
export function FormField({ 
  label, 
  htmlFor, 
  required = false, 
  error, 
  touched = false,
  children,
  hint
}: FormFieldProps) {
  const showError = touched && !!error

  return (
    <div className="space-y-1.5">
      <label 
        htmlFor={htmlFor} 
        className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && !showError && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      )}
      <FormError message={error} show={showError} />
    </div>
  )
}

export default FormError
