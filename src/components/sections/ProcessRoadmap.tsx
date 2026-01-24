"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ArrowRight, Check } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Start je project",
    subtitle: "Van concept tot pixel",
    description: "Doorloop onze slimme wizard en krijg direct toegang tot je persoonlijke klantportaal.",
  },
  {
    number: "02",
    title: "Design binnen 5 dagen",
    subtitle: "Jouw visie, onze expertise",
    description: "Je ontvangt een volledig uitgewerkt ontwerp. Niet tevreden? We passen aan tot het perfect is.",
    highlight: "Design altijd gratis",
  },
  {
    number: "03",
    title: "Goedkeuring & betaling",
    subtitle: "Pas betalen als je 100% tevreden bent",
    description: "Jij keurt goed, dan pas betalen. Je website gaat direct live met hosting en SSL inbegrepen.",
  },
  {
    number: "04",
    title: "Doorlopende support",
    subtitle: "Wij blijven je partner",
    description: "Wijzigingen aanvragen via je dashboard. Geen gedoe met e-mail of tickets.",
  },
];

export function ProcessRoadmap() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = stepRefs.current.indexOf(entry.target as HTMLDivElement);
          if (entry.isIntersecting && index !== -1) {
            setVisibleSteps((prev) => {
              if (!prev.includes(index)) {
                return [...prev, index].sort((a, b) => a - b);
              }
              return prev;
            });
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px" }
    );

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-[#f5f3ef] overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-[clamp(32px,6vw,56px)] font-bold tracking-[-0.03em] leading-[1.1] text-neutral-900"
            style={{
              fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif',
            }}
          >
            In 4 simpele stappen is jouw business online
          </h2>
          <p className="mt-4 text-neutral-500 text-base md:text-lg max-w-md mx-auto">
            In vier stappen naar jouw professionele website.
          </p>
        </div>

        {/* Steps - Compact 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {steps.map((step, index) => {
            const isVisible = visibleSteps.includes(index);

            return (
              <div
                key={step.number}
                ref={(el) => { stepRefs.current[index] = el; }}
                className="group relative bg-white rounded-2xl p-5 md:p-6 border border-neutral-100 transition-all duration-500 hover:border-neutral-200 hover:shadow-md"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible 
                    ? 'translateY(0)' 
                    : 'translateY(30px)',
                  transitionDelay: `${index * 80}ms`,
                }}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 text-white text-xs font-bold flex-shrink-0">
                      {step.number}
                    </span>
                    <h3 
                      className="text-lg md:text-xl font-bold text-neutral-900 tracking-tight"
                      style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                    >
                      {step.title}
                    </h3>
                  </div>
                  {step.highlight && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-900 text-white whitespace-nowrap flex-shrink-0">
                      <Check className="w-2.5 h-2.5" />
                      Gratis
                    </span>
                  )}
                </div>

                {/* Content */}
                <p className="text-sm font-medium text-neutral-600 mb-2">
                  {step.subtitle}
                </p>

                <p className="text-neutral-500 leading-relaxed text-sm">
                  {step.description}
                </p>

                {/* Subtle hover accent */}
                <div className="absolute bottom-0 left-5 right-5 h-0.5 bg-neutral-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div 
          className="text-center mt-12 md:mt-16"
          style={{
            opacity: visibleSteps.length >= 2 ? 1 : 0,
            transform: visibleSteps.length >= 2 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <Link href="/start">
            <Button size="lg" className="group text-base px-8 py-4">
              Start je project
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="mt-3 text-sm text-neutral-400">
            Binnen 5 minuten je gratis ontwerp aanvragen
          </p>
        </div>
      </div>
    </section>
  );
}
