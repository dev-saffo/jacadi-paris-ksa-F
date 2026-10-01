import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Shared UI component.
 * Pill-shaped (rounded-full), label-sm tracking.
 * Uses semantic tokens only — works in both light & dark modes.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.06em] uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-body",
  {
    variants: {
      variant: {
        // Primary filled — terracotta
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/85",
        // Muted sage secondary filled
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/85",
        // Destructive / error
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/85",
        // Outlined — card surface + micro border
        outline:
          "border border-border/60 bg-background/90 text-foreground",
        // Eco / organic certification — secondary tinted
        eco:
          "border-transparent bg-secondary/20 text-foreground",
        // Age milestone badges
        baby:   "border-transparent age-badge-baby",
        toddler:"border-transparent age-badge-toddler",
        kids:   "border-transparent age-badge-kids",
        tweens: "border-transparent age-badge-tweens",
        // Product status badges
        new:        "border-transparent bg-secondary/25 text-foreground",
        bestseller: "border-transparent bg-primary text-primary-foreground",
        sale:       "border-transparent bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };
