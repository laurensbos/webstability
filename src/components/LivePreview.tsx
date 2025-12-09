import { motion } from 'framer-motion'

export type PreviewContent = {
  businessName?: string
  title?: string
  subtitle?: string
  cta?: string
  theme?: 'default' | 'modern'
}

export function LivePreview({
  content,
  onChange,
}: {
  content: PreviewContent
  onChange: (patch: Partial<PreviewContent>) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-3xl mx-auto p-6 rounded-2xl card"
    >
      <div className="flex items-start gap-6">
        <div className="flex-1">
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onChange({ businessName: e.currentTarget.textContent || '' })}
            className="text-sm text-[var(--muted)] font-medium"
            aria-label="Business name editable"
            role="textbox"
          >
            {content.businessName || 'Jouw Bedrijf'}
          </div>

          <h2
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onChange({ title: e.currentTarget.textContent || '' })}
            className="mt-2 text-2xl md:text-3xl font-extrabold text-[var(--text)] leading-tight"
            aria-label="Hero title editable"
            role="textbox"
          >
            {content.title || 'Moderne website die converteert'}
          </h2>

          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onChange({ subtitle: e.currentTarget.textContent || '' })}
            className="mt-3 text-sm text-[var(--muted)]"
            aria-label="Hero subtitle editable"
            role="textbox"
          >
            {content.subtitle || 'Klaar voor online succes — snel live, SEO-ready en mobiel geoptimaliseerd.'}
          </p>

          <div className="mt-5">
            <button
              onClick={() => onChange({ cta: content.cta || 'Start nu' })}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full btn-primary"
            >
              {content.cta || 'Start nu'}
            </button>
          </div>
        </div>

        <div className="w-40 h-28 rounded-lg bg-[rgba(255,255,255,0.02)] flex items-center justify-center">
          <div className="text-xs text-[var(--muted)]">Preview</div>
        </div>
      </div>
    </motion.div>
  )
}
