"use client";

import React from "react";
import { Star, ChevronLeft, ChevronRight, ArrowRight, ShoppingBag, Dumbbell, Scale, ChevronRight as ChevronRightIcon, Zap, MapPin } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { useRef, useState } from "react";
import { projects } from "@/lib/projects";

// Template 1: Restaurant / Fine Dining - Velvet Bistro
function RestaurantTemplate() {
	return (
		<div className="w-full h-full bg-[#1a1a1a] text-white overflow-hidden flex flex-col relative">
			<div className="absolute top-8 right-0 w-32 h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded-full blur-3xl opacity-30" style={{ animation: 'blob-pulse 8s ease-in-out infinite' }} />
			<div className="absolute top-16 left-8 w-1.5 h-1.5 bg-orange-400 rounded-full" style={{ animation: 'particle-rise 5s ease-in-out infinite' }} />
			<div className="absolute top-24 right-12 w-1 h-1 bg-red-400 rounded-full" style={{ animation: 'particle-rise 6s ease-in-out infinite 1s' }} />
			<div className="relative flex items-center justify-between px-4 py-2.5 z-10">
				<div className="flex items-center gap-2">
					<span className="text-[10px] font-black tracking-tight">VELVET<span className="text-orange-500">.</span></span>
				</div>
				<div className="flex items-center gap-3 text-[6px] text-white/40 uppercase tracking-wider">
					<span>Menu</span>
					<span>Reserveer</span>
				</div>
			</div>
			<div className="flex-1 relative mx-3 rounded-2xl overflow-hidden">
				<div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80)' }} />
				<div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-[#1a1a1a]/20" />
				<div className="absolute top-3 right-3 bg-orange-500 text-[5px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Nu geopend</div>
				<div className="absolute bottom-0 left-0 right-0 p-4">
					<p className="text-[6px] font-mono text-orange-400 mb-1 opacity-80">// FINE DINING AMSTERDAM</p>
					<h2 className="text-[16px] font-black leading-[0.95] tracking-tight">
						<span className="text-white">TASTE</span><br/>
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">THE FIRE</span>
					</h2>
				</div>
			</div>
			<div className="relative flex justify-between items-center px-4 py-2.5 z-10">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-1">
						{[...Array(5)].map((_, i) => (<Star key={i} className="w-2 h-2 fill-orange-500 text-orange-500" />))}
					</div>
					<span className="text-[6px] text-white/40">4.9 • 324 reviews</span>
				</div>
				<div className="px-2.5 py-1.5 bg-orange-500 text-[6px] font-bold rounded-full">BOOK TABLE</div>
			</div>
			<style jsx>{`@keyframes blob-pulse { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.2); opacity: 0.2; } } @keyframes particle-rise { 0%, 100% { transform: translateY(0); opacity: 0.6; } 50% { transform: translateY(-30px); opacity: 0.2; } }`}</style>
		</div>
	);
}

// Template 2: Coffee Company - BRŪT Coffee
function CreativeAgencyTemplate() {
	return (
		<div className="w-full h-full bg-[#0a0a0a] text-white overflow-hidden flex flex-col relative">
			<div className="absolute top-12 left-6 w-1.5 h-1.5 bg-[#D4AF37] rounded-full" style={{ animation: 'particle-float 4s ease-in-out infinite' }} />
			<div className="absolute top-20 left-12 w-2 h-2 bg-[#8B5A2B] rounded-full" style={{ animation: 'particle-float 5s ease-in-out infinite 1s' }} />
			<div className="relative flex items-center justify-between px-4 py-2.5 border-b border-white/5 z-10">
				<span className="text-[11px] font-black tracking-tighter">BRŪT<span className="text-[#D4AF37]">.</span></span>
				<div className="flex gap-3 text-[6px] font-bold tracking-wider text-white/40"><span>SHOP</span><span>ABOUT</span></div>
			</div>
			<div className="relative flex-1 flex flex-col justify-center px-4 z-10">
				<p className="text-[6px] font-mono text-[#D4AF37] mb-1.5 tracking-widest opacity-80">// SPECIALTY COFFEE</p>
				<h1 className="text-[26px] font-black leading-[0.85] tracking-tighter">
					<span className="text-[#8B5A2B] inline-block">BROWN</span><br/>
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8960C]">GOLD</span>
				</h1>
				<p className="mt-3 text-[7px] text-white/50 max-w-[140px] leading-relaxed font-light">Direct trade koffiebonen van de beste plantages. Gebrand in Amsterdam.</p>
			</div>
			<div className="relative mx-4 mb-3 h-20 rounded-xl overflow-hidden">
				<div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80)' }} />
				<div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
			</div>
			<div className="relative px-4 pb-3 z-10">
				<div className="flex gap-2">
					<div className="flex-1 py-2 bg-[#D4AF37] text-[8px] font-black text-center text-black">BESTEL NU</div>
					<div className="px-4 py-2 border-2 border-[#D4AF37] text-[8px] font-black text-[#D4AF37]">→</div>
				</div>
			</div>
			<style jsx>{`@keyframes particle-float { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; } 50% { transform: translateY(-20px) scale(1.3); opacity: 0.3; } }`}</style>
		</div>
	);
}

// Template 3: Fashion Webshop
function FashionWebshopTemplate() {
	return (
		<div className="w-full h-full bg-white overflow-hidden flex flex-col">
			<div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
				<span className="text-[10px] font-medium tracking-[0.15em] text-neutral-900">URBAN</span>
				<div className="flex items-center gap-3">
					<span className="text-[8px] text-neutral-400">Search</span>
					<div className="relative">
						<ShoppingBag className="w-4 h-4 text-neutral-700" />
						<div className="absolute -top-1 -right-1.5 w-3 h-3 bg-black rounded-full flex items-center justify-center">
							<span className="text-[6px] text-white font-medium">2</span>
						</div>
					</div>
				</div>
			</div>
			<div className="relative flex-1 mx-3 my-2 rounded-lg overflow-hidden">
				<div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80)' }} />
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
				<div className="absolute top-3 left-3"><span className="px-2 py-0.5 bg-black text-[7px] text-white font-medium">NEW IN</span></div>
				<div className="absolute bottom-3 left-3 right-3">
					<p className="text-white text-sm font-medium">SS'26 Collection</p>
					<p className="text-[8px] text-white/70 mt-0.5">Minimalist essentials</p>
				</div>
			</div>
			<div className="px-3 pb-2">
				<div className="grid grid-cols-2 gap-2">
					{[{ name: 'Oversized Tee', price: '€49', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80' }, { name: 'Wide Pants', price: '€89', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&q=80' }].map((product, i) => (
						<div key={i} className="group">
							<div className="aspect-[3/4] rounded bg-neutral-100 bg-cover bg-center mb-1.5" style={{ backgroundImage: `url(${product.img})` }} />
							<p className="text-[8px] text-neutral-800">{product.name}</p>
							<p className="text-[8px] font-medium text-neutral-900">{product.price}</p>
						</div>
					))}
				</div>
			</div>
			<div className="flex justify-around items-center py-2.5 border-t border-neutral-100 text-[7px] text-neutral-400">
				<span className="text-neutral-900 font-medium">Shop</span><span>New</span><span>Sale</span><span>Account</span>
			</div>
		</div>
	);
}

// Template 4: Gym
function GymTemplate() {
	return (
		<div className="w-full h-full bg-[#111111] text-white overflow-hidden flex flex-col relative">
			<div className="absolute top-12 right-10 w-1.5 h-1.5 bg-red-500 rounded-full" style={{ animation: 'energy-pulse 3s ease-in-out infinite' }} />
			<div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 relative z-10">
				<div className="flex items-center gap-2">
					<div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center"><Dumbbell className="w-3 h-3 text-white" /></div>
					<span className="text-[9px] font-black tracking-wide">IRON</span>
				</div>
				<div className="px-2 py-1 bg-red-600 rounded text-[6px] font-bold">JOIN NOW</div>
			</div>
			<div className="relative flex-1 m-2 rounded-xl overflow-hidden">
				<div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80)' }} />
				<div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-transparent" />
				<div className="absolute bottom-3 left-3 right-3">
					<p className="text-[6px] text-red-500 font-bold tracking-widest mb-1 opacity-90">TRANSFORM YOUR BODY</p>
					<h2 className="text-[15px] font-black leading-tight tracking-tight">PUSH YOUR<br/>LIMITS</h2>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-1 px-2 py-2">
				{[{ value: '500+', label: 'Members' }, { value: '50+', label: 'Classes/Week' }, { value: '24/7', label: 'Access' }].map((stat, i) => (
					<div key={i} className="bg-white/5 rounded-lg p-2 text-center">
						<p className="text-[10px] font-black text-red-500">{stat.value}</p>
						<p className="text-[5px] text-white/40 uppercase tracking-wider">{stat.label}</p>
					</div>
				))}
			</div>
			<div className="px-3 pb-3">
				<div className="bg-gradient-to-r from-red-600/20 to-red-600/5 rounded-lg p-2.5 flex items-center gap-3">
					<div className="w-9 h-9 rounded-lg bg-red-600/30 flex items-center justify-center"><Zap className="w-4 h-4 text-red-500" /></div>
					<div className="flex-1"><p className="text-[8px] font-bold">HIIT Training</p><p className="text-[6px] text-white/50">Today 18:00 • 12 spots left</p></div>
					<ChevronRightIcon className="w-3.5 h-3.5 text-red-500" />
				</div>
			</div>
			<style jsx>{`@keyframes energy-pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(2); opacity: 0.2; } }`}</style>
		</div>
	);
}

// Template 5: Law Firm
function LawFirmTemplate() {
	return (
		<div className="w-full h-full bg-[#0f1419] text-white overflow-hidden flex flex-col relative">
			<div className="absolute top-12 right-8 w-1 h-1 rounded-full bg-[#c9a227] opacity-60" style={{ animation: 'pulse-slow 3s ease-in-out infinite' }} />
			<div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 relative z-10">
				<div className="flex items-center gap-2">
					<div className="w-5 h-5 border border-[#c9a227] flex items-center justify-center"><Scale className="w-2.5 h-2.5 text-[#c9a227]" /></div>
					<div><span className="text-[7px] font-medium tracking-wide">VAN DER BERG</span><span className="block text-[4px] text-[#c9a227] tracking-[0.2em]">ADVOCATEN</span></div>
				</div>
				<div className="flex gap-3 text-[5px] text-white/40 tracking-wide"><span>DIENSTEN</span><span>TEAM</span></div>
			</div>
			<div className="relative flex-1">
				<div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80)' }} />
				<div className="absolute inset-0 bg-gradient-to-t from-[#0f1419] via-[#0f1419]/70 to-transparent" />
				<div className="relative h-full flex flex-col justify-end p-4">
					<div className="flex items-center gap-2 mb-2"><div className="w-6 h-[1px] bg-[#c9a227]" /><span className="text-[5px] text-[#c9a227] tracking-[0.2em] opacity-80">SINDS 1987</span></div>
					<h1 className="text-[5px] leading-[1.8] font-medium tracking-wide"><span className="text-white/80">Uw recht,</span><br/><span className="text-[#c9a227]">onze missie</span></h1>
					<p className="mt-1.5 text-[6px] text-white/50 leading-relaxed max-w-[140px]">Gespecialiseerd in ondernemingsrecht en geschillen</p>
				</div>
			</div>
			<div className="px-4 py-2 bg-[#c9a227]/5 border-t border-[#c9a227]/10">
				<div className="flex justify-between text-center">
					{[{ v: '35+', l: 'JAAR' }, { v: '500+', l: 'ZAKEN' }, { v: '12', l: 'ADVOCATEN' }, { v: '98%', l: 'SUCCES' }].map((s, i) => (<div key={i}><p className="text-[8px] font-semibold text-[#c9a227]">{s.v}</p><p className="text-[4px] text-white/30 tracking-wide">{s.l}</p></div>))}
				</div>
			</div>
			<div className="p-4 flex items-center justify-between">
				<div className="px-3 py-1.5 bg-[#c9a227] text-[#0f1419] text-[7px] font-semibold tracking-wide">GRATIS CONSULT</div>
				<div className="flex items-center gap-1.5 text-[6px] text-white/40"><MapPin className="w-2.5 h-2.5" /><span>Amsterdam</span></div>
			</div>
			<style jsx>{`@keyframes pulse-slow { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 0.2; transform: scale(1.5); } }`}</style>
		</div>
	);
}

// Template 6: Bakery
function BakeryTemplate() {
	return (
		<div className="w-full h-full bg-[#faf6f1] overflow-hidden flex flex-col">
			<div className="bg-[#8b4513] px-4 py-3 flex items-center justify-between">
				<span className="text-[12px] font-serif italic text-[#f5deb3] tracking-wide">De Korenschuur</span>
				<div className="text-[7px] text-[#f5deb3]/70">Bestel online →</div>
			</div>
			<div className="relative h-24 m-3 rounded-xl overflow-hidden">
				<div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80)' }} />
				<div className="absolute inset-0 bg-gradient-to-r from-[#5d3a1a]/95 via-[#5d3a1a]/70 to-transparent" />
				<div className="absolute inset-0 flex flex-col justify-center px-4">
					<p className="text-[7px] text-white tracking-widest uppercase opacity-90">Vers gebakken</p>
					<h2 className="text-[14px] font-serif leading-tight mt-1" style={{ color: '#ffffff' }}>Ambachtelijk<br/>brood & gebak</h2>
					<div className="flex items-center gap-1 mt-2">{[...Array(5)].map((_, i) => (<Star key={i} className="w-2 h-2 fill-[#f5deb3] text-[#f5deb3]" />))}<span className="text-[6px] text-white ml-1">4.9 (256 reviews)</span></div>
				</div>
			</div>
			<div className="px-3 flex-1">
				<div className="flex items-center justify-between mb-2"><p className="text-[10px] font-medium text-[#5d3a1a]">Vandaag vers</p><p className="text-[8px] text-[#8b4513]">Bekijk alles</p></div>
				<div className="space-y-2">
					{[{ name: 'Zuurdesembrood', price: '€4.50', desc: 'Knapperige korst', img: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=150&q=80' }, { name: 'Croissants (4x)', price: '€6.00', desc: 'Echte roomboter', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=150&q=80' }].map((item, i) => (
						<div key={i} className="flex items-center gap-3 bg-white rounded-xl p-2.5 shadow-sm">
							<div className="w-11 h-11 rounded-lg bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${item.img})` }} />
							<div className="flex-1 min-w-0"><p className="text-[9px] font-medium text-[#5d3a1a]">{item.name}</p><p className="text-[7px] text-neutral-400">{item.desc}</p></div>
							<div className="text-right flex-shrink-0"><p className="text-[9px] font-semibold text-[#8b4513]">{item.price}</p><div className="mt-0.5 w-5 h-5 bg-[#8b4513] rounded-full flex items-center justify-center"><span className="text-white text-[10px]">+</span></div></div>
						</div>
					))}
				</div>
			</div>
			<div className="p-3">
				<div className="bg-[#8b4513] rounded-xl p-3 flex items-center justify-between">
					<div><p className="text-[9px] text-white font-medium">Bestel voor morgen</p><p className="text-[7px] text-white/60">Voor 21:00 besteld = morgen vers</p></div>
					<ArrowRight className="w-4 h-4 text-[#f5deb3]" />
				</div>
			</div>
		</div>
	);
}

// Template 7: Photography
function PhotographyTemplate() {
	return (
		<div className="w-full h-full bg-[#0a0a0a] text-white overflow-hidden flex flex-col relative">
			<div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
				<span className="text-[10px] font-light tracking-[0.2em]">DAAN BUURS</span>
				<div className="text-[7px] text-white/40 tracking-wider">PORTFOLIO</div>
			</div>
			<div className="relative flex-1 grid grid-cols-2 gap-1 p-2">
				{['https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', 'https://images.unsplash.com/photo-1543168256-418811576931?w=300&q=80'].map((img, i) => (
					<div key={i} className="aspect-square rounded-lg overflow-hidden"><div className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform" style={{ backgroundImage: `url(${img})` }} /></div>
				))}
			</div>
			<div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
				<div><p className="text-[8px] font-medium">Available for bookings</p><p className="text-[6px] text-white/40">Amsterdam & Worldwide</p></div>
				<div className="px-3 py-1.5 border border-white/30 text-[7px] font-medium">CONTACT</div>
			</div>
		</div>
	);
}

// Template 8: Fashion Designer
function FashionDesignerTemplate() {
	return (
		<div className="w-full h-full bg-[#f8f5f0] overflow-hidden flex flex-col">
			<div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
				<span className="text-[11px] font-serif italic text-neutral-800">Maison Élise</span>
				<div className="text-[7px] text-neutral-400 tracking-wide">COLLECTION</div>
			</div>
			<div className="relative flex-1 m-3 rounded-lg overflow-hidden">
				<div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80)' }} />
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
				<div className="absolute bottom-4 left-4 right-4">
					<p className="text-[7px] text-white/80 tracking-widest uppercase">Autumn/Winter 2026</p>
					<h2 className="text-[16px] font-serif text-white mt-1">La Nouvelle<br/>Silhouette</h2>
				</div>
			</div>
			<div className="px-3 pb-3 grid grid-cols-3 gap-2">
				{['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=150&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=150&q=80', 'https://images.unsplash.com/photo-1485968579169-6bc2441e0988?w=150&q=80'].map((img, i) => (
					<div key={i} className="aspect-[3/4] rounded bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
				))}
			</div>
		</div>
	);
}

// Component mapping
const templateComponents: Record<string, () => React.ReactElement> = {
	"velvet-bistro": RestaurantTemplate,
	"neon-studio": CreativeAgencyTemplate,
	"urban-apparel": FashionWebshopTemplate,
	"iron-athletics": GymTemplate,
	"vanderberg-advocaten": LawFirmTemplate,
	"artisan-bakery": BakeryTemplate,
	"daan-buurs-photography": PhotographyTemplate,
	"mode-atelier": FashionDesignerTemplate,
};

// Echte reviews van Trustpilot en Google
const reviews = [
  // Trustpilot reviews
  {
    quote: "Ik ben supertevreden over Webstability. Het contact verliep steeds snel en prettig, en ik had echt het gevoel dat er werd meegedacht. Ze hebben een mooi design én een logo voor me gemaakt waar ik echt blij mee ben.",
    author: "Thirza",
    platform: "trustpilot" as const,
  },
  {
    quote: "Ik heb mijn website laten bouwen door Webstability en ben enorm tevreden. Vanaf het eerste gesprek werd er goed geluisterd naar mijn wensen en kreeg ik deskundig advies.",
    author: "Wesley",
    platform: "trustpilot" as const,
  },
  // Google reviews
  {
    quote: "Ik had een super ervaring! Ze snappen precies wat je nodig hebt en maken je visie werkelijkheid. Mijn website ziet er fantastisch uit en werkt snel. Zeker een aanrader!",
    author: "Charlotte",
    platform: "google" as const,
  },
  {
    quote: "Snel een mooie, goed werkende en persoonlijke website ontvangen. Ben er blij mee, deze ontwikkelaar kan ik aanbevelen.",
    author: "Mirjam",
    platform: "google" as const,
  },
  {
    quote: "Had vlot een website nodig! Werd snel en professioneel geholpen, werd meegenomen in het proces. Zeer zeker een aanrader!",
    author: "Patrick",
    platform: "google" as const,
  },
  {
    quote: "Geen gedoe, geen eindeloos wachten, maar gewoon snel schakelen en duidelijk communiceren. Het eindresultaat voelt echt als míjn merk. Heel blij mee!",
    author: "Tevreden klant",
    platform: "google" as const,
  },
];

export function Testimonials() {
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate projects for infinite scroll effect (same as Hero)
  const duplicatedProjects = [...projects, ...projects];

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section ref={sectionRef} className="bg-[#f5f3ef] py-16 md:py-24 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        {/* Main headline */}
        <div className={`text-center mb-10 md:mb-14 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 
            className="text-[clamp(32px,6vw,48px)] font-bold tracking-[-0.03em] text-neutral-900 leading-[1.1] mb-4"
            style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
          >
            Je bent niet de enige die voor ons kiest
          </h2>
          <p className="text-neutral-500 text-base md:text-lg max-w-xl mx-auto">
            Ontdek waarom 50+ ondernemers hun website aan ons toevertrouwen
          </p>
        </div>

        {/* Platform pills */}
        <div className={`flex flex-wrap items-center justify-center gap-3 mb-8 md:mb-10 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '100ms' }}>
          {/* Google pill */}
          <a 
            href="https://www.google.com/search?q=Webstability+Reviews" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-semibold text-neutral-900">5.0</span>
            <span className="text-neutral-500">Google</span>
          </a>

          {/* Trustpilot pill */}
          <a 
            href="https://nl.trustpilot.com/review/webstability.nl" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow text-sm"
          >
            <Star className="w-4 h-4 fill-[#00b67a] text-[#00b67a]" />
            <span className="font-semibold text-neutral-900">4.9</span>
            <span className="text-neutral-500">Trustpilot</span>
          </a>
        </div>

        {/* Scrollable reviews */}
        <div className={`relative mb-14 md:mb-20 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '150ms' }}>
          {/* Scroll buttons */}
          <button 
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full bg-white border border-neutral-200 shadow-md flex items-center justify-center transition-all hover:shadow-lg ${
              canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-full bg-white border border-neutral-200 shadow-md flex items-center justify-center transition-all hover:shadow-lg ${
              canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-neutral-600" />
          </button>

          {/* Reviews container */}
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {reviews.map((review, index) => {
              const isGoogle = review.platform === "google";
              const starColor = isGoogle ? "#FBBC05" : "#00b67a";
              
              return (
                <div
                  key={`${review.author}-${index}`}
                  className="flex-shrink-0 w-[300px] md:w-[320px] bg-white rounded-xl p-5 border border-neutral-100 snap-start"
                >
                  {/* Stars + platform */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5"
                          style={{ fill: starColor, color: starColor }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wide">
                      {isGoogle ? "Google" : "Trustpilot"}
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="text-neutral-700 text-sm leading-relaxed mb-4 line-clamp-4">
                    {review.quote}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                    <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-medium text-neutral-600">
                      {review.author.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-neutral-900">{review.author}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Portfolio carousel - full width like Hero */}
      <div 
        className={`overflow-hidden transition-all duration-700 ease-out ${
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
              <div
                key={`${project.id}-${index}`}
                className="flex-shrink-0 w-[280px] sm:w-[320px]"
              >
                {/* Website mockup container */}
                <div className="relative rounded-xl overflow-hidden bg-neutral-100 shadow-lg">
                  {/* Browser chrome */}
                  <div className="bg-neutral-200 px-3 py-2 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                  </div>
                  
                  {/* Website content */}
                  <div className="aspect-[3/4] overflow-y-auto">
                    {TemplateComponent && <TemplateComponent />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
