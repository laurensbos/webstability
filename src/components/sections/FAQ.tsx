"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "Wat zit er precies in het abonnement?",
    answer:
      "Elk abonnement bevat design, development, hosting, SSL-certificaat, dashboard toegang, en support. Afhankelijk van je pakket krijg je ook extra revisies, SEO-optimalisatie, en prioriteit support.",
  },
  {
    question: "Wat is de minimale looptijd?",
    answer:
      "De minimale looptijd is 3 maanden. Daarna is het abonnement maandelijks opzegbaar. Dit geeft ons de tijd om een kwalitatief product te leveren en jou de flexibiliteit om na de eerste periode te evalueren.",
  },
  {
    question: "Hoe snel kan mijn website live zijn?",
    answer:
      "Gemiddeld gaat een website binnen 2-4 weken live. Dit hangt af van de complexiteit van je project en hoe snel je content kunt aanleveren.",
  },
  {
    question: "Kan ik mijn bestaande domein gebruiken?",
    answer:
      "Ja, je kunt je bestaande domein gebruiken. Wij helpen je met de DNS-configuratie om je domein naar je nieuwe website te verwijzen. Dit is bij elk pakket inbegrepen.",
  },
  {
    question: "Wat gebeurt er als ik opzeg?",
    answer:
      "Als je opzegt, krijg je de mogelijkheid om je website over te nemen. We leveren alle bestanden en helpen bij de migratie. Je bent altijd eigenaar van je content en design.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-neutral-200/60">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors group"
        aria-expanded={isOpen}
      >
        <span 
          className="text-[16px] leading-[22px] font-medium tracking-[-0.01em] text-neutral-900 group-hover:text-neutral-600 transition-colors pr-8 md:text-[17px]"
          style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
        >
          {question}
        </span>
        <Plus
          className={cn(
            "h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-200",
            isOpen && "rotate-45"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="text-[15px] leading-[24px] text-neutral-500 pr-12">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  return (
    <section 
      className="bg-[#f5f3ef] pt-16 pb-16 md:pt-20 md:pb-20 lg:pt-24 lg:pb-24 relative"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          {/* Left side - Title */}
          <div className="relative">
            <h2 
              className="text-[32px] leading-[1.1] font-semibold tracking-[-0.02em] text-neutral-900 md:text-[40px] lg:text-[48px]"
              style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
            >
              Frequently asked
              <br />
              questions
            </h2>
          </div>

          {/* Right side - FAQ Items */}
          <div>
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
