import { motion } from 'framer-motion'
import { Check, ArrowRight, Sparkles, Shield, Clock, CreditCard, Zap } from 'lucide-react'
import { usePackages } from '../hooks/usePackages'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function Pricing() {
	const { t } = useTranslation()
	const { packages, getDeliveryText } = usePackages()
	const scrollRef = useRef<HTMLDivElement>(null)
	const [activeIndex, setActiveIndex] = useState(1) // Start met Professional (meest gekozen)

	useEffect(() => {
		const el = scrollRef.current
		if (!el) return
		
		// Scroll to professional package on mount (mobile)
		if (window.innerWidth < 1024) {
			const cardWidth = 300 + 16 // card width + gap
			el.scrollLeft = cardWidth * 1 // Scroll to second card (professional)
		}
	}, [])

	// Track active card on scroll
	const handleScroll = () => {
		if (!scrollRef.current) return
		const cardWidth = 300 + 16
		const index = Math.round(scrollRef.current.scrollLeft / cardWidth)
		setActiveIndex(Math.min(index, packages.length - 1))
	}

	const riskFreeFeatures = [
		{
			icon: Sparkles,
			title: t('pricing.riskFree.freeDesign.title'),
			description: t('pricing.riskFree.freeDesign.description')
		},
		{
			icon: CreditCard,
			title: t('pricing.riskFree.payAfter.title'),
			description: t('pricing.riskFree.payAfter.description')
		},
		{
			icon: Shield,
			title: t('pricing.riskFree.moneyBack.title'),
			description: t('pricing.riskFree.moneyBack.description')
		},
		{
			icon: Clock,
			title: t('pricing.riskFree.cancelAnytime.title'),
			description: t('pricing.riskFree.cancelAnytime.description')
		}
	]

	return (
		<section id="pricing" className="py-20 lg:py-28 bg-white dark:bg-gray-900 relative overflow-hidden">
			{/* Background decoration - Enhanced */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-primary-50/40 via-blue-50/30 to-emerald-50/40 dark:from-primary-900/15 dark:via-blue-900/10 dark:to-emerald-900/15 rounded-full blur-3xl" />
				<div className="absolute top-20 -left-20 w-[300px] h-[300px] bg-gradient-to-br from-primary-400/10 to-blue-400/10 rounded-full blur-3xl" />
				<div className="absolute bottom-20 -right-20 w-[400px] h-[400px] bg-gradient-to-br from-emerald-400/10 to-green-400/10 rounded-full blur-3xl" />
			</div>

			<div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Risk-Free Section - Above pricing - Enhanced */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="mb-14 lg:mb-20"
				>
					<div className="text-center mb-10">
						<motion.span 
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border-2 border-emerald-200/50 dark:border-emerald-700/50 rounded-full px-5 py-2.5 mb-5 shadow-lg shadow-emerald-100/50 dark:shadow-emerald-900/20"
						>
							<Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
							<span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{t('pricing.riskFree.badge')}</span>
						</motion.span>
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
							{t('pricing.riskFree.title')}{' '}
							<span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{t('pricing.riskFree.titleHighlight')}</span>
						</h2>
						<p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
							{t('pricing.riskFree.subtitle')}
						</p>
					</div>

					{/* Risk-free features grid - Enhanced with gradients and shadows */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
						{riskFreeFeatures.map((feature, index) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
								whileHover={{ y: -4, transition: { duration: 0.2 } }}
								className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-2xl p-4 lg:p-6 text-center shadow-lg hover:shadow-xl transition-all overflow-hidden"
							>
								{/* Gradient accent line at top */}
								<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
								
								<div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3 lg:mb-4 shadow-lg shadow-emerald-500/25">
									<feature.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
								</div>
								<h3 className="font-bold text-gray-900 dark:text-white text-sm lg:text-base mb-1 lg:mb-2">
									{feature.title}
								</h3>
								<p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
									{feature.description}
								</p>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* Divider - Enhanced */}
				<div className="flex items-center gap-6 mb-12 lg:mb-16">
					<div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
					<span className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('pricing.choosePackage')}</span>
					<div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
				</div>

				{/* Header - Enhanced */}
				<div className="text-center max-w-3xl mx-auto mb-10 lg:mb-14">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-5"
					>
						{t('pricing.title')}{' '}
						<span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">{t('pricing.titleHighlight')}</span>
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="text-gray-600 dark:text-gray-400 text-lg lg:text-xl mb-5"
					>
						{t('pricing.subtitle')}
					</motion.p>
				</div>

				{/* Mobile: Horizontal scroll carousel */}
				<div className="lg:hidden relative">
					{/* Swipe hint */}
					<div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-3">
						<span>{t('pricing.swipeHint')}</span>
					</div>

					{/* Cards container - pt-5 voor ruimte boven "Meest gekozen" badge */}
					<div
						ref={scrollRef}
						onScroll={handleScroll}
						className="flex gap-4 overflow-x-auto pt-5 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
						style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
					>
						{packages.map((pkg, index) => (
							<motion.div
								key={pkg.id}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
								whileHover={{ y: -6, transition: { duration: 0.2 } }}
								className={`flex-shrink-0 w-[300px] snap-center relative rounded-2xl p-5 flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-all duration-300 overflow-hidden ${
									pkg.popular
										? 'border-2 border-primary-500 shadow-xl shadow-primary-100 dark:shadow-primary-900/30'
										: 'border-2 border-gray-100 dark:border-gray-700'
								}`}
							>
								{/* Gradient accent line at top */}
								<div className={`absolute top-0 left-0 right-0 h-1 ${
									pkg.popular 
										? 'bg-gradient-to-r from-primary-500 via-blue-500 to-primary-500' 
										: 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500'
								}`} />
								
								{pkg.popular && (
									<span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap z-10 shadow-lg shadow-primary-500/25">
										{t('pricing.mostChosen')}
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
										<span className="text-sm text-gray-500 dark:text-gray-400">{t('pricing.perMonth')}</span>
									</div>
									<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
										+ €{pkg.setupFee} {t('pricing.oneTimeSetup')}
									</p>
								</div>

								{/* Delivery time badge - Enhanced */}
								<div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 rounded-xl border border-primary-200/50 dark:border-primary-700/50">
									<div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center">
										<Zap className="w-3.5 h-3.5 text-white" />
									</div>
									<span className="text-xs font-bold text-primary-700 dark:text-primary-300">
										{getDeliveryText(pkg.deliveryDays)}
									</span>
								</div>
								
								{/* Features list - Enhanced */}
								<ul className="space-y-2.5 mb-4 flex-grow">
									{pkg.features.map((feature, i) => (
										<li key={i} className="flex items-start gap-2.5">
											<div className="w-5 h-5 bg-gradient-to-br from-primary-500 to-blue-500 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm shadow-primary-500/20">
												<Check className="w-3 h-3 text-white" />
											</div>
											<span className="text-sm text-gray-600 dark:text-gray-300">
												{feature}
											</span>
										</li>
									))}
								</ul>

								{/* Support & revisions info */}
								<div className="text-xs text-gray-500 dark:text-gray-400 mb-4 pt-3 border-t border-gray-100 dark:border-gray-700">
									<div className="flex justify-between mb-1">
										<span>{t('pricing.supportResponseTime')}:</span>
										<span className="font-medium text-gray-700 dark:text-gray-300">{pkg.supportResponseTime}</span>
									</div>
									<div className="flex justify-between">
										<span>{t('pricing.revisionsPerMonth')}:</span>
										<span className="font-medium text-gray-700 dark:text-gray-300">
											{pkg.revisionsPerMonth === 'unlimited' ? t('pricing.unlimited') : pkg.revisionsPerMonth}
										</span>
									</div>
								</div>
								
								{/* CTA Button - Enhanced */}
								<a
									href={`/start?pakket=${pkg.id}`}
									className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-center transition-all flex items-center justify-center gap-2 ${
										pkg.popular
											? 'bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white shadow-lg shadow-primary-500/25'
											: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-900 dark:text-white'
									}`}
								>
									{t('pricing.choose')} {pkg.name}
									<ArrowRight className="w-4 h-4" />
								</a>
							</motion.div>
						))}
					</div>

					{/* Dot indicators - Enhanced */}
					<div className="flex justify-center gap-2.5 mt-5 mb-8">
						{packages.map((_, index) => (
							<button
								key={index}
								onClick={() => {
									if (!scrollRef.current) return
									const cardWidth = 300 + 16
									scrollRef.current.scrollTo({ left: cardWidth * index, behavior: 'smooth' })
								}}
								className={`h-2.5 rounded-full transition-all duration-300 ${
									index === activeIndex 
										? 'bg-gradient-to-r from-primary-500 to-blue-500 w-8 shadow-md shadow-primary-500/30' 
										: 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 w-2.5'
								}`}
								aria-label={`Ga naar pakket ${index + 1}`}
							/>
						))}
					</div>
				</div>

				{/* Desktop: Grid layout - Enhanced */}
				<div className="hidden lg:grid lg:grid-cols-3 gap-7 mb-14">
					{packages.map((pkg, index) => (
						<motion.div
							key={pkg.id}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
							whileHover={{ y: -8, transition: { duration: 0.2 } }}
							className={`relative rounded-2xl p-7 flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-all duration-300 hover:shadow-2xl overflow-hidden ${
								pkg.popular
									? 'border-2 border-primary-500 shadow-xl shadow-primary-100 dark:shadow-primary-900/30 scale-105 z-10'
									: 'border-2 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
							}`}
						>
							{/* Gradient accent line at top */}
							<div className={`absolute top-0 left-0 right-0 h-1.5 ${
								pkg.popular 
									? 'bg-gradient-to-r from-primary-500 via-blue-500 to-primary-500' 
									: 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500'
							}`} />
							
							{pkg.popular && (
								<span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-primary-500/25">
									{t('pricing.mostChosen')}
								</span>
							)}
							
							{/* Package name & tagline */}
							<div className="mb-4">
								<h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">
									{pkg.name}
								</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{pkg.tagline}
								</p>
							</div>

							{/* Description */}
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
								{pkg.description}
							</p>
							
							{/* Price */}
							<div className="mb-4">
								<div className="flex items-baseline gap-1">
									<span className="text-4xl font-bold text-gray-900 dark:text-white">
										€{pkg.price}
									</span>
									<span className="text-sm text-gray-500 dark:text-gray-400">{t('pricing.perMonth')}</span>
								</div>
								<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
									+ €{pkg.setupFee} {t('pricing.oneTimeSetup')}
								</p>
							</div>

							{/* Delivery time badge - Enhanced */}
							<div className="flex items-center gap-2.5 mb-6 px-4 py-3 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 rounded-xl w-fit border border-primary-200/50 dark:border-primary-700/50">
								<div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center shadow-md shadow-primary-500/20">
									<Zap className="w-4 h-4 text-white" />
								</div>
								<span className="text-sm font-bold text-primary-700 dark:text-primary-300">
									{getDeliveryText(pkg.deliveryDays)}
								</span>
							</div>
							
							{/* Features list - Enhanced */}
							<ul className="space-y-3 mb-6 flex-grow">
								{pkg.features.map((feature, i) => (
									<li key={i} className="flex items-start gap-3">
										<div className="w-5 h-5 bg-gradient-to-br from-primary-500 to-blue-500 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm shadow-primary-500/20">
											<Check className="w-3 h-3 text-white" />
										</div>
										<span className="text-sm text-gray-600 dark:text-gray-300">
											{feature}
										</span>
									</li>
								))}
							</ul>

							{/* Support & revisions info */}
							<div className="text-sm text-gray-500 dark:text-gray-400 mb-6 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
								<div className="flex justify-between">
									<span>{t('pricing.supportResponseTime')}:</span>
									<span className="font-medium text-gray-700 dark:text-gray-300">{pkg.supportResponseTime}</span>
								</div>
								<div className="flex justify-between">
									<span>{t('pricing.revisionsPerMonth')}:</span>
									<span className="font-medium text-gray-700 dark:text-gray-300">
										{pkg.revisionsPerMonth === 'unlimited' ? t('pricing.unlimited') : pkg.revisionsPerMonth}
									</span>
								</div>
							</div>
							
							{/* CTA Button - Enhanced */}
							<a
								href={`/start?pakket=${pkg.id}`}
								className={`w-full py-4 px-4 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 ${
									pkg.popular
										? 'bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30'
										: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-900 dark:text-white'
								}`}
							>
								{t('pricing.choose')} {pkg.name}
								<ArrowRight className="w-4 h-4" />
							</a>
						</motion.div>
					))}
				</div>

				{/* Webshop CTA - Enhanced */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ type: 'spring', stiffness: 300, damping: 25 }}
					className="relative bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-emerald-900/20 border-2 border-emerald-200/50 dark:border-emerald-700/50 rounded-2xl p-7 lg:p-10 text-center overflow-hidden shadow-lg shadow-emerald-100/50 dark:shadow-emerald-900/20"
				>
					{/* Decorative elements */}
					<div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-green-500" />
					<div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl" />
					<div className="absolute -bottom-12 -right-12 w-32 h-32 bg-green-400/10 rounded-full blur-2xl" />
					
					<div className="relative">
						<div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
							<Sparkles className="w-7 h-7 text-white" />
						</div>
						<h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3">
							{t('pricing.webshop.title')}
						</h3>
						<p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-5 max-w-xl mx-auto">
							{t('pricing.webshop.description')}
						</p>
						<a
							href="/webshops"
							className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30"
						>
							{t('pricing.webshop.button')}
							<ArrowRight className="w-4 h-4" />
						</a>
					</div>
				</motion.div>

				{/* BTW notice - Enhanced */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mt-10 lg:mt-14"
				>
					<div className="inline-flex items-center gap-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-5 py-2.5">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{t('pricing.vatNotice')}
						</p>
						<span className="text-gray-300 dark:text-gray-600">•</span>
						<span className="text-sm text-primary-600 dark:text-primary-400 font-bold">
							{t('pricing.vatRefund')}
						</span>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
