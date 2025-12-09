import { ChevronDown } from 'lucide-react'

export default function FAQ(){
  const faqs = [
    {q:'Hoe snel kan mijn site live staan?', a:'Gemiddeld binnen 5 werkdagen voor een eenvoudige 3-pagina site.'},
    {q:'Is hosting inbegrepen?', a:'Ja, hosting en beveiliging zijn inbegrepen bij alle pakketten.'},
    {q:'Krijg ik ondersteuning?', a:'Ja, we bieden support en onderhoud als onderdeel van het abonnement.'}
  ]

  return (
    <section id="faq" className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold">Veelgestelde vragen</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((f,i)=> (
            <details key={i} className="p-4 bg-white rounded shadow-card">
              <summary className="flex items-center justify-between cursor-pointer">
                <span className="font-semibold">{f.q}</span>
                <ChevronDown />
              </summary>
              <p className="mt-3 text-sm text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
