"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { Code2, Rocket, Users, Globe } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const features = [
  { icon: Code2, text: "100% eigendom van je code" },
  { icon: Rocket, text: "Binnen 2-4 weken live" },
  { icon: Users, text: "150+ tevreden klanten" },
  { icon: Globe, text: "Maandelijks onderhoud inclusief" },
];

export function OnboardingCTA() {
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.15 });

  return (
    <section ref={sectionRef} className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div 
          className={`relative overflow-hidden rounded-3xl px-8 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98]'
          }`}
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 20%, #ec4899 50%, #f97316 80%, #fbbf24 100%)',
          }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-white/10 blur-3xl" />
          </div>

          {/* Two column layout */}
          <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left: Title + CTA */}
            <div>
              <div 
                className="text-[32px] leading-[38px] font-bold tracking-[-0.02em] text-white md:text-[40px] md:leading-[46px] lg:text-[48px] lg:leading-[54px]"
                style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
              >
                Ontdek wat wij
                <br />
                voor jou kunnen
                <br />
                betekenen
              </div>

              <div className="mt-8">
                <Link href="/start">
                  <Button
                    size="md"
                    className="bg-[#f5f3ef] text-neutral-900 hover:bg-[#ebe8e2] border-0"
                  >
                    Start je project
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Features list */}
            <div className="space-y-5">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.text} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span 
                      className="text-[17px] font-medium tracking-[-0.01em] text-white md:text-[18px]"
                      style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                    >
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
