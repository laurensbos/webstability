export default function DeviceMock({ className = '' }: { className?: string }){
  function openDemo(){
    window.dispatchEvent(new CustomEvent('open-demo'))
  }

  return (
    <button onClick={openDemo} className={`svg-placeholder ${className} relative group focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-200 rounded-lg`} role="button" aria-label="Bekijk live demo">
      <svg width="100%" height="100%" viewBox="0 0 600 360" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className="dark:opacity-90">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0" stopColor="#7c3aed" stopOpacity="0.95" />
            <stop offset="1" stopColor="#06b6d4" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* device background */}
        <rect x="6" y="6" rx="18" width="588" height="348" className="fill-slate-50 dark:fill-gray-800 stroke-indigo-50 dark:stroke-gray-700" />

        {/* top nav */}
        <rect x="28" y="26" width="120" height="18" rx="6" className="fill-indigo-50 dark:fill-gray-700" />
        <rect x="160" y="26" width="320" height="18" rx="6" className="fill-white dark:fill-gray-700" />
        <rect x="496" y="26" width="56" height="18" rx="6" className="fill-indigo-50 dark:fill-gray-700" />

        {/* hero box */}
        <rect x="28" y="60" width="420" height="120" rx="10" className="fill-white dark:fill-gray-700" />
        <rect x="40" y="74" width="220" height="18" rx="4" className="fill-indigo-50 dark:fill-gray-600" />
        <rect x="40" y="100" width="160" height="14" rx="4" className="fill-slate-100 dark:fill-gray-600" />
        <rect x="280" y="100" width="120" height="34" rx="8" fill="url(#g1)" />

        {/* three feature tiles */}
        <rect x="28" y="194" width="168" height="60" rx="8" className="fill-white dark:fill-gray-700" />
        <rect x="206" y="194" width="168" height="60" rx="8" className="fill-white dark:fill-gray-700" />
        <rect x="384" y="194" width="168" height="60" rx="8" className="fill-white dark:fill-gray-700" />
        <rect x="40" y="212" width="40" height="10" rx="4" className="fill-indigo-50 dark:fill-gray-600" />
        <rect x="224" y="212" width="40" height="10" rx="4" className="fill-indigo-50 dark:fill-gray-600" />
        <rect x="402" y="212" width="40" height="10" rx="4" className="fill-indigo-50 dark:fill-gray-600" />

        {/* small footer */}
        <rect x="28" y="270" width="520" height="14" rx="6" className="fill-white dark:fill-gray-700" />

        {/* label badge */}
        <g>
          <rect x="36" y="36" width="84" height="20" rx="10" className="fill-slate-100 dark:fill-gray-600" />
          <text x="48" y="50" fontFamily="Inter, system-ui" fontSize="11" className="fill-slate-700 dark:fill-gray-300">Live preview</text>
        </g>

        {/* explanatory caption bottom-right */}
        <g>
          <rect x="404" y="30" width="156" height="26" rx="6" className="fill-white dark:fill-gray-700" opacity="0.9" />
          <text x="420" y="47" fontFamily="Inter, system-ui" fontSize="12" className="fill-slate-900 dark:fill-gray-200">Voorbeeldweergave — interactief</text>
        </g>
      </svg>

      {/* play overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white/85 dark:bg-gray-800/90 rounded-full p-3 shadow-lg opacity-95 transform transition-transform group-hover:scale-105" style={{pointerEvents: 'none'}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M5 3v18l15-9L5 3z" fill="#6d28d9" />
          </svg>
        </div>
      </div>

      <div className="mt-2 text-xs text-slate-500 dark:text-gray-400 sr-only md:not-sr-only">Klik om demo te starten</div>
    </button>
  )
}
