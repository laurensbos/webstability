import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout";
import { Footer } from "@/components/layout";
import { Button } from "@/components/ui";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { projects } from "@/lib/projects";

// Extra afbeeldingen per project voor de galerij
const projectGalleries: Record<string, string[]> = {
	"velvet-bistro": [
		"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
		"https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
		"https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
	],
	"neon-studio": [
		"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
		"https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
		"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
	],
	"urban-apparel": [
		"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
		"https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
		"https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
	],
	"iron-athletics": [
		"https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
		"https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
		"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
	],
	"vanderberg-advocaten": [
		"https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
		"https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&q=80",
		"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
	],
	"artisan-bakery": [
		"https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=800&q=80",
		"https://images.unsplash.com/photo-1486427944344-e46a5b24f267?w=800&q=80",
		"https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
	],
};

interface PageProps {
	params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
	return projects.map((project) => ({
		id: project.id,
	}));
}

export async function generateMetadata({ params }: PageProps) {
	const { id } = await params;
	const project = projects.find((p) => p.id === id);
	
	if (!project) {
		return {
			title: "Project niet gevonden | Webstability",
		};
	}

	return {
		title: `${project.title} | Portfolio | Webstability`,
		description: project.description,
	};
}

export default async function ProjectPage({ params }: PageProps) {
	const { id } = await params;
	const project = projects.find((p) => p.id === id);

	if (!project) {
		notFound();
	}

	const gallery = projectGalleries[project.id] || [];
	
	// Vind vorige en volgende projecten
	const currentIndex = projects.findIndex((p) => p.id === id);
	const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
	const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

	return (
		<>
			<Header />
			<main className="pt-20">
				{/* Back link */}
				<section className="pt-8 bg-white">
					<div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
						<Link
							href="/portfolio"
							className="inline-flex items-center gap-2 text-sm text-neutral-500"
						>
							<ArrowLeft className="h-4 w-4" />
							Terug naar portfolio
						</Link>
					</div>
				</section>

				{/* Hero image */}
				<section className="py-8 md:py-12 bg-white">
					<div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
						<div className="relative aspect-[21/9] overflow-hidden rounded-2xl bg-neutral-100">
							<Image
								src={project.image}
								alt={project.title}
								fill
								className="object-cover"
								priority
								sizes="100vw"
							/>
						</div>
					</div>
				</section>

				{/* Project info */}
				<section className="py-10 md:py-14 bg-white">
					<div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
							{/* Main content */}
							<div className="lg:col-span-2">
								<span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wider">
									{project.category}
								</span>
								<h1 className="mt-2 text-[28px] leading-[34px] font-bold tracking-[-0.02em] text-neutral-900 md:text-[36px] md:leading-[42px]">
									{project.title}
								</h1>
								<p className="mt-5 text-neutral-600 leading-relaxed">
									{project.description}
								</p>
								<p className="mt-3 text-neutral-600 leading-relaxed">
									Voor dit project hebben we nauw samengewerkt met de klant om een website te creëren die perfect aansluit bij hun merk en doelgroep. Het resultaat is een moderne, snelle website die zowel visueel aantrekkelijk als functioneel is.
								</p>
							</div>

							{/* Sidebar */}
							<div className="space-y-6">
								{/* Services */}
								<div>
									<h3 className="text-[13px] font-medium text-neutral-500 uppercase tracking-wider mb-2">
										Services
									</h3>
									<ul className="space-y-1.5">
										{project.services.map((service) => (
											<li key={service} className="text-neutral-900">
												{service}
											</li>
										))}
									</ul>
								</div>

								{/* Year */}
								<div>
									<h3 className="text-[13px] font-medium text-neutral-500 uppercase tracking-wider mb-2">
										Jaar
									</h3>
									<p className="text-[15px] text-neutral-900">{project.year}</p>
								</div>

								{/* Website */}
								<div>
									<h3 className="text-[13px] font-medium text-neutral-500 uppercase tracking-wider mb-2">
										Website
									</h3>
									<p className="text-[15px] text-neutral-900 flex items-center gap-2">
										{project.url}
										<ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
									</p>
								</div>

								{/* CTA */}
								<div className="pt-2">
									<Link href="/start">
										<Button className="w-full">
											Vergelijkbaar project starten
										</Button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Gallery */}
				{gallery.length > 0 && (
					<section className="py-10 md:py-14 bg-neutral-50">
						<div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
							<h2 className="text-[20px] leading-[26px] font-semibold tracking-[-0.02em] text-neutral-900 md:text-[22px] md:leading-[28px] mb-6">
								Meer beelden
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								{gallery.map((image, index) => (
									<div
										key={index}
										className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-200"
									>
										<Image
											src={image}
											alt={`${project.title} - Afbeelding ${index + 1}`}
											fill
											className="object-cover"
											sizes="(max-width: 768px) 100vw, 33vw"
										/>
									</div>
								))}
							</div>
						</div>
					</section>
				)}

				{/* Navigation */}
				<section className="py-12 md:py-16 bg-white border-t border-neutral-100">
					<div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
							{prevProject ? (
								<Link
									href={`/portfolio/${prevProject.id}`}
									className="flex items-center gap-3 text-neutral-600"
								>
									<ArrowLeft className="h-5 w-5" />
									<div>
										<span className="text-sm text-neutral-400 block">Vorige</span>
										<span className="font-medium text-neutral-900">{prevProject.title}</span>
									</div>
								</Link>
							) : (
								<div />
							)}

							{nextProject ? (
								<Link
									href={`/portfolio/${nextProject.id}`}
									className="flex items-center gap-3 text-neutral-600 sm:text-right"
								>
									<div>
										<span className="text-sm text-neutral-400 block">Volgende</span>
										<span className="font-medium text-neutral-900">{nextProject.title}</span>
									</div>
									<ArrowRight className="h-5 w-5" />
								</Link>
							) : (
								<div />
							)}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
