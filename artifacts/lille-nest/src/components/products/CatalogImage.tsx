import { ImageOff } from "lucide-react";
import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CatalogImageProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    "src" | "alt" | "className" | "onError"
  > {
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  showFallbackLabel?: boolean;
}

export function CatalogImage({
  src,
  alt,
  className,
  fallbackClassName,
  showFallbackLabel = true,
  loading = "lazy",
  decoding = "async",
  ...imageProps
}: CatalogImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);

  if (src && failedSource !== src) {
    return (
      <img
        {...imageProps}
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        onError={() => setFailedSource(src)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${alt} — image unavailable`}
      className={cn(
        "flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-muted via-background to-secondary/20",
        className,
        fallbackClassName,
      )}
    >
      <div className="flex flex-col items-center gap-2 px-3 text-center text-muted-foreground">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background/75 text-primary/70 shadow-soft">
          <ImageOff className="h-5 w-5" aria-hidden="true" />
        </span>
        {showFallbackLabel && (
          <span className="text-[10px] font-medium uppercase tracking-[0.16em]">
            Image unavailable
          </span>
        )}
      </div>
    </div>
  );
}