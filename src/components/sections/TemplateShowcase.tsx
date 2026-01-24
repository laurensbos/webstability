"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, ShoppingBag, Star, Play, Calendar, MapPin, Clock, Users, Dumbbell, Heart } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";

// Portfolio projecten met website templates
export const projects = [
	{
		id: "velvet-bistro",
		title: "Velvet Bistro",
		category: "Horeca",
		description: "Een modern restaurant met focus op lokale ingrediënten en seizoensgebonden gerechten. De website combineert elegantie met gebruiksgemak.",
		image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
		services: ["Website Design", "Online Reserveringen", "Menu Beheer"],
		year: "2025",
		url: "velvetbistro.nl",
	},
	{
		id: "nordic-studio",
		title: "Nordic Studio",
		category: "Interieur Design",
		description: "Minimalistisch interieurbureau gespecialiseerd in Scandinavisch design. Een portfolio site die hun werk centraal stelt.",
		image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
		services: ["Portfolio Website", "Project Galerij", "Contact Formulier"],
		year: "2025",
		url: "nordicstudio.nl",
	},
	{
		id: "freshly-organic",
		title: "Freshly Organic",
		category: "E-commerce",
		description: "Webshop voor biologische producten met abonnementsdienst. Complete e-commerce oplossing met Mollie betalingen.",
		image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
		services: ["Webshop", "Abonnementen", "Bezorgplanning"],
		year: "2024",
		url: "freshlyorganic.nl",
	},
	{
		id: "peak-fitness",
		title: "Peak Fitness",
		category: "Sport & Gezondheid",
		description: "Moderne sportschool met online ledenportaal en lesrooster. Leden kunnen eenvoudig inschrijven en hun voortgang bijhouden.",
		image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
		services: ["Ledenportaal", "Rooster Systeem", "Online Betaling"],
		year: "2024",
		url: "peakfitness.nl",
	},
	{
		id: "artisan-bakery",
		title: "Artisan Bakery",
		category: "Horeca",
		description: "Ambachtelijke bakkerij met online besteloptie. Klanten kunnen vooraf bestellen en ophalen.",
		image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
		services: ["Website", "Bestelformulier", "Producten"],
		year: "2024",
		url: "artisanbakery.nl",
	},
	{
		id: "bloom-flowers",
		title: "Bloom Flowers",
		category: "E-commerce",
		description: "Bloemenwinkel met bezorgservice. Klanten kunnen online boeketten samenstellen en laten bezorgen.",
		image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80",
		services: ["Webshop", "Bezorging", "Abonnementen"],
		year: "2024",
		url: "bloomflowers.nl",
	},
];

// Template 1: Restaurant / Horeca - Velvet Bistro
function RestaurantTemplate() {
	return (
		<div className="w-full h-full bg-[#1a1a1a] text-white overflow-hidden flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
				<div className="flex items-center gap-1.5">
					<div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
					<span className="text-[10px] font-semibold tracking-wide">VELVET</span>
				</div>
				<div className="flex items-center gap-3 text-[8px] text-white/70">
					<span>Menu</span>
					<span>Reserveren</span>
					<span>Contact</span>
				</div>
			</div>
			
			{/* Hero */}
			<div className="flex-1 relative">
				<div 
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80)' }}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/40 to-transparent" />
				<div className="absolute bottom-0 left-0 right-0 p-4">
					<p className="text-[8px] text-amber-400 font-medium tracking-widest mb-1">FINE DINING</p>
					<h1 className="text-lg font-light leading-tight mb-2">Culinaire<br />Perfectie</h1>
					<p className="text-[8px] text-white/60 leading-relaxed mb-3 max-w-[180px]">
						Ontdek onze seizoensgebonden gerechten bereid met lokale ingrediënten
					</p>
					<div className="flex gap-2">
						<div className="px-3 py-1.5 bg-amber-500 text-[8px] font-medium rounded-full text-black">
							Reserveren
						</div>
						<div className="px-3 py-1.5 border border-white/30 text-[8px] rounded-full flex items-center gap-1">
							<Play className="w-2 h-2" /> Bekijk video
						</div>
					</div>
				</div>
			</div>
			
			{/* Bottom info */}
			<div className="flex justify-between items-center px-4 py-2.5 bg-[#0f0f0f] text-[7px]">
				<div className="flex items-center gap-1 text-white/50">
					<Clock className="w-2.5 h-2.5" />
					<span>Di-Zo: 17:00 - 23:00</span>
				</div>
				<div className="flex items-center gap-1 text-white/50">
					<MapPin className="w-2.5 h-2.5" />
					<span>Amsterdam</span>
				</div>
			</div>
		</div>
	);
}

// Template 2: Interior Design - Nordic Studio
function InteriorTemplate() {
	return (
		<div className="w-full h-full bg-[#f8f6f3] overflow-hidden flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3">
				<span className="text-[10px] font-medium tracking-[0.2em] text-neutral-800">NORDIC</span>
				<Menu className="w-4 h-4 text-neutral-400" />
			</div>
			
			{/* Main content */}
			<div className="flex-1 px-4 pb-3 flex flex-col">
				{/* Featured project */}
				<div className="relative flex-1 rounded-xl overflow-hidden mb-3">
					<div 
						className="absolute inset-0 bg-cover bg-center"
						style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80)' }}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
					<div className="absolute bottom-3 left-3 right-3">
						<p className="text-[7px] text-white/70 mb-0.5">Nieuwste project</p>
						<p className="text-white text-[11px] font-medium">Minimalist Living Space</p>
					</div>
					<div className="absolute top-3 right-3">
						<ArrowUpRight className="w-4 h-4 text-white" />
					</div>
				</div>
				
				{/* Project grid */}
				<div className="grid grid-cols-2 gap-2">
					<div className="relative rounded-lg overflow-hidden aspect-square">
						<div 
							className="absolute inset-0 bg-cover bg-center"
							style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80)' }}
						/>
					</div>
					<div className="relative rounded-lg overflow-hidden aspect-square">
						<div 
							className="absolute inset-0 bg-cover bg-center"
							style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80)' }}
						/>
					</div>
				</div>
			</div>
			
			{/* Bottom nav */}
			<div className="flex justify-center gap-8 py-2.5 border-t border-neutral-200 text-[8px] text-neutral-500">
				<span className="text-neutral-900 font-medium">Portfolio</span>
				<span>Over ons</span>
				<span>Contact</span>
			</div>
		</div>
	);
}

// Template 3: E-commerce - Freshly Organic
function EcommerceTemplate() {
	return (
		<div className="w-full h-full bg-white overflow-hidden flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-100">
				<div className="flex items-center gap-1.5">
					<div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
						<span className="text-[6px] text-white font-bold">F</span>
					</div>
					<span className="text-[9px] font-semibold text-neutral-800">Freshly</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="relative">
						<ShoppingBag className="w-4 h-4 text-neutral-600" />
						<div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
							<span className="text-[6px] text-white font-bold">3</span>
						</div>
					</div>
				</div>
			</div>
			
			{/* Hero banner */}
			<div className="relative h-20 mx-3 mt-2 rounded-xl overflow-hidden">
				<div 
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&q=80)' }}
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-transparent" />
				<div className="absolute left-3 top-1/2 -translate-y-1/2">
					<p className="text-[7px] text-green-300 font-medium">NIEUW</p>
					<p className="text-white text-[11px] font-semibold leading-tight">Lente<br />Collectie</p>
					<div className="mt-1 px-2 py-0.5 bg-white text-[7px] font-medium text-green-700 rounded-full inline-block">
						Shop nu
					</div>
				</div>
			</div>
			
			{/* Products */}
			<div className="flex-1 px-3 pt-3">
				<div className="flex items-center justify-between mb-2">
					<span className="text-[10px] font-semibold text-neutral-800">Populair</span>
					<span className="text-[8px] text-green-600">Bekijk alle</span>
				</div>
				<div className="grid grid-cols-2 gap-2">
					{[
						{ name: 'Bio Avocado', price: '€2.49', img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200&q=80' },
						{ name: 'Verse Smoothie', price: '€4.99', img: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=200&q=80' },
					].map((product, i) => (
						<div key={i} className="bg-neutral-50 rounded-lg p-2">
							<div 
								className="w-full aspect-square rounded-lg bg-cover bg-center mb-1.5"
								style={{ backgroundImage: `url(${product.img})` }}
							/>
							<p className="text-[8px] font-medium text-neutral-800">{product.name}</p>
							<div className="flex items-center justify-between mt-0.5">
								<span className="text-[9px] font-semibold text-green-600">{product.price}</span>
								<div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
									<span className="text-white text-[10px]">+</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			
			{/* Bottom nav */}
			<div className="flex justify-around py-2 border-t border-neutral-100">
				{['Home', 'Zoek', 'Favorieten', 'Account'].map((item, i) => (
					<div key={i} className={`text-[7px] ${i === 0 ? 'text-green-600 font-medium' : 'text-neutral-400'}`}>
						{item}
					</div>
				))}
			</div>
		</div>
	);
}

// Template 4: Fitness - Peak Fitness
function FitnessTemplate() {
	return (
		<div className="w-full h-full bg-neutral-900 text-white overflow-hidden flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-2.5">
				<div className="flex items-center gap-1.5">
					<Dumbbell className="w-4 h-4 text-orange-500" />
					<span className="text-[10px] font-bold tracking-wide">PEAK</span>
				</div>
				<div className="px-2 py-1 bg-orange-500 rounded-full text-[7px] font-semibold">
					Start nu
				</div>
			</div>
			
			{/* Hero */}
			<div className="relative flex-1 mx-3 rounded-xl overflow-hidden">
				<div 
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80)' }}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
				<div className="absolute bottom-3 left-3 right-3">
					<p className="text-[8px] text-orange-400 font-semibold tracking-wider mb-1">WORD LID</p>
					<h1 className="text-lg font-bold leading-tight mb-1">Push Your<br />Limits</h1>
					<p className="text-[8px] text-white/60 mb-2">Bereik je fitness doelen met onze experts</p>
				</div>
			</div>
			
			{/* Stats */}
			<div className="grid grid-cols-3 gap-2 p-3">
				{[
					{ icon: Users, label: 'Leden', value: '2.5k+' },
					{ icon: Dumbbell, label: 'Apparaten', value: '150+' },
					{ icon: Heart, label: 'Lessen/week', value: '45+' },
				].map((stat, i) => (
					<div key={i} className="bg-neutral-800 rounded-lg p-2 text-center">
						<stat.icon className="w-3 h-3 text-orange-500 mx-auto mb-1" />
						<p className="text-[10px] font-bold">{stat.value}</p>
						<p className="text-[6px] text-white/50">{stat.label}</p>
					</div>
				))}
			</div>
			
			{/* Schedule preview */}
			<div className="px-3 pb-2">
				<div className="bg-gradient-to-r from-orange-500/20 to-transparent rounded-lg p-2 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Calendar className="w-4 h-4 text-orange-500" />
						<div>
							<p className="text-[8px] font-medium">Vandaag: HIIT Training</p>
							<p className="text-[7px] text-white/50">18:00 - 19:00</p>
						</div>
					</div>
					<div className="text-[7px] text-orange-400">Reserveer →</div>
				</div>
			</div>
		</div>
	);
}

// Template 5: Bakery - Artisan Bakery
function BakeryTemplate() {
	return (
		<div className="w-full h-full bg-[#faf8f5] overflow-hidden flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3 bg-[#3d2c1e]">
				<span className="text-[10px] font-serif text-[#e8dfd4] tracking-wider">Artisan</span>
				<div className="flex items-center gap-3 text-[7px] text-[#e8dfd4]/70">
					<span>Producten</span>
					<span>Bestellen</span>
				</div>
			</div>
			
			{/* Hero */}
			<div className="relative h-28 m-3 rounded-2xl overflow-hidden">
				<div 
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80)' }}
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-[#3d2c1e]/80 to-transparent" />
				<div className="absolute left-4 top-1/2 -translate-y-1/2">
					<p className="text-[7px] text-amber-300 font-medium tracking-widest">AMBACHTELIJK</p>
					<h1 className="text-white text-base font-serif leading-tight mt-1">Vers uit<br />de oven</h1>
					<div className="mt-2 flex items-center gap-1">
						{[...Array(5)].map((_, i) => (
							<Star key={i} className="w-2 h-2 fill-amber-400 text-amber-400" />
						))}
						<span className="text-[6px] text-white/70 ml-1">4.9 (128)</span>
					</div>
				</div>
			</div>
			
			{/* Products */}
			<div className="flex-1 px-3">
				<p className="text-[10px] font-medium text-[#3d2c1e] mb-2">Vandaag vers</p>
				<div className="space-y-2">
					{[
						{ name: 'Zuurdesembrood', price: '€4.50', time: 'Vers gebakken' },
						{ name: 'Croissants (4x)', price: '€6.00', time: 'Boterrijk' },
					].map((item, i) => (
						<div key={i} className="flex items-center gap-3 bg-white rounded-xl p-2 shadow-sm">
							<div className="w-12 h-12 rounded-lg bg-amber-100" />
							<div className="flex-1">
								<p className="text-[9px] font-medium text-[#3d2c1e]">{item.name}</p>
								<p className="text-[7px] text-neutral-400">{item.time}</p>
							</div>
							<div className="text-right">
								<p className="text-[9px] font-semibold text-[#3d2c1e]">{item.price}</p>
								<div className="mt-0.5 px-2 py-0.5 bg-[#3d2c1e] text-[6px] text-white rounded-full">
									Toevoegen
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			
			{/* Bottom CTA */}
			<div className="p-3">
				<div className="bg-[#3d2c1e] rounded-xl p-3 flex items-center justify-between">
					<div>
						<p className="text-[9px] text-white font-medium">Bestel voor morgen</p>
						<p className="text-[7px] text-white/60">Voor 21:00 besteld = morgen vers</p>
					</div>
					<ArrowUpRight className="w-4 h-4 text-amber-400" />
				</div>
			</div>
		</div>
	);
}

// Template 6: Flower Shop - Bloom Flowers
function FlowerShopTemplate() {
	return (
		<div className="w-full h-full bg-gradient-to-b from-rose-50 to-white overflow-hidden flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3">
				<div className="flex items-center gap-1.5">
					<div className="w-5 h-5 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
						<span className="text-[8px] text-white">✿</span>
					</div>
					<span className="text-[10px] font-medium text-neutral-700">Bloom</span>
				</div>
				<ShoppingBag className="w-4 h-4 text-neutral-500" />
			</div>
			
			{/* Search */}
			<div className="px-3 mb-2">
				<div className="bg-white rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm border border-rose-100">
					<span className="text-[8px] text-neutral-400">🔍 Zoek bloemen...</span>
				</div>
			</div>
			
			{/* Featured */}
			<div className="relative mx-3 h-24 rounded-2xl overflow-hidden mb-3">
				<div 
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&q=80)' }}
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-rose-600/70 to-transparent" />
				<div className="absolute left-3 top-1/2 -translate-y-1/2">
					<p className="text-[7px] text-rose-200 font-medium">VALENTIJN</p>
					<p className="text-white text-sm font-medium leading-tight">Romantische<br />Boeketten</p>
					<div className="mt-1.5 px-2 py-0.5 bg-white text-[7px] font-medium text-rose-600 rounded-full inline-block">
						Bestel nu
					</div>
				</div>
			</div>
			
			{/* Categories */}
			<div className="px-3 mb-2">
				<div className="flex gap-2 overflow-x-auto">
					{['Rozen', 'Tulpen', 'Boeketten', 'Planten'].map((cat, i) => (
						<div 
							key={i} 
							className={`px-3 py-1 rounded-full text-[8px] whitespace-nowrap ${
								i === 0 ? 'bg-rose-500 text-white' : 'bg-white text-neutral-600 border border-rose-100'
							}`}
						>
							{cat}
						</div>
					))}
				</div>
			</div>
			
			{/* Products */}
			<div className="flex-1 px-3">
				<div className="grid grid-cols-2 gap-2">
					{[
						{ name: 'Rode Rozen', price: '€29.95', img: 'https://images.unsplash.com/photo-1518882605630-8a6f05a77d22?w=200&q=80' },
						{ name: 'Lente Mix', price: '€34.95', img: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=200&q=80' },
					].map((product, i) => (
						<div key={i} className="bg-white rounded-xl p-2 shadow-sm">
							<div 
								className="w-full aspect-square rounded-lg bg-cover bg-center mb-1.5"
								style={{ backgroundImage: `url(${product.img})` }}
							/>
							<p className="text-[8px] font-medium text-neutral-800">{product.name}</p>
							<div className="flex items-center justify-between mt-0.5">
								<span className="text-[9px] font-semibold text-rose-500">{product.price}</span>
								<Heart className="w-3 h-3 text-rose-300" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// Component mapping
const templateComponents: Record<string, () => React.ReactElement> = {
	"velvet-bistro": RestaurantTemplate,
	"nordic-studio": InteriorTemplate,
	"freshly-organic": EcommerceTemplate,
	"peak-fitness": FitnessTemplate,
	"artisan-bakery": BakeryTemplate,
	"bloom-flowers": FlowerShopTemplate,
};

export function TemplateShowcase() {
	const [isPaused, setIsPaused] = useState(false);
	const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });
	
	// Duplicate projects for seamless infinite scroll
	const duplicatedProjects = [...projects, ...projects];

	return (
		<section ref={sectionRef} className="py-16 md:py-20 bg-white overflow-hidden">
			<div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
				{/* Header */}
				<div className={`mb-10 transition-all duration-700 ease-out ${
					isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
				}`}>
					<h2 
						className="text-[32px] leading-[1.1] font-semibold tracking-[-0.02em] text-neutral-900 md:text-[40px] lg:text-[48px]"
						style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
					>
						Inspiratie voor volgende projecten
					</h2>
				</div>
			</div>

			{/* Infinite scroll carousel - full width */}
			<div 
				className={`relative transition-all duration-700 ease-out ${
					isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
				}`}
				style={{ transitionDelay: '200ms' }}
				onMouseEnter={() => setIsPaused(true)}
				onMouseLeave={() => setIsPaused(false)}
			>
				<div 
					className={`flex gap-6 ${isPaused ? 'animation-paused' : ''}`}
					style={{
						animation: 'scroll 40s linear infinite',
						width: 'max-content',
					}}
				>
					{duplicatedProjects.map((project, index) => {
						const TemplateComponent = templateComponents[project.id];
						return (
							<Link
								key={`${project.id}-${index}`}
								href={`/portfolio/${project.id}`}
								className="group flex-shrink-0 w-[280px] sm:w-[320px]"
							>
								{/* Website mockup container */}
								<div className="relative rounded-xl overflow-hidden bg-neutral-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
									{/* Browser chrome */}
									<div className="bg-neutral-200 px-3 py-2 flex items-center gap-2">
										<div className="flex gap-1.5">
											<div className="w-2.5 h-2.5 rounded-full bg-red-400" />
											<div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
											<div className="w-2.5 h-2.5 rounded-full bg-green-400" />
										</div>
										<div className="flex-1 bg-white rounded-md px-2 py-0.5 text-[8px] text-neutral-400 truncate">
											{project.url}
										</div>
									</div>
									
									{/* Website content */}
									<div className="aspect-[4/5] overflow-hidden">
										{TemplateComponent && <TemplateComponent />}
									</div>
								</div>
								
								{/* Title below */}
								<p 
									className="mt-4 text-[14px] font-medium tracking-[-0.01em] text-neutral-600 group-hover:text-neutral-900 transition-colors"
									style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
								>
									{project.category}
								</p>
							</Link>
						);
					})}
				</div>
			</div>

			{/* CSS for animation */}
			<style jsx>{`
				@keyframes scroll {
					0% {
						transform: translateX(0);
					}
					100% {
						transform: translateX(-50%);
					}
				}
				.animation-paused {
					animation-play-state: paused !important;
				}
			`}</style>
		</section>
	);
}
