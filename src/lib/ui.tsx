/**
 * Webstability UI Components
 * Herbruikbare, consistente componenten
 */

import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from './utils'

// ===========================================
// BUTTON
// ===========================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 focus-visible:ring-primary-500',
      secondary: 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50 focus-visible:ring-primary-500',
      ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500',
      success: 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25 hover:-translate-y-0.5 focus-visible:ring-green-500',
      danger: 'bg-red-500 hover:bg-red-600 text-white focus-visible:ring-red-500',
    }
    
    const sizes = {
      sm: 'px-4 py-2 text-sm gap-1.5',
      md: 'px-6 py-3 text-base gap-2',
      lg: 'px-8 py-4 text-lg gap-2.5',
    }
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)
Button.displayName = 'Button'

// ===========================================
// CARD
// ===========================================

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'bordered'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const baseStyles = 'bg-white rounded-2xl border border-gray-100 overflow-hidden'
    
    const variants = {
      default: 'shadow-sm hover:shadow-md transition-shadow',
      elevated: 'shadow-lg hover:shadow-xl transition-shadow',
      interactive: 'shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer',
      bordered: 'shadow-none border-2 border-gray-200',
    }
    
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }
    
    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], paddings[padding], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

// ===========================================
// INPUT
// ===========================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, ...props }, ref) => {
    const baseStyles = 'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              baseStyles,
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{hint}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

// ===========================================
// TEXTAREA
// ===========================================

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    const baseStyles = 'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none'
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            baseStyles,
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{hint}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

// ===========================================
// BADGE
// ===========================================

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'gray'
  size?: 'sm' | 'md'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'gray', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full'
    
    const variants = {
      primary: 'bg-primary-100 text-primary-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-amber-100 text-amber-700',
      error: 'bg-red-100 text-red-700',
      gray: 'bg-gray-100 text-gray-700',
    }
    
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    }
    
    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </span>
    )
  }
)
Badge.displayName = 'Badge'

// ===========================================
// SECTION WRAPPER
// ===========================================

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'md' | 'lg'
  background?: 'white' | 'gray' | 'gradient'
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, size = 'md', background = 'white', children, ...props }, ref) => {
    const sizes = {
      sm: 'py-12 sm:py-16',
      md: 'py-16 sm:py-20 lg:py-24',
      lg: 'py-20 sm:py-28 lg:py-32',
    }
    
    const backgrounds = {
      white: 'bg-white',
      gray: 'bg-gray-50',
      gradient: 'bg-gradient-to-b from-gray-50 to-white',
    }
    
    return (
      <section
        ref={ref}
        className={cn(sizes[size], backgrounds[background], className)}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </section>
    )
  }
)
Section.displayName = 'Section'

// ===========================================
// SECTION HEADER
// ===========================================

interface SectionHeaderProps {
  badge?: string
  title: string
  description?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({ badge, title, description, centered = true, className }: SectionHeaderProps) {
  return (
    <div className={cn(centered && 'text-center', 'mb-12 sm:mb-16', className)}>
      {badge && (
        <Badge variant="primary" className="mb-4">
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
        {title}
      </h2>
      {description && (
        <p className={cn(
          'text-lg sm:text-xl text-gray-600 leading-relaxed',
          centered && 'max-w-2xl mx-auto'
        )}>
          {description}
        </p>
      )}
    </div>
  )
}

// ===========================================
// ANIMATED COMPONENTS
// ===========================================

interface MotionCardProps extends HTMLMotionProps<'div'> {
  delay?: number
}

export const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>(
  ({ delay = 0, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
MotionCard.displayName = 'MotionCard'

// ===========================================
// SKELETON LOADING
// ===========================================

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({ 
  className, 
  variant = 'text', 
  width, 
  height, 
  ...props 
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-200'
  
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }
  
  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      style={{ 
        width: width ?? (variant === 'text' ? '100%' : undefined), 
        height: height ?? (variant === 'text' ? '1em' : undefined) 
      }}
      {...props}
    />
  )
}

// ===========================================
// TOOLTIP (simple CSS version)
// ===========================================

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }
  
  return (
    <div className="relative group inline-block">
      {children}
      <div className={cn(
        'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200',
        positions[position]
      )}>
        {content}
      </div>
    </div>
  )
}

// ===========================================
// DIVIDER
// ===========================================

interface DividerProps {
  text?: string
  className?: string
}

export function Divider({ text, className }: DividerProps) {
  if (text) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400 font-medium">{text}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
    )
  }
  
  return <div className={cn('h-px bg-gray-200', className)} />
}

// ===========================================
// UTILS
// ===========================================

// cn utility (class names merger)
// Already exists in utils.ts, but including for completeness
