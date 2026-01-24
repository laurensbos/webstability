"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border-b border-neutral-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left font-medium text-neutral-900 transition-colors hover:text-neutral-600"
        aria-expanded={isOpen}
      >
        <span 
          className="text-[16px] leading-[20px] font-semibold tracking-[-0.01em] text-[rgb(43,44,44)] md:text-[18px] md:leading-[22px]"
          style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
        >
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200 ease-out",
          isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="text-neutral-600">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ children, className }: AccordionProps) {
  return (
    <div className={cn("divide-y divide-neutral-200", className)}>
      {children}
    </div>
  );
}
