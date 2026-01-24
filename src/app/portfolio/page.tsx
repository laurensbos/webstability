import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout";
import { Footer } from "@/components/layout";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/lib/projects";

export const metadata = {
	title: "Portfolio | Webstability",
	description: "Bekijk ons portfolio met recente projecten. Van restaurants tot webshops, elk project op maat gemaakt.",
};

export default function PortfolioPage() {
	return (
		<>
			<Header />
			<main className="pt-20">
				{/* Hero */}
				<section className="py-12 md:py-16 bg-white">
					<div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
						<Link
							href="/"
							className="inline-flex items-center gap-2 text-sm text-neutral-500 mb-6"
						>
							<ArrowLeft className="h-4 w-4" />
							Terug naar home
						</Link>
						
						<h1 className="text-[32px] leading-[38px] font-bold tracking-[-0.02em] text-neutral-900 md:text-[40px] md:leading-[46px]">
							Ons werk
						</h1>
						<p className="mt-3 text-neutral-500 max-w-xl">
							Een selectie van projecten waar we trots op zijn. Elk ontwerp op maat gemaakt.
						</p>
					</div>
				</section>

				{/* Projects grid */}
				<section className="pb-20 bg-white">
					<div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{projects.map((project) => (
								<Link
									key={project.id}
									href={`/portfolio/${project.id}`}
									className="group block"
								>
									{/* Image */}
									<div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100 mb-3">
										<Image
											src={project.image}
											alt={project.title}
											fill
											className="object-cover"
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										/>
									</div>
									
									{/* Info */}
									<div>
										<h2 className="text-[15px] font-semibold text-neutral-900 leading-tight">
											{project.title}
										</h2>
										<p className="text-[13px] text-neutral-500 mt-0.5">
											{project.category}
										</p>
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
