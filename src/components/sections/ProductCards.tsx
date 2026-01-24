"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ArrowRight, ShoppingBag, Code, Globe, Zap, Shield, Smartphone, TrendingUp, Palette, Settings, Database, Layers, Workflow, MousePointer, CreditCard, Package, Wrench, Cpu, Cog, Search, BarChart3, Lock, Cloud, Rocket, Target, Users, MessageSquare, Mail, Calendar, Clock, Star, CheckCircle, Edit3, Monitor, Boxes, Share2, Image as ImageIcon } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const products = [
  {
    id: "websites",
    title: "Websites",
    description:
      "Professionele, snelle websites die je merk versterken. Inclusief gratis design en maandelijks onderhoud.",
    href: "/websites",
    features: ["Gratis design", "SSL & hosting", "Dashboard toegang", "Support"],
    startPrice: "€65",
    period: "/maand",
    setupPrice: "€199",
    isCustom: false,
    color: "#6366f1",
    detailedDescription: "Een professionele website is de basis van je online aanwezigheid. Wij bouwen snelle, veilige websites die perfect passen bij jouw merk en doelgroep.",
    highlights: [
      { icon: Zap, title: "Razendsnelle laadtijd", description: "Google PageSpeed score 90+" },
      { icon: Shield, title: "Veilig & betrouwbaar", description: "SSL certificaat inbegrepen" },
      { icon: Smartphone, title: "Mobile-first design", description: "Perfect op elk apparaat" },
      { icon: TrendingUp, title: "SEO geoptimaliseerd", description: "Beter vindbaar in Google" },
    ],
  },
  {
    id: "webshops",
    title: "Webshops",
    description:
      "E-commerce oplossingen die converteren. Van productbeheer tot betalingen, alles geregeld.",
    href: "/webshops",
    features: ["Mollie payments", "Productbeheer", "Orderbeheer", "Marketing tools"],
    startPrice: "€120",
    period: "/maand",
    setupPrice: "€349",
    isCustom: false,
    color: "#10b981",
    detailedDescription: "Een webshop die verkoopt. Wij bouwen complete e-commerce oplossingen met alle functionaliteit die je nodig hebt om online te verkopen.",
    highlights: [
      { icon: ShoppingBag, title: "Complete e-commerce", description: "Product- en orderbeheer" },
      { icon: Shield, title: "Veilige betalingen", description: "Mollie & iDEAL integratie" },
      { icon: TrendingUp, title: "Conversie-optimalisatie", description: "Meer bezoekers, meer sales" },
      { icon: Palette, title: "Op maat ontworpen", description: "Uniek design voor jouw merk" },
    ],
  },
  {
    id: "maatwerk",
    title: "Maatwerk",
    description:
      "Custom development voor unieke wensen. API-integraties, platforms en complexe functionaliteit.",
    href: "/maatwerk",
    features: ["API integraties", "Custom platforms", "Schaalbare oplossingen", "Dedicated support"],
    startPrice: "€200",
    period: "/maand",
    setupPrice: "Op offerte",
    isCustom: true,
    color: "#f59e0b",
    detailedDescription: "Wanneer standaard oplossingen niet voldoen, bouwen wij op maat. Van API-koppelingen tot complete platforms - alles is mogelijk.",
    highlights: [
      { icon: Code, title: "Custom development", description: "Gebouwd voor jouw wensen" },
      { icon: Database, title: "API integraties", description: "Koppel alle systemen" },
      { icon: Layers, title: "Schaalbare architectuur", description: "Groeit mee met je bedrijf" },
      { icon: Workflow, title: "Workflow automatisering", description: "Bespaar tijd & geld" },
    ],
  },
];

// Website Preview Template
function WebsitePreview() {
  return (
    <div className="w-full h-full overflow-hidden rounded-2xl">
      <img 
        src="https://imagedelivery.net/smKE6Ur8bsXEDgFHplqMpg/b1960e09-bb72-45a0-9607-448fbdc0b000/public" 
        alt="Website Preview"
        className="w-full h-full object-cover object-center rounded-2xl"
      />
    </div>
  );
}

// Webshop Preview Template  
function WebshopPreview() {
  return (
    <div className="w-full h-full overflow-hidden rounded-2xl">
      <img 
        src="https://imagedelivery.net/smKE6Ur8bsXEDgFHplqMpg/19c38ac1-c4f8-4054-a101-2324dcfa5500/public" 
        alt="Webshop Preview"
        className="w-full h-full object-cover object-center rounded-2xl"
      />
    </div>
  );
}

// Maatwerk Preview Template
function MaatwerkPreview() {
  return (
    <div className="w-full h-full overflow-hidden rounded-2xl">
      <img 
        src="https://imagedelivery.net/smKE6Ur8bsXEDgFHplqMpg/7588e6d1-6400-4a70-7ebb-9a8f9284c200/public" 
        alt="Maatwerk Preview"
        className="w-full h-full object-cover object-center rounded-2xl"
      />
    </div>
  );
}

const previewComponents: Record<string, () => React.ReactElement> = {
  "websites": WebsitePreview,
  "webshops": WebshopPreview,
  "maatwerk": MaatwerkPreview,
};

export function ProductCards() {
  const [activeProduct, setActiveProduct] = useState(products[0]);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Scroll reveal
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.15 });

  // Typing animation effect - slower typing speed
  useEffect(() => {
    const targetTitle = activeProduct.id === "websites" 
      ? "Website" 
      : activeProduct.id === "webshops" 
        ? "Webshop" 
        : "Maatwerk";
    
    setIsTyping(true);
    setDisplayedTitle("");
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= targetTitle.length) {
        setDisplayedTitle(targetTitle.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 100); // Was 50ms, now 100ms - slower typing

    return () => clearInterval(typingInterval);
  }, [activeProduct.id]);

  // Auto-rotate through products every 4 seconds unless paused
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveProduct((current) => {
          const currentIndex = products.findIndex(p => p.id === current.id);
          const nextIndex = (currentIndex + 1) % products.length;
          return products[nextIndex];
        });
        setTimeout(() => setIsAnimating(false), 50);
      }, 100);
    }, 4000); // Was 2000ms, now 4000ms - slower card rotation

    return () => clearInterval(interval);
  }, [isPaused]);

  // When user clicks a card, pause auto-rotation
  const handleCardClick = (product: typeof products[0]) => {
    setIsPaused(true);
    setActiveProduct(product);
  };

  const PreviewComponent = previewComponents[activeProduct.id];

  return (
    <section 
      ref={sectionRef}
      className="relative pt-12 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32 bg-[#f5f3ef] overflow-hidden" 
      id="producten"
    >
      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-7xl">
          <div className="relative">
            <h2 
              className={`text-[clamp(36px,7vw,56px)] leading-[1.1] font-bold tracking-[-0.03em] text-[rgb(43,44,44)] transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif',
                transitionDelay: '100ms',
              }}
            >
              {displayedTitle}
              <span className={`inline-block w-[3px] h-[0.85em] bg-neutral-400 ml-0.5 align-middle ${isTyping ? 'animate-pulse' : 'opacity-0'}`} />
              {" "}in abonnementsvorm.
            </h2>
          </div>
          <p 
            className={`mt-6 text-[17px] leading-[26px] text-neutral-600 md:text-[18px] md:leading-[28px] max-w-2xl transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '250ms' }}
          >
            Gratis en vrijblijvend design. Kleine eenmalige opstartkosten. 
            Na 3 maanden maandelijks opzegbaar.
          </p>
        </div>

        {/* Content area */}
        <div 
          className={`mt-10 md:mt-14 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          {/* Selector header - outside grid */}
          <div className="mb-6">
            <h3 
              className="text-[22px] font-bold text-neutral-900 md:text-[24px] tracking-[-0.01em]"
              style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
            >
              Kies je product
            </h3>
            <p 
              className="mt-1 text-[15px] text-neutral-400"
              style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
            >
              Selecteer het type website dat bij jouw bedrijf past
            </p>
          </div>

          {/* Grid with cards and preview */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-end">
            {/* Left: Vertical card selectors */}
            <div className="order-1 lg:order-1">
              <div className="space-y-4">
                {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleCardClick(product)}
                  className={`w-full p-6 rounded-2xl text-left transition-all duration-500 ease-out outline-none focus:outline-none ${
                    activeProduct.id === product.id
                      ? 'bg-[#f5f3ef] text-neutral-900 shadow-lg scale-[1.02]'
                      : 'bg-white text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  <h3 
                    className="text-[24px] font-bold tracking-[-0.01em] text-neutral-900"
                    style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                  >
                    {product.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[13px] text-neutral-500">vanaf</span>
                        <span 
                          className="text-[24px] font-bold tracking-[-0.02em] text-neutral-900"
                          style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                        >
                          {product.startPrice}
                        </span>
                        <span className="text-[15px] font-medium text-neutral-500">
                          {product.period}
                        </span>
                      </div>
                      <div className="text-[12px] text-neutral-400 mt-0.5">
                        + {product.setupPrice} eenmalige opstartkosten · excl. btw
                      </div>
                    </div>
                    <Link 
                      href={product.href}
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-2 rounded-lg text-[14px] font-medium transition-colors bg-[#ebe8e2] text-neutral-800 hover:bg-[#e0ddd6]"
                    >
                      Bekijk
                    </Link>
                  </div>
                </button>
              ))}
              </div>
            </div>

          {/* Right: Preview mockup - matches height of cards */}
          <div className="order-2 lg:order-2 hidden lg:flex justify-center items-end">
            <div className="w-full max-w-[550px] h-[645px] rounded-2xl overflow-hidden">
              {/* Website mockup container */}
              <div className={`relative rounded-2xl overflow-hidden bg-transparent transition-opacity duration-200 ease-out w-full h-full ${
                isAnimating ? 'opacity-0' : 'opacity-100'
              }`}>
                {/* Preview content */}
                <div className="overflow-hidden h-full rounded-2xl">
                  {PreviewComponent && <PreviewComponent />}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
