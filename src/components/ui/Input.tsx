import { forwardRef } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

// Consistent input styling classes
export const inputBaseClasses = `
  w-full px-4 py-3 
  bg-white dark:bg-gray-900 
  border-2 border-gray-200 dark:border-gray-700 
  rounded-xl 
  text-gray-900 dark:text-white 
  placeholder-gray-400 dark:placeholder-gray-500 
  focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 
  focus:ring-4 focus:ring-primary-500/10 dark:focus:ring-primary-400/10
  hover:border-gray-300 dark:hover:border-gray-600
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-800
`

export const inputErrorClasses = `
  border-red-500 dark:border-red-500 
  focus:border-red-500 dark:focus:border-red-500 
  focus:ring-red-500/10 dark:focus:ring-red-400/10
`

export const inputSuccessClasses = `
  border-green-500 dark:border-green-500 
  focus:border-green-500 dark:focus:border-green-500 
  focus:ring-green-500/10 dark:focus:ring-green-400/10
`

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  success?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

/**
 * Consistent styled input component
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, success, leftIcon, rightIcon, ...props }, ref) => {
    const stateClasses = error ? inputErrorClasses : success ? inputSuccessClasses : ''
    
    if (leftIcon || rightIcon) {
      return (
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`${inputBaseClasses} ${stateClasses} ${leftIcon ? 'pl-11' : ''} ${rightIcon ? 'pr-11' : ''} ${className}`.trim()}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
      )
    }

    return (
      <input
        ref={ref}
        className={`${inputBaseClasses} ${stateClasses} ${className}`.trim()}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  success?: boolean
}

/**
 * Consistent styled textarea component
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, success, ...props }, ref) => {
    const stateClasses = error ? inputErrorClasses : success ? inputSuccessClasses : ''
    
    return (
      <textarea
        ref={ref}
        className={`${inputBaseClasses} ${stateClasses} resize-none ${className}`.trim()}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  options: { value: string; label: string; disabled?: boolean }[]
}

/**
 * Consistent styled select component
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, options, ...props }, ref) => {
    const stateClasses = error ? inputErrorClasses : ''
    
    return (
      <select
        ref={ref}
        className={`${inputBaseClasses} ${stateClasses} appearance-none cursor-pointer ${className}`.trim()}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }
)

Select.displayName = 'Select'

/**
 * Animated focus ring component (wrap around any focusable element)
 */
export function FocusRing({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="relative"
      whileFocus={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}

export default Input
