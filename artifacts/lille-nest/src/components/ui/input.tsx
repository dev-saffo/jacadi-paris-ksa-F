import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Shared UI component.
 * bg-card   = linen (#F5F1EA light / dark surface dark)
 * border-input = --input token (adapts per mode)
 * focus → ring-primary with reduced opacity
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-input bg-card",
          "px-4 py-2.5 text-[15px] font-body text-foreground",
          "placeholder:text-muted-foreground",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ring/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
