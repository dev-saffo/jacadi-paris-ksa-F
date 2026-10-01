import {
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from "react";
import "./_group.css";
import { CatalogPhoto, product } from "./shared";

export function RefinedProductGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const currentIndex =
    product.images.length === 0 ? 0 : selectedIndex % product.images.length;

  const selectImage = (index: number) => {
    setSelectedIndex(index);
    setZoomed(false);
  };
  const previous = () => {
    selectImage(
      currentIndex === 0 ? product.images.length - 1 : currentIndex - 1,
    );
  };
  const next = () => {
    selectImage(
      currentIndex === product.images.length - 1 ? 0 : currentIndex + 1,
    );
  };
  const handleTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (startX == null || endX == null || zoomed) return;
    const distance = endX - startX;
    if (Math.abs(distance) < 48) return;
    if (distance < 0) next();
    else previous();
  };

  return (
    <main className="refined-stage">
      <section className="gallery-refined" aria-label={`${product.title} photos`}>
        <div
          className="gallery-main touch-pan-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          role="group"
          aria-roledescription="carousel"
          aria-label={`${product.title} photos`}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              previous();
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              next();
            }
          }}
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={handleTouchEnd}
        >
          <CatalogPhoto
            src={product.images[currentIndex]}
            alt={`${product.title}, photo ${currentIndex + 1} of ${product.images.length}`}
            className={zoomed ? "zoomed" : ""}
            loading="eager"
            onClick={() => setZoomed((value) => !value)}
          />
          {product.images.length > 1 && (
            <>
              <button
                className="refined-arrow previous"
                onClick={previous}
                aria-label="Show previous product photo"
              >
                <span aria-hidden="true">‹</span>
              </button>
              <button
                className="refined-arrow next"
                onClick={next}
                aria-label="Show next product photo"
              >
                <span aria-hidden="true">›</span>
              </button>
              <span className="image-counter" aria-live="polite">
                {String(currentIndex + 1).padStart(2, "0")} /{" "}
                {String(product.images.length).padStart(2, "0")}
              </span>
            </>
          )}
          <button
            className="refined-zoom"
            onClick={() => setZoomed((value) => !value)}
            aria-label={zoomed ? "Zoom out" : "Zoom in"}
          >
            <span aria-hidden="true">{zoomed ? "−" : "+"}</span>
          </button>
        </div>
        {product.images.length > 1 && (
          <div
            className="refined-thumbnails"
            role="group"
            aria-label="Choose a product photo"
          >
            {product.images.map((image, index) => (
              <button
                key={image}
                onClick={() => selectImage(index)}
                className={`refined-thumbnail ${currentIndex === index ? "selected" : ""}`}
                aria-label={`Show product photo ${index + 1} of ${product.images.length}`}
                aria-pressed={currentIndex === index}
              >
                <CatalogPhoto
                  src={image}
                  alt=""
                  aria-hidden="true"
                  loading="eager"
                />
              </button>
            ))}
          </div>
        )}
        <p className="gallery-hint">
          {product.images.length} product photos · Select a thumbnail to view
        </p>
      </section>
    </main>
  );
}