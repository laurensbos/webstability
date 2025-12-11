export default function Logo(){
  return (
    <div className="flex items-center gap-3" aria-label="webstability">
      {/* small brand mark */}
      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-2)] flex items-center justify-center text-white font-semibold">ws</div>
      <span className="text-[var(--text)] font-semibold tracking-tight">webstability</span>
    </div>
  )
}
