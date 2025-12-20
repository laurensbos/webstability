/**
 * Loading Skeletons
 * Herbruikbare skeleton componenten voor loading states
 */

import { motion } from 'framer-motion'

// Base Skeleton component
function Skeleton({ 
  className = '', 
  animate = true 
}: { 
  className?: string
  animate?: boolean 
}) {
  return (
    <div 
      className={`bg-gray-200 dark:bg-gray-700 rounded ${animate ? 'animate-pulse' : ''} ${className}`}
    />
  )
}

// ===========================================
// PROJECT STATUS PAGE SKELETON
// ===========================================

export function ProjectStatusSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header skeleton */}
      <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800" />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress bar skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          
          {/* Progress steps */}
          <div className="flex justify-between gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <Skeleton className="w-10 h-10 rounded-full mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
        
        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current phase card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="w-14 h-14 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
            
            {/* Updates section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right column - 1/3 width */}
          <div className="space-y-6">
            {/* Project info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <Skeleton className="h-5 w-28 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Contact card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <Skeleton className="h-5 w-24 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===========================================
// ARTICLE PAGE SKELETON
// ===========================================

export function ArticleSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header skeleton */}
      <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800" />
      
      {/* Hero section skeleton */}
      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          {/* Category badge */}
          <Skeleton className="h-6 w-24 rounded-full mb-4" />
          
          {/* Title */}
          <Skeleton className="h-10 w-full max-w-2xl mb-3" />
          <Skeleton className="h-10 w-3/4 mb-6" />
          
          {/* Meta info */}
          <div className="flex items-center gap-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          {/* Paragraphs */}
          {[1, 2, 3].map((section) => (
            <div key={section} className="mb-8">
              <Skeleton className="h-8 w-64 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
          
          {/* Image placeholder */}
          <Skeleton className="h-64 w-full rounded-xl mb-8" />
          
          {/* More paragraphs */}
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ===========================================
// KENNISBANK PAGE SKELETON
// ===========================================

export function KennisbankSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header skeleton */}
      <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800" />
      
      {/* Hero section */}
      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Skeleton className="h-8 w-32 rounded-full mx-auto mb-6" />
          <Skeleton className="h-12 w-96 max-w-full mx-auto mb-4" />
          <Skeleton className="h-6 w-64 mx-auto mb-8" />
          
          {/* Search bar */}
          <Skeleton className="h-14 w-full max-w-xl mx-auto rounded-xl" />
        </div>
      </div>
      
      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-3 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-full flex-shrink-0" />
          ))}
        </div>
      </div>
      
      {/* Articles grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <Skeleton className="h-48 w-full" />
              <div className="p-6">
                <Skeleton className="h-5 w-20 rounded-full mb-3" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===========================================
// PORTFOLIO PAGE SKELETON
// ===========================================

export function PortfolioSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header skeleton */}
      <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800" />
      
      {/* Hero section */}
      <div className="bg-gray-50 dark:bg-gray-800 pt-24 pb-12 lg:pt-32 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Skeleton className="h-8 w-28 rounded-full mx-auto mb-4" />
          <Skeleton className="h-12 w-80 max-w-full mx-auto mb-4" />
          <Skeleton className="h-6 w-96 max-w-full mx-auto" />
        </div>
      </div>
      
      {/* Category filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-3 justify-center flex-wrap">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-full" />
          ))}
        </div>
      </div>
      
      {/* Projects grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="relative">
                {/* Browser chrome */}
                <div className="h-8 bg-gray-200 dark:bg-gray-700 flex items-center px-3 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                </div>
                <Skeleton className="h-48 w-full" animate={true} />
              </div>
              <div className="p-6">
                <Skeleton className="h-5 w-24 rounded-full mb-3" />
                <Skeleton className="h-7 w-40 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===========================================
// DEVELOPER DASHBOARD SKELETON
// ===========================================

export function DeveloperDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-t-lg" />
          ))}
        </div>
        
        {/* Projects list */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Table header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-5 gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          
          {/* Table rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div className="grid grid-cols-5 gap-4 items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-5 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===========================================
// CLIENT ONBOARDING SKELETON
// ===========================================

export function ClientOnboardingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Skeleton className="h-6 w-32 rounded-full mx-auto mb-4" />
          <Skeleton className="h-10 w-80 max-w-full mx-auto mb-2" />
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="w-8 h-8 rounded-full" />
              {i < 5 && <Skeleton className="w-12 h-1 mx-1" />}
            </div>
          ))}
        </div>
        
        {/* Main form card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <Skeleton className="h-8 w-64 mb-6" />
          
          {/* Form fields */}
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
            
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            
            <div>
              <Skeleton className="h-4 w-36 mb-2" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
            <Skeleton className="h-12 w-28 rounded-xl" />
            <Skeleton className="h-12 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ===========================================
// GENERIC PAGE SKELETON
// ===========================================

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header skeleton */}
      <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800" />
      
      {/* Hero section */}
      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Skeleton className="h-8 w-32 rounded-full mx-auto mb-6" />
          <Skeleton className="h-12 w-96 max-w-full mx-auto mb-4" />
          <Skeleton className="h-6 w-80 max-w-full mx-auto" />
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===========================================
// CARD SKELETON
// ===========================================

export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700"
        >
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </motion.div>
      ))}
    </>
  )
}

// ===========================================
// TABLE ROW SKELETON
// ===========================================

export function TableRowSkeleton({ columns = 4, count = 5 }: { columns?: number; count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
        >
          <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton key={j} className="h-5 w-full max-w-[120px]" />
            ))}
          </div>
        </motion.div>
      ))}
    </>
  )
}

export default {
  ProjectStatusSkeleton,
  ArticleSkeleton,
  KennisbankSkeleton,
  PortfolioSkeleton,
  DeveloperDashboardSkeleton,
  ClientOnboardingSkeleton,
  PageSkeleton,
  CardSkeleton,
  TableRowSkeleton,
}
