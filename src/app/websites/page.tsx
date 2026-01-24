import {
  WebsiteFeatures,
  DashboardPreview,
  WhyWebstability,
  DomainChecker,
  FAQ,
  OnboardingCTA,
} from "@/components/sections";
import { Button } from "@/components/ui";
import { ArrowRight, Check, Star } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Professionele Websites | Webstability",
  description: "Professionele, snelle websites die je merk versterken. Inclusief gratis design, hosting, SSL en doorlopend onderhoud. Vanaf €65/maand.",
};

function WebsitesHero() {
  return (
    <section className="relative py-20 md:py-28 lg:py-32 bg-[#f5f3ef] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 shadow-sm mb-6">
            <Check className="w-4 h-4 text-neutral-900" />
            <span className="text-sm text-neutral-600">Design altijd gratis</span>
          </div>

          {/* Heading */}
          <h1 
            className="text-[clamp(36px,7vw,64px)] font-bold tracking-[-0.03em] leading-[1.05] text-neutral-900 mb-6"
            style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
          >
            Professionele websites
            <br />
            <span className="text-neutral-400">die converteren</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-neutral-600 leading-relaxed mb-8 max-w-xl">
            Een snelle, veilige website die perfect past bij jouw merk. 
            Inclusief hosting, SSL en doorlopend onderhoud.
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-8">
            <span 
              className="text-4xl md:text-5xl font-bold text-neutral-900"
              style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
            >
              €65
            </span>
            <span className="text-neutral-500">/maand</span>
            <span className="text-sm text-neutral-400 ml-2">+ €199 eenmalig</span>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/start">
              <Button size="lg" className="group text-base px-8 py-4">
                Start je project
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="secondary" size="lg" className="text-base px-8 py-4">
                Bekijk voorbeelden
              </Button>
            </Link>
          </div>

          {/* Social proof mini */}
          <div className="flex items-center gap-4 mt-8 pt-8 border-t border-neutral-200">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
              ))}
            </div>
            <span className="text-sm text-neutral-500">
              <span className="font-medium text-neutral-700">5.0</span> op Google · 50+ tevreden klanten
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function IncludedFeatures() {
  const features = [
    "Gratis design - pas betalen als je tevreden bent",
    "Responsive - perfect op elk apparaat",
    "SSL-certificaat inbegrepen",
    "Premium hosting in Nederland",
    "SEO-geoptimaliseerd",
    "Maandelijks onderhoud & updates",
    "Persoonlijk dashboard",
    "Direct contact met developer",
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h2 
          className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8 text-center"
          style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
        >
          Wat zit er inbegrepen?
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-3 p-4 rounded-xl bg-neutral-50">
              <div className="w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-neutral-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function WebsitesPage() {
  return (
    <>
      {/* Hero voor websites */}
      <WebsitesHero />

      {/* Wat zit erin */}
      <IncludedFeatures />

      {/* Alle features in detail */}
      <WebsiteFeatures />

      {/* Dashboard preview */}
      <DashboardPreview />

      {/* Waarom Webstability */}
      <WhyWebstability />

      {/* Domein checker */}
      <DomainChecker />

      {/* FAQ */}
      <FAQ />

      {/* CTA */}
      <OnboardingCTA />
    </>
  );
}
