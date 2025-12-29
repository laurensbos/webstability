import { motion } from 'framer-motion'
import { CheckCircle, Lock, Zap, Shield, Clock, Award, Headphones } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface TrustBadgesProps {
	compact?: boolean
	variant?: 'light' | 'dark' | 'transparent'
	showExtended?: boolean
}

export default function TrustBadges({ compact = false, variant = 'light', showExtended = false }: TrustBadgesProps) {
	const { t } = useTranslation()
	
	const badges = [
		{ icon: CheckCircle, label: t('trustBadges.uptime'), color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/30' },
		{ icon: Lock, label: t('trustBadges.sslBackups'), color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30' },
		{ icon: Zap, label: t('trustBadges.superfast'), color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30' },
		{ icon: Headphones, label: t('trustBadges.support'), color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/30' },
	]

	const extendedBadges = [
		{ icon: Shield, label: t('trustBadges.extended.gdpr'), description: t('trustBadges.extended.gdprDesc') },
		{ icon: Clock, label: t('trustBadges.extended.sevenDays'), description: t('trustBadges.extended.sevenDaysDesc') },
		{ icon: Award, label: t('trustBadges.extended.clients'), description: t('trustBadges.extended.clientsDesc') },
		{ icon: Headphones, label: t('trustBadges.extended.personal'), description: t('trustBadges.extended.personalDesc') },
	]
	
	const bgColor = variant === 'dark' ? 'bg-gray-900' : variant === 'transparent' ? '' : 'bg-gray-50 dark:bg-gray-800/50'
	const textColor = variant === 'dark' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
	const iconBg = variant === 'dark' ? 'bg-gray-800' : 'bg-white dark:bg-gray-800'

	if (compact) {
		return (
			<div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6" aria-hidden>
				{badges.map((badge, index) => (
					<motion.div
						key={badge.label}
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: index * 0.1 }}
						className="flex items-center gap-2"
					>
						<div className={`w-8 h-8 ${badge.bg} rounded-lg flex items-center justify-center`}>
							<badge.icon className={`w-4 h-4 ${badge.color}`} />
						</div>
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">{badge.label}</span>
					</motion.div>
				))}
			</div>
		)
	}

	if (showExtended) {
		return (
			<section className={`py-12 ${bgColor}`}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{extendedBadges.map((badge, index) => (
							<motion.div
								key={badge.label}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
								className={`${iconBg} p-6 rounded-2xl border border-gray-100 dark:border-gray-700 text-center shadow-sm hover:shadow-md transition-shadow`}
							>
								<div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
									<badge.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
								</div>
								<h4 className="font-semibold text-gray-900 dark:text-white mb-1">{badge.label}</h4>
								<p className="text-sm text-gray-500 dark:text-gray-400">{badge.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>
		)
	}

	return (
		<section className={`py-6 ${bgColor}`} aria-hidden>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
					{badges.map((badge, index) => (
						<motion.div
							key={badge.label}
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							className="flex items-center gap-3"
						>
							<div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700`}>
								<badge.icon className={`w-5 h-5 ${badge.color}`} />
							</div>
							<span className={`text-sm font-medium ${textColor}`}>{badge.label}</span>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
