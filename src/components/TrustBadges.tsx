import { CheckCircle, Lock, Zap, MessageCircle } from 'lucide-react'

export default function TrustBadges({ compact = false }: { compact?: boolean }){
  if(compact){
    return (
      <div className="trust-row" aria-hidden>
        <div className="trust-item">
          <div className="trust-icon"><CheckCircle size={16} className="text-[var(--brand-500)]" /></div>
          <div>99.9% uptime</div>
        </div>
        <div className="trust-item">
          <div className="trust-icon"><Lock size={16} className="text-[var(--brand-500)]" /></div>
          <div>SSL & dagelijkse backups</div>
        </div>
        <div className="trust-item">
          <div className="trust-icon"><Zap size={16} className="text-[var(--brand-500)]" /></div>
          <div>Snelle hosting (CDN)</div>
        </div>
        <div className="trust-item">
          <div className="trust-icon"><MessageCircle size={16} className="text-[var(--brand-500)]" /></div>
          <div>Support binnen 24 uur</div>
        </div>
      </div>
    )
  }

  return (
    <section aria-hidden className="py-4 bg-white/2">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg feature-icon-bg"><CheckCircle size={18} className="text-[var(--brand-500)]" /></div>
          <div>99.9% uptime</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg feature-icon-bg"><Lock size={18} className="text-[var(--brand-500)]" /></div>
          <div>SSL & dagelijkse backups</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg feature-icon-bg"><Zap size={18} className="text-[var(--brand-500)]" /></div>
          <div>Snelle hosting (CDN)</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg feature-icon-bg"><MessageCircle size={18} className="text-[var(--brand-500)]" /></div>
          <div>Support binnen 24 uur</div>
        </div>
      </div>
    </section>
  )
}
