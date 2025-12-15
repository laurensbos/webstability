import { motion } from 'framer-motion'
import { MessageSquare, Palette, Rocket, HeartHandshake } from 'lucide-react'

const steps = [
	{
		icon: MessageSquare,
		step: '01',
		title: 'Klik op "Start nu"',
		description:
			'Deel je gegevens en wensen via ons simpele formulier. Binnen 24 uur nemen we contact met je op.',
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
		<section id="how-it-works" className="py-16 lg:py-32 bg-gray-50 relative">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-3xl mx-auto mb-8 lg:mb-20">
					<motion.span
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-3 lg:mb-4"
					>
						Simpel proces
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6"
					>
						In 4 stappen{' '}
						<span className="text-primary-600">
							online
						</span>
					</motion.h2>
				</div>

				{/* Mobile: Compact vertical list */}
				<div className="lg:hidden space-y-3">
					{steps.map((step, index) => (
						<motion.div
							key={step.step}
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
						>
							<div className="flex items-start gap-3">
								{/* Step number + Icon */}
								<div className="relative flex-shrink-0">
									<div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
										<step.icon className="w-5 h-5 text-primary-600" />
									</div>
									<span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
										{index + 1}
									</span>
								</div>
								
								{/* Content */}
								<div className="flex-1 min-w-0">
									<h3 className="text-gray-900 font-semibold text-base mb-1">
										{step.title}
									</h3>
									<p className="text-gray-600 text-sm leading-relaxed">
										{step.description}
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Desktop: Grid with connector lines */}
				<div className="hidden lg:grid lg:grid-cols-4 gap-8">
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
								<div className="absolute top-12 left-full w-full h-px bg-gradient-to-r from-primary-300 to-transparent z-0" />
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
