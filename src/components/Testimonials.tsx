import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
	{
		quote: 'Eindelijk een partij die gewoon levert wat ze beloven. Mijn website was binnen een week live en ziet er fantastisch uit.',
		author: 'Lisa de Vries',
		role: 'Eigenaar, Studio Lisa',
		image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
		rating: 5,
	},
	{
		quote: 'De maandelijkse aanpassingen zijn goud waard. Ik hoef me nergens zorgen om te maken en mijn website is altijd up-to-date.',
		author: 'Mark Jansen',
		role: "ZZP'er, MJ Coaching",
		image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
		rating: 5,
	},
	{
		quote: 'Professionele service, eerlijke prijzen. Precies wat ik zocht als starter. Aanrader voor elke ondernemer!',
		author: 'Sophie Bakker',
		role: 'Oprichter, Bakker Styling',
		image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
		rating: 5,
	},
]

export default function Testimonials() {
	return (
		<section id="testimonials" className="py-24 lg:py-32 bg-white relative overflow-hidden">
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center max-w-3xl mx-auto mb-16">
					<motion.span
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-4"
					>
						Klanten aan het woord
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900"
					>
						Wat onze klanten zeggen
					</motion.h2>
				</div>

				{/* Testimonials grid */}
				<div className="grid md:grid-cols-3 gap-6 lg:gap-8">
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={testimonial.author}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							className="bg-white border border-gray-100 rounded-2xl p-8 relative shadow-lg shadow-gray-100 hover:shadow-xl transition-shadow"
						>
							{/* Quote icon */}
							<Quote className="w-10 h-10 text-primary-100 absolute top-6 right-6" />

							{/* Stars */}
							<div className="flex gap-1 mb-6">
								{[...Array(testimonial.rating)].map((_, i) => (
									<Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
								))}
							</div>

							{/* Quote */}
							<p className="text-gray-700 text-lg leading-relaxed mb-8">"{testimonial.quote}"</p>

							{/* Author */}
							<div className="flex items-center gap-4">
								<img 
									src={testimonial.image} 
									alt={testimonial.author}
									className="w-12 h-12 rounded-full object-cover"
								/>
								<div>
									<div className="text-gray-900 font-semibold">{testimonial.author}</div>
									<div className="text-gray-500 text-sm">{testimonial.role}</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Stats */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-100"
				>
					{[
						{ value: '150+', label: 'Tevreden klanten' },
						{ value: '99.9%', label: 'Uptime garantie' },
						{ value: '< 24u', label: 'Response tijd' },
						{ value: '4.9/5', label: 'Klantscore' },
					].map((stat) => (
						<div key={stat.label} className="text-center">
							<div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
								{stat.value}
							</div>
							<div className="text-gray-500 text-sm">{stat.label}</div>
						</div>
					))}
				</motion.div>
			</div>
		</section>
	)
}
