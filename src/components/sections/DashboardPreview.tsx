"use client";

import {
  LayoutDashboard,
  FileEdit,
  BarChart3,
  Clock,
  Bell,
  Shield,
} from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const features = [
  {
    title: "Projectvoortgang",
    description:
      "Volg elke stap van je project in real-time. Van intake tot livegang, altijd up-to-date.",
    icon: LayoutDashboard,
  },
  {
    title: "Wijzigingsverzoeken",
    description:
      "Dien eenvoudig wijzigingen in en volg de status. Geen eindeloze e-mails meer.",
    icon: FileEdit,
  },
  {
    title: "Analytics",
    description:
      "Bekijk hoe je website presteert. Bezoekersaantallen, conversies en meer in één overzicht.",
    icon: BarChart3,
  },
  {
    title: "24/7 Toegang",
    description:
      "Je dashboard is altijd bereikbaar. Check je project wanneer het jou uitkomt.",
    icon: Clock,
  },
  {
    title: "Notificaties",
    description:
      "Ontvang updates bij belangrijke mijlpalen. Altijd op de hoogte van de laatste ontwikkelingen.",
    icon: Bell,
  },
  {
    title: "Veilig & Privé",
    description:
      "Je gegevens zijn veilig bij ons. SSL-versleuteling en strikte privacy.",
    icon: Shield,
  },
];

export function DashboardPreview() {
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>({ 
    threshold: 0.1,
    triggerOnce: false 
  });

  return (
    <section ref={sectionRef} className="bg-[#f5f3ef] py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Content */}
          <div>
            <h2 
              className="text-[32px] leading-[36px] font-bold tracking-[-0.02em] text-[rgb(43,44,44)] md:text-[44px] md:leading-[50px] lg:text-[52px] lg:leading-[58px]"
              style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
            >
              Beheer je website vanuit je binnenzak
            </h2>
            <p className="mt-6 text-[17px] leading-[26px] text-neutral-600 md:text-[18px] md:leading-[28px]">
              Compleet mobiel-first dashboard voor jouw project. Vraag aanpassingen aan, 
              bekijk je designvoorkeuren, facturen, analytics, prestaties — alles vanuit je binnenzak.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={feature.title} 
                    className="inline-flex items-center gap-2.5 px-4 py-3 bg-white rounded-full shadow-sm"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5f3ef] text-neutral-700">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span 
                      className="text-[14px] font-medium text-neutral-900"
                      style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                    >
                      {feature.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dashboard illustration - iPhone */}
          <div className="relative flex items-center justify-center lg:justify-end" style={{ perspective: '1200px' }}>
            {/* iPhone with floating animation */}
            {isVisible ? (
              <div 
                key="visible"
                className="relative z-10 phone-slide-up"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <img 
                  src="https://imagedelivery.net/smKE6Ur8bsXEDgFHplqMpg/2f5999e5-5dbb-4244-36b4-7d3a519e7400/public"
                  alt="Mobiel dashboard op iPhone"
                  className="w-full h-auto drop-shadow-2xl scale-[2]"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            ) : (
              <div 
                key="hidden"
                className="relative z-10 opacity-0"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'translateY(200px) scale(0.8)'
                }}
              >
                <img 
                  src="https://imagedelivery.net/smKE6Ur8bsXEDgFHplqMpg/2f5999e5-5dbb-4244-36b4-7d3a519e7400/public"
                  alt="Mobiel dashboard op iPhone"
                  className="w-full h-auto drop-shadow-2xl scale-[2]"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes dashboard-slide-up {
          from {
            opacity: 0;
            transform: translateY(200px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
        }
        
        @keyframes dashboard-float-phone {
          0% {
            transform: translateY(0px) rotateY(0deg) rotateZ(0deg);
          }
          25% {
            transform: translateY(-20px) rotateY(20deg) rotateZ(3deg);
          }
          50% {
            transform: translateY(-30px) rotateY(0deg) rotateZ(0deg);
          }
          75% {
            transform: translateY(-20px) rotateY(-20deg) rotateZ(-3deg);
          }
          100% {
            transform: translateY(0px) rotateY(0deg) rotateZ(0deg);
          }
        }
        
        .phone-slide-up {
          animation: dashboard-slide-up 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards, dashboard-float-phone 10s ease-in-out 2.5s infinite;
        }
      `}</style>
    </section>
  );
}
