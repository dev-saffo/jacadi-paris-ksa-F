import { useState } from 'react';
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
  const currentIndex = images.length === 0 ? 0 : selectedIndex % images.length;
  const selectedImage = images[currentIndex];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square bg-muted rounded overflow-hidden group">
        <CatalogImage
          src={selectedImage}
          alt={`${productTitle} - Image ${currentIndex + 1}`}
          className={cn(
            "h-full w-full object-cover transition-transform duration-500",
            selectedImage && isZoomed && "scale-150 cursor-zoom-out",
          )}
        />

        {/* Zoom indicator */}
        {images.length > 0 && (
          <button
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
            onClick={() => setIsZoomed(!isZoomed)}
            aria-label="Zoom image"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
        )}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-background/80 backdrop-blur-sm text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "flex-shrink-0 h-20 w-20 rounded overflow-hidden border-2 transition-all",
                selectedIndex === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-muted-foreground/30"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${productTitle} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
