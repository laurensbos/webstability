"use client";

import { useState, useEffect, useRef } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { 
  Globe, 
  Shield, 
  Zap, 
  Smartphone, 
  Search, 
  Palette, 
  Headphones, 
  BarChart3,
  Lock,
  RefreshCw,
  Database,
  Mail,
  Monitor,
  Cloud,
  CheckCircle,
  Code,
  Settings,
  Star,
  Workflow,
  Layers,
  MousePointer,
  Cpu,
  Target,
  TrendingUp,
  Edit3,
  Users,
  MessageSquare,
  Rocket,
  Cog
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Eigen domeinnaam",
    description: "Jouw eigen .nl of .com domein, volledig geconfigureerd en beheerd.",
  },
  {
    icon: Shield,
    title: "SSL-certificaat",
    description: "Gratis SSL voor een veilige verbinding en het groene slotje in de browser.",
  },
  {
    icon: Zap,
    title: "Razendsnelle hosting",
    description: "Premium hosting in Nederland met 99.9% uptime garantie.",
  },
  {
    icon: Smartphone,
    title: "Responsive design",
    description: "Perfect weergegeven op desktop, tablet en mobiel.",
  },
  {
    icon: Search,
    title: "SEO-geoptimaliseerd",
    description: "Technische SEO inbegrepen zodat Google je website goed kan indexeren.",
  },
  {
    icon: Palette,
    title: "Op maat ontworpen",
    description: "Uniek design dat past bij jouw huisstijl en merk.",
  },
  {
    icon: Headphones,
    title: "Persoonlijke support",
    description: "Direct contact met je developer, geen ticketsystemen.",
  },
  {
    icon: BarChart3,
    title: "Analytics dashboard",
    description: "Inzicht in je bezoekers en prestaties via ons dashboard.",
  },
  {
    icon: Lock,
    title: "Dagelijkse backups",
    description: "Automatische backups zodat je data altijd veilig is.",
  },
  {
    icon: RefreshCw,
    title: "Maandelijks onderhoud",
    description: "Updates, beveiligingspatches en optimalisaties inbegrepen.",
  },
  {
    icon: Database,
    title: "Privé dashboard",
    description: "Beheer zelf je content en bekijk statistieken in je eigen dashboard.",
  },
  {
    icon: Mail,
    title: "Direct contact met een expert",
    description: "Vragen? Stel ze direct aan je persoonlijke websitebeheerder.",
  },
];

// Floating background icons - always visible
const floatingIcons = [
  // Row 1 - Top (0-15%)
  { Icon: Globe, position: "top-[3%] left-[3%]", delay: "0s", size: "w-6 h-6 md:w-7 md:h-7", animation: "floatCircle" },
  { Icon: Shield, position: "top-[5%] left-[20%]", delay: "0.5s", size: "w-5 h-5 md:w-6 md:h-6", animation: "floatVertical" },
  { Icon: Search, position: "top-[8%] left-[40%]", delay: "0.8s", size: "w-5 h-5 md:w-6 md:h-6", animation: "floatHorizontal" },
  { Icon: Lock, position: "top-[4%] left-[60%]", delay: "1.6s", size: "w-6 h-6 md:w-7 md:h-7", animation: "floatWave" },
  { Icon: Smartphone, position: "top-[5%] left-[80%]", delay: "1.5s", size: "w-6 h-6 md:w-7 md:h-7", animation: "floatWave" },
  { Icon: BarChart3, position: "top-[3%] right-[3%]", delay: "2.0s", size: "w-5 h-5 md:w-6 md:h-6", animation: "floatDiagonal" },
  
  // Row 2 (20-40%)
  { Icon: Rocket, position: "top-[25%] left-[10%]", delay: "0.6s", size: "w-5 h-5 md:w-6 md:h-6", animation: "floatVertical" },
  { Icon: Palette, position: "top-[28%] left-[30%]", delay: "0.9s", size: "w-5 h-5 md:w-6 md:h-6", animation: "floatWave" },
  { Icon: Mail, position: "top-[22%] left-[50%]", delay: "1.4s", size: "w-6 h-6 md:w-7 md:h-7", animation: "floatHorizontal" },
  { Icon: Settings, position: "top-[26%] left-[70%]", delay: "1.7s", size: "w-5 h-5 md:w-6 md:h-6", animation: "floatVertical" },
  { Icon: Headphones, position: "top-[24%] right-[5%]", delay: "0.7s", size: "w-6 h-6 md:w-7 md:h-7", animation: "floatDiagonal" },
  
  // Row 3 (45-65%)
  { Icon: TrendingUp, position: "top-[50%] left-[8%]", delay: "0.4s", size: "w-6 h-6 md:w-7 md:h-7", animation: "floatVertical" },
  { Icon: Users, position: "top-[48%] left-[25%]", delay: "1.9s", size: "w-5 h-5 md:w-6 md:h-6", animation: "floatCircle" },
  { Icon: Monitor, position: "top-[52%] left-[45%]", delay: "1.5s", size: "w-6 h-6 md:w-7 md:h-7", animation: "floatDiagonal" },
  { Icon: MessageSquare, position: "top-[47%] left-[65%]", delay: "2.0s", size: "w-5 h-5 md:w-6 md:h-6", animation: "floatVertical" },
  { Icon: Cloud, position: "top-[51%] left-[85%]", delay: "0.6s", size: "w-5 h-5 md:w-6 md:h-6", animation: "floatHorizontal" },
  
  // Row 4 (70-85%)
  { Icon: Database, position: "top-[75%] left-[12%]", delay: "1.4s", size: "w-6 h-6 md:w-7 md:h-7", animation: "floatHorizontal" },
  { Icon: CheckCircle, position: "top-[72%] left-[32%]", delay: "1.3s", size: "w-5 h-5 md:w-6 md:h-6", animation: "floatVertical" },
  { Icon: Target, position: "top-[78%] left-[52%]", delay: "1.9s", size: "w-5 h-5 md:w-6 md:h-6", animation: "floatCircle" },
  { Icon: RefreshCw, position: "top-[74%] left-[72%]", delay: "0.3s", size: "w-6 h-6 md:w-7 md:h-7", animation: "floatWave" },
  { Icon: Code, position: "top-[76%] right-[8%]", delay: "1.7s", size: "w-5 h-5 md:w-6 md:h-6", animation: "floatVertical" },
  
  // Row 5 - Bottom (88-95%)
  { Icon: Shield, position: "top-[90%] left-[15%]", delay: "0.5s", size: "w-5 h-5 md:w-6 md:h-6", animation: "floatCircle" },
  { Icon: Star, position: "top-[92%] left-[38%]", delay: "0.7s", size: "w-6 h-6 md:w-7 md:h-7", animation: "floatDiagonal" },
  { Icon: Zap, position: "top-[91%] left-[58%]", delay: "2.0s", size: "w-5 h-5 md:w-6 md:h-6", animation: "floatCircle" },
  { Icon: Lock, position: "top-[93%] left-[78%]", delay: "0.4s", size: "w-6 h-6 md:w-7 md:h-7", animation: "floatVertical" },
];

export function WebsiteFeatures() {
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });
  
  // Typing animation state
  const words = ["website", "webshop", "maatwerk"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const animationStartedRef = useRef(false);

  useEffect(() => {
    if (!isVisible || animationStartedRef.current) return;
    animationStartedRef.current = true;
    setDisplayText(words[0]);
  }, [isVisible]);

  useEffect(() => {
    if (!animationStartedRef.current) return;

    const currentWord = words[currentWordIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 200 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText === currentWord) {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), pauseTime);
        } else {
          setDisplayText(currentWord.substring(0, displayText.length + 1));
        }
      } else {
        if (displayText === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        } else {
          setDisplayText(currentWord.substring(0, displayText.length - 1));
        }
      }
    }, displayText === currentWord && !isDeleting ? pauseTime : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWordIndex]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 md:py-28 lg:py-32 bg-white overflow-hidden"
    >
      {/* Floating background icons */}
      <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
        {floatingIcons.map((item, index) => {
          const IconComponent = item.Icon;
          return (
            <div
              key={index}
              className={`absolute ${item.position} ${item.size} text-neutral-300/40`}
              style={{
                animation: `${item.animation} ${14 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: item.delay,
              }}
            >
              <IconComponent className="w-full h-full" />
            </div>
          );
        })}
      </div>

      {/* Decorative background elements */}
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
        <div className="absolute top-1/2 right-[5%] w-8 h-8 rounded-full border border-purple-200/30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8 z-10">
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
            Dit krijg je <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">standaard</span>
          </h2>
          <p 
            className="mt-5 text-[17px] md:text-[18px] leading-relaxed text-neutral-500"
            style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
          >
            Geen verborgen kosten. Al deze features zitten in elk pakket — en dat is veel.
          </p>
        </div>

        {/* Features grid */}
        <div 
          className={`relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-700 ease-out delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group p-6 rounded-2xl bg-[#f5f3ef] hover:bg-[#ebe8e2] transition-all duration-300 z-10"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-neutral-700" />
              </div>
              <h3 
                className="text-[17px] font-semibold text-neutral-900 mb-2"
                style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
              >
                {feature.title}
              </h3>
              <p className="text-[14px] leading-relaxed text-neutral-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
