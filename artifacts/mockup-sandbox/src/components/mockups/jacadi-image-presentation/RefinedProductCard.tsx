import "./_group.css";
import { CatalogPhoto, formatMoney, product } from "./shared";

export function RefinedProductCard() {
  const alternateImage = product.images[1];

  return (
    <main className="refined-stage">
      <a
        className="refined-card"
        href="#"
        onClick={(event) => event.preventDefault()}
        aria-label={`View ${product.title}. ${product.images.length} product photos.`}
      >
        <div className="refined-media">
          <CatalogPhoto
            src={product.images[0]}
            alt={product.title}
            className="refined-main-image"
            loading="eager"
          />
          {alternateImage && (
            <CatalogPhoto
              src={alternateImage}
              alt=""
              aria-hidden="true"
              className="refined-alternate-image"
              loading="eager"
            />
          )}
          <span className="photo-count">{product.images.length} photos</span>
        </div>
        <div className="refined-copy">
          <span className="refined-category">{product.categoryName}</span>
          <h2 className="refined-title">{product.title}</h2>
          <p className="source-sizes">Sizes: {product.sizes.join(", ")}</p>
          <span className="refined-price">
            {formatMoney(product.price, product.currency)}
          </span>
        </div>
      </a>
    </main>
  );
}