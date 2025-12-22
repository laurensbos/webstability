import { motion } from 'framer-motion'
import { Check, X, Clock, Zap, ArrowRight } from 'lucide-react'

// Gefocust op 5 key pijnpunten - sterker en overtuigender
const comparisons = [
	{
		category: 'Tijdsinvestering',
		icon: Clock,
		diy: { value: '50-200+ uur', bad: true },
		webstability: { value: '~2 uur intake', good: true },
	},
	{
		category: 'Live binnen',
		icon: Zap,
		diy: { value: 'Weken tot maanden', bad: true },
		webstability: { value: '7 dagen', good: true },
	},
	{
		category: 'Onderhoud & updates',
		icon: Zap,
		diy: { value: 'Zelf uitzoeken', bad: true },
		webstability: { value: 'Wij doen alles', good: true },
	},
	{
		category: 'Wijzigingen',
		icon: Zap,
		diy: { value: 'Zelf leren & doen', bad: true },
		webstability: { value: 'Onbeperkt inbegrepen', good: true },
	},
	{
		category: 'Resultaat',
		icon: Zap,
		diy: { value: 'Template-look', bad: true },
		webstability: { value: 'Professioneel design', good: true },
	},
]

export default function Comparison() {
	return (
		<section id="comparison" className="py-12 lg:py-20 bg-gray-50 dark:bg-gray-800/50">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-8 lg:mb-12">
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-4"
					>
						<Clock className="w-4 h-4" />
						Stop met tijd verspillen
					</motion.div>

					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3"
					>
						<span className="text-gray-900 dark:text-white">Zelf doen</span>{' '}
						<span className="text-primary-600">vs. Webstability</span>
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
						className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm sm:text-base"
					>
						Jij focust op je bedrijf. Wij regelen de rest.
					</motion.p>
				</div>

				{/* Mobile: Compact comparison cards */}
				<div className="lg:hidden">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
					>
						{/* Header row */}
						<div className="grid grid-cols-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
							<div className="p-3 text-xs font-medium text-gray-500 dark:text-gray-400"></div>
							<div className="p-3 text-center">
								<span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Zelf doen</span>
							</div>
							<div className="p-3 text-center bg-primary-50 dark:bg-primary-900/30">
								<span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
									Webstability
								</span>
							</div>
						</div>

						{/* Comparison rows */}
						{comparisons.map((item, index) => (
							<div
								key={index}
								className={`grid grid-cols-3 items-center ${
									index !== comparisons.length - 1
										? 'border-b border-gray-100 dark:border-gray-700'
										: ''
								}`}
							>
								<div className="p-3">
									<span className="text-xs font-medium text-gray-700 dark:text-gray-300">
										{item.category}
									</span>
								</div>
								<div className="p-3 text-center">
									<span className="text-xs text-red-500 flex items-center justify-center gap-1">
										<X className="w-3 h-3" />
										{item.diy.value}
									</span>
								</div>
								<div className="p-3 text-center bg-primary-50/50 dark:bg-primary-900/20">
									<span className="text-xs text-green-600 dark:text-green-400 font-medium">
										<Check className="w-3 h-3 inline mr-1" />
										{item.webstability.value}
									</span>
								</div>
							</div>
						))}
					</motion.div>

					{/* Mobile CTA */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.3 }}
						className="mt-6 text-center"
					>
						<a
							href="/start"
							className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors group"
						>
							Start vandaag nog
							<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</a>
						<p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
							Betaling pas na goedkeuring design
						</p>
					</motion.div>
				</div>

				{/* Desktop: Side by side cards */}
				<div className="hidden lg:grid lg:grid-cols-2 gap-8">
					{/* DIY Card */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-md"
					>
						<div className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
								<Clock className="w-6 h-6 text-gray-500" />
							</div>
							<div>
								<h3 className="font-bold text-xl text-gray-900 dark:text-white">Zelf doen</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400">Wix, WordPress, etc.</p>
							</div>
						</div>

						<ul className="space-y-4">
							{comparisons.map((item, index) => (
								<li key={index} className="flex items-start gap-3">
									<span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-red-100 dark:bg-red-900/30">
										<X className="w-3 h-3 text-red-500" />
									</span>
									<div>
										<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
											{item.category}
										</p>
										<p className="text-sm text-red-500">
											{item.diy.value}
										</p>
									</div>
								</li>
							))}
						</ul>

						<div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
							<p className="text-sm text-red-600 dark:text-red-400 font-medium">
								⏱️ 50-200+ uur van jouw tijd
							</p>
						</div>
					</motion.div>

					{/* Webstability Card */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-primary-500 shadow-lg shadow-primary-100 dark:shadow-primary-900/20"
					>
						<div className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
								<Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
							</div>
							<div>
								<h3 className="font-bold text-xl text-gray-900 dark:text-white">Webstability</h3>
								<p className="text-sm text-primary-600 dark:text-primary-400">Wij doen alles voor je</p>
							</div>
						</div>

						<ul className="space-y-4">
							{comparisons.map((item, index) => (
								<li key={index} className="flex items-start gap-3">
									<span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
										<Check className="w-3 h-3 text-green-600 dark:text-green-400" />
									</span>
									<div>
										<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
											{item.category}
										</p>
										<p className="text-sm text-green-600 dark:text-green-400">
											{item.webstability.value}
										</p>
									</div>
								</li>
							))}
						</ul>

						<div className="mt-6">
							<a
								href="/start"
								className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors group"
							>
								Start je project
								<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
							</a>
							<p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
								✓ Betaling pas na goedkeuring design
							</p>
						</div>
					</motion.div>
				</div>

				{/* Trust badges */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.4 }}
					className="mt-8 lg:mt-12 flex flex-wrap items-center justify-center gap-4 lg:gap-8 text-sm text-gray-500 dark:text-gray-400"
				>
					<span className="flex items-center gap-2">
						<Check className="w-4 h-4 text-green-500" />
						Geen verplichtingen
					</span>
					<span className="flex items-center gap-2">
						<Check className="w-4 h-4 text-green-500" />
						Maandelijks opzegbaar
					</span>
					<span className="flex items-center gap-2">
						<Check className="w-4 h-4 text-green-500" />
						Niet-goed-geld-terug
					</span>
				</motion.div>
			</div>
		</section>
	)
}
