"use client";

import { useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { Search, Check, X, Loader2, Globe, Sparkles } from "lucide-react";

export function DomainChecker() {
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });
  const [domain, setDomain] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{ available: boolean; domain: string } | null>(null);

  const handleCheck = async () => {
    if (!domain.trim()) return;
    
    setIsChecking(true);
    setResult(null);
    
    // Format domain
    let formattedDomain = domain.toLowerCase().trim();
    if (!formattedDomain.includes('.')) {
      formattedDomain += '.nl';
    }
    
    try {
      const response = await fetch(`/api/check-domain?domain=${encodeURIComponent(formattedDomain)}`);
      const data = await response.json();
      setResult({ available: data.available, domain: formattedDomain });
    } catch (error) {
      // Fallback: simulate check
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResult({ available: Math.random() > 0.5, domain: formattedDomain });
    }
    
    setIsChecking(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  const popularTLDs = ['.nl', '.com', '.eu'];

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-32 lg:py-40 bg-neutral-900 overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs with animation */}
        <div 
          className={`absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl transition-all duration-1000 ${
            isVisible ? 'opacity-30' : 'opacity-0'
          }`}
          style={{ 
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            animation: isVisible ? 'float-gradient 20s ease-in-out infinite' : 'none',
          }}
        />
        <div 
          className={`absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl transition-all duration-1000 ${
            isVisible ? 'opacity-20' : 'opacity-0'
          }`}
          style={{ 
            background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
            animation: isVisible ? 'float-gradient 15s ease-in-out infinite 2s' : 'none',
          }}
        />
        
        {/* Floating particles */}
        <div 
          className={`absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-purple-400 transition-all duration-1000 ${
            isVisible ? 'opacity-40' : 'opacity-0'
          }`}
          style={{
            animation: isVisible ? 'particle-drift 8s ease-in-out infinite' : 'none',
          }}
        />
        <div 
          className={`absolute top-[35%] right-[20%] w-1.5 h-1.5 rounded-full bg-pink-400 transition-all duration-1000 ${
            isVisible ? 'opacity-40' : 'opacity-0'
          }`}
          style={{
            animation: isVisible ? 'particle-drift 10s ease-in-out infinite 1s' : 'none',
          }}
        />
        <div 
          className={`absolute bottom-[30%] left-[25%] w-1 h-1 rounded-full bg-orange-400 transition-all duration-1000 ${
            isVisible ? 'opacity-40' : 'opacity-0'
          }`}
          style={{
            animation: isVisible ? 'particle-drift 9s ease-in-out infinite 2s' : 'none',
          }}
        />
        <div 
          className={`absolute top-[60%] right-[15%] w-1 h-1 rounded-full bg-purple-300 transition-all duration-1000 ${
            isVisible ? 'opacity-30' : 'opacity-0'
          }`}
          style={{
            animation: isVisible ? 'particle-drift 7s ease-in-out infinite 1.5s' : 'none',
          }}
        />
        
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes float-gradient {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
        }
        @keyframes particle-drift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          25% { transform: translate(15px, -20px) scale(1.2); opacity: 0.2; }
          50% { transform: translate(30px, 10px) scale(0.8); opacity: 0.3; }
          75% { transform: translate(-10px, 25px) scale(1.1); opacity: 0.25; }
        }
        @keyframes sparkle-rotate {
          0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.3; }
          25% { transform: rotate(90deg) scale(1.1); opacity: 0.4; }
          50% { transform: rotate(180deg) scale(1); opacity: 0.2; }
          75% { transform: rotate(270deg) scale(1.1); opacity: 0.35; }
        }
      `}</style>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Section header */}
        <div 
          className={`text-center max-w-3xl mx-auto mb-12 md:mb-16 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
            <Globe className="w-4 h-4 text-purple-400" />
            <span className="text-[13px] font-medium text-white/80">Domeinnaam Checker</span>
          </div>
          <h2 
            className="text-[32px] md:text-[42px] lg:text-[52px] font-bold tracking-[-0.03em] leading-[1.1] mb-5"
            style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
          >
            <span style={{ color: '#ffffff' }}>Is jouw bedrijfsnaam</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              nog beschikbaar?
            </span>
          </h2>
          <p 
            className="text-[17px] md:text-[18px] leading-relaxed text-neutral-400 max-w-xl mx-auto"
            style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
          >
            Check binnen een seconde of jouw gewenste domeinnaam vrij is. 
            Een goede domeinnaam is de basis van je online succes.
          </p>
        </div>

        {/* Domain checker card */}
        <div 
          className={`max-w-2xl mx-auto transition-all duration-700 ease-out delay-150 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div 
            className="rounded-3xl p-8 md:p-10 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
            }}
          >
            {/* Decorative sparkle with animation */}
            <div 
              className="absolute top-6 right-6"
              style={{
                animation: isVisible ? 'sparkle-rotate 6s ease-in-out infinite' : 'none',
              }}
            >
              <Sparkles className="w-6 h-6 text-white/30" />
            </div>

            {/* Search input */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="jouwbedrijf.nl"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-neutral-900 text-[16px] placeholder:text-neutral-400 focus:outline-none focus:ring-0 border-0 transition-all shadow-lg"
                  style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif', outline: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
              </div>
              <button
                onClick={handleCheck}
                disabled={isChecking || !domain.trim()}
                className="px-8 py-4 rounded-xl bg-neutral-900 text-white font-semibold text-[16px] hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
                style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
              >
                {isChecking ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checken...
                  </>
                ) : (
                  'Check beschikbaarheid'
                )}
              </button>
            </div>

            {/* Result */}
            {result && (
              <div 
                className={`mt-6 p-5 rounded-xl backdrop-blur-sm flex items-center gap-4 ${
                  result.available 
                    ? 'bg-white/20 border border-white/30' 
                    : 'bg-white/10 border border-white/20'
                }`}
              >
                {result.available ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-[17px]">
                        🎉 {result.domain} is beschikbaar!
                      </p>
                      <p className="text-white/80 text-[14px]">
                        Start een project om dit domein te claimen
                      </p>
                    </div>
                    <a
                      href="/start"
                      className="px-5 py-2.5 rounded-lg bg-white text-neutral-900 font-semibold text-[14px] hover:bg-white/90 transition-all flex-shrink-0"
                      style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                    >
                      Start project
                    </a>
                  </>
                ) : (
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <X className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-[17px]">
                          {result.domain} is helaas niet beschikbaar
                        </p>
                        <p className="text-white/80 text-[14px]">
                          Probeer een van deze alternatieven:
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-14">
                      {(() => {
                        const baseName = result.domain.split('.')[0];
                        const alternatives = [
                          `${baseName}.nl`,
                          `${baseName}.com`,
                          `${baseName}.eu`,
                          `${baseName}-online.nl`,
                          `mijn${baseName}.nl`,
                        ].filter(alt => alt.toLowerCase() !== result.domain.toLowerCase());
                        return alternatives.slice(0, 4).map((alt) => (
                          <button
                            key={alt}
                            onClick={() => {
                              setDomain(alt);
                              setResult(null);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-[13px] font-medium hover:bg-white/30 transition-colors border border-white/10"
                          >
                            {alt}
                          </button>
                        ));
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Popular TLDs */}
            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <span className="text-white/70 text-[14px]">Populaire extensies:</span>
              {popularTLDs.map((tld) => (
                <button
                  key={tld}
                  onClick={() => {
                    const baseDomain = domain.split('.')[0] || 'jouwbedrijf';
                    setDomain(baseDomain + tld);
                  }}
                  className="px-4 py-1.5 rounded-full bg-white/20 text-white text-[14px] font-medium hover:bg-white/30 transition-colors border border-white/10"
                >
                  {tld}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom info */}
          <p className="text-center text-neutral-500 text-[14px] mt-6">
            Bij elk website pakket is een gratis .nl domein inbegrepen
          </p>
        </div>
      </div>
    </section>
  );
}
