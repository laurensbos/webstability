/**
 * Developer Dashboard - Quick Stats Header
 * Shows key metrics at a glance
 */

import { motion } from 'framer-motion'
import { TrendingUp, Users, CreditCard, FolderKanban } from 'lucide-react'
import type { Project } from './types'

interface QuickStatsProps {
  projects: Project[]
}

export default function QuickStats({ projects }: QuickStatsProps) {
  // Calculate stats
  const activeProjects = projects.filter(p => p.phase !== 'live').length
  const liveProjects = projects.filter(p => p.phase === 'live').length
  const awaitingPayment = projects.filter(p => p.paymentStatus === 'awaiting_payment' || (p.phase === 'design_approved' && p.paymentStatus !== 'paid')).length
  const totalClients = new Set(projects.map(p => p.contactEmail)).size
  
  // Monthly revenue (simple calculation)
  const monthlyRevenue = projects
    .filter(p => p.paymentStatus === 'paid')
    .reduce((sum, p) => {
      const prices = { starter: 29, professional: 49, business: 79, webshop: 99 }
      return sum + (prices[p.package] || 0)
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="relative bg-gray-800/50 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
          
          {/* Highlight for pending payments */}
          {stat.highlight && awaitingPayment > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
              {awaitingPayment}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
