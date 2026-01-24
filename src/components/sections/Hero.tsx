"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ArrowRight, ArrowUpRight, Menu, ShoppingBag, Star, Play, Calendar, MapPin, Clock, Users, Dumbbell, Heart, Phone, Mail, Scale, ChevronRight, Zap, Sparkles } from "lucide-react";
import { projects } from "@/lib/projects";

// Template 1: Restaurant / Fine Dining - Velvet Bistro (Bold, funky, modern)
function RestaurantTemplate() {
	return (
		<div className="w-full h-full bg-[#1a1a1a] text-white overflow-hidden flex flex-col relative">
			{/* Colorful accent blob with animation */}
			<div 
				className="absolute top-8 right-0 w-32 h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded-full blur-3xl opacity-30"
				style={{ animation: 'blob-pulse 8s ease-in-out infinite' }}
			/>
			
			{/* Floating particles */}
			<div 
				className="absolute top-16 left-8 w-1.5 h-1.5 bg-orange-400 rounded-full"
				style={{ animation: 'particle-rise 5s ease-in-out infinite' }}
			/>
			<div 
				className="absolute top-24 right-12 w-1 h-1 bg-red-400 rounded-full"
				style={{ animation: 'particle-rise 6s ease-in-out infinite 1s' }}
			/>
			<div 
				className="absolute bottom-28 left-12 w-1 h-1 bg-orange-300 rounded-full"
				style={{ animation: 'particle-rise 5.5s ease-in-out infinite 0.5s' }}
			/>
			
			{/* Header */}
			<div className="relative flex items-center justify-between px-4 py-2.5 z-10">
				<div className="flex items-center gap-2">
					<span className="text-[10px] font-black tracking-tight">VELVET<span className="text-orange-500">.</span></span>
				</div>
				<div className="flex items-center gap-3 text-[6px] text-white/40 uppercase tracking-wider">
					<span>Menu</span>
					<span>Reserveer</span>
				</div>
			</div>
			
			{/* Large hero image with overlay text */}
			<div className="flex-1 relative mx-3 rounded-2xl overflow-hidden">
				<div 
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80)' }}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-[#1a1a1a]/20" />
				
				{/* Floating badge */}
				<div className="absolute top-3 right-3 bg-orange-500 text-[5px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
					Nu geopend
				</div>
				
				{/* Bottom content */}
				<div className="absolute bottom-0 left-0 right-0 p-4">
					<p className="text-[6px] font-mono text-orange-400 mb-1 opacity-80">// FINE DINING AMSTERDAM</p>
					<h2 className="text-[16px] font-black leading-[0.95] tracking-tight">
						<span className="text-white">TASTE</span><br/>
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">THE FIRE</span>
					</h2>
				</div>
			</div>
			
			{/* Bottom bar with info */}
			<div className="relative flex justify-between items-center px-4 py-2.5 z-10">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-1">
						{[...Array(5)].map((_, i) => (
							<Star key={i} className="w-2 h-2 fill-orange-500 text-orange-500" />
						))}
					</div>
					<span className="text-[6px] text-white/40">4.9 • 324 reviews</span>
				</div>
				<div className="px-2.5 py-1.5 bg-orange-500 text-[6px] font-bold rounded-full">
					BOOK TABLE
				</div>
			</div>
			
			<style jsx>{`
				@keyframes blob-pulse {
					0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.3; }
					50% { transform: scale(1.2) translate(-10px, 10px); opacity: 0.2; }
				}
				@keyframes particle-rise {
					0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
					50% { transform: translateY(-30px) scale(0.5); opacity: 0.2; }
				}
			`}</style>
		</div>
	);
}

// Template 2: Coffee Company - BRŪT Coffee (Bold, kinetic, modern)
function CreativeAgencyTemplate() {
	return (
		<div className="w-full h-full bg-[#0a0a0a] text-white overflow-hidden flex flex-col relative">
			{/* Floating particles with varied animations */}
			<div 
				className="absolute top-12 left-6 w-1.5 h-1.5 bg-[#D4AF37] rounded-full"
				style={{ animation: 'particle-float 4s ease-in-out infinite' }}
			/>
			<div 
				className="absolute top-20 left-12 w-2 h-2 bg-[#8B5A2B] rounded-full"
				style={{ animation: 'particle-float 5s ease-in-out infinite 1s' }}
			/>
			<div 
				className="absolute bottom-32 left-8 w-1.5 h-1.5 bg-[#D4AF37] rounded-full"
				style={{ animation: 'particle-float 4.5s ease-in-out infinite 0.5s' }}
			/>
			<div 
				className="absolute top-[35%] left-[20%] w-1 h-1 bg-[#8B5A2B] rounded-full"
				style={{ animation: 'particle-float 3.5s ease-in-out infinite 1.5s' }}
			/>
			
			{/* Floating line accent */}
			<div 
				className="absolute top-[55%] left-6 w-10 h-[2px] bg-[#8B5A2B]"
				style={{ animation: 'line-slide 8s ease-in-out infinite', opacity: 0.3 }}
			/>
			
			{/* Header */}
			<div className="relative flex items-center justify-between px-4 py-2.5 border-b border-white/5 z-10">
				<span className="text-[11px] font-black tracking-tighter">BRŪT<span className="text-[#D4AF37]">.</span></span>
				<div className="flex gap-3 text-[6px] font-bold tracking-wider text-white/40">
					<span>SHOP</span>
					<span>ABOUT</span>
				</div>
			</div>
			
			{/* Main content */}
			<div className="relative flex-1 flex flex-col justify-center px-4 z-10">
				<p className="text-[6px] font-mono text-[#D4AF37] mb-1.5 tracking-widest opacity-80">// SPECIALTY COFFEE</p>
				<h1 className="text-[26px] font-black leading-[0.85] tracking-tighter">
					<span 
						className="text-[#8B5A2B] inline-block"
						style={{ animation: 'slide-in-left 0.8s ease-out forwards' }}
					>
						BROWN
					</span><br/>
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8960C]">
						GOLD
					</span>
				</h1>
				<p className="mt-3 text-[7px] text-white/50 max-w-[140px] leading-relaxed font-light">
					Direct trade koffiebonen van de beste plantages. Gebrand in Amsterdam.
				</p>
			</div>
			
			{/* Large coffee cup image section */}
			<div className="relative mx-4 mb-3 h-20 rounded-xl overflow-hidden">
				<div 
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80)' }}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
			</div>
			
			{/* CTA */}
			<div className="relative px-4 pb-3 z-10">
				<div className="flex gap-2">
					<div className="flex-1 py-2 bg-[#D4AF37] text-[8px] font-black text-center text-black">
						BESTEL NU
					</div>
					<div className="px-4 py-2 border-2 border-[#D4AF37] text-[8px] font-black text-[#D4AF37]">
						→
					</div>
				</div>
			</div>
			
			<style jsx>{`
				@keyframes slide-in-left {
					0% { opacity: 0; transform: translateX(-30px); }
					100% { opacity: 1; transform: translateX(0); }
				}
				@keyframes particle-float {
					0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
					50% { transform: translateY(-20px) scale(1.3); opacity: 0.3; }
				}
				@keyframes line-slide {
					0%, 100% { transform: translateX(0); opacity: 0.3; }
					50% { transform: translateX(15px); opacity: 0.1; }
				}
			`}</style>
		</div>
	);
}
// Template 3: Fashion Webshop - Urban Apparel (Minimal, high-end fashion)
function FashionWebshopTemplate() {
	return (
		<div className="w-full h-full bg-white overflow-hidden flex flex-col">
			{/* Clean header */}
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
			
			{/* Hero product */}
			<div className="relative flex-1 mx-3 my-2 rounded-lg overflow-hidden">
				<div 
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80)' }}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
				<div className="absolute top-3 left-3">
					<span className="px-2 py-0.5 bg-black text-[7px] text-white font-medium">NEW IN</span>
				</div>
				<div className="absolute bottom-3 left-3 right-3">
					<p className="text-white text-sm font-medium">SS'26 Collection</p>
					<p className="text-[8px] text-white/70 mt-0.5">Minimalist essentials</p>
				</div>
			</div>
			
			{/* Product grid */}
			<div className="px-3 pb-2">
				<div className="grid grid-cols-2 gap-2">
					{[
						{ name: 'Oversized Tee', price: '€49', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80' },
						{ name: 'Wide Pants', price: '€89', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&q=80' },
					].map((product, i) => (
						<div key={i} className="group">
							<div 
								className="aspect-[3/4] rounded bg-neutral-100 bg-cover bg-center mb-1.5"
								style={{ backgroundImage: `url(${product.img})` }}
							/>
							<p className="text-[8px] text-neutral-800">{product.name}</p>
							<p className="text-[8px] font-medium text-neutral-900">{product.price}</p>
						</div>
					))}
				</div>
			</div>
			
			{/* Bottom nav */}
			<div className="flex justify-around items-center py-2.5 border-t border-neutral-100 text-[7px] text-neutral-400">
				<span className="text-neutral-900 font-medium">Shop</span>
				<span>New</span>
				<span>Sale</span>
				<span>Account</span>
			</div>
		</div>
	);
}

// Template 4: Sportschool - Iron Athletics (Dark, powerful, energetic)
function GymTemplate() {
	return (
		<div className="w-full h-full bg-[#111111] text-white overflow-hidden flex flex-col relative">
			{/* Floating energy particles */}
			<div 
				className="absolute top-12 right-10 w-1.5 h-1.5 bg-red-500 rounded-full"
				style={{ animation: 'energy-pulse 3s ease-in-out infinite' }}
			/>
			<div 
				className="absolute top-20 right-6 w-1 h-1 bg-red-400 rounded-full"
				style={{ animation: 'energy-pulse 3.5s ease-in-out infinite 0.5s' }}
			/>
			<div 
				className="absolute bottom-32 left-8 w-1.5 h-1.5 bg-red-500 rounded-full"
				style={{ animation: 'energy-pulse 4s ease-in-out infinite 1s' }}
			/>
			<div 
				className="absolute top-[40%] left-12 w-1 h-1 bg-red-400 rounded-full"
				style={{ animation: 'energy-pulse 3.2s ease-in-out infinite 0.8s' }}
			/>
			
			{/* Animated accent line */}
			<div 
				className="absolute top-16 left-4 w-12 h-[2px] bg-red-600"
				style={{ animation: 'pulse-width 6s ease-in-out infinite', opacity: 0.4 }}
			/>
			
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 relative z-10">
				<div className="flex items-center gap-2">
					<div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center">
						<Dumbbell className="w-3 h-3 text-white" />
					</div>
					<span className="text-[9px] font-black tracking-wide">IRON</span>
				</div>
				<div className="px-2 py-1 bg-red-600 rounded text-[6px] font-bold">
					JOIN NOW
				</div>
			</div>
			
			{/* Hero */}
			<div className="relative flex-1 m-2 rounded-xl overflow-hidden">
				<div 
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80)' }}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-transparent" />
				<div className="absolute bottom-3 left-3 right-3">
					<p className="text-[6px] text-red-500 font-bold tracking-widest mb-1 opacity-90">TRANSFORM YOUR BODY</p>
					<h2 className="text-[15px] font-black leading-tight tracking-tight">PUSH YOUR<br/>LIMITS</h2>
				</div>
			</div>
			
			{/* Stats row */}
			<div className="grid grid-cols-3 gap-1 px-2 py-2">
				{[
					{ value: '500+', label: 'Members' },
					{ value: '50+', label: 'Classes/Week' },
					{ value: '24/7', label: 'Access' },
				].map((stat, i) => (
					<div key={i} className="bg-white/5 rounded-lg p-2 text-center">
						<p className="text-[10px] font-black text-red-500">{stat.value}</p>
						<p className="text-[5px] text-white/40 uppercase tracking-wider">{stat.label}</p>
					</div>
				))}
			</div>
			
			{/* Class preview */}
			<div className="px-3 pb-3">
				<div className="bg-gradient-to-r from-red-600/20 to-red-600/5 rounded-lg p-2.5 flex items-center gap-3">
					<div className="w-9 h-9 rounded-lg bg-red-600/30 flex items-center justify-center">
						<Zap className="w-4 h-4 text-red-500" />
					</div>
					<div className="flex-1">
						<p className="text-[8px] font-bold">HIIT Training</p>
						<p className="text-[6px] text-white/50">Today 18:00 • 12 spots left</p>
					</div>
					<ChevronRight className="w-3.5 h-3.5 text-red-500" />
				</div>
			</div>
			
			<style jsx>{`
				@keyframes energy-pulse {
					0%, 100% { transform: scale(1) translateY(0); opacity: 0.8; }
					50% { transform: scale(2) translateY(-10px); opacity: 0.2; }
				}
				@keyframes pulse-width {
					0%, 100% { transform: scaleX(1); opacity: 0.4; }
					50% { transform: scaleX(1.5); opacity: 0.2; }
				}
			`}</style>
		</div>
	);
}

// Template 5: Advocatenkantoor - Van der Berg (Premium, sophisticated law firm)
function LawFirmTemplate() {
	return (
		<div className="w-full h-full bg-[#0f1419] text-white overflow-hidden flex flex-col relative">
			{/* Floating animated elements */}
			<div 
				className="absolute top-12 right-8 w-1 h-1 rounded-full bg-[#c9a227] opacity-60"
				style={{ animation: 'pulse-slow 3s ease-in-out infinite' }}
			/>
			<div 
				className="absolute top-20 left-12 w-1.5 h-1.5 rounded-full bg-[#c9a227] opacity-40"
				style={{ animation: 'pulse-slow 4s ease-in-out infinite 1s' }}
			/>
			<div 
				className="absolute bottom-24 right-6 w-1 h-1 rounded-full bg-[#c9a227] opacity-50"
				style={{ animation: 'pulse-slow 3.5s ease-in-out infinite 0.5s' }}
			/>
			
			{/* Floating line accents */}
			<div 
				className="absolute top-16 left-6 w-6 h-[1px] bg-[#c9a227] opacity-30"
				style={{ animation: 'float-line 6s ease-in-out infinite' }}
			/>
			<div 
				className="absolute bottom-32 right-8 w-8 h-[1px] bg-[#c9a227] opacity-20"
				style={{ animation: 'float-line 7s ease-in-out infinite 1.5s' }}
			/>
			
			{/* Premium header */}
			<div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 relative z-10">
				<div className="flex items-center gap-2">
					<div className="w-5 h-5 border border-[#c9a227] flex items-center justify-center">
						<Scale className="w-2.5 h-2.5 text-[#c9a227]" />
					</div>
					<div>
						<span className="text-[7px] font-medium tracking-wide">VAN DER BERG</span>
						<span className="block text-[4px] text-[#c9a227] tracking-[0.2em]">ADVOCATEN</span>
					</div>
				</div>
				<div className="flex gap-3 text-[5px] text-white/40 tracking-wide">
					<span>DIENSTEN</span>
					<span>TEAM</span>
				</div>
			</div>
			
			{/* Hero with courthouse/legal image */}
			<div className="relative flex-1">
				<div 
					className="absolute inset-0 bg-cover bg-center opacity-50"
					style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80)' }}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-[#0f1419] via-[#0f1419]/70 to-transparent" />
				
				{/* Floating abstract shapes */}
				<div 
					className="absolute top-1/4 right-6 w-16 h-16 border border-[#c9a227]/20 rounded-lg"
					style={{ animation: 'float-shape 8s ease-in-out infinite', transform: 'rotate(12deg)' }}
				/>
				
				<div className="relative h-full flex flex-col justify-end p-4">
					<div className="flex items-center gap-2 mb-2">
						<div className="w-6 h-[1px] bg-[#c9a227]" />
						<span className="text-[5px] text-[#c9a227] tracking-[0.2em] opacity-80">SINDS 1987</span>
					</div>
					<h1 className="text-[5px] leading-[1.8] font-medium tracking-wide">
						<span className="text-white/80">Uw recht,</span><br/>
						<span className="text-[#c9a227]">onze missie</span>
					</h1>
					<p className="mt-1.5 text-[6px] text-white/50 leading-relaxed max-w-[140px]">
						Gespecialiseerd in ondernemingsrecht en geschillen
					</p>
				</div>
			</div>
			
			{/* Stats bar */}
			<div className="px-4 py-2 bg-[#c9a227]/5 border-t border-[#c9a227]/10">
				<div className="flex justify-between text-center">
					<div>
						<p className="text-[8px] font-semibold text-[#c9a227]">35+</p>
						<p className="text-[4px] text-white/30 tracking-wide">JAAR</p>
					</div>
					<div>
						<p className="text-[8px] font-semibold text-[#c9a227]">500+</p>
						<p className="text-[4px] text-white/30 tracking-wide">ZAKEN</p>
					</div>
					<div>
						<p className="text-[8px] font-semibold text-[#c9a227]">12</p>
						<p className="text-[4px] text-white/30 tracking-wide">ADVOCATEN</p>
					</div>
					<div>
						<p className="text-[8px] font-semibold text-[#c9a227]">98%</p>
						<p className="text-[4px] text-white/30 tracking-wide">SUCCES</p>
					</div>
				</div>
			</div>
			
			<style jsx>{`
				@keyframes pulse-slow {
					0%, 100% { opacity: 0.6; transform: scale(1); }
					50% { opacity: 0.2; transform: scale(1.5); }
				}
				@keyframes float-line {
					0%, 100% { transform: translateX(0) translateY(0); opacity: 0.3; }
					50% { transform: translateX(10px) translateY(-5px); opacity: 0.1; }
				}
				@keyframes float-shape {
					0%, 100% { transform: translateY(0) rotate(12deg); opacity: 0.2; }
					50% { transform: translateY(-15px) rotate(18deg); opacity: 0.1; }
				}
			`}</style>
			
			{/* CTA section */}
			<div className="p-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="px-3 py-1.5 bg-[#c9a227] text-[#0f1419] text-[7px] font-semibold tracking-wide">
						GRATIS CONSULT
					</div>
				</div>
				<div className="flex items-center gap-1.5 text-[6px] text-white/40">
					<MapPin className="w-2.5 h-2.5" />
					<span>Amsterdam</span>
				</div>
			</div>
		</div>
	);
}

// Template 6: Bakkerij - Artisan Bakery (Warm, artisanal, inviting)
function BakeryTemplate() {
	return (
		<div className="w-full h-full bg-[#faf6f1] overflow-hidden flex flex-col">
			{/* Warm header */}
			<div className="bg-[#8b4513] px-4 py-3 flex items-center justify-between">
				<span className="text-[12px] font-serif italic text-[#f5deb3] tracking-wide">De Korenschuur</span>
				<div className="text-[7px] text-[#f5deb3]/70">Bestel online →</div>
			</div>
			
			{/* Hero banner */}
			<div className="relative h-24 m-3 rounded-xl overflow-hidden">
				<div 
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80)' }}
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-[#5d3a1a]/95 via-[#5d3a1a]/70 to-transparent" />
				<div className="absolute inset-0 flex flex-col justify-center px-4">
					<p className="text-[7px] text-white tracking-widest uppercase opacity-90">Vers gebakken</p>
					<h2 className="text-[14px] font-serif leading-tight mt-1" style={{ color: '#ffffff' }}>
						Ambachtelijk<br/>brood & gebak
					</h2>
					<div className="flex items-center gap-1 mt-2">
						{[...Array(5)].map((_, i) => (
							<Star key={i} className="w-2 h-2 fill-[#f5deb3] text-[#f5deb3]" />
						))}
						<span className="text-[6px] text-white ml-1">4.9 (256 reviews)</span>
					</div>
				</div>
			</div>
			
			{/* Today's fresh */}
			<div className="px-3 flex-1">
				<div className="flex items-center justify-between mb-2">
					<p className="text-[10px] font-medium text-[#5d3a1a]">Vandaag vers</p>
					<p className="text-[8px] text-[#8b4513]">Bekijk alles</p>
				</div>
				<div className="space-y-2">
					{[
						{ name: 'Zuurdesembrood', price: '€4.50', desc: 'Knapperige korst', img: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=150&q=80' },
						{ name: 'Croissants (4x)', price: '€6.00', desc: 'Echte roomboter', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=150&q=80' },
					].map((item, i) => (
						<div key={i} className="flex items-center gap-3 bg-white rounded-xl p-2.5 shadow-sm">
							<div 
								className="w-11 h-11 rounded-lg bg-cover bg-center flex-shrink-0"
								style={{ backgroundImage: `url(${item.img})` }}
							/>
							<div className="flex-1 min-w-0">
								<p className="text-[9px] font-medium text-[#5d3a1a]">{item.name}</p>
								<p className="text-[7px] text-neutral-400">{item.desc}</p>
							</div>
							<div className="text-right flex-shrink-0">
								<p className="text-[9px] font-semibold text-[#8b4513]">{item.price}</p>
								<div className="mt-0.5 w-5 h-5 bg-[#8b4513] rounded-full flex items-center justify-center">
									<span className="text-white text-[10px]">+</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			
			{/* Order CTA */}
			<div className="p-3">
				<div className="bg-[#8b4513] rounded-xl p-3 flex items-center justify-between">
					<div>
						<p className="text-[9px] text-white font-medium">Bestel voor morgen</p>
						<p className="text-[7px] text-white/60">Voor 21:00 besteld = morgen vers</p>
					</div>
					<ArrowRight className="w-4 h-4 text-[#f5deb3]" />
				</div>
			</div>
		</div>
	);
}

// Template 7: Fotograaf Portfolio - Daan Buurs (Minimalist, bold typography)
function PhotographyTemplate() {
	return (
		<div className="w-full h-full bg-white text-black overflow-hidden flex flex-col relative">
			{/* Floating minimal elements */}
			<div 
				className="absolute top-[20%] right-[15%] w-1 h-1 bg-black rounded-full opacity-40"
				style={{ animation: 'dot-float 4s ease-in-out infinite' }}
			/>
			<div 
				className="absolute bottom-[35%] left-[12%] w-1 h-1 bg-black rounded-full opacity-30"
				style={{ animation: 'dot-float 5s ease-in-out infinite 1s' }}
			/>
			
			{/* Thin animated line */}
			<div 
				className="absolute top-[45%] left-0 right-0 h-[0.5px] bg-black opacity-10"
				style={{ animation: 'line-pulse 8s ease-in-out infinite' }}
			/>
			
			{/* Header with date */}
			<div className="flex items-start justify-between px-4 py-3 relative z-10">
				<h1 className="text-[11px] font-black tracking-tighter leading-none">
					DAAN<br/>BUURS
				</h1>
				<div className="text-right text-[6px] tracking-wider leading-tight opacity-60">
					20<br/>19<br/>-2<br/>02<br/>5
				</div>
			</div>
			
			{/* Image grid */}
			<div className="flex-1 px-3 pb-3 grid grid-cols-4 gap-1 relative z-10">
				<div 
					className="col-span-1 bg-cover bg-center"
					style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&q=80)' }}
				/>
				<div 
					className="col-span-1 bg-cover bg-center"
					style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80)' }}
				/>
				<div 
					className="col-span-1 bg-cover bg-center"
					style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80)' }}
				/>
				<div 
					className="col-span-1 bg-cover bg-center"
					style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80)' }}
				/>
			</div>
			
			{/* Bottom info */}
			<div className="flex justify-between items-center px-4 py-2.5 border-t border-black/10 relative z-10">
				<p className="text-[9px] font-bold tracking-tight">Daan Buurs</p>
				<p className="text-[9px] tracking-wide opacity-60">001</p>
			</div>
			
			<style jsx>{`
				@keyframes dot-float {
					0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
					50% { transform: translateY(-15px) scale(1.5); opacity: 0.15; }
				}
				@keyframes line-pulse {
					0%, 100% { opacity: 0.1; }
					50% { opacity: 0.05; }
				}
			`}</style>
		</div>
	);
}

// Template 8: Fashion Designer - Mode Atelier (Minimal, editorial, sophisticated)
function FashionDesignerTemplate() {
	return (
		<div className="w-full h-full bg-[#f8f6f3] overflow-hidden flex flex-col relative">
			{/* Header */}
			<div className="px-4 py-3 relative z-10">
				<div className="flex items-center justify-between">
					<span 
						className="text-[9px] font-medium tracking-[0.15em] text-[#1a1a1a]"
						style={{ fontFamily: 'system-ui, sans-serif' }}
					>
						MODE ATELIER
					</span>
					<div className="flex gap-4 text-[6px] text-neutral-400 tracking-wider">
						<span>COLLECTIES</span>
						<span>ATELIER</span>
					</div>
				</div>
			</div>
			
			{/* Main content - asymmetric layout */}
			<div className="flex-1 grid grid-cols-12 gap-2 px-3 pb-3">
				{/* Left - Large image */}
				<div className="col-span-7 relative rounded-sm overflow-hidden">
					<div 
						className="absolute inset-0 bg-cover bg-center"
						style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80)' }}
					/>
					{/* Overlay tag */}
					<div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm">
						<span className="text-[5px] font-medium tracking-wider text-neutral-800">LENTE/ZOMER '26</span>
					</div>
				</div>
				
				{/* Right column */}
				<div className="col-span-5 flex flex-col gap-2">
					{/* Small image top */}
					<div className="flex-1 relative rounded-sm overflow-hidden bg-neutral-200">
						<div 
							className="absolute inset-0 bg-cover bg-center"
							style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80)' }}
						/>
					</div>
					
					{/* Quote section */}
					<div className="bg-[#1a1a1a] rounded-sm p-3 flex-1 flex flex-col justify-center">
						<p 
							className="text-[6px] leading-[1.7] text-[#d4af37] italic"
							style={{ fontFamily: 'Georgia, serif' }}
						>
							"Mode gaat niet over kleding. Het gaat over wie je wilt zijn."
						</p>
						<div className="mt-2 flex items-center gap-2">
							<div className="w-4 h-[1px] bg-[#d4af37]/50"></div>
							<span className="text-[4px] text-white/40 tracking-widest">ADORA KLEIN</span>
						</div>
					</div>
				</div>
			</div>
			
			{/* Bottom bar */}
			<div className="px-4 py-2 border-t border-neutral-200 bg-white/50">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<span className="text-[5px] text-neutral-400">AMSTERDAM</span>
						<span className="text-[5px] text-neutral-300">•</span>
						<span className="text-[5px] text-neutral-400">PARIS</span>
						<span className="text-[5px] text-neutral-300">•</span>
						<span className="text-[5px] text-neutral-400">MILAN</span>
					</div>
					<div className="text-[6px] text-[#1a1a1a] font-medium tracking-wider flex items-center gap-1">
						BEKIJK COLLECTIE
						<ChevronRight className="w-2 h-2" />
					</div>
				</div>
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

export function Hero() {
	const [isPaused, setIsPaused] = useState(false);
	const duplicatedProjects = [...projects, ...projects];

  return (
    <section className="relative w-full bg-[#f5f3ef]">
      {/* Content */}
      <div className="relative flex flex-col items-center px-4 pt-32 md:pt-40 md:px-6 lg:px-8 z-10">
        {/* Main headline - extra large with animated gradient */}
        <h1 
          className="text-center opacity-0"
          style={{ 
            animation: 'hero-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) 200ms forwards',
            padding: '0.2em 0',
          }}
        >
          <span
            className="block text-[clamp(48px,12vw,120px)] font-bold tracking-[-0.03em]"
            style={{
              fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif',
              background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 25%, #fb7185 50%, #f97316 75%, #c084fc 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
              lineHeight: 0.95,
              paddingBottom: '0.08em',
              animation: 'gradient-shift 8s ease-in-out infinite',
            }}
          >
            De complete website
          </span>
          <span 
            className="block text-[clamp(48px,12vw,120px)] font-bold tracking-[-0.03em]"
            style={{ 
              fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif',
              background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 25%, #fb7185 50%, #f97316 75%, #c084fc 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
              lineHeight: 0.95,
              paddingBottom: '0.5em',
              animation: 'gradient-shift 8s ease-in-out infinite 0.5s',
            }}
          >
            oplossing voor ondernemers
          </span>
        </h1>

        {/* CTA buttons */}
        <div 
          className="mt-0 flex flex-col items-center gap-4 sm:flex-row sm:gap-3 opacity-0"
          style={{ animation: 'hero-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) 750ms forwards' }}
        >
          <Link href="/start">
            <Button 
              size="md" 
              className="text-[16px] px-5 py-2.5"
            >
              Start je project
            </Button>
          </Link>
          <Link href="/portfolio">
            <Button
              variant="ghost"
              size="md"
              className="text-[16px] px-5 py-2.5"
            >
              Bekijk ons werk
            </Button>
          </Link>
        </div>
      </div>

      {/* Template Showcase Carousel with enhanced entrance */}
      <div 
        className="mt-10 md:mt-14 pb-16 md:pb-24 opacity-0 overflow-hidden"
        style={{ animation: 'carousel-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1s forwards' }}
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
