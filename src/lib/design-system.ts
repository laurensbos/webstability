/**
 * Webstability Design System
 * Centralized design tokens en utilities
 * 
 * Gebruik: import { colors, typography, spacing } from '@/lib/design-system'
 */

// ===========================================
// BRAND COLORS
// ===========================================

export const colors = {
  // Primary - Blauw (trust, professional)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main brand color
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Accent - Cyan/Teal (modern, fresh)
  accent: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
  },
  
  // Success - Groen
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  
  // Warning - Amber
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
  },
  
  // Error - Rood
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
  },
  
  // Neutrals - Grijs
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const

// ===========================================
// TYPOGRAPHY
// ===========================================

export const typography = {
  fonts: {
    display: '"Plus Jakarta Sans", "Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
  
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },
  
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
} as const

// ===========================================
// SPACING
// ===========================================

export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
} as const

// ===========================================
// SHADOWS
// ===========================================

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Gekleurde schaduwen voor buttons
  primary: '0 4px 14px 0 rgba(59, 130, 246, 0.35)',
  primaryHover: '0 6px 20px 0 rgba(59, 130, 246, 0.45)',
  success: '0 4px 14px 0 rgba(34, 197, 94, 0.35)',
} as const

// ===========================================
// BORDER RADIUS
// ===========================================

export const radii = {
  none: '0',
  sm: '0.25rem',   // 4px
  DEFAULT: '0.375rem', // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const

// ===========================================
// TRANSITIONS
// ===========================================

export const transitions = {
  fast: '150ms ease',
  DEFAULT: '200ms ease',
  slow: '300ms ease',
  slowest: '500ms ease',
} as const

// ===========================================
// Z-INDEX
// ===========================================

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1200,
  popover: 1300,
  tooltip: 1400,
  toast: 1500,
} as const

// ===========================================
// BREAKPOINTS
// ===========================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ===========================================
// COMPONENT STYLES
// ===========================================

/**
 * Button variants voor consistente styling
 */
export const buttonStyles = {
  base: 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  
  sizes: {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  },
  
  variants: {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-primary hover:shadow-primaryHover hover:-translate-y-0.5 focus-visible:ring-primary-500',
    secondary: 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50 focus-visible:ring-primary-500',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500',
    success: 'bg-success-500 hover:bg-success-600 text-white shadow-success hover:-translate-y-0.5 focus-visible:ring-success-500',
    danger: 'bg-error-500 hover:bg-error-600 text-white focus-visible:ring-error-500',
  },
} as const

/**
 * Card styles
 */
export const cardStyles = {
  base: 'bg-white rounded-2xl border border-gray-100 overflow-hidden',
  
  variants: {
    default: 'shadow-sm hover:shadow-md transition-shadow',
    elevated: 'shadow-lg hover:shadow-xl transition-shadow',
    interactive: 'shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer',
    bordered: 'shadow-none border-2 border-gray-200',
  },
  
  padding: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },
} as const

/**
 * Input styles
 */
export const inputStyles = {
  base: 'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
  
  states: {
    error: 'border-error-500 focus:ring-error-500',
    success: 'border-success-500 focus:ring-success-500',
    disabled: 'bg-gray-50 cursor-not-allowed opacity-60',
  },
  
  sizes: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  },
} as const

/**
 * Badge styles
 */
export const badgeStyles = {
  base: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium',
  
  variants: {
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700',
    gray: 'bg-gray-100 text-gray-700',
  },
} as const

// ===========================================
// UTILITY CLASSES
// ===========================================

/**
 * Vaak gebruikte class combinaties
 */
export const utilities = {
  // Container
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  
  // Section spacing
  section: 'py-16 sm:py-20 lg:py-24',
  sectionSmall: 'py-12 sm:py-16',
  
  // Heading styles
  h1: 'text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight',
  h2: 'text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight',
  h3: 'text-2xl sm:text-3xl font-bold tracking-tight',
  h4: 'text-xl sm:text-2xl font-semibold',
  
  // Text styles
  lead: 'text-lg sm:text-xl text-gray-600 leading-relaxed',
  body: 'text-base text-gray-600 leading-relaxed',
  small: 'text-sm text-gray-500',
  
  // Gradient text
  gradientText: 'bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent',
  
  // Focus ring
  focusRing: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  
  // Glass effect
  glass: 'backdrop-blur-lg bg-white/80 border border-white/20',
  
  // Shimmer animation voor loading
  shimmer: 'animate-pulse bg-gray-200 rounded',
} as const

// ===========================================
// ANIMATION PRESETS
// ===========================================

export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  },
  
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },
  
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 },
  },
  
  // Stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
} as const

// ===========================================
// GRADIENTS
// ===========================================

export const gradients = {
  primary: 'bg-gradient-to-r from-primary-600 to-primary-500',
  primaryToAccent: 'bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500',
  subtle: 'bg-gradient-to-br from-gray-50 to-white',
  heroBackground: 'bg-gradient-to-b from-gray-50 via-white to-white',
  card: 'bg-gradient-to-br from-white to-gray-50/50',
} as const
