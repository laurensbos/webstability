export default function LogosStrip(){
  const logos: string[] = []
  return (
    <section className="py-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white/6 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between gap-4">
          {logos.length > 0 ? (
            <div className="text-sm text-slate-600">Meer dan <strong>200</strong> ondernemers gingen je voor</div>
          ) : <div />}

          <div className="flex-1" />

          <div>
            <a
              href="#testimonials"
              className="inline-flex items-center gap-3 px-4 py-3 rounded-md bg-white/8 text-white shimmer-btn"
            >
              Bekijk klantcases
            </a>
          </div>
         </div>
       </div>
     </section>
   )
 }
