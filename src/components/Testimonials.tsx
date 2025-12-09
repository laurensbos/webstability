import React from 'react'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../lib/motion'

const TESTS = [
	{ name: 'Sanne', role: 'Eigenaar', quote: 'Onze reserveringen verdubbelden in een maand.' },
	{ name: 'Bas', role: 'Fotograaf', quote: 'Professioneel portfolio, klanten bellen nu vaker.' },
	{ name: 'Lina', role: 'Eigenaar Restaurant', quote: 'Gemakkelijk bestellen en reserveren — top support.' },
]

export default function Testimonials() {
	return (
		<section id="testimonials" className="py-20">
			<div className="max-w-6xl mx-auto px-6">
				<motion.div variants={fadeInUp} initial="hidden" whileInView="show" className="grid md:grid-cols-3 gap-6">
					{TESTS.map((t) => (
						<div key={t.name} className="bg-white/3 p-6 rounded-lg">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-[linear-gradient(135deg,#2b2a34, #1a1719)] flex items-center justify-center text-[#ffd98a] font-semibold">
									{t.name[0]}
								</div>
								<div>
									<div className="font-semibold text-[var(--brand-dark)]">{t.name}</div>
									<div className="text-xs text-[var(--muted)]">{t.role}</div>
								</div>
								<div className="ml-auto text-[var(--muted)]">
									<Star size={16} />
								</div>
							</div>
							<blockquote className="mt-4 text-[var(--muted)]">“{t.quote}”</blockquote>
						</div>
					))}
				</motion.div>
			</div>
		</section>
	)
}
