import { motion } from 'framer-motion'
import { Check, ArrowRight, Shield } from 'lucide-react'

const plans = [
	{
		id: 'starter',
		name: 'Starter',
		description: 'Perfect voor ZZP\'ers en starters',
		price: '79',
		popular: false,
		features: [
			'Professionele one-page website',
			'Mobiel responsive design',
			'SSL-certificaat & hosting',
			'Basis SEO optimalisatie',
			'1 wijziging per maand',
			'E-mail support',
		],
		cta: 'Start met Starter',
	},
	{
		id: 'professional',
		name: 'Professioneel',
		description: 'Voor groeiende ondernemers',
		price: '149',
		popular: true,
		features: [
			'Uitgebreide multi-page website',
			'Mobiel responsive design',
			'SSL-certificaat & hosting',
			'Geavanceerde SEO',
			'Contactformulier & integraties',
			'Onbeperkte tekstaanpassingen',
			'Google Analytics dashboard',
			'Prioriteit support',
		],
		cta: 'Start met Professioneel',
	},
	{
		id: 'business',
		name: 'Business',
		description: 'Voor gevestigde bedrijven',
		price: '249',
		popular: false,
		features: [
			'Alles uit Professioneel',
			'Blog of nieuws sectie',
			'Webshop integratie mogelijk',
			'Maandelijks rapport',
			'A/B testing',
			'Dedicated accountmanager',
			'24/7 support',
		],
		cta: 'Start met Business',
	},
]

export default function Pricing() {
	return (
		<section id="pricing" className="py-24 lg:py-32 bg-gray-50 relative overflow-hidden">
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center max-w-3xl mx-auto mb-16">
					<motion.span
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-4"
					>
						Transparante prijzen
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
					>
						Één prijs, alles inbegrepen
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
						className="text-gray-600 text-lg"
					>
						Geen verborgen kosten, geen verrassingen. Eenmalige opstartkosten vanaf €99.
						Maandelijks opzegbaar na de eerste 3 maanden.
					</motion.p>
				</div>

				{/* Pricing cards */}
				<div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
					{plans.map((plan, index) => (
						<motion.div
							key={plan.name}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							className={`relative rounded-2xl ${
								plan.popular
									? 'bg-white border-2 border-primary-500 shadow-xl shadow-primary-500/10 lg:scale-105'
									: 'bg-white border border-gray-200 shadow-lg shadow-gray-200/50'
							}`}
						>
							{plan.popular && (
								<div className="absolute -top-4 left-1/2 -translate-x-1/2">
									<span className="bg-primary-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg shadow-primary-500/25">
										Meest gekozen
									</span>
								</div>
							)}

							<div className="p-8">
								<h3 className="text-gray-900 font-bold text-2xl mb-2">
									{plan.name}
								</h3>
								<p className="text-gray-500 text-sm mb-6">
									{plan.description}
								</p>

								<div className="flex items-baseline gap-1 mb-2">
									<span className="text-gray-400 text-lg">€</span>
									<span className="text-gray-900 font-bold text-5xl">
										{plan.price}
									</span>
									<span className="text-gray-400">/maand</span>
								</div>
								<p className="text-gray-400 text-xs mb-6">excl. BTW</p>

								<ul className="space-y-4 mb-8">
									{plan.features.map((feature) => (
										<li key={feature} className="flex items-start gap-3">
											<div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
												<Check className="w-3 h-3 text-green-600" />
											</div>
											<span className="text-gray-600 text-sm">{feature}</span>
										</li>
									))}
								</ul>

								<a
									href={`/start?pakket=${plan.id}`}
									className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 group ${
										plan.popular
											? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5'
											: 'bg-gray-900 hover:bg-gray-800 text-white'
									}`}
								>
									{plan.cta}
									<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
								</a>
							</div>
						</motion.div>
					))}
				</div>

				{/* Trust badges */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="flex flex-wrap justify-center gap-8 mt-16"
				>
					<div className="flex items-center gap-2 text-gray-600 text-sm">
						<div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
							<Check className="w-4 h-4 text-primary-600" />
						</div>
						<span>Eenmalig vanaf €99</span>
					</div>
					<div className="flex items-center gap-2 text-gray-600 text-sm">
						<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
							<Check className="w-4 h-4 text-green-600" />
						</div>
						<span>Maandelijks opzegbaar</span>
					</div>
					<div className="flex items-center gap-2 text-gray-600 text-sm">
						<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
							<Shield className="w-4 h-4 text-green-600" />
						</div>
						<span>14 dagen niet-goed-geld-terug</span>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
