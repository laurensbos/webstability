/**
 * Skeleton Loader Components
 * 
 * Premium skeleton loaders voor loading states in het Developer Dashboard.
 * Maakt gebruik van Tailwind animaties voor een vloeiende shimmer effect.
 */

import { motion } from 'framer-motion'

// Base skeleton met shimmer effect
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] rounded ${className}`}
      style={{ 
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
    />
  )
}

// Kanban kolom skeleton
export function KanbanColumnSkeleton() {
  return (
    <div className="min-w-[280px] md:min-w-0 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
      {/* Phase Header */}
      <div className="bg-white/10 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-lg" />
            <Skeleton className="w-20 h-4" />
          </div>
          <Skeleton className="w-6 h-5 rounded-full" />
        </div>
      </div>

      {/* Cards */}
      <div className="p-3 space-y-2">
        {[1, 2].map(i => (
          <KanbanCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

// Kanban kaart skeleton
export function KanbanCardSkeleton() {
  return (
    <div className="p-3 bg-gray-900/50 border border-white/10 rounded-xl">
      <div className="flex items-start gap-2">
        <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-1/2 h-3" />
        </div>
      </div>
    </div>
  )
}

// Lijst rij skeleton
export function ListRowSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-4 px-4 py-4 items-center">
      <div className="col-span-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-20 h-3" />
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <Skeleton className="w-20 h-6 rounded-lg" />
      </div>
      <div className="col-span-2">
        <div className="space-y-1">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-12 h-3" />
        </div>
      </div>
      <div className="col-span-2">
        <Skeleton className="w-24 h-3" />
      </div>
      <div className="col-span-2">
        <Skeleton className="w-16 h-7 rounded-lg" />
      </div>
    </div>
  )
}

// Hero section skeleton
export function HeroSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-6">
      <div className="space-y-4">
        <Skeleton className="w-24 h-6 rounded-full" />
        <Skeleton className="w-48 h-8" />
        <Skeleton className="w-64 h-4" />
        <div className="flex gap-2 mt-4">
          <Skeleton className="w-32 h-10 rounded-lg" />
          <Skeleton className="w-32 h-10 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Stats kaart skeleton
export function StatsCardSkeleton() {
  return (
    <div className="relative overflow-hidden bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
      </div>
      <Skeleton className="w-32 h-3 mb-2" />
      <Skeleton className="w-20 h-8 mb-2" />
      <Skeleton className="w-24 h-3" />
    </div>
  )
}

// Berichten skeleton
export function MessageSkeleton() {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-16 h-4 rounded-full" />
          </div>
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-3/4 h-4" />
        </div>
        <Skeleton className="w-16 h-3" />
      </div>
    </div>
  )
}

// Klant kaart skeleton
export function CustomerCardSkeleton() {
  return (
    <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
      <div className="flex items-start gap-4">
        <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-40 h-5" />
            <Skeleton className="w-20 h-5 rounded-lg" />
          </div>
          <Skeleton className="w-32 h-4" />
          <div className="flex gap-3 mt-3">
            <Skeleton className="w-40 h-3" />
            <Skeleton className="w-28 h-3" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard loading state met alle skeletons
export function DashboardSkeleton({ view = 'projects' }: { view?: 'projects' | 'messages' | 'customers' | 'payments' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Hero Skeleton */}
      <HeroSkeleton />

      {/* Content based on view */}
      {view === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <KanbanColumnSkeleton key={i} />
          ))}
        </div>
      )}

      {view === 'messages' && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <MessageSkeleton key={i} />
          ))}
        </div>
      )}

      {view === 'customers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <CustomerCardSkeleton key={i} />
          ))}
        </div>
      )}

      {view === 'payments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <ListRowSkeleton key={i} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
