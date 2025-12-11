import { motion } from 'framer-motion'
import { MessageSquare, Palette, Rocket, HeartHandshake } from 'lucide-react'

const steps = [
	{
		icon: MessageSquare,
		step: '01',
		title: 'Gratis intakegesprek',
		description:
			'In een kort gesprek van 15 minuten ontdekken we jouw wensen, doelgroep en doelen. Volledig vrijblijvend.',
	},
	{
		icon: Palette,
		step: '02',
		title: 'Design binnen 5 dagen',
		description:
			'Je ontvangt een volledig uitgewerkt ontwerp. Niet tevreden? We passen aan tot het perfect is.',
	},
	{
		icon: Rocket,
		step: '03',
		title: 'Live binnen 7 dagen',
		description: 'Na jouw goedkeuring gaat de website direct online. Inclusief hosting, SSL en domein.',
	},
	{
		icon: HeartHandshake,
		step: '04',
		title: 'Doorlopende support',
		description:
			'Wij blijven je partner. Aanpassingen, vragen of nieuwe ideeën? Wij staan altijd voor je klaar.',
	},
]

export default function HowItWorks() {
	return (
		<section id="how-it-works" className="py-24 lg:py-32 bg-gray-50 relative">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
					<motion.span
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-4"
					>
						Hoe het werkt
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
					>
						Van idee naar website{' '}
						<span className="text-primary-600">
							in 7 dagen
						</span>
					</motion.h2>
				</div>

				{/* Steps */}
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					{steps.map((step, index) => (
						<motion.div
							key={step.step}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.15 }}
							className="relative h-full"
						>
							{/* Connector line */}
							{index < steps.length - 1 && (
								<div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-primary-300 to-transparent z-0" />
							)}

							<div className="relative z-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col">
								{/* Step number */}
								<div className="text-primary-100 font-bold text-6xl mb-4">
									{step.step}
								</div>

								{/* Icon */}
								<div className="inline-flex p-3 bg-primary-100 rounded-xl mb-4">
									<step.icon className="w-6 h-6 text-primary-600" />
								</div>

								<h3 className="text-gray-900 font-semibold text-xl mb-3">
									{step.title}
								</h3>

								<p className="text-gray-600 leading-relaxed flex-1">
									{step.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
