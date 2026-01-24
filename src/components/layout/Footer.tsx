import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from "lucide-react";

const footerLinks = {
  producten: [
    { name: "Websites", href: "/websites" },
    { name: "Webshops", href: "/webshops" },
    { name: "Domeinen", href: "/domeinen" },
    { name: "E-mail", href: "/mail" },
    { name: "Maatwerk", href: "/maatwerk" },
  ],
  diensten: [
    { name: "Dronefotografie", href: "/eenmalig" },
    { name: "Videografie", href: "/eenmalig" },
    { name: "Logo-ontwerp", href: "/eenmalig" },
    { name: "Prijzen", href: "/prijzen" },
  ],
  resources: [
    { name: "Kennisbank", href: "/kennisbank" },
    { name: "Website Analyzer", href: "/website-analyzer" },
    { name: "Over ons", href: "/over-ons" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Algemene voorwaarden", href: "/voorwaarden" },
    { name: "Privacybeleid", href: "/privacy" },
    { name: "Cookiebeleid", href: "/cookies" },
  ],
};

const socialLinks = [
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "Instagram", href: "https://instagram.com", icon: Instagram },
];

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20">
        {/* Main footer grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-block group"
            >
              <span 
                className="text-2xl font-bold tracking-tight text-white group-hover:text-[#d4a574] transition-colors duration-300"
                style={{ 
                  fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif',
                  letterSpacing: '-0.02em',
                }}
              >
                WEBSTABILITY
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-[15px] leading-[24px] text-neutral-400">
              Professionele websites en webshops op abonnement. Van domein tot
              analytics, wij regelen het allemaal.
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <a
                href="mailto:info@webstability.nl"
                className="flex items-center gap-2 text-[14px] leading-[20px] text-neutral-400 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4" />
                info@webstability.nl
              </a>
              <a
                href="tel:+31612345678"
                className="flex items-center gap-2 text-[14px] leading-[20px] text-neutral-400 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4" />
                +31 6 12 34 56 78
              </a>
              <p className="flex items-center gap-2 text-[14px] leading-[20px] text-neutral-400">
                <MapPin className="h-4 w-4" />
                Nederland
              </p>
            </div>

            {/* Social links */}
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Producten */}
          <div>
            <h3 
              className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400"
              style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
            >
              Producten
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.producten.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[14px] leading-[20px] text-neutral-300 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Diensten */}
          <div>
            <h3 
              className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400"
              style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
            >
              Diensten
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.diensten.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[14px] leading-[20px] text-neutral-300 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 
              className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400"
              style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
            >
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[14px] leading-[20px] text-neutral-300 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-neutral-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright */}
            <p className="text-[13px] leading-[18px] text-neutral-500">
              © {new Date().getFullYear()} Webstability. Alle rechten
              voorbehouden.
            </p>

            {/* Legal links */}
            <div className="flex flex-wrap items-center gap-4">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[13px] leading-[18px] text-neutral-500 transition-colors hover:text-neutral-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mollie badge */}
            <div className="flex items-center gap-2 text-[13px] leading-[18px] text-neutral-500">
              <span>Betalingen via</span>
              <span 
                className="font-medium text-neutral-400"
                style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
              >
                Mollie
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
