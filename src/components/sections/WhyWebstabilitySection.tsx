"use client";

import { useState, useEffect, useRef } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { 
  Check,
  Wallet,
  Clock,
  Shield,
  Heart,
  Rocket,
  Users
} from "lucide-react";

const advantages = [
  {
    icon: Wallet,
    title: "Geen hoge investering vooraf",
    description: "Bij traditionele bureaus betaal je €3.000 tot €10.000 vooraf. Wij werken met een laag maandbedrag en kleine opstartkosten.",
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
    description: "Hosting, SSL, onderhoud, updates en backups — het zit allemaal in je maandbedrag. Geen verrassingen achteraf.",
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
    icon: Users,
    title: "Flexibel opzegbaar",
    description: "Geen langlopende contracten. Na 3 maanden maandelijks opzegbaar. Je website groeit mee met je bedrijf.",
    highlight: "Maandelijks opzegbaar",
  },
];

export function WhyWebstability() {
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1, triggerOnce: false });
  const [fontIndex, setFontIndex] = useState(-1); // Start with normal font
  const [isAnimating, setIsAnimating] = useState(false);
  const prevVisibleRef = useRef(false);

  // Different font styles for "anders" - just 5 diverse fonts
  const fontStyles = [
    { fontFamily: '"Playfair Display", serif', fontWeight: '700' },
    { fontFamily: '"Courier New", monospace', fontWeight: '700' },
    { fontFamily: '"Arial Black", sans-serif', fontWeight: '900' },
    { fontFamily: '"Georgia", serif', fontWeight: '400' },
    { fontFamily: '"Helvetica Neue", sans-serif', fontWeight: '100' },
  ];

  // Start animation every time section becomes visible (after being hidden)
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

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 md:py-28 lg:py-32 bg-[#f5f3ef] overflow-hidden"
    >
      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Section header */}
        <div 
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 
            className="text-[32px] md:text-[40px] lg:text-[48px] font-bold tracking-[-0.03em] text-neutral-900 leading-[1.1]"
            style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
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
          <p 
            className="mt-5 text-[17px] md:text-[18px] leading-relaxed text-neutral-500"
            style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
          >
            Geen ouderwetse bureaus met hoge kosten en lange wachttijden. 
            Wij maken professionele websites toegankelijk voor elk bedrijf.
          </p>
        </div>

        {/* Advantages grid */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ease-out delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-white hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#f5f3ef] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <advantage.icon className="w-6 h-6 text-neutral-700" />
              </div>
              <h3 
                className="text-[18px] font-semibold text-neutral-900 mb-2"
                style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
              >
                {advantage.title}
              </h3>
              <p className="text-[14px] leading-relaxed text-neutral-500 mb-4">
                {advantage.description}
              </p>
              <div className="inline-flex items-center gap-2 text-[13px] font-medium text-neutral-700">
                <Check className="w-4 h-4 text-emerald-500" />
                {advantage.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
