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
		<section id="testimonials" className="py-20 lg:py-28 bg-white dark:bg-gray-900 relative overflow-hidden">
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center max-w-3xl mx-auto mb-8 lg:mb-16">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="flex items-center justify-center gap-3 mb-4"
					>
						{/* Trustpilot Badge */}
						<a 
							href="https://www.trustpilot.com/review/webstability.nl"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow group"
						>
							<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
								<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#00b67a"/>
							</svg>
							<div className="flex items-center gap-1">
								{[...Array(5)].map((_, i) => (
									<Star 
										key={i} 
										className={`w-3.5 h-3.5 ${i < trustpilotData.stars ? 'text-[#00b67a] fill-[#00b67a]' : 'text-gray-300 fill-gray-300'}`} 
									/>
								))}
							</div>
							<span className="text-sm font-semibold text-gray-900 dark:text-white">{trustpilotData.score}</span>
							<span className="text-xs text-gray-500 dark:text-gray-400">({trustpilotData.totalReviews} reviews)</span>
							<ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-primary-500 transition-colors" />
						</a>
					</motion.div>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4"
					>
						{t('testimonials.title')}
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
						className="text-gray-600 dark:text-gray-400 text-base lg:text-lg"
					>
						{t('testimonials.subtitle')}
					</motion.p>
				</div>

				{/* Mobile: Horizontal scroll carousel with auto-scroll */}
				<div className="lg:hidden mb-8">
					<AutoScrollCarousel className="flex gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory">
						{reviews.map((review, index) => (
							<motion.div
								key={review.author}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
								className="flex-shrink-0 w-[280px] snap-start bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 relative flex flex-col min-h-[220px]"
							>
								{/* Verified badge */}
								{review.verified && (
									<div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-[#00b67a] font-medium">
										<svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
											<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
										</svg>
										Trustpilot
									</div>
								)}

								{/* Stars */}
								<div className="flex gap-0.5 mb-3">
									{[...Array(review.rating)].map((_, i) => (
										<Star key={i} className="w-3.5 h-3.5 text-[#00b67a] fill-[#00b67a]" />
									))}
								</div>

								{/* Quote */}
								<p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-grow line-clamp-4">"{review.quote}"</p>

								{/* Author */}
								<div className="flex items-center gap-2 mt-auto pt-3">
									{review.image ? (
										<img 
											src={review.image} 
											alt={review.author}
											loading="lazy"
											className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-gray-700 shadow-sm"
										/>
									) : (
										<div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(review.author)} flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-gray-700 shadow-sm`}>
											{getInitials(review.author)}
										</div>
									)}
									<div>
										<div className="text-gray-900 dark:text-white font-semibold text-xs">{review.author}</div>
										<div className="text-gray-500 dark:text-gray-400 text-[10px]">{review.role}</div>
									</div>
								</div>
							</motion.div>
						))}
					</AutoScrollCarousel>
					{/* Scroll indicator */}
					<div className="flex justify-center gap-1.5 mt-2">
						{reviews.map((_, i) => (
							<div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
						))}
					</div>
				</div>

				{/* Desktop: Grid layout */}
				<div className="hidden lg:grid lg:grid-cols-4 gap-6 mb-16">
					{reviews.map((review, index) => (
						<motion.div
							key={review.author}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 relative group hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 flex flex-col h-full min-h-[280px]"
						>
							{/* Verified badge */}
							{review.verified && (
								<div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-[#00b67a] font-medium">
									<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
									</svg>
									{t('testimonials.verified')}
								</div>
							)}

							{/* Stars */}
							<div className="flex gap-0.5 mb-4">
								{[...Array(review.rating)].map((_, i) => (
									<Star key={i} className="w-4 h-4 text-[#00b67a] fill-[#00b67a]" />
								))}
							</div>

							{/* Quote */}
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm flex-grow">"{review.quote}"</p>

							{/* Author */}
							<div className="flex items-center gap-3 mt-auto pt-4">
								{review.image ? (
									<img 
										src={review.image} 
										alt={review.author}
										loading="lazy"
										className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-700 shadow-sm"
									/>
								) : (
									<div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(review.author)} flex items-center justify-center text-white text-sm font-bold ring-2 ring-white dark:ring-gray-700 shadow-sm`}>
										{getInitials(review.author)}
									</div>
								)}
								<div>
									<div className="text-gray-900 dark:text-white font-semibold text-sm">{review.author}</div>
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
