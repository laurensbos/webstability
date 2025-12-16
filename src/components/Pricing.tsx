import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { packages, trustBadges } from '../data/packages'
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

	return (
		<section id="pricing" className="py-16 lg:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
			<div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center max-w-3xl mx-auto mb-8 lg:mb-16">
					<motion.span
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-3 lg:mb-4"
					>
						Pakketten
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6"
					>
						Kies het pakket dat{' '}
						<span className="text-primary-600">bij je past</span>
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
						className="text-gray-600 dark:text-gray-400 text-base lg:text-lg"
					>
						Alle pakketten inclusief hosting, onderhoud en support. Geen verborgen kosten.
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

				{/* What's always included - combined with trust badges */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center space-y-3 mt-6 lg:mt-0"
				>
					{/* Trust badges - horizontal scroll on mobile, flex on desktop */}
					<div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 lg:gap-x-6 lg:gap-y-2">
						{trustBadges.map((badge) => (
							<span key={badge} className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
								<Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
								<span className="whitespace-nowrap">{badge}</span>
							</span>
						))}
					</div>
					<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-4">
						Alle prijzen zijn inclusief 21% BTW
						<span className="hidden sm:inline"> • </span>
						<br className="sm:hidden" />
						<span className="text-primary-600 dark:text-primary-400 font-medium">Als ondernemer krijg je de BTW terug via je belastingaangifte</span>
					</p>
				</motion.div>
			</div>
		</section>
	)
}
