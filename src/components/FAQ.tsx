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
		<section id="faq" className="py-16 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
			{/* Background decoration */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-100/40 to-blue-100/30 dark:from-primary-900/20 dark:to-blue-900/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
				<div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-100/30 to-pink-100/20 dark:from-purple-900/15 dark:to-pink-900/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
			</div>
			
			<div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-8 lg:mb-16">
					<motion.span
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500/10 to-blue-500/10 border-2 border-primary-500/20 rounded-full text-primary-600 dark:text-primary-400 font-semibold text-sm tracking-wider uppercase mb-4 lg:mb-6"
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
							className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 rounded-2xl overflow-hidden shadow-lg transition-all ${
								openIndex === index 
									? 'border-primary-500/40 shadow-primary-500/10' 
									: 'border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800'
							}`}
						>
							<button
								onClick={() =>
									setOpenIndex(openIndex === index ? null : index)
								}
								className="w-full flex items-center justify-between p-4 lg:p-6 text-left transition-colors"
							>
								<span className="text-gray-900 dark:text-white font-semibold pr-4 text-sm lg:text-base">
									{faq.question}
								</span>
								<span className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
									openIndex === index 
										? 'bg-gradient-to-br from-primary-500 to-blue-500 text-white shadow-lg shadow-primary-500/30' 
										: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
								}`}>
									{openIndex === index ? (
										<Minus className="w-4 h-4" />
									) : (
										<Plus className="w-4 h-4" />
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
					className="text-center mt-8 lg:mt-12 p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-2xl"
				>
					<p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base mb-4">{t('faq.notFound')}</p>
					<motion.a
						href="mailto:info@webstability.nl"
						className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all text-sm lg:text-base"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						{t('faq.contactUs')}
						<span>→</span>
					</motion.a>
				</motion.div>
			</div>
		</section>
	)
}
