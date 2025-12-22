import { motion } from 'framer-motion'
import { Check, ArrowRight, Sparkles, Shield, Clock, CreditCard } from 'lucide-react'
import { packages } from '../data/packages'
import { useState, useRef, useEffect } from 'react'

export default function Pricing() {
	const scrollRef = useRef<HTMLDivElement>(null)
	const [activeIndex, setActiveIndex] = useState(1) // Start met Professional (meest gekozen)

	useEffect(() => {
		const el = scrollRef.current
		if (!el) return
		
		// Scroll to professional package on mount (mobile)
		if (window.innerWidth < 1024) {
			const cardWidth = 280 + 16 // card width + gap
			el.scrollLeft = cardWidth * 1 // Scroll to second card (professional)
		}
	}, [])

	// Track active card on scroll
	const handleScroll = () => {
		if (!scrollRef.current) return
		const cardWidth = 280 + 16
		const index = Math.round(scrollRef.current.scrollLeft / cardWidth)
		setActiveIndex(Math.min(index, packages.length - 1))
	}

	const riskFreeFeatures = [
		{
			icon: Sparkles,
			title: 'Gratis design',
			description: 'Wij maken eerst een ontwerp. Vind je het niks? Dan stop je gewoon.'
		},
		{
			icon: CreditCard,
			title: 'Betaal na goedkeuring',
			description: 'Pas na goedkeuring van het design betaal je. Geen cent ervoor.'
		},
		{
			icon: Shield,
			title: '14 dagen geld-terug',
			description: 'Niet tevreden na lancering? Volledige terugbetaling, geen vragen.'
		},
		{
			icon: Clock,
			title: 'Maandelijks opzegbaar',
			description: 'Na 3 maanden kun je elk moment stoppen. Geen lange contracten.'
		}
	]

	return (
		<section id="pricing" className="py-16 lg:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
			{/* Background decoration */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-50/30 via-blue-50/20 to-emerald-50/30 dark:from-primary-900/10 dark:via-blue-900/5 dark:to-emerald-900/10 rounded-full blur-3xl" />
			</div>

			<div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Risk-Free Section - Above pricing */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="mb-12 lg:mb-16"
				>
					<div className="text-center mb-8">
						<span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-200/50 dark:border-emerald-700/50 rounded-full px-4 py-2 mb-4">
							<Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
							<span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">100% Vrijblijvend starten</span>
						</span>
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
							Probeer zonder{' '}
							<span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">risico</span>
						</h2>
						<p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
							We maken eerst een design op maat. Pas als je 100% tevreden bent, ga je betalen.
						</p>
					</div>

					{/* Risk-free features grid */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
						{riskFreeFeatures.map((feature, index) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
								className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl p-4 lg:p-5 text-center hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-lg hover:shadow-emerald-100 dark:hover:shadow-emerald-900/20 transition-all"
							>
								<div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 rounded-xl flex items-center justify-center mx-auto mb-3">
									<feature.icon className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600 dark:text-emerald-400" />
								</div>
								<h3 className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base mb-1">
									{feature.title}
								</h3>
								<p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
									{feature.description}
								</p>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* Divider */}
				<div className="flex items-center gap-4 mb-12 lg:mb-16">
					<div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
					<span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Kies je pakket</span>
					<div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
				</div>

				{/* Header */}
				<div className="text-center max-w-3xl mx-auto mb-8 lg:mb-12">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
					>
						Transparante{' '}
						<span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">maandprijzen</span>
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="text-gray-600 dark:text-gray-400 text-base lg:text-lg"
					>
						Inclusief hosting, SSL, onderhoud, updates en support. Geen verrassingen.
					</motion.p>
				</div>

				{/* Mobile: Horizontal scroll carousel */}
				<div className="lg:hidden relative">
					{/* Cards container */}
					<div
						ref={scrollRef}
						onScroll={handleScroll}
						className="flex gap-4 overflow-x-auto pb-4 px-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
						style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
					>
						{packages.map((pkg, index) => (
							<motion.div
								key={pkg.id}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
								className={`flex-shrink-0 w-[280px] snap-center relative rounded-2xl p-5 flex flex-col bg-white dark:bg-gray-800 transition-all duration-300 ${
									pkg.popular
										? 'border-2 border-primary-500 shadow-lg shadow-primary-100 dark:shadow-primary-900/30 mt-4'
										: pkg.id === 'webshop'
											? 'border-2 border-emerald-500 shadow-lg shadow-emerald-100 dark:shadow-emerald-900/30'
											: 'border border-gray-200 dark:border-gray-700'
								}`}
							>
								{pkg.popular && (
									<span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap z-10">
										Meest gekozen
									</span>
								)}
								
								{/* Package name & tagline */}
								<div className="mb-3">
									<h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
										{pkg.name}
									</h3>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{pkg.tagline}
									</p>
								</div>
								
								{/* Price */}
								<div className="mb-4">
									<div className="flex items-baseline gap-1">
										<span className="text-3xl font-bold text-gray-900 dark:text-white">
											€{pkg.price}
										</span>
										<span className="text-sm text-gray-500 dark:text-gray-400">/maand</span>
									</div>
									<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
										+ €{pkg.setupFee} eenmalige opstartkosten
									</p>
								</div>
								
								{/* Features list - compact for mobile */}
								<ul className="space-y-2 mb-4 flex-grow">
									{pkg.features.slice(0, 5).map((feature, i) => (
										<li key={i} className="flex items-start gap-2">
											<Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-500" />
											<span className="text-sm text-gray-600 dark:text-gray-300">
												{feature}
											</span>
										</li>
									))}
									{pkg.features.length > 5 && (
										<li className="text-xs text-gray-400 pl-6">
											+{pkg.features.length - 5} meer...
										</li>
									)}
								</ul>
								
								{/* CTA Button */}
								<a
									href={`/start?pakket=${pkg.id}`}
									className={`w-full py-3 px-4 rounded-xl font-semibold text-sm text-center transition-all flex items-center justify-center gap-2 ${
										pkg.popular
											? 'bg-primary-500 hover:bg-primary-600 text-white shadow-md shadow-primary-200 dark:shadow-primary-900/30'
											: pkg.id === 'webshop'
												? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/30'
												: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
									}`}
								>
									Kies {pkg.name}
									<ArrowRight className="w-4 h-4" />
								</a>
							</motion.div>
						))}
					</div>

					{/* Dot indicators */}
					<div className="flex justify-center gap-2 mt-4">
						{packages.map((_, index) => (
							<button
								key={index}
								onClick={() => {
									if (!scrollRef.current) return
									const cardWidth = 280 + 16
									scrollRef.current.scrollTo({ left: cardWidth * index, behavior: 'smooth' })
								}}
								className={`w-2 h-2 rounded-full transition-all ${
									index === activeIndex 
										? 'bg-primary-500 w-6' 
										: 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
								}`}
								aria-label={`Ga naar pakket ${index + 1}`}
							/>
						))}
					</div>
				</div>

				{/* Desktop: Grid layout */}
				<div className="hidden lg:grid lg:grid-cols-4 gap-6 mb-16">
					{packages.map((pkg, index) => (
						<motion.div
							key={pkg.id}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							className={`relative rounded-2xl p-6 flex flex-col bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
								pkg.popular
									? 'border-2 border-primary-500 shadow-lg shadow-primary-100 dark:shadow-primary-900/30'
									: pkg.id === 'webshop'
										? 'border-2 border-emerald-500 shadow-lg shadow-emerald-100 dark:shadow-emerald-900/30'
										: 'border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
							}`}
						>
							{pkg.popular && (
								<span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-medium px-3 py-1 rounded-full">
									Meest gekozen
								</span>
							)}
							
							{/* Package name & tagline */}
							<div className="mb-4">
								<h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
									{pkg.name}
								</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{pkg.tagline}
								</p>
							</div>
							
							{/* Price */}
							<div className="mb-6">
								<div className="flex items-baseline gap-1">
									<span className="text-4xl font-bold text-gray-900 dark:text-white">
										€{pkg.price}
									</span>
									<span className="text-sm text-gray-500 dark:text-gray-400">/maand</span>
								</div>
								<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
									+ €{pkg.setupFee} eenmalige opstartkosten
								</p>
							</div>
							
							{/* Features list */}
							<ul className="space-y-3 mb-6 flex-grow">
								{pkg.features.map((feature, i) => (
									<li key={i} className="flex items-start gap-2">
										<Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-500" />
										<span className="text-sm text-gray-600 dark:text-gray-300">
											{feature}
										</span>
									</li>
								))}
							</ul>
							
							{/* CTA Button */}
							<a
								href={`/start?pakket=${pkg.id}`}
								className={`w-full py-3 px-4 rounded-xl font-semibold text-sm text-center transition-all flex items-center justify-center gap-2 ${
									pkg.popular
										? 'bg-primary-500 hover:bg-primary-600 text-white shadow-md shadow-primary-200 dark:shadow-primary-900/30'
										: pkg.id === 'webshop'
											? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/30'
											: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
								}`}
							>
								Kies {pkg.name}
								<ArrowRight className="w-4 h-4" />
							</a>
						</motion.div>
					))}
				</div>

				{/* BTW notice */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mt-8 lg:mt-12"
				>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Alle prijzen zijn inclusief 21% BTW •{' '}
						<span className="text-primary-600 dark:text-primary-400 font-medium">
							Als ondernemer krijg je de BTW terug via je belastingaangifte
						</span>
					</p>
				</motion.div>
			</div>
		</section>
	)
}
