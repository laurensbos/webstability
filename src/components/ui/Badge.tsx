import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-[-0.01em] transition-colors",
  {
    variants: {
      variant: {
        default: "bg-neutral-900 text-white",
        secondary: "bg-neutral-100 text-neutral-700",
        outline: "border border-neutral-300 text-neutral-700",
        success: "bg-green-100 text-green-800",
        warning: "bg-amber-100 text-amber-800",
        error: "bg-red-100 text-red-800",
        accent: "bg-accent text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span 
      className={cn(badgeVariants({ variant }), className)} 
      style={{ fontFamily: 'var(--font-inter-tight), "Inter Tight", Inter, system-ui, sans-serif' }}
      {...props} 
    />
  );
}

export { Badge, badgeVariants };
