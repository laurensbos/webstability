/**
 * Developer Dashboard - Quick Stats Header
 * Shows key metrics at a glance
 */

import { motion } from 'framer-motion'
import { TrendingUp, Users, CreditCard, FolderKanban } from 'lucide-react'
import type { Project } from './types'
import { PACKAGE_CONFIG } from './types'

interface QuickStatsProps {
  projects: Project[]
}

export default function QuickStats({ projects }: QuickStatsProps) {
  // Calculate stats
  const activeProjects = projects.filter(p => p.phase !== 'live').length
  const liveProjects = projects.filter(p => p.phase === 'live').length
  const awaitingPayment = projects.filter(p => p.paymentStatus === 'awaiting_payment' || (p.phase === 'feedback' && p.paymentStatus !== 'paid')).length
  const totalClients = new Set(projects.map(p => p.contactEmail)).size
  
  // Monthly revenue - using PACKAGE_CONFIG for consistent pricing
  const monthlyRevenue = projects
    .filter(p => p.paymentStatus === 'paid' && p.phase === 'live')
    .reduce((sum, p) => {
      return sum + (PACKAGE_CONFIG[p.package]?.price || 0)
    }, 0)

  const stats = [
    { 
      label: 'Actieve projecten', 
      value: activeProjects, 
      icon: FolderKanban, 
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    { 
      label: 'Live websites', 
      value: liveProjects, 
      icon: TrendingUp, 
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    { 
      label: 'Klanten', 
      value: totalClients, 
      icon: Users, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    { 
      label: 'MRR', 
      value: `€${monthlyRevenue}`, 
      icon: CreditCard, 
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      highlight: awaitingPayment > 0
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative bg-gradient-to-br from-gray-800 to-gray-850 rounded-2xl p-5 border-2 border-gray-700/50 hover:border-gray-600 transition-all duration-200 overflow-hidden group"
        >
          {/* Subtle gradient accent on hover */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color === 'text-purple-400' ? 'from-purple-500 via-pink-500 to-purple-500' : stat.color === 'text-green-400' ? 'from-green-500 via-emerald-500 to-green-500' : stat.color === 'text-blue-400' ? 'from-blue-500 via-cyan-500 to-blue-500' : 'from-emerald-500 via-teal-500 to-emerald-500'} opacity-0 group-hover:opacity-100 transition-opacity`} />
          
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color === 'text-purple-400' ? 'from-purple-500 to-pink-500' : stat.color === 'text-green-400' ? 'from-green-500 to-emerald-500' : stat.color === 'text-blue-400' ? 'from-blue-500 to-cyan-500' : 'from-emerald-500 to-teal-500'} flex items-center justify-center shadow-lg ${stat.color === 'text-purple-400' ? 'shadow-purple-500/30' : stat.color === 'text-green-400' ? 'shadow-green-500/30' : stat.color === 'text-blue-400' ? 'shadow-blue-500/30' : 'shadow-emerald-500/30'}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            </div>
          </div>
          
          {/* Highlight for pending payments */}
          {stat.highlight && awaitingPayment > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse shadow-lg shadow-amber-500/40">
              {awaitingPayment}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
