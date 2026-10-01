import { useState } from "react";
import "./_group.css";
import { CatalogPhoto, product } from "./shared";

export function CurrentProductGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const currentIndex =
    product.images.length === 0 ? 0 : selectedIndex % product.images.length;
  const selectedImage = product.images[currentIndex];

  const previous = () => {
    setSelectedIndex((index) =>
      index === 0 ? product.images.length - 1 : index - 1,
    );
  };
  const next = () => {
    setSelectedIndex((index) =>
      index === product.images.length - 1 ? 0 : index + 1,
    );
  };

  return (
    <main className="source-stage">
      <div className="gallery-current">
        <div className="gallery-main">
          <CatalogPhoto
            src={selectedImage}
            alt={`${product.title} - Image ${currentIndex + 1}`}
            loading="eager"
            style={zoomed ? { transform: "scale(1.5)" } : undefined}
          />
          <button
            className="current-zoom"
            onClick={() => setZoomed((value) => !value)}
            aria-label={zoomed ? "Zoom out" : "Zoom image"}
          >
            +
          </button>
          {product.images.length > 1 && (
            <>
              <button
                className="current-arrow previous"
                onClick={previous}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                className="current-arrow next"
                onClick={next}
                aria-label="Next image"
              >
                ›
              </button>
              <span className="image-counter">
                Photo {currentIndex + 1} / {product.images.length}
              </span>
            </>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="current-thumbnails" aria-label="Product images">
            {product.images.map((image, index) => (
              <button
                key={image}
                onClick={() => setSelectedIndex(index)}
                className={`current-thumbnail ${selectedIndex === index ? "selected" : ""}`}
                aria-label={`View image ${index + 1}`}
              >
                <CatalogPhoto
                  src={image}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  loading="eager"
                />
              </button>
            ))}
          </div>
        )}
        {product.images.length > 1 && (
          <p className="gallery-hint">
            {product.images.length} product photos · Select a thumbnail to view
          </p>
        )}
      </div>
    </main>
  );
}