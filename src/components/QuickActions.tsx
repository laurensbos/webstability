/**
 * Quick Actions Component
 * 
 * Context-aware quick actions based on current project phase
 * Gives users fast access to the most relevant actions
 */

import { motion } from 'framer-motion'
import {
  Upload,
  Eye,
  MessageSquare,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  FolderOpen,
  Globe,
  Star,
  RefreshCw,
  ArrowRight,
  Sparkles,
  type LucideIcon
} from 'lucide-react'

interface QuickAction {
  id: string
  label: string
  mobileLabel?: string  // Shorter label for mobile
  description?: string
  icon: LucideIcon
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'warning'
  badge?: string
  disabled?: boolean
}

interface QuickActionsProps {
  phase: 'onboarding' | 'design' | 'feedback' | 'revisie' | 'payment' | 'domain' | 'live'
  onUploadFiles?: () => void
  onViewDesign?: () => void
  onSendMessage?: () => void
  onMakePayment?: () => void
  onApprove?: () => void
  onOpenDrive?: () => void
  onViewWebsite?: () => void
  onRequestChanges?: () => void
  onLeaveReview?: () => void
  hasDesignPreview?: boolean
  hasUnpaidInvoice?: boolean
  paymentUrl?: string
  liveUrl?: string
  googleDriveUrl?: string
  darkMode?: boolean
}

export default function QuickActions({
  phase,
  onViewDesign,
  onSendMessage,
  onApprove,
  onRequestChanges,
  onLeaveReview,
  hasDesignPreview = false,
  hasUnpaidInvoice = false,
  paymentUrl,
  liveUrl,
  googleDriveUrl,
  darkMode = true
}: QuickActionsProps) {
  // Define actions based on phase
  const getPhaseActions = (): QuickAction[] => {
    const baseActions: QuickAction[] = []

    switch (phase) {
      case 'onboarding':
        if (googleDriveUrl) {
          baseActions.push({
            id: 'upload',
            label: 'Upload bestanden',
            mobileLabel: 'Uploaden',
            description: 'Logo, foto\'s en teksten',
            icon: Upload,
            onClick: () => window.open(googleDriveUrl, '_blank'),
            variant: 'primary'
          })
        }
        baseActions.push({
          id: 'message',
          label: 'Stuur bericht',
          description: 'Stel een vraag',
          icon: MessageSquare,
          onClick: onSendMessage || (() => {}),
          variant: 'secondary'
        })
        break

      case 'design':
        baseActions.push({
          id: 'message',
          label: 'Stel een vraag',
          mobileLabel: 'Vraag stellen',
          description: 'Over het design proces',
          icon: MessageSquare,
          onClick: onSendMessage || (() => {}),
          variant: 'secondary'
        })
        if (googleDriveUrl) {
          baseActions.push({
            id: 'files',
            label: 'Bekijk bestanden',
            mobileLabel: 'Bestanden',
            icon: FolderOpen,
            onClick: () => window.open(googleDriveUrl, '_blank'),
            variant: 'secondary'
          })
        }
        break

      case 'feedback':
        if (hasDesignPreview) {
          baseActions.push({
            id: 'view-design',
            label: 'Bekijk ontwerp',
            mobileLabel: 'Bekijken',
            description: 'Geef je feedback',
            icon: Eye,
            onClick: onViewDesign || (() => {}),
            variant: 'primary',
            badge: 'Nieuw'
          })
        }
        baseActions.push({
          id: 'approve',
          label: 'Goedkeuren',
          mobileLabel: 'Goedkeuren',
          description: 'Start bouw',
          icon: CheckCircle2,
          onClick: onApprove || (() => {}),
          variant: 'success'
        })
        baseActions.push({
          id: 'changes',
          label: 'Wijzigingen',
          mobileLabel: 'Wijzigen',
          description: 'Aanpassingen doorgeven',
          icon: RefreshCw,
          onClick: onRequestChanges || (() => {}),
          variant: 'warning'
        })
        break

      case 'revisie':
        if (hasDesignPreview) {
          baseActions.push({
            id: 'view-design',
            label: 'Bekijk aanpassingen',
            icon: Eye,
            onClick: onViewDesign || (() => {}),
            variant: 'primary'
          })
        }
        baseActions.push({
          id: 'message',
          label: 'Extra feedback',
          icon: MessageSquare,
          onClick: onSendMessage || (() => {}),
          variant: 'secondary'
        })
        break

      case 'payment':
        if (hasUnpaidInvoice && paymentUrl) {
          baseActions.push({
            id: 'pay',
            label: 'Betaal nu',
            description: 'Veilig via iDEAL',
            icon: CreditCard,
            onClick: () => window.open(paymentUrl, '_blank'),
            variant: 'primary',
            badge: 'Actie vereist'
          })
        }
        baseActions.push({
          id: 'message',
          label: 'Vraag over betaling',
          icon: MessageSquare,
          onClick: onSendMessage || (() => {}),
          variant: 'secondary'
        })
        break

      case 'domain':
        baseActions.push({
          id: 'domain-info',
          label: 'Domein informatie',
          description: 'Voeg je domeingegevens toe',
          icon: Globe,
          onClick: () => {},
          variant: 'primary'
        })
        if (hasDesignPreview) {
          baseActions.push({
            id: 'preview',
            label: 'Preview bekijken',
            icon: Eye,
            onClick: onViewDesign || (() => {}),
            variant: 'secondary'
          })
        }
        break

      case 'live':
        if (liveUrl) {
          baseActions.push({
            id: 'website',
            label: 'Bekijk website',
            mobileLabel: 'Website',
            description: 'Ga naar je site',
            icon: ExternalLink,
            onClick: () => window.open(liveUrl, '_blank'),
            variant: 'primary'
          })
        }
        baseActions.push({
          id: 'review',
          label: 'Laat review achter',
          mobileLabel: 'Review',
          description: '⭐ Help anderen',
          icon: Star,
          onClick: onLeaveReview || (() => {}),
          variant: 'success'
        })
        baseActions.push({
          id: 'message',
          label: 'Support nodig?',
          mobileLabel: 'Support',
          icon: MessageSquare,
          onClick: onSendMessage || (() => {}),
          variant: 'secondary'
        })
        break
    }

    return baseActions
  }

  const actions = getPhaseActions()

  const variantStyles = {
    primary: darkMode
      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0'
      : 'bg-blue-500 hover:bg-blue-600 text-white border-0',
    secondary: darkMode
      ? 'bg-gray-800/50 hover:bg-gray-800 text-white border border-gray-700'
      : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200',
    success: darkMode
      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0'
      : 'bg-green-500 hover:bg-green-600 text-white border-0',
    warning: darkMode
      ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
      : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
  }

  if (actions.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-3 sm:p-4 ${
        darkMode
          ? 'bg-gray-900/50 border-gray-800'
          : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      {/* Mobile: Horizontal scroll buttons */}
      <div className="sm:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`relative flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  variantStyles[action.variant || 'secondary']
                } ${action.disabled ? 'opacity-50' : ''}`}
              >
                {action.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {action.mobileLabel || action.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop: Full action cards */}
      <div className="hidden sm:block">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
          <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Snelle acties
          </h3>
        </div>

        <div className="grid gap-2">
          {actions.map((action, index) => {
            const Icon = action.icon
            
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`relative flex items-center gap-3 p-3 rounded-xl transition-all ${
                  variantStyles[action.variant || 'secondary']
                } ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {action.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full"
                  >
                    {action.badge}
                  </motion.span>
                )}

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  action.variant === 'primary' || action.variant === 'success'
                    ? 'bg-white/20'
                    : darkMode
                      ? 'bg-gray-700'
                      : 'bg-gray-100'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{action.label}</p>
                  {action.description && (
                    <p className={`text-xs mt-0.5 ${
                      action.variant === 'primary' || action.variant === 'success'
                        ? 'text-white/70'
                        : darkMode
                          ? 'text-gray-400'
                          : 'text-gray-500'
                    }`}>
                      {action.description}
                    </p>
                  )}
                </div>

                <ArrowRight className={`w-4 h-4 ${
                  action.variant === 'primary' || action.variant === 'success'
                    ? 'text-white/70'
                    : darkMode
                      ? 'text-gray-500'
                      : 'text-gray-400'
                }`} />
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
