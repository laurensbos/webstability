import { motion } from 'framer-motion'
import { MessageSquare, Palette, Rocket, HeartHandshake } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function HowItWorks() {
	const { t } = useTranslation()
	
	const steps = [
		{
			icon: MessageSquare,
			step: '01',
			title: t('howItWorks.step1.title'),
			description: t('howItWorks.step1.description'),
			gradient: 'from-blue-500 to-cyan-500',
			shadow: 'shadow-blue-500/25',
		},
		{
			icon: Palette,
			step: '02',
			title: t('howItWorks.step2.title'),
			description: t('howItWorks.step2.description'),
			gradient: 'from-pink-500 to-rose-500',
			shadow: 'shadow-pink-500/25',
		},
		{
			icon: Rocket,
			step: '03',
			title: t('howItWorks.step3.title'),
			description: t('howItWorks.step3.description'),
			gradient: 'from-primary-500 to-blue-500',
			shadow: 'shadow-primary-500/25',
		},
		{
			icon: HeartHandshake,
			step: '04',
			title: t('howItWorks.step4.title'),
			description: t('howItWorks.step4.description'),
			gradient: 'from-emerald-500 to-green-500',
			shadow: 'shadow-emerald-500/25',
		},
	]

	return (
		<section id="how-it-works" className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 relative overflow-hidden">
			{/* Background decoration */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-primary-50/30 via-blue-50/20 to-cyan-50/30 dark:from-primary-900/10 dark:via-blue-900/5 dark:to-cyan-900/10 rounded-full blur-3xl" />
				<div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-emerald-400/10 to-green-400/10 rounded-full blur-3xl" />
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-3xl mx-auto mb-10 lg:mb-20">
					<motion.span
						initial={{ opacity: 0, y: 20, scale: 0.9 }}
						whileInView={{ opacity: 1, y: 0, scale: 1 }}
						viewport={{ once: true }}
						className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 border-2 border-primary-200/50 dark:border-primary-700/50 rounded-full px-5 py-2.5 mb-5 shadow-lg shadow-primary-100/50 dark:shadow-primary-900/20"
					>
						<span className="text-sm font-bold text-primary-700 dark:text-primary-300 tracking-wider uppercase">{t('howItWorks.badge')}</span>
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-5 lg:mb-6"
					>
						{t('howItWorks.title')}{' '}
						<span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
							{t('howItWorks.titleHighlight')}
						</span>
					</motion.h2>
				</div>

				{/* Mobile: Compact vertical list - Enhanced */}
				<div className="lg:hidden space-y-4">
					{steps.map((step, index) => (
						<motion.div
							key={step.step}
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
							className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 border-2 border-gray-100 dark:border-gray-700 shadow-lg relative overflow-hidden"
						>
							{/* Gradient accent line */}
							<div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient}`} />
							
							<div className="flex items-start gap-4">
								{/* Step number + Icon - Enhanced */}
								<div className="relative flex-shrink-0">
									<div className={`w-12 h-12 bg-gradient-to-br ${step.gradient} rounded-xl flex items-center justify-center shadow-lg ${step.shadow}`}>
										<step.icon className="w-6 h-6 text-white" />
									</div>
									<span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
										{index + 1}
									</span>
								</div>
								
								{/* Content */}
								<div className="flex-1 min-w-0">
									<h3 className="text-gray-900 dark:text-white font-bold text-lg mb-1.5">
										{step.title}
									</h3>
									<p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
										{step.description}
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Desktop: Grid with connector lines - Enhanced */}
				<div className="hidden lg:grid lg:grid-cols-4 gap-7">
					{steps.map((step, index) => (
						<motion.div
							key={step.step}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.15, type: 'spring', stiffness: 300, damping: 25 }}
							whileHover={{ y: -6, transition: { duration: 0.2 } }}
							className="relative h-full"
						>
							{/* Connector line - Enhanced with gradient */}
							{index < steps.length - 1 && (
								<div className="absolute top-14 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 via-gray-200 to-transparent dark:from-gray-600 dark:via-gray-700 dark:to-transparent z-0" />
							)}

							<div className="relative z-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-7 border-2 border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all h-full flex flex-col overflow-hidden">
								{/* Gradient accent line */}
								<div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${step.gradient}`} />
								
								{/* Step number - Enhanced watermark style */}
								<div className={`bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent font-bold text-7xl mb-4 opacity-20`}>
									{step.step}
								</div>

								{/* Icon - Enhanced with gradient */}
								<div className={`w-14 h-14 bg-gradient-to-br ${step.gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg ${step.shadow}`}>
									<step.icon className="w-7 h-7 text-white" />
								</div>

								<h3 className="text-gray-900 dark:text-white font-bold text-xl mb-3">
									{step.title}
								</h3>

								<p className="text-gray-600 dark:text-gray-400 leading-relaxed flex-1 text-base">
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
