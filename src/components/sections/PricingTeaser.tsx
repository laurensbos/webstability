"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { 
  Check, 
  Rocket, 
  TrendingUp, 
  Crown,
  FileText,
  Edit3,
  LayoutDashboard,
  Receipt
} from "lucide-react";
import { Button } from "@/components/ui";
import Link from "next/link";

const packages = [
  {
    name: "Start",
    icon: Rocket,
    monthlyPrice: 65,
    oneTimePrice: 199,
    description: "Perfect om online zichtbaar te worden",
    idealFor: "ZZP'ers en starters",
    pages: "Tot 5 pagina's",
    edits: "2 kleine aanpassingen/maand",
    dashboard: "Basis dashboard",
    highlights: [
      "Professioneel design op maat",
      "Mobiel-vriendelijk",
      "Vindbaar in Google",
      "Tekst & foto's wijzigen",
      "E-mail support",
    ],
    extras: [],
  },
  {
    name: "Groei",
    icon: TrendingUp,
    monthlyPrice: 125,
    oneTimePrice: 299,
    description: "Automatiseer en bespaar tijd",
    idealFor: "MKB en groeiende bedrijven",
    pages: "Tot 15 pagina's",
    edits: "5 aanpassingen/maand",
    dashboard: "Uitgebreid dashboard",
    popular: true,
    highlights: [
      "Alles uit Start, plus:",
      "Online afspraken (Calendly)",
      "WhatsApp chat knop",
      "Google Reviews tonen",
      "Blog & nieuwssectie",
      "Bezoekersstatistieken",
      "Telefoon support",
    ],
    extras: [],
  },
  {
    name: "Pro",
    icon: Crown,
    monthlyPrice: 245,
    oneTimePrice: 399,
    description: "Volledig ontzorgd & maximale groei",
    idealFor: "Gevestigde bedrijven",
    pages: "Onbeperkt pagina's",
    edits: "Onbeperkt aanpassingen",
    dashboard: "Pro dashboard + rapportages",
    highlights: [
      "Alles uit Groei, plus:",
      "Nieuwe pagina's & secties",
      "Instagram & Facebook feed",
      "Nieuwsbrief (Mailchimp)",
      "Google Mijn Bedrijf sync",
      "Maandelijkse SEO-rapportage",
      "24/7 prioriteit support",
      "Persoonlijke accountmanager",
    ],
    extras: [],
  },
];

export function PricingTeaser() {
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });

  // Calculate net prices for each package (after BTW return and tax deduction)
  const calculateNetPrices = (monthlyPrice: number, oneTimePrice: number) => {
    // Year 1: one-time + 12 months
    const totalYear1ExclBtw = oneTimePrice + (monthlyPrice * 12);
    const btwReturn = totalYear1ExclBtw * 0.21;
    const taxDeduction = totalYear1ExclBtw * 0.37; // Average tax bracket
    const netCostYear1 = totalYear1ExclBtw - taxDeduction;
    const netPerMonth = Math.round(netCostYear1 / 12);
    
    return {
      totalExclBtw: totalYear1ExclBtw,
      btwReturn: Math.round(btwReturn),
      taxDeduction: Math.round(taxDeduction),
      netCostYear1: Math.round(netCostYear1),
      netPerMonth,
    };
  };

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 lg:py-32 bg-white overflow-hidden">
      {/* Decorative background elements - same as WebsiteFeatures */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Subtle dot pattern */}
        <div 
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Gradient accent top right */}
        <div 
          className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(192,132,252,0.08) 0%, transparent 60%)',
          }}
        />
        {/* Gradient accent bottom left */}
        <div 
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-35"
          style={{
            background: 'radial-gradient(circle, rgba(251,113,133,0.06) 0%, transparent 55%)',
          }}
        />
        {/* Decorative rings */}
        <div className="absolute top-32 left-[10%] w-20 h-20 rounded-full border border-neutral-200/50" />
        <div className="absolute bottom-40 right-[12%] w-16 h-16 rounded-full border border-neutral-200/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Section header - same style as WebsiteFeatures */}
        <div 
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 
            className="text-[32px] md:text-[40px] lg:text-[48px] font-bold tracking-[-0.03em] text-neutral-900 leading-[1.1]"
            style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
          >
            Transparante <span className="text-neutral-900">prijzen</span>
          </h2>
          <p 
            className="mt-5 text-[17px] md:text-[18px] leading-relaxed text-neutral-500"
            style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
          >
            Kies het pakket dat bij je past. Alle prijzen zijn exclusief btw.
          </p>
        </div>

        {/* Pricing Cards - same card style as WebsiteFeatures */}
        <div 
          className={`grid md:grid-cols-3 gap-6 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '150ms' }}
        >
          {packages.map((pkg) => {
            const IconComponent = pkg.icon;
            return (
              <div
                key={pkg.name}
                className="relative group p-6 rounded-2xl transition-all duration-300 flex flex-col bg-[#f5f3ef] hover:bg-[#ebe8e2]"
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-4 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase">
                    Populair
                  </div>
                )}
                
                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 bg-white">
                    <IconComponent className="w-6 h-6 text-neutral-700" />
                  </div>
                  <div>
                    <h3 
                      className="text-[20px] font-semibold text-neutral-900"
                      style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                    >
                      {pkg.name}
                    </h3>
                    <p className="text-[12px] text-neutral-500">{pkg.idealFor}</p>
                  </div>
                </div>

                <p className="text-[14px] mb-5 text-neutral-500">{pkg.description}</p>
                
                {/* Pricing */}
                <div className="mb-6 pb-6 border-b border-neutral-200">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-[36px] font-bold text-neutral-900">€{pkg.monthlyPrice}</span>
                    <span className="text-[14px] text-neutral-500">/maand</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-neutral-600">+ €{pkg.oneTimePrice},- eenmalig</span>
                    <span className="text-[11px] text-neutral-400">(excl. btw)</span>
                  </div>
                </div>

                {/* Pages */}
                <div className="flex items-center gap-2 mb-2 text-[14px] font-medium text-neutral-700">
                  <FileText className="w-4 h-4 text-neutral-500" />
                  <span>{pkg.pages}</span>
                </div>

                {/* Edits per month */}
                <div className="flex items-center gap-2 mb-2 text-[14px] font-medium text-neutral-700">
                  <Edit3 className="w-4 h-4 text-neutral-500" />
                  <span>{pkg.edits}</span>
                </div>

                {/* Dashboard */}
                <div className="flex items-center gap-2 mb-4 text-[14px] font-medium text-neutral-700">
                  <LayoutDashboard className="w-4 h-4 text-neutral-500" />
                  <span>{pkg.dashboard}</span>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-grow">
                  {pkg.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span className="text-[13px] text-neutral-700">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={`/start?pakket=${pkg.name.toLowerCase()}`} className="block mt-auto">
                  <Button 
                    variant={pkg.popular ? "primary" : "secondary"} 
                    className="w-full"
                    size="lg"
                  >
                    Kies {pkg.name}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Net Cost Breakdown - Two column layout */}
        <div 
          className={`mt-16 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="bg-[#f5f3ef] rounded-2xl p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Left: Explanation */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full text-[12px] text-green-700 mb-4">
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Slim investeren</span>
                </div>
                <h3 
                  className="text-[24px] md:text-[28px] font-bold text-neutral-900 mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                >
                  Wat kost een website écht?
                </h3>
                <p className="text-[15px] text-neutral-600 mb-6 leading-relaxed">
                  Als ondernemer krijg je de BTW terug én zijn de kosten aftrekbaar van je winst. 
                  Hierdoor betaal je netto veel minder dan je denkt.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-neutral-900">21% BTW terugvragen</p>
                      <p className="text-[12px] text-neutral-500">Via je BTW-aangifte</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-neutral-900">100% zakelijk aftrekbaar</p>
                      <p className="text-[12px] text-neutral-500">Verlaagt je belastbare winst</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-neutral-900">±37% belastingvoordeel</p>
                      <p className="text-[12px] text-neutral-500">Gemiddelde besparing</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Compact price table */}
              <div className="bg-white rounded-xl p-6">
                <p className="text-[12px] text-neutral-500 uppercase tracking-wide mb-4">Netto kosten per maand*</p>
                
                <div className="space-y-4">
                  {packages.map((pkg) => {
                    const net = calculateNetPrices(pkg.monthlyPrice, pkg.oneTimePrice);
                    const IconComponent = pkg.icon;
                    
                    return (
                      <div 
                        key={pkg.name}
                        className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#f5f3ef] flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-neutral-700" />
                          </div>
                          <div>
                            <p className="text-[15px] font-semibold text-neutral-900">{pkg.name}</p>
                            <p className="text-[12px] text-neutral-500">€{pkg.monthlyPrice}/mnd + €{pkg.oneTimePrice} eenmalig</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[22px] font-bold text-neutral-900">€{net.netPerMonth},-</p>
                          <p className="text-[11px] text-green-600">netto/maand</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-neutral-400 mt-4">
                  * Op basis van 12 maanden en 37% belastingschijf
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
