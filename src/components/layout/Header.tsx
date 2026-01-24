"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { MobileMenu } from "./MobileMenu";
import { MegaMenu } from "./MegaMenu";
import {
  Menu,
  Search,
  Globe,
  ShoppingCart,
  Mail,
  Camera,
  Wrench,
  BarChart3,
  BookOpen,
  HelpCircle,
  Users,
} from "lucide-react";

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date('2026-02-01T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-mono">
        {String(timeLeft.days).padStart(2, '0')}d{' '}
        {String(timeLeft.hours).padStart(2, '0')}u{' '}
        {String(timeLeft.minutes).padStart(2, '0')}m{' '}
        {String(timeLeft.seconds).padStart(2, '0')}s
      </span>
    </span>
  );
}

const navigation = {
  producten: {
    items: [
      {
        name: "Websites",
        description: "Professionele websites op abonnement",
        href: "/websites",
        icon: Globe,
      },
      {
        name: "Webshops",
        description: "E-commerce oplossingen die converteren",
        href: "/webshops",
        icon: ShoppingCart,
      },
      {
        name: "Domeinen",
        description: "Registreer je perfecte domeinnaam",
        href: "/domeinen",
        icon: Search,
      },
      {
        name: "Mail",
        description: "Professionele e-mail op eigen domein",
        href: "/mail",
        icon: Mail,
      },
    ],
    title: "Producten",
    featured: {
      label: "Nieuw",
      title: "Websites vanaf €65/maand",
      description: "All-inclusive websites zonder gedoe.",
      image: "/images/featured-website.svg",
      href: "/websites",
      ctaText: "Meer informatie",
    },
  },
  diensten: {
    items: [
      {
        name: "Dronefotografie",
        description: "Adembenemende luchtfoto's",
        href: "/eenmalig",
        icon: Camera,
      },
      {
        name: "Maatwerk",
        description: "Custom development oplossingen",
        href: "/maatwerk",
        icon: Wrench,
      },
    ],
    title: "Diensten",
    featured: {
      label: "Diensten",
      title: "Professionele drone opnames",
      description: "Unieke beelden vanuit de lucht voor je bedrijf.",
      image: "/images/drone.svg",
      href: "/eenmalig",
      ctaText: "Bekijk diensten",
    },
  },
  resources: {
    items: [
      {
        name: "Kennisbank",
        description: "Tips en artikelen voor ondernemers",
        href: "/kennisbank",
        icon: BookOpen,
      },
      {
        name: "Website Analyzer",
        description: "Analyseer elke website gratis",
        href: "/website-analyzer",
        icon: BarChart3,
      },
      {
        name: "FAQ",
        description: "Veelgestelde vragen",
        href: "/contact#faq",
        icon: HelpCircle,
      },
      {
        name: "Over ons",
        description: "Leer ons team kennen",
        href: "/over-ons",
        icon: Users,
      },
    ],
    title: "Resources",
    featured: {
      label: "Kennisbank",
      title: "Groei je online business",
      description: "Tips, handleidingen en tools voor ondernemers.",
      image: "/images/resources.svg",
      href: "/kennisbank",
      ctaText: "Bekijk kennisbank",
    },
  },
};

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMenuEnter = (menu: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveMenu(menu);
  };

  const handleMenuLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Promo banner */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-neutral-900 text-white h-10">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="font-medium">
              🎉 Nu 50% korting op de complete eenmalige kosten
            </span>
            <span className="text-neutral-400">|</span>
            <CountdownTimer />
          </div>
        </div>
      </div>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:rounded-lg focus:shadow-lg"
      >
        Ga naar inhoud
      </a>
      <header
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white shadow-sm"
            : "bg-transparent"
        )}
        style={{ top: '40px' }}
      >
        <nav
          className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 md:h-24 md:px-6 lg:px-8"
          aria-label="Hoofdnavigatie"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center"
          >
            <span 
              className="text-[1.625rem] font-bold tracking-tight md:text-[1.875rem] text-neutral-900"
              style={{ 
                fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              Webstability
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => handleMenuEnter("producten")}
              onMouseLeave={handleMenuLeave}
            >
              <button 
                className="flex items-center gap-1 rounded-lg px-5 py-2.5 text-[17px] font-medium tracking-[-0.01em] transition-colors text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
              >
                Producten
              </button>
              {activeMenu === "producten" && (
                <MegaMenu
                  items={navigation.producten.items}
                  title={navigation.producten.title}
                  featured={navigation.producten.featured}
                  onClose={handleMenuLeave}
                  onMouseEnter={() => handleMenuEnter("producten")}
                />
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleMenuEnter("diensten")}
              onMouseLeave={handleMenuLeave}
            >
              <button 
                className="flex items-center gap-1 rounded-lg px-5 py-2.5 text-[17px] font-medium tracking-[-0.01em] transition-colors text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
              >
                Diensten
              </button>
              {activeMenu === "diensten" && (
                <MegaMenu
                  items={navigation.diensten.items}
                  title={navigation.diensten.title}
                  featured={navigation.diensten.featured}
                  onClose={handleMenuLeave}
                  onMouseEnter={() => handleMenuEnter("diensten")}
                />
              )}
            </div>

            <Link
              href="/prijzen"
              className="rounded-lg px-5 py-2.5 text-[17px] font-medium tracking-[-0.01em] transition-colors text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
              style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
            >
              Prijzen
            </Link>

            <div
              className="relative"
              onMouseEnter={() => handleMenuEnter("resources")}
              onMouseLeave={handleMenuLeave}
            >
              <button 
                className="flex items-center gap-1 rounded-lg px-5 py-2.5 text-[17px] font-medium tracking-[-0.01em] transition-colors text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
              >
                Resources
              </button>
              {activeMenu === "resources" && (
                <MegaMenu
                  items={navigation.resources.items}
                  title={navigation.resources.title}
                  featured={navigation.resources.featured}
                  onClose={handleMenuLeave}
                  onMouseEnter={() => handleMenuEnter("resources")}
                />
              )}
            </div>

            <Link
              href="/contact"
              className="rounded-lg px-5 py-2.5 text-[17px] font-medium tracking-[-0.01em] transition-colors text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
              style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
            >
              Contact
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/inloggen">
              <Button
                variant="ghost"
                size="md"
                className="text-[16px] px-5 py-2.5"
              >
                Log in
              </Button>
            </Link>
            <Link href="/start">
              <Button 
                size="md"
                className="text-[16px] px-5 py-2.5"
              >
                Start project
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-2 transition-colors lg:hidden text-neutral-700 hover:bg-neutral-100"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navigation={navigation}
      />
    </>
  );
}
