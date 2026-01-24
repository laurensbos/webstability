"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { 
  ArrowRight, 
  Camera,
  Pen,
  Store,
  CheckCircle
} from "lucide-react";

const services = [
  {
    id: "dronebeelden",
    title: "Dronebeelden",
    subtitle: "Luchtopnames die indruk maken",
    description: "Professionele drone videografie en fotografie voor vastgoed, events en bedrijfspresentaties. 4K kwaliteit.",
    features: ["4K video", "Gecertificeerde piloten", "Editing inbegrepen", "Snelle levering"],
    icon: Camera,
    cta: "Bekijk portfolio",
    href: "/diensten/dronebeelden",
  },
  {
    id: "logo-design",
    title: "Logo ontwerp",
    subtitle: "Merkidentiteit die blijft hangen",
    description: "Van concept tot compleet brand identity pakket. Logo's die jouw merk perfect vertegenwoordigen.",
    features: ["3 concepten", "Onbeperkte revisies", "Alle bestandsformaten", "Brand guidelines"],
    icon: Pen,
    cta: "Start je branding",
    href: "/diensten/logo-ontwerp",
  },
  {
    id: "webshops-extended",
    title: "Webshops",
    subtitle: "E-commerce die converteert",
    description: "Complete webshop oplossingen met Mollie betalingen, voorraadbeheer en marketing integraties.",
    features: ["Mollie & iDEAL", "Voorraadbeheer", "Marketing tools", "Klantaccounts"],
    icon: Store,
    cta: "Bekijk pakketten",
    href: "/webshops",
  },
];

export function MoreServices() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current);
    }

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cardRefs.current.indexOf(entry.target as HTMLDivElement);
          if (entry.isIntersecting && index !== -1) {
            setVisibleCards((prev) => {
              if (!prev.includes(index)) {
                return [...prev, index].sort((a, b) => a - b);
              }
              return prev;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) cardObserver.observe(ref);
    });

    return () => {
      sectionObserver.disconnect();
      cardObserver.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
          sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2
            className="text-[clamp(32px,6vw,56px)] font-bold tracking-[-0.03em] leading-[1.1] text-neutral-900"
            style={{
              fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif',
            }}
          >
            Meer dan alleen websites
          </h2>
          <p className="mt-4 text-neutral-500 text-base md:text-lg max-w-lg mx-auto">
            Van branding tot content creatie. Alles voor jouw digitale succes onder één dak.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const isVisible = visibleCards.includes(index);
            const Icon = service.icon;

            return (
              <div
                key={service.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="group relative bg-[#f5f3ef] rounded-3xl overflow-hidden flex flex-col"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible 
                    ? 'translateY(0)' 
                    : 'translateY(40px)',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Illustration placeholder - voeg hier je eigen afbeelding toe */}
                <div className="relative h-48 md:h-56 bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center">
                  {/* Placeholder voor je eigen illustratie */}
                  <div className="text-neutral-300 text-sm">Illustratie hier</div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  {/* Icon + Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-neutral-700" />
                    </div>
                    <div>
                      <h3 
                        className="text-xl font-bold text-neutral-900 tracking-tight"
                        style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                      >
                        {service.title}
                      </h3>
                      <p className="text-xs text-neutral-500">{service.subtitle}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.features.map((feature) => (
                      <span 
                        key={feature}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white text-neutral-600 border border-neutral-200"
                      >
                        <CheckCircle className="w-3 h-3 text-neutral-400" />
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Spacer to push button to bottom */}
                  <div className="flex-1" />

                  {/* CTA - fixed at bottom */}
                  <Link href={service.href} className="block">
                    <Button className="w-full">
                      {service.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Package Deal CTA */}
        <div 
          className={`mt-16 md:mt-20 transition-all duration-700 delay-300 ${
            visibleCards.length >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative bg-neutral-900 rounded-3xl p-8 md:p-12 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-4">
                  <span className="text-sm font-medium text-white">🎁 Pakketkorting</span>
                </div>
                <h3 
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3"
                  style={{ 
                    fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif',
                    color: 'white'
                  }}
                >
                  Combineer diensten & bespaar tot 30%
                </h3>
                <p className="text-neutral-300 text-base md:text-lg max-w-xl">
                  Neem een website of webshop abonnement en ontvang korting op aanvullende diensten zoals logo-ontwerp, SEO of extra onderhoud.
                </p>
              </div>

              {/* Savings examples + CTA */}
              <div className="flex flex-col items-center lg:items-end gap-4">
                <div className="flex flex-wrap justify-center lg:justify-end gap-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                    <p className="text-xs text-neutral-400 mb-1">Website + Logo</p>
                    <p className="text-white font-bold">20% korting</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                    <p className="text-xs text-neutral-400 mb-1">Webshop + SEO</p>
                    <p className="text-white font-bold">25% korting</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                    <p className="text-xs text-neutral-400 mb-1">Compleet pakket</p>
                    <p className="text-white font-bold">30% korting</p>
                  </div>
                </div>
                <Link href="/contact">
                  <Button 
                    size="lg" 
                    className="bg-white text-neutral-900 hover:bg-neutral-100 text-base px-8 py-4"
                  >
                    Vraag je pakketkorting aan
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
