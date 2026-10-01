import { cn } from "@/lib/utils";

/**
 * Shared UI component.
 * bg-muted — semantic token, warm linen in light / dark charcoal in dark.
 * rounded-xl matches Stitch card radius.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
