"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { X, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

interface NavSection {
  items: NavItem[];
  title: string;
  featured?: {
    label: string;
    title: string;
    description: string;
    image: string;
    href: string;
    ctaText: string;
  };
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: {
    producten: NavSection;
    diensten: NavSection;
    resources: NavSection;
  };
}

export function MobileMenu({ isOpen, onClose, navigation }: MobileMenuProps) {
  const [openSection, setOpenSection] = React.useState<string | null>(null);

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const renderNavItems = (items: NavItem[]) => (
    <div className="space-y-1 pl-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <Icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
      />

      {/* Menu panel */}
      <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white animate-slide-in-right shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
            <span 
              className="text-lg font-bold text-[rgb(43,44,44)]"
              style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
            >
              Menu
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              aria-label="Sluit menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <div className="space-y-2">
              {/* Producten */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection("producten")}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[15px] font-medium tracking-[-0.01em] text-neutral-900 hover:bg-neutral-100"
                  style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                >
                  <span>Producten</span>
                  <ChevronRight
                    className={cn(
                      "h-5 w-5 text-neutral-400 transition-transform",
                      openSection === "producten" && "rotate-90"
                    )}
                  />
                </button>
                {openSection === "producten" && renderNavItems(navigation.producten.items)}
              </div>

              {/* Diensten */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection("diensten")}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[15px] font-medium tracking-[-0.01em] text-neutral-900 hover:bg-neutral-100"
                  style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                >
                  <span>Diensten</span>
                  <ChevronRight
                    className={cn(
                      "h-5 w-5 text-neutral-400 transition-transform",
                      openSection === "diensten" && "rotate-90"
                    )}
                  />
                </button>
                {openSection === "diensten" && renderNavItems(navigation.diensten.items)}
              </div>

              {/* Direct links */}
              <Link
                href="/prijzen"
                onClick={onClose}
                className="flex items-center rounded-lg px-3 py-2.5 text-[15px] font-medium tracking-[-0.01em] text-neutral-900 hover:bg-neutral-100"
                style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
              >
                Prijzen
              </Link>

              {/* Resources */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection("resources")}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[15px] font-medium tracking-[-0.01em] text-neutral-900 hover:bg-neutral-100"
                  style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                >
                  <span>Resources</span>
                  <ChevronRight
                    className={cn(
                      "h-5 w-5 text-neutral-400 transition-transform",
                      openSection === "resources" && "rotate-90"
                    )}
                  />
                </button>
                {openSection === "resources" && renderNavItems(navigation.resources.items)}
              </div>

              <Link
                href="/contact"
                onClick={onClose}
                className="flex items-center rounded-lg px-3 py-2.5 text-[15px] font-medium tracking-[-0.01em] text-neutral-900 hover:bg-neutral-100"
                style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
              >
                Contact
              </Link>
            </div>
          </nav>

          {/* Footer CTA's */}
          <div className="border-t border-neutral-200 p-4 space-y-3">
            <Link href="/start" onClick={onClose}>
              <Button className="w-full" size="lg">
                Start project
              </Button>
            </Link>
            <Link href="/inloggen" onClick={onClose}>
              <Button variant="secondary" className="w-full" size="lg">
                Inloggen
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
