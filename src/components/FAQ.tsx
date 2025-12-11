import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
	{
		question: 'Wat zijn de opstartkosten?',
		answer:
			'Voor websites betaal je eenmalig €99 opstartkosten, voor webshops is dit €199. Daarna betaal je alleen het maandelijkse bedrag. Hosting, SSL-certificaat, domeinbeheer en onderhoud zijn allemaal inbegrepen. Let op: tijdens onze Nieuwjaarsactie zijn de opstartkosten tijdelijk gratis!',
	},
	{
		question: 'Hoe lang duurt het voordat mijn website online staat?',
		answer:
			'Je website staat binnen 7 werkdagen online. Na ons eerste gesprek ontvang je binnen 5 dagen een eerste ontwerp. Na jouw goedkeuring gaat de website direct live.',
	},
	{
		question: 'Kan ik tussentijds opzeggen?',
		answer:
			'Ja, na de eerste 3 maanden kun je maandelijks opzeggen. We geloven in onze service en willen dat je blijft omdat je tevreden bent, niet omdat je vastzit aan een contract.',
	},
	{
		question: 'Hoeveel aanpassingen kan ik per maand doen?',
		answer:
			'Dit hangt af van je pakket. Bij Starter kun je 1 aanpassing per maand doen, bij Professioneel zijn tekstaanpassingen onbeperkt, en bij Business heb je volledige flexibiliteit met een dedicated accountmanager.',
	},
	{
		question: 'Kan ik mijn eigen domeinnaam gebruiken?',
		answer:
			'Zeker! Je kunt je bestaande domein gebruiken of wij helpen je met het registreren van een nieuw domein. Dit is bij alle pakketten inbegrepen.',
	},
	{
		question: 'Wat als ik niet tevreden ben met het ontwerp?',
		answer:
			'Je ontvangt eerst een conceptontwerp ter goedkeuring. We blijven aanpassen tot je 100% tevreden bent. Daarnaast heb je 14 dagen niet-goed-geld-terug garantie.',
	},
]

export default function FAQ() {
	const [openIndex, setOpenIndex] = useState<number | null>(0)

	return (
		<section id="faq" className="py-24 lg:py-32 bg-gray-50 relative">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-16">
					<motion.span
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-4"
					>
						Veelgestelde vragen
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900"
					>
						Heb je vragen?
					</motion.h2>
				</div>

				{/* FAQ items */}
				<div className="space-y-4">
					{faqs.map((faq, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.05 }}
							className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm"
						>
							<button
								onClick={() =>
									setOpenIndex(openIndex === index ? null : index)
								}
								className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
							>
								<span className="text-gray-900 font-medium pr-8">
									{faq.question}
								</span>
								<span className="flex-shrink-0 text-primary-500">
									{openIndex === index ? (
										<Minus className="w-5 h-5" />
									) : (
										<Plus className="w-5 h-5" />
									)}
								</span>
							</button>

							<AnimatePresence>
								{openIndex === index && (
									<motion.div
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: 'auto', opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
										<div className="px-6 pb-6 text-gray-600 leading-relaxed">
											{faq.answer}
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					))}
				</div>

				{/* CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mt-12"
				>
					<p className="text-gray-500 mb-4">Staat je vraag er niet bij?</p>
					<a
						href="mailto:info@webstability.nl"
						className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
					>
						Neem contact op
						<span>→</span>
					</a>
				</motion.div>
			</div>
		</section>
	)
}
