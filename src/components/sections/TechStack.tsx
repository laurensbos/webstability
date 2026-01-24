"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";

// Technologie iconen - echte SVG iconen
const technologies = [
	{
		name: "Next.js",
		category: "Framework",
		icon: NextJsIcon,
		color: "#000000",
	},
	{
		name: "React",
		category: "Library",
		icon: ReactIcon,
		color: "#61DAFB",
	},
	{
		name: "TypeScript",
		category: "Language",
		icon: TypeScriptIcon,
		color: "#3178C6",
	},
	{
		name: "Tailwind CSS",
		category: "Styling",
		icon: TailwindIcon,
		color: "#06B6D4",
	},
	{
		name: "VS Code",
		category: "Editor",
		icon: VSCodeIcon,
		color: "#007ACC",
	},
	{
		name: "ChatGPT",
		category: "AI Assistant",
		icon: ChatGPTIcon,
		color: "#10A37F",
	},
	{
		name: "Figma",
		category: "Design",
		icon: FigmaIcon,
		color: "#F24E1E",
	},
	{
		name: "Photoshop",
		category: "Editing",
		icon: PhotoshopIcon,
		color: "#31A8FF",
	},
	{
		name: "Illustrator",
		category: "Graphics",
		icon: IllustratorIcon,
		color: "#FF9A00",
	},
	{
		name: "Vercel",
		category: "Hosting",
		icon: VercelIcon,
		color: "#000000",
	},
	{
		name: "Stripe",
		category: "Payments",
		icon: StripeIcon,
		color: "#635BFF",
	},
	{
		name: "Mollie",
		category: "Payments",
		icon: MollieIcon,
		color: "#000000",
	},
];

// Icon Components
function NextJsIcon() {
	return (
		<svg viewBox="0 0 180 180" fill="none" className="w-8 h-8">
			<mask id="mask0" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
				<circle cx="90" cy="90" r="90" fill="white"/>
			</mask>
			<g mask="url(#mask0)">
				<circle cx="90" cy="90" r="90" fill="black"/>
				<path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear)"/>
				<rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear)"/>
			</g>
			<defs>
				<linearGradient id="paint0_linear" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
					<stop stopColor="white"/>
					<stop offset="1" stopColor="white" stopOpacity="0"/>
				</linearGradient>
				<linearGradient id="paint1_linear" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
					<stop stopColor="white"/>
					<stop offset="1" stopColor="white" stopOpacity="0"/>
				</linearGradient>
			</defs>
		</svg>
	);
}

function ReactIcon() {
	return (
		<svg viewBox="0 0 24 24" className="w-8 h-8">
			<circle cx="12" cy="12" r="2.5" fill="#61DAFB"/>
			<ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1" fill="none"/>
			<ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1" fill="none" transform="rotate(60 12 12)"/>
			<ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1" fill="none" transform="rotate(120 12 12)"/>
		</svg>
	);
}

function TypeScriptIcon() {
	return (
		<svg viewBox="0 0 24 24" className="w-8 h-8">
			<rect width="24" height="24" rx="2" fill="#3178C6"/>
			<path d="M14.5 12.5V11H9V12.5H10.75V18H12.25V12.5H14.5Z" fill="white"/>
			<path d="M15 15.5C15 14.12 16.12 13 17.5 13C18.16 13 18.77 13.27 19.22 13.72L18.22 14.72C18.07 14.57 17.79 14.5 17.5 14.5C16.95 14.5 16.5 14.95 16.5 15.5C16.5 16.05 16.95 16.5 17.5 16.5C17.79 16.5 18.07 16.43 18.22 16.28L19.22 17.28C18.77 17.73 18.16 18 17.5 18C16.12 18 15 16.88 15 15.5Z" fill="white"/>
		</svg>
	);
}

function TailwindIcon() {
	return (
		<svg viewBox="0 0 24 24" className="w-8 h-8">
			<path d="M12 6C9.33 6 7.67 7.33 7 10C8 8.67 9.17 8.17 10.5 8.5C11.26 8.69 11.81 9.24 12.41 9.85C13.39 10.85 14.53 12 17 12C19.67 12 21.33 10.67 22 8C21 9.33 19.83 9.83 18.5 9.5C17.74 9.31 17.19 8.76 16.59 8.15C15.61 7.15 14.47 6 12 6ZM7 12C4.33 12 2.67 13.33 2 16C3 14.67 4.17 14.17 5.5 14.5C6.26 14.69 6.81 15.24 7.41 15.85C8.39 16.85 9.53 18 12 18C14.67 18 16.33 16.67 17 14C16 15.33 14.83 15.83 13.5 15.5C12.74 15.31 12.19 14.76 11.59 14.15C10.61 13.15 9.47 12 7 12Z" fill="#06B6D4"/>
		</svg>
	);
}

function VSCodeIcon() {
	return (
		<svg viewBox="0 0 24 24" className="w-8 h-8">
			<path d="M17.5 2L8.5 10L4.5 7L2 8.5V15.5L4.5 17L8.5 14L17.5 22L22 20V4L17.5 2ZM17.5 5.5V18.5L10 12L17.5 5.5ZM4.5 10L6.5 12L4.5 14V10Z" fill="#007ACC"/>
		</svg>
	);
}

function ChatGPTIcon() {
	return (
		<svg viewBox="0 0 24 24" className="w-8 h-8">
			<path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="#10A37F"/>
		</svg>
	);
}

function FigmaIcon() {
	return (
		<svg viewBox="0 0 24 24" className="w-8 h-8">
			<path d="M8 24C10.208 24 12 22.208 12 20V16H8C5.792 16 4 17.792 4 20C4 22.208 5.792 24 8 24Z" fill="#0ACF83"/>
			<path d="M4 12C4 9.792 5.792 8 8 8H12V16H8C5.792 16 4 14.208 4 12Z" fill="#A259FF"/>
			<path d="M4 4C4 1.792 5.792 0 8 0H12V8H8C5.792 8 4 6.208 4 4Z" fill="#F24E1E"/>
			<path d="M12 0H16C18.208 0 20 1.792 20 4C20 6.208 18.208 8 16 8H12V0Z" fill="#FF7262"/>
			<path d="M20 12C20 14.208 18.208 16 16 16C13.792 16 12 14.208 12 12C12 9.792 13.792 8 16 8C18.208 8 20 9.792 20 12Z" fill="#1ABCFE"/>
		</svg>
	);
}

function PhotoshopIcon() {
	return (
		<svg viewBox="0 0 24 24" className="w-8 h-8">
			<rect width="24" height="24" rx="2" fill="#001E36"/>
			<path d="M7 7H9.5C10.163 7 10.799 7.263 11.268 7.732C11.737 8.201 12 8.837 12 9.5C12 10.163 11.737 10.799 11.268 11.268C10.799 11.737 10.163 12 9.5 12H7V7ZM8.2 8.2V10.8H9.5C9.845 10.8 10.176 10.663 10.42 10.42C10.663 10.176 10.8 9.845 10.8 9.5C10.8 9.155 10.663 8.824 10.42 8.58C10.176 8.337 9.845 8.2 9.5 8.2H8.2Z" fill="#31A8FF"/>
			<path d="M7 12H8.2V17H7V12Z" fill="#31A8FF"/>
			<path d="M13 14C13 13.204 13.316 12.441 13.879 11.879C14.441 11.316 15.204 11 16 11C16.398 11 16.784 11.078 17.148 11.23L16.65 12.35C16.45 12.25 16.23 12.2 16 12.2C15.522 12.2 15.063 12.39 14.727 12.727C14.39 13.063 14.2 13.522 14.2 14C14.2 14.478 14.39 14.937 14.727 15.273C15.063 15.61 15.522 15.8 16 15.8C16.23 15.8 16.45 15.75 16.65 15.65L17.148 16.77C16.784 16.922 16.398 17 16 17C15.204 17 14.441 16.684 13.879 16.121C13.316 15.559 13 14.796 13 14Z" fill="#31A8FF"/>
		</svg>
	);
}

function IllustratorIcon() {
	return (
		<svg viewBox="0 0 24 24" className="w-8 h-8">
			<rect width="24" height="24" rx="2" fill="#330000"/>
			<path d="M11.5 17H8.5L7.5 14H4.5L3.5 17H2.5L5.5 7H6.5L11.5 17ZM7 13L6 10L5 13H7Z" fill="#FF9A00"/>
			<path d="M13 7H14V17H13V7Z" fill="#FF9A00"/>
			<circle cx="13.5" cy="5.5" r="1" fill="#FF9A00"/>
		</svg>
	);
}

function VercelIcon() {
	return (
		<svg viewBox="0 0 24 24" className="w-8 h-8">
			<path d="M12 2L22 20H2L12 2Z" fill="black"/>
		</svg>
	);
}

function StripeIcon() {
	return (
		<svg viewBox="0 0 24 24" className="w-8 h-8">
			<rect width="24" height="24" rx="4" fill="#635BFF"/>
			<path d="M11.5 9.5C11.5 8.94772 11.9477 8.5 12.5 8.5H14.5C15.0523 8.5 15.5 8.94772 15.5 9.5V10C15.5 10.2761 15.2761 10.5 15 10.5C14.7239 10.5 14.5 10.2761 14.5 10V9.5H12.5V14.5H14.5V14C14.5 13.7239 14.7239 13.5 15 13.5C15.2761 13.5 15.5 13.7239 15.5 14V14.5C15.5 15.0523 15.0523 15.5 14.5 15.5H12.5C11.9477 15.5 11.5 15.0523 11.5 14.5V9.5Z" fill="white"/>
			<path d="M8.5 9.5C8.5 8.94772 8.94772 8.5 9.5 8.5H10C10.2761 8.5 10.5 8.72386 10.5 9C10.5 9.27614 10.2761 9.5 10 9.5H9.5V11.5H10C10.2761 11.5 10.5 11.7239 10.5 12C10.5 12.2761 10.2761 12.5 10 12.5H9.5V14.5H10C10.2761 14.5 10.5 14.7239 10.5 15C10.5 15.2761 10.2761 15.5 10 15.5H9.5C8.94772 15.5 8.5 15.0523 8.5 14.5V9.5Z" fill="white"/>
		</svg>
	);
}

function MollieIcon() {
	return (
		<svg viewBox="0 0 24 24" className="w-8 h-8">
			<rect width="24" height="24" rx="4" fill="#000000"/>
			<path d="M6 9C6 8.44772 6.44772 8 7 8C8.5 8 9.5 9 10 10C10.5 9 11.5 8 13 8C14.5 8 15.5 9 16 10C16.5 9 17.5 8 19 8C19.5523 8 20 8.44772 20 9V16C20 16.5523 19.5523 17 19 17C18.4477 17 18 16.5523 18 16V11C17.5 10.5 17 10 16.5 10C16 10 15.5 10.5 15 11V16C15 16.5523 14.5523 17 14 17C13.4477 17 13 16.5523 13 16V11C12.5 10.5 12 10 11.5 10C11 10 10.5 10.5 10 11V16C10 16.5523 9.55228 17 9 17C8.44772 17 8 16.5523 8 16V11C7.5 10.5 7 10 6.5 10C6 10 6 10 6 10V9Z" fill="white"/>
		</svg>
	);
}

// Icon component mapping
const iconComponents: Record<string, () => React.ReactElement> = {
	"Next.js": NextJsIcon,
	"React": ReactIcon,
	"TypeScript": TypeScriptIcon,
	"Tailwind CSS": TailwindIcon,
	"VS Code": VSCodeIcon,
	"ChatGPT": ChatGPTIcon,
	"Figma": FigmaIcon,
	"Photoshop": PhotoshopIcon,
	"Illustrator": IllustratorIcon,
	"Vercel": VercelIcon,
	"Stripe": StripeIcon,
	"Mollie": MollieIcon,
};

export function TechStack() {
	return (
		<section className="py-20 md:py-28 bg-white overflow-hidden">
			<div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
					{/* Left side - Text content */}
					<div>
						<span 
							className="inline-block text-[14px] font-semibold tracking-[-0.01em] text-neutral-500 mb-4"
							style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
						>
							Onze technologie
						</span>
						<h2 
							className="text-[32px] leading-[1.1] font-semibold tracking-[-0.02em] text-neutral-900 md:text-[40px] lg:text-[44px]"
							style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
						>
							Gebouwd met de{" "}
							<span 
								style={{ 
									background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 40%, #fb7185 70%, #f97316 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
								}}
							>
								nieuwste technologieën
							</span>
						</h2>
						<p 
							className="mt-5 text-[17px] leading-[1.6] text-neutral-600"
							style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
						>
							Wij werken uitsluitend met moderne, bewezen technologieën. Van AI-gestuurde ontwikkeling tot de snelste frameworks - jouw website is klaar voor de toekomst.
						</p>
						
						{/* Feature list */}
						<ul className="mt-8 space-y-4">
							{[
								{ title: "AI-Powered Development", desc: "ChatGPT & GitHub Copilot voor snellere, slimmere code" },
								{ title: "Next.js & React", desc: "De snelste frameworks voor web development" },
								{ title: "Adobe Creative Suite", desc: "Professioneel design met Photoshop, Illustrator & Figma" },
							].map((item, i) => (
								<li key={i} className="flex gap-3">
									<div className="mt-1 w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
										<svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<div>
										<p className="font-semibold text-neutral-900 text-[15px]">{item.title}</p>
										<p className="text-neutral-500 text-[14px]">{item.desc}</p>
									</div>
								</li>
							))}
						</ul>

						<div className="mt-10">
							<Link href="/over-ons">
								<Button
									size="lg"
									className="bg-neutral-900 text-white hover:bg-neutral-800 px-8"
									rightIcon={<ArrowRight className="w-4 h-4" />}
								>
									Bekijk onze werkwijze
								</Button>
							</Link>
						</div>
					</div>

					{/* Right side - Technology grid */}
					<div className="relative">
						{/* Background decoration */}
						<div className="absolute -inset-4 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-3xl -z-10" />
						
						{/* Tech grid */}
						<div className="grid grid-cols-4 gap-3 p-4">
							{technologies.map((tech, index) => {
								const IconComponent = iconComponents[tech.name];
								return (
									<div
										key={tech.name}
										className={`group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center aspect-square ${
											// Stagger animation delay
											index % 2 === 0 ? 'animate-float-slow' : 'animate-float-slower'
										}`}
										style={{
											animationDelay: `${index * 100}ms`,
										}}
									>
										{/* Icon */}
										<div className="mb-2 transition-transform duration-300 group-hover:scale-110">
											{IconComponent && <IconComponent />}
										</div>
										
										{/* Name - hidden on mobile, visible on hover on desktop */}
										<p className="text-[10px] font-medium text-neutral-600 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-2">
											{tech.name}
										</p>

										{/* Tooltip on hover */}
										<div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20">
											{tech.name}
											<span className="block text-[9px] text-neutral-400 font-normal">{tech.category}</span>
											<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>

			{/* CSS for floating animation */}
			<style jsx>{`
				@keyframes float-slow {
					0%, 100% {
						transform: translateY(0px);
					}
					50% {
						transform: translateY(-6px);
					}
				}
				@keyframes float-slower {
					0%, 100% {
						transform: translateY(0px);
					}
					50% {
						transform: translateY(-4px);
					}
				}
				.animate-float-slow {
					animation: float-slow 4s ease-in-out infinite;
				}
				.animate-float-slower {
					animation: float-slower 5s ease-in-out infinite;
				}
			`}</style>
		</section>
	);
}
