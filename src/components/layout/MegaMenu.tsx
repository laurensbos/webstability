"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MegaMenuItem {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

interface FeaturedItem {
  label: string;
  title: string;
  description: string;
  image: string;
  href: string;
  ctaText: string;
}

interface MegaMenuProps {
  items: MegaMenuItem[];
  title?: string;
  featured?: FeaturedItem;
  onClose: () => void;
  onMouseEnter?: () => void;
}

export function MegaMenu({ items, title, featured, onClose, onMouseEnter }: MegaMenuProps) {
  const hasFeature = !!featured;
  
  return (
    <div
      className="absolute left-1/2 top-full -translate-x-1/2 animate-slide-in-down pt-2"
      onMouseLeave={onClose}
      onMouseEnter={onMouseEnter}
    >
      <div className={cn(
        "rounded-xl border border-neutral-100 bg-white shadow-lg",
        hasFeature ? "w-[580px] flex" : "w-80 p-2"
      )}>
        {/* Menu Items */}
        <div className={cn(hasFeature ? "flex-1 p-2" : "")}>
          {title && (
            <div 
              className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400"
              style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
            >
              {title}
            </div>
          )}
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-neutral-50"
                onClick={onClose}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div 
                    className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900"
                    style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                  >
                    {item.name}
                  </div>
                  <div className="mt-0.5 text-[13px] leading-[18px] text-neutral-500">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Featured Section */}
        {featured && (
          <div className="w-[220px] border-l border-neutral-100 bg-neutral-50/50 p-4 rounded-r-xl">
            <div 
              className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-3"
              style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
            >
              Uitgelicht
            </div>
            <Link 
              href={featured.href}
              className="block group"
              onClick={onClose}
            >
              <div className="rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 p-4 text-white mb-3">
                <div 
                  className="text-[10px] font-semibold uppercase tracking-wider text-white/70 mb-1"
                  style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                >
                  {featured.label}
                </div>
                <div 
                  className="text-[15px] font-semibold tracking-[-0.01em] leading-tight"
                  style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
                >
                  {featured.title}
                </div>
                <div className="relative h-16 mt-3 rounded overflow-hidden">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-[12px] leading-[16px] text-white/80 mt-2">
                  {featured.description}
                </p>
              </div>
              <div 
                className="flex items-center gap-1 text-[14px] font-medium tracking-[-0.01em] text-neutral-700 group-hover:text-neutral-900 transition-colors"
                style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
              >
                {featured.ctaText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
