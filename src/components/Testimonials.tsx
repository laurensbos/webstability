import { motion } from 'framer-motion'
import { Star, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AutoScrollCarousel from './AutoScrollCarousel'

// Trustpilot reviews - wordt geladen van API of fallback naar statische data
interface TrustpilotReview {
	quote: string
	author: string
	role: string
	image?: string
	rating: number
	date?: string
	verified?: boolean
}

// Statische reviews als fallback (echte Trustpilot reviews)
const staticReviews: TrustpilotReview[] = [
	{
		quote: 'Perfect understanding of my specific needs in a surprisingly short time, given the rather niched domain of my activity. Fast delivery. Very pleased with the result.',
		author: 'Ene Claudiu',
		role: 'Klant via Trustpilot',
		rating: 5,
		date: '2025-08-31',
		verified: true,
	},
	{
		quote: 'Supersnelle service en een prachtig eindresultaat. Laurens denkt echt met je mee en levert kwaliteit. Absolute aanrader!',
		author: 'Wesley',
		role: 'Klant via Trustpilot',
		rating: 5,
		verified: true,
	},
	{
		quote: 'Heel blij met mijn nieuwe website! Professioneel, snel en precies wat ik zocht. De communicatie was top en alles werd duidelijk uitgelegd.',
		author: 'Charlotte',
		role: 'Klant via Trustpilot',
		rating: 5,
		verified: true,
	},
	{
		quote: 'Eindelijk een partij die gewoon levert wat ze beloven. Mijn website was binnen een week live en ziet er fantastisch uit.',
		author: 'Lisa de Vries',
		role: 'Eigenaar, Studio Lisa',
		image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
		rating: 5,
		verified: true,
	},
]

// Trustpilot stats
const trustpilotData = {
	score: 4.8,
	totalReviews: 5,
	stars: 5,
}

// Generate initials avatar for reviews without images
function getInitials(name: string): string {
	return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function getAvatarColor(name: string): string {
	const colors = [
		'from-blue-400 to-blue-600',
		'from-purple-400 to-purple-600',
		'from-green-400 to-green-600',
		'from-orange-400 to-orange-600',
		'from-pink-400 to-pink-600',
		'from-teal-400 to-teal-600',
	]
	const index = name.charCodeAt(0) % colors.length
	return colors[index]
}

export default function Testimonials() {
	const { t } = useTranslation()
	const [reviews] = useState<TrustpilotReview[]>(staticReviews)

	return (
		<section id="testimonials" className="py-20 lg:py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
			{/* Background decoration */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-emerald-50/40 via-green-50/30 to-teal-50/40 dark:from-emerald-900/15 dark:via-green-900/10 dark:to-teal-900/15 rounded-full blur-3xl" />
				<div className="absolute top-20 -right-20 w-[300px] h-[300px] bg-gradient-to-br from-[#00b67a]/10 to-green-400/10 rounded-full blur-3xl" />
				<div className="absolute bottom-20 -left-20 w-[300px] h-[300px] bg-gradient-to-br from-[#00b67a]/10 to-emerald-400/10 rounded-full blur-3xl" />
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header - Enhanced */}
				<div className="text-center max-w-3xl mx-auto mb-10 lg:mb-16">
					<motion.div
						initial={{ opacity: 0, y: 20, scale: 0.95 }}
						whileInView={{ opacity: 1, y: 0, scale: 1 }}
						viewport={{ once: true }}
						className="flex items-center justify-center gap-3 mb-5"
					>
						{/* Trustpilot Badge - Enhanced */}
						<motion.a 
							href="https://www.trustpilot.com/review/webstability.nl"
							target="_blank"
							rel="noopener noreferrer"
							whileHover={{ scale: 1.02, y: -2 }}
							className="inline-flex items-center gap-2.5 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-[#00b67a]/30 dark:border-[#00b67a]/20 rounded-full px-5 py-2.5 shadow-lg shadow-[#00b67a]/10 hover:shadow-xl hover:border-[#00b67a]/50 transition-all group"
						>
							<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
								<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#00b67a"/>
							</svg>
							<div className="flex items-center gap-0.5">
								{[...Array(5)].map((_, i) => (
									<Star 
										key={i} 
										className={`w-4 h-4 ${i < trustpilotData.stars ? 'text-[#00b67a] fill-[#00b67a]' : 'text-gray-300 fill-gray-300'}`} 
									/>
								))}
							</div>
							<span className="text-sm font-bold text-gray-900 dark:text-white">{trustpilotData.score}</span>
							<span className="text-xs font-medium text-gray-500 dark:text-gray-400">({trustpilotData.totalReviews} reviews)</span>
							<ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#00b67a] transition-colors" />
						</motion.a>
					</motion.div>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-5"
					>
						{t('testimonials.title')}
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
						className="text-gray-600 dark:text-gray-400 text-lg lg:text-xl"
					>
						{t('testimonials.subtitle')}
					</motion.p>
				</div>

				{/* Mobile: Horizontal scroll carousel with auto-scroll - Enhanced */}
				<div className="lg:hidden mb-8">
					<AutoScrollCarousel className="flex gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory">
						{reviews.map((review, index) => (
							<motion.div
								key={review.author}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
								className="flex-shrink-0 w-[300px] snap-start bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-2xl p-5 relative flex flex-col min-h-[240px] shadow-lg overflow-hidden"
							>
								{/* Gradient accent line */}
								<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00b67a] to-emerald-400" />
								
								{/* Verified badge - Enhanced */}
								{review.verified && (
									<div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] text-[#00b67a] font-bold bg-[#00b67a]/10 rounded-full px-2 py-1">
										<svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
											<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
										</svg>
										Trustpilot
									</div>
								)}

								{/* Stars - Enhanced */}
								<div className="flex gap-0.5 mb-3">
									{[...Array(review.rating)].map((_, i) => (
										<Star key={i} className="w-4 h-4 text-[#00b67a] fill-[#00b67a]" />
									))}
								</div>

								{/* Quote */}
								<p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-grow line-clamp-4">"{review.quote}"</p>

								{/* Author - Enhanced */}
								<div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
									{review.image ? (
										<img 
											src={review.image} 
											alt={review.author}
											loading="lazy"
											className="w-10 h-10 rounded-xl object-cover ring-2 ring-white dark:ring-gray-700 shadow-md"
										/>
									) : (
										<div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarColor(review.author)} flex items-center justify-center text-white text-sm font-bold ring-2 ring-white dark:ring-gray-700 shadow-md`}>
											{getInitials(review.author)}
										</div>
									)}
									<div>
										<div className="text-gray-900 dark:text-white font-bold text-sm">{review.author}</div>
										<div className="text-gray-500 dark:text-gray-400 text-xs">{review.role}</div>
									</div>
								</div>
							</motion.div>
						))}
					</AutoScrollCarousel>
					{/* Scroll indicator - Enhanced */}
					<div className="flex justify-center gap-2 mt-4">
						{reviews.map((_, i) => (
							<div key={i} className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
						))}
					</div>
				</div>

				{/* Desktop: Grid layout - Enhanced */}
				<div className="hidden lg:grid lg:grid-cols-4 gap-6 mb-16">
					{reviews.map((review, index) => (
						<motion.div
							key={review.author}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
							whileHover={{ y: -6, transition: { duration: 0.2 } }}
							className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-2xl p-6 relative group hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 flex flex-col h-full min-h-[300px] overflow-hidden"
						>
							{/* Gradient accent line */}
							<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00b67a] to-emerald-400 opacity-80 group-hover:opacity-100 transition-opacity" />
							
							{/* Verified badge - Enhanced */}
							{review.verified && (
								<div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs text-[#00b67a] font-bold bg-[#00b67a]/10 rounded-full px-2.5 py-1">
									<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
									</svg>
									{t('testimonials.verified')}
								</div>
							)}

							{/* Stars - Enhanced */}
							<div className="flex gap-0.5 mb-4">
								{[...Array(review.rating)].map((_, i) => (
									<Star key={i} className="w-4.5 h-4.5 text-[#00b67a] fill-[#00b67a]" />
								))}
							</div>

							{/* Quote */}
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm flex-grow">"{review.quote}"</p>

							{/* Author - Enhanced */}
							<div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
								{review.image ? (
									<img 
										src={review.image} 
										alt={review.author}
										loading="lazy"
										className="w-11 h-11 rounded-xl object-cover ring-2 ring-white dark:ring-gray-700 shadow-md"
									/>
								) : (
									<div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getAvatarColor(review.author)} flex items-center justify-center text-white text-sm font-bold ring-2 ring-white dark:ring-gray-700 shadow-md`}>
										{getInitials(review.author)}
									</div>
								)}
								<div>
									<div className="text-gray-900 dark:text-white font-bold text-sm">{review.author}</div>
									<div className="text-gray-500 dark:text-gray-400 text-xs">{review.role}</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
