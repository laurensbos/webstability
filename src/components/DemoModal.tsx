import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const SLIDES = [
	{
		title: 'Klaar binnen een week',
		desc: 'Van briefing tot live site — wij regelen design, hosting en SEO-optimalisatie.',
		hint: 'Perfect voor ondernemers die snel online willen.',
	},
	{
		title: 'Eenvoudig beheer',
		desc: 'Beheer content en producten met onze gebruiksvriendelijke editor.',
		hint: 'Publiceer updates in enkele minuten.',
	},
	{
		title: 'Betrouwbare hosting',
		desc: 'SSL, automatische backups en CDN voor snelle laadtijden.',
		hint: '99.9% uptime en veilige infrastructuur.',
	},
]

export default function DemoModal({
	open,
	onClose,
}: {
	open?: boolean
	onClose?: () => void
}) {
	const [index, setIndex] = useState(0)

	useEffect(() => {
		if (!open) return
		const t = setInterval(
			() => setIndex((i) => (i + 1) % SLIDES.length),
			4500
		)
		return () => clearInterval(t)
	}, [open])

	if (!open) return null

	function prev() {
		setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)
	}
	function next() {
		setIndex((i) => (i + 1) % SLIDES.length)
	}

	function startTrial() {
		window.dispatchEvent(
			new CustomEvent('open-checkout', { detail: { plan: 'Starter' } })
		)
		if (onClose) onClose()
	}

	return (
		<div className="fixed inset-0 z-60 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />

			<motion.div
				className="relative card rounded-2xl p-6 max-w-3xl w-full shadow-card text-[var(--text)]"
				initial={{ opacity: 0, scale: 0.98, y: 8 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				transition={{ duration: 0.18 }}
				role="dialog"
				aria-modal="true"
				aria-labelledby="demo-title"
			>
				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex-1">
						<h3 id="demo-title" className="text-lg font-semibold text-[var(--text)]">
							Bekijk een korte demo
						</h3>
						<p className="text-sm text-[var(--muted)] mt-2">
							Loop in 30 seconden door de belangrijkste features.
						</p>

						<div className="mt-4">
							<div className="relative bg-[rgba(255,255,255,0.02)] rounded-lg p-6">
								<motion.div
									key={index}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -10 }}
									transition={{ duration: 0.35 }}
									className="min-h-[120px]"
								>
									<h4 className="font-semibold text-[var(--text)]">
										{SLIDES[index].title}
									</h4>
									<p className="mt-2 text-sm text-[var(--muted)]">
										{SLIDES[index].desc}
									</p>
									<div className="mt-3 text-xs text-[var(--muted)]">
										{SLIDES[index].hint}
									</div>
								</motion.div>

								<div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
									<button
										onClick={prev}
										aria-label="Vorige"
										className="p-2 rounded bg-[rgba(255,255,255,0.04)] text-[var(--text)]"
									>
										‹
									</button>
									<button
										onClick={next}
										aria-label="Volgende"
										className="p-2 rounded bg-[rgba(255,255,255,0.04)] text-[var(--text)]"
									>
										›
									</button>
								</div>
							</div>
						</div>

						<div className="mt-4 flex items-center gap-3">
							<button
								onClick={startTrial}
								className="btn-primary"
							>
								Probeer gratis proef
							</button>
							<button
								className="btn-ghost"
								onClick={onClose}
							>
								Sluit
							</button>
						</div>
					</div>

					<div className="w-full md:w-48 flex flex-col items-center justify-center">
						<div className="w-40 h-40 bg-[rgba(255,255,255,0.02)] rounded-lg flex items-center justify-center text-[var(--text)] font-bold text-sm">
							Demo Preview
						</div>
						<div className="mt-3 text-xs text-[var(--muted)]">
							Klik Probeer gratis proef om direct te bestellen
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	)
}
