# Template Carousel - Gebruiksinstructies

## Bestanden om te kopiëren naar je Spanje project

### 1. Kopieer de component
Kopieer dit bestand naar je Spanje project:
```
/Users/laurens/Desktop/webstability/src/components/shared/TemplateCarousel.tsx
→ naar je Spanje project: src/components/shared/TemplateCarousel.tsx
```

### 2. Installeer dependencies (indien nodig)
Zorg dat je deze packages hebt in je Spanje project:
```bash
npm install lucide-react
```

### 3. Gebruik in je Spanje project

#### Optie A: Simpel gebruik (zelfde data als Webstability)
```tsx
import { TemplateCarousel } from '@/components/shared/TemplateCarousel';

// Maak een projects array met deze IDs (moet overeenkomen met de templates)
const projects = [
  { id: "velvet-bistro", title: "Velvet Bistro" },
  { id: "neon-studio", title: "BRŪT Coffee" },
  { id: "urban-apparel", title: "Urban Apparel" },
  { id: "iron-athletics", title: "Iron Athletics" },
  { id: "vanderberg-advocaten", title: "Van der Berg" },
  { id: "artisan-bakery", title: "De Korenschuur" },
  { id: "daan-buurs-photography", title: "Daan Buurs" },
  { id: "mode-atelier", title: "Maison Élise" },
];

// In je component
export function MySection() {
  return (
    <section className="py-16 bg-[#f5f3ef] overflow-hidden">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Onze Portfolio
        </h2>
      </div>
      
      {/* Full-width carousel */}
      <TemplateCarousel projects={projects} />
    </section>
  );
}
```

#### Optie B: Met pause state tracking
```tsx
import { TemplateCarousel } from '@/components/shared/TemplateCarousel';
import { useState } from 'react';

export function MySection() {
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  
  const projects = [
    { id: "velvet-bistro", title: "Velvet Bistro" },
    { id: "neon-studio", title: "BRŪT Coffee" },
    { id: "urban-apparel", title: "Urban Apparel" },
    { id: "iron-athletics", title: "Iron Athletics" },
    { id: "vanderberg-advocaten", title: "Van der Berg" },
    { id: "artisan-bakery", title: "De Korenschuur" },
    { id: "daan-buurs-photography", title: "Daan Buurs" },
    { id: "mode-atelier", title: "Maison Élise" },
  ];

  return (
    <section className="py-16 bg-[#f5f3ef] overflow-hidden">
      <TemplateCarousel 
        projects={projects}
        onPauseChange={setIsCarouselPaused}
      />
      
      {isCarouselPaused && (
        <p className="text-center mt-4 text-sm text-neutral-400">
          Pauzeer met muis over de carousel
        </p>
      )}
    </section>
  );
}
```

## Aanpassingen

### Snelheid aanpassen
In TemplateCarousel.tsx, regel met `animation`:
```tsx
animation: 'scroll 40s linear infinite'  // 40s = langzamer, 20s = sneller
```

### Kaartgrootte aanpassen
In TemplateCarousel.tsx:
```tsx
className="flex-shrink-0 w-[280px] sm:w-[320px]"
// Verander 280px en 320px naar gewenste breedte
```

### Afstand tussen kaarten
In TemplateCarousel.tsx:
```tsx
className="flex gap-6"  // gap-6 = 1.5rem, verander naar gap-4, gap-8, etc.
```

### Achtergrondkleur aanpassen
```tsx
<section className="py-16 bg-[#f5f3ef]">  // Verander naar jouw gewenste kleur
```

## Type definitie voor TypeScript
```tsx
export interface Project {
	id: string;        // Moet een van de template IDs zijn
	title: string;     // Optioneel, wordt niet getoond maar handig voor debugging
	image?: string;    // Niet gebruikt door TemplateCarousel, maar handig als fallback
}
```

## Beschikbare template IDs
- `velvet-bistro` - Restaurant (oranje/rood theme)
- `neon-studio` - Coffee shop (goud/bruin theme)
- `urban-apparel` - Fashion webshop (minimalistisch)
- `iron-athletics` - Gym (rood/zwart theme)
- `vanderberg-advocaten` - Law firm (goud/dark theme)
- `artisan-bakery` - Bakkerij (warm bruin theme)
- `daan-buurs-photography` - Fotografie portfolio (dark)
- `mode-atelier` - Fashion designer (elegant beige)

## Styling vereisten
Zorg ervoor dat je project Tailwind CSS heeft geconfigureerd met deze kleuren:
- `neutral-100` tot `neutral-900`
- `red-400`, `yellow-400`, `green-400` (voor browser chrome)

## Vragen?
De component is volledig zelfstandig en bevat alle template designs inline.
Geen externe afhankelijkheden behalve lucide-react voor icons.
