"use client";

import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";
import { ArrowRight, BookOpen, Lightbulb, TrendingUp } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const articles = [
  {
    title: "5 tips voor een snellere website",
    description:
      "Ontdek hoe je de laadtijd van je website drastisch kunt verbeteren met deze praktische tips.",
    category: "Performance",
    href: "/kennisbank/snellere-website",
    icon: TrendingUp,
  },
  {
    title: "SEO basics voor beginners",
    description:
      "Een complete introductie tot zoekmachineoptimalisatie. Leer hoe je hoger scoort in Google.",
    category: "SEO",
    href: "/kennisbank/seo-basics",
    icon: Lightbulb,
  },
  {
    title: "Waarom een webshop op abonnement?",
    description:
      "De voordelen van een webshop op abonnementsbasis vergeleken met een eenmalige investering.",
    category: "E-commerce",
    href: "/kennisbank/webshop-abonnement",
    icon: BookOpen,
  },
];

export function ResourcesTeaser() {
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={sectionRef} className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Section header */}
        <div className={`flex flex-col items-start justify-between gap-4 md:flex-row md:items-end transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div>
            <h2 
              className="text-[32px] leading-[36px] font-bold tracking-[-0.02em] text-[rgb(43,44,44)] md:text-[44px] md:leading-[50px] lg:text-[52px] lg:leading-[58px]"
              style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
            >
              Tips & Artikelen
            </h2>
            <p className="mt-4 max-w-lg text-[17px] leading-[26px] text-neutral-600">
              Praktische kennis voor ondernemers. Van SEO tot performance, wij
              delen onze expertise.
            </p>
          </div>
          <Link
            href="/kennisbank"
            className="inline-flex items-center gap-2 text-[15px] font-medium tracking-[-0.01em] text-neutral-700 transition-colors hover:text-neutral-900"
            style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
          >
            Alle artikelen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Articles grid */}
        <div className={`mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '200ms' }}>
          {articles.map((article) => {
            const Icon = article.icon;
            return (
              <Link key={article.title} href={article.href}>
                <Card className="h-full">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="outline">{article.category}</Badge>
                  </div>
                  <h3 
                    className="mt-4 text-[18px] leading-[22px] font-semibold tracking-[-0.01em] text-[rgb(43,44,44)]"
                    style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                  >
                    {article.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[22px] text-neutral-600">
                    {article.description}
                  </p>
                  <div 
                    className="mt-4 inline-flex items-center gap-1 text-[14px] font-medium tracking-[-0.01em] text-neutral-900"
                    style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                  >
                    Lees meer
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
