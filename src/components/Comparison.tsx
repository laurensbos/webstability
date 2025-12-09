import React from 'react'

export default function Comparison(){
  return (
    <section aria-labelledby="compare-heading" className="py-16 bg-white/2">
      <div className="max-w-6xl mx-auto px-6">
        <h2 id="compare-heading" className="text-2xl font-extrabold text-center">Waarom webstability beter is</h2>
        <p className="text-center text-slate-500 mt-2 mb-6">Vergelijk onze service met losse oplossingen en typische bureaus.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="pr-6 pb-3">Kenmerk</th>
                <th className="pr-6 pb-3">webstability</th>
                <th className="pr-6 pb-3">Klusbedrijf / DIY</th>
                <th className="pb-3">Groot bureau</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/6">
                <td className="py-3">Snel live</td>
                <td className="py-3 font-semibold">Binnen 1 week</td>
                <td className="py-3">Meerdere weken</td>
                <td className="py-3">Meerdere weken - maanden</td>
              </tr>
              <tr className="border-t border-white/6">
                <td className="py-3">Prijstransparantie</td>
                <td className="py-3 font-semibold">Eerlijke vaste prijzen</td>
                <td className="py-3">Onverwachte kosten</td>
                <td className="py-3">Hoog tarief</td>
              </tr>
              <tr className="border-t border-white/6">
                <td className="py-3">Hosting & security</td>
                <td className="py-3 font-semibold">Inbegrepen</td>
                <td className="py-3">Extra / niet inbegrepen</td>
                <td className="py-3">Inbegrepen (duurder)</td>
              </tr>
              <tr className="border-t border-white/6">
                <td className="py-3">Support</td>
                <td className="py-3 font-semibold">Prioritair + snel</td>
                <td className="py-3">Beperkt</td>
                <td className="py-3">Afhankelijk van contract</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <button onClick={()=>window.dispatchEvent(new CustomEvent('open-demo'))} className="btn-primary">Bekijk demo</button>
        </div>
      </div>
    </section>
  )
}
