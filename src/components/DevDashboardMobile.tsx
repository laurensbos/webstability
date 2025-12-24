/**
 * Developer Dashboard Mobile Components
 * 
 * Mobile-first components for the developer dashboard
 */

import { useState } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  CreditCard,
  Users,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Clock,
  ArrowUpRight,
  MoreHorizontal,
  Trash2,
  Edit3,
  type LucideIcon
} from 'lucide-react'

// ===========================================
// 1. MOBILE BOTTOM NAV FOR DEVELOPER
// ===========================================

interface DevNavItem {
  id: string
  label: string
  icon: LucideIcon
  badge?: number
}

interface DevMobileNavProps {
  activeView: string
  onViewChange: (view: string) => void
  unreadMessages?: number
  pendingPayments?: number
  darkMode?: boolean
}

export function DevMobileNav({
  activeView,
  onViewChange,
  unreadMessages = 0,
  pendingPayments = 0,
  darkMode = true
}: DevMobileNavProps) {
  const navItems: DevNavItem[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projecten', icon: FolderKanban },
    { id: 'messages', label: 'Berichten', icon: MessageSquare, badge: unreadMessages },
    { id: 'payments', label: 'Betalingen', icon: CreditCard, badge: pendingPayments },
    { id: 'clients', label: 'Klanten', icon: Users }
  ]

  return (
    <>
      {/* Spacer */}
      <div className="h-20 lg:hidden" />
      
      {/* Bottom Nav */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden ${
        darkMode
          ? 'bg-gray-900/95 border-t border-gray-800'
          : 'bg-white/95 border-t border-gray-200'
      } backdrop-blur-xl`}>
        <div className="flex items-center justify-around h-16 px-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`relative flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-colors ${
                  isActive
                    ? 'text-emerald-500'
                    : darkMode
                      ? 'text-gray-500'
                      : 'text-gray-400'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="devActiveTab"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-emerald-500"
                  />
                )}

                {/* Icon with badge */}
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span className={`mt-0.5 text-[10px] font-medium ${
                  isActive ? 'opacity-100' : 'opacity-70'
                }`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}

// ===========================================
// 2. FLOATING ACTION BUTTON
// ===========================================

interface FABAction {
  id: string
  label: string
  icon: LucideIcon
  onClick: () => void
  color?: string
}

interface DevFABProps {
  actions: FABAction[]
  darkMode?: boolean
}

export function DevFAB({ actions, darkMode = true }: DevFABProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-30">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 z-20"
            />

            {/* Actions */}
            <div className="absolute bottom-16 right-0 space-y-2 z-30">
              {actions.map((action, index) => {
                const Icon = action.icon
                
                return (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      action.onClick()
                      setIsOpen(false)
                    }}
                    className={`flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-full shadow-lg whitespace-nowrap ${
                      darkMode
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-white text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm font-medium">{action.label}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      action.color || 'bg-emerald-500'
                    }`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          isOpen
            ? 'bg-gray-700 rotate-45'
            : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
        }`}
      >
        <Plus className={`w-6 h-6 text-white transition-transform ${isOpen ? 'rotate-45' : ''}`} />
      </motion.button>
    </div>
  )
}

// ===========================================
// 3. MOBILE STATS CARDS (Swipeable)
// ===========================================

interface StatCard {
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  color: string
}

interface MobileStatsProps {
  stats: StatCard[]
  darkMode?: boolean
}

export function MobileStats({ stats, darkMode = true }: MobileStatsProps) {
  return (
    <div className="overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
      <div className="flex gap-3" style={{ width: 'max-content' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex-shrink-0 w-40 p-4 rounded-2xl ${
                darkMode
                  ? 'bg-gray-800/50 border border-gray-700'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {stat.label}
              </p>
              {stat.change && (
                <p className={`text-xs mt-1 font-medium ${
                  stat.changeType === 'positive' ? 'text-green-500' :
                  stat.changeType === 'negative' ? 'text-red-500' :
                  'text-gray-500'
                }`}>
                  {stat.change}
                </p>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ===========================================
// 4. MOBILE PROJECT CARD (Touch-friendly)
// ===========================================

interface MobileProjectCardProps {
  project: {
    id: string
    businessName: string
    contactName: string
    phase: string
    package: string
    updatedAt: string
  }
  onView: () => void
  onEdit: () => void
  onDelete?: () => void
  darkMode?: boolean
}

export function MobileProjectCard({
  project,
  onView,
  onEdit,
  onDelete,
  darkMode = true
}: MobileProjectCardProps) {
  const [showActions, setShowActions] = useState(false)
  const [swipeX, setSwipeX] = useState(0)

  const phaseColors: Record<string, string> = {
    onboarding: 'bg-blue-500',
    design: 'bg-amber-500',
    feedback: 'bg-purple-500',
    revisie: 'bg-cyan-500',
    payment: 'bg-indigo-500',
    approval: 'bg-pink-500',
    live: 'bg-green-500'
  }

  const phaseLabels: Record<string, string> = {
    onboarding: 'Onboarding',
    design: 'Design',
    feedback: 'Feedback',
    revisie: 'Revisie',
    payment: 'Betaling',
    approval: 'Goedkeuring',
    live: 'Live'
  }

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -100) {
      setShowActions(true)
      setSwipeX(-100)
    } else {
      setShowActions(false)
      setSwipeX(0)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Swipe actions */}
      <div className={`absolute right-0 top-0 bottom-0 flex items-center gap-2 px-3 ${
        darkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <button
          onClick={onEdit}
          className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center"
        >
          <Edit3 className="w-5 h-5 text-white" />
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center"
          >
            <Trash2 className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ x: swipeX }}
        onClick={() => {
          if (!showActions) onView()
          else {
            setShowActions(false)
            setSwipeX(0)
          }
        }}
        className={`relative p-4 cursor-pointer ${
          darkMode
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200 shadow-sm'
        } rounded-2xl`}
      >
        <div className="flex items-start gap-3">
          {/* Phase indicator */}
          <div className={`w-2 h-full min-h-[60px] rounded-full ${phaseColors[project.phase] || 'bg-gray-500'}`} />

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {project.businessName}
                </h3>
                <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {project.contactName}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowActions(!showActions)
                  setSwipeX(showActions ? 0 : -100)
                }}
                className={`p-1.5 rounded-lg ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <MoreHorizontal className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 mt-3">
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                {project.package}
              </span>
              <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${phaseColors[project.phase]}/20 ${
                darkMode ? 'text-white' : 'text-gray-700'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${phaseColors[project.phase]}`} />
                {phaseLabels[project.phase] || project.phase}
              </span>
              <span className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} ml-auto`}>
                <Clock className="w-3 h-3" />
                {new Date(project.updatedAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
        </div>

        {/* Swipe hint */}
        <div className={`absolute right-2 top-1/2 -translate-y-1/2 transition-opacity ${
          showActions ? 'opacity-0' : 'opacity-30'
        }`}>
          <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>
      </motion.div>
    </div>
  )
}

// ===========================================
// 5. MOBILE SEARCH BAR
// ===========================================

interface MobileSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onFilter?: () => void
  darkMode?: boolean
}

export function MobileSearch({
  value,
  onChange,
  placeholder = 'Zoeken...',
  onFilter,
  darkMode = true
}: MobileSearchProps) {
  return (
    <div className="flex gap-2">
      <div className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl ${
        darkMode
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-200 shadow-sm'
      }`}>
        <Search className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 bg-transparent border-0 focus:ring-0 text-sm ${
            darkMode
              ? 'text-white placeholder-gray-500'
              : 'text-gray-900 placeholder-gray-400'
          }`}
        />
      </div>
      {onFilter && (
        <button
          onClick={onFilter}
          className={`px-4 rounded-xl flex items-center gap-2 ${
            darkMode
              ? 'bg-gray-800 border border-gray-700 text-gray-300'
              : 'bg-white border border-gray-200 text-gray-600 shadow-sm'
          }`}
        >
          <Filter className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// ===========================================
// 6. MOBILE MESSAGE PREVIEW
// ===========================================

interface MobileMessagePreviewProps {
  message: {
    id: string
    projectName: string
    senderName: string
    preview: string
    time: string
    unread: boolean
  }
  onClick: () => void
  darkMode?: boolean
}

export function MobileMessagePreview({
  message,
  onClick,
  darkMode = true
}: MobileMessagePreviewProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full p-4 rounded-2xl text-left transition-colors ${
        message.unread
          ? darkMode
            ? 'bg-emerald-900/20 border border-emerald-500/30'
            : 'bg-emerald-50 border border-emerald-200'
          : darkMode
            ? 'bg-gray-800/50 border border-gray-700'
            : 'bg-white border border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Unread indicator */}
        {message.unread && (
          <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 flex-shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className={`font-semibold truncate ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {message.projectName}
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {message.senderName}
              </p>
            </div>
            <span className={`text-xs flex-shrink-0 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {message.time}
            </span>
          </div>
          <p className={`mt-1 text-sm truncate ${
            message.unread
              ? darkMode ? 'text-white' : 'text-gray-900'
              : darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {message.preview}
          </p>
        </div>

        <ChevronRight className={`w-5 h-5 flex-shrink-0 ${
          darkMode ? 'text-gray-600' : 'text-gray-300'
        }`} />
      </div>
    </motion.button>
  )
}

// ===========================================
// 7. QUICK ACTION CARDS (for overview)
// ===========================================

interface QuickActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  onClick: () => void
  color: string
  badge?: number
  darkMode?: boolean
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  onClick,
  color,
  badge,
  darkMode = true
}: QuickActionCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full p-4 rounded-2xl text-left transition-all ${
        darkMode
          ? 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
          : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
          {badge}
        </span>
      )}

      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
          <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {description}
          </p>
        </div>
        <ArrowUpRight className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>
    </motion.button>
  )
}
