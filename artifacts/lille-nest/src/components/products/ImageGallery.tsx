import {
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type TouchEvent as ReactTouchEvent,
} from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CatalogImage } from '@/components/products/CatalogImage';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  productTitle: string;
}

export function ImageGallery({ images, productTitle }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const currentIndex = images.length === 0 ? 0 : selectedIndex % images.length;
  const selectedImage = images[currentIndex];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsZoomed(false);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsZoomed(false);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handlePrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      handleNext();
    }
  };

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;

    if (startX == null || endX == null || isZoomed || images.length < 2) return;
    const distance = endX - startX;
    if (Math.abs(distance) < 48) return;
    if (distance < 0) handleNext();
    else handlePrevious();
  };

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div
        className="group relative aspect-square overflow-hidden rounded border border-border/70 bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary touch-pan-y"
        role="group"
        aria-roledescription="carousel"
        aria-label={`${productTitle} photos`}
        tabIndex={images.length > 1 ? 0 : undefined}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <CatalogImage
          src={selectedImage}
          alt={`${productTitle} - photo ${currentIndex + 1} of ${images.length}`}
          loading="eager"
          fetchPriority="high"
          className={cn(
            "h-full w-full object-contain p-2 transition-transform duration-500 sm:p-4",
            selectedImage && isZoomed && "scale-150 cursor-zoom-out",
            selectedImage && !isZoomed && "cursor-zoom-in",
          )}
          onClick={() => selectedImage && setIsZoomed((value) => !value)}
        />

        {images.length > 0 && (
          <button
            type="button"
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/90 shadow-sm backdrop-blur-sm transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setIsZoomed((value) => !value)}
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            data-testid="button-toggle-image-zoom"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
        )}

        {images.length > 1 && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute left-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border border-border/70 bg-background/90 shadow-sm backdrop-blur-sm transition hover:bg-background"
              onClick={handlePrevious}
              aria-label="Previous image"
              data-testid="button-previous-product-image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border border-border/70 bg-background/90 shadow-sm backdrop-blur-sm transition hover:bg-background"
              onClick={handleNext}
              aria-label="Next image"
              data-testid="button-next-product-image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {images.length > 1 && (
          <span
            className="absolute bottom-3 left-3 rounded-full border border-white/80 bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm"
            aria-live="polite"
            data-testid="text-product-image-position"
          >
            Photo {currentIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div
          className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-2"
          role="group"
          aria-label={`${productTitle} photos`}
        >
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => {
                setSelectedIndex(index);
                setIsZoomed(false);
              }}
              className={cn(
                "h-20 w-20 flex-shrink-0 snap-start overflow-hidden rounded border bg-secondary/50 p-1.5 transition-all sm:h-24 sm:w-24",
                selectedIndex === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border/60 hover:border-primary/50",
              )}
              aria-label={`View image ${index + 1}`}
              aria-pressed={selectedIndex === index}
              data-testid={`button-product-thumbnail-${index + 1}`}
            >
              <CatalogImage
                src={image}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain"
                showFallbackLabel={false}
              />
            </button>
          ))}
        </div>
      )}
      {images.length > 1 && (
        <p className="text-xs text-muted-foreground">
          {images.length} product photos · Select a thumbnail to view
        </p>
      )}
    </div>
  );
}
