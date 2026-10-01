import "./_group.css";
import { CatalogPhoto, formatMoney, product } from "./shared";

export function CurrentProductCard() {
  const alternateImage = product.images[1];

  return (
    <main className="source-stage">
      <a
        className="source-card"
        href="#"
        onClick={(event) => event.preventDefault()}
        aria-label={`View ${product.title}`}
      >
        <div className="source-media">
          <CatalogPhoto
            src={product.images[0]}
            alt={product.title}
            className="source-main-image"
            loading="eager"
          />
          {alternateImage && (
            <CatalogPhoto
              src={alternateImage}
              alt=""
              aria-hidden="true"
              className="source-alt-image"
              loading="eager"
            />
          )}
          {product.images.length > 1 && (
            <span className="source-photo-count">
              {product.images.length} photos
            </span>
          )}
        </div>
        <div className="source-copy">
          <span className="source-category">{product.categoryName}</span>
          <h2 className="source-title">{product.title}</h2>
          <p className="source-sizes">Sizes: {product.sizes.join(", ")}</p>
          <span className="source-price">
            {formatMoney(product.price, product.currency)}
          </span>
        </div>
      </a>
    </main>
  );
}