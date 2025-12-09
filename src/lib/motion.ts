export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } },
}

export const pop = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
}

export const cardHover = {
  rest: { scale: 1, boxShadow: '0 18px 50px rgba(17,24,39,0.06)' },
  hover: { scale: 1.03, boxShadow: '0 28px 60px rgba(13,16,30,0.10)', transition: { duration: 0.28 } },
}
