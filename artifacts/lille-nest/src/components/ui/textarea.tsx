import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Shared UI component.
 * Matches input styling exactly — same tokens, same visual language.
 * bg-card / border-input / focus → primary ring (both modes).
 */
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-lg border border-input bg-card",
          "px-4 py-3 text-[15px] font-body text-foreground leading-6",
          "placeholder:text-muted-foreground",
          "transition-colors duration-200 resize-y",
          "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ring/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
