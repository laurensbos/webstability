import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function FAQ() {
	const { t } = useTranslation()
	const [openIndex, setOpenIndex] = useState<number | null>(0)

	const faqs = [
		{
			question: t('faq.items.costs.question'),
			answer: t('faq.items.costs.answer'),
		},
		{
			question: t('faq.items.timeline.question'),
			answer: t('faq.items.timeline.answer'),
		},
		{
			question: t('faq.items.cancel.question'),
			answer: t('faq.items.cancel.answer'),
		},
		{
			question: t('faq.items.changes.question'),
			answer: t('faq.items.changes.answer'),
		},
		{
			question: t('faq.items.domain.question'),
			answer: t('faq.items.domain.answer'),
		},
		{
			question: t('faq.items.satisfaction.question'),
			answer: t('faq.items.satisfaction.answer'),
		},
	]

	return (
		<section id="faq" className="py-16 lg:py-32 bg-gray-50 dark:bg-gray-900 relative">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-8 lg:mb-16">
					<motion.span
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-3 lg:mb-4"
					>
						{t('faq.badge')}
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white"
					>
						{t('faq.title')}
					</motion.h2>
				</div>

				{/* FAQ items */}
				<div className="space-y-3 lg:space-y-4">
					{faqs.map((faq, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.05 }}
							className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm"
						>
							<button
								onClick={() =>
									setOpenIndex(openIndex === index ? null : index)
								}
								className="w-full flex items-center justify-between p-4 lg:p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
							>
								<span className="text-gray-900 dark:text-white font-medium pr-4 text-sm lg:text-base">
									{faq.question}
								</span>
								<span className="flex-shrink-0 text-primary-500">
									{openIndex === index ? (
										<Minus className="w-4 h-4 lg:w-5 lg:h-5" />
									) : (
										<Plus className="w-4 h-4 lg:w-5 lg:h-5" />
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
										<div className="px-4 pb-4 lg:px-6 lg:pb-6 text-gray-600 dark:text-gray-400 leading-relaxed text-sm lg:text-base">
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
					className="text-center mt-8 lg:mt-12"
				>
					<p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base mb-3 lg:mb-4">{t('faq.notFound')}</p>
					<a
						href="mailto:info@webstability.nl"
						className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors text-sm lg:text-base"
					>
						{t('faq.contactUs')}
						<span>→</span>
					</a>
				</motion.div>
			</div>
		</section>
	)
}
