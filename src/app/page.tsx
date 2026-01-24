import {
  Hero,
  ProductCards,
  ProcessRoadmap,
  PricingTeaser,
  MoreServices,
  WhyUs,
  Testimonials,
  FAQ,
  OnboardingCTA,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      {/* Hero sectie met kopteksten en social proof */}
      <Hero />

      {/* Waarom wij boven de rest */}
      <WhyUs />

      {/* Product cards: Websites, Webshops, Maatwerk */}
      <ProductCards />

      {/* Process Roadmap - Hoe werkt het? 4 stappen */}
      <ProcessRoadmap />

      {/* Pricing teaser met 3 website pakketten */}
      <PricingTeaser />

      {/* Meer dan websites - Dronebeelden, Logo's, Webshops */}
      <MoreServices />

      {/* Testimonials - echte reviews van klanten */}
      <Testimonials />

      {/* FAQ sectie */}
      <FAQ />

      {/* CTA om project te starten */}
      <OnboardingCTA />
    </>
  );
}
