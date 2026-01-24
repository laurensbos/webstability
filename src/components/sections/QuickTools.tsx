"use client";

import * as React from "react";
import { Input, Button } from "@/components/ui";
import { Search, Check, X, Loader2, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useScrollReveal } from "@/lib/useScrollReveal";

export function QuickTools() {
  const [domain, setDomain] = React.useState("");
  const [domainStatus, setDomainStatus] = React.useState<"idle" | "loading" | "available" | "taken" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [checkedDomain, setCheckedDomain] = React.useState("");

  const checkDomain = async () => {
    if (!domain) return;
    
    setDomainStatus("loading");
    setErrorMessage("");
    
    try {
      const response = await fetch("/api/check-domain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();

      if (!response.ok) {
        setDomainStatus("error");
        setErrorMessage(data.error || "Er is een fout opgetreden");
        return;
      }

      if (data.error) {
        setDomainStatus("error");
        setErrorMessage(data.error);
        return;
      }

      setCheckedDomain(data.domain);
      setDomainStatus(data.available ? "available" : "taken");
    } catch {
      setDomainStatus("error");
      setErrorMessage("Kon geen verbinding maken met de server");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkDomain();
    }
  };

  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={sectionRef} className="bg-neutral-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className={`grid gap-8 lg:grid-cols-2 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Domain Checker */}
          <div 
            className="relative overflow-hidden rounded-2xl p-6 md:p-8"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 20%, #ec4899 50%, #f97316 80%, #fbbf24 100%)',
            }}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -left-20 -top-20 h-[200px] w-[200px] rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 h-[200px] w-[200px] rounded-full bg-white/10 blur-3xl" />
            </div>
            
            <div className="relative flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <div 
                  className="text-[18px] leading-[22px] tracking-[-0.01em] text-white md:text-[20px] md:leading-[24px]"
                  style={{ fontFamily: 'Inter Tight, Inter, system-ui, sans-serif', fontWeight: 600 }}
                >
                  Domein Checker
                </div>
                <p className="text-sm text-white/80">
                  Check direct of jouw domeinnaam beschikbaar is
                </p>
              </div>
            </div>

            <div className="relative mt-6">
              <div className="flex gap-2">
                <Input
                  placeholder="jouwbedrijf.nl"
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value);
                    setDomainStatus("idle");
                  }}
                  onKeyDown={handleKeyDown}
                  leftIcon={<Search className="h-5 w-5" />}
                  className="flex-1 bg-white/90 border-white/20"
                />
                <Button
                  onClick={checkDomain}
                  disabled={!domain || domainStatus === "loading"}
                  isLoading={domainStatus === "loading"}
                  className="bg-[#f5f3ef] text-neutral-900 hover:bg-[#ebe8e2] border-0"
                >
                  Check
                </Button>
              </div>

              {/* Result */}
              {domainStatus === "available" && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/90 p-4 text-green-800 animate-fade-in">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">
                    {checkedDomain} is beschikbaar!
                  </span>
                  <Link href={`/domeinen?domain=${checkedDomain}`} className="ml-auto">
                    <Button size="sm" className="bg-neutral-900 text-white hover:bg-neutral-800">Registreer</Button>
                  </Link>
                </div>
              )}

              {domainStatus === "taken" && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/90 p-4 text-red-800 animate-fade-in">
                  <X className="h-5 w-5" />
                  <span className="font-medium">
                    {checkedDomain} is helaas al bezet
                  </span>
                </div>
              )}

              {domainStatus === "error" && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/90 p-4 text-amber-800 animate-fade-in">
                  <X className="h-5 w-5" />
                  <span className="font-medium">
                    {errorMessage}
                  </span>
                </div>
              )}
            </div>

            <div className="relative mt-6 flex items-center gap-2 text-sm text-white/80">
              <span>Populaire TLD&apos;s:</span>
              <span className="font-medium text-white">.nl</span>
              <span className="font-medium text-white">.com</span>
              <span className="font-medium text-white">.eu</span>
            </div>
          </div>

          {/* Website Analyzer Teaser */}
          <div className="rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-6 text-white md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <div 
                  className="text-[18px] leading-[22px] tracking-[-0.01em] text-white md:text-[20px] md:leading-[24px]"
                  style={{ fontFamily: 'Inter Tight, Inter, system-ui, sans-serif', fontWeight: 600 }}
                >
                  Website Analyzer
                </div>
                <p className="text-sm text-neutral-400">
                  Gratis analyse van elke website
                </p>
              </div>
            </div>

            <p className="mt-6 text-[15px] leading-[24px] text-neutral-300">
              Ontdek hoe je website scoort op snelheid, SEO, toegankelijkheid en
              meer. Krijg direct bruikbare tips om je website te verbeteren.
            </p>

            <ul className="mt-6 space-y-2">
              {[
                "Performance score",
                "SEO analyse",
                "Accessibility check",
                "Mobile-friendliness",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[14px] leading-[20px]">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/website-analyzer" className="mt-8 block">
              <Button
                variant="secondary"
                className="w-full border-neutral-600 bg-neutral-700 text-white hover:bg-neutral-600 hover:text-white"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Analyseer je website
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
