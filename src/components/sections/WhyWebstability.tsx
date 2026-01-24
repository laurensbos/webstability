"use client";

import React from "react";
import { 
	Zap, 
	Shield, 
	Headphones, 
	TrendingUp, 
	Palette, 
	Clock,
	CheckCircle2,
	ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";

// Feature cards met mini website previews
const features = [
	{
		id: "fast",
		icon: Zap,
		title: "Razendsnelle websites",
		description: "Geoptimaliseerde code voor maximale snelheid. Laadtijd onder 2 seconden gegarandeerd.",
		color: "from-amber-400 to-orange-500",
		bgColor: "bg-amber-50",
		preview: FastPreview,
	},
	{
		id: "secure",
		icon: Shield,
		title: "Veilig & betrouwbaar",
		description: "SSL-certificaat, dagelijkse backups en 99.9% uptime. Jouw website is in veilige handen.",
		color: "from-emerald-400 to-green-500",
		bgColor: "bg-emerald-50",
		preview: SecurePreview,
	},
	{
		id: "support",
		icon: Headphones,
		title: "Persoonlijke support",
		description: "Direct contact met je eigen accountmanager. Geen wachtrijen, geen tickets.",
		color: "from-blue-400 to-indigo-500",
		bgColor: "bg-blue-50",
		preview: SupportPreview,
	},
	{
		id: "seo",
		icon: TrendingUp,
		title: "SEO geoptimaliseerd",
		description: "Gevonden worden in Google. Technische SEO is standaard inbegrepen.",
		color: "from-purple-400 to-violet-500",
		bgColor: "bg-purple-50",
		preview: SEOPreview,
	},
	{
		id: "design",
		icon: Palette,
		title: "Uniek design",
		description: "Geen templates. Elk ontwerp wordt op maat gemaakt voor jouw merk en doelgroep.",
		color: "from-pink-400 to-rose-500",
		bgColor: "bg-pink-50",
		preview: DesignPreview,
	},
	{
		id: "time",
		icon: Clock,
		title: "Snel online",
		description: "Van eerste gesprek tot live website in 2-4 weken. Efficiënt en zonder gedoe.",
		color: "from-cyan-400 to-teal-500",
		bgColor: "bg-cyan-50",
		preview: TimePreview,
	},
];

// Mini preview: Speed/Performance
function FastPreview() {
	return (
		<div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 p-3 flex flex-col">
			{/* Speed meter */}
			<div className="flex-1 flex items-center justify-center">
				<div className="relative w-20 h-20">
					{/* Outer ring */}
					<svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
						<circle
							cx="50"
							cy="50"
							r="40"
							fill="none"
							stroke="#fed7aa"
							strokeWidth="8"
						/>
						<circle
							cx="50"
							cy="50"
							r="40"
							fill="none"
							stroke="url(#speedGradient)"
							strokeWidth="8"
							strokeLinecap="round"
							strokeDasharray="251.2"
							strokeDashoffset="25"
						/>
						<defs>
							<linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
								<stop offset="0%" stopColor="#f59e0b" />
								<stop offset="100%" stopColor="#ea580c" />
							</linearGradient>
						</defs>
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<span className="text-lg font-bold text-orange-600">98</span>
						<span className="text-[6px] text-orange-400 font-medium">SCORE</span>
					</div>
				</div>
			</div>
			{/* Stats row */}
			<div className="grid grid-cols-3 gap-1 mt-2">
				{[
					{ label: 'LCP', value: '1.2s', good: true },
					{ label: 'FID', value: '18ms', good: true },
					{ label: 'CLS', value: '0.02', good: true },
				].map((stat, i) => (
					<div key={i} className="bg-white rounded-md p-1.5 text-center shadow-sm">
						<p className="text-[7px] text-neutral-400">{stat.label}</p>
						<p className="text-[9px] font-semibold text-green-600">{stat.value}</p>
					</div>
				))}
			</div>
		</div>
	);
}

// Mini preview: Security
function SecurePreview() {
	return (
		<div className="w-full h-full bg-gradient-to-br from-emerald-50 to-green-50 p-3 flex flex-col">
			{/* Shield icon */}
			<div className="flex-1 flex items-center justify-center">
				<div className="relative">
					<div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-200">
						<Shield className="w-8 h-8 text-white" />
					</div>
					<div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
						<CheckCircle2 className="w-4 h-4 text-green-500" />
					</div>
				</div>
			</div>
			{/* Security features */}
			<div className="space-y-1.5 mt-2">
				{['SSL Certificaat', 'Dagelijkse Backup', '99.9% Uptime'].map((item, i) => (
					<div key={i} className="flex items-center gap-1.5 bg-white rounded-md px-2 py-1 shadow-sm">
						<div className="w-1.5 h-1.5 rounded-full bg-green-500" />
						<span className="text-[8px] font-medium text-neutral-700">{item}</span>
					</div>
				))}
			</div>
		</div>
	);
}

// Mini preview: Support
function SupportPreview() {
	return (
		<div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-3 flex flex-col">
			{/* Chat bubbles */}
			<div className="flex-1 flex flex-col justify-center gap-2">
				{/* User message */}
				<div className="flex justify-end">
					<div className="bg-blue-500 text-white rounded-xl rounded-br-sm px-2.5 py-1.5 max-w-[85%]">
						<p className="text-[8px]">Kunnen jullie mijn logo aanpassen?</p>
					</div>
				</div>
				{/* Support response */}
				<div className="flex justify-start gap-1.5">
					<div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
						<Headphones className="w-2.5 h-2.5 text-white" />
					</div>
					<div className="bg-white rounded-xl rounded-bl-sm px-2.5 py-1.5 shadow-sm max-w-[80%]">
						<p className="text-[8px] text-neutral-700">Natuurlijk! Ik pas het direct voor je aan 👍</p>
					</div>
				</div>
				{/* Typing indicator */}
				<div className="flex justify-start gap-1.5">
					<div className="w-5 h-5 rounded-full bg-transparent" />
					<div className="bg-white rounded-xl px-3 py-2 shadow-sm flex gap-1">
						<div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
						<div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
						<div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
					</div>
				</div>
			</div>
			{/* Response time */}
			<div className="mt-2 bg-white rounded-lg p-2 shadow-sm text-center">
				<p className="text-[7px] text-neutral-400">Gemiddelde reactietijd</p>
				<p className="text-[11px] font-bold text-blue-600">&lt; 2 uur</p>
			</div>
		</div>
	);
}

// Mini preview: SEO
function SEOPreview() {
	return (
		<div className="w-full h-full bg-gradient-to-br from-purple-50 to-violet-50 p-3 flex flex-col">
			{/* Google search result mockup */}
			<div className="bg-white rounded-lg p-2.5 shadow-sm flex-1">
				<div className="flex items-center gap-1 mb-2">
					<div className="flex gap-0.5">
						<span className="text-[10px] font-semibold text-blue-600">G</span>
						<span className="text-[10px] font-semibold text-red-500">o</span>
						<span className="text-[10px] font-semibold text-yellow-500">o</span>
						<span className="text-[10px] font-semibold text-blue-600">g</span>
						<span className="text-[10px] font-semibold text-green-500">l</span>
						<span className="text-[10px] font-semibold text-red-500">e</span>
					</div>
				</div>
				{/* Search result */}
				<div className="border-l-2 border-purple-400 pl-2">
					<p className="text-[9px] text-purple-600 font-medium mb-0.5">jouwbedrijf.nl</p>
					<p className="text-[8px] text-blue-700 font-semibold leading-tight">Jouw Bedrijf - De beste in...</p>
					<p className="text-[6px] text-neutral-500 leading-relaxed mt-0.5">Premium diensten voor ondernemers. ★★★★★ 4.9/5 sterren...</p>
				</div>
			</div>
			{/* Rankings */}
			<div className="grid grid-cols-2 gap-1.5 mt-2">
				<div className="bg-white rounded-md p-1.5 shadow-sm text-center">
					<p className="text-[6px] text-neutral-400">Positie</p>
					<p className="text-[11px] font-bold text-purple-600">#1</p>
				</div>
				<div className="bg-white rounded-md p-1.5 shadow-sm text-center">
					<p className="text-[6px] text-neutral-400">Clicks/maand</p>
					<p className="text-[11px] font-bold text-purple-600">2.4k</p>
				</div>
			</div>
		</div>
	);
}

// Mini preview: Design
function DesignPreview() {
	return (
		<div className="w-full h-full bg-gradient-to-br from-pink-50 to-rose-50 p-3 flex flex-col">
			{/* Color palette */}
			<div className="flex-1 flex flex-col items-center justify-center">
				<div className="flex gap-1.5 mb-3">
					{['#1a1a1a', '#f43f5e', '#fb7185', '#fecdd3', '#fff1f2'].map((color, i) => (
						<div 
							key={i} 
							className="w-6 h-6 rounded-full shadow-sm ring-2 ring-white"
							style={{ backgroundColor: color }}
						/>
					))}
				</div>
				{/* Typography preview */}
				<div className="text-center">
					<p className="text-[14px] font-bold text-neutral-800" style={{ fontFamily: 'serif' }}>Aa</p>
					<p className="text-[7px] text-neutral-400 mt-0.5">Custom Typography</p>
				</div>
			</div>
			{/* Design elements */}
			<div className="grid grid-cols-3 gap-1.5 mt-2">
				{['Logo', 'Iconen', 'Layout'].map((item, i) => (
					<div key={i} className="bg-white rounded-md py-1.5 shadow-sm text-center">
						<span className="text-[7px] font-medium text-rose-600">{item}</span>
					</div>
				))}
			</div>
		</div>
	);
}

// Mini preview: Time
function TimePreview() {
	return (
		<div className="w-full h-full bg-gradient-to-br from-cyan-50 to-teal-50 p-3 flex flex-col">
			{/* Timeline */}
			<div className="flex-1 flex flex-col justify-center">
				<div className="relative">
					{/* Progress bar */}
					<div className="h-1.5 bg-cyan-200 rounded-full">
						<div className="h-full w-3/4 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full" />
					</div>
					{/* Milestones */}
					<div className="flex justify-between mt-2">
						{[
							{ week: 'Week 1', label: 'Design' },
							{ week: 'Week 2', label: 'Bouw' },
							{ week: 'Week 3', label: 'Test' },
							{ week: 'Week 4', label: 'Live!' },
						].map((milestone, i) => (
							<div key={i} className="text-center">
								<div className={`w-3 h-3 rounded-full mx-auto mb-1 ${i < 3 ? 'bg-gradient-to-br from-cyan-400 to-teal-500' : 'bg-cyan-200'} ${i < 3 ? 'ring-2 ring-white shadow-sm' : ''}`} />
								<p className="text-[6px] font-semibold text-teal-600">{milestone.week}</p>
								<p className="text-[5px] text-neutral-400">{milestone.label}</p>
							</div>
						))}
					</div>
				</div>
			</div>
			{/* Stats */}
			<div className="bg-white rounded-lg p-2 shadow-sm mt-3 flex items-center justify-between">
				<div>
					<p className="text-[6px] text-neutral-400">Gemiddelde doorlooptijd</p>
					<p className="text-[11px] font-bold text-teal-600">2-4 weken</p>
				</div>
				<Clock className="w-5 h-5 text-teal-400" />
			</div>
		</div>
	);
}

// Component mapping
const previewComponents: Record<string, () => React.ReactElement> = {
	"fast": FastPreview,
	"secure": SecurePreview,
	"support": SupportPreview,
	"seo": SEOPreview,
	"design": DesignPreview,
	"time": TimePreview,
};

export function WhyWebstability() {
	return (
		<section className="py-20 md:py-28 bg-[#f5f3ef]">
			<div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-14">
					<span 
						className="inline-block text-[14px] font-semibold tracking-[-0.01em] text-neutral-500 mb-4"
						style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
					>
						Waarom Webstability?
					</span>
					<h2 
						className="text-[32px] leading-[1.1] font-semibold tracking-[-0.02em] text-neutral-900 md:text-[40px] lg:text-[48px]"
						style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
					>
						Alles wat je nodig hebt,
						<br />
						<span 
							style={{ 
								background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 40%, #fb7185 70%, #f97316 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}
						>
							onder één dak
						</span>
					</h2>
					<p 
						className="mt-5 text-[17px] leading-[1.6] text-neutral-600 max-w-2xl mx-auto"
						style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
					>
						Geen losse leveranciers, geen gedoe met techniek. Wij regelen alles zodat jij je kunt focussen op ondernemen.
					</p>
				</div>

				{/* Feature grid */}
				<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => {
                        const PreviewComponent = previewComponents[feature.id];
                        return (
                            <div 
                                key={feature.id}
                                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                {/* Preview area */}
                                <div className="relative h-32 overflow-hidden">
                                    {/* Browser chrome */}
                                    <div className="absolute top-0 left-0 right-0 bg-neutral-100 px-2 py-1.5 flex items-center gap-2 z-10">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                        </div>
                                        <div className="flex-1 bg-white rounded px-1.5 py-0.5 text-[5.5px] text-neutral-400">
                                            webstability.nl/{feature.id}
                                        </div>
                                    </div>
                                    {/* Preview content */}
                                    <div className="pt-6 h-full">
                                        {PreviewComponent && <PreviewComponent />}
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="p-3">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-sm`}>
                                            <feature.icon className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 
                                            className="text-[15px] leading-[19px] font-semibold tracking-[-0.01em] text-[rgb(43,44,44)]"
                                            style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                                        >
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <p className="text-[13px] leading-[20px] text-neutral-500">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

				{/* CTA */}
				<div className="mt-14 text-center">
					<Link href="/over-ons">
						<Button
							size="lg"
							className="bg-neutral-900 text-white hover:bg-neutral-800 px-8"
							rightIcon={<ArrowRight className="w-4 h-4" />}
						>
							Meer over Webstability
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
