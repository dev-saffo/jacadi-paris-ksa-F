import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Shared UI component.
 * Uses semantic Tailwind tokens (bg-primary, bg-card, border-border, etc.)
 * so both light and dark modes work with proper contrast.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold font-body tracking-wide ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary pill — terracotta fill, white text
        default:
          "rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-px active:translate-y-0 shadow-soft",
        // Destructive — pill-shaped
        destructive:
          "rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Secondary outlined pill — muted border, fills with card surface on hover
        outline:
          "rounded-full border border-border bg-transparent text-foreground hover:bg-card hover:border-border/80",
        // Muted sage secondary fill
        secondary:
          "rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:-translate-y-px active:translate-y-0",
        // Ghost — fills with muted on hover
        ghost: "rounded-md hover:bg-muted hover:text-foreground",
        // Text link — editorial underline, primary color hover
        link: "rounded-none text-primary underline-offset-[3px] hover:underline decoration-1 hover:text-primary/80",
        // Hero CTA — primary fill, elevated hover shadow
        hero: "rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 text-base px-8 py-3.5 shadow-hover",
        // Soft tinted background variant
        soft: "rounded-full bg-primary/10 text-primary hover:bg-primary/20",
        // Cart add-to-bag style — secondary surface
        cart: "rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:-translate-y-px active:translate-y-0 shadow-soft",
      },
      size: {
        default: "h-11 px-7 py-2",
        sm: "h-9 px-5 text-xs",
        lg: "h-12 px-9 text-base",
        xl: "h-14 px-11 text-lg",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
