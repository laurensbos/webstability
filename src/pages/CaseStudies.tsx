import CaseCard from '../components/CaseCard'

export default function CaseStudies(){
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold">Succesverhalen</h1>
      <p className="mt-2 text-slate-500">Kleine ondernemers die groeiden dankzij hun nieuwe website.</p>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <CaseCard title="Bakkerij De Ochtend" description="+25% reserveringen in 2 maanden" />
        <CaseCard title="Studio Jansen" description="Nieuwe klanten via portfolio" />
        <CaseCard title="Café Zora" description="Online bestellingen & reserveringen" />
      </div>
    </main>
  )
}
