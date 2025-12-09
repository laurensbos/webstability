import React from 'react'
import { User } from 'lucide-react'

type Props = {
  title: string
  description?: string
  subtitle?: string
  metric?: string
}

export default function CaseCard({ title, description, subtitle, metric }: Props){
  return (
    <article className="bg-[rgba(255,255,255,0.02)] p-4 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[linear-gradient(135deg,#2b2a34,#1a1719)] flex items-center justify-center text-[#ffd98a]"><User size={16} /></div>
        <div>
          <div className="font-semibold text-[var(--brand-dark)]">{title}</div>
          <div className="text-xs text-[var(--muted)]">{description || subtitle || 'Meer omzet door betere presentatie'}</div>
        </div>
      </div>
      <div className="mt-3 text-xs text-[var(--muted)]">{metric || '+20% conversie'}</div>
    </article>
  )
}
