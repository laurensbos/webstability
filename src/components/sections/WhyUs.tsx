"use client";

import React, { useRef, useEffect, useState } from "react";
import { Shield, Zap, Users, Award, Clock, MessageSquare, FileText, TrendingUp, Heart, Rocket, DollarSign, Headphones } from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Geen hoge investering vooraf",
    description: "Bij traditionele bureaus betaal je €3.000 tot €10.000 vooraf. Wij werken met een laag maandabonnement en kleine opstartkosten.",
    highlight: "Bespaar tot 80% op opstartkosten",
  },
  {
    icon: Clock,
    title: "Sneller online",
    description: "Gemiddeld duurt een website bij een bureau 6-12 weken. Wij leveren binnen 2-3 weken een volledig werkende website.",
    highlight: "Live binnen 2-3 weken",
  },
  {
    icon: Shield,
    title: "Alles inbegrepen",
    description: "Hosting, SSL, onderhoud, updates en backups — het zit allemaal in je maandabonnement. Geen verrassingen achteraf.",
    highlight: "Tot €2.000/jaar besparing",
  },
  {
    icon: Heart,
    title: "Persoonlijke aanpak",
    description: "Direct contact met je developer. Geen ticketsystemen of accountmanagers. Korte lijntjes en snelle communicatie.",
    highlight: "Direct contact met developer",
  },
  {
    icon: Rocket,
    title: "Razendsnelle websites",
    description: "Gebouwd met Next.js voor laadtijden onder 1 seconde. Betere SEO-scores en meer conversies voor jouw bedrijf.",
    highlight: "PageSpeed score 90+",
  },
  {
    icon: Headphones,
    title: "Flexibel opzegbaar",
    description: "Geen langlopende contracten. Na 3 maanden maandelijks opzegbaar. Je website groeit mee met je bedrijf.",
    highlight: "Maandelijks opzegbaar",
  },
];

export function WhyUs() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [fontIndex, setFontIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const prevVisibleRef = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Different font styles for "anders" - matching /websites page
  const fontStyles = [
    { fontFamily: '"Playfair Display", serif', fontWeight: '700' },
    { fontFamily: '"Courier New", monospace', fontWeight: '700' },
    { fontFamily: '"Arial Black", sans-serif', fontWeight: '900' },
    { fontFamily: '"Georgia", serif', fontWeight: '400' },
    { fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '100' },
  ];

  // Track visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Font switching animation - triggered every time section becomes visible
  useEffect(() => {
    // Only trigger when going from not visible to visible
    if (isVisible && !prevVisibleRef.current && !isAnimating) {
      setIsAnimating(true);
      setFontIndex(0);
      
      let currentIndex = 0;
      const interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % fontStyles.length;
        setFontIndex(currentIndex);
      }, 100);
      
      // Stop after 2 seconds and reset to normal font
      setTimeout(() => {
        clearInterval(interval);
        setFontIndex(-1);
        setIsAnimating(false);
      }, 2000);
    }
    
    prevVisibleRef.current = isVisible;
  }, [isVisible, isAnimating, fontStyles.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
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
      { threshold: 0.2, rootMargin: "0px" }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-16 text-center mx-auto">
          <h2
            className="text-[clamp(36px,7vw,56px)] font-bold tracking-[-0.03em] leading-[1.1] text-neutral-900"
            style={{
              fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif',
            }}
          >
            Wij doen websites{" "}
            <span className="inline-block">
              <span
                style={{
                  fontFamily: fontIndex >= 0 ? fontStyles[fontIndex].fontFamily : 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif',
                  fontWeight: fontIndex >= 0 ? fontStyles[fontIndex].fontWeight : '700',
                }}
              >
                anders
              </span>
            </span>
          </h2>
          <p className="mt-6 text-[17px] leading-[26px] text-neutral-600 md:text-[18px] md:leading-[28px] max-w-2xl mx-auto">
            Geen ouderwetse bureaus met hoge kosten en lange wachttijden. Wij maken professionele websites toegankelijk voor elk bedrijf.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => {
            const isVisible = visibleCards.includes(index);
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="group relative bg-[#f5f3ef] rounded-2xl p-6 md:p-8 transition-all duration-500"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible 
                    ? 'translateY(0)' 
                    : 'translateY(30px)',
                  transitionDelay: `${index * 80}ms`,
                }}
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-900 text-white mb-4">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 
                  className="text-xl md:text-2xl font-bold text-neutral-900 mb-3 tracking-tight"
                  style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                >
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-600 leading-relaxed text-[15px] mb-3">
                  {benefit.description}
                </p>

                {/* Highlight */}
                {benefit.highlight && (
                  <div className="flex items-center gap-2 mt-4">
                    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium text-neutral-700">
                      {benefit.highlight}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
